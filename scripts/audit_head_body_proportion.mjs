#!/usr/bin/env node
/**
 * audit_head_body_proportion.mjs
 *
 * 掃描風格範例.md 中的頭身比例高危詞彙
 * 基於 TASK-015 Tier 11 規則
 *
 * 執行：node scripts/audit_head_body_proportion.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tier 11 高危詞彙清單
const TIER11_PATTERNS = [
  // 肖像構圖詞
  { pattern: /\bportrait\b/gi, replacement: 'body framing', category: 'Portrait Framing', risk: 'HIGH' },
  { pattern: /\bhalf-body portrait\b/gi, replacement: 'three-quarter body view', category: 'Portrait Framing', risk: 'HIGH' },
  { pattern: /\bmedium shot\b/gi, replacement: 'balanced body composition', category: 'Portrait Framing', risk: 'HIGH' },
  { pattern: /\bclose up\b/gi, replacement: 'documentary framing', category: 'Portrait Framing', risk: 'HIGH' },
  { pattern: /\bclose-up\b/gi, replacement: 'documentary framing', category: 'Portrait Framing', risk: 'HIGH' },
  { pattern: /\bclose up medium shot\b/gi, replacement: 'balanced body composition', category: 'Portrait Framing', risk: 'HIGH' },
  { pattern: /\bthree-quarter portrait\b/gi, replacement: 'three-quarter body view', category: 'Portrait Framing', risk: 'HIGH' },
  { pattern: /\bportrait composition\b/gi, replacement: 'balanced body composition', category: 'Portrait Framing', risk: 'HIGH' },
  { pattern: /\bcinematic portrait\b/gi, replacement: 'documentary body framing', category: 'Portrait Framing', risk: 'HIGH' },
  { pattern: /\bportrait framing\b/gi, replacement: 'body framing', category: 'Portrait Framing', risk: 'HIGH' },

  // 動作詞
  { pattern: /\bwalking toward viewer\b/gi, replacement: 'standing naturally within the environment', category: 'Motion', risk: 'HIGH' },
  { pattern: /\bwalking toward camera\b/gi, replacement: 'positioned naturally in the scene', category: 'Motion', risk: 'HIGH' },
  { pattern: /\bapproaching viewer\b/gi, replacement: 'standing naturally within the environment', category: 'Motion', risk: 'HIGH' },
  { pattern: /\bapproaching camera\b/gi, replacement: 'positioned naturally in the scene', category: 'Motion', risk: 'HIGH' },

  // 眼神詞
  { pattern: /\beye contact\b/gi, replacement: 'natural attentive expression', category: 'Gaze', risk: 'MEDIUM' },
  { pattern: /\bintense eye contact\b/gi, replacement: 'calm documentary presence', category: 'Gaze', risk: 'HIGH' },
  { pattern: /\bstrong gaze\b/gi, replacement: 'calm documentary presence', category: 'Gaze', risk: 'HIGH' },
  { pattern: /\bdetermined gaze\b/gi, replacement: 'natural observational gaze', category: 'Gaze', risk: 'MEDIUM' },
  { pattern: /\bpiercing gaze\b/gi, replacement: 'calm documentary presence', category: 'Gaze', risk: 'HIGH' },
  { pattern: /\beye look gaze expression\b/gi, replacement: 'natural observational gaze', category: 'Gaze', risk: 'HIGH' },

  // 禁用詞（無替代，直接標記）
  { pattern: /\bportrait compression\b/gi, replacement: '[REMOVE]', category: 'Banned', risk: 'CRITICAL' },
  { pattern: /\bbeauty-shot framing\b/gi, replacement: '[REMOVE]', category: 'Banned', risk: 'CRITICAL' },
  { pattern: /\bfashion-editorial face emphasis\b/gi, replacement: '[REMOVE]', category: 'Banned', risk: 'CRITICAL' },
  { pattern: /\bhero-shot perspective\b/gi, replacement: '[REMOVE]', category: 'Banned', risk: 'CRITICAL' },
];

// 安全詞彙（不應該被替換）
const SAFE_PATTERNS = [
  /\bportrait orientation\b/gi,  // 直式構圖
  /\bportrait ratio\b/gi,         // 肖像比例
  /\bportrait mode\b/gi,          // 肖像模式（相機設定）
];

function isSafeContext(text, matchIndex) {
  const contextStart = Math.max(0, matchIndex - 30);
  const contextEnd = Math.min(text.length, matchIndex + 30);
  const context = text.substring(contextStart, contextEnd);

  for (const safePattern of SAFE_PATTERNS) {
    if (safePattern.test(context)) {
      return true;
    }
  }
  return false;
}

function scanFile(filePath) {
  console.log(`\n📄 掃描文件: ${path.basename(filePath)}\n`);

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const findings = [];
  let totalMatches = 0;
  const categoryStats = {};
  const riskStats = { CRITICAL: 0, HIGH: 0, MEDIUM: 0 };

  lines.forEach((line, lineIndex) => {
    TIER11_PATTERNS.forEach(({ pattern, replacement, category, risk }) => {
      const matches = [...line.matchAll(pattern)];

      matches.forEach(match => {
        const matchIndex = match.index;

        // 檢查是否在安全上下文中
        if (isSafeContext(line, matchIndex)) {
          return;
        }

        totalMatches++;
        categoryStats[category] = (categoryStats[category] || 0) + 1;
        riskStats[risk] = (riskStats[risk] || 0) + 1;

        findings.push({
          line: lineIndex + 1,
          match: match[0],
          replacement,
          category,
          risk,
          context: line.trim().substring(0, 100) + (line.length > 100 ? '...' : ''),
        });
      });
    });
  });

  // 輸出統計
  console.log('📊 掃描統計：');
  console.log(`   總匹配數: ${totalMatches}`);
  console.log(`   風險分布:`);
  console.log(`     🔴 CRITICAL: ${riskStats.CRITICAL}`);
  console.log(`     🟠 HIGH: ${riskStats.HIGH}`);
  console.log(`     🟡 MEDIUM: ${riskStats.MEDIUM}`);
  console.log(`\n   類別分布:`);
  Object.entries(categoryStats).forEach(([cat, count]) => {
    console.log(`     ${cat}: ${count}`);
  });

  // 輸出前 20 個發現
  if (findings.length > 0) {
    console.log(`\n🔍 前 20 個發現:\n`);
    findings.slice(0, 20).forEach((finding, idx) => {
      const riskIcon = finding.risk === 'CRITICAL' ? '🔴' : finding.risk === 'HIGH' ? '🟠' : '🟡';
      console.log(`${idx + 1}. ${riskIcon} Line ${finding.line} [${finding.category}]`);
      console.log(`   匹配: "${finding.match}"`);
      console.log(`   建議: "${finding.replacement}"`);
      console.log(`   上下文: ${finding.context}`);
      console.log('');
    });

    if (findings.length > 20) {
      console.log(`   ... 還有 ${findings.length - 20} 個發現\n`);
    }
  } else {
    console.log('\n✅ 未發現高危詞彙\n');
  }

  return { findings, totalMatches, categoryStats, riskStats };
}

function generateReport(results) {
  const reportPath = path.join(__dirname, '..', 'reports', 'head_body_proportion_audit.md');
  const reportDir = path.dirname(reportPath);

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  let report = `# 頭身比例高危詞彙稽核報告\n\n`;
  report += `生成時間: ${new Date().toLocaleString('zh-TW')}\n\n`;
  report += `## 總覽\n\n`;
  report += `- 總匹配數: ${results.totalMatches}\n`;
  report += `- 風險分布:\n`;
  report += `  - 🔴 CRITICAL: ${results.riskStats.CRITICAL}\n`;
  report += `  - 🟠 HIGH: ${results.riskStats.HIGH}\n`;
  report += `  - 🟡 MEDIUM: ${results.riskStats.MEDIUM}\n\n`;
  report += `## 類別分布\n\n`;
  Object.entries(results.categoryStats).forEach(([cat, count]) => {
    report += `- ${cat}: ${count}\n`;
  });
  report += `\n## 詳細發現\n\n`;

  results.findings.forEach((finding, idx) => {
    const riskIcon = finding.risk === 'CRITICAL' ? '🔴' : finding.risk === 'HIGH' ? '🟠' : '🟡';
    report += `### ${idx + 1}. ${riskIcon} Line ${finding.line} [${finding.category}]\n\n`;
    report += `- **匹配**: \`${finding.match}\`\n`;
    report += `- **建議替換**: \`${finding.replacement}\`\n`;
    report += `- **風險等級**: ${finding.risk}\n`;
    report += `- **上下文**: ${finding.context}\n\n`;
  });

  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`\n📝 報告已生成: ${reportPath}\n`);
}

// 主程序
function main() {
  console.log('🔍 頭身比例高危詞彙稽核工具');
  console.log('================================\n');

  const styleFilePath = path.join(__dirname, '..', '核心資料', '風格範例.md');

  if (!fs.existsSync(styleFilePath)) {
    console.error(`❌ 找不到文件: ${styleFilePath}`);
    process.exit(1);
  }

  const results = scanFile(styleFilePath);

  if (results.totalMatches > 0) {
    generateReport(results);
    console.log('⚠️  發現高危詞彙，建議進行批次清洗');
    process.exit(1);
  } else {
    console.log('✅ 所有檢查通過！');
    process.exit(0);
  }
}

main();
