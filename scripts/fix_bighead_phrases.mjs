// Fix all remaining big-head trigger phrases in CATS entries (index.html) and TPLS (core.js)
import { readFileSync, writeFileSync } from 'fs';

const BASE = 'C:\\AIProjects\\測試區\\紅兵風格寫真咒語產生器';

// ── 1. Patch CATS entries in index.html ────────────────────────────────────
let html = readFileSync(`${BASE}\\index.html`, 'utf-8');

// Order matters: longer/more-specific phrases first
const COMP_REPLACEMENTS = [
  // face as focal point → natural proportion
  ['face as the focal point of power',         'face clearly readable in natural proportion'],
  // face dominant variants
  ['face dominant and clear',                  'face and body clearly readable with natural proportions'],
  ['face dominant and clearly lit',            'face clearly lit with natural proportions'],
  ['face dominant with gothic quality',        'face clearly readable'],
  ['face dominant with character intensity',   'face clearly readable'],
  ['face dominant with martial spirit',        'face clearly readable with martial spirit'],
  ['face dominant',                            'face clearly readable'],
  // face prominent
  ['face prominent',                           'face clearly readable'],
  // medium to full body → full body
  ['medium to full body',                      'full body'],
  // cinematic close → editorial
  ['cinematic close composition',              'editorial composition'],
  // medium portrait → three-quarter body
  ['medium portrait',                          'three-quarter body'],
  // medium shot → three-quarter body
  ['medium shot',                              'three-quarter body'],
];

let compFixed = 0;
COMP_REPLACEMENTS.forEach(([from, to]) => {
  const before = html.split(from).length - 1;
  html = html.split(from).join(to);
  if (before > 0) { console.log(`CATS: ${before}x "${from}" → "${to}"`); compFixed += before; }
});

writeFileSync(`${BASE}\\index.html`, html, 'utf-8');
console.log(`\nTotal CATS fixes: ${compFixed}\n`);

// ── 2. Patch TPLS in core.js ───────────────────────────────────────────────
let js = readFileSync(`${BASE}\\core.js`, 'utf-8');

const TPL_REPLACEMENTS = [
  // gothic.light: remove low-key cinematic lighting language
  [
    `light:'low-key cinematic lighting, controlled face key light, deep shadows, crimson or violet rim light',`,
    `light:'controlled studio lighting with atmospheric shadows, precise face key light, deep selective highlights with dark crimson or violet rim',`,
  ],
  // darkfantasy.light: remove dramatic low-key cinematic lighting
  [
    `light:'dramatic low-key cinematic lighting, strong atmospheric rim, deep shadows with selective highlights, sinister or moonlit atmospheric haze',`,
    `light:'dramatic controlled studio lighting, strong atmospheric rim, deep shadows with selective highlights, sinister atmospheric depth',`,
  ],
  // queen.light: remove "cinematic face key light"
  [
    `light:'cinematic face key light, atmosphere-matched rim light, premium period-drama lighting, clear readable facial identity',\n    outfit:'majestic queen couture`,
    `light:'controlled face key light, atmosphere-matched rim light, premium period-drama lighting, clear readable facial identity',\n    outfit:'majestic queen couture`,
  ],
  // spirits.light: same pattern
  [
    `light:'cinematic face key light, atmosphere-matched rim light, premium period-drama lighting, clear readable facial identity',\n    outfit:'elaborate spirit-queen`,
    `light:'controlled face key light, atmosphere-matched rim light, premium period-drama lighting, clear readable facial identity',\n    outfit:'elaborate spirit-queen`,
  ],
  // drama.comp: low-angle → eye-level
  [
    `low-angle or dynamic side framing`,
    `eye-level or dynamic side framing`,
  ],
  // xianxia.comp: poster-like → editorial
  [
    `poster-like framing`,
    `editorial framing with natural proportions`,
  ],
  // CATEGORY_POSE_LIBRARY wedding comp: face large enough
  [
    `face large enough to preserve identity`,
    `face clearly readable while preserving identity`,
  ],
];

let tplFixed = 0;
TPL_REPLACEMENTS.forEach(([from, to]) => {
  if (js.includes(from)) {
    js = js.split(from).join(to);
    console.log(`TPLS: fixed "${from.slice(0,60).replace(/\n/g,' ')}..."`);
    tplFixed++;
  } else {
    console.log(`TPLS: NOT FOUND — "${from.slice(0,60).replace(/\n/g,' ')}"`);
  }
});

writeFileSync(`${BASE}\\core.js`, js, 'utf-8');
console.log(`\nTotal TPLS fixes: ${tplFixed}`);
