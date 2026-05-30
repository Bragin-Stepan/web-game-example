import type { ProgressionPoint, ProgressionTreeEditorPanelProps, ProgressionTreeNodeLike } from './types';

const DEFAULT_POSITION: ProgressionPoint = { x: 0, y: 0 };

const DEFAULT_LABELS = {
  title: 'Tree editor',
  disabledHint: 'Enable editor mode, select a node, then adjust its position and links.',
  emptySelection: 'Select a node to edit.',
  nodeLabel: 'Node',
  positionTitle: 'Position',
  dependenciesTitle: 'Dependencies',
};

export function ProgressionTreeEditorPanel<TNode extends ProgressionTreeNodeLike>({
  nodes,
  selectedNode,
  isActive,
  getParentIds = (node) => node.parentIds ?? node.requires ?? [],
  setParentIds = (node, parentIds) => ({ ...node, parentIds }) as TNode,
  getPosition = (node) => node.position ?? DEFAULT_POSITION,
  setPosition = (node, position) => ({ ...node, position }) as TNode,
  updateNode,
  snapPosition = (value) => value,
  positionStep = 0.25,
  labels,
  classNames,
  renderExtraFields,
}: ProgressionTreeEditorPanelProps<TNode>) {
  const copy = { ...DEFAULT_LABELS, ...labels };

  if (!isActive) {
    return <div className={classNames?.hint}>{copy.disabledHint}</div>;
  }

  if (!selectedNode) {
    return <div className={classNames?.hint}>{copy.emptySelection}</div>;
  }

  const selectedParents = getParentIds(selectedNode);
  const position = getPosition(selectedNode);
  const updateSelectedNode = (updater: (node: TNode) => TNode) => updateNode(selectedNode.id, updater);

  return (
    <div className={classNames?.root}>
      <div className={classNames?.nodeId}>
        {copy.nodeLabel}: {selectedNode.id}
      </div>

      <section className={classNames?.section}>
        <div className={classNames?.sectionTitle}>{copy.positionTitle}</div>
        <div className={classNames?.fieldGrid}>
          <label className={classNames?.label}>
            X
            <input
              className={classNames?.input}
              type="number"
              step={positionStep}
              value={position.x}
              onChange={(event) => {
                const nextPosition = { ...position, x: snapPosition(Number(event.target.value)) };
                updateSelectedNode((node) => setPosition(node, nextPosition));
              }}
            />
          </label>
          <label className={classNames?.label}>
            Y
            <input
              className={classNames?.input}
              type="number"
              step={positionStep}
              value={position.y}
              onChange={(event) => {
                const nextPosition = { ...position, y: snapPosition(Number(event.target.value)) };
                updateSelectedNode((node) => setPosition(node, nextPosition));
              }}
            />
          </label>
        </div>
      </section>

      <section className={classNames?.section}>
        <div className={classNames?.sectionTitle}>{copy.dependenciesTitle}</div>
        <div className={classNames?.dependencyList}>
          {nodes
            .filter((node) => node.id !== selectedNode.id)
            .map((node) => (
              <label key={node.id} className={classNames?.dependencyLabel}>
                <input
                  type="checkbox"
                  checked={selectedParents.includes(node.id)}
                  onChange={(event) => {
                    const nextParents = event.target.checked
                      ? [...new Set([...selectedParents, node.id])]
                      : selectedParents.filter((nodeId) => nodeId !== node.id);
                    updateSelectedNode((current) => setParentIds(current, nextParents));
                  }}
                />
                <span>{node.id}</span>
              </label>
            ))}
        </div>
      </section>

      {renderExtraFields?.({ selectedNode, updateNode: updateSelectedNode })}
    </div>
  );
}
