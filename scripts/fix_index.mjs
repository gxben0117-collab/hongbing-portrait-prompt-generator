import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('index.html', 'utf8');

// ── 1. Fix invalid MK IDs in entry data ──
const mkMap = [
  ['"mk": "dark_empress"',           '"mk": "imperial_empress"'],
  ['"mk": "sorrow_gothic"',          '"mk": "gothic"'],
  ['"mk": "natural_rustic"',         '"mk": "natural_clean"'],
  ['"mk": "ancient_regal"',          '"mk": "gongting"'],
  ['"mk": "ethereal_regal figure"',  '"mk": "xianxia"'],
  ['"mk": "pure_vixen"',             '"mk": "fox"'],
  ['"mk": "martial_chic"',           '"mk": "wuxia"'],
  ['"mk": "classical_han"',          '"mk": "gudian_hong"'],
  ['"mk": "qing_palace"',            '"mk": "gongting"'],
  ['"mk": "vintage_glam"',           '"mk": "luxury_glam"'],
  ['"mk": "tang_splendor"',          '"mk": "tang_peony_soft"'],
  ['"mk": "high_fantasy_immortal"',  '"mk": "xianxia"'],
  ['"mk": "travel_fresh"',           '"mk": "outdoor_glow"'],
  ['"mk": "exotic_sun-kissed"',      '"mk": "global_sun"'],
  ['"mk": "elven_ethereal"',         '"mk": "flower_fairy"'],
  ['"mk": "cyber_neon"',             '"mk": "cyber_idol"'],
  ['"mk": "high_end_bridal"',        '"mk": "wedding"'],
];

let mkFixed = 0;
for (const [from, to] of mkMap) {
  const count = content.split(from).length - 1;
  content = content.split(from).join(to);
  mkFixed += count;
  if (count > 0) console.log(`  Fixed "${from}" × ${count}`);
}
console.log(`MK IDs fixed: ${mkFixed} total`);

// ── 2. Fix mixed Chinese chars in English prompt fields ──
const fieldFixes = [
  [
    'realistic人像"',
    'realistic portrait"'
  ],
  [
    '"scene": "grand上古 mystical palace courtyard',
    '"scene": "grand ancient mystical palace courtyard'
  ],
  [
    '"outfit": "elegant traditional pink wrap襕裙 silk dress with fine lace border patterns"',
    '"outfit": "elegant traditional pink wrap-skirt silk dress with fine lace border patterns"'
  ],
  [
    '"outfit": "traditional Han dynasty pastel pink wrap襕裙 with delicate embroidery"',
    '"outfit": "traditional Han dynasty pastel pink wrap-skirt with delicate embroidery"'
  ],
  [
    '"outfit": "simple lightweight pink cotton daily inner clothing襕裙 dress, messy playful hair style braids"',
    '"outfit": "simple lightweight pink cotton daily inner ru-qun dress, messy playful hair style braids"'
  ],
  [
    'hat cone斗笠 prop casting deep shadow on upper eyes face line"',
    'conical hat prop casting deep shadow on upper eyes face line"'
  ],
  [
    '"outfit": "elegant traditional pink wrap襕裙 silk dress gown package with delicate flower embroidery lace details, holding a needle thread prop"',
    '"outfit": "elegant traditional pink wrap-skirt silk dress gown with delicate flower embroidery lace details, holding a needle thread prop"'
  ],
  [
    'hat cone斗笠 prop asset tied on her upper back torso area layout line details"',
    'conical dou-li hat prop tied on her upper back torso area layout line details"'
  ],
];

let fieldFixed = 0;
for (const [from, to] of fieldFixes) {
  if (content.includes(from)) {
    content = content.split(from).join(to);
    fieldFixed++;
    console.log('Field fixed: ' + from.slice(0, 70));
  } else {
    console.warn('NOT FOUND: ' + from.slice(0, 70));
  }
}
console.log(`Field fixes applied: ${fieldFixed}/8`);

// ── 3. Update footer version ──
const OLD_VER = '紅兵開發 \xB7 v1.0.0 \xB7 核心規範 v1.6';
const NEW_VER = '紅兵開發 \xB7 v1.0.2 \xB7 核心規範 v1.6';
if (content.includes(OLD_VER)) {
  content = content.split(OLD_VER).join(NEW_VER);
  console.log('Footer version: v1.0.0 → v1.0.2');
} else {
  console.warn('Footer version string not found');
}

writeFileSync('index.html', content, 'utf8');
console.log('index.html saved. Size:', content.length, 'chars');
