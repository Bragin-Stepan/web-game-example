import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { chromium } from '@playwright/test';

const HOST = '127.0.0.1';
const PORT = Number(process.env.SMOKE_PORT ?? 5187);
const BASE_URL = `http://${HOST}:${PORT}`;
const require = createRequire(import.meta.url);
const viteBin = join(dirname(require.resolve('vite/package.json')), 'bin/vite.js');

let server;
let browser;

try {
  server = spawn(
    process.execPath,
    [viteBin, '--host', HOST, '--port', String(PORT), '--strictPort'],
    {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        BROWSER: 'none',
      },
    },
  );

  const output = [];
  server.stdout.on('data', (chunk) => output.push(chunk.toString()));
  server.stderr.on('data', (chunk) => output.push(chunk.toString()));

  await waitForServer(BASE_URL, output);

  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.goto(BASE_URL);
  await page.waitForLoadState('load');
  await page.waitForTimeout(400);

  await expectVisible(page.locator('[data-scene="game"]'), 'game scene');

  await expectVisible(page.getByRole('button', { name: 'Настройки' }), 'settings HUD button');
  await expectVisible(page.getByRole('button', { name: 'Магазин' }), 'shop HUD button');

  await page.getByRole('button', { name: 'Настройки' }).click();
  await expectVisible(page.getByRole('heading', { name: 'Настройки' }), 'settings popup');
  await expectVisible(page.getByRole('slider', { name: /Звуки/ }), 'sound volume slider');
  await page.getByRole('button', { name: 'Следующий язык' }).click();
  await expectVisible(page.getByRole('heading', { name: 'Settings' }), 'language switch to English');
  await expectVisible(page.getByRole('slider', { name: /Sounds/ }), 'sound slider after language switch');
  await page.getByRole('slider', { name: /Sounds/ }).press('ArrowLeft');
  await page.getByRole('button', { name: 'Close' }).click();

  await page.getByRole('button', { name: 'Shop' }).click();
  await expectVisible(page.getByRole('heading', { name: 'Shop' }), 'shop popup');
  await expectText(page.locator('article'), 'Hides fullscreen interstitial ads.');
  await page.getByRole('button', { name: 'Buy' }).click();
  await expectVisible(page.getByRole('button', { name: 'Owned' }), 'browser purchase fallback');

  await page.evaluate(() => {
    window.localStorage.removeItem('core-inc.platform-purchases');
    window.localStorage.removeItem('react-pixi-idle-template.settings');
  });

  console.log('Template smoke test passed.');
} finally {
  await browser?.close().catch(() => undefined);
  if (server && !server.killed) {
    server.kill();
  }
}

async function waitForServer(url, output) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 20_000) {
    if (server.exitCode !== null) {
      throw new Error(`Vite server exited early.\n${output.join('')}`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await delay(250);
  }

  throw new Error(`Timed out waiting for ${url}.\n${output.join('')}`);
}

async function expectVisible(locator, label) {
  await locator.waitFor({ state: 'visible', timeout: 5_000 }).catch((error) => {
    throw new Error(`Expected visible ${label}: ${error.message}`);
  });
}

async function expectText(locator, text) {
  const content = await locator.innerText({ timeout: 5_000 });
  if (!content.includes(text)) {
    throw new Error(`Expected text "${text}", got:\n${content}`);
  }
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
