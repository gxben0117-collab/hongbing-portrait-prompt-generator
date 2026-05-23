import fs from 'node:fs';
import path from 'node:path';
import {
  INDEX_DRAFT_PATH,
  INDEX_PATH,
  ROOT,
  VALID_STATUSES,
  VALID_THEME_IDS,
  buildDuplicateInfo,
  loadProjectData,
  markdownTable,
  readJson,
  writeJson,
} from './lib/style_library.mjs';

const requested = process.argv.includes('--formal') ? INDEX_PATH : INDEX_DRAFT_PATH;
const indexPath = fs.existsSync(requested) ? requested : INDEX_DRAFT_PATH;
const reportPath = path.join(ROOT, 'docs', 'audit', '風格索引檢查_20260523.md');
const jsonPath = path.join(ROOT, 'temp', 'style_index_audit_20260523.json');

const index = readJson(indexPath);
const { cards, uiCats } = loadProjectData();
const duplicateInfo = buildDuplicateInfo(cards);

const cardKeys = new Set(cards.map((card) => `${card.id || 'no_id'}@L${card.startLine}`));
const indexKeys = new Set(index.entries.map((entry) => entry.index_key || `${entry.source_id || entry.id || 'no_id'}@L${entry.source_line || 0}`));
const cardIds = new Set(cards.map((card) => card.id));
const errors = [];
const warnings = [];

for (const card of cards) {
  const key = `${card.id || 'no_id'}@L${card.startLine}`;
  if (!indexKeys.has(key)) {
    errors.push({ type: 'missing_index_entry', id: card.id, title: card.title, line: card.startLine });
  }
}

for (const entry of index.entries) {
  if (!cardIds.has(entry.id)) {
    errors.push({ type: 'index_entry_without_md_card', id: entry.id, title: entry.title });
  }
  if (!VALID_THEME_IDS.has(entry.theme_id)) {
    errors.push({ type: 'invalid_theme_id', id: entry.id, theme_id: entry.theme_id });
  }
  if (!VALID_STATUSES.has(entry.ui_status)) {
    errors.push({ type: 'invalid_ui_status', id: entry.id, ui_status: entry.ui_status });
  }
  if (!entry.series) {
    errors.push({ type: 'missing_series', id: entry.id, title: entry.title });
  }
  if (!Number.isFinite(entry.sort_weight) || entry.sort_weight <= 0) {
    errors.push({ type: 'invalid_sort_weight', id: entry.id, sort_weight: entry.sort_weight });
  }
  if (entry.source_type === 'rev' && entry.ui_status !== 'review' && entry.ui_status !== 'duplicate') {
    warnings.push({ type: 'reverse_sample_visible', id: entry.id, ui_status: entry.ui_status });
  }
  if (entry.risk_flags?.includes('duplicate_title') && entry.ui_status !== 'duplicate') {
    warnings.push({ type: 'duplicate_title_not_marked_duplicate', id: entry.id, ui_status: entry.ui_status });
  }
}

const duplicateIndexIds = [...groupBy(index.entries, (entry) => entry.id).entries()]
  .filter(([, list]) => list.length > 1)
  .map(([id, list]) => ({ type: 'duplicate_index_source_id', id, count: list.length }));
warnings.push(...duplicateIndexIds);
const duplicateIndexKeys = [...groupBy(index.entries, (entry) => entry.index_key).entries()]
  .filter(([, list]) => list.length > 1)
  .map(([id, list]) => ({ type: 'duplicate_index_key', id, count: list.length }));
errors.push(...duplicateIndexKeys);

const visibleEntries = index.entries.filter((entry) => ['core', 'official', 'supplement'].includes(entry.ui_status));
const coreCounts = Object.fromEntries(index.meta ? [] : []);
for (const themeId of VALID_THEME_IDS) {
  const themeCore = index.entries.filter((entry) => entry.theme_id === themeId && entry.ui_status === 'core');
  coreCounts[themeId] = themeCore.length;
  if (themeCore.length === 0) {
    warnings.push({ type: 'theme_without_core', theme_id: themeId });
  }
}

const statusRows = Object.entries(countBy(index.entries, (entry) => entry.ui_status)).map(([status, count]) => [status, count]);
const themeRows = [...VALID_THEME_IDS].sort().map((themeId) => {
  const entries = index.entries.filter((entry) => entry.theme_id === themeId);
  const visible = entries.filter((entry) => ['core', 'official', 'supplement'].includes(entry.ui_status));
  return [themeId, entries.length, visible.length, coreCounts[themeId] || 0];
});

const report = [
  '# 風格索引檢查報告',
  '',
  `產生時間：${new Date().toISOString()}`,
  `檢查索引：\`${path.relative(ROOT, indexPath)}\``,
  '',
  '## 1. 摘要',
  '',
  markdownTable([
    ['母庫卡片數', cards.length],
    ['索引筆數', index.entries.length],
    ['UI 大類數', uiCats.length],
    ['可顯示索引筆數', visibleEntries.length],
    ['錯誤數', errors.length],
    ['警告數', warnings.length],
    ['母庫重複標題組數', duplicateInfo.titleDups.length],
    ['母庫重複 ID 組數', duplicateInfo.idDups.length],
  ], ['項目', '數量']),
  '',
  '## 2. 狀態分布',
  '',
  markdownTable(statusRows, ['ui_status', '數量']),
  '',
  '## 3. 主題覆蓋',
  '',
  markdownTable(themeRows, ['theme_id', '索引筆數', '可顯示筆數', '核心卡數']),
  '',
  '## 4. 錯誤',
  '',
  errors.length ? markdownTable(errors.slice(0, 200).map((item) => [item.type, item.id || item.theme_id || '', item.title || item.theme_id || item.ui_status || '', item.line || item.count || item.sort_weight || '']), ['類型', 'ID', '內容', '位置/數值']) : '無。',
  '',
  '## 5. 警告',
  '',
  warnings.length ? markdownTable(warnings.slice(0, 200).map((item) => [item.type, item.id || item.theme_id || '', item.ui_status || '', item.theme_id || '']), ['類型', 'ID/theme', '狀態', '補充']) : '無。',
  '',
].join('\n');

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, report, 'utf8');
writeJson(jsonPath, {
  generated_at: new Date().toISOString(),
  index_path: path.relative(ROOT, indexPath),
  summary: {
    cards: cards.length,
    indexEntries: index.entries.length,
    visibleEntries: visibleEntries.length,
    errors: errors.length,
    warnings: warnings.length,
  },
  errors,
  warnings,
});

console.log(JSON.stringify({
  indexPath,
  cards: cards.length,
  indexEntries: index.entries.length,
  visibleEntries: visibleEntries.length,
  errors: errors.length,
  warnings: warnings.length,
  reportPath,
  jsonPath,
}, null, 2));

if (errors.length) {
  process.exitCode = 1;
}

function groupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}
