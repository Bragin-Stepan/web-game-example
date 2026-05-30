import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const [, , rawTarget] = process.argv;

if (!rawTarget) {
  console.error('Usage: npm run create-game -- <target-directory>');
  process.exit(1);
}

const workspaceRoot = resolve(import.meta.dirname, '..');
const templateDir = join(workspaceRoot, 'templates/react-pixi-idle');
const packagesDir = join(workspaceRoot, 'packages');
const targetDir = resolve(process.cwd(), rawTarget);

if (existsSync(targetDir)) {
  console.error(`Target already exists: ${targetDir}`);
  process.exit(1);
}

mkdirSync(targetDir, { recursive: true });
cpSync(templateDir, targetDir, {
  recursive: true,
  filter: (source) => !source.includes(`${templateDir}\\dist`) && !source.includes(`${templateDir}/dist`),
});
cpSync(packagesDir, join(targetDir, 'packages'), { recursive: true });

const packagePath = join(targetDir, 'package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const packageName = normalizePackageName(basename(targetDir));
packageJson.name = packageName;
packageJson.dependencies['@core-inc/yandex-game-kit'] = 'file:packages/yandex-game-kit';
packageJson.dependencies['@core-inc/progression-tree'] = 'file:packages/progression-tree';
writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

const indexPath = join(targetDir, 'index.html');
const displayName = toDisplayName(packageName);
const indexHtml = readFileSync(indexPath, 'utf8')
  .replace(/React Pixi Idle Template/g, displayName)
  .replace(/Minimal starter app for a browser idle game targeting Yandex Games and local browser development\./g, `${displayName} browser game`);
writeFileSync(indexPath, indexHtml);

rmSync(join(targetDir, 'node_modules'), { recursive: true, force: true });

console.log(`Created standalone game at ${targetDir}`);
console.log('');
console.log('Next steps:');
console.log(`  cd ${targetDir}`);
console.log('  npm install');
console.log('  npm run dev');
console.log('  npm run validate:content');

function normalizePackageName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9._/-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'new-web-game';
}

function toDisplayName(value) {
  return value
    .replace(/^@[^/]+\//, '')
    .split(/[-_./]+/g)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}
