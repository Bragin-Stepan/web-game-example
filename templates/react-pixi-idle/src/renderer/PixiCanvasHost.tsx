import { useEffect, useRef } from 'react';
import { GameLoop } from '../game/GameLoop';
import { useTemplateStore } from '../game/GameStore';
import { cn } from '../ui/lib/cn';
import { PixiApp } from './PixiApp';

export type PixiCanvasHostProps = {
  className?: string;
};

export function PixiCanvasHost({ className = '' }: PixiCanvasHostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixiRef = useRef<PixiApp | null>(null);
  const loopRef = useRef<GameLoop | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mounted = true;
    const pixi = new PixiApp();

    pixi
      .init(window.innerWidth, window.innerHeight, {
        onPrimaryClick: () => {
          useTemplateStore.getState().toggleSkillTree();
        },
      })
      .then(() => {
        if (!mounted) {
          pixi.destroy();
          return;
        }

        container.appendChild(pixi.app.canvas);
        pixiRef.current = pixi;

        const loop = new GameLoop();
        loopRef.current = loop;
        loop.start((renderTimeMs) => pixi.update(useTemplateStore.getState().gameState, renderTimeMs));
      });

    const handleResize = () => {
      pixiRef.current?.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      loopRef.current?.stop();
      loopRef.current = null;
      pixiRef.current?.destroy();
      pixiRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className={cn('fixed inset-0 h-dvh w-screen', className)} />;
}
