import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const [, , rawTarget, ...rawArgs] = process.argv;

if (!rawTarget) {
  console.error('Usage: npm run create-game -- <target-directory> [--name "Game Name"] [--product-prefix game] [--storage-prefix game]');
  process.exit(1);
}

const workspaceRoot = resolve(import.meta.dirname, '..');
const templateDir = join(workspaceRoot, 'templates/react-pixi-idle');
const packagesDir = join(workspaceRoot, 'packages');
const targetDir = resolve(process.cwd(), rawTarget);
const options = parseArgs(rawArgs);
const packageName = normalizePackageName(options.packageName ?? basename(targetDir));
const displayName = options.displayName ?? toDisplayName(packageName);
const configSlug = normalizeConfigSlug(options.storagePrefix ?? packageName);
const productPrefix = normalizeConfigSlug(options.productPrefix ?? packageName).replaceAll('-', '_');

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
packageJson.name = packageName;
packageJson.dependencies['@core-inc/yandex-game-kit'] = 'file:packages/yandex-game-kit';
packageJson.dependencies['@core-inc/progression-tree'] = 'file:packages/progression-tree';
writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

const indexPath = join(targetDir, 'index.html');
const indexHtml = readFileSync(indexPath, 'utf8')
  .replace(/React Pixi Idle Template/g, displayName)
  .replace(/Minimal starter app for a browser idle game targeting Yandex Games and local browser development\./g, `${displayName} browser game`);
writeFileSync(indexPath, indexHtml);

rewriteTextFile(join(targetDir, 'src/config/settings.ts'), [
  [/react-pixi-idle-template\.settings/g, `${configSlug}.settings`],
]);

rewriteTextFile(join(targetDir, 'src/config/products.ts'), [
  [/disable_ads/g, `${productPrefix}_disable_ads`],
]);

rewriteTextFile(join(targetDir, 'README.md'), [
  [/React Pixi Idle Template/g, displayName],
]);

rmSync(join(targetDir, 'node_modules'), { recursive: true, force: true });
rmSync(join(targetDir, 'dist'), { recursive: true, force: true });

console.log(`Created standalone game at ${targetDir}`);
console.log('');
console.log(`Name: ${displayName}`);
console.log(`Package: ${packageName}`);
console.log(`Settings key: ${configSlug}.settings`);
console.log(`Remove-ads product id: ${productPrefix}_disable_ads`);
console.log('');
console.log('Next steps:');
console.log(`  cd ${targetDir}`);
console.log('  npm install');
console.log('  npm run dev');
console.log('  npm run smoke');
console.log('  npm run validate:content');

function parseArgs(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === '--name' && next) {
      parsed.displayName = next;
      index += 1;
      continue;
    }

    if (arg === '--package-name' && next) {
      parsed.packageName = next;
      index += 1;
      continue;
    }

    if (arg === '--product-prefix' && next) {
      parsed.productPrefix = next;
      index += 1;
      continue;
    }

    if (arg === '--storage-prefix' && next) {
      parsed.storagePrefix = next;
      index += 1;
      continue;
    }

    console.error(`Unknown or incomplete option: ${arg}`);
    process.exit(1);
  }
  return parsed;
}

function normalizePackageName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9._/-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'new-web-game';
}

function normalizeConfigSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9._/-]+/g, '-')
    .replace(/[/.]+/g, '-')
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

function rewriteTextFile(path, replacements) {
  let text = readFileSync(path, 'utf8');
  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }
  writeFileSync(path, text);
}
