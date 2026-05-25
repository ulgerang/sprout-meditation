import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';

const baseUrl = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:5173/';
const outDir = process.env.SMOKE_OUT_DIR ?? 'var/smoke';
const snapChromium = '/snap/chromium/current/usr/lib/chromium-browser/chrome';
const chromiumBin = process.env.CHROMIUM_BIN ?? (existsSync(snapChromium) ? snapChromium : '/snap/bin/chromium');
const port = Number(process.env.CDP_PORT ?? 9400 + Math.floor(Math.random() * 400));
const userDataDir = path.join('/tmp', `sprout-meditation-smoke-${process.pid}`);

const chrome = spawn(chromiumBin, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--remote-debugging-address=127.0.0.1',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  '--window-size=390,844',
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

const browserErrors = [];
chrome.stderr.on('data', (chunk) => {
  const text = chunk.toString();
  if (!text.includes('dbus') && !text.includes('DevTools listening')) {
    browserErrors.push(text.trim());
  }
});

const cleanup = () => {
  if (!chrome.killed) chrome.kill('SIGTERM');
};
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});

async function waitForDebugger() {
  for (let i = 0; i < 150; i += 1) {
    if (chrome.exitCode !== null) {
      throw new Error(`Chromium exited before DevTools started. ${browserErrors.join('\n')}`);
    }
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return response.json();
    } catch {
      // Chrome is still starting.
    }
    await delay(100);
  }
  throw new Error(`Chromium DevTools endpoint did not start on ${port}. ${browserErrors.join('\n')}`);
}

async function createPage() {
  const encodedUrl = encodeURIComponent('about:blank');
  let response = await fetch(`http://127.0.0.1:${port}/json/new?${encodedUrl}`, { method: 'PUT' });
  if (!response.ok) {
    response = await fetch(`http://127.0.0.1:${port}/json/new?${encodedUrl}`);
  }
  if (!response.ok) throw new Error(`Could not create page: ${response.status}`);
  return response.json();
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.addEventListener('open', () => resolve(ws), { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
}

await mkdir(outDir, { recursive: true });
await waitForDebugger();
const page = await createPage();
const ws = await connect(page.webSocketDebuggerUrl);
let commandId = 0;
const pending = new Map();
const consoleErrors = [];

ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(`${message.error.message}: ${message.error.data ?? ''}`));
    else resolve(message.result ?? {});
    return;
  }

  if (message.method === 'Runtime.consoleAPICalled' && ['error', 'assert'].includes(message.params.type)) {
    consoleErrors.push(message.params.args.map((arg) => arg.value ?? arg.description).join(' '));
  }
  if (message.method === 'Runtime.exceptionThrown') {
    consoleErrors.push(message.params.exceptionDetails.text);
  }
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
    consoleErrors.push(message.params.entry.text);
  }
});

function send(method, params = {}) {
  const id = ++commandId;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });
}

async function evaluate(expression, awaitPromise = false) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }
  return result.result?.value;
}

async function waitForApp() {
  await send('Page.navigate', { url: baseUrl });
  await delay(1500);
  await evaluate(`document.fonts ? document.fonts.ready.then(() => true) : true`, true);
  await delay(300);
}

async function screenshot(name) {
  const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(path.join(outDir, name), Buffer.from(result.data, 'base64'));
}

async function expectText(text) {
  const found = await evaluate(
    `document.body.innerText.toLowerCase().includes(${JSON.stringify(text.toLowerCase())})`,
  );
  if (!found) throw new Error(`Expected visible text: ${text}`);
}

async function clickByText(text) {
  const clicked = await evaluate(`
    (() => {
      const needle = ${JSON.stringify(text.toLowerCase())};
      const target = [...document.querySelectorAll('button')]
        .find((button) => button.innerText.toLowerCase().includes(needle));
      if (!target) return false;
      target.click();
      return true;
    })()
  `);
  if (!clicked) throw new Error(`Could not click button containing: ${text}`);
  await delay(500);
}

async function expectSettingsPhoneWidth() {
  const metrics = await evaluate(`
    (() => {
      const main = document.querySelector('main');
      if (!main || !document.body.innerText.includes('Backup & Restore')) return null;
      const rect = main.getBoundingClientRect();
      return {
        width: Math.round(rect.width),
        left: Math.round(rect.left),
        right: Math.round(window.innerWidth - rect.right),
        viewport: window.innerWidth,
      };
    })()
  `);

  if (!metrics) throw new Error('Could not measure settings layout');
  const isPhoneWidth = metrics.width <= 448;
  const isCentered = Math.abs(metrics.left - metrics.right) <= 2;
  if (!isPhoneWidth || !isCentered) {
    throw new Error(`Settings layout is not phone-width centered: ${JSON.stringify(metrics)}`);
  }
}

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });

  await waitForApp();
  await expectText('Meditation');
  await expectText('Start');
  await screenshot('01-home-mobile.png');

  await clickByText('Start');
  await expectText('Pause');
  await screenshot('02-active-session-mobile.png');

  await clickByText('Pause');
  await expectText('Paused');
  await expectText('Resume');

  await clickByText('Resume');
  await expectText('Pause');

  await clickByText('Exit');
  await expectText('Meditation');

  await clickByText('Stats');
  await expectText('Statistics');
  await screenshot('03-stats-mobile.png');

  await clickByText('Guide');
  await expectText('The Art of');

  await clickByText('Settings');
  await expectText('Backup & Restore');
  await screenshot('04-settings-mobile.png');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await delay(300);
  await expectSettingsPhoneWidth();
  await screenshot('05-settings-desktop.png');

  if (consoleErrors.length > 0) {
    throw new Error(`Console errors detected:\n${consoleErrors.join('\n')}`);
  }

  console.log(`Smoke passed for ${baseUrl}`);
  console.log(`Screenshots written to ${outDir}`);
} finally {
  ws.close();
  cleanup();
}
