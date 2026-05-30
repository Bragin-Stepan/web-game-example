# @core-inc/progression-tree

Framework-light React components and hooks for reusable progression/skill trees.

The package owns generic tree mechanics:

- pan/zoom/touch viewport state;
- ready `ProgressionTree` composition for nodes, links, viewport, and purchase bursts;
- SVG dependency lines;
- purchase burst rendering;
- headless editor state via `useProgressionTreeEditor`;
- basic reusable `ProgressionTreeEditorPanel` for position/dependency editing;
- node/editor utility types;
- configurable class names and render props.

The game still owns resources, effects, localization, persistence, and command dispatch.

## Template Shape

Use the high-level tree when building a new game:

```tsx
const viewport = useProgressionTreeViewport({ minZoom: 0.6, maxZoom: 1.4 });
const editor = useProgressionTreeEditor({ nodes });

<ProgressionTree
  nodes={nodes}
  viewport={viewport}
  gridSpacing={96}
  nodeSize={72}
  getPosition={editor.getNodePosition}
  getParentIds={(node) => node.requires}
  isNodeVisible={(node) => node.isVisible}
  renderNode={({ node, x, y }) => (
    <button style={{ transform: `translate(${x}px, ${y}px)` }}>
      {node.id}
    </button>
  )}
/>;
```

Keep game rules in adapters around the package: cost calculation, purchase permission, effects,
save format, localized text, and icons. Use `ProgressionTreeEditorPanel` directly for simple
templates, or keep a game-specific editor panel and connect it to `useProgressionTreeEditor`.
