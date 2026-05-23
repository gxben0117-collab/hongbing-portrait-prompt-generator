// ═══════════════════════════════════════════
// 核心咒語規範 v1.6 (2026-05-23)
// 來源文件：核心資料/核心咒語規範.md — 此為專案規範，任何修改請先更新 .md 文件
// ═══════════════════════════════════════════
//
// 【風格範例擴增流程規範】
// 新增任何風格範例（TPLS、CATS entry、正式 preset）前，必須遵守：
//
// 步驟一：先讀 核心資料/核心咒語規範.md
//   確認哪些詞彙是換臉高風險詞，哪些姿勢/角度被禁用。
//
// 步驟二：按規範撰寫
//   - char 欄：只寫場景世界觀，不寫人物外貌形容
//   - outfit/scene/fx 欄：避免 goddess / flawless / perfect beauty / ethereal 等高風險詞
//   - 姿勢描述：避免 回眸 / 仰拍 / movie trailer / back-facing 等禁用詞
//
// 步驟三：程式雙重保險
//   輸出咒語時，所有風格欄位會自動執行 sanitizeCreativeField()，
//   清洗已知高風險詞。但此層只能清洗已知詞，步驟一仍是最重要的把關。
//
// 結論：風格範例不是純美術描述，每條文字必須符合 identity-first 原則。
//       先讀規範 → 後建檔 → 程式再清洗，三層保障缺一不可。
// ═══════════════════════════════════════════

// ── 核心規則（已整合壓縮，保留所有關鍵約束）──
const CORE_GATE = `MANDATORY: Check for an uploaded reference photo before proceeding. No reference photo — stop and ask for one. Never invent a face or generate from text alone.`;

const CORE_IDENTITY = `IDENTITY LOCK (CRITICAL): The uploaded photo is the only identity reference. Preserve exact facial geometry, eye shape, nose structure, mouth shape, skin identity, and recognizable likeness across all styling, costume, and lighting variations. Makeup is surface cosmetics only — color, texture, mood — never alters eye shape, brow bone, lip shape, jaw, or facial proportions. Style keywords (fantasy, luxury, goddess, heroine, celebrity) describe costume and environment only — they must never reconstruct or replace the uploaded person's face. The uploaded photo overrides all style, cinematic, and beauty directions. Final image must feel like a real photograph of this specific person.`;

const CORE_SAFETY = `BEAUTY & ANATOMY SAFETY: Avoid identity drift, AI beauty templates, influencer face replacement, plastic skin, over-smoothed renders. Preserve natural asymmetry, real skin texture, and original facial uniqueness. Maintain realistic adult anatomy — natural limb proportions, correct fingers, believable body balance. Head-to-body proportion must be realistic: no oversized head, no chibi proportions, no cranial enlargement from hair ornaments or heavy costume. Face-to-neck-to-shoulder alignment must stay physically natural — when pose drama conflicts with face stability, reduce pose drama. Body proportion priority over cinematic exaggeration — do not sacrifice limb length or torso scale for dramatic effect. Camera at eye-level or chest height for full-body shots — avoid forced perspective that enlarges the head relative to the body. Facial identity remains readable in all poses.`;

const CORE_ELASTICITY = `Natural variation is encouraged: hair movement, candid posing, environmental interaction, photographic imperfection. Facial bone structure, eye shape, nose geometry, and recognizable features remain fixed regardless of pose or scene.`;

const CORE_STRUCTURE = `Render: scene → lighting → character context → makeup → costume → action/props → composition → effects → tone → quality → specs. Identity preservation overrides all style direction.`;

// ── 禁止詞列表（已精簡）──
const AVOID_LOCK = `identity drift, replaced face, AI beauty templates, influencer face, plastic skin, V-face, doll face, flawless skin, porcelain skin filter, eye-reshaping liner, heavy eyeliner distortion, mannequin poses, artificial symmetry, anatomy distortion, floating limbs, deformed fingers, oversized head, chibi proportions, low-angle hero shots, back-facing poses, movie-trailer staging, low quality, watermarks`;

// ── 古裝加強（精簡版）──
const ANCIENT_BOOST = `Ancient Chinese costume: traditional updo with 2-3 accessories only (hairpins or step-shake ornaments) that do not enlarge head silhouette. Layered robes with wide sleeves, embroidered waist ornament, one era-appropriate hand prop. Setting: ancient Chinese architecture, classical gardens, or mythological environment.`;

const QUALITY_BASE = `cinematic quality, photorealistic rendering, detailed costume and environment texture, 8K HDR`;
const GOVERNANCE = (typeof window !== 'undefined' && window.PROMPT_GOVERNANCE) ? window.PROMPT_GOVERNANCE : {};
const ANTI_PATTERNS = GOVERNANCE.antiPatterns || {
  bannedCameraLanguageIds: ['cl_movie', 'cl_travel'],
  bannedAngleIds: ['yang', 'huimou'],
  bannedPromptTerms: [
    'movie trailer',
    'blockbuster',
    'dramatic hero framing',
    'looking back over shoulder',
    'low angle upward shot',
    'perfect beauty',
    'flawless',
    'luxury beauty',
    'cat-eye',
    'heavy smoky eye',
    'extreme pose',
    'jumping',
    'spinning',
    'back-facing',
    'travel documentary',
    'vlog',
    'candid travel',
    'low-key dramatic',
    'ethereal atmosphere',
    'celestial mist',
  ],
};
const TEXT_REPLACEMENTS = GOVERNANCE.replacements || [];

// ═══════════════════════════════════════════
// 圖片規格控制
// ═══════════════════════════════════════════
const RATIO = [
  {id:'r_34',  name:'3:4 直式人像', desc:'Generate in 3:4 vertical portrait orientation — standard portrait crop optimized for face and full-body shots.'},
  {id:'r_23',  name:'2:3 直式',     desc:'Generate in 2:3 vertical format — tall portrait framing ideal for full-body costume display.'},
  {id:'r_11',  name:'1:1 正方',     desc:'Generate in 1:1 square format — balanced composition for close-up and half-body shots.'},
  {id:'r_43',  name:'4:3 橫版',     desc:'Generate in 4:3 horizontal landscape orientation — natural photographic landscape framing.'},
  {id:'r_169', name:'16:9 電影橫',  desc:'Generate in 16:9 widescreen cinematic format — epic horizontal cinematic framing.'},
  {id:'r_916', name:'9:16 手機直',  desc:'Generate in 9:16 tall vertical mobile format — optimized for phone display and social media stories.'},
  {id:'r_239', name:'2.39:1 超寬幕',desc:'Generate in 2.39:1 ultra-wide cinematic letterbox format — maximum cinematic scope for epic scenes.'},
];
const LENS = GOVERNANCE.lensOptions || [
  {id:'l_50',  name:'50mm 全身最穩',  desc:'Simulated 50mm full-body fashion photography lens: natural human-eye perspective, minimal distortion, realistic head-to-body proportions — camera positioned at eye-level or chest height, balanced full-body and three-quarter editorial framing.'},
  {id:'l_70',  name:'70mm 平衡人像',  desc:'Simulated 70mm balanced portrait lens: mild portrait compression with still-realistic body scale, optimized for three-quarter portraits that need both a beautiful face and stable head-to-body proportion.'},
  {id:'l_80',  name:'80mm 角色近景',  desc:'Simulated 80mm character portrait lens: stronger portrait compression than 70mm but safer than 85mm for three-quarter character styling and dramatic costume portraits.'},
  {id:'l_85',  name:'85mm 半身美臉',  desc:'Simulated 85mm portrait lens: natural face compression, beautiful background bokeh — for close-up and half-body portraits only. Avoid for full-body shots as it compresses the body and exaggerates head-to-body ratio.'},
];
const LIGHT_STYLE = [
  {id:'ls_golden',   name:'黃金時刻', desc:'Golden hour editorial lighting: warm amber and orange sunlight at low angle, long soft shadows, glowing skin tones, romantic warmth.'},
  {id:'ls_natural',  name:'自然日光', desc:'Natural daylight lighting: soft overcast or window light, even illumination, true-to-life color rendering, clean editorial look.'},
  {id:'ls_studio',   name:'棚拍燈光', desc:'Studio editorial lighting: controlled three-point lighting setup, clean precise illumination, commercial-grade fashion shoot quality.'},
  {id:'ls_cinematic',name:'電影戲劇光', desc:'Cinematic dramatic lighting: high-contrast motivated key light with colored rim light, deep atmospheric shadows, filmic premium cinema quality — no face-obscuring shadow, identity remains readable.'},
];
const ATM = [
  {id:'at_clear',    name:'晴空清透', desc:'Clear atmospheric visibility: crisp clean air, vivid colors, strong defined details, high-clarity visual rendering.'},
  {id:'at_misty',    name:'煙霧朦朧', desc:'Subtle misty atmosphere: very light haze in background only, body and face remain clearly visible and fully lit, soft romantic atmospheric depth without obscuring the subject.'},
  {id:'at_warm',     name:'暖光環繞', desc:'Warm glow atmosphere: enveloping warm light tones, golden and amber color environment, intimate cozy or romantic warmth.'},
  {id:'at_moody',    name:'暗黑氛圍', desc:'Dark moody atmosphere: deep shadows with selective accent lighting, heavy atmospheric depth, brooding emotional weight — subject face and identity remain clearly lit and readable.'},
];
const IDENTITY_LOCK = [
  {id:'il_standard', name:'標準保護', boost:''},
  {id:'il_enhanced', name:'強化鎖定', boost:'ENHANCED IDENTITY LOCK: Preserve exact facial bone structure — eye socket depth, nose bridge width, cheekbone position, jaw angle — these must match the reference photo precisely. No softening of distinct features allowed.'},
  {id:'il_maximum',  name:'最強鎖定', boost:'MAXIMUM IDENTITY LOCK (CRITICAL OVERRIDE): The uploaded person\'s face is the absolute ground truth. Every facial feature — eye shape, eye spacing, nose geometry, lip shape, chin profile, jaw line, cheekbone structure — must be reproduced with zero deviation from the reference photo. Any AI tendency toward beauty standardization, face symmetrization, skin smoothing, or feature idealization must be completely suppressed. The person must be immediately recognizable as the same individual from the reference photo.'},
];
const CAMERA_LANG = [
  {id:'cl_fashion',  name:'時尚大片', desc:'Fashion editorial camera language: precise controlled composition with deliberate pose and gaze, high-end magazine visual grammar, luxury fashion photography aesthetic.'},
  {id:'cl_magazine', name:'雜誌封面', desc:'Magazine cover camera language: clean bold composition with balanced full-body editorial framing, natural human head-to-body proportions, strong eye contact and graphic clarity — body proportion priority over cover-style close framing.'},
  {id:'cl_social',   name:'社群美圖', desc:'Social media optimized camera language: visually appealing clean composition, strong subject presence, shareable aesthetic quality, modern lifestyle visual.'},
];

const SAFE_POSE_VARIANTS = [
  'Use a varied but identity-safe pose: front-facing head with a three-quarter body angle, subtle shoulder turn, and natural arm placement that keeps the face open and recognizable.',
  'Prefer a non-static editorial pose such as a gentle seated angle, a slow step forward, or a calm paused motion, while keeping the face clearly directed toward camera.',
  'Encourage graceful movement in sleeves, cape, skirt, or hair so the image feels alive, but keep the neck, jawline, and torso alignment physically natural and photo-realistic.',
  'Hands, props, and gestures should stay below eye level or clearly away from the central face area unless the face remains fully readable without distortion.',
  'Favor realistic head-to-shoulder support, natural neck transition, and enough torso presence so the face feels proportionate to the body and costume silhouette.',
];

const SAFE_POSE_BY_CAMERA_LANG = {
  cl_fashion: [
    'Fashion pose guidance: avoid flat standing symmetry; prefer one hip relaxed, shoulders softly offset, and an elegant hand pose that enhances silhouette without hiding the face.',
    'Fashion pose guidance: use editorial asymmetry such as seated side-angle, leaning lightly against architecture, or one-step motion with direct facial visibility.',
  ],
  cl_magazine: [
    'Magazine cover pose guidance: vary between seated, leaning, shoulder-turn, and prop-holding cover poses rather than neutral standing, while maintaining strong eye contact and a clean face silhouette.',
  ],
  cl_social: [
    'Social portrait pose guidance: favor approachable candid poses such as soft laugh, relaxed seated angle, gentle walking, or light hand interaction with hair, flowers, or fabric below the face line.',
  ],
};

