import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { ROOT, writeJson } from './lib/style_library.mjs';

const VERIFY_URL = process.env.HONGBING_VERIFY_URL || 'http://127.0.0.1:4173/index.html';
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

const chromePath = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));
if (!chromePath) {
  throw new Error('Chrome/Edge executable not found for headless verification');
}

const userDataDir = path.join(ROOT, 'temp', 'chrome-headless-profile');
fs.mkdirSync(userDataDir, { recursive: true });
let chrome;
let stderr = [];
let staticServer;

async function runCase(metrics) {
  const tab = await openTab();
  const session = new CdpSession(tab.webSocketDebuggerUrl);
  await session.connect();
  const consoleMessages = [];
  const runtimeErrors = [];
  session.on('Runtime.consoleAPICalled', (event) => {
    consoleMessages.push({
      type: event.type,
      text: (event.args || []).map((arg) => arg.value ?? arg.description ?? '').join(' '),
    });
  });
  session.on('Runtime.exceptionThrown', (event) => {
    runtimeErrors.push(event.exceptionDetails?.text || event.exceptionDetails?.exception?.description || 'Runtime exception');
  });
  session.on('Log.entryAdded', (event) => {
    if (event.entry?.level === 'error') runtimeErrors.push(event.entry.text);
  });

  await session.send('Runtime.enable');
  await session.send('Log.enable');
  await session.send('Page.enable');
  await session.send('Emulation.setDeviceMetricsOverride', metrics);
  await session.send('Page.navigate', { url: VERIFY_URL });
  await waitForLoad(session);
  await delay(250);

  const evalResult = await session.send('Runtime.evaluate', {
    returnByValue: true,
    awaitPromise: true,
    expression: `(() => {
      const total = Array.isArray(CATS) ? CATS.reduce((sum, cat) => sum + (cat.entries || []).length, 0) : null;
      const outputBefore = document.getElementById('out')?.textContent || '';
      document.querySelector('.gen-btn')?.click();
      const outputAfter = document.getElementById('out')?.textContent || '';
      const style = getComputedStyle(document.querySelector('.preset-grid'));
      return {
        title: document.title,
        total,
        catCount: Array.isArray(CATS) ? CATS.length : null,
        lensChipCount: document.querySelectorAll('#lensChips .chip').length,
        presetCards: document.querySelectorAll('.preset-card').length,
        seriesChips: document.querySelectorAll('.series-chip').length,
        outputGenerated: outputAfter.includes('IDENTITY LOCK') && outputAfter.length > outputBefore.length,
        promptHas50mm: outputAfter.includes('50mm'),
        promptHasOldLens: /70mm|80mm|85mm|l_70|l_80|l_85/.test(outputAfter),
        promptHasLowAngle: /low angle upward shot|low-angle hero|low angle looking up/i.test(outputAfter),
        promptHasReferenceGate: outputAfter.includes('MANDATORY: Check for an uploaded reference photo'),
        viewport: { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth },
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 2,
        presetGridColumns: style.gridTemplateColumns,
        bodyTextSample: document.body.innerText.slice(0, 220),
      };
    })()`,
  });
  await closeTab(tab.id);
  await session.close();

  const value = evalResult.result?.value;
  if (!value) throw new Error('Headless browser evaluation returned no value');
  if (runtimeErrors.length) throw new Error(`Runtime/browser errors: ${runtimeErrors.join(' | ')}`);
  if (value.total !== 441) throw new Error(`Expected 441 visible entries, got ${value.total}`);
  if (value.catCount !== 15) throw new Error(`Expected 15 categories, got ${value.catCount}`);
  if (value.lensChipCount !== 1) throw new Error(`Expected 1 lens chip, got ${value.lensChipCount}`);
  if (!value.outputGenerated) throw new Error('Generate button did not produce an identity-lock prompt');
  if (value.promptHasOldLens) throw new Error('Generated prompt contains deprecated lens terms');
  if (value.promptHasLowAngle) throw new Error('Generated prompt contains unsafe low-angle terms');
  if (value.horizontalOverflow) throw new Error(`Viewport has horizontal overflow: ${value.viewport.scrollWidth} > ${value.viewport.width}`);

  return {
    ...value,
    consoleErrors: consoleMessages.filter((message) => message.type === 'error'),
  };
}

async function waitForDebugging() {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      await requestJson('http://127.0.0.1:9223/json/version');
      return;
    } catch {
      await delay(200);
    }
  }
  throw new Error(`Chrome debugging port did not become ready. ${stderr.join('').slice(-500)}`);
}

async function openTab() {
  return requestJson(`http://127.0.0.1:9223/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
}

async function closeTab(id) {
  try {
    await requestJson(`http://127.0.0.1:9223/json/close/${id}`);
  } catch {
    // The tab may already be closed; verification result is unaffected.
  }
}

