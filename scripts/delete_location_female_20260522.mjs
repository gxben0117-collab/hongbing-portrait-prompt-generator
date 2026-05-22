import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Travel entries that are just "location + bare female marker" without creative concept
const DELETE_IDS = new Set([
  // japan_travel: location + 女/女孩 without meaningful character concept
  'jp_71', // 伏見稻荷鳥居女
  'jp_72', // 明治神宮參道女
  'jp_73', // 春日大社白鹿女
  'jp_74', // 嚴島鳥居漲潮女
  'jp_76', // 北海道雪燈祭女
  'jp_79', // 松島雪夜觀月女
  'jp_80', // 川越蔵造雪景女
  'jp_81', // 下灘車站海邊女
  'jp_84', // 土讃線山谷女孩
  'jp_86', // 嵐山竹林晨光女
  // taiwan_travel: location + 女/少女 without meaningful character concept
  'tw_70', // 淡水漁港晨霧女
  'tw_74', // 阿里山茶園採女
  'tw_77', // 大稻埕香料街女
  'tw_78', // 大稻埕碼頭渡女
  'tw_80', // 大稻埕布行少女
  'tw_82', // 高美濕地夕陽女
  'tw_83', // 高美風車候鳥女
  'tw_84', // 高美退潮漫步女
]);

// ── Part 1: index.html ────────────────────────────────────────────────────────

const htmlPath = path.join(ROOT, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const marker = 'const CATS = [';
const open = html.indexOf('[', html.indexOf(marker));
let depth=0, inStr=false, q='', esc=false, end=open;
for (let i=open; i<html.length; i++) {
  const ch = html[i];
  if (inStr) {
    if (esc) { esc=false; continue; }
    if (ch==='\\') { esc=true; continue; }
    if (ch===q) inStr=false;
    continue;
  }
  if (ch==="'" || ch==='"' || ch==='`') { inStr=true; q=ch; continue; }
  if (ch==='[') depth++;
  if (ch===']') { depth--; if (depth===0) { end=i+1; break; } }
}

const cats = vm.runInNewContext('(' + html.slice(open, end) + ')');

let htmlDeleted = 0;
const deletedNames = [];
for (const cat of cats) {
  for (const e of cat.entries) {
    if (DELETE_IDS.has(e.id)) deletedNames.push(`${e.id}: ${e.name}`);
  }
  const before = cat.entries.length;
  cat.entries = cat.entries.filter(e => !DELETE_IDS.has(e.id));
  htmlDeleted += before - cat.entries.length;
}

const newHtml = html.slice(0, open) + JSON.stringify(cats, null, 2) + html.slice(end);
fs.writeFileSync(htmlPath, newHtml, 'utf8');
console.log(`index.html: deleted ${htmlDeleted} entries`);
deletedNames.forEach(n => console.log(' -', n));

// ── Part 2: 風格範例.md ──────────────────────────────────────────────────────

const mdPath = path.join(ROOT, '核心資料/風格範例.md');
const md = fs.readFileSync(mdPath, 'utf8');
const lines = md.split('\n');

const result = [];
let sectionLines = [];
let sectionHasDeleteId = false;
let mdDeleted = 0;
let inSection = false;

function flushSection() {
  if (!inSection) return;
  if (sectionHasDeleteId) {
    mdDeleted++;
  } else {
    result.push(...sectionLines);
  }
  sectionLines = [];
  sectionHasDeleteId = false;
  inSection = false;
}

for (const line of lines) {
  if (line.startsWith('### ')) {
    flushSection();
    inSection = true;
    sectionLines = [line];
  } else if (/^#{1,2} /.test(line)) {
    flushSection();
    result.push(line);
  } else {
    if (inSection) {
      sectionLines.push(line);
      const m = line.match(/\*\*ID:\*\*\s*`([^`]+)`/);
      if (m && DELETE_IDS.has(m[1])) sectionHasDeleteId = true;
    } else {
      result.push(line);
    }
  }
}
flushSection();

fs.writeFileSync(mdPath, result.join('\n'), 'utf8');
console.log(`風格範例.md: deleted ${mdDeleted} sections`);
