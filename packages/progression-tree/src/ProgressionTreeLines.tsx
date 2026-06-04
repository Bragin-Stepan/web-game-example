import { useMemo } from 'react';
import type { ProgressionPoint, ProgressionTreeNodeLike } from './types';

export type ProgressionTreeLinesProps<TNode extends ProgressionTreeNodeLike> = {
  nodes: TNode[];
  getParentIds?: (node: TNode) => string[];
  getPosition: (nodeId: string) => ProgressionPoint;
  isNodeVisible?: (node: TNode) => boolean;
  isConnectionActive?: (node: TNode) => boolean;
  gridSpacing: number;
  nodeSize: number;
  activeStroke?: string;
  inactiveStroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  className?: string;
  lineClassName?: string;
};

export function ProgressionTreeLines<TNode extends ProgressionTreeNodeLike>({
  nodes,
  getParentIds = (node) => node.parentIds ?? node.requires ?? [],
  getPosition,
  isNodeVisible = (node) => node.isVisible ?? true,
  isConnectionActive = (node) => Boolean(node.isUnlocked || node.canUnlock),
  gridSpacing,
  nodeSize,
  activeStroke = '#f5c46b',
  inactiveStroke = 'rgba(255, 255, 255, 0.18)',
  strokeWidth = 2,
  strokeDasharray = '4 4',
  className = 'pointer-events-none absolute z-0',
  lineClassName = 'transition-colors duration-300',
}: ProgressionTreeLinesProps<TNode>) {
  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  return (
    <svg className={className} style={{ overflow: 'visible', width: 1, height: 1 }}>
      {nodes.map((node) => {
        if (!isNodeVisible(node)) return null;
        const parentIds = getParentIds(node);
        if (parentIds.length === 0) return null;

        return parentIds.map((parentId) => {
          const parent = nodeById.get(parentId);
          if (!parent || !isNodeVisible(parent)) return null;

          const startPosition = getPosition(parent.id);
          const endPosition = getPosition(node.id);
          const startX = startPosition.x * gridSpacing;
          const startY = startPosition.y * gridSpacing;
          const endX = endPosition.x * gridSpacing;
          const endY = endPosition.y * gridSpacing;
          const dx = endX - startX;
          const dy = endY - startY;
          const len = Math.sqrt(dx * dx + dy * dy);

          if (len < nodeSize) return null;

          const halfNode = nodeSize / 2;
          const edgeOffset = Math.min(
            Math.abs(dx) > 0 ? halfNode / Math.abs(dx / len) : Number.POSITIVE_INFINITY,
            Math.abs(dy) > 0 ? halfNode / Math.abs(dy / len) : Number.POSITIVE_INFINITY,
          );
          const lineOffset = edgeOffset + 3;
          const offsetX = (dx / len) * lineOffset;
          const offsetY = (dy / len) * lineOffset;

          return (
            <line
              key={`${parentId}-${node.id}`}
              x1={startX + offsetX}
              y1={startY + offsetY}
              x2={endX - offsetX}
              y2={endY - offsetY}
              stroke={isConnectionActive(node) ? activeStroke : inactiveStroke}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className={lineClassName}
            />
          );
        });
      })}
    </svg>
  );
}
