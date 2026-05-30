# Content Guide

The template uses one content pack:

```text
src/content/packs/default/content.json
```

## Resources

Resources define ids and display names:

```json
{
  "id": "energy",
  "title": "Energy"
}
```

Every cost entry in progression nodes must reference an existing resource id.

The default pack intentionally includes several progression branches:

- low-cost route upgrades;
- utility/storage upgrades;
- expensive automation upgrades;
- merge nodes that require multiple branches.

This keeps the starter tree useful as a visual and data-structure example.

## Progression Nodes

```json
{
  "id": "node_core",
  "title": "Core engine",
  "description": "Starts passive energy production.",
  "cost": {
    "energy": 10
  },
  "rewards": {
    "productionPerSecond": 1
  },
  "position": { "x": 0, "y": 0 },
  "parentIds": []
}
```

Rules:

- ids must be unique;
- costs must be non-negative numbers;
- `parentIds` must reference existing nodes;
- progression dependencies must not contain cycles;
- `position.x` and `position.y` are grid coordinates, not pixels.

Run:

```bash
npm run validate:content
```
