import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const appRoot = process.cwd();
const workspaceRoot = resolve(appRoot, '../..');
const sourceRoots = [
  join(appRoot, 'src'),
  join(appRoot, 'index.html'),
  join(appRoot, 'vite.config.ts'),
  join(workspaceRoot, 'packages/yandex-game-kit/src'),
];
const violations = [];

function readText(path) {
  return readFileSync(path, 'utf8');
}

function walk(path, files = []) {
  if (!existsSync(path)) return files;
  const stat = statSync(path);
  if (stat.isFile()) {
    files.push(path);
    return files;
  }

  for (const entry of readdirSync(path)) {
    if (entry === 'node_modules' || entry === 'dist') continue;
    walk(join(path, entry), files);
  }
  return files;
}

function formatPath(file) {
  const relativeToApp = relative(appRoot, file);
  return relativeToApp.startsWith('..') ? relative(workspaceRoot, file) : relativeToApp;
}

const files = sourceRoots
  .flatMap((path) => walk(path))
  .filter((file) => /\.(html|css|ts|tsx|js|jsx)$/.test(file));

function report(file, message) {
  violations.push(`${formatPath(file)}: ${message}`);
}

for (const file of files) {
  const text = readText(file);
  if (/<audio\b/i.test(text)) report(file, 'do not use <audio>; use Web Audio API');
  if (/<video\b/i.test(text)) report(file, 'do not use <video> for game audio');
  if (/\bnew\s+Audio\s*\(/.test(text)) report(file, 'do not use new Audio(); use AudioContext');
  if (/navigator\.mediaSession/.test(text)) report(file, 'avoid Media Session API for game background music');
}

const indexHtml = readText(join(appRoot, 'index.html'));
if (!/sdk\.js/.test(indexHtml)) violations.push('index.html: Yandex SDK script is missing');
if (!/name="viewport"/.test(indexHtml)) violations.push('index.html: viewport meta is missing');

const css = readText(join(appRoot, 'src', 'index.css'));
for (const [pattern, message] of [
  [/overflow:\s*hidden/, 'global overflow hidden is missing'],
  [/touch-action:\s*none/, 'touch-action none is missing'],
  [/user-select:\s*none/, 'user-select none is missing'],
  [/overscroll-behavior:\s*none/, 'overscroll-behavior none is missing'],
]) {
  if (!pattern.test(css)) violations.push(`src/index.css: ${message}`);
}

const platformFiles = files
  .filter((file) => file.includes(`${join('packages', 'yandex-game-kit', 'src', 'platform')}`))
  .map((file) => readText(file))
  .join('\n');

for (const [pattern, message] of [
  [/LoadingAPI\.ready/, 'LoadingAPI.ready() integration is missing'],
  [/GameplayAPI\.start/, 'GameplayAPI.start() integration is missing'],
  [/GameplayAPI\.stop/, 'GameplayAPI.stop() integration is missing'],
  [/getData/, 'Yandex player.getData() integration is missing'],
  [/setData/, 'Yandex player.setData() integration is missing'],
  [/pagehide/, 'pagehide save hook is missing'],
  [/beforeunload/, 'beforeunload save hook is missing'],
]) {
  if (!pattern.test(platformFiles)) violations.push(`packages/yandex-game-kit/src/platform: ${message}`);
}

if (violations.length > 0) {
  console.error('Yandex game audit failed:\n');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  console.log('Yandex game audit passed.');
}