const CATEGORY_POSE_LIBRARY = {
  travel: {
    prop: [
      'Choose an action that fits a real traveler in this location: walking through the site, pausing to take in the view, touching a railing or architectural detail, adjusting hat or coat against wind, or calmly turning back toward the camera after interacting with the environment',
      'The subject should behave like someone genuinely experiencing the place rather than posing generically: sight-seeing, arriving, pausing, turning, or quietly responding to the weather, landscape, or landmark around her',
      'Use a location-driven travel moment with natural narrative intent, such as stepping along the path, standing at an overlook, waiting by water, touching a lantern, or looking back after moving through the scene, while preserving clear facial readability',
    ],
    comp: [
      'vertical environmental travel portrait, subject clearly readable within the location, face unobstructed, body slightly angled for motion, background landmark still recognizable',
      'vertical three-quarter or full-body travel composition, natural walking or turn-back storytelling, clear facial visibility, foreground and background layered for depth',
    ],
  },
  wedding: {
    prop: [
      'Choose an action that feels true to a bride in this exact setting: adjusting veil before the ceremony, holding bouquet while waiting, smoothing the gown, stepping through the aisle or garden, or turning gently after hearing someone call to her',
      'The subject should behave like she is inside a wedding moment rather than merely modeling the dress: preparing, entering, pausing in emotion, gathering the skirt, or quietly responding to the space with romantic presence',
      'Use bridal narrative intent such as walking into the venue, sitting for a calm in-between moment, touching veil or bouquet naturally, or sharing a private reflective pause, while keeping face and identity clean and stable',
    ],
    comp: [
      'vertical bridal portrait with clear face, readable gown silhouette, and soft foreground layering from flowers, veil, or fabric without obscuring the subject',
      'vertical three-quarter to full-body wedding composition, face clearly readable while preserving identity, skirt and train clearly visible, elegant depth behind the subject',
    ],
  },
  hanfu: {
    prop: [
      'Choose an action that matches the character identity and historical atmosphere: listening to music, reading a letter, carrying a lantern, holding a fan, touching a sleeve, drawing near a railing, offering tea, walking through a corridor, or resting a hand near a sword hilt if the role is martial',
      'The subject should feel like a person living inside the classical scene rather than a generic costume model: a court figure waiting, a scholar pausing, a traveler crossing a pavilion, a noble figure turning after hearing footsteps, or a martial character preparing to move',
      'Use culturally and role-appropriate behavior driven by the scene: not random gesturing, but a calm action with purpose, social meaning, or emotional context, while preserving a front-face-friendly body relationship',
    ],
    comp: [
      'vertical classical portrait with clear face, readable sleeve and hair ornament details, and elegant three-quarter body angle instead of flat frontal stiffness',
      'vertical full-body or three-quarter hanfu composition, costume layers and silhouette clearly visible, traditional prop integrated without covering the face',
    ],
  },
  queen: {
    prop: [
      'Choose an action that fits a ruler, sovereign, goddess, or demon queen in this scene: receiving an audience, issuing a command, reviewing a decree, rising from the throne, descending ceremonial steps, resting a hand on a scepter or throne arm, or turning after hearing urgent news',
      'The subject should feel like she holds power inside the world of the image rather than simply striking a strong pose: governing, judging, commanding, blessing, threatening, or presiding over the space with calm authority',
      'Use behavior with role logic and narrative weight, such as ruling, deciding, summoning, or presiding, while keeping the body stable, the face readable, and the authority conveyed through action rather than exaggerated gesture alone',
    ],
    comp: [
      'vertical regal portrait with throne, steps, or architectural axis reinforcing authority, face clearly readable, body posed in a stable commanding silhouette',
      'vertical queenly composition with eye-level or central-axis framing, natural human proportions, strong facial clarity, costume and power symbols fully legible, body proportion priority over cinematic exaggeration',
    ],
  },
  gothic: {
    prop: [
      'Choose an action that suits a gothic character inhabiting darkness with elegance: trailing fingertips along a stone wall or iron railing, standing at a high arched window with candlelight from behind, descending a shadowy staircase with unhurried grace, turning slowly toward the camera from a candlelit corridor, or sitting in a heavy carved chair with deliberate stillness',
      'The subject should feel like she belongs to the dark architecture rather than merely standing in front of it: reading from an ancient book by candlelight, lifting a candelabra while her gaze falls elsewhere, reaching toward a tapestry or dark artifact with quiet ownership, or pausing at a threshold as if she decides whether the dark follows her',
      'Use gothic narrative intent with composed presence rather than dramatic aggression: standing in shadow without concern, looking down from a tower height with cold aristocratic interest, or remaining perfectly still while the environment moves around her',
    ],
    comp: [
      'vertical gothic portrait with candlelit or moonlit atmospheric depth, clear face, dark architectural framing without obscuring the subject',
      'vertical full-body or three-quarter gothic composition, dramatic architectural setting clearly visible, subject as still center against the dark environment',
    ],
  },
  fantasy: {
    prop: [
      'Choose an action that places this person inside a magical world rather than in front of it: reaching toward a floating magical element with calm ease, walking through a glowing forest path as particles orbit naturally, pausing as magical light gathers near her hands, or simply standing still while the magical world moves around her presence',
      'The subject should feel like she belongs in the magical environment: a flower opening as she passes, a small creature landing nearby with trust, warm magical light gathering above her naturally, or standing on an enchanted path as if it was made for this moment',
      'Use fantasy behavior that communicates wonder and belonging rather than theatrical supernatural power: adjusting a floral crown while looking at a glowing landscape, trailing a hand through floating petals, or sitting on a mossy stone in a magical clearing with natural ease',
    ],
    comp: [
      'vertical fantasy portrait with magical environmental depth clearly visible, subject integrated into the magical scene, face clearly readable against soft glowing background',
      'vertical full-body or three-quarter magical portrait, enchanted environment and subject as cohesive world, foreground magical elements framing without obscuring the face',
    ],
  },
  myth_goddess: {
    prop: [
      'Choose an action that communicates divine authority through presence rather than dramatic gesture: standing at the center of a sacred architectural axis as if she summoned it, lifting one hand in a gesture of blessing or judgment with calm permanence, turning to acknowledge something below with composed divine awareness, or existing in stillness at the precise point where mortal and immortal realms meet',
      'The subject should feel like the environment responds to her rather than the reverse: sacred light converging at the point where she stands, other elements of the composition orienting toward her natural center, or architectural and natural features aligning to frame her position',
      'Use mythological behavior that projects scale through composure: descending from a celestial platform with measured grace, lifting her gaze from a sacred offering with divine attention, presiding over a ritual space with quiet authority, or turning as if hearing a prayer from a great distance',
    ],
    comp: [
      'vertical mythological portrait with sacred architectural or celestial axis reinforcing divine status, face clearly readable, cosmic environment framing the subject with appropriate scale',
      'vertical goddess composition with central axis or elevated position, divine environment fully legible, subject as the still center against a world in motion around her',
    ],
  },
};

const CATEGORY_POSE_MAP = {
  taiwan_travel: 'travel',
  europe_travel: 'travel',
  japan_travel: 'travel',
  korea_sea: 'travel',
  world_travel: 'travel',
  china_mark: 'travel',
  mountain_sea: 'travel',
  wedding_diamond: 'wedding',
  hanfu: 'hanfu',
  dynasty_palace: 'hanfu',
  tang_grandeur: 'hanfu',
  song_grace: 'hanfu',
  ming_grace: 'hanfu',
  qing_grace: 'hanfu',
  xianxia: 'hanfu',
  oriental: 'hanfu',
  chinese_story: 'hanfu',
  classic_lit: 'hanfu',
  jinyong: 'hanfu',
  china_drama: 'hanfu',
  drama: 'hanfu',
  hotdrama: 'hanfu',
  queen: 'queen',
  succubus_demon: 'queen',
  fallen_angel: 'gothic',
  holy_angel: 'myth_goddess',
  goddess_myth: 'myth_goddess',
  myth: 'myth_goddess',
  gothic: 'gothic',
  darkfantasy: 'gothic',
  fantasy: 'fantasy',
  water: 'fantasy',
};

// ═══════════════════════════════════════════
// 角色行為邏輯模板（CHARACTER BEHAVIOR LOGIC）
// 在 pose guidance 前插入角色身份與行為背景，
// 讓 AI 從「這個人在這個時刻會做什麼」出發選擇姿勢，
// 而不是從通用姿勢庫隨機挑選。
// ═══════════════════════════════════════════
const CHARACTER_BEHAVIOR_LOGIC = {
  xianxia: [
    'Character behavior context: this person is an immortal cultivator within a xianxia realm — her action should express inner stillness and spiritual awareness: sensing the energy of the location with quiet focus, releasing a spirit lantern or butterfly with purposeful calm, channeling spiritual intention through a contained gesture, or pausing at a threshold between worlds with composed knowing.',
    'Character behavior context: xianxia figures move with deliberate grace and minimal wasted motion — choose an action woven from the scene itself: stepping along a floating path, arranging a sleeve before a mirror pool, or standing still in a sacred location as spiritual energy gathers around her naturally.',
  ],
  hanfu: [
    'Character behavior context: this person is a historical figure embedded in classical Chinese society — her action should reflect her role and the present moment: a court lady adjusting a hairpin before an audience, a scholarly woman pausing mid-reading under pavilion eaves, a noble daughter standing alone in the garden with a private thought, or a traveler arriving at a destination with the journey still visible in her bearing.',
    'Character behavior context: hanfu figures move with cultural intentionality — each action has social and emotional meaning. Choose behavior grounded in classical life: offering tea, arranging flowers, reading poetry, playing the guqin, walking through a corridor with purpose, or pausing in a courtyard at an unexpected but natural moment.',
  ],
  wedding: [
    'Character behavior context: this bride is at the emotional center of the most important day — her action should carry that weight: taking a breath before entering, smoothing her gown with quiet focus, turning back toward someone calling her name, pausing alone in the last reflective moment before the ceremony, or walking with slow deliberate joy through a flower-lined space.',
    'Character behavior context: bridal behavior is layered with personal and ceremonial meaning — choose actions that feel private yet beautiful: touching the veil while looking at nothing in particular, adjusting the bouquet before leaving the preparation room, sitting calmly as natural light falls across her, or standing at a window as the last quiet moment before everything changes.',
  ],
  queen: [
    'Character behavior context: this ruler or commanding figure does not pose — she governs. Choose action that communicates power through purposeful motion: reviewing a document by lamplight, issuing a direction with one unhurried gesture, rising from a throne to address someone below, descending ceremonial steps with absolute composure, or standing at a high vantage point surveying her domain.',
    'Character behavior context: queens hold power through stillness as much as through action — choose behavior that projects authority with economy of movement: standing at the center of an architectural axis, regarding something below with calm assessment, turning to acknowledge a new arrival without surprise, or resting one hand on a symbol of power with complete ownership.',
  ],
  travel: [
    'Character behavior context: this traveler is defined by movement and genuine engagement with place — choose action that tells a story of being there: arriving at the location and pausing to absorb it, following a path while the camera catches her mid-step, reaching out to touch a landmark with natural curiosity, or standing somewhere significant while the light responds.',
    'Character behavior context: travel portraits feel most alive when the person belongs in the environment rather than in front of it — choose behaviors that integrate location: turning back after walking ahead, pausing at a staircase with scenery below, sitting on a natural or architectural element with relaxed confidence, or standing in a doorway as if deciding whether to enter.',
  ],
  gothic: [
    'Character behavior context: this gothic or dark character inhabits darkness with composure and elegance — choose action that communicates aristocratic mystery rather than aggression: standing at a high window with atmospheric light from behind, turning slowly in a candlelit hall, trailing fingertips along stone or iron with ownership, or sitting in heavy architecture with deliberate stillness.',
    'Character behavior context: gothic atmosphere comes from composure in dark environments — choose behavior that feels inevitable and owned: lighting a candle without hurry, reading with focused attention by low light, standing in shadow without concern, or pausing at a threshold as if the dark is a familiar companion.',
  ],
  fantasy: [
    'Character behavior context: this fantasy character is genuinely at home in a magical world — choose action that feels naturally wondrous rather than performative: reaching toward a floating magical element with calm ease, walking through a glowing path as the world responds, pausing as light gathers near her hands without theatrical effort, or standing in a magical clearing while the environment organizes around her.',
    'Character behavior context: fantasy characters interact with their world through magic and nature — choose action where the environment responds to her: flowers opening as she passes, magical light gathering above her naturally, a small creature arriving with trust, or magical elements trailing from her movement without staged drama.',
  ],
  myth_goddess: [
    'Character behavior context: this divine or mythological figure expresses divinity through presence rather than dramatic action — choose behavior that communicates cosmic scale with personal intimacy: standing at the center of a sacred space as ceremony unfolds around her, lifting one hand in blessing with calm permanence, turning to acknowledge something below with composed divine awareness, or existing in stillness at the precise intersection of mortal and immortal realms.',
    'Character behavior context: mythological figures are defined by the world responding to them — choose action where the environment acknowledges her: sacred light converging at the point where she stands, architectural and natural elements aligning to frame her position, or the composition itself orienting toward her as its natural center.',
  ],
  darkfantasy: [
    'Character behavior context: this dark fantasy figure occupies power in a dangerous or broken world — choose action that communicates authority through economy of movement: standing in the center of a dramatic landscape without concern, issuing one calm gesture that implies vast consequences, sitting at the position of command with composed sovereignty, or moving through a dangerous environment as the most powerful element within it.',
    'Character behavior context: dark fantasy power is expressed through indifference to danger and quiet command — choose action where the darkness responds to her: broken landscape positioned as backdrop to her calm authority, dark atmosphere gathering near her as a cooperative force, or the environment maintaining a reverent distance that confirms her absolute status.',
  ],
};

