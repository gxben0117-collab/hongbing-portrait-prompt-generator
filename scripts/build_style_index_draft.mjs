import path from 'node:path';
import {
  INDEX_DRAFT_PATH,
  ROOT,
  SERIES_ORDER,
  THEME_BY_ID,
  THEME_DEFS,
  buildDuplicateInfo,
  entrySort,
  flattenUiEntries,
  inferRiskFlags,
  inferIdentityRiskFields,
  inferSeries,
  inferSourceBatch,
  inferSourceType,
  inferTheme,
  inferUiStatus,
  indexSort,
  isCoreCandidate,
  loadProjectData,
  markdownTable,
  missingFields,
  seriesRank,
  sortWeightFor,
  writeJson,
} from './lib/style_library.mjs';
import fs from 'node:fs';

const outReportPath = path.join(ROOT, 'docs', 'audit', '風格索引草案_20260523.md');
const { cards, uiCats } = loadProjectData();
const uiEntries = flattenUiEntries(uiCats);
const uiById = new Map(uiEntries.map((entry) => [entry.id, entry]));
const uiByTitle = new Map(uiEntries.map((entry) => [`${entry.sub || entry.catName} · ${entry.name}`, entry]));
const duplicateInfo = buildDuplicateInfo(cards);

const rawEntries = cards.map((card) => {
  const uiEntry = uiByTitle.get(card.title) || uiById.get(card.id);
  const themeId = inferTheme(card, uiEntry);
  const theme = THEME_BY_ID[themeId] || THEME_DEFS[12];
  const series = inferSeries(card, themeId, uiEntry);
  const riskFlags = inferRiskFlags(card, duplicateInfo);
  const identityRisk = inferIdentityRiskFields(card);
  const uiStatus = inferUiStatus(card, uiEntry, duplicateInfo);
  const parts = card.title.split('·').map((part) => part.trim()).filter(Boolean);
  return {
    index_key: `${card.id || 'no_id'}@L${card.startLine}`,
    id: card.id,
    source_id: card.id,
    runtime_id: uiEntry?.id || card.id,
    title: card.title,
    display_name: uiEntry?.name || parts[1] || card.name || card.title,
    display_sub: uiEntry?.sub || parts[0] || theme.shortName,
    theme_id: theme.id,
    theme_name: theme.name,
    theme_short_name: theme.shortName,
    series,
    ui_status: uiStatus,
    source_type: inferSourceType(card),
    source_batch: inferSourceBatch(card),
    sort_weight: 0,
    tags: makeTags(card, series, theme),
    risk_flags: [...new Set([...riskFlags, ...identityRisk.identity_risk_flags])],
    ...identityRisk,
    missing_fields: missingFields(card),
    ui_included: Boolean(uiEntry),
    source_line: card.startLine,
    notes: makeNotes(card, uiEntry, riskFlags, identityRisk),
  };
});

const byTheme = new Map();
for (const entry of rawEntries) {
  if (!byTheme.has(entry.theme_id)) byTheme.set(entry.theme_id, []);
  byTheme.get(entry.theme_id).push(entry);
}

for (const theme of THEME_DEFS) {
  const list = byTheme.get(theme.id) || [];
  list.sort((a, b) => {
    return (
      (a.ui_included === b.ui_included ? 0 : a.ui_included ? -1 : 1) ||
      seriesRank(a.theme_id, a.series) - seriesRank(b.theme_id, b.series) ||
      a.source_line - b.source_line ||
      a.title.localeCompare(b.title, 'zh-Hant')
    );
  });

  let coreCount = 0;
  for (const entry of list) {
    if (isCoreCandidate(entry, coreCount)) {
      entry.ui_status = 'core';
      entry.notes = appendNote(entry.notes, 'Phase 4 初版核心卡候選');
      coreCount += 1;
    }
  }

  const seriesCounters = new Map();
  for (const entry of list) {
    const seriesKey = entry.series || '待審';
    const n = (seriesCounters.get(seriesKey) || 0) + 1;
    seriesCounters.set(seriesKey, n);
    entry.sort_weight = sortWeightFor(entry, n);
  }
}

const index = {
  meta: {
    version: 'style-index-plan-v1',
    generated_at: new Date().toISOString(),
    source_md: '核心資料/風格範例.md',
    source_ui: 'index.html',
    policy: {
      source_library: '核心資料/風格範例.md is the full mother library.',
      ui_policy: 'UI should display core, official, and selected supplement entries only.',
      default_new_status: 'review',
      no_direct_delete: true,
      no_direct_full_reorder: true,
    },
  },
  themes: THEME_DEFS.map((theme) => ({
    id: theme.id,
    name: theme.name,
    short_name: theme.shortName,
    icon: theme.icon,
    tpl: theme.tpl,
    series_order: SERIES_ORDER[theme.id] || [],
  })),
  entries: rawEntries.sort(indexSort),
};

writeJson(INDEX_DRAFT_PATH, index);

