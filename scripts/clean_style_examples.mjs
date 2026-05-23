import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT,
  STYLE_MD_PATH,
  buildDuplicateInfo,
  ensureDir,
  markdownTable,
  missingFields,
  parseCards,
  parseCodeValue,
} from './lib/style_library.mjs';

const REPORT_PATH = path.join(ROOT, 'docs', 'audit', '風格範例_清理報告_20260523.md');
const JSON_PATH = path.join(ROOT, 'temp', 'style_examples_cleanup_20260523.json');
const BACKUP_DIR = path.join(ROOT, '核心資料', 'versions');
const BACKUP_PATH = path.join(BACKUP_DIR, '20260523_pre_style_examples_cleanup.md');

const CORE_FIELDS = [
  'ID',
  '妝容',
  '場景背景',
  '光線',
  '服裝',
  '動作與鏡頭',
  '構圖',
  '特效',
  '色調',
  '鏡頭角度',
  '圖片比例',
  '鏡頭焦段',
  '燈光風格',
  '整體氛圍',
  '鏡頭語言',
];

const OPTIONAL_FIELD_ORDER = ['妝容描述', '來源檔名', '原始ID'];

const CAMERA_META = {
  ratio: {
    r_34: '3:4 直式人像，適合臉部可讀的半身到三分之二人像',
    r_23: '2:3 直式，適合完整服裝、姿勢與場景縱深',
    r_916: '9:16 手機直式，適合旅拍、地點感與社群直式輸出',
    r_169: '16:9 電影橫幅，適合大場景、山海或宏觀環境',
    r_11: '1:1 正方，僅作乾淨人像構圖使用',
    r_43: '4:3 橫式，適合地點環境與人物互動',
  },
  lens: {
    l_50: '50mm 自然視角，保護頭身比例、完整服裝與真實肩頸連接',
  },
  ang: {
    sanfen: '鎖臉微側，臉部只允許 10-15 度自然微轉，肩身可配合場景',
    zheng: '正面人像，臉正對鏡頭，適合強眼神與乾淨構圖',
    banshen: '半身人像，腰部以上，保留手部道具但不可遮五官',
    quan: '全身人像，頭到腳完整可讀，身體姿勢配合頭臉自然對齊',
    huanjing: '環境人像，人物融入場景但臉部仍清楚可辨',
  },
  light: {
    ls_golden: '黃金時刻或暖色自然光，柔和修飾但不改變五官',
    ls_natural: '自然日光或柔和環境光，真實清透、身份最穩',
    ls_studio: '棚拍控制光，適合時尚、宮廷、近景與高級寫真',
    ls_cinematic: '電影戲劇光，保留臉部主光，陰影不可吞掉五官',
  },
  atm: {
    at_clear: '晴空清透，背景乾淨、人物輪廓明確',
    at_misty: '輕霧朦朧，只放在背景與邊緣，不遮臉',
    at_warm: '暖光環繞，適合宮廷、婚紗、柔和故事感',
    at_moody: '暗黑氛圍，深影與輪廓光並存，臉部必須清楚',
  },
  camLang: {
    cl_fashion: '時尚大片語言，姿勢與服裝線條明確但不誇張扭身',
    cl_magazine: '雜誌封面語言，主體清楚、比例穩定、眼神有焦點',
    cl_social: '社群美圖語言，乾淨好讀、自然互動、地點感明確',
  },
};

const VALID = {
  ratio: new Set(Object.keys(CAMERA_META.ratio)),
  lens: new Set(Object.keys(CAMERA_META.lens)),
  ang: new Set(Object.keys(CAMERA_META.ang)),
  light: new Set(Object.keys(CAMERA_META.light)),
  atm: new Set(Object.keys(CAMERA_META.atm)),
  camLang: new Set(Object.keys(CAMERA_META.camLang)),
};

const MAKEUP_ALIASES = {
  ancient_regal: 'imperial_empress',
  classical_han: 'gudian_hong',
  cyber_neon: 'cyber',
  dark_empress: 'demon_lord',
  dark_gothic: 'gothic',
  elven_ethereal: 'flower_fairy',
  'ethereal_regal figure': 'oracle_gold',
  ethereal_goddess: 'oracle_gold',
  exotic_sun: 'global_sun',
  high_end_bridal: 'wedding',
  high_fantasy_immortal: 'xianxia',
  martial_chic: 'wuxia',
  natural_rustic: 'natural_clean',
  pure_vixen: 'fox',
  qing_palace: 'gongting',
  sorrow_gothic: 'fallen_angel',
  tang_splendor: 'tang_peony_soft',
  travel_fresh: 'outdoor_glow',
  vintage_glam: 'hk_film',
};

