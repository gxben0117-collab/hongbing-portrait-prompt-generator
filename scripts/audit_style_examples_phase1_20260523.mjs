import fs from 'node:fs';
import path from 'node:path';

const root = 'C:/AIProjects/紅兵風格寫真咒語產生器';
const mdPath = path.join(root, '核心資料', '風格範例.md');
const htmlPath = path.join(root, 'index.html');
const outDir = path.join(root, 'docs', 'audit');
const outPath = path.join(outDir, '風格範例_資料盤點_20260523.md');

const REQUIRED_FIELDS = [
  'ID',
  '妝容',
  '場景背景',
  '光線',
  '服裝',
  '動作與鏡頭',
  '構圖',
  '特效',
  '色調',
  '鏡頭角度',
  '圖片比例',
  '鏡頭焦段',
  '燈光風格',
  '整體氛圍',
  '鏡頭語言',
];

const THEME_NAMES = {
  theme_01: '魅魔系列',
  theme_02: '魔王系列',
  theme_03: '墮天使系列',
  theme_04: '長相思系列',
  theme_05: '神話系列',
  theme_06: '聊齋系列',
  theme_07: '名著系列',
  theme_08: '武俠系列',
  theme_09: '陸劇系列',
  theme_10: '古裝系列',
  theme_11: '仙俠系列',
  theme_12: '環球系列',
  theme_13: '魔幻系列',
  theme_14: '動漫系列',
  theme_15: '婚紗系列',
};

const md = fs.readFileSync(mdPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');

function parseCards(markdown) {
  const lines = markdown.split(/\r?\n/);
  const cards = [];
  let current = null;

  function finish(endLine) {
    if (!current) return;
    current.endLine = endLine;
    current.block = current.lines.join('\n');
    current.fields = {};
    for (const field of REQUIRED_FIELDS) {
      const re = new RegExp(`\\*\\*${escapeRegExp(field)}[:：]\\*\\*\\s*([^\\n]+)`);
      const match = current.block.match(re);
      if (match) current.fields[field] = match[1].trim();
    }
    const idMatch = current.block.match(/\*\*ID[:：]\*\*\s*`?([^`\n]+)`?/);
    current.id = idMatch ? idMatch[1].trim() : '';
    current.prefix = current.title.split('·')[0].trim();
    current.sourceHint = inferSourceHint(current);
    cards.push(current);
  }

  lines.forEach((line, idx) => {
    const heading = line.match(/^####\s+(.+?)\s*$/);
    if (heading) {
      finish(idx);
      current = {
        title: heading[1].trim(),
        startLine: idx + 1,
        endLine: idx + 1,
        lines: [],
      };
      return;
    }
    if (current) current.lines.push(line);
  });
  finish(lines.length);
  return cards;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function inferSourceHint(card) {
  const text = `${card.title}\n${card.block || ''}`;
  if (/rev_\d+|來源檔名/.test(text)) return 'rev/image-analysis';
  if (/v0\.27/.test(text)) return 'v0.27 supplement';
  if (/補充/.test(text)) return 'supplement';
  return 'manual/official-like';
}

function parseUiCats(htmlText) {
  const match = htmlText.match(/const CATS = ([\s\S]*?);\s*let curCatID/);
  if (!match) return [];
  return JSON.parse(match[1]);
}

function countBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item) || '(空)';
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), 'zh-Hant'));
}

function duplicates(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return [...map.entries()]
    .filter(([, list]) => list.length > 1)
    .sort((a, b) => b[1].length - a[1].length || String(a[0]).localeCompare(String(b[0]), 'zh-Hant'));
}

function table(rows, headers) {
  const header = `| ${headers.join(' |')} |`;
  const sep = `| ${headers.map(() => '---').join(' |')} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell ?? '').replace(/\n/g, '<br>')).join(' |')} |`);
  return [header, sep, ...body].join('\n');
}

function keyOfTitle(title) {
  return title.replace(/\s+/g, ' ').trim();
}

const cards = parseCards(md);
const uiCats = parseUiCats(html);
const uiEntries = uiCats.flatMap((cat) => (cat.entries || []).map((entry) => ({ ...entry, catId: cat.id, catName: cat.name })));

const cardsByTitle = new Map(cards.map((card) => [keyOfTitle(card.title), card]));
const cardsById = new Map(cards.filter((card) => card.id).map((card) => [card.id, card]));

const uiTitleKeys = new Set(
  uiEntries.map((entry) => keyOfTitle(`${entry.sub || entry.catName} · ${entry.name}`))
);
const uiIds = new Set(uiEntries.map((entry) => entry.id));

const mdMissingFromUiById = cards.filter((card) => card.id && !uiIds.has(card.id));
const uiMissingFromMdById = uiEntries.filter((entry) => !cardsById.has(entry.id));

const titleDups = duplicates(cards, (card) => keyOfTitle(card.title));
const idDups = duplicates(cards, (card) => card.id);

const missingByField = REQUIRED_FIELDS.map((field) => [
  field,
  cards.filter((card) => !card.fields[field]).length,
]);

const cardsWithMissingCore = cards
  .map((card) => ({
    card,
    missing: REQUIRED_FIELDS.filter((field) => !card.fields[field]),
  }))
  .filter((row) => row.missing.length > 0);

const prefixCounts = countBy(cards, (card) => card.prefix);
const sourceCounts = countBy(cards, (card) => card.sourceHint);
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
    return hit ? [card.title, card.id, hit[0], card.startLine] : null;
  })
  .filter(Boolean);

const now = new Date().toISOString();
const report = [];
report.push('# 風格範例資料盤點報告');
report.push('');
report.push(`產生時間：${now}`);
report.push(`專案：\`${root}\``);
report.push('');
report.push('## 1. 摘要');
report.push('');
report.push(table([
  ['母庫卡片數', cards.length],
  ['UI 大類數', uiCats.length],
  ['UI 卡片數', uiEntries.length],
  ['母庫有 ID 筆數', cards.filter((card) => card.id).length],
  ['母庫重複標題組數', titleDups.length],
  ['母庫重複 ID 組數', idDups.length],
  ['母庫有但 UI ID 未收錄', mdMissingFromUiById.length],
  ['UI 有但母庫 ID 找不到', uiMissingFromMdById.length],
  ['有缺欄位卡片數', cardsWithMissingCore.length],
], ['項目', '數量']));
report.push('');