const summaryRows = THEME_DEFS.map((theme) => {
  const entries = index.entries.filter((entry) => entry.theme_id === theme.id);
  const statusCounts = countStatuses(entries);
  const seriesCount = new Set(entries.map((entry) => entry.series)).size;
  return [
    theme.id,
    theme.name,
    entries.length,
    seriesCount,
    statusCounts.core || 0,
    statusCounts.official || 0,
    statusCounts.supplement || 0,
    statusCounts.review || 0,
    statusCounts.duplicate || 0,
  ];
});

const statusRows = Object.entries(countStatuses(index.entries)).sort((a, b) => a[0].localeCompare(b[0]));
const identityRiskRows = Object.entries(countBy(index.entries, (entry) => entry.style_contamination_risk)).sort((a, b) => a[0].localeCompare(b[0]));
const rewriteNeededCount = index.entries.filter((entry) => entry.rewrite_needed).length;
const missingUiRows = index.entries
  .filter((entry) => !entry.ui_included)
  .slice()
  .sort(entrySort)
  .map((entry) => [entry.id, entry.theme_id, entry.series, entry.ui_status, entry.title, entry.risk_flags.join('、')]);

const report = [
  '# 風格索引草案報告',
  '',
  `產生時間：${index.meta.generated_at}`,
  `索引檔：\`${path.relative(ROOT, INDEX_DRAFT_PATH)}\``,
  '',
  '## 1. 主題分布',
  '',
  markdownTable(summaryRows, ['theme_id', '主題', '卡片數', '子系列數', 'core', 'official', 'supplement', 'review', 'duplicate']),
  '',
  '## 2. 狀態總覽',
  '',
  markdownTable(statusRows, ['ui_status', '數量']),
  '',
  '## 3. 身份污染風險總覽',
  '',
  markdownTable([
    ['rewrite_needed', rewriteNeededCount],
    ...identityRiskRows,
  ], ['風險類型 / 等級', '數量']),
  '',
  '## 4. UI 未收錄母庫卡片初判',
  '',
  markdownTable(missingUiRows, ['ID', 'theme_id', 'series', 'ui_status', '標題', 'risk_flags']),
  '',
  '## 5. Phase 3/4 結論',
  '',
  '- 15 大主題 ID 已固定於索引 `themes`。',
  '- 每筆母庫卡片已取得 `theme_id`、`series`、`ui_status` 與 `sort_weight`。',
  '- 核心卡目前為腳本初判：每個主題最多先取 2 張已收錄且無風險旗標的正式卡。',
  '- `review`、`duplicate` 不會自動進入主 UI。',
  '',
].join('\n');
fs.mkdirSync(path.dirname(outReportPath), { recursive: true });
fs.writeFileSync(outReportPath, report, 'utf8');

console.log(JSON.stringify({
  entries: index.entries.length,
  themes: index.themes.length,
  statusCounts: countStatuses(index.entries),
  indexPath: INDEX_DRAFT_PATH,
  reportPath: outReportPath,
}, null, 2));

function makeTags(card, series, theme) {
  const tags = [theme.shortName, series, card.prefix, card.sourceHint]
    .filter(Boolean)
    .map((tag) => tag.replace(/\s+/g, ' ').trim());
  if (/暗黑|哥德|冥界|地獄|夜/.test(card.title)) tags.push('暗黑');
  if (/婚|喜嫁|白紗|禮服/.test(card.title)) tags.push('婚紗');
  if (/旅拍|地標|世界|異域|草原|沙海/.test(card.title)) tags.push('旅拍');
  if (/仙|神話|鳳凰|狐/.test(card.title)) tags.push('東方奇幻');
  if (/動漫|遊戲|賽博|科幻/.test(card.title)) tags.push('次元');
  return [...new Set(tags)];
}

function makeNotes(card, uiEntry, riskFlags, identityRisk) {
  const notes = [];
  if (!uiEntry) notes.push('母庫有但目前 UI 未收錄');
  if (card.sourceHint === 'rev/image-analysis') notes.push('圖片逆推來源，預設待審');
  if (card.sourceHint === 'v0.27 supplement') notes.push('v0.27 補充來源，需人工確認是否進 UI');
  if (uiEntry && uiEntry.id !== card.id) notes.push(`UI runtime ID 目前為 ${uiEntry.id}，母庫 ID 為 ${card.id}`);
  if (riskFlags.includes('duplicate_title')) notes.push('疑似重複標題');
  if (riskFlags.includes('duplicate_id')) notes.push('疑似重複 ID');
  if (identityRisk.rewrite_needed) notes.push(`身份污染風險 ${identityRisk.style_contamination_risk}，需身份安全改寫`);
  return notes.join('；');
}

function appendNote(notes, note) {
  return notes ? `${notes}；${note}` : note;
}

function countStatuses(entries) {
  const counts = {};
  for (const entry of entries) {
    counts[entry.ui_status] = (counts[entry.ui_status] || 0) + 1;
  }
  return counts;
}

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item) || '(空)';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}
