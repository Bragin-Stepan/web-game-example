import { useMemo } from 'react';
import { ProgressionPurchaseBursts } from './ProgressionPurchaseBursts';
import { ProgressionTreeLines } from './ProgressionTreeLines';
import { ProgressionTreeSurface } from './ProgressionTreeSurface';
import type { ProgressionPoint, ProgressionTreeNodeLike, ProgressionTreeProps } from './types';

const DEFAULT_POSITION: ProgressionPoint = { x: 0, y: 0 };

export function ProgressionTree<TNode extends ProgressionTreeNodeLike>({
  nodes,
  viewport,
  gridSpacing,
  nodeSize,
  getPosition = (_nodeId, node) => node?.position ?? DEFAULT_POSITION,
  getParentIds,
  isNodeVisible = (node) => node.isVisible ?? true,
  isConnectionActive,
  renderNode,
  renderOverlay,
  bursts = [],
  classNames,
  style,
}: ProgressionTreeProps<TNode>) {
  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const resolvePosition = (nodeId: string) => {
    const node = nodeById.get(nodeId);
    return getPosition(nodeId, node);
  };

  return (
    <ProgressionTreeSurface viewport={viewport} classNames={classNames} style={style}>
      <ProgressionTreeLines
        nodes={nodes}
        getParentIds={getParentIds}
        getPosition={resolvePosition}
        isNodeVisible={isNodeVisible}
        isConnectionActive={isConnectionActive}
        gridSpacing={gridSpacing}
        nodeSize={nodeSize}
      />

      {nodes.map((node) => {
        if (!isNodeVisible(node)) return null;
        const position = getPosition(node.id, node);
        const x = position.x * gridSpacing;
        const y = position.y * gridSpacing;

        return renderNode({
          node,
          position,
          x,
          y,
          hasDragged: viewport.hasDragged,
        });
      })}

      {renderOverlay}
      <ProgressionPurchaseBursts bursts={bursts} />
    </ProgressionTreeSurface>
  );
}
