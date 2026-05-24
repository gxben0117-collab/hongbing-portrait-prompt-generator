#!/usr/bin/env node
// Makeup Audit Script v1.0.0
// Scans 風格範例.md and validates all makeup codes against 妝容模組.json

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load makeup module data
const makeupDataPath = join(__dirname, '../核心資料/妝容模組.json');
const styleExamplesPath = join(__dirname, '../核心資料/風格範例.md');

let makeupData;
let styleExamplesContent;

try {
  makeupData = JSON.parse(readFileSync(makeupDataPath, 'utf-8'));
  styleExamplesContent = readFileSync(styleExamplesPath, 'utf-8');
} catch (error) {
  console.error('❌ Failed to load files:', error.message);
  process.exit(1);
}

// Extract all makeup IDs from makeup module
const validMakeupIds = new Set(makeupData.makeups.map(m => m.id));

// Extract all makeup codes from 風格範例.md
const makeupPattern = /^- \*\*妝容：\*\* (.+)$/gm;
const matches = [...styleExamplesContent.matchAll(makeupPattern)];

const usedMakeups = new Map(); // makeup_id -> count
const invalidMakeups = new Map(); // invalid_id -> {count, lines}
const riskStats = {
  low: 0,
  medium: 0,
  high: 0
};

// Count makeup usage
matches.forEach((match, index) => {
  const makeupId = match[1].trim();
  const lineNumber = styleExamplesContent.substring(0, match.index).split('\n').length;

  if (validMakeupIds.has(makeupId)) {
    usedMakeups.set(makeupId, (usedMakeups.get(makeupId) || 0) + 1);

    // Count risk levels
    const makeup = makeupData.makeups.find(m => m.id === makeupId);
    if (makeup && makeup.riskLevel) {
      riskStats[makeup.riskLevel]++;
    }
  } else {
    if (!invalidMakeups.has(makeupId)) {
      invalidMakeups.set(makeupId, { count: 0, lines: [] });
    }
    const entry = invalidMakeups.get(makeupId);
    entry.count++;
    entry.lines.push(lineNumber);
  }
});

// Generate report
console.log('═══════════════════════════════════════════');
console.log('妝容稽核報告 (Makeup Audit Report)');
console.log('═══════════════════════════════════════════\n');

console.log(`📊 總計掃描: ${matches.length} 個妝容引用`);
console.log(`✅ 有效妝容代碼: ${usedMakeups.size} 種`);
console.log(`❌ 無效妝容代碼: ${invalidMakeups.size} 種\n`);

// Invalid makeups (critical issues)
if (invalidMakeups.size > 0) {
  console.log('❌ 無效妝容代碼 (需要修正):');
  console.log('─────────────────────────────────────────');
  for (const [id, data] of invalidMakeups) {
    console.log(`  • "${id}" - 使用 ${data.count} 次`);
    console.log(`    行號: ${data.lines.join(', ')}`);
  }
  console.log('');
}

// Risk level statistics
console.log('⚠️  風險等級統計:');
console.log('─────────────────────────────────────────');
console.log(`  🟢 低風險 (low):    ${riskStats.low} 個 (${((riskStats.low / matches.length) * 100).toFixed(1)}%)`);
console.log(`  🟡 中風險 (medium): ${riskStats.medium} 個 (${((riskStats.medium / matches.length) * 100).toFixed(1)}%)`);
console.log(`  🔴 高風險 (high):   ${riskStats.high} 個 (${((riskStats.high / matches.length) * 100).toFixed(1)}%)`);
console.log('');

// High-risk makeups in use
const highRiskMakeups = makeupData.makeups.filter(m => m.riskLevel === 'high');
const usedHighRiskMakeups = highRiskMakeups.filter(m => usedMakeups.has(m.id));

if (usedHighRiskMakeups.length > 0) {
  console.log('🔴 使用中的高風險妝容 (需要監控):');
  console.log('─────────────────────────────────────────');
  for (const makeup of usedHighRiskMakeups) {
    const count = usedMakeups.get(makeup.id);
    console.log(`  • ${makeup.name} (${makeup.id}) - 使用 ${count} 次`);
    console.log(`    分類: ${makeup.category}`);
    if (makeup.warnings && makeup.warnings.length > 0) {
      makeup.warnings.forEach(warning => {
        console.log(`    ⚠️  ${warning}`);
      });
    }
  }
  console.log('');
}

// Unused makeups
const unusedMakeups = makeupData.makeups.filter(m => !usedMakeups.has(m.id));
if (unusedMakeups.length > 0) {
  console.log(`ℹ️  未使用的妝容 (${unusedMakeups.length} 個):`);
  console.log('─────────────────────────────────────────');
  const unusedByCategory = {};
  unusedMakeups.forEach(m => {
    if (!unusedByCategory[m.category]) {
      unusedByCategory[m.category] = [];
    }
    unusedByCategory[m.category].push(m);
  });

  for (const [category, makeups] of Object.entries(unusedByCategory)) {
    console.log(`  ${category}: ${makeups.map(m => m.id).join(', ')}`);
  }
  console.log('');
}

// Most used makeups
const sortedByUsage = [...usedMakeups.entries()].sort((a, b) => b[1] - a[1]);
console.log('📈 使用次數最多的妝容 (Top 10):');
console.log('─────────────────────────────────────────');
sortedByUsage.slice(0, 10).forEach(([id, count], index) => {
  const makeup = makeupData.makeups.find(m => m.id === id);
  const riskIcon = makeup.riskLevel === 'high' ? '🔴' : makeup.riskLevel === 'medium' ? '🟡' : '🟢';
  console.log(`  ${index + 1}. ${riskIcon} ${makeup.name} (${id}) - ${count} 次`);
});
console.log('');

// Summary
console.log('═══════════════════════════════════════════');
console.log('總結:');
console.log('═══════════════════════════════════════════');

if (invalidMakeups.size === 0) {
  console.log('✅ 所有妝容代碼都有效！');
} else {
  console.log(`❌ 發現 ${invalidMakeups.size} 個無效妝容代碼，需要修正。`);
}

const highRiskPercentage = (riskStats.high / matches.length) * 100;
if (highRiskPercentage > 20) {
  console.log(`⚠️  高風險妝容佔比 ${highRiskPercentage.toFixed(1)}% (超過 20%)，建議降低使用。`);
} else {
  console.log(`✅ 高風險妝容佔比 ${highRiskPercentage.toFixed(1)}% (低於 20%)。`);
}

console.log('');

// Exit with error code if there are invalid makeups
if (invalidMakeups.size > 0) {
  process.exit(1);
}
