import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const DELETE_IDS = new Set([
  // three_kingdoms (19)
  'tk_29','tk_30','tk_31','tk_32','tk_33','tk_34','tk_35',
  'tk_40','tk_41','tk_42','tk_44','tk_45','tk_46','tk_47',
  'tk_48','tk_49','tk_50','tk_51','tk_52',
  // jinyong (19)
  'jy_44','jy_45','jy_46','jy_47','jy_49','jy_50','jy_51',
  'jy_53','jy_54','jy_56','jy_57','jy_58','jy_59','jy_60',
  'jy_61','jy_62','jy_64','jy_65','jy_66',
  // classic_lit (10)
  'cl_27','cl_40','cl_43','cl_44','cl_45','cl_46','cl_47','cl_48','cl_52','cl_53',
  // chinese_story (14)
  'cs_17','cs_32','cs_35','cs_37','cs_39','cs_40','cs_41',
  'cs_42','cs_47','cs_48','cs_50','cs_51','cs_54','cs_56',
  // china_myth_chars (19)
  'cmh_07','cmh_08','cmh_10','cmh_11','cmh_12',
  'cm_18','cm_19','cm_20','cm_21','cm_22','cm_23','cm_24',
  'cm_26','cm_27','cm_29','cm_31','cm_33','cm_34','cm_35',
  // spirits (4)
  'sp_29','sp_57','sp_62','sp_63',
  // cos_character (2)
  'cos_15','cos_24',
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
for (const cat of cats) {
  const before = cat.entries.length;
  cat.entries = cat.entries.filter(e => !DELETE_IDS.has(e.id));
  htmlDeleted += before - cat.entries.length;
}

const newHtml = html.slice(0, open) + JSON.stringify(cats, null, 2) + html.slice(end);
fs.writeFileSync(htmlPath, newHtml, 'utf8');
console.log(`index.html: deleted ${htmlDeleted} entries`);

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
console.log(`TOTAL: ${htmlDeleted} from index.html, ${mdDeleted} from 風格範例.md`);