const CHARACTER_BEHAVIOR_GROUP_MAP = {
  xianxia: 'xianxia',
  hanfu: 'hanfu',
  dynasty_palace: 'hanfu',
  tang_grandeur: 'hanfu',
  song_grace: 'hanfu',
  ming_grace: 'hanfu',
  qing_grace: 'hanfu',
  oriental: 'hanfu',
  chinese_story: 'hanfu',
  classic_lit: 'hanfu',
  jinyong: 'hanfu',
  china_drama: 'hanfu',
  drama: 'hanfu',
  hotdrama: 'hanfu',
  wedding_diamond: 'wedding',
  queen: 'queen',
  succubus_demon: 'queen',
  fallen_angel: 'gothic',
  holy_angel: 'myth_goddess',
  goddess_myth: 'myth_goddess',
  myth: 'myth_goddess',
  spirits: 'myth_goddess',
  gothic: 'gothic',
  darkfantasy: 'darkfantasy',
  fantasy: 'fantasy',
  water: 'fantasy',
  taiwan_travel: 'travel',
  europe_travel: 'travel',
  japan_travel: 'travel',
  korea_sea: 'travel',
  world_travel: 'travel',
  china_mark: 'travel',
  mountain_sea: 'travel',
};

function pickRandom(list){
  if(!Array.isArray(list) || list.length === 0) return '';
  return list[Math.floor(Math.random() * list.length)];
}

function sanitizeSelectionId(id, bannedIds, fallbackId){
  return bannedIds.includes(id) ? fallbackId : id;
}

function sanitizeOptionId(id, options, fallbackId){
  const nextId = id || fallbackId;
  return options.some(option => option.id === nextId) ? nextId : fallbackId;
}

function sanitizeLensId(id){
  return sanitizeOptionId(id, LENS, 'l_50');
}

function sanitizeLightId(id){
  return sanitizeOptionId(id, LIGHT_STYLE, 'ls_natural');
}

function sanitizeAtmId(id){
  return sanitizeOptionId(id, ATM, 'at_clear');
}

function sanitizePromptText(text){
  if(!text) return '';
  let next = text;
  TEXT_REPLACEMENTS.forEach(([from, to]) => {
    next = next.replace(new RegExp(escapeRegExp(from), 'gi'), to);
  });
  return next
    .replace(/movie trailer camera language/gi, 'controlled portrait camera framing')
    .replace(/fashion editorial camera language/gi, 'controlled portrait camera framing')
    .replace(/blockbuster visual language/gi, 'natural portrait visual language')
    .replace(/\bblockbuster\b/gi, 'cinematic quality')
    .replace(/\bvlog\b/gi, 'location portrait')
    .replace(/dramatic hero framing/gi, 'stable portrait framing')
    .replace(/looking back over shoulder/gi, 'gentle three-quarter pause')
    .replace(/turn-back glance/gi, 'calm paused glance')
    .replace(/low angle upward shot/gi, 'stable eye-level or slight three-quarter shot')
    .replace(/low-angle/gi, 'stable eye-level')
    .replace(/perfect beauty reconstruction/gi, 'natural appearance')
    .replace(/perfect beauty/gi, 'natural appearance')
    .replace(/flawless/gi, 'natural')
    .replace(/luxury beauty enhancement/gi, 'natural styling')
    .replace(/luxury beauty/gi, 'natural styling')
    .replace(/\bgoddess\b/gi, 'regal figure')
    .replace(/\bheroine\b/gi, 'central character')
    .replace(/\bcelebrity\b/gi, 'reference subject')
    .replace(/cat-eye liner reshaping/gi, 'soft liner reshaping')
    .replace(/cat-eye/gi, 'soft liner')
    .replace(/heavy smoky eye/gi, 'controlled smoky eye')
    .replace(/extreme pose/gi, 'controlled pose')
    .replace(/jumping/gi, 'grounded motion')
    .replace(/spinning/gi, 'gentle movement')
    .replace(/back-facing/gi, 'face-readable')
    .replace(/ethereal (light|glow|atmosphere|particles?)/gi, 'soft atmospheric light')
    .replace(/celestial (particles?|radiance|glow|light)/gi, 'soft ambient light')
    .replace(/immortal realm glow/gi, 'soft environmental glow')
    .replace(/divine radiance/gi, 'warm environmental light')
    .replace(/xianxia ethereal/gi, 'soft xianxia atmospheric')
    .replace(/travel documentary/gi, 'location portrait')
    .replace(/candid travel/gi, 'grounded travel portrait')
    .replace(/low-key dramatic/gi, 'controlled dramatic')
    .replace(/ethereal atmosphere/gi, 'soft atmosphere')
    .replace(/celestial mist/gi, 'light atmospheric mist');
}

