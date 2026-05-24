import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT,
  ensureDir,
  loadProjectData,
  markdownTable,
  writeJson,
} from './lib/style_library.mjs';
import { analyzeIdentitySafety, identityRiskFields } from './lib/identity_safety.mjs';

const reportPath = path.join(ROOT, 'docs', 'audit', '身份污染風險報告_20260524.md');
const jsonPath = path.join(ROOT, 'temp', 'identity_contamination_audit_20260524.json');

const { cards } = loadProjectData();
const rows = cards.map((card) => {
  const text = `${card.title}\n${card.block || ''}`;
  const analysis = analyzeIdentitySafety(text);
  return {
    id: card.id,
    title: card.title,
    line: card.startLine,
    ...identityRiskFields(text),
    hits: analysis.hits,
  };
});

const issueRows = rows
  .filter((row) => row.identity_risk_score > 0)
  .sort((a, b) => b.identity_risk_score - a.identity_risk_score || a.line - b.line);

const summaryByLevel = countBy(rows, (row) => row.style_contamination_risk);
const summaryByFlag = {};
for (const row of rows) {
  for (const flag of row.identity_risk_flags || []) {
    summaryByFlag[flag] = (summaryByFlag[flag] || 0) + 1;
  }
}

const report = [
  '# 身份污染風險報告',
  '',
  `產生時間：${new Date().toISOString()}`,
  '',
  '## 摘要',
  '',
  markdownTable([
    ['母庫卡片數', rows.length],
    ['有身份污染命中', issueRows.length],
    ['rewrite_needed', rows.filter((row) => row.rewrite_needed).length],
    ...Object.entries(summaryByLevel).sort((a, b) => a[0].localeCompare(b[0])),
  ], ['項目', '數量']),
  '',
  '## 風險旗標分布',
  '',
  markdownTable(Object.entries(summaryByFlag).sort((a, b) => b[1] - a[1]), ['risk_flag', '卡片數']),
  '',
  '## 高風險卡片 Top 200',
  '',
  issueRows.length ? markdownTable(issueRows.slice(0, 200).map((row) => [
    row.id,
    row.title,
    row.identity_risk_score,
    row.style_contamination_risk,
    row.identity_risk_flags.join('、'),
    row.hits.slice(0, 8).map((hit) => `${hit.flag}:${hit.term}`).join('<br>'),
    `L${row.line}`,
  ]), ['ID', '標題', '分數', '等級', 'flags', '命中詞', '位置']) : '無。',
  '',
  '## 判斷原則',
  '',
  '- 這份報告只掃身份污染風險，不代表卡片美術品質好壞。',
  '- 高風險詞如果只存在於標題，後續可以保留標題但不得讓人物描述繼承模板臉語意。',
  '- 清洗方向是把人物語言改成 uploaded real person / real-person photographic quality，讓幻想留在環境、服裝、道具與光線。',
  '',
].join('\n');

ensureDir(path.dirname(reportPath));
fs.writeFileSync(reportPath, report, 'utf8');
writeJson(jsonPath, {
  generated_at: new Date().toISOString(),
  summary: {
    cards: rows.length,
    issues: issueRows.length,
    rewrite_needed: rows.filter((row) => row.rewrite_needed).length,
    by_level: summaryByLevel,
    by_flag: summaryByFlag,
  },
  issues: issueRows,
});

console.log(JSON.stringify({
  cards: rows.length,
  issues: issueRows.length,
  rewriteNeeded: rows.filter((row) => row.rewrite_needed).length,
  reportPath,
  jsonPath,
}, null, 2));

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item) || '(空)';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}
