import { readFileSync, writeFileSync } from 'fs';

const BASE = 'C:\\AIProjects\\測試區\\紅兵風格寫真咒語產生器';

// 100 cinematic names for theme_01 (index 0–99)
// 10 settings × 10 variants
const NAMES = [
  // ─ 地獄宮殿 (entries 1–10) ─ user-provided
  '女王臨世','一眼萬年','惡魔契約','權利巔峰','君臨天下',
  '欲罷不能','暗黑執念','步履高高','傾城一瞥','生人勿近',

  // ─ 黑玫瑰園 (entries 11–20) ─ user-provided
  '絕地玫瑰','冷豔帶刺','黑夜密碼','血色加冕','暗夜微醺',
  '致命溫柔','孤芳自賞','婀娜搖曳','裙擺生風','靜謐花夜',

  // ─ 夢境幻域 (entries 21–30) ─ user-provided 21–28, completed 29–30
  '墜入深淵','看穿靈魂','幻夢低語','執掌迷宮','夜行蝶影',
  '靈魂共振','半夢半醒','霧中起舞','夢迴千轉','永夜無聲',

  // ─ 深海魔域 (entries 31–40)
  '深海沉淪','萬里深淵','海底低語','深海稱霸','暗流巡遊',
  '珠光蠱惑','深淵獨白','暗流前進','水袖回眸','深海孤影',

  // ─ 火焰聖殿 (entries 41–50)
  '烈焰降世','炎中獨醒','火中低喚','炎帝至尊','踏焰巡行',
  '焰光蠱惑','灰燼往事','踏火前行','鳳凰翻身','烈焰傲立',

  // ─ 暗鏡長廊 (entries 51–60)
  '鏡中降世','千鏡一眼','鏡像低喚','執鏡稱王','鏡廊漫行',
  '鏡中蛇魅','鏡前入定','暗廊步步','鏡前回眸','冷鏡孤影',

  // ─ 血月荒野 (entries 61–70)
  '血月降世','月下冷眸','荒野呼魂','荒原之主','血月巡野',
  '月下蠱惑','荒野冥思','荒原疾行','月下回眸','血月孤影',

  // ─ 幽暗森林 (entries 71–80)
  '幽林降臨','暗林深眸','暗林低喚','幽林稱霸','暗林巡行',
  '幽林蠱惑','幽暗獨醒','幽林步步','幽林回眸','幽林孤影',

  // ─ 黑曜高台 (entries 81–90)
  '高台臨世','俯視蒼生','高台低喚','黑曜至尊','高台巡覽',
  '高處蠱惑','高台冥思','高台步步','高台回眸','黑曜孤影',

  // ─ 暗晶洞窟 (entries 91–100)
  '晶洞降世','晶中凝眸','晶洞低喚','晶窟稱霸','晶窟巡行',
  '晶光蠱惑','晶中入定','晶洞前行','晶前回眸','晶洞孤影',
];

// Patch index.html
let html = readFileSync(`${BASE}\\index.html`, 'utf-8');
const m = html.match(/const CATS = (\[[\s\S]*?\]);\s*\n\nlet curCatID/);
if (!m) { console.error('CATS not found'); process.exit(1); }
const CATS = JSON.parse(m[1]);
const t01 = CATS.find(c => c.id === 'theme_01');

if (!t01) { console.error('theme_01 not found'); process.exit(1); }
if (t01.entries.length !== 100) { console.error('Expected 100 entries, got', t01.entries.length); process.exit(1); }
if (NAMES.length !== 100) { console.error('NAMES array must have 100 entries, has', NAMES.length); process.exit(1); }

t01.entries.forEach((e, i) => {
  const oldName = e.name;
  e.name = NAMES[i];
  console.log(`t01_${String(i+1).padStart(2,'0')}: ${oldName} → ${NAMES[i]}`);
});

// Write back
const newCatsJson = JSON.stringify(CATS, null, 2);
html = html.replace(/const CATS = \[[\s\S]*?\];\s*\n\nlet curCatID/,
  `const CATS = ${newCatsJson};\n\nlet curCatID`);

writeFileSync(`${BASE}\\index.html`, html, 'utf-8');
console.error('\nDone — index.html updated');