function escapeRegExp(text){
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildAntiPatternGuidance(){
  return 'ANTI-PATTERN OVERRIDE: no low-angle hero shots, back-facing poses, movie-trailer staging, eye-shape-changing liner, or extreme choreography — replace with face-readable, identity-safe alternatives.';
}

function sanitizeCreativeField(text){
  if(!text) return '';
  return sanitizePromptText(text)
    .replace(/bold eyeliner/gi, 'controlled eyeliner')
    .replace(/high-fashion/gi, 'refined')
    .replace(/luxury fashion/gi, 'refined styling');
}

function buildFaceAnchor(desc){
  if(!desc) return '';
  return `SUBJECT FACE DESCRIPTION (absolute ground truth — overrides all style, archetype, and beauty references): ${desc}. ` +
    `These specific features must be reproduced exactly as described. ` +
    `Any AI tendency to replace them with xianxia, dynasty, goddess, or influencer archetype faces must be completely suppressed.`;
}

function buildCharacterBehaviorContext(cat){
  const group = CHARACTER_BEHAVIOR_GROUP_MAP[cat.id] || CHARACTER_BEHAVIOR_GROUP_MAP[cat.tpl] || null;
  if(!group) return '';
  const logicList = CHARACTER_BEHAVIOR_LOGIC[group];
  if(!logicList || logicList.length === 0) return '';
  return pickRandom(logicList);
}

function getCategoryPosePack(cat){
  const group = CATEGORY_POSE_MAP[cat.id] || CATEGORY_POSE_MAP[cat.tpl] || null;
  return group ? CATEGORY_POSE_LIBRARY[group] : null;
}

function getCategoryRule(cat){
  const rules = GOVERNANCE.categoryRules || {};
  return Object.values(rules).find(rule => {
    const categories = rule.categories || [];
    return categories.includes(cat.id) || categories.includes(cat.tpl);
  }) || null;
}

function buildLensGuidance(cat, lens){
  const rule = getCategoryRule(cat);
  const base = rule && rule.guidance ? rule.guidance : '';
  const selected = lens && lens.id ? `Selected lens policy: ${lens.name} — ${lens.desc}` : '';
  return [base, selected].filter(Boolean).join(' ');
}

function buildPoseGuidance({cat, entry, camLang, proAction}){
  const guidance = [];
  const posePack = getCategoryPosePack(cat);
  const behaviorCtx = buildCharacterBehaviorContext(cat);
  if(behaviorCtx) guidance.push(behaviorCtx);

  if(proAction){
    guidance.push('Honor the selected action, but adjust if needed to keep the pose natural, front-face-friendly, and identity-safe.');
  } else {
    guidance.push(pickRandom(SAFE_POSE_VARIANTS));
    if(posePack) guidance.push(`Pose: ${pickRandom(posePack.prop)}`);
  }

  if(!entry.prop){
    guidance.push('Infer a natural action from role, setting, costume, and scene atmosphere rather than defaulting to a plain standing pose.');
  }
  guidance.push('Face-body rule: if any action forces the face, neck, or shoulders into mismatch with the uploaded identity, soften the pose until face and body read as one real person.');
  return guidance.filter(Boolean).join(' ');
}

// ═══════════════════════════════════════════
// 場景智慧預設值（選分類/場景時自動套用）
// ═══════════════════════════════════════════
const TPL_DEFAULTS = {
  xianxia:       {ang:'sanfen',   ratio:'r_34',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  hanfu:         {ang:'sanfen',   ratio:'r_34',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  oriental:      {ang:'sanfen',   ratio:'r_34',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  gothic:        {ang:'sanfen',   ratio:'r_23',  lens:'l_70',  light:'ls_studio',    atm:'at_clear',    camLang:'cl_fashion'},
  myth:          {ang:'sanfen',   ratio:'r_23',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  fantasy:       {ang:'sanfen',   ratio:'r_34',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  water:         {ang:'sanfen',   ratio:'r_34',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  reference_styles:{ang:'sanfen', ratio:'r_916', lens:'l_50',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
  game:          {ang:'quan',     ratio:'r_23',  lens:'l_80',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
  darkfantasy:   {ang:'sanfen',   ratio:'r_23',  lens:'l_70',  light:'ls_studio',    atm:'at_clear',    camLang:'cl_fashion'},
  drama:         {ang:'sanfen',   ratio:'r_23',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  queen:         {ang:'sanfen',   ratio:'r_34',  lens:'l_70',  light:'ls_studio',    atm:'at_warm',     camLang:'cl_magazine'},
  spirits:       {ang:'sanfen',   ratio:'r_34',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  europe_travel: {ang:'huanjing', ratio:'r_916', lens:'l_50',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
  japan_travel:  {ang:'huanjing', ratio:'r_916', lens:'l_50',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
  korea_sea:     {ang:'huanjing', ratio:'r_916', lens:'l_50',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
  world_travel:  {ang:'huanjing', ratio:'r_916', lens:'l_50',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
  china_mark:    {ang:'huanjing', ratio:'r_916', lens:'l_50',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
  jinyong:       {ang:'sanfen',   ratio:'r_34',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  chinese_story: {ang:'sanfen',   ratio:'r_34',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  fallen_angel:  {ang:'sanfen',   ratio:'r_23',  lens:'l_70',  light:'ls_studio',    atm:'at_misty',    camLang:'cl_fashion'},
  holy_angel:    {ang:'sanfen',   ratio:'r_23',  lens:'l_70',  light:'ls_natural',   atm:'at_misty',    camLang:'cl_magazine'},
  goddess_myth:  {ang:'sanfen',   ratio:'r_23',  lens:'l_70',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  cyberpunk_sf:  {ang:'sanfen',   ratio:'r_916', lens:'l_80',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
  realistic_life:{ang:'huanjing', ratio:'r_916', lens:'l_70',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_social'},
  modern_lady:   {ang:'sanfen',   ratio:'r_34',  lens:'l_70',  light:'ls_studio',    atm:'at_clear',    camLang:'cl_magazine'},
  dragon_beast:  {ang:'sanfen',   ratio:'r_916', lens:'l_50',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
  beast_tamer:   {ang:'huanjing', ratio:'r_23',  lens:'l_50',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
  dynasty_palace:{ang:'sanfen',   ratio:'r_34',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  classic_lit:   {ang:'sanfen',   ratio:'r_34',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  china_drama:   {ang:'sanfen',   ratio:'r_34',  lens:'l_50',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_magazine'},
  succubus_demon:{ang:'sanfen',   ratio:'r_23',  lens:'l_70',  light:'ls_studio',    atm:'at_warm',     camLang:'cl_fashion'},
  taiwan_travel: {ang:'huanjing', ratio:'r_916', lens:'l_50',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
  wedding_diamond:{ang:'sanfen',  ratio:'r_34',  lens:'l_50',  light:'ls_studio',    atm:'at_warm',     camLang:'cl_magazine'},
  cos_character: {ang:'quan',     ratio:'r_23',  lens:'l_80',  light:'ls_studio',    atm:'at_clear',    camLang:'cl_magazine'},
  mountain_sea:  {ang:'huanjing', ratio:'r_169', lens:'l_50',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_magazine'},
};

// ═══════════════════════════════════════════
// 妝容庫
// ═══════════════════════════════════════════
const MK = [
  {id:'xianxia',    name:'仙氣靈秀', desc:'xianxia-style surface makeup applied on the original face: soft defined brows, pale champagne or gold shimmer eye shadow, peach or nude lip color, sheer cosmetics evoking an immortal aesthetic — applied as surface layer only without altering facial structure'},
  {id:'gudian_hong',name:'古典紅妝', desc:'classical Tang-era red makeup: pale powder base, defined arch brows, bold vermillion red lip, subtle eye contour, traditional court beauty aesthetic'},
  {id:'gongting',   name:'宮廷盛妝', desc:'elaborate imperial court makeup: white powder base, painted high arch brows, layered eye shadow, decorative forehead floral mark, bright vermillion lip, full court splendor'},
  {id:'wuxia',      name:'武俠颯爽', desc:'capable warrior natural makeup: clean defined skin, strong brows, clean eyeliner, neutral or light red lip, fresh and capable without excess decoration'},
  {id:'gothic',     name:'哥德暗黑', desc:'gothic surface makeup: cool-toned complexion base, eye shadow in black, burgundy or deep violet, bold black upper eyeliner, dark wine or black-red lip — surface cosmetics only, cold dramatic elegance without reshaping the face'},
  {id:'mermaid',    name:'珠光水女', desc:'pearlescent aqua surface makeup: pearl shimmer highlights on skin, gradient eye shadow in ocean blue or lavender, glossy dewy lip in coral or clear, fresh oceanic shimmer as surface cosmetics only without altering skin texture'},
  {id:'mermaid_pearl', name:'深海珠光', desc:'deep-sea pearl makeup: dewy luminous skin, pearlescent blue-violet eye glow, wet-look shimmer highlights, coral-rose glossy lip, aquatic fantasy elegance without changing facial structure'},
  {id:'fox',        name:'狐妖魅惑', desc:'fox enchantress seductive makeup: sultry smoky eye in amber and deep brown, slanted eyeliner for foxy eye shape, bold deep wine or crimson lip, warm golden shimmer on skin, dangerously beautiful, eye-direction styling as surface liner only without reshaping original eye structure'},
  {id:'fox_noir',   name:'九尾深妝', desc:'nine-tailed fox surface makeup: layered gold and black eye shadow, extended upper liner for fox-eye silhouette, deep burgundy-red lip, warm golden shimmer on skin — applied as surface cosmetics only, respecting the original eye shape, eyelid structure, and facial structure'},
  {id:'cyber',      name:'賽博冷光', desc:'cyberpunk chrome makeup: clean high-contrast skin finish, precise metallic liner, cool neon blue or magenta eye accents, glossy structured lip, controlled futuristic glow'},
  {id:'cyber_idol', name:'賽博偶像', desc:'futuristic idol stage makeup: high-shine luminous skin, colorful graphic eye shadow in electric blue or pink, precise graphic liner, glossy bold lip, holographic or metallic highlights'},
  {id:'oriental',   name:'東方淡妝', desc:'soft oriental minimalist makeup: natural translucent skin, barely-there brow fill, warm neutral eye shadow with soft eyeliner, soft pink or coral lip, understated refined elegance'},
  {id:'yaohou',     name:'妖后魅惑', desc:'demon queen surface makeup: smoky eye shadow in deep purple or black, bold upper eyeliner, dark wine or blood-red lip — applied on the original face as surface cosmetics only, preserving natural facial structure'},
  {id:'succubus_alluring', name:'魅魔魅惑', desc:'succubus alluring surface makeup: smoky violet-black eye shadow, sharp but elegant winged eyeliner, crimson inner-corner eye shadow, deep wine or rose-black glossy lips, subtle pink heart-shaped highlight motifs near the eyes or cheeks — seductive supernatural surface cosmetics while preserving the original face'},
  {id:'demon_lord', name:'魔王威壓', desc:'demon sovereign makeup: dark regal contour kept surface-only, blackened red smoky eyes, controlled blood-red lip, subtle obsidian and antique-gold highlights, commanding underworld authority without facial reshaping'},
  {id:'fallen_angel', name:'墮天使冷焰', desc:'fallen angel surface makeup: cool-toned complexion, smoky charcoal and violet eye shadow, silver tear-like shimmer, muted wine lip — surface cosmetics evoking tragic celestial corruption without altering facial structure'},
  {id:'angel_holy', name:'聖堂天使', desc:'holy angel makeup: clean radiant skin, soft champagne shimmer eyes, pearl-white highlights, gentle rose lip, pure golden-white celestial glow with serene dignity'},
  {id:'imperial_empress', name:'帝后權威', desc:'imperial empress makeup: immaculate ceremonial base, defined noble brows, refined red lip, subtle forehead ornament or floral mark, gold-highlighted eyes, dignified absolute authority'},
  {id:'tang_peony_soft', name:'盛唐花鈿', desc:'Tang peony court makeup: soft powdered base, round warm blush, floral forehead mark, peach-red lip, golden eye shimmer, opulent Tang dynasty feminine grace'},
  {id:'song_pearl_lady', name:'宋代珍珠', desc:'Song dynasty pearl makeup: refined pale translucent base, slender brows, minimal soft eyeliner, small rose lip, delicate pearl-like highlights, scholarly quiet elegance'},
  {id:'outdoor_glow', name:'外景光感', desc:'outdoor cinematic glow makeup: natural skin texture, warm sunlit highlights, softly defined brows and lashes, healthy peach or rose lip, camera-ready but realistic travel-photo finish'},
  {id:'natural_clean', name:'自然裸妝', desc:'natural clean makeup: barely visible complexion polish, natural brows, soft brown lash definition, nude-pink lip, realistic everyday beauty while preserving all original facial details'},
  {id:'editorial', name:'高級寫真', desc:'high-fashion editorial makeup: polished luminous skin, sculpted but natural eyes, refined liner, luxury neutral or red lip, magazine-grade sophistication without beauty-filter face replacement'},
  {id:'global_sun', name:'環球日光', desc:'global travel sun-kissed makeup: warm bronzed glow, soft golden highlights, natural eye definition, healthy coral lip, international travel editorial freshness'},
  {id:'cinematic', name:'電影角色', desc:'cinematic character makeup: story-driven professional screen makeup, balanced complexion, expressive eyes suited to the scene, controlled lip color and believable film-production realism'},
  {id:'character_pop', name:'動漫角色', desc:'anime or game character-inspired makeup: vivid but realistic eye color accents, clean graphic liner, bright polished lip, expressive cosplay energy without turning the face into a cartoon'},
  {id:'flower_fairy', name:'花仙柔妝', desc:'flower fairy makeup: soft petal blush, luminous pastel eye shimmer, floral pink or peach lip, delicate botanical glow, romantic fantasy freshness'},
  {id:'oracle_gold', name:'神諭金妝', desc:'divine oracle gold makeup: radiant gold eye accents, clean luminous skin, symbolic temple-like shimmer, noble rose-gold lip, sacred mythological authority'},
  {id:'dragon_epic', name:'龍族戰妝', desc:'dragon epic battle makeup: strong brows, bronze or emerald metallic eye accents, restrained warrior contour, deep red or neutral lip, fierce elemental fantasy power'},
  {id:'wedding', name:'鑽光婚紗', desc:'bridal surface makeup: champagne shimmer highlights, soft romantic eye definition, rose or nude glossy lip, elegant tenderness — applied as surface cosmetics respecting original skin texture and facial features'},
  {id:'luxury_glam', name:'奢華名媛', desc:'luxury glamour surface makeup: refined smoky eye shadow, champagne highlighter, elegant red or nude lip — surface-only cosmetics for a premium socialite aesthetic without altering the original complexion'},
  {id:'runway_supermodel', name:'超模秀場', desc:'runway supermodel makeup: sculptural editorial eyes, clean cheekbone highlights kept surface-only, neutral or bold fashion lip, high-end runway confidence'},
  {id:'japanese_geisha', name:'和風藝伎', desc:'Japanese classical stage makeup: pale refined base, precise red lip, delicate black liner, controlled blush and traditional elegance adapted tastefully for portrait realism'},
  {id:'magic_girl', name:'魔法少女', desc:'magical girl makeup: bright youthful fantasy eye shimmer, soft pink blush, glossy cherry lip, sparkling highlights, cheerful heroic character energy'},
  {id:'bohemian_sun', name:'波西米亞', desc:'bohemian sun makeup: warm natural skin, bronze-gold eye shimmer, soft earthy blush, terracotta or peach lip, relaxed outdoor festival and desert travel beauty'},
  {id:'vampire_lady', name:'吸血貴女', desc:'vampire noble makeup: pale luminous base, deep burgundy smoky eyes, sharp elegant liner, blood-wine lip, aristocratic nocturnal glamour'},
  {id:'india_bold', name:'印度華麗', desc:'Indian bold makeup: radiant warm skin, dramatic kohl-rimmed eyes, gold shimmer, rich berry or red lip, ornate festive elegance'},
  {id:'arabica_mystic', name:'沙漠神祕', desc:'Arabian mystic makeup: smoky bronze eyes, precise dark liner, warm golden highlights, rose-brown lip, desert palace mystery and luxury'},
  {id:'hk_film', name:'港風電影', desc:'Hong Kong film makeup: soft cinematic skin, classic defined brows, gentle smoky eyes, muted red or rose lip, nostalgic movie-star atmosphere'},
];

// ═══════════════════════════════════════════
// 鏡頭角度庫
// ═══════════════════════════════════════════
const ANG = [
  {id:'sanfen',  name:'鎖臉微側', zh:'臉只微側10-15°，不破壞五官', desc:'identity-safe micro three-quarter angle: face remains mostly front-facing, only a subtle 10-15 degree head turn, shoulders may angle gently, facial geometry stays readable and recognizable'},
  {id:'zheng',   name:'正面人像', zh:'臉正對鏡頭，對稱感強', desc:'front-facing portrait, face directly toward camera, symmetrical framing'},
  {id:'banshen', name:'半身人像', zh:'腰部以上，服裝道具清楚', desc:'half-body portrait from waist up, showing face, upper costume details, and hand props'},
  {id:'quan',    name:'全身人像', zh:'頭到腳，完整服裝剪裁', desc:'full body shot head to feet, complete costume visible from crown to hem'},
  {id:'huanjing',name:'環境人像', zh:'融入大場景，強調地點感', desc:'environmental portrait, person within larger scene context, showing relationship between subject and full setting'},
];

// ═══════════════════════════════════════════
// 分類範本（共用欄位）
// ═══════════════════════════════════════════
const TPLS = {
  xianxia: {
    char:'character exists within a xianxia immortal realm setting',
    light:'cinematic lighting matched to the story setting, flattering face key light, atmospheric rim light, balanced contrast, readable facial identity',
    outfit:'complete xianxia couture styling — distinct outfit silhouette, elaborate hairpins and step-shake ornaments, trailing wide sleeves, jade ornaments, flowing silk',
    fx:'story-specific xianxia atmosphere, fabric motion, environmental particles, cinematic effects that support the face without covering it',
    tone:'coherent palette built for the specific story setting, refined cinematic color grading',
    comp:'full-body or three-quarter editorial composition, clear face, readable costume silhouette, decisive story pose, editorial framing with natural proportions',
    quality:'ultra realistic premium travel portrait, detailed costume texture, natural skin, coherent anatomy, high-end editorial finish, 8K HDR',
    mk:'xianxia', ancient:true
  },
  hanfu: {
    char:'character exists within a Chinese historical setting',
    scene_prefix:'Chinese historical travel setting',
    light:'warm palace light or soft garden daylight, flattering face illumination, cinematic depth',
    outfit:'dynasty-inspired hanfu or historical couture with embroidered layers, hairpins, jade, ribbons, and matching hand prop',
    fx:'silk ribbon motion, petals, lantern glow, incense mist, cinematic fabric movement',
    tone:'vermilion, jade, ivory, gold, ink blue, soft historical palette',
    comp:'premium travel-editorial composition, full-body or three-quarter framing, face sharp and readable, outfit and environment clearly visible',
    quality:'ultra realistic premium cinematic photoshoot, detailed costume texture, natural skin, coherent anatomy, high-end editorial polish, 8K HDR',
    mk:'gudian_hong', ancient:true
  },
  oriental: {
    char:'character exists within an East Asian classical setting',
    scene_prefix:'distinct East Asian classical scene',
    light:'cinematic lighting matched to the classical theme, flattering face key light, atmospheric rim light, balanced contrast',
    outfit:'complete classical East Asian couture styling designed for the theme, detailed accessories, coherent hairstyle, premium photoshoot finish',
    fx:'theme-specific atmosphere, fabric motion, subtle particles, environmental depth, effects supporting the face without covering it',
    tone:'coherent palette matched to the specific classical theme, refined cinematic color grading',
    comp:'premium full-body or three-quarter editorial composition, clear face, outfit and setting readable',
    quality:'ultra realistic premium travel portrait, detailed costume texture, natural skin, coherent anatomy, 8K HDR',
    mk:'oriental', ancient:true
  },
  gothic: {
    char:'character exists within a dark gothic fantasy setting',
    light:'controlled studio lighting with atmospheric shadows, precise face key light, deep selective highlights with dark crimson or violet rim',
    outfit:'gothic couture — dark velvet or lace gown, dramatic silhouette, dark jewelry and accessories, elegant cape or veil',
    fx:'dark velvet shadows, subtle magic smoke, crimson or violet particles, candle bokeh, cinematic low-key atmosphere',
    tone:'black, burgundy, antique silver, deep violet, candle gold',
    comp:'vertical premium character travel-editorial composition, full-body or three-quarter framing, face sharp and readable, outfit and environment clearly visible',
    quality:'ultra realistic premium cinematic travel photoshoot, detailed costume texture, natural skin, coherent anatomy, high-end editorial polish, 8K HDR',
    mk:'gothic', ancient:false
  },
  myth: {
    char:'character exists within a Chinese mythology-inspired setting',
    scene_prefix:'Chinese mythology-inspired environment',
    light:'cinematic lighting matched to the mythological theme, flattering face key light, atmospheric rim light, balanced contrast',
    outfit:'complete mythological couture designed for the theme — ornate ceremonial robes, divine accessories, elaborate headdress, period-authentic spirit of the legend',
    fx:'theme-specific mythological atmosphere, fabric motion, divine particles, environmental depth, cinematic effects supporting the face',
    tone:'coherent palette matched to the mythological theme, refined cinematic color grading with strong symbolic color identity',
    comp:'premium full-body or three-quarter editorial composition, clear face, outfit and mythological setting readable',
    quality:'ultra realistic premium myth-history travel portrait, detailed costume texture, natural skin, coherent anatomy, 8K HDR',
    mk:'xianxia', ancient:true
  },
  fantasy: {
    char:'character exists within a magical fantasy setting',
    light:'magical soft light, glowing fantasy illumination, pearlescent highlights, dreamlike atmosphere',
    outfit:'fantasy-inspired magical costume — flowing enchanted dress, flower or crystal crown, whimsical accessories, magical props',
    fx:'magical particles, glowing effects, fantasy atmosphere, floating elements, dreamlike bokeh',
    tone:'pastel magical palette — lavender, rose gold, seafoam, pearl white, soft gold',
    comp:'premium full-body or three-quarter editorial composition, clear face, magical environment fully visible',
    quality:'ultra realistic premium fantasy editorial portrait, detailed costume texture, natural skin, coherent anatomy, 8K HDR',
    mk:'flower_fairy', ancient:false
  },
  water: {
    char:'character exists within a dreamy water or floral fantasy setting',
    scene_prefix:'dreamy water, flower, glasshouse, pool, aquarium, rain, lotus, or underwater-inspired scene',
    light:'soft diffused water light, pearlescent highlights, clear face illumination',
    outfit:'water-silk gown or floral dress, pearl ornaments, floral crown, translucent sleeves, light floating fabric',
    fx:'water ripples, pearl bubbles, flower petals, jellyfish glow, mist, refracted light',
    tone:'aqua, pearl white, soft pink, lavender, sea green',
    comp:'premium travel-editorial composition, full-body or three-quarter framing, face sharp and readable, outfit and environment clearly visible',
    quality:'ultra realistic premium cinematic photoshoot, detailed costume texture, natural skin, coherent anatomy, high-end editorial polish, 8K HDR',
    mk:'mermaid_pearl', ancient:false
  },
  reference_styles: {
    char:'character exists within a reference-inspired fantasy or travel editorial setting',
    light:'reference-inspired cinematic lighting with strong face readability, controlled rim light, natural skin texture, atmospheric depth, no plastic beauty-filter look',
    outfit:'complete couture styling translated from the reference mood, coherent hairstyle and accessories, premium fabric texture, tasteful fantasy or travel-fashion finish',
    fx:'reference-inspired atmosphere, fabric motion, reflective particles, water shimmer, moon glow, golden haze, or location-specific depth; effects frame the face without covering eyes, nose, mouth, or face outline',
    tone:'palette matched to the selected reference concept with refined cinematic color grading',
    comp:'premium reference-style editorial composition, face sharp and readable, body alignment coherent, costume and environment clearly visible',
    quality:'ultra realistic premium reference-inspired portrait, natural skin, coherent anatomy, detailed costume and environment texture, high-end editorial finish, 8K HDR',
    mk:'editorial', ancient:false
  },
  game: {
    char:'character exists within a game-inspired original character setting',
    scene_prefix:'game key-art environment — hangar, arena, neon city, fantasy stage, digital realm, or quest location',
    light:'dramatic game key-art lighting, colorful rim light, clear face key',
    outfit:'sci-fi, fantasy, idol, tactical, or adventure costume with detailed accessories and clean original design',
    fx:'HUD glow, energy trails, holograms, sparks, magic glyphs, dynamic action particles',
    tone:'electric blue, magenta, white, black, gold, vivid accent palette',
    comp:'premium travel-editorial composition, full-body or three-quarter framing, face sharp and readable, outfit and environment clearly visible',
    quality:'ultra realistic premium cinematic photoshoot, detailed costume texture, natural skin, coherent anatomy, high-end editorial polish, 8K HDR',
    mk:'character_pop', ancient:false
  },
  darkfantasy: {
    char:'character exists within a dark fantasy setting',
    light:'dramatic controlled studio lighting, strong atmospheric rim, deep shadows with selective highlights, sinister atmospheric depth',
    outfit:'dark fantasy costume — elaborate dark robes or armor, sinister accessories, dramatic silhouette, dark crown or headdress',
    fx:'dark energy particles, atmospheric haze, shadow effects, moonlit particles, dramatic sinister light',
    tone:'deep black, blood red, dark purple, sinister gold, shadow atmosphere',
    comp:'full-body or three-quarter cinematic portrait, story-driven pose, clear face, costume and dark location fully readable',
    quality:'ultra realistic premium cinematic travel photoshoot, detailed costume and environment texture, natural skin, coherent anatomy, 8K HDR',
    mk:'demon_lord', ancient:false
  },
  drama: {
    char:'character exists within a Chinese period drama setting',
    light:'cinematic desaturated light with strong red-vs-background contrast, clear face illumination, dramatic rim light',
    outfit:'deep crimson flowing hanfu battle dress, oversized long sleeves, embroidered gold trim, wide flying skirt train, ornate golden hair crown, long hair moving in wind',
    fx:'massive crimson skirt flying dramatically, wind-blown hair, fabric trails, dust or petals, epic xianxia drama atmosphere',
    tone:'deep crimson red against cold grey, ink blue, snow white, desert gold, or night lantern amber',
    comp:'ultra wide full-body epic xianxia drama composition, eye-level or dynamic side framing, subject small enough to show the grand environment, face still clear and readable',
    quality:'Chinese xianxia costume-drama cinematic poster, Lost You Forever inspired red-dress grand-scene mood, ultra realistic fabric motion, 8K HDR, shallow depth of field',
    mk:'cinematic', ancient:true
  },
  queen: {
    char:'character exists within a regal palace or sovereign setting',
    light:'controlled face key light, atmosphere-matched rim light, premium period-drama lighting, clear readable facial identity',
    outfit:'majestic queen couture — structured royal gown, jeweled crown, embroidered cape, ceremonial jewelry, powerful silhouette',
    fx:'gold dust, banners, throne glow, ceremonial wind through cape',
    tone:'palette matched to the story, refined cinematic grading, strong costume-location harmony',
    comp:'full-body or three-quarter cinematic portrait, story-driven pose, clear face, costume and location fully readable',
    quality:'premium myth-history travel portrait, ultra realistic fabric and jewelry detail, 8K HDR',
    mk:'imperial_empress', ancient:true
  },
  spirits: {
    char:'character exists within a mythological spirit-court setting',
    light:'controlled face key light, atmosphere-matched rim light, premium period-drama lighting, clear readable facial identity',
    outfit:'elaborate spirit-queen or enchantress couture — luxurious court robes with mythological motifs, ornate hairpins, long sleeves, jeweled belt, elegant dangerous styling',
    fx:'spirit fire, mystical smoke, palace lantern shadows, golden sparks, translucent spirit effects',
    tone:'palette matched to the myth or history story, refined cinematic grading, strong costume-location harmony',
    comp:'full-body or three-quarter cinematic portrait, story-driven pose, clear face, costume and location fully readable',
    quality:'premium myth-history travel portrait, ultra realistic fabric and jewelry detail, 8K HDR',
    mk:'fox_noir', ancient:true
  },
  europe_travel: {
    char:'character exists within a European travel portrait setting',
    light:'natural European location light — soft morning or golden hour daylight, flattering face illumination',
    outfit:'stylish contemporary travel fashion — chic dress or casual luxury attire, coordinated accessories, location-appropriate styling',
    fx:'iconic architectural bokeh, European location atmosphere, soft environmental depth',
    tone:'warm European palette — stone, terracotta, ivory, pastel walls, golden afternoon light',
    comp:'premium travel editorial, subject in foreground with iconic landmark visible, full-body or three-quarter framing',
    quality:'ultra realistic premium travel portrait, detailed fashion and location texture, natural skin, coherent anatomy, 8K HDR',
    mk:'outdoor_glow', ancient:false
  },
  japan_travel: {
    char:'character exists within a Japanese travel portrait setting',
    light:'Japanese natural light — soft diffused sakura-filtered or morning shrine light, flattering face illumination',
    outfit:'modern Japanese minimalist fashion or kimono-inspired styling with coordinated accessories',
    fx:'Japanese atmospheric depth — cherry blossom petals, bamboo light, torii glow',
    tone:'sakura pink, moss green, stone grey, lacquer red, wood warmth, ink white',
    comp:'premium travel editorial with iconic Japanese location integrated, full-body or three-quarter framing',
    quality:'ultra realistic premium travel portrait, 8K HDR',
    mk:'outdoor_glow', ancient:false
  },
  korea_sea: {
    char:'character exists within a Korean or Southeast Asian travel portrait setting',
    light:'soft Korean or tropical Southeast Asian natural light, flattering environmental illumination',
    outfit:'modern Korean street fashion or Southeast Asian inspired styling with trend-forward accessories',
    fx:'location atmosphere — Korean palace glow, tropical warmth, lush botanical depth',
    tone:'soft pastel contemporary palette or vibrant tropical warmth matched to the specific location',
    comp:'premium travel editorial composition with location integrated, full-body or three-quarter framing',
    quality:'ultra realistic premium travel portrait, 8K HDR',
    mk:'outdoor_glow', ancient:false
  },
  world_travel: {
    char:'character exists within a global landmark travel setting',
    light:'location-specific natural or golden hour light, flattering authentic illumination',
    outfit:'sophisticated contemporary travel fashion matched to the location culture and environment',
    fx:'iconic world landmark atmosphere, global environmental depth and authentic local character',
    tone:'palette matched to the specific world location and cultural environment',
    comp:'premium travel editorial composition, iconic landmark fully visible behind subject',
    quality:'ultra realistic premium world travel portrait, 8K HDR',
    mk:'global_sun', ancient:false
  },
  china_mark: {
    char:'character exists within an iconic Chinese landmark travel setting',
    light:'golden hour or atmospheric Chinese landscape light, flattering location illumination',
    outfit:'contemporary Chinese fashion or hanfu-inspired travel styling with matching accessories and cultural character',
    fx:'iconic Chinese landmark atmosphere, cultural environmental depth',
    tone:'palette inspired by the specific Chinese landmark — crimson, jade, ink, gold, mountain mist',
    comp:'premium travel editorial with Chinese landmark, full-body or three-quarter framing, landmark clearly visible',
    quality:'ultra realistic premium Chinese landmark travel portrait, 8K HDR',
    mk:'outdoor_glow', ancient:false
  },
  jinyong: {
    char:'character exists within a wuxia martial-arts setting',
    light:'cinematic wuxia lighting — warm candlelight or cold mountain daylight matched to the character world',
    outfit:'complete Jin Yong era-appropriate wuxia costume — hanfu martial arts dress, character-signature hair styling, authentic wuxia accessories and weapon prop',
    fx:'fabric motion, subtle wuxia energy atmosphere, era-authentic environment, cinematic story elements',
    tone:'palette matched to the specific character world — desert gold, mountain green, palace red, lake blue',
    comp:'premium character portrait, clear face, wuxia costume and story environment fully readable',
    quality:'premium wuxia character portrait, ultra realistic fabric texture, 8K HDR',
    mk:'wuxia', ancient:true
  },
  chinese_story: {
    char:'character exists within a Chinese folklore or classical story setting',
    light:'cinematic story-matched lighting — warm interior, misty outdoor, moonlit, or golden seasonal light',
    outfit:'costume appropriate for the specific story and character — dynasty hanfu, mythological dress, classical folk costume',
    fx:'story-specific atmospheric effects, fabric motion, seasonal and environmental storytelling elements',
    tone:'palette matched to the specific story world and emotional register',
    comp:'premium classical character portrait, clear face, story costume and setting fully readable',
    quality:'premium Chinese classical story portrait, ultra realistic fabric and environment texture, 8K HDR',
    mk:'gudian_hong', ancient:true
  },
  fallen_angel: {
    char:'character exists within a fallen celestial setting',
    light:'dramatic otherworldly lighting — harsh divine white light from above opposed by deep void darkness below',
    outfit:'fallen divine armor or torn celestial robes — cracked dark halo, asymmetric wings one intact one shattered, dark silver and void black styling',
    fx:'falling dark feathers, fracturing divine light, void energy particles, dramatic heaven-to-darkness atmosphere',
    tone:'tarnished silver, void black, fractured gold light, storm grey, deep violet corruption',
    comp:'epic full-body character portrait, wings spread or partially unfurled, dramatic celestial ruin environment',
    quality:'premium dark celestial concept art quality, ultra realistic feather and fabric texture, 8K HDR',
    mk:'fallen_angel', ancient:false
  },
  holy_angel: {
    char:'character exists within a holy celestial setting',
    light:'radiant divine golden-white light from above, clean celestial glow illumination, halo glow, pure ethereal clarity',
    outfit:'divine ceremonial armor or holy celestial robes — pristine white and divine gold, majestic intact wings, sacred halo crown and accessories',
    fx:'golden divine light rays, white feathers floating gracefully, sacred halo glow, heavenly celestial atmosphere',
    tone:'pure white, divine gold, celestial sky blue, holy silver, warm heavenly light',
    comp:'epic full-body character portrait, wings spread majestically, heavenly divine setting fully visible',
    quality:'premium holy celestial concept art quality, ultra realistic divine feather and fabric, 8K HDR',
    mk:'angel_holy', ancient:false
  },
  goddess_myth: {
    char:'character exists within a mythological pantheon setting',
    light:'divine mythological lighting — Olympian marble sunlight, Nordic aurora radiance, or Egyptian solar-god light matched to the specific pantheon',
    outfit:'complete goddess divine attire — pantheon-appropriate divine robes or armor, crown or headdress, signature mythological weapons or symbolic accessories',
    fx:'divine energy aura, pantheon-specific environmental effects — Greek lightning, Norse aurora, Egyptian desert divine wind',
    tone:'palette matched to the specific mythology — Greek white-gold-marble, Norse aurora-silver-ice, Egyptian gold-lapis-sand',
    comp:'epic full-body divine portrait, goddess commanding the divine environment, majestic scale and commanding presence',
    quality:'premium mythological goddess art quality, ultra realistic divine costume and environment, 8K HDR',
    mk:'oracle_gold', ancient:false
  },
  cyberpunk_sf: {
    char:'character exists within a cyberpunk or sci-fi setting',
    light:'cyberpunk dramatic neon city lighting — electric blue and magenta rim lights, rain-reflected neon, high contrast night environment',
    outfit:'cyberpunk or sci-fi attire — tech-enhanced jacket, circuit-detail bodysuit, holographic accessories, augmented reality visor or neural implants',
    fx:'neon rain reflections, holographic glitch effects, cyberpunk city electric glow, energy particle details',
    tone:'electric blue, neon magenta, chrome silver, deep black, bright cyan and amber accent',
    comp:'premium cyberpunk editorial portrait, neon-lit urban night environment, full-body or three-quarter framing',
    quality:'ultra realistic premium cyberpunk editorial, detailed tech costume and neon environment, 8K HDR',
    mk:'cyber_idol', ancient:false
  },
  realistic_life: {
    char:'character exists within a contemporary lifestyle portrait setting',
    light:'natural authentic lighting — golden hour warmth, soft diffused daylight, ambient interior — always flattering and genuine',
    outfit:'contemporary fashion — casual luxury, bohemian, or modern lifestyle attire authentically matched to the location',
    fx:'natural environment details, soft bokeh, genuine atmospheric depth and seasonal character',
    tone:'natural true-to-life palette matched to the specific natural or urban location',
    comp:'natural editorial composition, subject integrated authentically in real-world environment',
    quality:'ultra realistic premium natural editorial portrait, authentic skin and genuine environment, 8K HDR',
    mk:'natural_clean', ancient:false
  },
  modern_lady: {
    char:'character exists within a contemporary executive or luxury urban setting',
    light:'premium architectural and interior lighting — dramatic glass-and-steel office light, designer restaurant ambient, or luxury interior illumination',
    outfit:'high fashion power dressing — sharp tailored suit, luxury designer coat, premium accessories — high-end contemporary executive styling',
    fx:'glass and steel reflections, city skyline view bokeh, premium material texture — silk, leather, gold details',
    tone:'executive power palette — charcoal, camel, ivory, deep navy, cognac leather, champagne gold',
    comp:'executive portrait composition — confident commanding pose, premium location clearly conveying status and authority',
    quality:'premium editorial executive portrait, ultra realistic fashion and architectural interior, 8K HDR',
    mk:'editorial', ancient:false
  },
  dynasty_palace: {
    char:'character exists within an imperial Chinese palace setting',
    light:'golden imperial palace interior lighting or ceremonial garden sunlight, flattering face key light, ceremonial warm glow, imperial grandeur atmosphere',
    outfit:'full imperial dynasty court attire — complete multi-layer ceremonial robes, dynasty-appropriate crown or headdress, jeweled belt with jade pendants, layered embroidered sleeves, full imperial accessories',
    fx:'gold dust particles, ceremonial fabric motion, palace lantern glow, imperial court ceremonial atmosphere',
    tone:'imperial palette — vermillion red, imperial yellow, jade green, pearl white, deep gold, lacquer black',
    comp:'premium imperial portrait, full-body or three-quarter editorial composition, complete regal costume silhouette clearly visible, clear face',
    quality:'premium dynasty imperial portrait, ultra realistic ceremonial costume and headdress texture, 8K HDR',
    mk:'imperial_empress', ancient:true
  },
  classic_lit: {
    char:'character exists within a Chinese classical literature setting',
    light:'cinematic literary atmosphere — warm candle study light, misty garden morning, moonlit pavilion, or seasonal golden light matched to the character world',
    outfit:'complete literary-era appropriate costume — dynasty-authentic dress, character-signature accessories, story-faithful styling',
    fx:'story-specific atmospheric effects, period details, emotional literary atmosphere, seasonal character',
    tone:'palette matched to the specific literary world and character emotional register',
    comp:'premium literary character portrait, clear face, costume and story setting fully readable',
    quality:'premium classical literature character portrait, ultra realistic costume and environmental detail, 8K HDR',
    mk:'gudian_hong', ancient:true
  },
  china_drama: {
    char:'character exists within a Chinese period drama setting',
    light:'drama cinematic lighting matched to the character world — palace glow, xianxia immortal realm light, wuxia natural light, or period atmosphere',
    outfit:'drama-authentic costume design — period court dress, xianxia celestial robes, or wuxia attire matched to the specific drama character',
    fx:'drama-specific atmosphere, character world environment effects, cinematic Chinese drama production quality',
    tone:'palette matched to the specific drama aesthetic — warm palace gold, cool xianxia white-blue, wuxia earth tones',
    comp:'premium drama character portrait, clear face, complete costume and drama setting readable',
    quality:'premium Chinese drama character portrait, cinematic production quality, 8K HDR',
    mk:'cinematic', ancient:true
  },
  succubus_demon: {
    char:'character exists within a dark supernatural demon-court setting',
    light:'supernatural dark illumination — infernal red or deep violet rim light, selective dark key light on face, dramatic sinister atmosphere',
    outfit:'dark supernatural elegance — seductive demon attire with dark wings motif, dark gemstone accessories, otherworldly dangerous beauty styling',
    fx:'dark supernatural energy, infernal particles, demonic realm atmosphere, sinister elegant effects',
    tone:'deep crimson, dark violet, sinister gold, obsidian black, blood red accent',
    comp:'premium supernatural character portrait, dramatic full-body or three-quarter composition, clear face, sinister environment readable',
    quality:'premium dark supernatural character concept art quality, ultra realistic dark costume detail, 8K HDR',
    mk:'succubus_alluring', ancient:false
  },
  dragon_beast: {
    char:'character exists within a dragon-bonded mythological beast setting',
    light:'dramatic elemental lighting matched to the dragon type — fire orange-red glow, ice cave blue, storm lightning, volcanic heat shimmer',
    outfit:'dragon rider armor or mythological beast-bonded costume — scaled armor accents, dragon-motif crown and jewelry, rider gear, fantasy battle styling',
    fx:'dragon breath or elemental power, ice shards or fire embers or storm lightning, environmental scale creature effects',
    tone:'palette matched to dragon type — fire orange-red, ice crystal blue, shadow black-gold, forest emerald-gold',
    comp:'epic full-body or dramatic portrait, mythological creature presence visible at environmental scale',
    quality:'premium epic fantasy art quality, ultra realistic armor and elemental creature environment, 8K HDR',
    mk:'dragon_epic', ancient:false
  },
  beast_tamer: {
    char:'character exists within a mythological beast-companion setting',
    light:'dramatic natural lighting matched to beast habitat — golden forest light, moonlit clearing, mountain mist, aurora tundra, sacred temple glow',
    outfit:'beast tamer specialty attire — leather companion gear, mythological companion robes, wildlife-tracker fashion, creature-bonded ceremonial dress',
    fx:'creature companion visible at close or medium range near subject, bond gesture or eye contact between human and beast, habitat environmental atmosphere',
    tone:'palette matched to the beast type — warm amber-gold for forest, cool blue-white for arctic, deep green for jungle, silver-moonlit for night',
    comp:'environmental portrait showing subject and beast companion together, beast clearly visible and interactive, human-animal bond as the central visual story',
    quality:'ultra realistic premium fantasy portrait, detailed creature texture and authentic companion interaction, cinematic depth, 8K HDR',
    mk:'oriental', ancient:false
  },
  taiwan_travel: {
    char:'character exists within a Taiwan travel portrait setting',
    light:'natural Taiwan location light — golden afternoon or soft overcast daylight, flattering authentic illumination',
    outfit:'stylish contemporary travel fashion or modern chic attire, coordinated accessories, Taiwan-appropriate styling',
    fx:'iconic Taiwan location atmosphere, local cultural environmental depth, authentic local character',
    tone:'palette matched to the specific Taiwan location — mountain green, ocean blue, warm evening gold, city neon',
    comp:'premium travel editorial, subject with iconic Taiwan landmark or natural scenery, full-body or three-quarter framing',
    quality:'ultra realistic premium travel portrait, detailed fashion and location texture, natural skin, coherent anatomy, 8K HDR',
    mk:'outdoor_glow', ancient:false
  },
  wedding_diamond: {
    char:'character exists within a bridal ceremony or luxury wedding setting',
    light:'romantic bridal lighting — soft golden warmth, cinematic studio radiance, or ethereal soft light matched to the venue',
    outfit:'elaborate luxury bridal gown — diamond crystal embellishment, dramatic train, bridal veil or crown, matching luxury jewelry',
    fx:'diamond sparkle light effects, bridal flower petals, soft romantic bokeh, bridal bouquet or veil motion',
    tone:'bridal palette — pure white, soft champagne, blush pink, diamond silver, gold accent, romantic ivory',
    comp:'premium bridal portrait, full-body showing complete gown, or intimate three-quarter bridal framing',
    quality:'ultra realistic premium bridal editorial, detailed gown fabric and diamond embellishment, natural skin, 8K HDR',
    mk:'wedding', ancient:false
  },
  cos_character: {
    char:'character exists within a character cosplay production setting',
    light:'character-appropriate cinematic lighting — game or anime inspired dramatic light matched to character world',
    outfit:'premium full character costume — screen-accurate design, detailed character accessories, weapon or signature prop, professional cosplay production quality',
    fx:'character-world atmosphere effects — game particle effects, anime-inspired magical atmosphere, character-signature visual elements',
    tone:'palette matched to the specific character visual identity and character world',
    comp:'premium character concept art style portrait, full-body or dramatic three-quarter, complete character costume and accessories visible',
    quality:'premium cosplay editorial portrait, ultra realistic character costume and signature prop detail, cinematic character concept quality, 8K HDR',
    mk:'character_pop', ancient:false
  },
  mountain_sea: {
    char:'character exists within a mountain or ocean adventure setting',
    light:'dramatic natural landscape light — golden hour against mountains or ocean, wide sky illumination, epic natural light scale',
    outfit:'premium outdoor fashion or adventure styling — fitted jacket, coordinated travel attire, natural fiber styling appropriate for high altitude or coastal setting',
    fx:'vast natural scale atmospheric effects — mountain mist, ocean spray, cloud movement, wide sky dynamics, epic environmental scale',
    tone:'majestic natural palette — mountain grey-white-blue, ocean turquoise-navy, golden sunset, forest green, snow white',
    comp:'epic environmental portrait — subject as element within vast natural panorama, wide landscape framing, human scale contrasted against grand natural scene',
    quality:'ultra realistic premium outdoor editorial, detailed natural environment and sky texture, natural skin, coherent anatomy, 8K HDR epic landscape',
    mk:'outdoor_glow', ancient:false
  },
};

// ═══════════════════════════════════════════
// 風格範例庫（從 核心資料/風格範例.md 提取）
// ═══════════════════════════════════════════

function getCat(id){ return CATS.find(c=>c.id===id); }
function getEntry(catID, entryID){
  const cat = getCat(catID);
  return cat ? cat.entries.find(e=>e.id===entryID)||cat.entries[0] : null;
}
function getField(entry, tpl, field){
  return entry[field] || tpl[field] || '';
}

// ═══════════════════════════════════════════
// Render
// ═══════════════════════════════════════════
function renderRatio(){
  document.getElementById('ratioChips').innerHTML = RATIO.map(r=>`
    <div class="chip${r.id===curRatioID?' active':''}" onclick="selRatio('${r.id}')">${r.name}</div>`).join('');
}
function renderLens(){
  document.getElementById('lensChips').innerHTML = LENS.map(l=>`
    <div class="chip${l.id===curLensID?' active':''}" onclick="selLens('${l.id}')">${l.name}</div>`).join('');
}
const CAUTION_LIGHTS = [];
const CAUTION_ATM    = [];
function renderLight(){
  document.getElementById('lightChips').innerHTML = LIGHT_STYLE.map(l=>{
    const caution = CAUTION_LIGHTS.includes(l.id);
    return `<div class="chip${l.id===curLightID?' active':''}${caution?' caution':''}" onclick="selLight('${l.id}')" title="${caution?'謹慎使用：容易增加大頭視覺或假人感':''}">${l.name}${caution?' ⚠':''}</div>`;
  }).join('');
}
function renderAtm(){
  document.getElementById('atmChips').innerHTML = ATM.map(a=>{
    const caution = CAUTION_ATM.includes(a.id);
    return `<div class="chip${a.id===curAtmID?' active':''}${caution?' caution':''}" onclick="selAtm('${a.id}')" title="${caution?'謹慎使用：容易讓身體消失、頭部主體化':''}">${a.name}${caution?' ⚠':''}</div>`;
  }).join('');
}
function renderIdentity(){
  document.getElementById('identityChips').innerHTML = IDENTITY_LOCK.map(i=>`
    <div class="chip${i.id===curIdentityID?' active':''}" onclick="selIdentity('${i.id}')">${i.name}</div>`).join('');
}
function renderCamLang(){
  document.getElementById('camLangChips').innerHTML = CAMERA_LANG.map(c=>`
    <div class="chip${c.id===curCamLangID?' active':''}" onclick="selCamLang('${c.id}')">${c.name}</div>`).join('');
}

function getDisplayIcon(icon, fallback='✦'){
  const value = String(icon || '').trim();
  if(!value) return fallback;
  if(/^[A-Z]{2,3}$/.test(value)) return fallback;
  if(value === '🇹🇼') return '🧋';
  if(value === '🇯🇵') return '🗾';
  if(value === '🇰🇷') return '🌸';
  if(value === '🇨🇳') return '🏮';
  if(value === '🇫🇷') return '🗼';
  if(value === '🇬🇧') return '🕰️';
  if(value === '🇺🇸') return '🌉';
  if(value === '🇮🇳') return '🕌';
  if(value === '🇹🇭') return '🛕';
  return value;
}

function renderCatStrip(){
  const el = document.getElementById('catStrip');
  const countMeta = document.getElementById('catCountMeta');
  if(countMeta) countMeta.textContent = `${CATS.length} 類`;
  el.innerHTML = CATS.map(c=>`
    <div class="cat-pill${c.id===curCatID?' active':''}" onclick="selCat('${c.id}')">
      <span class="cat-pill-icon">${getDisplayIcon(c.icon,'✦')}</span>
      <span class="cat-pill-name">${c.name}</span>
      <span class="cat-pill-count">${c.entries.length}</span>
    </div>`).join('');
}

function renderPresets(){
  const cat = getCat(curCatID);
  if(!cat) return;
  const countMeta = document.getElementById('presetCountMeta');
  if(countMeta) countMeta.textContent = `${cat.entries.length} 筆`;
  document.getElementById('presetGrid').innerHTML = cat.entries.map(e=>`
    <div class="preset-card${e.id===curEntryID?' active':''}" onclick="selEntry('${e.id}')">
      <span class="preset-icon">${getDisplayIcon(e.icon, getDisplayIcon(cat.icon,'✦'))}</span>
      <span class="preset-name">${e.name}</span>
      <span class="preset-sub">${e.sub||''}</span>
    </div>`).join('');
}

function renderMK(){
  document.getElementById('mkChips').innerHTML = MK.map(m=>`
    <div class="chip${m.id===curMKID?' active':''}" onclick="selMK('${m.id}')">${m.name}</div>`).join('');
}

function renderAng(){
  document.getElementById('angChips').innerHTML = ANG.map(a=>`
    <div class="chip${a.id===curAngID?' active':''}" onclick="selAng('${a.id}')">
      <span>${a.name}</span>
      <span class="chip-sub">${a.zh}</span>
    </div>`).join('');
}

function renderBadge(){
  const cat = getCat(curCatID);
  const entry = getEntry(curCatID, curEntryID);
  const mk = MK.find(m=>m.id===curMKID);
  const ang = ANG.find(a=>a.id===curAngID);
  if(!cat||!entry) return;
  const sec = document.getElementById('selBadgeSec');
  const badge = document.getElementById('selBadge');
  sec.style.display='';
  const ratio = RATIO.find(r=>r.id===curRatioID);
  const lens = LENS.find(l=>l.id===sanitizeLensId(curLensID)) || LENS[0];
  const light = LIGHT_STYLE.find(l=>l.id===sanitizeLightId(curLightID)) || LIGHT_STYLE[0];
  const identity = IDENTITY_LOCK.find(i=>i.id===curIdentityID);
  badge.innerHTML=`
    <span class="badge-item">${getDisplayIcon(cat.icon,'✦')} ${cat.name}</span>
    <span class="badge-sep">›</span>
    <span class="badge-item">${getDisplayIcon(entry.icon, getDisplayIcon(cat.icon,'✦'))} ${entry.name}</span>
    <span class="badge-sep">›</span>
    <span class="badge-item">💄 ${mk?mk.name:''}</span>
    <span class="badge-sep">›</span>
    <span class="badge-item">📷 ${ang?ang.name:''}</span>
    <span class="badge-sep">›</span>
    <span class="badge-item">📐 ${ratio?ratio.name:''}</span>
    <span class="badge-sep">›</span>
    <span class="badge-item">🔭 ${lens?lens.name:''}</span>
    <span class="badge-sep">›</span>
    <span class="badge-item">💡 ${light?light.name:''}</span>
    <span class="badge-sep">›</span>
    <span class="badge-item">🔒 ${identity?identity.name:''}</span>`;
}

function renderAll(){
  renderCatStrip();
  renderPresets();
  renderMK();
  renderAng();
  renderRatio();
  renderLens();
  renderLight();
  renderAtm();
  renderIdentity();
  renderCamLang();
  renderBadge();
}

// ═══════════════════════════════════════════
// Selection handlers
// ═══════════════════════════════════════════
function applyDefs(entryOrNull, tplKey){
  const e = entryOrNull||{};
  const effectiveTplKey = e.tpl || tplKey;
  const defs = TPL_DEFAULTS[effectiveTplKey]||{};
  if(e.ang    || defs.ang)     curAngID    = sanitizeSelectionId(e.ang || defs.ang, ANTI_PATTERNS.bannedAngleIds, 'sanfen');
  if(e.ratio  || defs.ratio)   curRatioID  = e.ratio  || defs.ratio;
  if(e.lens   || defs.lens)    curLensID   = sanitizeLensId(e.lens || defs.lens);
  if(e.light  || defs.light)   curLightID  = sanitizeLightId(e.light || defs.light);
  if(e.atm    || defs.atm)     curAtmID    = sanitizeAtmId(e.atm || defs.atm);
  if(e.mk     || defs.mk)      curMKID     = e.mk     || defs.mk;
  if(e.camLang|| defs.camLang) curCamLangID= sanitizeSelectionId(e.camLang || defs.camLang, ANTI_PATTERNS.bannedCameraLanguageIds, 'cl_fashion');
}

function selCat(catID){
  curCatID = catID;
  const cat = getCat(catID);
  if(cat){
    curEntryID = cat.entries[0].id;
    const tplKey = cat.entries[0].tpl || cat.tpl;
    const tpl = TPLS[tplKey]||TPLS.xianxia;
    if(tpl.mk) curMKID = tpl.mk;
    applyDefs(cat.entries[0], tplKey);
  }
  renderAll();
  const pill = document.querySelector('.cat-pill.active');
  if(pill) pill.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
}

function selEntry(entryID){
  const cat = getCat(curCatID);
  if(!cat) return;
  const entry = cat.entries.find(e=>e.id===entryID);
  if(!entry) return;
  curEntryID = entryID;
  if(entry.mk) curMKID = entry.mk;
  applyDefs(entry, entry.tpl || cat.tpl);
  document.querySelectorAll('.preset-card').forEach(c=>c.classList.remove('active'));
  document.querySelector(`.preset-card[onclick="selEntry('${entryID}')"]`)?.classList.add('active');
  renderMK(); renderAng(); renderRatio(); renderLens(); renderLight(); renderAtm(); renderCamLang(); renderBadge();
}

function selMK(id){
  curMKID = id;
  document.querySelectorAll('#mkChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#mkChips .chip[onclick="selMK('${id}')"]`)?.classList.add('active');
  renderBadge();
}

function selAng(id){
  curAngID = sanitizeSelectionId(id, ANTI_PATTERNS.bannedAngleIds, 'sanfen');
  document.querySelectorAll('#angChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#angChips .chip[onclick="selAng('${curAngID}')"]`)?.classList.add('active');
  renderBadge();
}

function selRatio(id){
  curRatioID = id;
  document.querySelectorAll('#ratioChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#ratioChips .chip[onclick="selRatio('${id}')"]`)?.classList.add('active');
  renderBadge();
}
function selLens(id){
  curLensID = sanitizeLensId(id);
  document.querySelectorAll('#lensChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#lensChips .chip[onclick="selLens('${curLensID}')"]`)?.classList.add('active');
  renderBadge();
}
function selLight(id){
  curLightID = sanitizeLightId(id);
  document.querySelectorAll('#lightChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#lightChips .chip[onclick="selLight('${curLightID}')"]`)?.classList.add('active');
  renderBadge();
}
function selAtm(id){
  curAtmID = sanitizeAtmId(id);
  document.querySelectorAll('#atmChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#atmChips .chip[onclick="selAtm('${curAtmID}')"]`)?.classList.add('active');
  renderBadge();
}
function selIdentity(id){
  curIdentityID = id;
  document.querySelectorAll('#identityChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#identityChips .chip[onclick="selIdentity('${id}')"]`)?.classList.add('active');
  renderBadge();
}
function selCamLang(id){
  curCamLangID = sanitizeSelectionId(id, ANTI_PATTERNS.bannedCameraLanguageIds, 'cl_fashion');
  document.querySelectorAll('#camLangChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#camLangChips .chip[onclick="selCamLang('${curCamLangID}')"]`)?.classList.add('active');
  renderBadge();
}

// ═══════════════════════════════════════════
// Random
// ═══════════════════════════════════════════
function doRandom(suppressScroll){
  const catIdx = Math.floor(Math.random()*CATS.length);
  const cat = CATS[catIdx];
  const entryIdx = Math.floor(Math.random()*cat.entries.length);
  const entry = cat.entries[entryIdx];
  curCatID = cat.id;
  curEntryID = entry.id;
  const tplKey = entry.tpl || cat.tpl;
  const tpl = TPLS[tplKey]||TPLS.xianxia;
  curMKID = entry.mk || tpl.mk || 'xianxia';
  applyDefs(entry, tplKey);
  renderAll();
  generate(true);
  if(!suppressScroll) setTimeout(()=>{ document.getElementById('outputShell').scrollIntoView({behavior:'smooth', block:'start'}); }, 80);
  return {cat, entry};
}

function doRandomAndCopy(){
  const {cat, entry} = doRandom(true);
  const lbl = document.getElementById('randLabel');
  if(lbl){
    lbl.textContent = cat.name + '　·　' + entry.name + (entry.sub ? '　—　' + entry.sub : '');
    lbl.style.display = 'block';
  }
  setTimeout(()=>{ doCopy(); }, 180);
}

// ═══════════════════════════════════════════
// Pro Panel
// ═══════════════════════════════════════════
function togglePro(){
  document.getElementById('proToggle').classList.toggle('open');
  document.getElementById('proBody').classList.toggle('open');
}

// ═══════════════════════════════════════════
// Prompt Builder
// ═══════════════════════════════════════════
function buildPrompt(){
  const cat = getCat(curCatID);
  const entry = getEntry(curCatID, curEntryID);
  const mk = MK.find(m=>m.id===curMKID)||MK[0];
  const safeAngID = sanitizeSelectionId(curAngID, ANTI_PATTERNS.bannedAngleIds, 'sanfen');
  const ang = ANG.find(a=>a.id===safeAngID)||ANG[0];
  if(!cat||!entry) return '';
  const tplKey = entry.tpl || cat.tpl;
  const tpl = TPLS[tplKey]||TPLS.xianxia;

  const f = (field) => entry[field] || tpl[field] || '';

  const faceDesc  = document.getElementById('faceDesc').value.trim();
  const proShot   = document.getElementById('proShot').value;
  const proAction = document.getElementById('proAction').value;
  const proCustom = document.getElementById('proCustom').value.trim();
  const txtLine   = document.getElementById('txtLine').value.trim();
  const extras    = document.getElementById('extras').value.trim();

  const ratio    = RATIO.find(r=>r.id===curRatioID)||RATIO[0];
  const lens     = LENS.find(l=>l.id===sanitizeLensId(curLensID))||LENS[0];
  const lightSt  = LIGHT_STYLE.find(l=>l.id===sanitizeLightId(curLightID))||LIGHT_STYLE[0];
  const atm      = ATM.find(a=>a.id===sanitizeAtmId(curAtmID))||ATM[0];
  const identity = IDENTITY_LOCK.find(i=>i.id===curIdentityID)||IDENTITY_LOCK[0];
  const safeCamLangID = sanitizeSelectionId(curCamLangID, ANTI_PATTERNS.bannedCameraLanguageIds, 'cl_fashion');
  const camLang  = CAMERA_LANG.find(c=>c.id===safeCamLangID)||CAMERA_LANG[0];
  const posePack = getCategoryPosePack(cat);

  // Build scene description
  let sceneDesc = sanitizeCreativeField(f('scene'));
  if(!sceneDesc && tpl.scene_prefix){
    sceneDesc = sanitizeCreativeField(`${tpl.scene_prefix}; ${entry.sub || entry.name}`);
  }

  // Build pro block
  const proParts = [];
  if(proShot)   proParts.push(`Camera framing priority: ${sanitizeCreativeField(proShot)}.`);
  if(proAction) proParts.push(`Action priority: ${sanitizeCreativeField(proAction)}.`);
  proParts.push(buildPoseGuidance({ cat, entry, camLang, proAction }));
  proParts.push(`Action safety: face must remain fully visible — if any action would obscure the face, modify to keep face open and clearly lit.`);
  proParts.push(`Costume completeness: full costume must be visible — no cropped hems, no missing sleeves, no cut-off accessories.`);
  if(proCustom) proParts.push(sanitizeCreativeField(proCustom));

  const sanitizedLight = sanitizeCreativeField(f('light'));
  const sanitizedChar = sanitizeCreativeField(f('char'));
  const sanitizedOutfit = sanitizeCreativeField(f('outfit'));
  const sanitizedProp = sanitizeCreativeField(f('prop'));
  const sanitizedComp = sanitizeCreativeField(f('comp'));
  const sanitizedFx = sanitizeCreativeField(f('fx'));
  const sanitizedTone = sanitizeCreativeField(f('tone'));
  const sanitizedQuality = sanitizeCreativeField(f('quality'));
  const sanitizedTxtLine = sanitizeCreativeField(txtLine);
  const sanitizedExtras = sanitizeCreativeField(extras);
  const sanitizedCamLang = sanitizeCreativeField(camLang.desc);
  const sanitizedAngleDesc = sanitizeCreativeField(ang.desc);
  const sanitizedLensGuidance = sanitizeCreativeField(buildLensGuidance(cat, lens));
  const fallbackProp = !sanitizedProp && posePack ? sanitizeCreativeField(pickRandom(posePack.prop)) : '';
  const fallbackComp = !sanitizedComp && posePack ? sanitizeCreativeField(pickRandom(posePack.comp)) : '';

  const parts = [
    CORE_GATE,
    buildFaceAnchor(faceDesc),
    `Avoid: ${AVOID_LOCK}.`,
    CORE_IDENTITY,
    identity.boost || '',
    CORE_SAFETY,
    CORE_ELASTICITY,
    proParts.join(' '),
    sanitizedLensGuidance ? `Lens selection guidance: ${sanitizedLensGuidance}.` : '',
    buildAntiPatternGuidance(),
    sanitizeCreativeField(`[${cat.name} — ${entry.name}${entry.sub?' · '+entry.sub:''}]`),
    sceneDesc ? `Scene: ${sceneDesc}.` : '',
    [sanitizedLight ? `Lighting: ${sanitizedLight}.` : '', sanitizedChar ? `Character context: ${sanitizedChar}.` : ''].filter(Boolean).join(' '),
    `Makeup: ${mk.desc}.`,
    tpl.ancient ? ANCIENT_BOOST : '',
    sanitizedOutfit ? `Costume: ${sanitizedOutfit}.` : '',
    sanitizedProp ? `Action and props: ${sanitizedProp}.` : (fallbackProp ? `Action: ${fallbackProp}.` : ''),
    sanitizedComp ? `Composition: ${sanitizedComp}. Angle: ${sanitizedAngleDesc}.` : (fallbackComp ? `Composition: ${fallbackComp}. Angle: ${sanitizedAngleDesc}.` : `Angle: ${sanitizedAngleDesc}.`),
    sanitizedFx ? `Effects: ${sanitizedFx}.` : '',
    sanitizedTone ? `Tone: ${sanitizedTone}.` : '',
    sanitizedQuality ? `${sanitizedQuality}.` : QUALITY_BASE,
    sanitizedTxtLine ? `Typography: ${sanitizedTxtLine}.` : '',
    sanitizedExtras ? `Note: ${sanitizedExtras}.` : '',
    `Format: ${ratio.desc} | Lens: ${lens.desc} | Light: ${lightSt.desc} | Atmosphere: ${atm.desc} | Camera: ${sanitizedCamLang}`,
    CORE_STRUCTURE,
  ].filter(l=>l&&l.trim().length>0);

  return parts.join('\n\n');
}

function generate(suppressScroll){
  const txt = buildPrompt();
  if(!txt) return;
  const out = document.getElementById('out');
  const shell = document.getElementById('outputShell');
  out.textContent = txt;
  shell.classList.add('has-content');
  document.getElementById('charCount').textContent = `${txt.length.toLocaleString()} 字元`;
  document.getElementById('outActions').style.display = 'flex';
  if(!suppressScroll) setTimeout(()=>{document.getElementById('copyBtn').scrollIntoView({behavior:'smooth',block:'center'});}, 80);
}

function generateAndCopy(){
  generate();
  setTimeout(()=>{ doCopy(); }, 80);
}

function doCopy(){
  const txt = document.getElementById('out').textContent;
  if(!txt||txt.includes('選好風格')) return;
  navigator.clipboard.writeText(txt).then(()=>{
    const btn = document.getElementById('copyBtn');
    if(!btn) return;
    btn.textContent = '✅ 已複製！';
    btn.classList.add('done');
    setTimeout(()=>{btn.textContent='📋 複製咒語';btn.classList.remove('done');},2000);
  });
}

function doClear(){
  const out = document.getElementById('out');
  out.innerHTML = '<span class="output-ph">選好風格和場景後，點「產出咒語 + 複製咒語」即可獲得完整英文 prompt。</span>';
  document.getElementById('outputShell').classList.remove('has-content');
  document.getElementById('charCount').textContent = '';
  document.getElementById('outActions').style.display = 'none';
  window.scrollTo({top:0, behavior:'smooth'});
}

// Init — apply defaults for initial category
(function(){
  const cat = getCat(curCatID);
  if(cat) applyDefs(cat.entries[0], cat.entries[0].tpl || cat.tpl);
})();
renderAll();


