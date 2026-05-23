import path from 'node:path';
import {
  REQUIRED_FIELDS,
  ROOT,
  STYLE_MD_PATH,
  buildDuplicateInfo,
  countBy,
  ensureDir,
  flattenUiEntries,
  inferSourceHint,
  loadProjectData,
  markdownTable,
  missingFields,
  normalizeTitle,
  writeJson,
} from './lib/style_library.mjs';
import fs from 'node:fs';

const outDir = path.join(ROOT, 'docs', 'audit');
const reportPath = path.join(outDir, '風格範例_資料盤點_20260523.md');
const jsonPath = path.join(ROOT, 'temp', 'style_examples_audit_20260523.json');
const GENERATED_AT_TOKEN = '__GENERATED_AT__';

const { cards, uiCats } = loadProjectData();
const uiEntries = flattenUiEntries(uiCats);
const duplicateInfo = buildDuplicateInfo(cards);
const cardsById = new Map(cards.filter((card) => card.id).map((card) => [card.id, card]));
const uiById = new Map(uiEntries.map((entry) => [entry.id, entry]));
const uiIds = new Set(uiEntries.map((entry) => entry.id));

const mdMissingFromUiById = cards.filter((card) => card.id && !uiIds.has(card.id));
const uiMissingFromMdById = uiEntries.filter((entry) => !cardsById.has(entry.id));
const cardsWithMissingCore = cards
  .map((card) => ({ card, missing: missingFields(card) }))
  .filter((row) => row.missing.length > 0);

const missingByField = REQUIRED_FIELDS.map((field) => [
  field,
  cards.filter((card) => !card.fields[field]).length,
]);
const prefixCounts = countBy(cards, (card) => card.prefix);
const sourceCounts = countBy(cards, (card) => inferSourceHint(card));
const makeupCounts = countBy(cards.filter((card) => card.fields['妝容']), (card) => card.fields['妝容']);
const uiThemeRows = uiCats.map((cat) => [cat.id, cat.name, (cat.entries || []).length]);

const likelyMisfitRules = [
  ['東方暗黑/狐仙/妖后交界', /(狐仙|妖后|暗黑古風|狐仙夜庭|暗黑東方|神話仙界)/],
  ['旅拍/異域可能需歸環球', /(旅拍|異域|世界民族|騎行|沙海|草原)/],
  ['婚嫁/喜嫁可能需歸婚紗', /(婚嫁|喜嫁|婚典|婚紗|白紗)/],
  ['魔幻/神話/仙俠交界', /(鳳凰|神殿|仙境|聖殿|龍裔|精靈|女神)/],
];
const misfits = cards
  .map((card) => {
    const hit = likelyMisfitRules.find(([, re]) => re.test(card.title));
    return hit ? [card.title, card.id, hit[0], `L${card.startLine}`] : null;
  })
  .filter(Boolean);

const report = [];
report.push('# 風格範例資料盤點報告');
report.push('');
report.push(`產生時間：${GENERATED_AT_TOKEN}`);
report.push(`專案：\`${ROOT}\``);
report.push(`母庫：\`${path.relative(ROOT, STYLE_MD_PATH)}\``);
report.push('');
report.push('## 1. 摘要');
report.push('');
report.push(markdownTable([
  ['母庫卡片數', cards.length],
  ['UI 大類數', uiCats.length],
  ['UI 卡片數', uiEntries.length],
  ['母庫有 ID 筆數', cards.filter((card) => card.id).length],
  ['母庫重複標題組數', duplicateInfo.titleDups.length],
  ['母庫重複 ID 組數', duplicateInfo.idDups.length],
  ['母庫有但 UI ID 未收錄', mdMissingFromUiById.length],
  ['UI 有但母庫 ID 找不到', uiMissingFromMdById.length],
  ['有缺欄位卡片數', cardsWithMissingCore.length],
], ['項目', '數量']));
report.push('');

report.push('## 2. UI 目前 15 大類分布');
report.push('');
report.push(markdownTable(uiThemeRows, ['theme_id', 'UI 名稱', '卡片數']));
report.push('');

report.push('## 3. 母庫標題前綴分布 Top 80');
report.push('');
report.push(markdownTable(prefixCounts.slice(0, 80).map(([name, count]) => [name, count]), ['前綴 / 系列', '卡片數']));
report.push('');

report.push('## 4. 來源型態推測');
report.push('');
report.push(markdownTable(sourceCounts.map(([name, count]) => [name, count]), ['來源型態', '卡片數']));
report.push('');

report.push('## 5. 妝容欄位分布 Top 40');
report.push('');
report.push(markdownTable(makeupCounts.slice(0, 40).map(([name, count]) => [name, count]), ['妝容值', '卡片數']));
report.push('');

report.push('## 6. 必要欄位缺漏統計');
report.push('');
report.push(markdownTable(missingByField, ['欄位', '缺漏筆數']));
report.push('');

report.push('## 7. 重複標題清單');
report.push('');
if (duplicateInfo.titleDups.length === 0) {
  report.push('無。');
} else {
  report.push(markdownTable(duplicateInfo.titleDups.map(([title, list]) => [
    title,
    list.length,
    list.map((card) => `L${card.startLine}${card.id ? ` (${card.id})` : ''}`).join(', '),
  ]), ['標題', '次數', '位置']));
}
report.push('');

