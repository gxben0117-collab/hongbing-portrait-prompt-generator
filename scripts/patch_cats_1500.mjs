// Replace CATS data in index.html with generated 1500-entry set
import { readFileSync, writeFileSync, copyFileSync } from 'fs';

const BASE = 'C:\\AIProjects\\測試區\\紅兵風格寫真咒語產生器';

// Backup current index.html
copyFileSync(`${BASE}\\index.html`, `${BASE}\\versions\\index_v0.50_pre_rebuild_20260523.html`);
console.error('Backed up index.html → versions/index_v0.50_pre_rebuild_20260523.html');

// Load generated CATS
const newCats = JSON.parse(readFileSync(`${BASE}\\scripts\\cats_1500_output.json`, 'utf-8'));

// Load current index.html
let html = readFileSync(`${BASE}\\index.html`, 'utf-8');

// Find CATS block: from "const CATS = [" to "];\nlet curCatID"
const startMarker = 'const CATS = [';
const startIdx = html.indexOf(startMarker);
if (startIdx === -1) { console.error('ERROR: CATS start not found'); process.exit(1); }

// Find 'let curCatID' after the CATS array
const curCatIdx = html.indexOf('let curCatID', startIdx);
if (curCatIdx === -1) { console.error('ERROR: curCatID not found'); process.exit(1); }

// Walk backwards from curCatIdx to find the '];\n' end of the CATS array
const beforeCurCat = html.slice(startIdx, curCatIdx);
const catsEndInSlice = beforeCurCat.lastIndexOf('];');
if (catsEndInSlice === -1) { console.error('ERROR: CATS closing ]; not found'); process.exit(1); }

const catsEndAbs = startIdx + catsEndInSlice + 2; // +2 for ']; '

const catsJson = JSON.stringify(newCats, null, 2);
const newCatsBlock = `const CATS = ${catsJson};\n\n`;

html = html.slice(0, startIdx) + newCatsBlock + html.slice(catsEndAbs).replace(/^\s*\n*/, '');

// Version bump: v0.50 → v0.51 in footer
html = html.replace(/紅兵開發 · v0\.50 · 核心規範 v1\.5/, '紅兵開發 · v0.51 · 核心規範 v1.5');

writeFileSync(`${BASE}\\index.html`, html, 'utf-8');
console.error('index.html updated with 1500 entries, version bumped to v0.51');
