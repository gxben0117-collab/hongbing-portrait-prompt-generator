import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { ROOT, HTML_PATH, writeJson } from './lib/style_library.mjs';

const html = fs.readFileSync(HTML_PATH, 'utf8');
const promptGovernance = fs.readFileSync(path.join(ROOT, 'prompt_governance.js'), 'utf8');
const core = fs.readFileSync(path.join(ROOT, 'core.js'), 'utf8');
const inlineMatch = html.match(/<script>\s*(\/\/ ═+[\s\S]*?)<\/script>\s*<\/body>/);
if (!inlineMatch) throw new Error('Cannot find inline CATS/state script in index.html');
const inlineScript = inlineMatch[1];

let activeContext = null;

class FakeClassList {
  constructor(initial = '') {
    this.values = new Set(String(initial).split(/\s+/).filter(Boolean));
  }
  add(value) { this.values.add(value); }
  remove(value) { this.values.delete(value); }
  toggle(value) {
    if (this.values.has(value)) {
      this.values.delete(value);
      return false;
    }
    this.values.add(value);
    return true;
  }
  contains(value) { return this.values.has(value); }
  toString() { return [...this.values].join(' '); }
}

class FakeElement {
  constructor(id = '', attrs = {}) {
    this.id = id;
    this.attrs = { ...attrs };
    this.style = {};
    this.classList = new FakeClassList(attrs.class || '');
    this.children = [];
    this.dataset = {};
    this.value = '';
    this.textContent = '';
    this._innerHTML = '';
    this.listeners = new Map();
    this.tagName = 'DIV';
    this.kind = attrs.kind || '';
    this.onclickAttr = attrs.onclick || '';
    if (attrs['data-series-id']) this.dataset.seriesId = decodeHtml(attrs['data-series-id']);
    if (attrs.onclick?.includes('selEntry')) this.dataset.entryId = (attrs.onclick.match(/selEntry\('([^']+)'\)/) || [])[1] || '';
  }
  set innerHTML(value) {
    this._innerHTML = String(value || '');
    this.children = parseChildren(this.id, this._innerHTML);
    this.textContent = stripTags(this._innerHTML);
  }
  get innerHTML() { return this._innerHTML; }
  setAttribute(name, value) { this.attrs[name] = String(value); }
  getAttribute(name) { return this.attrs[name] ?? null; }
  querySelectorAll(selector) {
    if (selector === '.series-chip') return this.children.filter((child) => child.classList.contains('series-chip'));
    if (selector === '.chip') return this.children.filter((child) => child.classList.contains('chip'));
    if (selector === '.preset-card') return this.children.filter((child) => child.classList.contains('preset-card'));
    return [];
  }
  addEventListener(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(handler);
  }
  dispatchEvent(event) {
    event.target ||= this;
    for (const handler of this.listeners.get(event.type) || []) handler(event);
    if (event.bubbles && activeContext?.document?.dispatchEvent) activeContext.document.dispatchEvent(event);
    return true;
  }
  click() {
    if (this.onclickAttr && activeContext) vm.runInContext(this.onclickAttr, activeContext, { timeout: 1000 });
    for (const handler of this.listeners.get('click') || []) handler({ type: 'click', target: this });
  }
  closest(selector) {
    if (selector === '[role="button"][tabindex="0"]' && this.attrs.role === 'button' && this.attrs.tabindex === '0') return this;
    return null;
  }
  scrollIntoView() {}
  focus() {}
  select() {}
}

function parseChildren(id, htmlText) {
  if (id === 'seriesFilter') {
    return [...htmlText.matchAll(/<div\s+([^>]*class="[^"]*series-chip[^"]*"[^>]*)>([\s\S]*?)<\/div>/g)].map((match) => {
      const attrs = parseAttrs(match[1]);
      const el = new FakeElement('', { ...attrs, kind: 'series' });
      el.textContent = stripTags(match[2]);
      return el;
    });
  }
  if (id === 'presetGrid') {
    return [...htmlText.matchAll(/<div\s+([^>]*class="[^"]*preset-card[^"]*"[^>]*)>([\s\S]*?)<\/div>/g)].map((match) => {
      const attrs = parseAttrs(match[1]);
      const el = new FakeElement('', { ...attrs, kind: 'preset' });
      el.textContent = stripTags(match[2]);
      return el;
    });
  }
  if (id === 'catStrip') {
    return [...htmlText.matchAll(/<div\s+([^>]*class="[^"]*cat-pill[^"]*"[^>]*)>([\s\S]*?)<\/div>/g)].map((match) => {
      const attrs = parseAttrs(match[1]);
      const el = new FakeElement('', { ...attrs, kind: 'cat' });
      el.textContent = stripTags(match[2]);
      return el;
    });
  }
  return [...htmlText.matchAll(/<div\s+([^>]*class="[^"]*chip[^"]*"[^>]*)>([\s\S]*?)<\/div>/g)].map((match) => {
    const attrs = parseAttrs(match[1]);
    const el = new FakeElement('', { ...attrs, kind: 'chip' });
    el.textContent = stripTags(match[2]);
    return el;
  });
}

function parseAttrs(value) {
  const attrs = {};
  for (const match of String(value || '').matchAll(/([\w:-]+)="([^"]*)"/g)) {
    attrs[match[1]] = decodeHtml(match[2]);
  }
  return attrs;
}

