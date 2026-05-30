import type { ProgressionTreeSurfaceProps } from './types';

export function ProgressionTreeSurface({
  viewport,
  classNames,
  style,
  children,
}: ProgressionTreeSurfaceProps) {
  const content = typeof children === 'function'
    ? children({
        pan: viewport.pan,
        zoom: viewport.zoom,
        isPanning: viewport.isPanning.current,
        hasDragged: viewport.hasDragged,
      })
    : children;

  return (
    <div
      className={classNames?.surface ?? 'relative h-full w-full overflow-hidden'}
      style={{ cursor: viewport.isPanning.current ? 'grabbing' : 'grab', ...style }}
      onPointerDown={viewport.handlers.onPointerDown}
      onPointerMove={viewport.handlers.onPointerMove}
      onPointerUp={viewport.handlers.onPointerUp}
      onPointerCancel={viewport.handlers.onPointerCancel}
      onWheel={viewport.handlers.onWheel}
      onTouchStart={viewport.handlers.onTouchStart}
      onTouchMove={viewport.handlers.onTouchMove}
      onTouchEnd={viewport.handlers.onTouchEnd}
    >
      <div
        className={classNames?.transform ?? 'absolute left-1/2 top-1/2'}
        style={{
          transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {content}
      </div>
    </div>
  );
}
