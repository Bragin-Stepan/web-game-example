import type { KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/cn';

export type ElasticSliderProps = {
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
  min?: number;
  max?: number;
  step?: number;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function dampenOverscroll(percent: number) {
  if (percent < 0) return percent * 0.18;
  if (percent > 100) return 100 + (percent - 100) * 0.18;
  return percent;
}

function roundToStep(value: number, min: number, step: number) {
  const rounded = Math.round((value - min) / step) * step + min;
  return Number(rounded.toFixed(5));
}

function valueToPercent(value: number, min: number, max: number) {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function percentToValue(percent: number, min: number, max: number, step: number) {
  const nextValue = min + ((max - min) * percent) / 100;
  return clamp(roundToStep(nextValue, min, step), min, max);
}

export function ElasticSlider({
  value,
  onChange,
  ariaLabel,
  min = 0,
  max = 100,
  step = 1,
  leftIcon,
  rightIcon,
  className = '',
}: ElasticSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [visualPercent, setVisualPercent] = useState(() => valueToPercent(value, min, max));
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
    if (!isDragging) {
      setVisualPercent(valueToPercent(value, min, max));
    }
  }, [isDragging, max, min, value]);

  const filledPercent = clamp(visualPercent, 0, 100);
  const overscroll = visualPercent < 0 ? visualPercent : Math.max(0, visualPercent - 100);
  const trackStretch = 1 + Math.min(Math.abs(overscroll), 18) / 100;
  const trackOffset = overscroll === 0 ? 0 : Math.sign(overscroll) * Math.min(Math.abs(overscroll), 18) * 0.28;
  const valuePercent = useMemo(() => clamp(valueToPercent(value, min, max), 0, 100), [max, min, value]);

  const updateFromPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;

    const rawPercent = ((clientX - rect.left) / rect.width) * 100;
    const clampedPercent = clamp(rawPercent, 0, 100);
    const nextValue = percentToValue(clampedPercent, min, max, step);
    valueRef.current = nextValue;
    setVisualPercent(dampenOverscroll(rawPercent));
    onChange(nextValue);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    updateFromPointer(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromPointer(event.clientX);
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
    setVisualPercent(valueToPercent(valueRef.current, min, max));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const largeStep = step * 10;
    let nextValue: number | null = null;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      nextValue = value - step;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      nextValue = value + step;
    } else if (event.key === 'PageDown') {
      nextValue = value - largeStep;
    } else if (event.key === 'PageUp') {
      nextValue = value + largeStep;
    } else if (event.key === 'Home') {
      nextValue = min;
    } else if (event.key === 'End') {
      nextValue = max;
    }

    if (nextValue === null) return;
    event.preventDefault();
    const normalizedValue = clamp(roundToStep(nextValue, min, step), min, max);
    valueRef.current = normalizedValue;
    setVisualPercent(valueToPercent(normalizedValue, min, max));
    onChange(normalizedValue);
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${Math.round(valuePercent)}%`}
      className={cn(
        'group flex h-8 touch-none items-center gap-2 rounded-lg outline-none',
        'focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100',
        className,
      )}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      {leftIcon ? <span className="grid h-6 w-6 shrink-0 place-items-center text-neutral-700">{leftIcon}</span> : null}
      <motion.div
        ref={trackRef}
        className="relative h-2 min-w-0 flex-1 rounded-full bg-neutral-300"
        style={{ transformOrigin: overscroll < 0 ? 'right center' : 'left center' }}
        animate={{ scaleX: trackStretch, x: trackOffset }}
        transition={{ type: 'spring', stiffness: 440, damping: 28, mass: 0.45 }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-neutral-950"
          animate={{ width: `${filledPercent}%` }}
          transition={{ type: 'spring', stiffness: 520, damping: 34, mass: 0.35 }}
        />
        <motion.span
          className="absolute top-1/2 h-5 w-5 rounded-full border-2 border-slate-300 bg-white shadow-sm"
          animate={{ left: `${filledPercent}%`, scale: isDragging ? 1.12 : 1, x: '-50%', y: '-50%' }}
          transition={{ type: 'spring', stiffness: 520, damping: 24, mass: 0.35 }}
        />
      </motion.div>
      {rightIcon ? <span className="grid h-6 w-6 shrink-0 place-items-center text-neutral-700">{rightIcon}</span> : null}
    </div>
  );
}
