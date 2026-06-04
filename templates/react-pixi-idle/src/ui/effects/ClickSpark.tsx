import type { PointerEvent, ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { getRenderResolution } from '../../renderer/renderResolution';
import { cn } from '../lib/cn';

type SparkBurst = {
  x: number;
  y: number;
  startedAt: number;
};

export type ClickSparkProps = {
  children: ReactNode;
  className?: string;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  extraScale?: number;
};

export function ClickSpark({
  children,
  className = '',
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 380,
  extraScale = 1,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstsRef = useRef<SparkBurst[]>([]);
  const frameRef = useRef<number | null>(null);
  const drawFrameRef = useRef<() => void>(() => undefined);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = getRenderResolution();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }, []);

  const queueDrawFrame = useCallback(() => {
    frameRef.current = window.requestAnimationFrame(() => drawFrameRef.current());
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const now = performance.now();
    const dpr = getRenderResolution();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    burstsRef.current = burstsRef.current.filter((burst) => now - burst.startedAt < duration);

    for (const burst of burstsRef.current) {
      const progress = Math.min(1, (now - burst.startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const alpha = 1 - progress;
      const startRadius = sparkRadius * 0.2 * eased;
      const endRadius = sparkRadius * extraScale * eased;

      context.strokeStyle = sparkColor;
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.globalAlpha = alpha;

      for (let index = 0; index < sparkCount; index += 1) {
        const angle = (Math.PI * 2 * index) / sparkCount;
        const startX = burst.x + Math.cos(angle) * startRadius;
        const startY = burst.y + Math.sin(angle) * startRadius;
        const endX = burst.x + Math.cos(angle) * (endRadius + sparkSize * progress);
        const endY = burst.y + Math.sin(angle) * (endRadius + sparkSize * progress);

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
      }
    }

    context.globalAlpha = 1;

    if (burstsRef.current.length > 0) {
      queueDrawFrame();
    } else {
      frameRef.current = null;
    }
  }, [duration, extraScale, queueDrawFrame, sparkColor, sparkCount, sparkRadius, sparkSize]);

  useEffect(() => {
    drawFrameRef.current = draw;
  }, [draw]);

  const handlePointerDownCapture = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.button > 0) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      burstsRef.current.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        startedAt: performance.now(),
      });

      if (frameRef.current === null) {
        queueDrawFrame();
      }
    },
    [queueDrawFrame],
  );

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [resizeCanvas]);

  return (
    <div className={cn('relative overflow-hidden', className)} onPointerDownCapture={handlePointerDownCapture}>
      {children}
      <canvas
        ref={canvasRef}
        data-click-spark-canvas="true"
        className="pointer-events-none absolute inset-0 z-[60]"
        aria-hidden="true"
      />
    </div>
  );
}
