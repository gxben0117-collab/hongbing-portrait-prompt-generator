import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT,
  STYLE_MD_PATH,
  ensureDir,
  loadProjectData,
  markdownTable,
} from './lib/style_library.mjs';
import { applyIdentitySafeReplacements, analyzeIdentitySafety } from './lib/identity_safety.mjs';

const backupDir = path.join(ROOT, '核心資料', 'versions');
const backupPath = path.join(backupDir, '20260524_pre_identity_safety_cleanup.md');
const reportPath = path.join(ROOT, 'docs', 'audit', '身份污染清洗報告_20260524.md');
const jsonPath = path.join(ROOT, 'temp', 'identity_contamination_cleanup_20260524.json');

const original = fs.readFileSync(STYLE_MD_PATH, 'utf8');
ensureDir(backupDir);
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, original, 'utf8');
}

const before = loadProjectData().cards.map((card) => ({
  id: card.id,
  title: card.title,
  line: card.startLine,
  analysis: analyzeIdentitySafety(`${card.title}\n${card.block || ''}`),
}));

const next = sanitizeMarkdown(original);
fs.writeFileSync(STYLE_MD_PATH, next, 'utf8');

const afterCards = loadProjectData().cards;
const after = afterCards.map((card) => ({
  id: card.id,
  title: card.title,
  line: card.startLine,
  analysis: analyzeIdentitySafety(`${card.title}\n${card.block || ''}`),
}));

const beforeIssues = before.filter((row) => row.analysis.score > 0);
const afterIssues = after.filter((row) => row.analysis.score > 0);
const changed = changedBlocks(original, next);

ensureDir(path.dirname(reportPath));
fs.writeFileSync(reportPath, [
  '# 身份污染清洗報告',
  '',
  `產生時間：${new Date().toISOString()}`,
  `備份：\`${path.relative(ROOT, backupPath)}\``,
  '',
  '## 摘要',
  '',
  markdownTable([
    ['清洗前命中卡片', beforeIssues.length],
    ['清洗後命中卡片', afterIssues.length],
    ['本次文字異動區塊', changed.length],
    ['母庫卡片數', afterCards.length],
  ], ['項目', '數量']),
  '',
  '## 仍需人工/後續審查 Top 120',
  '',
  afterIssues.length ? markdownTable(afterIssues
    .sort((a, b) => b.analysis.score - a.analysis.score || a.line - b.line)
    .slice(0, 120)
    .map((row) => [
      row.id,
      row.title,
      row.analysis.score,
      row.analysis.level,
      row.analysis.flags.join('、'),
      row.analysis.hits.slice(0, 6).map((hit) => `${hit.flag}:${hit.term}`).join('<br>'),
      `L${row.line}`,
    ]), ['ID', '標題', '分數', '等級', 'flags', '命中詞', '位置']) : '無。',
  '',
].join('\n'), 'utf8');

ensureDir(path.dirname(jsonPath));
fs.writeFileSync(jsonPath, JSON.stringify({
  generated_at: new Date().toISOString(),
  backup_path: path.relative(ROOT, backupPath),
  before_issues: beforeIssues.length,
  after_issues: afterIssues.length,
  changed_blocks: changed.length,
  remaining: afterIssues,
}, null, 2), 'utf8');

console.log(JSON.stringify({
  beforeIssues: beforeIssues.length,
  afterIssues: afterIssues.length,
  changedBlocks: changed.length,
  backupPath,
  reportPath,
  jsonPath,
}, null, 2));

function sanitizeMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  return lines.map((line) => {
    if (/^####\s+/.test(line)) return line;
    return applyIdentitySafeReplacements(line)
      .replace(/^\s*-\s+\*\*/u, (match) => match.replace(/^\s*/, ''))
      .replace(/（/g, '(')
      .replace(/）/g, ')');
  }).join('\n');
}

function changedBlocks(a, b) {
  const left = a.split(/\r?\n/);
  const right = b.split(/\r?\n/);
  const changedRows = [];
  const max = Math.max(left.length, right.length);
  for (let i = 0; i < max; i += 1) {
    if (left[i] !== right[i]) changedRows.push(i + 1);
  }
  return changedRows;
}