function stripTags(value) {
  return String(value || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&#96;/g, '`')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

function createHarness(width, height) {
  const ids = [
    'ratioChips', 'lensChips', 'lightChips', 'atmChips', 'identityChips', 'camLangChips',
    'catStrip', 'catCountMeta', 'seriesFilter', 'presetCountMeta', 'presetGrid',
    'mkChips', 'angChips', 'selBadgeSec', 'selBadge', 'randLabel',
    'out', 'outputShell', 'charCount', 'outActions', 'copyBtn',
    'faceDesc', 'proShot', 'proAction', 'proCustom', 'txtLine', 'extras',
    'proToggle', 'proBody', 'totalEntryCount',
  ];
  const elements = new Map(ids.map((id) => [id, new FakeElement(id)]));
  elements.get('out').textContent = '選好風格和場景後，點「產出咒語 + 複製咒語」即可獲得完整英文 prompt。';
  elements.get('proToggle').attrs.role = 'button';
  elements.get('proToggle').attrs.tabindex = '0';
  elements.get('proToggle').attrs['aria-expanded'] = 'false';
  elements.get('proBody').classList = new FakeClassList('');

  const listeners = new Map();
  const fakeDocument = {
    __hongbingKeyboardActivation: false,
    title: '紅兵風格寫真咒語產生器',
    documentElement: { scrollWidth: width },
    body: {
      innerText: '',
      appendChild() {},
      removeChild() {},
    },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new FakeElement(id));
      return elements.get(id);
    },
    querySelector(selector) {
      if (selector === '.cat-pill.active') return elements.get('catStrip').children.find((child) => child.classList.contains('active')) || null;
      if (selector === '.preset-card.active') return elements.get('presetGrid').children.find((child) => child.classList.contains('active')) || null;
      if (selector === '.preset-grid') return elements.get('presetGrid');
      const attrMatch = selector.match(/^#(\w+) \.chip\[onclick="([^"]+)"\]$/);
      if (attrMatch) {
        return elements.get(attrMatch[1])?.children.find((child) => child.onclickAttr === attrMatch[2]) || null;
      }
      const presetMatch = selector.match(/^\.preset-card\[onclick="([^"]+)"\]$/);
      if (presetMatch) {
        return elements.get('presetGrid').children.find((child) => child.onclickAttr === presetMatch[1]) || null;
      }
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '.preset-card') return elements.get('presetGrid').children;
      if (selector === '.series-chip') return elements.get('seriesFilter').children;
      if (selector === '[role="button"][tabindex="0"]') return allRendered(elements).filter((el) => el.attrs.role === 'button' && el.attrs.tabindex === '0');
      if (selector === '[aria-pressed]') return allRendered(elements).filter((el) => Object.hasOwn(el.attrs, 'aria-pressed'));
      const chipMatch = selector.match(/^#(\w+) \.chip$/);
      if (chipMatch) return elements.get(chipMatch[1])?.children || [];
      return [];
    },
    createElement(id) { return new FakeElement(id); },
    execCommand() { return true; },
    addEventListener(event, handler) {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event).push(handler);
    },
    dispatchEvent(event) {
      for (const handler of listeners.get(event.type) || []) handler(event);
    },
  };

  const context = {
    window: {
      innerWidth: width,
      innerHeight: height,
      scrollTo() {},
      getComputedStyle() {
        return { gridTemplateColumns: width < 700 ? '390px' : '320px 320px 320px' };
      },
    },
    document: fakeDocument,
    innerWidth: width,
    innerHeight: height,
    navigator: {
      clipboard: { writeText: async () => {} },
    },
    KeyboardEvent: class {
      constructor(type, options = {}) {
        this.type = type;
        this.key = options.key;
        this.bubbles = Boolean(options.bubbles);
        this.target = null;
      }
      preventDefault() { this.defaultPrevented = true; }
    },
    console,
    setTimeout(fn) { fn(); return 1; },
    clearTimeout() {},
  };
  context.window.window = context.window;
  context.window.document = fakeDocument;
  context.window.navigator = context.navigator;
  context.window.KeyboardEvent = context.KeyboardEvent;
  context.window.getComputedStyle = context.window.getComputedStyle;
  return { context, elements, width, height };
}

function allRendered(elements) {
  return [...elements.values(), ...[...elements.values()].flatMap((el) => el.children || [])];
}

