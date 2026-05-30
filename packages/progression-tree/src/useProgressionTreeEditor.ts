import { useCallback, useMemo, useState } from 'react';
import type {
  ProgressionPoint,
  ProgressionTreeEditorOptions,
  ProgressionTreeEditorState,
  ProgressionTreeNodeLike,
} from './types';

const DEFAULT_POSITION: ProgressionPoint = { x: 0, y: 0 };

function defaultCloneNode<TNode extends ProgressionTreeNodeLike>(node: TNode): TNode {
  return { ...node };
}

function defaultGetNodeId<TNode extends ProgressionTreeNodeLike>(node: TNode): string {
  return node.id;
}

function defaultGetNodePosition<TNode extends ProgressionTreeNodeLike>(node: TNode): ProgressionPoint {
  return node.position ?? DEFAULT_POSITION;
}

export function useProgressionTreeEditor<TNode extends ProgressionTreeNodeLike>({
  nodes,
  cloneNode = defaultCloneNode,
  getNodeId = defaultGetNodeId,
  getNodePosition = defaultGetNodePosition,
}: ProgressionTreeEditorOptions<TNode>): ProgressionTreeEditorState<TNode> {
  const createEditedNodes = useCallback(() => (
    Object.fromEntries(nodes.map((node) => [getNodeId(node), cloneNode(node)])) as Record<string, TNode>
  ), [cloneNode, getNodeId, nodes]);

  const [editedNodes, setEditedNodes] = useState<Record<string, TNode>>(createEditedNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const resetEditedNodes = useCallback(() => {
    setEditedNodes(createEditedNodes());
    setSelectedNodeId((current) => current ?? (nodes[0] ? getNodeId(nodes[0]) : null));
  }, [createEditedNodes, getNodeId, nodes]);

  const getEditedNode = useCallback((nodeId: string): TNode | undefined => {
    return editedNodes[nodeId] || nodes.find((node) => getNodeId(node) === nodeId);
  }, [editedNodes, getNodeId, nodes]);

  const updateEditedNode = useCallback((nodeId: string, updater: (node: TNode) => TNode) => {
    setEditedNodes((current) => {
      const node = current[nodeId] || nodes.find((candidate) => getNodeId(candidate) === nodeId);
      if (!node) return current;

      return {
        ...current,
        [nodeId]: updater(node),
      };
    });
  }, [getNodeId, nodes]);

  const getEditedNodePosition = useCallback((nodeId: string): ProgressionPoint => {
    const node = getEditedNode(nodeId);
    return node ? getNodePosition(node) : DEFAULT_POSITION;
  }, [getEditedNode, getNodePosition]);

  const exportEditedNodes = useCallback(() => (
    nodes.map((node) => editedNodes[getNodeId(node)] || node)
  ), [editedNodes, getNodeId, nodes]);

  const exportEditedNodesJson = useCallback(() => (
    JSON.stringify(exportEditedNodes(), null, 2)
  ), [exportEditedNodes]);

  const selectedNode = useMemo(() => (
    selectedNodeId ? getEditedNode(selectedNodeId) ?? null : null
  ), [getEditedNode, selectedNodeId]);

  return {
    editedNodes,
    setEditedNodes,
    selectedNodeId,
    setSelectedNodeId,
    selectedNode,
    resetEditedNodes,
    getEditedNode,
    updateEditedNode,
    getNodePosition: getEditedNodePosition,
    exportEditedNodes,
    exportEditedNodesJson,
  };
}
