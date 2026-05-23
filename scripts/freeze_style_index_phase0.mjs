import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  HTML_PATH,
  ROOT,
  STYLE_MD_PATH,
  ensureDir,
  markdownTable,
  readText,
} from './lib/style_library.mjs';

const freezeId = 'style-index-plan-v1';
const auditId = 'audit-20260523';
const freezeDir = path.join(ROOT, '核心資料', 'versions', '20260523_phase0_freeze_style-index-plan-v1');
const reportPath = path.join(ROOT, 'docs', 'audit', 'phase0_備份與凍結規則_20260523.md');

const sourceFiles = [
  STYLE_MD_PATH,
  HTML_PATH,
  path.join(ROOT, 'core.js'),
  path.join(ROOT, 'prompt_governance.js'),
  path.join(ROOT, 'ai-task.md'),
];

function hashFile(filePath) {
  return createHash('sha256').update(readText(filePath)).digest('hex').toUpperCase();
}

ensureDir(freezeDir);
ensureDir(path.dirname(reportPath));

const rows = [];
for (const filePath of sourceFiles) {
  const basename = path.basename(filePath);
  const backupPath = path.join(freezeDir, basename);
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }
  rows.push([
    path.relative(ROOT, filePath),
    path.relative(ROOT, backupPath),
    hashFile(backupPath),
  ]);
}

const sums = rows.map(([source, backup, hash]) => `${hash}  ${source}  ->  ${backup}`).join('\n');
fs.writeFileSync(path.join(freezeDir, 'SHA256SUMS.txt'), `${sums}\n`, 'utf8');

const report = [
  '# Phase 0 備份與凍結規則',
  '',
  `產生時間：${new Date().toISOString()}`,
  `整理版本標記：\`${freezeId}\``,
  `盤點標記：\`${auditId}\``,
  '',
  '## 備份清單',
  '',
  markdownTable(rows, ['正式檔案', '備份檔案', 'SHA256']),
  '',
  '## 凍結規則',
  '',
  '- 不直接刪除 `核心資料/風格範例.md` 的任何卡片。',
  '- 不直接把未審資料推進 UI。',
  '- 不直接重排母庫全文。',
  '- 所有新增資料預設 `review`。',
  '- Phase 1-9 只能透過索引、報告、腳本或相容式 UI metadata 推進。',
  '- Phase 10 母庫清理必須等索引與檢查腳本穩定後再逐筆處理。',
  '',
  '## 完成判定',
  '',
  '- 備份檔已存在於 `核心資料/versions/20260523_phase0_freeze_style-index-plan-v1/`。',
  '- `SHA256SUMS.txt` 已記錄檔案雜湊。',
  '- 本報告記錄本輪流程與凍結規則。',
  '',
].join('\n');

fs.writeFileSync(reportPath, report, 'utf8');

console.log(JSON.stringify({
  freezeId,
  auditId,
  backupDir: freezeDir,
  reportPath,
  files: rows.length,
}, null, 2));
