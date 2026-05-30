import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const contentPath = join(process.cwd(), 'src/content/packs/default/content.json');
const content = JSON.parse(readFileSync(contentPath, 'utf8'));
const errors = [];

function fail(message) {
  errors.push(message);
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

if (!isObject(content)) fail('content root must be an object');
if (typeof content.id !== 'string' || content.id.length === 0) fail('content.id must be a non-empty string');
if (!Array.isArray(content.resources)) fail('content.resources must be an array');
if (!Array.isArray(content.progressionNodes)) fail('content.progressionNodes must be an array');

const resourceIds = new Set();
for (const resource of content.resources ?? []) {
  if (!isObject(resource)) {
    fail('resource entry must be an object');
    continue;
  }
  if (typeof resource.id !== 'string' || resource.id.length === 0) {
    fail('resource.id must be a non-empty string');
    continue;
  }
  if (resourceIds.has(resource.id)) fail(`duplicate resource id: ${resource.id}`);
  resourceIds.add(resource.id);
  if (typeof resource.title !== 'string' || resource.title.length === 0) {
    fail(`resource ${resource.id} title must be a non-empty string`);
  }
}

const nodeIds = new Set();
const nodeById = new Map();
for (const node of content.progressionNodes ?? []) {
  if (!isObject(node)) {
    fail('progression node entry must be an object');
    continue;
  }
  if (typeof node.id !== 'string' || node.id.length === 0) {
    fail('progression node id must be a non-empty string');
    continue;
  }
  if (nodeIds.has(node.id)) fail(`duplicate progression node id: ${node.id}`);
  nodeIds.add(node.id);
  nodeById.set(node.id, node);

  if (typeof node.title !== 'string' || node.title.length === 0) fail(`node ${node.id} title is required`);
  if (typeof node.description !== 'string') fail(`node ${node.id} description must be a string`);
  if (!isObject(node.position)) fail(`node ${node.id} position must be an object`);
  if (!Number.isFinite(node.position?.x) || !Number.isFinite(node.position?.y)) {
    fail(`node ${node.id} position.x/y must be numbers`);
  }
  if (!Array.isArray(node.parentIds)) fail(`node ${node.id} parentIds must be an array`);
  if (!isObject(node.cost)) fail(`node ${node.id} cost must be an object`);
  for (const [resourceId, amount] of Object.entries(node.cost ?? {})) {
    if (!resourceIds.has(resourceId)) fail(`node ${node.id} cost references missing resource: ${resourceId}`);
    if (!Number.isFinite(amount) || amount < 0) fail(`node ${node.id} cost.${resourceId} must be a non-negative number`);
  }
  if (!isObject(node.rewards)) fail(`node ${node.id} rewards must be an object`);
}

for (const node of content.progressionNodes ?? []) {
  if (!isObject(node) || typeof node.id !== 'string') continue;
  for (const parentId of node.parentIds ?? []) {
    if (!nodeIds.has(parentId)) fail(`node ${node.id} references missing parent: ${parentId}`);
  }
}

const visiting = new Set();
const visited = new Set();

function visit(nodeId, path = []) {
  if (visited.has(nodeId)) return;
  if (visiting.has(nodeId)) {
    fail(`progression cycle detected: ${[...path, nodeId].join(' -> ')}`);
    return;
  }

  visiting.add(nodeId);
  const node = nodeById.get(nodeId);
  for (const parentId of node?.parentIds ?? []) {
    visit(parentId, [...path, nodeId]);
  }
  visiting.delete(nodeId);
  visited.add(nodeId);
}

for (const nodeId of nodeIds) {
  visit(nodeId);
}

if (errors.length > 0) {
  console.error('Content validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('Content validation passed.');
}
