export type ResourceBarItem = {
  id: string;
  label: string;
  value: number | string;
  accent?: string;
};

export type ResourceBarProps = {
  items: ResourceBarItem[];
};

export function ResourceBar({ items }: ResourceBarProps) {
  return (
    <div className="ui-resource-bar">
      {items.map((item) => (
        <div key={item.id} className="ui-resource-chip" style={{ ['--accent' as never]: item.accent ?? '#38bdf8' }}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