function runCase(caseName, width, height) {
  const harness = createHarness(width, height);
  activeContext = vm.createContext(harness.context);
  const verifyCode = `
    const runtimeErrors = [];
    renderAll();
    const total = Array.isArray(CATS) ? CATS.reduce((sum, cat) => sum + (cat.entries || []).length, 0) : null;
    const catCount = Array.isArray(CATS) ? CATS.length : null;
    const outputBefore = document.getElementById('out').textContent || '';
    generate(true);
    const outputAfter = document.getElementById('out').textContent || '';
    const activePresetBefore = document.querySelector('.preset-card.active')?.textContent || '';
    const inactivePreset = [...document.querySelectorAll('.preset-card')].find((card) => !card.classList.contains('active'));
    inactivePreset?.focus();
    inactivePreset?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    const activePresetAfter = document.querySelector('.preset-card.active')?.textContent || '';
    const proToggle = document.getElementById('proToggle');
    const proExpandedBefore = proToggle?.getAttribute('aria-expanded');
    togglePro();
    const proExpandedAfter = proToggle?.getAttribute('aria-expanded');
    const targetCat = CATS.find(c => c.id === 'theme_13');
    selCat('theme_13');
    const theme13All = document.querySelectorAll('.preset-card').length;
    const firstSeries = getSeriesOptions(targetCat)[0]?.[0] || '__all';
    selSeries(firstSeries);
    const theme13Filtered = document.querySelectorAll('.preset-card').length;
    const randomResult = doRandom(true);
    globalThis.__VERIFY_RESULT__ = {
      title: document.title,
      total,
      catCount,
      lensChipCount: document.querySelectorAll('#lensChips .chip').length,
      presetCards: document.querySelectorAll('.preset-card').length,
      seriesChips: document.querySelectorAll('.series-chip').length,
      focusableControlCount: document.querySelectorAll('[role="button"][tabindex="0"]').length,
      ariaPressedCount: document.querySelectorAll('[aria-pressed]').length,
      keyboardPresetChanged: Boolean(inactivePreset) && activePresetBefore !== activePresetAfter,
      proToggleKeyboardWorks: proExpandedBefore !== proExpandedAfter && proExpandedAfter === 'true',
      outputGenerated: outputAfter.includes('IDENTITY LOCK') && outputAfter.length > outputBefore.length,
      promptHas50mm: outputAfter.includes('50mm'),
      promptHasOldLens: /70mm|80mm|85mm|l_70|l_80|l_85/.test(outputAfter),
      promptHasLowAngle: /low angle upward shot|low-angle hero|low angle looking up/i.test(outputAfter),
      promptHasReferenceGate: outputAfter.includes('MANDATORY: Check for an uploaded reference photo'),
      viewport: { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth },
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 2,
      presetGridColumns: window.getComputedStyle(document.querySelector('.preset-grid')).gridTemplateColumns,
      bodyTextSample: document.body.innerText.slice(0, 220),
      theme13All,
      firstSeries,
      theme13Filtered,
      randomCat: randomResult.cat.id,
      randomEntry: randomResult.entry.id,
      runtimeErrors,
    };
  `;
  vm.runInContext(`${promptGovernance}\n${core}\n${inlineScript}\n${verifyCode}`, activeContext, { timeout: 5000 });
  const value = activeContext.__VERIFY_RESULT__;
  assertCaseResult(value);
  return { ...value, caseName };
}

function assertCaseResult(value) {
  if (!value) throw new Error('Headless runtime evaluation returned no value');
  if (value.runtimeErrors?.length) throw new Error(`Runtime errors: ${value.runtimeErrors.join(' | ')}`);
  if (value.total !== 441) throw new Error(`Expected 441 visible entries, got ${value.total}`);
  if (value.catCount !== 15) throw new Error(`Expected 15 categories, got ${value.catCount}`);
  if (value.lensChipCount !== 1) throw new Error(`Expected 1 lens chip, got ${value.lensChipCount}`);
  if (!value.outputGenerated) throw new Error('Generate button flow did not produce an identity-lock prompt');
  if (value.focusableControlCount < 40) throw new Error(`Expected keyboard-focusable controls, got ${value.focusableControlCount}`);
  if (value.ariaPressedCount < 30) throw new Error(`Expected aria-pressed state on selectable controls, got ${value.ariaPressedCount}`);
  if (!value.keyboardPresetChanged) throw new Error('Keyboard Enter did not activate a preset card');
  if (!value.proToggleKeyboardWorks) throw new Error('Pro panel toggle did not update aria-expanded');
  if (value.promptHasOldLens) throw new Error('Generated prompt contains deprecated lens terms');
  if (value.promptHasLowAngle) throw new Error('Generated prompt contains unsafe low-angle terms');
  if (!value.promptHasReferenceGate) throw new Error('Generated prompt is missing the reference-photo gate');
  if (value.horizontalOverflow) throw new Error(`Viewport has horizontal overflow: ${value.viewport.scrollWidth} > ${value.viewport.width}`);
  if (!(value.theme13Filtered > 0 && value.theme13Filtered <= value.theme13All)) throw new Error('Series filter did not constrain presets');
}

const desktop = runCase('desktop', 1366, 900);
const mobile = runCase('mobile', 390, 844);
const result = {
  ok: true,
  generated_at: new Date().toISOString(),
  mode: 'node-vm-headless-runtime',
  desktop,
  mobile,
};
writeJson(path.join(ROOT, 'temp', 'headless_browser_verification_20260523.json'), result);
console.log(JSON.stringify(result, null, 2));