const FIELD_LABELS = new Set([...CORE_FIELDS, ...OPTIONAL_FIELD_ORDER]);

function loadValidMakeupIds() {
  const core = fs.readFileSync(path.join(ROOT, 'core.js'), 'utf8');
  const match = core.match(/const MK = \[([\s\S]*?)\];/);
  if (!match) return new Set(Object.values(MAKEUP_ALIASES));
  return new Set([...match[1].matchAll(/\bid:'([^']+)'/g)].map((row) => row[1]));
}

const VALID_MAKEUP_IDS = loadValidMakeupIds();

function normalizeFieldLabels(text) {
  let next = text;
  for (const label of FIELD_LABELS) {
    if (label === 'ID') {
      next = next.replace(new RegExp(`^- \\*\\*${escapeRegExp(label)}[:：]{1,2}\\*\\*`, 'gm'), '- **ID:**');
    } else {
      next = next.replace(new RegExp(`^- \\*\\*${escapeRegExp(label)}[:：]{1,2}\\*\\*`, 'gm'), `- **${label}：**`);
    }
  }
  return next;
}

function splitSegments(text) {
  const lines = text.split(/\r?\n/);
  const segments = [];
  let current = { type: 'text', lines: [] };

  function pushCurrent() {
    if (!current || current.lines.length === 0) return;
    segments.push(current);
  }

  for (const line of lines) {
    if (/^####\s+/.test(line)) {
      pushCurrent();
      current = { type: 'card', lines: [line] };
      continue;
    }
    if (current.type === 'card' && /^#{1,3}\s+/.test(line)) {
      pushCurrent();
      current = { type: 'text', lines: [line] };
      continue;
    }
    current.lines.push(line);
  }
  pushCurrent();
  return segments;
}

function parseCard(lines) {
  const title = lines[0].replace(/^####\s+/, '').trim();
  const fields = new Map();
  const unknown = [];

  for (const line of lines.slice(1)) {
    const match = line.match(/^- \*\*([^*\n]+?)\*\*\s*(.*)$/);
    if (!match) {
      if (line.trim()) unknown.push(line);
      continue;
    }
    const key = match[1].replace(/[:：]+$/g, '').trim();
    const value = sanitizeContent(match[2].trim());
    fields.set(key, value);
  }

  return { title: sanitizeTitle(title), fields, unknown };
}

function sanitizeTitle(title) {
  return title
    .replace(/回眸/g, '凝眸')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeContent(value) {
  let next = String(value || '').trim();
  const replacements = [
    [/not low-angle distortion/gi, 'no forced-perspective distortion'],
    [/not exaggerated low-angle distortion/gi, 'no exaggerated forced-perspective distortion'],
    [/low angle upward shot/gi, 'stable eye-level shot'],
    [/low angle wide cinematic scale shot/gi, 'eye-level wide cinematic scale shot'],
    [/low angle cinematic masterpiece photo/gi, 'eye-level cinematic photo'],
    [/low angle heroic cinematic framing/gi, 'eye-level heroic cinematic framing'],
    [/warm low angle floor lamp/gi, 'warm floor-level lamp'],
    [/low angle floor lamp/gi, 'floor-level lamp'],
    [/subtle low angle or central axis/gi, 'stable central-axis'],
    [/low angle looking up/gi, 'eye-level view'],
    [/low angle/gi, 'eye-level'],
    [/low-angle/gi, 'eye-level'],
    [/ultra wide-angle/gi, 'wide environmental'],
    [/wide-angle/gi, 'wide environmental'],
    [/looking over (her )?shoulder toward the lens/gi, 'turning gently with face readable toward the lens'],
    [/looking back over (her )?shoulder/gi, 'turning gently with face readable'],
    [/extreme close-up focusing on eye emotion and natural skin pores/gi, 'face-readable half-body framing focused on eye emotion and natural skin texture'],
    [/extreme close-up/gi, 'face-readable half-body framing'],
    [/macro portrait close-up/gi, 'face-readable half-body portrait'],
    [/macro portrait/gi, 'face-readable half-body portrait'],
    [/close-up macro portrait/gi, 'face-readable half-body portrait'],
    [/portrait close-up/gi, 'face-readable half-body portrait'],
    [/close-up portrait shot/gi, 'face-readable half-body portrait shot'],
    [/close up focus on facial expressions/gi, 'face-readable expression focus'],
    [/close-up focus on facial expressions/gi, 'face-readable expression focus'],
    [/close-up shot/gi, 'face-readable half-body shot'],
    [/medium close-up/gi, 'face-readable half-body'],
    [/close-up depth of field/gi, 'natural depth of field'],
    [/close-up/gi, 'face-readable half-body'],
    [/perfect joint proportions/gi, 'realistic joint proportions'],
    [/perfect joints/gi, 'realistic joints'],
    [/perfect body alignment/gi, 'natural body alignment'],
    [/perfect anatomy/gi, 'realistic anatomy'],
    [/perfect finger count/gi, 'correct finger count'],
    [/perfectly believable/gi, 'believable'],
    [/perfectly still/gi, 'calm still'],
    [/perfect still water/gi, 'mirror-still water'],
    [/perfect mirror surface/gi, 'clear mirror surface'],
    [/perfect blue sky/gi, 'clear blue sky'],
    [/perfect sanctuary/gi, 'former sanctuary'],
    [/\bperfect\b/gi, 'well-proportioned'],
    [/game-heroine/gi, 'game central-character'],
    [/\bheroine\b/gi, 'central character'],
    [/goddess face/gi, 'regal mythic styling'],
    [/\bgoddess\b/gi, 'regal mythic figure'],
    [/beautiful independent eyes/gi, 'focused independent eyes'],
    [/beautiful body/gi, 'natural body'],
    [/beautiful gaze/gi, 'expressive gaze'],
    [/melancholy beauty/gi, 'melancholy mood'],
    [/dark-beauty/gi, 'dark refined'],
    [/dark beauty/gi, 'dark refined styling'],
    [/high fashion beauty layout/gi, 'high fashion refined layout'],
    [/fine art beauty layout/gi, 'fine art refined layout'],
    [/soft beauty photo finish/gi, 'soft refined photo finish'],
    [/cosmic scale beauty/gi, 'cosmic scale atmosphere'],
    [/sleeping beauty water dream/gi, 'sleeping rose water dream'],
    [/avant-garde dark beauty look/gi, 'avant-garde dark refined look'],
    [/\bbeauty presence\b/gi, 'refined presence'],
    [/\bproud beauty\b/gi, 'proud refined'],
    [/\bbeautiful\b/gi, 'refined'],
    [/luxury beauty/gi, 'natural refined styling'],
    [/high-end luxury editorial/gi, 'high-end editorial'],
    [/flawless/gi, 'natural'],
    [/porcelain skin/gi, 'natural skin texture'],
    [/arms overhead/gi, 'hands kept below eye level'],
    [/covering face/gi, 'face unobstructed'],
    [/仰拍/g, '平視'],
    [/回眸/g, '凝眸'],
  ];

  for (const [from, to] of replacements) {
    next = next.replace(from, to);
  }
  return next.replace(/\s{2,}/g, ' ').trim();
}

function normalizeMakeup(value, title, fullText) {
  const raw = parseCodeValue(value || '').trim();
  const alias = MAKEUP_ALIASES[raw];
  if (alias) return alias;
  if (VALID_MAKEUP_IDS.has(raw)) return raw;

  const text = `${title} ${fullText}`.toLowerCase();
  if (/魅魔|succubus/.test(text)) return 'succubus_alluring';
  if (/魔王|冥界|underworld|demon|infernal|dark queen/.test(text)) return 'demon_lord';
  if (/墮天使|fallen angel/.test(text)) return 'fallen_angel';
  if (/婚紗|bride|bridal|wedding|喜嫁/.test(text)) return 'wedding';
  if (/賽博|機械|科幻|cyber|neon|holographic/.test(text)) return 'cyber';
  if (/動漫|遊戲|game|idol|魔法少女/.test(text)) return 'character_pop';
  if (/武|劍|俠|samurai|ninja|battle|warrior|拳|掌/.test(text)) return 'wuxia';
  if (/狐|fox/.test(text)) return 'fox';
  if (/人魚|水下|underwater|mermaid/.test(text)) return 'mermaid';
  if (/精靈|花妖|flower|fairy|elf/.test(text)) return 'flower_fairy';
  if (/清宮|皇|后|宮廷|palace|imperial|queen|empress/.test(text)) return 'imperial_empress';
  if (/神話|神女|divine|myth|oracle|temple/.test(text)) return 'oracle_gold';
  if (/仙|xianxia|celestial/.test(text)) return 'xianxia';
  if (/旅|travel|street|landmark|city|beach|forest|lake|草原/.test(text)) return 'outdoor_glow';
  return 'natural_clean';
}

function inferGroup(title, fullText) {
  const text = `${title} ${fullText}`.toLowerCase();
  if (/婚紗|bride|bridal|wedding|喜嫁/.test(text)) return 'wedding';
  if (/旅|travel|landmark|street|beach|lake|city|world|草原|韓服|和服|莎麗/.test(text)) return 'travel';
  if (/魅魔|魔王|冥界|queen|throne|empress|underworld|demon|王座/.test(text)) return 'queen';
  if (/武|劍|俠|samurai|ninja|battle|warrior|arena|拳|掌/.test(text)) return 'martial';
  if (/宮廷|漢服|朝代|唐|宋|明|清|palace|hanfu|dynasty|court/.test(text)) return 'hanfu';
  if (/賽博|機械|科幻|cyber|neon|holographic|anime|game/.test(text)) return 'tech';
  if (/墮天使|哥德|吸血|gothic|fallen|vampire|dark/.test(text)) return 'gothic';
  if (/神話|仙|精靈|人魚|鳳凰|dragon|phoenix|myth|celestial|fantasy|magic/.test(text)) return 'fantasy';
  return 'general';
}

function inferScene(title, group) {
  const base = `${title} inspired environment with layered background depth, realistic photographic atmosphere, and clear space around the subject`;
  const byGroup = {
    wedding: 'romantic wedding environment with flowers, fabric layers, soft architectural or outdoor depth, and a calm emotional center',
    travel: 'location-driven travel environment with recognizable landmark depth, natural weather, and enough space to show the person within the place',
    queen: 'regal chamber or ceremonial world with throne, steps, banners, or architectural axis supporting the character role',
    martial: 'story-driven action environment with stable ground, readable path lines, and role-specific weapon or travel context',
    hanfu: 'classical historical environment with pavilion, corridor, garden, palace, or water-edge depth supporting the costume',
    tech: 'futuristic studio, city, stage, or command-space environment with controlled neon depth and clean subject separation',
    gothic: 'dark gothic architectural environment with candlelight, stone, arches, or moonlit depth while keeping the face readable',
    fantasy: 'mythic fantasy environment with magical architecture, natural elements, or celestial depth supporting the subject without obscuring the face',
    general: base,
  };
  return byGroup[group] || base;
}

function inferLight(group, cameraLight) {
  if (cameraLight === 'ls_cinematic' || group === 'gothic' || group === 'queen') {
    return 'controlled cinematic key light on the face with soft rim light, deep atmosphere kept behind the subject, no face-obscuring shadow';
  }
  if (cameraLight === 'ls_golden' || group === 'wedding' || group === 'hanfu') {
    return 'warm natural or golden-hour face light, soft highlights on costume details, realistic skin texture preserved';
  }
  if (cameraLight === 'ls_studio' || group === 'tech') {
    return 'controlled studio-quality face key light with clean edge separation and stable skin texture';
  }
  return 'soft natural face light matched to the environment, clear facial readability, realistic contrast, no plastic skin smoothing';
}

function inferOutfit(title, group) {
  const byGroup = {
    wedding: `${title} inspired bridal gown or ceremonial styling, complete dress silhouette, veil or bouquet kept away from the face`,
    travel: `${title} inspired location-appropriate fashion, complete outfit visible, accessories kept proportional and away from the facial outline`,
    queen: `${title} inspired regal couture with structured gown, cape, crown or symbolic accessory, head ornaments kept proportional`,
    martial: `${title} inspired martial outfit with stable belts, sleeves, boots, and weapon prop held safely below the face line`,
    hanfu: `${title} inspired historical costume with layered robes, sleeve movement, hair ornaments kept compact, and era-appropriate hand prop`,
    tech: `${title} inspired sci-fi or stage costume with clean structural lines, readable body silhouette, and controlled glowing details`,
    gothic: `${title} inspired dark couture with layered fabric, controlled jewelry, and no facial obstruction from collars or accessories`,
    fantasy: `${title} inspired fantasy costume with coherent silhouette, readable accessories, and magical styling that never changes facial identity`,
    general: `${title} inspired complete costume with readable silhouette, natural body proportions, and accessories kept away from the face`,
  };
  return byGroup[group] || byGroup.general;
}

function inferAction(title, group) {
  const base = 'ChatGPT chooses a role-appropriate natural action from the character, setting, costume, and surrounding scene; face stays visible, head neck shoulders and torso stay naturally aligned, hands and props remain below eye level when possible';
  const byGroup = {
    wedding: 'a natural bridal action such as adjusting veil, holding bouquet low, smoothing the gown, walking slowly, or pausing before ceremony; face stays visible and body posture supports the head and expression',
    travel: 'a natural travel action such as walking, pausing at a landmark, touching a railing, adjusting clothing in the weather, or turning gently within the scene; face stays readable and body direction matches head direction',
    queen: 'a calm commanding action such as issuing a decree, resting a hand on throne or railing, descending steps, or reviewing a symbol of power; authority comes from stable posture, not forced perspective',
    martial: 'a controlled martial action such as stepping forward, holding a weapon low, pausing before movement, or guarding with grounded balance; limbs remain coherent and face remains clear',
    hanfu: 'a classical story action such as holding a fan or lantern, arranging sleeves, reading a letter, walking through a corridor, or pausing by a railing; body and head align naturally',
    tech: 'an in-world sci-fi or stage action such as touching a holographic interface, standing at a console, or reacting to light cues; face remains the identity anchor',
    gothic: 'a composed gothic action such as pausing by candlelight, touching stone railing, descending steps, or sitting with deliberate stillness; face remains unobstructed',
    fantasy: 'a magical but readable action such as guiding light, interacting with a creature, touching water, holding a relic, or standing as the environment responds; pose remains physically plausible',
    general: base,
  };
  return byGroup[group] || base;
}

function inferComposition(group, ang, ratio) {
  const framing = {
    quan: 'full-body',
    huanjing: 'environmental full or three-quarter',
    banshen: 'face-readable half-body',
    zheng: 'front-facing',
    sanfen: 'three-quarter',
  }[ang] || 'three-quarter';
  const ratioText = ratio === 'r_916' ? 'mobile vertical' : 'vertical';
  return `${ratioText} ${framing} composition with clear face, realistic head-to-body proportion, natural face-neck-shoulder alignment, complete costume/body readability, and enough scene depth behind the subject; no forced perspective and no oversized head`;
}

function inferEffects(group) {
  const byGroup = {
    wedding: 'subtle flower, veil, fabric, or warm light movement kept around the body and never covering facial features',
    travel: 'natural wind, water reflection, foliage, city light, or location atmosphere kept behind or beside the subject',
    queen: 'controlled glow, banners, embers, dust motes, cape movement, or ceremonial atmosphere kept away from the facial outline',
    martial: 'controlled fabric, dust, sparks, petals, or weapon motion placed around the body without hiding the face or distorting limbs',
    hanfu: 'subtle petals, lantern glow, sleeve motion, incense haze, or water reflection placed behind or beside the subject',
    tech: 'controlled neon reflections, holographic light, stage glow, or interface effects kept secondary to the face and body',
    gothic: 'subtle candle smoke, moonlight haze, shadow depth, or drifting particles kept in background and never across the face',
    fantasy: 'subtle magical particles, elemental light, feathers, petals, water shimmer, or aura effects orbiting the subject without replacing body structure',
    general: 'subtle environmental motion and atmosphere supporting the scene without covering the face or altering anatomy',
  };
  return byGroup[group] || byGroup.general;
}

function inferTone(group) {
  const byGroup = {
    wedding: 'soft ivory, champagne, rose, warm gold, and natural skin tones',
    travel: 'location-authentic natural palette with balanced skin tones and clear environmental color',
    queen: 'obsidian, crimson, antique gold, deep jewel tones, and controlled skin highlights',
    martial: 'grounded cinematic palette with steel, earth, fabric color accents, and realistic skin tones',
    hanfu: 'jade, ivory, vermilion, ink blue, warm gold, and refined historical color grading',
    tech: 'electric blue, magenta, chrome, black, and clean high-contrast skin-safe highlights',
    gothic: 'charcoal, burgundy, moonlit silver, deep violet, and controlled warm candle accents',
    fantasy: 'mythic color palette matched to the scene, with soft atmospheric contrast and natural skin readability',
    general: 'coherent cinematic color grading matched to the scene while preserving natural skin identity',
  };
  return byGroup[group] || byGroup.general;
}

function inferCamera(fields, title, fullText) {
  const group = inferGroup(title, fullText);
  const text = `${title} ${fullText}`.toLowerCase();
  const existing = {
    ang: parseCodeValue(fields.get('鏡頭角度') || ''),
    ratio: parseCodeValue(fields.get('圖片比例') || ''),
    light: parseCodeValue(fields.get('燈光風格') || ''),
    atm: parseCodeValue(fields.get('整體氛圍') || ''),
    camLang: parseCodeValue(fields.get('鏡頭語言') || ''),
  };

  const camera = {
    ang: VALID.ang.has(existing.ang) ? existing.ang : 'sanfen',
    ratio: VALID.ratio.has(existing.ratio) ? existing.ratio : 'r_34',
    lens: 'l_50',
    light: VALID.light.has(existing.light) ? existing.light : 'ls_natural',
    atm: VALID.atm.has(existing.atm) ? existing.atm : 'at_clear',
    camLang: VALID.camLang.has(existing.camLang) ? existing.camLang : 'cl_magazine',
  };

  if (!VALID.ang.has(existing.ang) || !VALID.ratio.has(existing.ratio)) {
    if (group === 'travel') Object.assign(camera, { ang: 'huanjing', ratio: 'r_916' });
    else if (group === 'wedding') Object.assign(camera, { ang: 'sanfen', ratio: 'r_34' });
    else if (group === 'martial') Object.assign(camera, { ang: 'quan', ratio: 'r_23' });
    else if (/full-body|full body|全身|wide|horseback|standing|walking|dance|arena/.test(text)) Object.assign(camera, { ang: 'quan', ratio: 'r_23' });
    else if (/half-body|half body|portrait|seated|sitting/.test(text)) Object.assign(camera, { ang: 'banshen', ratio: 'r_34' });
  }

  if (!VALID.light.has(existing.light)) {
    if (group === 'queen' || group === 'gothic') camera.light = 'ls_cinematic';
    else if (group === 'wedding' || group === 'hanfu') camera.light = 'ls_golden';
    else if (group === 'tech') camera.light = 'ls_studio';
  }
  if (!VALID.atm.has(existing.atm)) {
    if (group === 'queen' || group === 'gothic') camera.atm = 'at_moody';
    else if (group === 'wedding') camera.atm = 'at_warm';
    else if (group === 'fantasy' || group === 'hanfu') camera.atm = 'at_misty';
  }
  if (!VALID.camLang.has(existing.camLang)) {
    camera.camLang = group === 'travel' ? 'cl_social' : group === 'martial' ? 'cl_fashion' : 'cl_magazine';
  }
  return camera;
}

function renderCodeField(label, id, group) {
  const desc = CAMERA_META[group][id] || '';
  return `- **${label}：** \`${id}\`${desc ? ` — ${desc}` : ''}`;
}

function renderCard(card) {
  const lines = [`#### ${card.title}`];
  lines.push(`- **ID:** \`${card.fields.get('ID')}\``);
  lines.push(`- **妝容：** ${card.fields.get('妝容')}`);
  lines.push(`- **場景背景：** ${card.fields.get('場景背景')}`);
  lines.push(`- **光線：** ${card.fields.get('光線')}`);
  if (card.fields.has('妝容描述')) lines.push(`- **妝容描述：** ${card.fields.get('妝容描述')}`);
  lines.push(`- **服裝：** ${card.fields.get('服裝')}`);
  lines.push(`- **動作與鏡頭：** ${card.fields.get('動作與鏡頭')}`);
  lines.push(`- **構圖：** ${card.fields.get('構圖')}`);
  lines.push(`- **特效：** ${card.fields.get('特效')}`);
  lines.push(`- **色調：** ${card.fields.get('色調')}`);
  lines.push(renderCodeField('鏡頭角度', parseCodeValue(card.fields.get('鏡頭角度')), 'ang'));
  lines.push(renderCodeField('圖片比例', parseCodeValue(card.fields.get('圖片比例')), 'ratio'));
  lines.push(renderCodeField('鏡頭焦段', 'l_50', 'lens'));
  lines.push(renderCodeField('燈光風格', parseCodeValue(card.fields.get('燈光風格')), 'light'));
  lines.push(renderCodeField('整體氛圍', parseCodeValue(card.fields.get('整體氛圍')), 'atm'));
  lines.push(renderCodeField('鏡頭語言', parseCodeValue(card.fields.get('鏡頭語言')), 'camLang'));
  for (const field of ['來源檔名', '原始ID']) {
    if (card.fields.has(field)) lines.push(`- **${field}：** ${card.fields.get(field)}`);
  }
  if (card.unknown.length) lines.push(...card.unknown);
  return lines.join('\n');
}

function normalizeAction(value) {
  let next = sanitizeContent(value);
  if (!/face (stays|remains)|face still|face clear|face readable|face unobstructed|臉部|五官|清楚/.test(next)) {
    next += ', face remains clear and readable';
  }
  if (!/head neck shoulders|face-neck-shoulder|head-to-body|頭臉|肩身|torso/.test(next)) {
    next += ', head neck shoulders and torso stay naturally aligned';
  }
  if (!/ChatGPT may adapt|role-appropriate|scene/.test(next)) {
    next += ', ChatGPT may adapt the body pose to the role and surrounding scene while preserving identity';
  }
  return next;
}

function normalizeComposition(value) {
  let next = sanitizeContent(value);
  if (!/head-to-body|頭身|oversized head|大頭|natural human proportions|proportion/.test(next)) {
    next += ', realistic head-to-body proportion';
  }
  if (!/face-neck-shoulder|head neck shoulders|肩頸|肩身/.test(next)) {
    next += ', natural face-neck-shoulder alignment';
  }
  if (!/no forced perspective|forced perspective|eye-level|平視/.test(next)) {
    next += ', no forced perspective';
  }
  return next;
}

function cleanCard(card, state) {
  const originalTitle = card.title;
  const rawText = [...card.fields.values()].join(' ');
  const group = inferGroup(card.title, rawText);
  const camera = inferCamera(card.fields, card.title, rawText);
  const changes = [];

  let id = parseCodeValue(card.fields.get('ID') || '').trim();
  if (!id) {
    id = `auto_${String(state.autoId += 1).padStart(3, '0')}`;
    changes.push('補 ID');
  }
  if (state.seenIds.has(id)) {
    const newId = id === 'wx_19' && /女武士/.test(card.title) ? 'wx_31' : nextId(id, state.usedIds);
    changes.push(`重複 ID ${id} -> ${newId}`);
    id = newId;
  }
  state.seenIds.add(id);
  state.usedIds.add(id);
  card.fields.set('ID', id);

  const titleKey = card.title;
  const titleCount = (state.titleCounts.get(titleKey) || 0) + 1;
  state.titleCounts.set(titleKey, titleCount);
  if (titleCount > 1) {
    card.title = `${card.title} · 參考變體${titleCount}`;
    changes.push(`重複標題改名：${originalTitle} -> ${card.title}`);
  }

  const makeupBefore = parseCodeValue(card.fields.get('妝容') || '');
  const makeup = normalizeMakeup(card.fields.get('妝容'), card.title, rawText);
  card.fields.set('妝容', makeup);
  if (makeup !== makeupBefore) changes.push(`妝容 ${makeupBefore || '(空)'} -> ${makeup}`);

  if (!card.fields.get('場景背景')) {
    card.fields.set('場景背景', inferScene(card.title, group));
    changes.push('補場景背景');
  }
  if (!card.fields.get('服裝')) {
    card.fields.set('服裝', inferOutfit(card.title, group));
    changes.push('補服裝');
  }

  card.fields.set('鏡頭角度', camera.ang);
  card.fields.set('圖片比例', camera.ratio);
  card.fields.set('鏡頭焦段', 'l_50');
  card.fields.set('燈光風格', camera.light);
  card.fields.set('整體氛圍', camera.atm);
  card.fields.set('鏡頭語言', camera.camLang);

  if (!card.fields.get('光線')) {
    card.fields.set('光線', inferLight(group, camera.light));
    changes.push('補光線');
  }
  if (!card.fields.get('動作與鏡頭')) {
    card.fields.set('動作與鏡頭', inferAction(card.title, group));
    changes.push('補動作與鏡頭');
  } else {
    const before = card.fields.get('動作與鏡頭');
    card.fields.set('動作與鏡頭', normalizeAction(before));
    if (card.fields.get('動作與鏡頭') !== before) changes.push('校正動作與鏡頭');
  }
  if (!card.fields.get('構圖')) {
    card.fields.set('構圖', inferComposition(group, camera.ang, camera.ratio));
    changes.push('補構圖');
  } else {
    const before = card.fields.get('構圖');
    card.fields.set('構圖', normalizeComposition(before));
    if (card.fields.get('構圖') !== before) changes.push('校正構圖');
  }
  if (!card.fields.get('特效')) {
    card.fields.set('特效', inferEffects(group));
    changes.push('補特效');
  }
  if (!card.fields.get('色調')) {
    card.fields.set('色調', inferTone(group));
    changes.push('補色調');
  }

  for (const field of ['場景背景', '光線', '妝容描述', '服裝', '特效', '色調']) {
    if (card.fields.has(field)) {
      const before = card.fields.get(field);
      const after = sanitizeContent(before);
      card.fields.set(field, after);
      if (after !== before) changes.push(`清理${field}風險詞`);
    }
  }

  const missing = CORE_FIELDS.filter((field) => !card.fields.get(field));
  if (missing.length) changes.push(`仍缺欄位：${missing.join('、')}`);

  return {
    id,
    title: card.title,
    originalTitle,
    group,
    changes,
    missing,
  };
}

function nextId(id, usedIds) {
  const match = id.match(/^([a-zA-Z]+_)(\d+)$/);
  if (!match) {
    let i = 2;
    while (usedIds.has(`${id}_${i}`)) i += 1;
    return `${id}_${i}`;
  }
  const [, prefix, rawNumber] = match;
  const width = rawNumber.length;
  let max = 0;
  for (const used of usedIds) {
    const usedMatch = used.match(new RegExp(`^${escapeRegExp(prefix)}(\\d+)$`));
    if (usedMatch) max = Math.max(max, Number(usedMatch[1]));
  }
  let next = max + 1;
  let candidate = `${prefix}${String(next).padStart(width, '0')}`;
  while (usedIds.has(candidate)) {
    next += 1;
    candidate = `${prefix}${String(next).padStart(width, '0')}`;
  }
  return candidate;
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function main() {
  const original = fs.readFileSync(STYLE_MD_PATH, 'utf8');
  ensureDir(BACKUP_DIR);
  if (!fs.existsSync(BACKUP_PATH)) {
    fs.writeFileSync(BACKUP_PATH, original, 'utf8');
  }

  const normalized = normalizeFieldLabels(original);
  const segments = splitSegments(normalized);
  const state = {
    seenIds: new Set(),
    usedIds: new Set(),
    titleCounts: new Map(),
    autoId: 0,
  };

  const results = [];
  const rendered = segments.map((segment) => {
    if (segment.type !== 'card') return segment.lines.join('\n');
    const card = parseCard(segment.lines);
    const result = cleanCard(card, state);
    results.push(result);
    return renderCard(card);
  }).join('\n');

  const finalText = `${rendered.trimEnd()}\n`;
  fs.writeFileSync(STYLE_MD_PATH, finalText, 'utf8');
  const baselineText = fs.readFileSync(BACKUP_PATH, 'utf8');
  const baselineStats = statsForMarkdown(baselineText);
  const currentStats = statsForMarkdown(finalText);

  const changedRows = results
    .filter((result) => result.changes.length)
    .map((result) => [result.id, result.title, result.group, result.changes.join('；')]);
  const stillMissingRows = results
    .filter((result) => result.missing.length)
    .map((result) => [result.id, result.title, result.missing.join('、')]);
  const duplicateFixedRows = results
    .filter((result) => result.changes.some((change) => change.includes('重複')))
    .map((result) => [result.id, result.originalTitle, result.title, result.changes.filter((change) => change.includes('重複')).join('；')]);

  ensureDir(path.dirname(REPORT_PATH));
  fs.writeFileSync(REPORT_PATH, [
    '# 風格範例清理報告',
    '',
    `產生時間：${new Date().toISOString()}`,
    `母庫：\`${path.relative(ROOT, STYLE_MD_PATH)}\``,
    `備份：\`${path.relative(ROOT, BACKUP_PATH)}\``,
    '',
    '## 摘要',
    '',
    markdownTable([
      ['母庫卡片數', results.length],
      ['備份版缺欄位卡片數', baselineStats.missingCards],
      ['清理後缺欄位卡片數', currentStats.missingCards],
      ['備份版重複 ID 組數', baselineStats.idDuplicateGroups],
      ['清理後重複 ID 組數', currentStats.idDuplicateGroups],
      ['備份版重複標題組數', baselineStats.titleDuplicateGroups],
      ['清理後重複標題組數', currentStats.titleDuplicateGroups],
      ['本次重跑異動卡片數', changedRows.length],
      ['鏡頭焦段政策', '全部統一為 l_50'],
    ], ['項目', '數量 / 狀態']),
    '',
    '備註：本腳本可重跑。若母庫已清理完成，再次執行時「本次重跑異動卡片數」會是 0；正式成果以備份版與清理後統計差異為準。',
    '',
    '## 重複處理',
    '',
    duplicateFixedRows.length ? markdownTable(duplicateFixedRows, ['新 ID', '原標題', '新標題', '處理']) : '無。',
    '',
    '## 仍缺欄位',
    '',
    stillMissingRows.length ? markdownTable(stillMissingRows, ['ID', '標題', '缺欄位']) : '無。',
    '',
    '## 主要異動明細',
    '',
    markdownTable(changedRows.slice(0, 250), ['ID', '標題', '推定群組', '異動']),
    '',
    changedRows.length > 250 ? `（另有 ${changedRows.length - 250} 筆異動，完整內容見 JSON。）` : '',
    '',
  ].join('\n'), 'utf8');

  ensureDir(path.dirname(JSON_PATH));
  fs.writeFileSync(JSON_PATH, JSON.stringify({
    generated_at: new Date().toISOString(),
    backup_path: path.relative(ROOT, BACKUP_PATH),
    cards: results.length,
    changed_cards: changedRows.length,
    duplicate_fixes: duplicateFixedRows.length,
    still_missing: stillMissingRows.length,
    baseline_stats: baselineStats,
    current_stats: currentStats,
    results,
  }, null, 2), 'utf8');

  console.log(JSON.stringify({
    cards: results.length,
    changedCards: changedRows.length,
    duplicateFixes: duplicateFixedRows.length,
    stillMissing: stillMissingRows.length,
    baselineStats,
    currentStats,
    backupPath: BACKUP_PATH,
    reportPath: REPORT_PATH,
    jsonPath: JSON_PATH,
  }, null, 2));
}

function statsForMarkdown(markdown) {
  const cards = parseCards(markdown);
  const duplicateInfo = buildDuplicateInfo(cards);
  return {
    cards: cards.length,
    missingCards: cards.filter((card) => missingFields(card).length > 0).length,
    idDuplicateGroups: duplicateInfo.idDups.length,
    titleDuplicateGroups: duplicateInfo.titleDups.length,
    lenses: [...new Set(cards.map((card) => parseCodeValue(card.fields['鏡頭焦段'])).filter(Boolean))].sort(),
  };
}

main();
