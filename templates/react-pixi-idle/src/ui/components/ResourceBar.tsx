import { memo } from 'react';

export type ResourceBarItem = {
  id: string;
  label: string;
  value: number | string;
  accent?: string;
};

export type ResourceBarProps = {
  items: ResourceBarItem[];
};

function ResourceBarComponent({ items }: ResourceBarProps) {
  return (
    <div className="flex items-center gap-2.5 max-[620px]:order-2 max-[620px]:basis-full">
      {items.map((item) => (
        <div
          key={item.id}
          className="grid min-h-11 min-w-24 gap-0.5 rounded-lg border-2 bg-white/95 px-3 py-2 shadow-xl shadow-black/25 max-[620px]:min-w-0 max-[620px]:flex-1"
          style={{ borderColor: item.accent ?? '#d8d8d8' }}
        >
          <span className="text-[11px] font-black uppercase leading-none text-neutral-500">{item.label}</span>
          <strong className="text-lg font-black leading-none text-neutral-950">{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export const ResourceBar = memo(ResourceBarComponent);