async function waitForLoad(session) {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timed out waiting for page load')), 10000);
    session.once('Page.loadEventFired', () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

function requestJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method: options.method || 'GET' }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if ((res.statusCode || 0) >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

class CdpSession {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.buffer = Buffer.alloc(0);
  }

  async connect() {
    const { hostname, port, pathname } = new URL(this.url);
    this.socket = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname,
        port,
        path: pathname,
        headers: {
          Connection: 'Upgrade',
          Upgrade: 'websocket',
          'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
          'Sec-WebSocket-Version': '13',
        },
      });
      req.on('upgrade', (_res, socket) => resolve(socket));
      req.on('error', reject);
      req.end();
    });
    this.socket.on('data', (chunk) => this.handleData(chunk));
    this.socket.on('error', (error) => {
      for (const { reject } of this.pending.values()) reject(error);
      this.pending.clear();
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const payload = JSON.stringify({ id, method, params });
    this.socket.write(encodeFrame(payload));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        reject(new Error(`CDP method timed out: ${method}`));
      }, 10000);
    });
  }

  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(handler);
  }

  once(event, handler) {
    const wrapper = (payload) => {
      this.listeners.set(event, (this.listeners.get(event) || []).filter((item) => item !== wrapper));
      handler(payload);
    };
    this.on(event, wrapper);
  }

  async close() {
    this.socket?.end();
  }

  handleData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= 2) {
      const frame = decodeFrame(this.buffer);
      if (!frame) return;
      this.buffer = this.buffer.subarray(frame.length);
      if (!frame.text) continue;
      const message = JSON.parse(frame.text);
      if (message.id && this.pending.has(message.id)) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(JSON.stringify(message.error)));
        else pending.resolve(message.result || {});
      } else if (message.method && this.listeners.has(message.method)) {
        for (const handler of this.listeners.get(message.method)) handler(message.params || {});
      }
    }
  }
}

function encodeFrame(text) {
  const payload = Buffer.from(text);
  const header = [];
  header.push(0x81);
  if (payload.length < 126) {
    header.push(0x80 | payload.length);
  } else if (payload.length < 65536) {
    header.push(0x80 | 126, (payload.length >> 8) & 255, payload.length & 255);
  } else {
    throw new Error('CDP payload too large');
  }
  const mask = Buffer.from([1, 2, 3, 4]);
  const masked = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i += 1) masked[i] = payload[i] ^ mask[i % 4];
  return Buffer.concat([Buffer.from(header), mask, masked]);
}

function decodeFrame(buffer) {
  const first = buffer[0];
  const second = buffer[1];
  let offset = 2;
  let length = second & 0x7f;
  if (length === 126) {
    if (buffer.length < 4) return null;
    length = buffer.readUInt16BE(2);
    offset = 4;
  } else if (length === 127) {
    throw new Error('Large websocket frames are not supported in verifier');
  }
  const masked = Boolean(second & 0x80);
  let mask;
  if (masked) {
    if (buffer.length < offset + 4) return null;
    mask = buffer.subarray(offset, offset + 4);
    offset += 4;
  }
  if (buffer.length < offset + length) return null;
  let payload = buffer.subarray(offset, offset + length);
  if (masked) {
    const unmasked = Buffer.alloc(payload.length);
    for (let i = 0; i < payload.length; i += 1) unmasked[i] = payload[i] ^ mask[i % 4];
    payload = unmasked;
  }
  return {
    length: offset + length,
    text: first === 0x81 ? payload.toString('utf8') : '',
  };
}

async function main() {
  staticServer = await startStaticServer();
  chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=9223',
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  stderr = [];
  chrome.stderr.on('data', (chunk) => stderr.push(String(chunk)));

  try {
    await waitForDebugging();
    const desktop = await runCase({ width: 1366, height: 900, deviceScaleFactor: 1, mobile: false });
    const mobile = await runCase({ width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    const result = {
      ok: true,
      generated_at: new Date().toISOString(),
      chrome_path: chromePath,
      url: VERIFY_URL,
      desktop,
      mobile,
    };
    writeJson(path.join(ROOT, 'temp', 'headless_browser_verification_20260523.json'), result);
    console.log(JSON.stringify(result, null, 2));
  } finally {
    chrome?.kill();
    staticServer?.close();
  }
}

function startStaticServer() {
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
  };
  const server = http.createServer((req, res) => {
    const parsed = new URL(req.url || '/', 'http://127.0.0.1:4173');
    if (parsed.pathname === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    const rawPath = parsed.pathname === '/' ? '/index.html' : parsed.pathname;
    const target = path.resolve(ROOT, decodeURIComponent(rawPath.slice(1)));
    if (!target.startsWith(ROOT)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(target, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(4173, '127.0.0.1', () => resolve(server));
  });
}

main().catch((error) => {
  chrome?.kill();
  staticServer?.close();
  console.error(error);
  process.exit(1);
});
