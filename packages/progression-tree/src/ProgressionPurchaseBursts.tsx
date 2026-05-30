import type { ProgressionPurchaseBurst } from './types';

export type ProgressionPurchaseBurstsProps = {
  bursts: ProgressionPurchaseBurst[];
  particleCount?: number;
  radius?: number;
  className?: string;
  burstClassName?: string;
  particleClassName?: string;
  hueForParticle?: (index: number) => string;
};

export function ProgressionPurchaseBursts({
  bursts,
  particleCount = 10,
  radius = 42,
  className = 'pointer-events-none absolute inset-0 z-30 overflow-visible',
  burstClassName = 'purchase-fx-burst',
  particleClassName = 'purchase-fx-particle',
  hueForParticle = (index) => (index % 2 === 0 ? '70' : '48'),
}: ProgressionPurchaseBurstsProps) {
  return (
    <div className={className}>
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className={burstClassName}
          style={{ left: burst.x, top: burst.y }}
        >
          {Array.from({ length: particleCount }).map((_, index) => (
            <span
              key={index}
              className={particleClassName}
              style={{
                ['--tx' as never]: `${Math.cos((index / particleCount) * Math.PI * 2) * radius}px`,
                ['--ty' as never]: `${Math.sin((index / particleCount) * Math.PI * 2) * radius}px`,
                ['--delay' as never]: `${index * 22}ms`,
                ['--hue' as never]: hueForParticle(index),
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
