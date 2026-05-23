import fs from 'node:fs';
import path from 'node:path';
import {
  REQUIRED_FIELDS,
  ROOT,
  buildDuplicateInfo,
  countBy,
  ensureDir,
  flattenUiEntries,
  inferSourceHint,
  markdownTable,
  missingFields,
  normalizeTitle,
  parseCards,
  parseUiCats,
  readText,
  writeJson,
} from './lib/style_library.mjs';

const baselineDir = path.join(ROOT, '核心資料', 'versions', '20260523_phaseA_pre_audit');
const mdPath = path.join(baselineDir, '風格範例.md');
const htmlPath = path.join(baselineDir, 'index.html');
const outDir = path.join(ROOT, 'docs', 'audit');
const reportPath = path.join(outDir, '風格範例_資料盤點_20260523_baseline.md');
const jsonPath = path.join(ROOT, 'temp', 'style_examples_audit_20260523_baseline.json');

const cards = parseCards(readText(mdPath));
const uiCats = parseUiCats(readText(htmlPath));
const uiEntries = flattenUiEntries(uiCats);
const duplicateInfo = buildDuplicateInfo(cards);
const cardsById = new Map(cards.filter((card) => card.id).map((card) => [card.id, card]));
const uiIds = new Set(uiEntries.map((entry) => entry.id));
const mdMissingFromUiById = cards.filter((card) => card.id && !uiIds.has(card.id));
const uiMissingFromMdById = uiEntries.filter((entry) => !cardsById.has(entry.id));
const cardsWithMissingCore = cards
  .map((card) => ({ card, missing: missingFields(card) }))
  .filter((row) => row.missing.length > 0);
const missingByField = REQUIRED_FIELDS.map((field) => [field, cards.filter((card) => !card.fields[field]).length]);
const prefixCounts = countBy(cards, (card) => card.prefix);
const sourceCounts = countBy(cards, (card) => inferSourceHint(card));
const uiThemeRows = uiCats.map((cat) => [cat.id, cat.name, (cat.entries || []).length]);

const report = [
  '# 風格範例資料盤點報告 baseline',
  '',
  `產生時間：${new Date().toISOString()}`,
  `基準快照：\`${path.relative(ROOT, baselineDir)}\``,
  '',
  '## 1. 摘要',
  '',
  markdownTable([
    ['母庫卡片數', cards.length],
    ['UI 大類數', uiCats.length],
    ['UI 卡片數', uiEntries.length],
    ['母庫有 ID 筆數', cards.filter((card) => card.id).length],
    ['母庫重複標題組數', duplicateInfo.titleDups.length],
    ['母庫重複 ID 組數', duplicateInfo.idDups.length],
    ['母庫有但 UI ID 未收錄', mdMissingFromUiById.length],
    ['UI 有但母庫 ID 找不到', uiMissingFromMdById.length],
    ['有缺欄位卡片數', cardsWithMissingCore.length],
  ], ['項目', '數量']),
  '',
  '## 2. UI 基準 15 大類分布',
  '',
  markdownTable(uiThemeRows, ['theme_id', 'UI 名稱', '卡片數']),
  '',
  '## 3. 來源型態推測',
  '',
  markdownTable(sourceCounts, ['來源型態', '卡片數']),
  '',
  '## 4. 必要欄位缺漏統計',
  '',
  markdownTable(missingByField, ['欄位', '缺漏筆數']),
  '',
  '## 5. 重複標題清單',
  '',
  duplicateInfo.titleDups.length ? markdownTable(duplicateInfo.titleDups.map(([title, list]) => [
    title,
    list.length,
    list.map((card) => `L${card.startLine}${card.id ? ` (${card.id})` : ''}`).join(', '),
  ]), ['標題', '次數', '位置']) : '無。',
  '',
  '## 6. 重複 ID 清單',
  '',
  duplicateInfo.idDups.length ? markdownTable(duplicateInfo.idDups.map(([id, list]) => [
    id,
    list.length,
    list.map((card) => `L${card.startLine} ${card.title}`).join('<br>'),
  ]), ['ID', '次數', '位置']) : '無。',
  '',
  '## 7. 母庫有但基準 UI ID 未收錄',
  '',
  markdownTable(mdMissingFromUiById.map((card) => [card.id, card.title, card.sourceHint, `L${card.startLine}`]), ['ID', '標題', '來源推測', '位置']),
  '',
  '## 8. 基準 UI 有但母庫 ID 找不到',
  '',
  uiMissingFromMdById.length ? markdownTable(uiMissingFromMdById.map((entry) => [entry.id, entry.catId, entry.catName, entry.name, entry.sub || '']), ['ID', 'theme_id', 'UI 大類', '名稱', '副標']) : '無。',
  '',
  '## 9. 母庫標題前綴分布 Top 80',
  '',
  markdownTable(prefixCounts.slice(0, 80).map(([name, count]) => [name, count]), ['前綴 / 系列', '卡片數']),
  '',
  '## 10. baseline 結論',
  '',
  '- 這份報告固定記錄 Phase 0/1 起點，用於追溯原始 `568 / 625` 差異。',
  '- 同步後的目前 UI 狀態請看 `風格範例_資料盤點_20260523.md` 與 `風格索引檢查_20260523.md`。',
  '',
].join('\n');

ensureDir(outDir);
fs.writeFileSync(reportPath, report, 'utf8');
writeJson(jsonPath, {
  generated_at: new Date().toISOString(),
  baseline_dir: path.relative(ROOT, baselineDir),
  summary: {
    cards: cards.length,
    uiCats: uiCats.length,
    uiEntries: uiEntries.length,
    titleDuplicateGroups: duplicateInfo.titleDups.length,
    idDuplicateGroups: duplicateInfo.idDups.length,
    mdMissingFromUiById: mdMissingFromUiById.length,
    uiMissingFromMdById: uiMissingFromMdById.length,
    cardsWithMissingCore: cardsWithMissingCore.length,
  },
  md_missing_from_ui_by_id: mdMissingFromUiById.map((card) => ({ id: card.id, title: card.title, source_hint: card.sourceHint, line: card.startLine })),
  ui_missing_from_md_by_id: uiMissingFromMdById.map((entry) => ({ id: entry.id, theme_id: entry.catId, title: `${entry.sub || entry.catName} · ${entry.name}` })),
  duplicate_titles: duplicateInfo.titleDups.map(([title, list]) => ({ title, entries: list.map((card) => ({ id: card.id, line: card.startLine })) })),
  duplicate_ids: duplicateInfo.idDups.map(([id, list]) => ({ id, entries: list.map((card) => ({ title: card.title, line: card.startLine })) })),
  title_keys: cards.map((card) => normalizeTitle(card.title)),
});

console.log(JSON.stringify({
  cards: cards.length,
  uiCats: uiCats.length,
  uiEntries: uiEntries.length,
  mdMissingFromUiById: mdMissingFromUiById.length,
  uiMissingFromMdById: uiMissingFromMdById.length,
  reportPath,
  jsonPath,
}, null, 2));
