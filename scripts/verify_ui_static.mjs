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

class FakeClassList {
  constructor() {
    this.values = new Set();
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
}

class FakeElement {
  constructor(id = '') {
    this.id = id;
    this.style = {};
    this.classList = new FakeClassList();
    this.children = [];
    this.dataset = {};
    this.value = '';
    this.textContent = '';
    this._innerHTML = '';
  }
  set innerHTML(value) {
    this._innerHTML = String(value || '');
    this.children = parseChildren(this.id, this._innerHTML);
  }
  get innerHTML() { return this._innerHTML; }
  querySelectorAll(selector) {
    if (selector === '.series-chip') return this.children.filter((child) => child.kind === 'series');
    if (selector === '.chip') return this.children;
    return [];
  }
  addEventListener(event, handler) {
    this[`on${event}`] = handler;
  }
  scrollIntoView() {}
  focus() {}
  select() {}
}

function parseChildren(id, htmlText) {
  if (id === 'seriesFilter') {
    return [...htmlText.matchAll(/class="series-chip([^"]*)" data-series-id="([^"]*)">([\s\S]*?)<\/div>/g)].map((match) => {
      const el = new FakeElement();
      el.kind = 'series';
      el.dataset.seriesId = decodeHtml(match[2]);
      if (match[1].includes('active')) el.classList.add('active');
      el.textContent = stripTags(match[3]);
      return el;
    });
  }
  if (id === 'presetGrid') {
    return [...htmlText.matchAll(/class="preset-card([^"]*)" onclick="selEntry\('([^']+)'\)"([\s\S]*?)<\/div>/g)].map((match) => {
      const el = new FakeElement();
      el.kind = 'preset';
      el.dataset.entryId = match[2];
      if (match[1].includes('active')) el.classList.add('active');
      el.textContent = stripTags(match[3]);
      return el;
    });
  }
  return [...htmlText.matchAll(/class="chip([^"]*)"/g)].map((match) => {
    const el = new FakeElement();
    el.kind = 'chip';
    if (match[1].includes('active')) el.classList.add('active');
    return el;
  });
}

function stripTags(value) {
  return String(value || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function decodeHtml(value) {
  return String(value || '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

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

const fakeDocument = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, new FakeElement(id));
    return elements.get(id);
  },
  querySelector(selector) {
    if (selector === '.cat-pill.active') return new FakeElement('activeCatPill');
    if (selector === '.preset-card.active') return elements.get('presetGrid').children.find((child) => child.classList.contains('active')) || null;
    return null;
  },
  querySelectorAll(selector) {
    if (selector === '.preset-card') return elements.get('presetGrid').children;
    if (selector === '#mkChips .chip') return elements.get('mkChips').children;
    if (selector === '#angChips .chip') return elements.get('angChips').children;
    if (selector === '#ratioChips .chip') return elements.get('ratioChips').children;
    if (selector === '#lensChips .chip') return elements.get('lensChips').children;
    if (selector === '#lightChips .chip') return elements.get('lightChips').children;
    if (selector === '#atmChips .chip') return elements.get('atmChips').children;
    if (selector === '#identityChips .chip') return elements.get('identityChips').children;
    if (selector === '#camLangChips .chip') return elements.get('camLangChips').children;
    return [];
  },
  createElement(id) { return new FakeElement(id); },
  execCommand() { return true; },
  body: {
    appendChild() {},
    removeChild() {},
  },
};

const context = {
  window: {
    scrollTo() {},
  },
  document: fakeDocument,
  navigator: {
    clipboard: {
      writeText: async () => {},
    },
  },
  console,
  setTimeout(fn) { fn(); return 1; },
  clearTimeout() {},
};
context.window.window = context.window;
context.window.document = fakeDocument;
context.window.navigator = context.navigator;

const verifyCode = `
const initialTotal = CATS.reduce((sum, cat) => sum + cat.entries.length, 0);
if (initialTotal !== 441) throw new Error('Expected 441 visible entries, got ' + initialTotal);
if (CATS.length !== 15) throw new Error('Expected 15 categories');
if (curSeriesID !== '__all') throw new Error('Expected default series __all');
renderAll();
const initialSeriesCount = document.getElementById('seriesFilter').children.length;
const initialPresetCount = document.getElementById('presetGrid').children.length;
if (initialSeriesCount < 2) throw new Error('Series filter did not render');
if (initialPresetCount !== CATS[0].entries.length) throw new Error('Preset grid count mismatch');
const targetCat = CATS.find(c => c.id === 'theme_13');
selCat('theme_13');
const allTheme13Count = document.getElementById('presetGrid').children.length;
const firstSeries = getSeriesOptions(targetCat)[0][0];
selSeries(firstSeries);
const filteredCount = document.getElementById('presetGrid').children.length;
if (!(filteredCount > 0 && filteredCount <= allTheme13Count)) throw new Error('Series filter did not constrain presets');
const firstEntry = getVisibleEntries(targetCat)[0];
selEntry(firstEntry.id);
const prompt = buildPrompt();
if (!prompt.includes('MANDATORY: Check for an uploaded reference photo')) throw new Error('Prompt core gate missing');
generate(true);
if (!document.getElementById('out').textContent.includes('IDENTITY LOCK')) throw new Error('Generate output missing identity lock');
const randomResult = doRandom(true);
if (!randomResult.cat || !randomResult.entry) throw new Error('Random did not return selection');
globalThis.__VERIFY_RESULT__ = {
  cats: CATS.length,
  total: initialTotal,
  theme13All: allTheme13Count,
  theme13Filtered: filteredCount,
  firstSeries,
  promptLength: prompt.length,
  randomCat: randomResult.cat.id,
  randomEntry: randomResult.entry.id,
};
`;

vm.createContext(context);
vm.runInContext(`${promptGovernance}\n${core}\n${inlineScript}\n${verifyCode}`, context, { timeout: 5000 });

const result = {
  ok: true,
  generated_at: new Date().toISOString(),
  ...context.__VERIFY_RESULT__,
};
writeJson(path.join(ROOT, 'temp', 'ui_static_verification_20260523.json'), result);
console.log(JSON.stringify(result, null, 2));