report.push('## 8. 重複 ID 清單');
report.push('');
if (duplicateInfo.idDups.length === 0) {
  report.push('無。');
} else {
  report.push(markdownTable(duplicateInfo.idDups.map(([id, list]) => [
    id,
    list.length,
    list.map((card) => `L${card.startLine} ${card.title}`).join('<br>'),
  ]), ['ID', '次數', '位置']));
}
report.push('');

report.push('## 9. 母庫有但 UI ID 未收錄');
report.push('');
report.push(`共 ${mdMissingFromUiById.length} 筆。`);
report.push('');
report.push(markdownTable(mdMissingFromUiById.map((card) => [
  card.id,
  card.title,
  card.sourceHint,
  `L${card.startLine}`,
]), ['ID', '標題', '來源推測', '位置']));
report.push('');

report.push('## 10. UI 有但母庫 ID 找不到');
report.push('');
if (uiMissingFromMdById.length === 0) {
  report.push('無。');
} else {
  report.push(`共 ${uiMissingFromMdById.length} 筆。`);
  report.push('');
  report.push(markdownTable(uiMissingFromMdById.map((entry) => [
    entry.id,
    entry.catId,
    entry.catName,
    entry.name,
    entry.sub || '',
  ]), ['ID', 'theme_id', 'UI 大類', '名稱', '副標']));
}
report.push('');

report.push('## 11. 缺欄位卡片清單');
report.push('');
report.push(`共 ${cardsWithMissingCore.length} 筆有缺欄位。`);
report.push('');
report.push(markdownTable(cardsWithMissingCore.map(({ card, missing }) => [
  card.id,
  card.title,
  missing.join('、'),
  `L${card.startLine}`,
]), ['ID', '標題', '缺少欄位', '位置']));
report.push('');

report.push('## 12. 疑似分類交界 / 需人工確認清單');
report.push('');
report.push('此清單用關鍵字粗抓，不代表一定分類錯誤，只是 Phase 2 建索引時要優先確認。');
report.push('');
report.push(markdownTable(misfits, ['標題', 'ID', '原因', '位置']));
report.push('');

report.push('## 13. Phase 1 結論');
report.push('');
report.push('- 母庫與 UI 確實不同步，不能直接用「補齊 UI」處理。');
report.push('- 重複標題與缺欄位需要進入索引狀態管理。');
report.push('- 下一步進 Phase 2：建立 `核心資料/風格索引草案.json`。');
report.push('- 建索引時應保守標記：UI 已收錄且欄位完整者可用，疑似重複或來源不明者為 `review` / `duplicate`。');
report.push('');

ensureDir(outDir);
fs.writeFileSync(reportPath, materializeReport(reportPath, report.join('\n')), 'utf8');

writeJson(jsonPath, {
  generated_at: new Date().toISOString(),
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
  md_missing_from_ui_by_id: mdMissingFromUiById.map((card) => ({
    id: card.id,
    title: card.title,
    source_hint: card.sourceHint,
    line: card.startLine,
  })),
  ui_missing_from_md_by_id: uiMissingFromMdById.map((entry) => ({
    id: entry.id,
    theme_id: entry.catId,
    title: `${entry.sub || entry.catName} · ${entry.name}`,
  })),
  duplicate_titles: duplicateInfo.titleDups.map(([title, list]) => ({
    title,
    entries: list.map((card) => ({ id: card.id, line: card.startLine })),
  })),
  duplicate_ids: duplicateInfo.idDups.map(([id, list]) => ({
    id,
    entries: list.map((card) => ({ title: card.title, line: card.startLine })),
  })),
  missing_fields: cardsWithMissingCore.map(({ card, missing }) => ({
    id: card.id,
    title: card.title,
    missing,
    line: card.startLine,
  })),
  ui_by_id: Object.fromEntries(uiEntries.map((entry) => [entry.id, {
    theme_id: entry.catId,
    theme_name: entry.catName,
    name: entry.name,
    sub: entry.sub || '',
  }])),
  title_keys: cards.map((card) => normalizeTitle(card.title)),
});

console.log(JSON.stringify({
  cards: cards.length,
  uiCats: uiCats.length,
  uiEntries: uiEntries.length,
  titleDuplicateGroups: duplicateInfo.titleDups.length,
  idDuplicateGroups: duplicateInfo.idDups.length,
  mdMissingFromUiById: mdMissingFromUiById.length,
  uiMissingFromMdById: uiMissingFromMdById.length,
  cardsWithMissingCore: cardsWithMissingCore.length,
  reportPath,
  jsonPath,
}, null, 2));

function materializeReport(targetPath, draft) {
  const next = draft.replace(GENERATED_AT_TOKEN, new Date().toISOString());
  if (!fs.existsSync(targetPath)) return next;
  const previous = fs.readFileSync(targetPath, 'utf8');
  const normalizeGeneratedAt = (text) => text.replace(
    /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/,
    GENERATED_AT_TOKEN,
  );
  if (normalizeGeneratedAt(previous) !== normalizeGeneratedAt(next)) return next;
  const previousTime = previous.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/)?.[0];
  return previousTime ? draft.replace(GENERATED_AT_TOKEN, previousTime) : next;
}