report.push('## 2. UI 目前 15 大類分布');
report.push('');
report.push(table(uiThemeRows, ['theme_id', 'UI 名稱', '卡片數']));
report.push('');

report.push('## 3. 母庫標題前綴分布 Top 80');
report.push('');
report.push(table(prefixCounts.slice(0, 80).map(([name, count]) => [name, count]), ['前綴 / 系列', '卡片數']));
report.push('');

report.push('## 4. 來源型態推測');
report.push('');
report.push(table(sourceCounts.map(([name, count]) => [name, count]), ['來源型態', '卡片數']));
report.push('');

report.push('## 5. 妝容欄位分布 Top 40');
report.push('');
report.push(table(makeupCounts.slice(0, 40).map(([name, count]) => [name, count]), ['妝容值', '卡片數']));
report.push('');

report.push('## 6. 必要欄位缺漏統計');
report.push('');
report.push(table(missingByField, ['欄位', '缺漏筆數']));
report.push('');

report.push('## 7. 重複標題清單');
report.push('');
if (titleDups.length === 0) {
  report.push('無。');
} else {
  report.push(table(titleDups.map(([title, list]) => [
    title,
    list.length,
    list.map((card) => `L${card.startLine}${card.id ? ` (${card.id})` : ''}`).join(', '),
  ]), ['標題', '次數', '位置']));
}
report.push('');

report.push('## 8. 重複 ID 清單');
report.push('');
if (idDups.length === 0) {
  report.push('無。');
} else {
  report.push(table(idDups.map(([id, list]) => [
    id,
    list.length,
    list.map((card) => `L${card.startLine} ${card.title}`).join('<br>'),
  ]), ['ID', '次數', '位置']));
}
report.push('');

report.push('## 9. 母庫有但 UI ID 未收錄');
report.push('');
report.push(`共 ${mdMissingFromUiById.length} 筆。先列前 120 筆，完整清單可由腳本再輸出 JSON。`);
report.push('');
report.push(table(mdMissingFromUiById.slice(0, 120).map((card) => [
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
  report.push(`共 ${uiMissingFromMdById.length} 筆。先列前 120 筆。`);
  report.push('');
  report.push(table(uiMissingFromMdById.slice(0, 120).map((entry) => [
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
report.push(`共 ${cardsWithMissingCore.length} 筆有缺欄位。先列前 160 筆。`);
report.push('');
report.push(table(cardsWithMissingCore.slice(0, 160).map(({ card, missing }) => [
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
report.push(table(misfits.slice(0, 160), ['標題', 'ID', '原因', '位置']));
report.push('');

report.push('## 13. Phase 1 結論');
report.push('');
report.push('- 母庫與 UI 確實不同步，不能直接用「補齊 UI」處理。');
report.push('- 重複標題與缺欄位需要進入索引狀態管理。');
report.push('- 建議下一步進 Phase 2：建立 `核心資料/風格索引草案.json`。');
report.push('- 建索引時應先保守標記：UI 已收錄且欄位完整者為 `official`，疑似重複或缺欄位者為 `review` / `duplicate`。');
report.push('');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, report.join('\n'), 'utf8');

console.log(JSON.stringify({
  cards: cards.length,
  uiCats: uiCats.length,
  uiEntries: uiEntries.length,
  titleDuplicateGroups: titleDups.length,
  idDuplicateGroups: idDups.length,
  mdMissingFromUiById: mdMissingFromUiById.length,
  uiMissingFromMdById: uiMissingFromMdById.length,
  cardsWithMissingCore: cardsWithMissingCore.length,
  outPath,
}, null, 2));
