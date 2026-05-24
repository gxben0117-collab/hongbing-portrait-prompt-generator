#!/usr/bin/env node
/**
 * clean_head_body_proportion.mjs
 *
 * 批次清洗風格範例.md 中的頭身比例高危詞彙
 * 基於 TASK-015 Tier 11 規則
 *
 * 執行：node scripts/clean_head_body_proportion.mjs [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRY_RUN = process.argv.includes('--dry-run');

// Tier 11 替換規則（順序很重要！）
const REPLACEMENT_RULES = [
  // 先處理複合詞，避免部分替換
  { from: /\bidentity-readable three-quarter portrait without enlarging the head portrait shot\b/gi, to: 'identity-readable three-quarter body view without enlarging the head' },
  { from: /\bidentity-readable three-quarter portrait without enlarging the head shot\b/gi, to: 'identity-readable three-quarter body view without enlarging the head' },
  { from: /\bidentity-readable three-quarter portrait without enlarging the head\b/gi, to: 'identity-readable three-quarter body view without enlarging the head' },
  { from: /\bthree-quarter portrait without enlarging the head\b/gi, to: 'three-quarter body view without enlarging the head' },

  // 處理 close up medium shot
  { from: /\bclose up medium shot\b/gi, to: 'balanced body composition' },

  // 處理 three-quarter portrait
  { from: /\bthree-quarter portrait\b/gi, to: 'three-quarter body view' },

  // 處理 portrait composition
  { from: /\bportrait composition\b/gi, to: 'balanced body composition' },

  // 處理 cinematic portrait
  { from: /\bcinematic portrait\b/gi, to: 'documentary body framing' },

  // 處理 portrait framing
  { from: /\bportrait framing\b/gi, to: 'body framing' },

  // 處理 half-body portrait
  { from: /\bhalf-body portrait\b/gi, to: 'three-quarter body view' },

  // 處理 medium shot
  { from: /\bmedium shot\b/gi, to: 'balanced body composition' },

  // 處理 close-up 和 close up
  { from: /\bclose-up\b/gi, to: 'documentary framing' },
  { from: /\bclose up\b/gi, to: 'documentary framing' },

  // 處理動作詞
  { from: /\bwalking toward viewer\b/gi, to: 'standing naturally within the environment' },
  { from: /\bwalking toward camera\b/gi, to: 'positioned naturally in the scene' },
  { from: /\bapproaching viewer\b/gi, to: 'standing naturally within the environment' },
  { from: /\bapproaching camera\b/gi, to: 'positioned naturally in the scene' },

  // 處理眼神詞
  { from: /\bintense eye contact\b/gi, to: 'calm documentary presence' },
  { from: /\bstrong gaze\b/gi, to: 'calm documentary presence' },
  { from: /\bpiercing gaze\b/gi, to: 'calm documentary presence' },
  { from: /\beye look gaze expression\b/gi, to: 'natural observational gaze' },
  { from: /\bdetermined gaze\b/gi, to: 'natural observational gaze' },
  { from: /\beye contact\b/gi, to: 'natural attentive expression' },

  // 處理攝影風格術語
  { from: /\bartistic portraiture\b/gi, to: 'artistic documentary photography' },
  { from: /\bcandid portraiture\b/gi, to: 'candid documentary photography' },
  { from: /\blifestyle portraiture\b/gi, to: 'lifestyle documentary photography' },
  { from: /\bportraiture style\b/gi, to: 'documentary photography style' },
  { from: /\bportraiture\b/gi, to: 'documentary photography' },

  { from: /\bportrait photography finish\b/gi, to: 'documentary photography finish' },
  { from: /\bportrait photography aesthetic\b/gi, to: 'documentary photography aesthetic' },
  { from: /\bportrait photography style\b/gi, to: 'documentary photography style' },
  { from: /\bportrait photography\b/gi, to: 'documentary photography' },

  { from: /\blandscape portrait photography\b/gi, to: 'landscape documentary photography' },
  { from: /\btravel portrait lifestyle\b/gi, to: 'travel documentary lifestyle' },
  { from: /\btravel portrait style\b/gi, to: 'travel documentary style' },
  { from: /\benvironmental portrait photography\b/gi, to: 'environmental documentary photography' },
  { from: /\blifestyle portrait photography\b/gi, to: 'lifestyle documentary photography' },

  { from: /\bportrait photo realism\b/gi, to: 'documentary photo realism' },
  { from: /\bportrait realism\b/gi, to: 'documentary realism' },
  { from: /\bportrait format\b/gi, to: 'documentary format' },
  { from: /\bportrait look\b/gi, to: 'documentary look' },
  { from: /\bportrait style\b/gi, to: 'documentary style' },

  { from: /\bcinematic photography portrait\b/gi, to: 'cinematic documentary photography' },
  { from: /\bsnapshot portrait\b/gi, to: 'snapshot documentary' },
  { from: /\bsharp focus portrait\b/gi, to: 'sharp focus documentary' },
  { from: /\bdramatic portrait\b/gi, to: 'dramatic documentary' },
  { from: /\bquiet portrait\b/gi, to: 'quiet documentary' },

  // 處理 portrait with... 模式
  { from: /\bportrait with face clear\b/gi, to: 'documentary shot with face clear' },
  { from: /\bportrait with clear face\b/gi, to: 'documentary shot with clear face' },
  { from: /\bportrait with face readable\b/gi, to: 'documentary shot with face readable' },
  { from: /\bportrait with face crisp\b/gi, to: 'documentary shot with face crisp' },
  { from: /\bportrait with eyes dominant\b/gi, to: 'documentary shot with eyes dominant' },
  { from: /\bportrait with\b/gi, to: 'documentary shot with' },

  // 處理其他 portrait 複合詞
  { from: /\bportrait file\b/gi, to: 'documentary file' },
  { from: /\bportrait makeup\b/gi, to: 'documentary makeup' },
  { from: /\bportrait snapshot\b/gi, to: 'documentary snapshot' },
  { from: /\bportrait setup\b/gi, to: 'documentary setup' },
  { from: /\bportrait photo still masterwork\b/gi, to: 'documentary photo still masterwork' },
  { from: /\bportrait photo\b/gi, to: 'documentary photo' },
  { from: /\bportrait finish\b/gi, to: 'documentary finish' },
  { from: /\bportrait clarity\b/gi, to: 'documentary clarity' },

  // 最後處理單獨的 portrait（避免誤傷 portrait orientation 等）
  // 只在特定上下文中替換
  { from: /\bportrait shot\b/gi, to: 'body framing shot' },
  { from: /\bportrait without\b/gi, to: 'body view without' },
  { from: /\bportrait of a woman\b/gi, to: 'body view of a woman' },
  { from: /\bportrait of a\b/gi, to: 'body view of a' },
  { from: /\bportrait,\b/gi, to: 'documentary shot,' },
  { from: /\bportrait\.\b/gi, to: 'documentary shot.' },
];

// 安全詞彙（不應該被替換）
const SAFE_CONTEXTS = [
  'portrait orientation',
  'portrait ratio',
  'portrait mode',
  '3:4 portrait',
  '2:3 portrait',
];

function isSafeContext(line) {
  const lowerLine = line.toLowerCase();
  return SAFE_CONTEXTS.some(safe => lowerLine.includes(safe.toLowerCase()));
}

function cleanLine(line) {
  // 跳過安全上下文
  if (isSafeContext(line)) {
    return { line, changed: false };
  }

  let newLine = line;
  let changed = false;

  for (const rule of REPLACEMENT_RULES) {
    const before = newLine;
    newLine = newLine.replace(rule.from, rule.to);
    if (newLine !== before) {
      changed = true;
    }
  }

  return { line: newLine, changed };
}

function cleanFile(filePath) {
  console.log(`\n📄 清洗文件: ${path.basename(filePath)}\n`);

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let changedLines = 0;
  const changes = [];

  const newLines = lines.map((line, index) => {
    const result = cleanLine(line);
    if (result.changed) {
      changedLines++;
      changes.push({
        lineNum: index + 1,
        before: line,
        after: result.line,
      });
    }
    return result.line;
  });

  console.log(`📊 清洗統計：`);
  console.log(`   總行數: ${lines.length}`);
  console.log(`   修改行數: ${changedLines}`);
  console.log(`   修改率: ${((changedLines / lines.length) * 100).toFixed(2)}%\n`);

  if (changes.length > 0) {
    console.log(`🔍 前 10 個修改:\n`);
    changes.slice(0, 10).forEach((change, idx) => {
      console.log(`${idx + 1}. Line ${change.lineNum}`);
      console.log(`   前: ${change.before.trim().substring(0, 80)}...`);
      console.log(`   後: ${change.after.trim().substring(0, 80)}...`);
      console.log('');
    });

    if (changes.length > 10) {
      console.log(`   ... 還有 ${changes.length - 10} 個修改\n`);
    }
  }

  if (DRY_RUN) {
    console.log('🔍 DRY RUN 模式：未實際寫入文件\n');
    return { changedLines, changes };
  }

  // 建立備份
  const backupPath = filePath + '.backup.' + Date.now();
  fs.copyFileSync(filePath, backupPath);
  console.log(`💾 備份已建立: ${path.basename(backupPath)}\n`);

  // 寫入清洗後的內容
  fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
  console.log(`✅ 文件已更新\n`);

  return { changedLines, changes };
}

function generateReport(results) {
  const reportPath = path.join(__dirname, '..', 'reports', 'head_body_proportion_clean.md');
  const reportDir = path.dirname(reportPath);

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  let report = `# 頭身比例高危詞彙清洗報告\n\n`;
  report += `生成時間: ${new Date().toLocaleString('zh-TW')}\n`;
  report += `模式: ${DRY_RUN ? 'DRY RUN（未實際修改）' : '實際清洗'}\n\n`;
  report += `## 總覽\n\n`;
  report += `- 修改行數: ${results.changedLines}\n\n`;
  report += `## 詳細修改\n\n`;

  results.changes.forEach((change, idx) => {
    report += `### ${idx + 1}. Line ${change.lineNum}\n\n`;
    report += `**修改前:**\n\`\`\`\n${change.before}\n\`\`\`\n\n`;
    report += `**修改後:**\n\`\`\`\n${change.after}\n\`\`\`\n\n`;
  });

  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`📝 報告已生成: ${reportPath}\n`);
}

// 主程序
function main() {
  console.log('🧹 頭身比例高危詞彙批次清洗工具');
  console.log('================================\n');

  if (DRY_RUN) {
    console.log('⚠️  DRY RUN 模式：將顯示修改但不實際寫入\n');
  }

  const styleFilePath = path.join(__dirname, '..', '核心資料', '風格範例.md');

  if (!fs.existsSync(styleFilePath)) {
    console.error(`❌ 找不到文件: ${styleFilePath}`);
    process.exit(1);
  }

  const results = cleanFile(styleFilePath);

  if (results.changedLines > 0) {
    generateReport(results);
    console.log(`✅ 清洗完成！修改了 ${results.changedLines} 行`);
  } else {
    console.log('✅ 未發現需要清洗的內容');
  }
}

main();
