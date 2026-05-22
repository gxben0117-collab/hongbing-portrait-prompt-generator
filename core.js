// ═══════════════════════════════════════════
// 核心咒語規範 v1.2 (2026-05-21)
// 來源文件：核心資料/核心咒語規範.md — 此為專案規範，任何修改請先更新 .md 文件
// ═══════════════════════════════════════════
const CORE_GATE = `MANDATORY FIRST STEP: Check the current ChatGPT message / conversation for an uploaded reference photo of the person. If no reference photo is attached or visible, STOP and ask the user to upload the person's photo first. Do not generate an image, do not invent a face, and do not proceed from text alone.`;
const CORE_IDENTITY = `IDENTITY & EXPRESSION PRESERVATION (CRITICAL): Use the uploaded photo as the only identity reference. Preserve exact facial geometry, facial proportions, eye shape, nose structure, mouth structure, skin identity, natural expression behavior, emotional characteristics, and recognizable likeness. Keep the same person recognizable across hairstyle, styling, makeup, costume, lighting, emotional, environmental, and photographic variations. Preserve the uploaded person's natural eye emotion, mouth tension, smile structure, expression behavior, and emotional characteristics while allowing scene-appropriate emotional variation. Apply makeup as surface cosmetics only — makeup may affect color, texture, lighting polish, and stylistic mood, but must never reshape identity or alter the person's natural facial structure.`;
const CORE_ELASTICITY = `IDENTITY ELASTICITY (REALISM SUPPORT): Allow natural hairstyle variation, hair movement, cinematic framing, realistic environmental interaction, candid energy, emotional variation, and realistic photographic imperfection. Realistic human variation is encouraged — the subject should feel alive, naturally photographed, and contextually integrated into each scene rather than frozen into a static presentation template. Natural cinematic imperfection is allowed, including realistic wind movement, partial framing, soft environmental obstruction, dynamic posing, candid behavior, and realistic photographic asymmetry.`;
const CORE_ANTI_AI = `PROMPT GENERATION RESTRAINTS (ANTI-AI ARTIFACTS): Avoid identity drift, influencer-template faces, plastic skin, distorted anatomy, excessive beauty filtering, mannequin-like posing, artificial symmetry, frozen expressions, repetitive framing, and generic AI beauty aesthetics. Maintain realistic anatomy, believable posing, authentic emotional presence, realistic lighting response, natural skin texture, realistic depth, and photographic realism. Preserve realistic human texture and believable photographic imperfections rather than overprocessed AI beauty rendering.`;
const CORE_ANATOMY = `ANATOMY & VISUAL FRAME: Maintain realistic adult anatomy with coherent joints, correct finger count, natural limb proportions, believable body balance, and physically plausible pose flow. Important facial identity features should remain readable and recognizable. Natural hair movement, cinematic shadowing, environmental interaction, partial framing, and realistic scene obstruction are allowed as long as the uploaded person remains recognizable. Role, beauty, luxury, bridal, celebrity, goddess, editorial, model, fantasy, or cinematic keywords describe styling, costume, lighting, mood, and artistic direction only — they must never replace the uploaded person's identity or recognizable appearance.`;
const CORE_STRUCTURE = `PROMPT STRUCTURING & STYLE: Compose prompts in the following flow: environment → lighting → subject → outfit → action → camera → finish. Prioritize realistic camera behavior, cinematic environmental depth, believable body alignment, authentic emotional presence, and natural subject integration within the scene. Support a wide range of realistic photographic aesthetics including cinematic, editorial, candid, documentary, fashion, lifestyle, travel, luxury, film photography, natural light photography, and spontaneous realistic photography styles.`;
const CORE_REALISM = `VISUAL REALISM PRIORITY: The final image should feel like a believable real photograph of the uploaded person captured in a natural moment rather than a synthetic AI-generated beauty render. Avoid overly rigid symmetry, mannequin-like posing, excessive glamour filtering, artificial skin smoothing, or repetitive static composition.`;
const CORE_BEAUTY_SAFETY = `[CRITICAL BEAUTY SAFETY RULE] The styling keywords (such as fantasy, editorial, luxury, historical, goddess) describe environment, costume, and artistic direction ONLY. Beauty-related styling must NEVER idealize, refine, beautify, perfect, or reconstruct the uploaded person's facial structure, proportions, eye shapes, or recognizable identity. Preserve authentic facial uniqueness, natural asymmetry, realistic skin micro-relief, visible pores, and original facial characteristics. The subject must look like a real, naturally photographed person under the scene's lighting, not a synthetic AI render or smoothed influencer template.`;
const ANCIENT_BOOST = `Ancient Chinese costume photoshoot styling (professional cinematic level while preserving uploaded person's exact identity): hair must be styled in traditional Chinese fashion with elaborate updos or cascading pinned sections. Hair accessories are mandatory and abundant: hairpins, step-shake ornaments, jade combs, floral hair clusters, tasseled ornaments, hair crowns, phoenix accessories, bead strands throughout the hair. Costume layering is required: inner robe, outer robe, wide flowing sleeves, decorative sash, embroidered waist ornament with jade pendants, and era-appropriate accessories. Hand props as contextually appropriate: folding fan, silk ribbons, ancient lamp, flower branch, jade flute, or sword hilt. The environment must match the era: ancient Chinese architecture with carved pillars and tile roofs, classical gardens, misty mountain temples, bamboo groves, or mythological celestial settings.`;
const AVOID_LOCK = `identity drift, replaced face, different person, beauty-filter appearance, plastic skin, over-smoothed skin, generic influencer face, AI beauty template, V-shaped face, doll face, altered facial proportions, idealized bone structure, perfect face, refined features, flawless skin, luminous skin overlay, celestial radiance effect, editorial perfection filter, ultra glamorous face treatment, luxury beauty enhancement, cat-eye liner reshaping, heavy eyeliner distortion, intense dramatic smoky eye restructuring, dangerous beauty filter, mannequin-like posing, artificial symmetry, frozen expressions, anatomy distortion, deformed hands, fused fingers, extra fingers, disconnected arms, floating limbs, excessive glamour filtering, repetitive static composition, low quality, watermark, anachronistic modern elements`;
const QUALITY_BASE = `cinematic epic quality, dramatic film lighting, detailed costume fabric and environmental texture, high dynamic range, photorealistic rendering, period-authentic atmosphere, no AI look, 8K HDR`;

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
const LENS = [
  {id:'l_85',  name:'85mm 人像',  desc:'Simulated 85mm portrait lens: natural face compression, beautiful background bokeh, flattering facial proportions — ideal for close-up and half-body portraits.'},
  {id:'l_50',  name:'50mm 標準',  desc:'Simulated 50mm standard lens: natural human-eye perspective, minimal distortion — versatile for both portrait and environmental shots.'},
  {id:'l_35',  name:'35mm 環境',  desc:'Simulated 35mm environmental lens: slightly wider view showing subject in context, natural documentary feel, environmental storytelling.'},
  {id:'l_135', name:'135mm 長焦', desc:'Simulated 135mm telephoto lens: strong background compression, subject isolated from environment, dramatic depth separation, premium editorial compression.'},
  {id:'l_28',  name:'28mm 超廣角',desc:'Simulated 28mm ultra-wide lens: dramatic wide-angle perspective, expansive environmental context, epic scale, dynamic depth.'},
];
const LIGHT_STYLE = [
  {id:'ls_golden',   name:'黃金時刻', desc:'Golden hour editorial lighting: warm amber and orange sunlight at low angle, long soft shadows, glowing skin tones, romantic warmth.'},
  {id:'ls_natural',  name:'自然日光', desc:'Natural daylight lighting: soft overcast or window light, even illumination, true-to-life color rendering, clean editorial look.'},
  {id:'ls_cinematic',name:'電影感光', desc:'Cinematic lighting: dramatic contrast with motivated key light, colored rim light, deep shadows, filmic quality reminiscent of premium cinema.'},
  {id:'ls_studio',   name:'棚拍燈光', desc:'Studio editorial lighting: controlled three-point lighting setup, clean precise illumination, commercial-grade fashion shoot quality.'},
  {id:'ls_lowkey',   name:'低調暗光', desc:'Low-key dramatic lighting: predominantly dark with selective beam of light on subject, noir or mysterious atmosphere, strong shadow play.'},
  {id:'ls_backlit',  name:'逆光輪廓', desc:'Backlit silhouette lighting: strong backlight creating glowing rim around subject, hair and fabric lit from behind, ethereal halo effect.'},
];
const ATM = [
  {id:'at_clear',    name:'晴空清透', desc:'Clear atmospheric visibility: crisp clean air, vivid colors, strong defined details, high-clarity visual rendering.'},
  {id:'at_misty',    name:'煙霧朦朧', desc:'Misty atmosphere: soft haze and mist layers, diffused depth, romantic atmospheric perspective, gentle obscuring of background.'},
  {id:'at_moody',    name:'電影憂鬱', desc:'Cinematic moody atmosphere: desaturated with selective color accent, heavy atmospheric haze, brooding emotional weight, art-house quality.'},
  {id:'at_dark',     name:'暗黑戲劇', desc:'Dark dramatic atmosphere: deep shadow environment, intense contrast, sinister or powerful emotional charge, dark epic visual language.'},
  {id:'at_warm',     name:'暖光環繞', desc:'Warm glow atmosphere: enveloping warm light tones, golden and amber color environment, intimate cozy or romantic warmth.'},
  {id:'at_ethereal', name:'仙氣縹緲', desc:'Ethereal atmosphere: otherworldly magical mist and glow, celestial light quality, dreamlike unreality, transcendent visual feeling.'},
];
const IDENTITY_LOCK = [
  {id:'il_standard', name:'標準保護', boost:''},
  {id:'il_enhanced', name:'強化鎖定', boost:'ENHANCED IDENTITY LOCK: Preserve exact facial bone structure — eye socket depth, nose bridge width, cheekbone position, jaw angle — these must match the reference photo precisely. No softening of distinct features allowed.'},
  {id:'il_maximum',  name:'最強鎖定', boost:'MAXIMUM IDENTITY LOCK (CRITICAL OVERRIDE): The uploaded person\'s face is the absolute ground truth. Every facial feature — eye shape, eye spacing, nose geometry, lip shape, chin profile, jaw line, cheekbone structure — must be reproduced with zero deviation from the reference photo. Any AI tendency toward beauty standardization, face symmetrization, skin smoothing, or feature idealization must be completely suppressed. The person must be immediately recognizable as the same individual from the reference photo.'},
];
const CAMERA_LANG = [
  {id:'cl_fashion',  name:'時尚大片', desc:'Fashion editorial camera language: precise controlled composition with deliberate pose and gaze, high-end magazine visual grammar, luxury fashion photography aesthetic.'},
  {id:'cl_travel',   name:'旅遊紀實', desc:'Travel documentary camera language: natural candid energy, subject integrated authentically in location, editorial travel photography feel, story-driven environmental composition.'},
  {id:'cl_movie',    name:'電影預告', desc:'Movie trailer camera language: dramatic hero framing, cinematic depth and tension, subject posed with narrative power, blockbuster visual language.'},
  {id:'cl_magazine', name:'雜誌封面', desc:'Magazine cover camera language: clean bold composition optimized for cover placement, subject large in frame, strong eye contact, graphic clarity.'},
  {id:'cl_social',   name:'社群美圖', desc:'Social media optimized camera language: visually appealing clean composition, strong subject presence, shareable aesthetic quality, modern lifestyle visual.'},
];

const SAFE_POSE_VARIANTS = [
  'Use a varied but identity-safe pose: front-facing head with a three-quarter body angle, subtle shoulder turn, and natural arm placement that keeps the face open and recognizable.',
  'Prefer a non-static editorial pose such as a gentle seated angle, a slow step forward, or a calm turn-back glance, while keeping the face clearly directed toward camera.',
  'Encourage graceful movement in sleeves, cape, skirt, or hair so the image feels alive, but keep the neck, jawline, and torso alignment physically natural and photo-realistic.',
  'Hands, props, and gestures should stay below eye level or clearly away from the central face area unless the face remains fully readable without distortion.',
];

const SAFE_POSE_BY_CAMERA_LANG = {
  cl_fashion: [
    'Fashion pose guidance: avoid flat standing symmetry; prefer one hip relaxed, shoulders softly offset, and an elegant hand pose that enhances silhouette without hiding the face.',
    'Fashion pose guidance: use editorial asymmetry such as seated side-angle, leaning lightly against architecture, or one-step motion with direct facial visibility.',
  ],
  cl_travel: [
    'Travel pose guidance: prefer walking, turning, looking over the shoulder, lightly touching a railing, veil, suitcase, or landscape element to create natural location interaction.',
    'Travel pose guidance: the body can be in motion, but the head should remain mostly front-facing or three-quarter-facing so likeness stays stable.',
  ],
  cl_movie: [
    'Cinematic pose guidance: prefer narrative hero poses such as drawing a sword, holding a prop low, stepping forward, seated on a throne, or turning mid-command while keeping facial features unobstructed.',
    'Cinematic pose guidance: allow stronger gesture and costume flow, but avoid extreme twisting, sprinting, jumping, or any action that breaks facial-to-body coherence.',
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
      'vertical three-quarter to full-body wedding composition, face large enough to preserve identity, skirt and train clearly visible, elegant depth behind the subject',
    ],
  },
  hanfu: {
    prop: [
      'Choose an action that matches the character identity and historical atmosphere: listening to music, reading a letter, carrying a lantern, holding a fan, touching a sleeve, drawing near a railing, offering tea, walking through a corridor, or resting a hand near a sword hilt if the role is martial',
      'The subject should feel like a person living inside the classical scene rather than a generic costume model: court lady waiting, scholar beauty pausing, traveler crossing a pavilion, noblewoman turning after hearing footsteps, or warrior heroine preparing to move',
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
      'vertical queenly composition with subtle low angle or central axis, strong facial clarity, costume and power symbols fully legible without overcomplicated action',
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
  fallen_angel: 'queen',
  holy_angel: 'queen',
  goddess_myth: 'queen',
  myth: 'queen',
};

function pickRandom(list){
  if(!Array.isArray(list) || list.length === 0) return '';
  return list[Math.floor(Math.random() * list.length)];
}

function getCategoryPosePack(cat){
  const group = CATEGORY_POSE_MAP[cat.id] || CATEGORY_POSE_MAP[cat.tpl] || null;
  return group ? CATEGORY_POSE_LIBRARY[group] : null;
}

function buildPoseGuidance({cat, entry, camLang, proAction}){
  const guidance = [];
  const posePack = getCategoryPosePack(cat);
  if(proAction){
    guidance.push('Honor the selected action, but refine it if needed so the final pose remains natural, front-face-friendly, and identity-safe.');
  } else {
    guidance.push(pickRandom(SAFE_POSE_VARIANTS));
    guidance.push(pickRandom(SAFE_POSE_BY_CAMERA_LANG[camLang.id] || []));
    if(posePack){
      guidance.push(`Category pose guidance: ${pickRandom(posePack.prop)}`);
      guidance.push(`Category composition guidance: ${pickRandom(posePack.comp)}`);
    }
  }

  if(!entry.prop){
    guidance.push('Do not default to a plain symmetrical standing pose or shallow hand-raising gesture. Instead, infer an action from the subject role, social identity, emotional state, and scene atmosphere, then choose a believable behavior that fits that moment.');
  }

  guidance.push('Action selection rule: determine what this person would naturally be doing in this exact moment, based on role, setting, costume, status, atmosphere, and story logic. The pose should emerge from character behavior, not from random gesture variation.');
  guidance.push('Pose realism rule: prioritize front-facing or three-quarter facial visibility, natural spine alignment, and believable weight distribution. Avoid extreme overhead arm poses, extreme back-bends, full back-facing poses, aggressive foreshortening, or complex choreography that could desynchronize face and body.');
  guidance.push('Reference-photo compatibility rule: because many uploaded photos are front-facing, adapt every pose so the face can stay stable, readable, and naturally connected to the body.');
  return guidance.filter(Boolean).join(' ');
}

// ═══════════════════════════════════════════
// 場景智慧預設值（選分類/場景時自動套用）
// ═══════════════════════════════════════════
const TPL_DEFAULTS = {
  xianxia:       {ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_golden',    atm:'at_ethereal', camLang:'cl_fashion'},
  hanfu:         {ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_fashion'},
  oriental:      {ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_fashion'},
  gothic:        {ang:'sanfen',   ratio:'r_23',  lens:'l_85',  light:'ls_lowkey',    atm:'at_dark',     camLang:'cl_fashion'},
  myth:          {ang:'yang',     ratio:'r_23',  lens:'l_85',  light:'ls_golden',    atm:'at_ethereal', camLang:'cl_movie'},
  fantasy:       {ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_backlit',   atm:'at_ethereal', camLang:'cl_fashion'},
  water:         {ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_backlit',   atm:'at_ethereal', camLang:'cl_fashion'},
  reference_styles:{ang:'sanfen', ratio:'r_916', lens:'l_35',  light:'ls_cinematic', atm:'at_ethereal', camLang:'cl_fashion'},
  game:          {ang:'quan',     ratio:'r_23',  lens:'l_28',  light:'ls_cinematic', atm:'at_dark',     camLang:'cl_movie'},
  darkfantasy:   {ang:'sanfen',   ratio:'r_23',  lens:'l_85',  light:'ls_lowkey',    atm:'at_dark',     camLang:'cl_movie'},
  drama:         {ang:'huanjing', ratio:'r_23',  lens:'l_35',  light:'ls_cinematic', atm:'at_moody',    camLang:'cl_movie'},
  queen:         {ang:'yang',     ratio:'r_34',  lens:'l_85',  light:'ls_cinematic', atm:'at_warm',     camLang:'cl_fashion'},
  spirits:       {ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_lowkey',    atm:'at_dark',     camLang:'cl_fashion'},
  europe_travel: {ang:'huanjing', ratio:'r_916', lens:'l_35',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_travel'},
  japan_travel:  {ang:'huanjing', ratio:'r_916', lens:'l_35',  light:'ls_natural',   atm:'at_misty',    camLang:'cl_travel'},
  korea_sea:     {ang:'huanjing', ratio:'r_916', lens:'l_35',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_travel'},
  world_travel:  {ang:'huanjing', ratio:'r_916', lens:'l_35',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_travel'},
  china_mark:    {ang:'huanjing', ratio:'r_916', lens:'l_35',  light:'ls_golden',    atm:'at_clear',    camLang:'cl_travel'},
  jinyong:       {ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_golden',    atm:'at_moody',    camLang:'cl_movie'},
  chinese_story: {ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_golden',    atm:'at_moody',    camLang:'cl_fashion'},
  fallen_angel:  {ang:'yang',     ratio:'r_23',  lens:'l_28',  light:'ls_cinematic', atm:'at_dark',     camLang:'cl_movie'},
  holy_angel:    {ang:'yang',     ratio:'r_23',  lens:'l_28',  light:'ls_backlit',   atm:'at_ethereal', camLang:'cl_movie'},
  goddess_myth:  {ang:'yang',     ratio:'r_23',  lens:'l_85',  light:'ls_golden',    atm:'at_ethereal', camLang:'cl_movie'},
  cyberpunk_sf:  {ang:'sanfen',   ratio:'r_916', lens:'l_28',  light:'ls_cinematic', atm:'at_dark',     camLang:'cl_movie'},
  realistic_life:{ang:'huanjing', ratio:'r_916', lens:'l_35',  light:'ls_natural',   atm:'at_warm',     camLang:'cl_social'},
  modern_lady:   {ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_studio',    atm:'at_clear',    camLang:'cl_magazine'},
  dragon_beast:  {ang:'yang',     ratio:'r_916', lens:'l_28',  light:'ls_cinematic', atm:'at_dark',     camLang:'cl_movie'},
  beast_tamer:   {ang:'huanjing', ratio:'r_23',  lens:'l_35',  light:'ls_cinematic', atm:'at_moody',    camLang:'cl_movie'},
  dynasty_palace:{ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_golden',    atm:'at_warm',     camLang:'cl_fashion'},
  classic_lit:   {ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_golden',    atm:'at_misty',    camLang:'cl_fashion'},
  china_drama:   {ang:'sanfen',   ratio:'r_34',  lens:'l_85',  light:'ls_cinematic', atm:'at_moody',    camLang:'cl_movie'},
  succubus_demon:{ang:'sanfen',   ratio:'r_23',  lens:'l_85',  light:'ls_lowkey',    atm:'at_dark',     camLang:'cl_fashion'},
  taiwan_travel: {ang:'huanjing', ratio:'r_916', lens:'l_35',  light:'ls_natural',   atm:'at_clear',    camLang:'cl_travel'},
  wedding_diamond:{ang:'sanfen',  ratio:'r_34',  lens:'l_85',  light:'ls_golden',    atm:'at_warm',     camLang:'cl_fashion'},
  cos_character: {ang:'quan',     ratio:'r_23',  lens:'l_85',  light:'ls_cinematic', atm:'at_clear',    camLang:'cl_movie'},
  mountain_sea:  {ang:'huanjing', ratio:'r_169', lens:'l_28',  light:'ls_golden',    atm:'at_clear',    camLang:'cl_travel'},
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
  {id:'fox',        name:'狐妖魅惑', desc:'fox enchantress seductive makeup: sultry smoky eye in amber and deep brown, slanted eyeliner for foxy eye shape, bold deep wine or crimson lip, warm golden shimmer on skin, dangerously beautiful'},
  {id:'fox_noir',   name:'九尾深妝', desc:'nine-tailed fox surface makeup: layered gold and black eye shadow, extended upper liner for fox-eye silhouette, deep burgundy-red lip, warm golden shimmer on skin — applied as surface cosmetics respecting the original eye shape and facial structure'},
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
  {id:'sanfen',  name:'三分側面', zh:'臉微側45°，最顯臉型', desc:'three-quarter angle, slight natural head turn, most flattering for face and costume'},
  {id:'zheng',   name:'正面人像', zh:'臉正對鏡頭，對稱感強', desc:'front-facing portrait, face directly toward camera, symmetrical framing'},
  {id:'banshen', name:'半身人像', zh:'腰部以上，服裝道具清楚', desc:'half-body portrait from waist up, showing face, upper costume details, and hand props'},
  {id:'quan',    name:'全身人像', zh:'頭到腳，完整服裝剪裁', desc:'full body shot head to feet, complete costume visible from crown to hem'},
  {id:'yang',    name:'仰拍氣勢', zh:'由下往上拍，人物顯高大', desc:'low angle upward shot, subject appears imposing and powerful against sky or architectural backdrop'},
  {id:'huanjing',name:'環境人像', zh:'融入大場景，強調地點感', desc:'environmental portrait, person within larger scene context, showing relationship between subject and full setting'},
  {id:'huimou',  name:'回眸一望', zh:'回頭看鏡頭，電影故事感', desc:'looking back over shoulder, three-quarter rear pose, face turned to camera over shoulder'},
];

// ═══════════════════════════════════════════
// 分類範本（共用欄位）
// ═══════════════════════════════════════════
const TPLS = {
  xianxia: {
    char:'adult cinematic xianxia heroine, clear recognizable face, strong emotional presence, transcendent presence',
    light:'cinematic lighting matched to the story setting, flattering face key light, atmospheric rim light, balanced contrast, readable facial identity',
    outfit:'complete xianxia couture styling — distinct outfit silhouette, elaborate hairpins and step-shake ornaments, trailing wide sleeves, jade ornaments, flowing silk',
    fx:'story-specific xianxia atmosphere, fabric motion, environmental particles, cinematic effects that support the face without covering it',
    tone:'coherent palette built for the specific story setting, refined cinematic color grading',
    comp:'full-body or three-quarter editorial composition, clear face, readable costume silhouette, decisive story pose, poster-like framing',
    quality:'ultra realistic premium travel portrait, detailed costume texture, natural skin, coherent anatomy, high-end editorial finish, 8K HDR',
    mk:'xianxia', ancient:true
  },
  hanfu: {
    char:'adult Chinese historical travel heroine, refined dynasty-inspired beauty, clear recognizable face',
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
    char:'adult elegant East Asian classical beauty heroine, refined and composed, polished cinematic presence, clear recognizable face',
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
    char:'adult glamorous dark fantasy heroine, alluring but tasteful, confident gaze, gothic elegance, face clear and recognizable',
    light:'low-key cinematic lighting, controlled face key light, deep shadows, crimson or violet rim light',
    outfit:'gothic couture — dark velvet or lace gown, dramatic silhouette, dark jewelry and accessories, elegant cape or veil',
    fx:'dark velvet shadows, subtle magic smoke, crimson or violet particles, candle bokeh, cinematic low-key atmosphere',
    tone:'black, burgundy, antique silver, deep violet, candle gold',
    comp:'vertical premium character travel-editorial composition, full-body or three-quarter framing, face sharp and readable, outfit and environment clearly visible',
    quality:'ultra realistic premium cinematic travel photoshoot, detailed costume texture, natural skin, coherent anatomy, high-end editorial polish, 8K HDR',
    mk:'gothic', ancient:false
  },
  myth: {
    char:'adult Chinese mythology heroine with powerful divine presence, clear recognizable face, strong emotional energy',
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
    char:'adult magical fantasy heroine, luminous and enchanting, clear recognizable face, fairytale editorial presence',
    light:'magical soft light, glowing fantasy illumination, pearlescent highlights, dreamlike atmosphere',
    outfit:'fantasy-inspired magical costume — flowing enchanted dress, flower or crystal crown, whimsical accessories, magical props',
    fx:'magical particles, glowing effects, fantasy atmosphere, floating elements, dreamlike bokeh',
    tone:'pastel magical palette — lavender, rose gold, seafoam, pearl white, soft gold',
    comp:'premium full-body or three-quarter editorial composition, clear face, magical environment fully visible',
    quality:'ultra realistic premium fantasy editorial portrait, detailed costume texture, natural skin, coherent anatomy, 8K HDR',
    mk:'flower_fairy', ancient:false
  },
  water: {
    char:'adult dreamy aquatic or floral fantasy muse, soft romantic gaze, clear recognizable face',
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
    char:'adult reference-inspired cinematic portrait heroine, clear recognizable face, natural expression preserved from uploaded photo, premium fantasy-travel editorial presence',
    light:'reference-inspired cinematic lighting with strong face readability, controlled rim light, natural skin texture, atmospheric depth, no plastic beauty-filter look',
    outfit:'complete couture styling translated from the reference mood, coherent hairstyle and accessories, premium fabric texture, tasteful fantasy or travel-fashion finish',
    fx:'reference-inspired atmosphere, fabric motion, reflective particles, water shimmer, moon glow, golden haze, or location-specific depth; effects frame the face without covering eyes, nose, mouth, or face outline',
    tone:'palette matched to the selected reference concept with refined cinematic color grading',
    comp:'premium reference-style editorial composition, face sharp and readable, body alignment coherent, costume and environment clearly visible',
    quality:'ultra realistic premium reference-inspired portrait, natural skin, coherent anatomy, detailed costume and environment texture, high-end editorial finish, 8K HDR',
    mk:'editorial', ancient:false
  },
  game: {
    char:'adult game-inspired original heroine, dynamic premium character design, clear recognizable face',
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
    char:'adult dark fantasy heroine, mysterious and powerful, clear recognizable face, cinematic dark energy',
    light:'dramatic low-key cinematic lighting, strong atmospheric rim, deep shadows with selective highlights, sinister or moonlit atmospheric haze',
    outfit:'dark fantasy costume — elaborate dark robes or armor, sinister accessories, dramatic silhouette, dark crown or headdress',
    fx:'dark energy particles, atmospheric haze, shadow effects, moonlit particles, dramatic sinister light',
    tone:'deep black, blood red, dark purple, sinister gold, shadow atmosphere',
    comp:'full-body or three-quarter cinematic portrait, story-driven pose, clear face, costume and dark location fully readable',
    quality:'ultra realistic premium cinematic travel photoshoot, detailed costume and environment texture, natural skin, coherent anatomy, 8K HDR',
    mk:'demon_lord', ancient:false
  },
  drama: {
    char:'adult heroic xianxia drama heroine, fierce devoted gaze, tragic romantic courage, wind-swept cinematic presence, face clear and recognizable',
    light:'cinematic desaturated light with strong red-vs-background contrast, clear face illumination, dramatic rim light',
    outfit:'deep crimson flowing hanfu battle dress, oversized long sleeves, embroidered gold trim, wide flying skirt train, ornate golden hair crown, long hair moving in wind',
    fx:'massive crimson skirt flying dramatically, wind-blown hair, fabric trails, dust or petals, epic xianxia drama atmosphere',
    tone:'deep crimson red against cold grey, ink blue, snow white, desert gold, or night lantern amber',
    comp:'ultra wide full-body epic xianxia drama composition, low-angle or dynamic side framing, subject small enough to show the grand environment, face still clear and readable',
    quality:'Chinese xianxia costume-drama cinematic poster, Lost You Forever inspired red-dress grand-scene mood, ultra realistic fabric motion, 8K HDR, shallow depth of field',
    mk:'cinematic', ancient:true
  },
  queen: {
    char:'adult sovereign queen or supreme empress, commanding calm gaze, noble authority, clear recognizable face',
    light:'cinematic face key light, atmosphere-matched rim light, premium period-drama lighting, clear readable facial identity',
    outfit:'majestic queen couture — structured royal gown, jeweled crown, embroidered cape, ceremonial jewelry, powerful silhouette',
    fx:'gold dust, banners, throne glow, ceremonial wind through cape',
    tone:'palette matched to the story, refined cinematic grading, strong costume-location harmony',
    comp:'full-body or three-quarter cinematic portrait, story-driven pose, clear face, costume and location fully readable',
    quality:'premium myth-history travel portrait, ultra realistic fabric and jewelry detail, 8K HDR',
    mk:'imperial_empress', ancient:true
  },
  spirits: {
    char:'adult mythological spirit or enchantress figure, intelligent and powerful, courtly or divine presence, clear recognizable face',
    light:'cinematic face key light, atmosphere-matched rim light, premium period-drama lighting, clear readable facial identity',
    outfit:'elaborate spirit-queen or enchantress couture — luxurious court robes with mythological motifs, ornate hairpins, long sleeves, jeweled belt, elegant dangerous styling',
    fx:'spirit fire, mystical smoke, palace lantern shadows, golden sparks, translucent spirit effects',
    tone:'palette matched to the myth or history story, refined cinematic grading, strong costume-location harmony',
    comp:'full-body or three-quarter cinematic portrait, story-driven pose, clear face, costume and location fully readable',
    quality:'premium myth-history travel portrait, ultra realistic fabric and jewelry detail, 8K HDR',
    mk:'fox_noir', ancient:true
  },
  europe_travel: {
    char:'adult contemporary fashion heroine on European location photoshoot, clear recognizable face, premium travel editorial presence',
    light:'natural European location light — soft morning or golden hour daylight, flattering face illumination',
    outfit:'stylish contemporary travel fashion — chic dress or casual luxury attire, coordinated accessories, location-appropriate styling',
    fx:'iconic architectural bokeh, European location atmosphere, soft environmental depth',
    tone:'warm European palette — stone, terracotta, ivory, pastel walls, golden afternoon light',
    comp:'premium travel editorial, subject in foreground with iconic landmark visible, full-body or three-quarter framing',
    quality:'ultra realistic premium travel portrait, detailed fashion and location texture, natural skin, coherent anatomy, 8K HDR',
    mk:'outdoor_glow', ancient:false
  },
  japan_travel: {
    char:'adult contemporary fashion heroine on Japanese location photoshoot, clear recognizable face, refined Japanese aesthetic presence',
    light:'Japanese natural light — soft diffused sakura-filtered or morning shrine light, flattering face illumination',
    outfit:'modern Japanese minimalist fashion or kimono-inspired styling with coordinated accessories',
    fx:'Japanese atmospheric depth — cherry blossom petals, bamboo light, torii glow',
    tone:'sakura pink, moss green, stone grey, lacquer red, wood warmth, ink white',
    comp:'premium travel editorial with iconic Japanese location integrated, full-body or three-quarter framing',
    quality:'ultra realistic premium travel portrait, 8K HDR',
    mk:'outdoor_glow', ancient:false
  },
  korea_sea: {
    char:'adult contemporary fashion heroine on Korean or Southeast Asian location photoshoot, clear recognizable face, fresh modern editorial presence',
    light:'soft Korean or tropical Southeast Asian natural light, flattering environmental illumination',
    outfit:'modern Korean street fashion or Southeast Asian inspired styling with trend-forward accessories',
    fx:'location atmosphere — Korean palace glow, tropical warmth, lush botanical depth',
    tone:'soft pastel contemporary palette or vibrant tropical warmth matched to the specific location',
    comp:'premium travel editorial composition with location integrated, full-body or three-quarter framing',
    quality:'ultra realistic premium travel portrait, 8K HDR',
    mk:'outdoor_glow', ancient:false
  },
  world_travel: {
    char:'adult contemporary world-travel fashion heroine on global landmark photoshoot, clear recognizable face, confident international editorial presence',
    light:'location-specific natural or golden hour light, flattering authentic illumination',
    outfit:'sophisticated contemporary travel fashion matched to the location culture and environment',
    fx:'iconic world landmark atmosphere, global environmental depth and authentic local character',
    tone:'palette matched to the specific world location and cultural environment',
    comp:'premium travel editorial composition, iconic landmark fully visible behind subject',
    quality:'ultra realistic premium world travel portrait, 8K HDR',
    mk:'global_sun', ancient:false
  },
  china_mark: {
    char:'adult contemporary Chinese fashion heroine at iconic Chinese landmarks, clear recognizable face, proud sophisticated editorial presence',
    light:'golden hour or atmospheric Chinese landscape light, flattering location illumination',
    outfit:'contemporary Chinese fashion or hanfu-inspired travel styling with matching accessories and cultural character',
    fx:'iconic Chinese landmark atmosphere, cultural environmental depth',
    tone:'palette inspired by the specific Chinese landmark — crimson, jade, ink, gold, mountain mist',
    comp:'premium travel editorial with Chinese landmark, full-body or three-quarter framing, landmark clearly visible',
    quality:'ultra realistic premium Chinese landmark travel portrait, 8K HDR',
    mk:'outdoor_glow', ancient:false
  },
  jinyong: {
    char:'adult wuxia martial arts heroine from a Jin Yong novel, intelligent passionate gaze, complex emotional depth, clear recognizable face',
    light:'cinematic wuxia lighting — warm candlelight or cold mountain daylight matched to the character world',
    outfit:'complete Jin Yong era-appropriate wuxia costume — hanfu martial arts dress, character-signature hair styling, authentic wuxia accessories and weapon prop',
    fx:'fabric motion, subtle wuxia energy atmosphere, era-authentic environment, cinematic story elements',
    tone:'palette matched to the specific character world — desert gold, mountain green, palace red, lake blue',
    comp:'premium character portrait, clear face, wuxia costume and story environment fully readable',
    quality:'premium wuxia character portrait, ultra realistic fabric texture, 8K HDR',
    mk:'wuxia', ancient:true
  },
  chinese_story: {
    char:'adult Chinese folklore or classical literature heroine, graceful devoted presence, classic beauty, clear recognizable face',
    light:'cinematic story-matched lighting — warm interior, misty outdoor, moonlit, or golden seasonal light',
    outfit:'costume appropriate for the specific story and character — dynasty hanfu, mythological dress, classical folk costume',
    fx:'story-specific atmospheric effects, fabric motion, seasonal and environmental storytelling elements',
    tone:'palette matched to the specific story world and emotional register',
    comp:'premium classical character portrait, clear face, story costume and setting fully readable',
    quality:'premium Chinese classical story portrait, ultra realistic fabric and environment texture, 8K HDR',
    mk:'gudian_hong', ancient:true
  },
  fallen_angel: {
    char:'adult fallen angel or dark celestial heroine, tragic yet powerful gaze, divine corruption beauty, clear recognizable face',
    light:'dramatic otherworldly lighting — harsh divine white light from above opposed by deep void darkness below',
    outfit:'fallen divine armor or torn celestial robes — cracked dark halo, asymmetric wings one intact one shattered, dark silver and void black styling',
    fx:'falling dark feathers, fracturing divine light, void energy particles, dramatic heaven-to-darkness atmosphere',
    tone:'tarnished silver, void black, fractured gold light, storm grey, deep violet corruption',
    comp:'epic full-body character portrait, wings spread or partially unfurled, dramatic celestial ruin environment',
    quality:'premium dark celestial concept art quality, ultra realistic feather and fabric texture, 8K HDR',
    mk:'fallen_angel', ancient:false
  },
  holy_angel: {
    char:'adult holy angel or divine guardian heroine, serene powerful gaze, pure divine radiance, clear recognizable face',
    light:'radiant divine golden-white light from above, clean celestial glow illumination, halo glow, pure ethereal clarity',
    outfit:'divine ceremonial armor or holy celestial robes — pristine white and divine gold, majestic intact wings, sacred halo crown and accessories',
    fx:'golden divine light rays, white feathers floating gracefully, sacred halo glow, heavenly celestial atmosphere',
    tone:'pure white, divine gold, celestial sky blue, holy silver, warm heavenly light',
    comp:'epic full-body character portrait, wings spread majestically, heavenly divine setting fully visible',
    quality:'premium holy celestial concept art quality, ultra realistic divine feather and fabric, 8K HDR',
    mk:'angel_holy', ancient:false
  },
  goddess_myth: {
    char:'adult mythological goddess heroine with divine eternal power and beauty, commanding divine presence, clear recognizable face',
    light:'divine mythological lighting — Olympian marble sunlight, Nordic aurora radiance, or Egyptian solar-god light matched to the specific pantheon',
    outfit:'complete goddess divine attire — pantheon-appropriate divine robes or armor, crown or headdress, signature mythological weapons or symbolic accessories',
    fx:'divine energy aura, pantheon-specific environmental effects — Greek lightning, Norse aurora, Egyptian desert divine wind',
    tone:'palette matched to the specific mythology — Greek white-gold-marble, Norse aurora-silver-ice, Egyptian gold-lapis-sand',
    comp:'epic full-body divine portrait, goddess commanding the divine environment, majestic scale and commanding presence',
    quality:'premium mythological goddess art quality, ultra realistic divine costume and environment, 8K HDR',
    mk:'oracle_gold', ancient:false
  },
  cyberpunk_sf: {
    char:'adult cyberpunk or sci-fi heroine, sharp confident futuristic gaze, premium high-tech character design, clear recognizable face',
    light:'cyberpunk dramatic neon city lighting — electric blue and magenta rim lights, rain-reflected neon, high contrast night environment',
    outfit:'cyberpunk or sci-fi attire — tech-enhanced jacket, circuit-detail bodysuit, holographic accessories, augmented reality visor or neural implants',
    fx:'neon rain reflections, holographic glitch effects, cyberpunk city electric glow, energy particle details',
    tone:'electric blue, neon magenta, chrome silver, deep black, bright cyan and amber accent',
    comp:'premium cyberpunk editorial portrait, neon-lit urban night environment, full-body or three-quarter framing',
    quality:'ultra realistic premium cyberpunk editorial, detailed tech costume and neon environment, 8K HDR',
    mk:'cyber_idol', ancient:false
  },
  realistic_life: {
    char:'adult contemporary fashion heroine on premium natural or lifestyle photoshoot, approachable genuine warm presence, clear recognizable face',
    light:'natural authentic lighting — golden hour warmth, soft diffused daylight, ambient interior — always flattering and genuine',
    outfit:'contemporary fashion — casual luxury, bohemian, or modern lifestyle attire authentically matched to the location',
    fx:'natural environment details, soft bokeh, genuine atmospheric depth and seasonal character',
    tone:'natural true-to-life palette matched to the specific natural or urban location',
    comp:'natural editorial composition, subject integrated authentically in real-world environment',
    quality:'ultra realistic premium natural editorial portrait, authentic skin and genuine environment, 8K HDR',
    mk:'natural_clean', ancient:false
  },
  modern_lady: {
    char:'adult confident professional contemporary heroine — CEO executive, urban elite, or high-fashion professional, powerful sophisticated presence, clear recognizable face',
    light:'premium architectural and interior lighting — dramatic glass-and-steel office light, designer restaurant ambient, or luxury interior illumination',
    outfit:'high fashion power dressing — sharp tailored suit, luxury designer coat, premium accessories — high-end contemporary executive styling',
    fx:'glass and steel reflections, city skyline view bokeh, premium material texture — silk, leather, gold details',
    tone:'executive power palette — charcoal, camel, ivory, deep navy, cognac leather, champagne gold',
    comp:'executive portrait composition — confident commanding pose, premium location clearly conveying status and authority',
    quality:'premium editorial executive portrait, ultra realistic fashion and architectural interior, 8K HDR',
    mk:'editorial', ancient:false
  },
  dynasty_palace: {
    char:'adult magnificent Chinese dynasty imperial heroine — empress, queen mother, noble concubine, bannerman princess, or court lady of the highest rank, dignified sovereign beauty, clear recognizable face',
    light:'golden imperial palace interior lighting or ceremonial garden sunlight, flattering face key light, ceremonial warm glow, imperial grandeur atmosphere',
    outfit:'full imperial dynasty court attire — complete multi-layer ceremonial robes, dynasty-appropriate crown or headdress, jeweled belt with jade pendants, layered embroidered sleeves, full imperial accessories',
    fx:'gold dust particles, ceremonial fabric motion, palace lantern glow, imperial court ceremonial atmosphere',
    tone:'imperial palette — vermillion red, imperial yellow, jade green, pearl white, deep gold, lacquer black',
    comp:'premium imperial portrait, full-body or three-quarter editorial composition, complete regal costume silhouette clearly visible, clear face',
    quality:'premium dynasty imperial portrait, ultra realistic ceremonial costume and headdress texture, 8K HDR',
    mk:'imperial_empress', ancient:true
  },
  classic_lit: {
    char:'adult Chinese classical literature heroine, graceful elegant presence, literary emotional depth, clear recognizable face',
    light:'cinematic literary atmosphere — warm candle study light, misty garden morning, moonlit pavilion, or seasonal golden light matched to the character world',
    outfit:'complete literary-era appropriate costume — dynasty-authentic dress, character-signature accessories, story-faithful styling',
    fx:'story-specific atmospheric effects, period details, emotional literary atmosphere, seasonal character',
    tone:'palette matched to the specific literary world and character emotional register',
    comp:'premium literary character portrait, clear face, costume and story setting fully readable',
    quality:'premium classical literature character portrait, ultra realistic costume and environmental detail, 8K HDR',
    mk:'gudian_hong', ancient:true
  },
  china_drama: {
    char:'adult Chinese TV drama heroine from acclaimed production, charismatic screen presence, strong character identity, clear recognizable face',
    light:'drama cinematic lighting matched to the character world — palace glow, xianxia immortal realm light, wuxia natural light, or period atmosphere',
    outfit:'drama-authentic costume design — period court dress, xianxia celestial robes, or wuxia attire matched to the specific drama character',
    fx:'drama-specific atmosphere, character world environment effects, cinematic Chinese drama production quality',
    tone:'palette matched to the specific drama aesthetic — warm palace gold, cool xianxia white-blue, wuxia earth tones',
    comp:'premium drama character portrait, clear face, complete costume and drama setting readable',
    quality:'premium Chinese drama character portrait, cinematic production quality, 8K HDR',
    mk:'cinematic', ancient:true
  },
  succubus_demon: {
    char:'adult dark supernatural heroine — succubus enchantress or female demon sovereign, alluring yet powerful gaze, supernatural presence, clear recognizable face',
    light:'supernatural dark illumination — infernal red or deep violet rim light, selective dark key light on face, dramatic sinister atmosphere',
    outfit:'dark supernatural elegance — seductive demon attire with dark wings motif, dark gemstone accessories, otherworldly dangerous beauty styling',
    fx:'dark supernatural energy, infernal particles, demonic realm atmosphere, sinister elegant effects',
    tone:'deep crimson, dark violet, sinister gold, obsidian black, blood red accent',
    comp:'premium supernatural character portrait, dramatic full-body or three-quarter composition, clear face, sinister environment readable',
    quality:'premium dark supernatural character concept art quality, ultra realistic dark costume detail, 8K HDR',
    mk:'succubus_alluring', ancient:false
  },
  dragon_beast: {
    char:'adult dragon-bonded or mythological beast rider heroine, fierce bonded gaze, primal power and grace, clear recognizable face',
    light:'dramatic elemental lighting matched to the dragon type — fire orange-red glow, ice cave blue, storm lightning, volcanic heat shimmer',
    outfit:'dragon rider armor or mythological beast-bonded costume — scaled armor accents, dragon-motif crown and jewelry, rider gear, fantasy battle styling',
    fx:'dragon breath or elemental power, ice shards or fire embers or storm lightning, environmental scale creature effects',
    tone:'palette matched to dragon type — fire orange-red, ice crystal blue, shadow black-gold, forest emerald-gold',
    comp:'epic full-body or dramatic portrait, mythological creature presence visible at environmental scale',
    quality:'premium epic fantasy art quality, ultra realistic armor and elemental creature environment, 8K HDR',
    mk:'dragon_epic', ancient:false
  },
  beast_tamer: {
    char:'adult beast tamer or mythological creature companion heroine, genuine bond with animal companion, warm authority and mutual trust, clear recognizable face',
    light:'dramatic natural lighting matched to beast habitat — golden forest light, moonlit clearing, mountain mist, aurora tundra, sacred temple glow',
    outfit:'beast tamer specialty attire — leather companion gear, mythological companion robes, wildlife-tracker fashion, creature-bonded ceremonial dress',
    fx:'creature companion visible at close or medium range near subject, bond gesture or eye contact between human and beast, habitat environmental atmosphere',
    tone:'palette matched to the beast type — warm amber-gold for forest, cool blue-white for arctic, deep green for jungle, silver-moonlit for night',
    comp:'environmental portrait showing subject and beast companion together, beast clearly visible and interactive, human-animal bond as the central visual story',
    quality:'ultra realistic premium fantasy portrait, detailed creature texture and authentic companion interaction, cinematic depth, 8K HDR',
    mk:'oriental', ancient:false
  },
  taiwan_travel: {
    char:'adult contemporary fashion heroine on Taiwan location photoshoot, clear recognizable face, fresh confident editorial presence',
    light:'natural Taiwan location light — golden afternoon or soft overcast daylight, flattering authentic illumination',
    outfit:'stylish contemporary travel fashion or modern chic attire, coordinated accessories, Taiwan-appropriate styling',
    fx:'iconic Taiwan location atmosphere, local cultural environmental depth, authentic local character',
    tone:'palette matched to the specific Taiwan location — mountain green, ocean blue, warm evening gold, city neon',
    comp:'premium travel editorial, subject with iconic Taiwan landmark or natural scenery, full-body or three-quarter framing',
    quality:'ultra realistic premium travel portrait, detailed fashion and location texture, natural skin, coherent anatomy, 8K HDR',
    mk:'outdoor_glow', ancient:false
  },
  wedding_diamond: {
    char:'adult radiant bride heroine, elegant romantic luminous presence, clear recognizable face',
    light:'romantic bridal lighting — soft golden warmth, cinematic studio radiance, or ethereal soft light matched to the venue',
    outfit:'elaborate luxury bridal gown — diamond crystal embellishment, dramatic train, bridal veil or crown, matching luxury jewelry',
    fx:'diamond sparkle light effects, bridal flower petals, soft romantic bokeh, bridal bouquet or veil motion',
    tone:'bridal palette — pure white, soft champagne, blush pink, diamond silver, gold accent, romantic ivory',
    comp:'premium bridal portrait, full-body showing complete gown, or intimate three-quarter bridal framing',
    quality:'ultra realistic premium bridal editorial, detailed gown fabric and diamond embellishment, natural skin, 8K HDR',
    mk:'wedding', ancient:false
  },
  cos_character: {
    char:'adult premium cosplay heroine — faithful character costume recreation with cinematic editorial production quality, clear recognizable face',
    light:'character-appropriate cinematic lighting — game or anime inspired dramatic light matched to character world',
    outfit:'premium full character costume — screen-accurate design, detailed character accessories, weapon or signature prop, professional cosplay production quality',
    fx:'character-world atmosphere effects — game particle effects, anime-inspired magical atmosphere, character-signature visual elements',
    tone:'palette matched to the specific character visual identity and character world',
    comp:'premium character concept art style portrait, full-body or dramatic three-quarter, complete character costume and accessories visible',
    quality:'premium cosplay editorial portrait, ultra realistic character costume and signature prop detail, cinematic character concept quality, 8K HDR',
    mk:'character_pop', ancient:false
  },
  mountain_sea: {
    char:'adult confident outdoor adventure heroine, natural wind-blown cinematic presence, clear recognizable face against vast natural panorama',
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
function renderLight(){
  document.getElementById('lightChips').innerHTML = LIGHT_STYLE.map(l=>`
    <div class="chip${l.id===curLightID?' active':''}" onclick="selLight('${l.id}')">${l.name}</div>`).join('');
}
function renderAtm(){
  document.getElementById('atmChips').innerHTML = ATM.map(a=>`
    <div class="chip${a.id===curAtmID?' active':''}" onclick="selAtm('${a.id}')">${a.name}</div>`).join('');
}
function renderIdentity(){
  document.getElementById('identityChips').innerHTML = IDENTITY_LOCK.map(i=>`
    <div class="chip${i.id===curIdentityID?' active':''}" onclick="selIdentity('${i.id}')">${i.name}</div>`).join('');
}
function renderCamLang(){
  document.getElementById('camLangChips').innerHTML = CAMERA_LANG.map(c=>`
    <div class="chip${c.id===curCamLangID?' active':''}" onclick="selCamLang('${c.id}')">${c.name}</div>`).join('');
}

function renderCatStrip(){
  const el = document.getElementById('catStrip');
  el.innerHTML = CATS.map(c=>`
    <div class="cat-pill${c.id===curCatID?' active':''}" onclick="selCat('${c.id}')">
      <span class="cat-pill-icon">${c.icon}</span>
      <span class="cat-pill-name">${c.name}</span>
    </div>`).join('');
}

function renderPresets(){
  const cat = getCat(curCatID);
  if(!cat) return;
  document.getElementById('presetGrid').innerHTML = cat.entries.map(e=>`
    <div class="preset-card${e.id===curEntryID?' active':''}" onclick="selEntry('${e.id}')">
      <span class="preset-icon">${e.icon}</span>
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
  const lens = LENS.find(l=>l.id===curLensID);
  const light = LIGHT_STYLE.find(l=>l.id===curLightID);
  const identity = IDENTITY_LOCK.find(i=>i.id===curIdentityID);
  badge.innerHTML=`
    <span class="badge-item">${cat.icon} ${cat.name}</span>
    <span class="badge-sep">›</span>
    <span class="badge-item">${entry.icon} ${entry.name}</span>
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
  const defs = TPL_DEFAULTS[tplKey]||{};
  const e = entryOrNull||{};
  if(e.ang    || defs.ang)     curAngID    = e.ang    || defs.ang;
  if(e.ratio  || defs.ratio)   curRatioID  = e.ratio  || defs.ratio;
  if(e.lens   || defs.lens)    curLensID   = e.lens   || defs.lens;
  if(e.light  || defs.light)   curLightID  = e.light  || defs.light;
  if(e.atm    || defs.atm)     curAtmID    = e.atm    || defs.atm;
  if(e.mk     || defs.mk)      curMKID     = e.mk     || defs.mk;
  if(e.camLang|| defs.camLang) curCamLangID= e.camLang|| defs.camLang;
}

function selCat(catID){
  curCatID = catID;
  const cat = getCat(catID);
  if(cat){
    curEntryID = cat.entries[0].id;
    const tpl = TPLS[cat.tpl]||TPLS.xianxia;
    if(tpl.mk) curMKID = tpl.mk;
    applyDefs(cat.entries[0], cat.tpl);
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
  applyDefs(entry, cat.tpl);
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
  curAngID = id;
  document.querySelectorAll('#angChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#angChips .chip[onclick="selAng('${id}')"]`)?.classList.add('active');
  renderBadge();
}

function selRatio(id){
  curRatioID = id;
  document.querySelectorAll('#ratioChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#ratioChips .chip[onclick="selRatio('${id}')"]`)?.classList.add('active');
  renderBadge();
}
function selLens(id){
  curLensID = id;
  document.querySelectorAll('#lensChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#lensChips .chip[onclick="selLens('${id}')"]`)?.classList.add('active');
  renderBadge();
}
function selLight(id){
  curLightID = id;
  document.querySelectorAll('#lightChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#lightChips .chip[onclick="selLight('${id}')"]`)?.classList.add('active');
  renderBadge();
}
function selAtm(id){
  curAtmID = id;
  document.querySelectorAll('#atmChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#atmChips .chip[onclick="selAtm('${id}')"]`)?.classList.add('active');
  renderBadge();
}
function selIdentity(id){
  curIdentityID = id;
  document.querySelectorAll('#identityChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#identityChips .chip[onclick="selIdentity('${id}')"]`)?.classList.add('active');
  renderBadge();
}
function selCamLang(id){
  curCamLangID = id;
  document.querySelectorAll('#camLangChips .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`#camLangChips .chip[onclick="selCamLang('${id}')"]`)?.classList.add('active');
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
  const tpl = TPLS[cat.tpl]||TPLS.xianxia;
  curMKID = entry.mk || tpl.mk || 'xianxia';
  applyDefs(entry, cat.tpl);
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
  const ang = ANG.find(a=>a.id===curAngID)||ANG[0];
  if(!cat||!entry) return '';
  const tpl = TPLS[cat.tpl]||TPLS.xianxia;

  const f = (field) => entry[field] || tpl[field] || '';

  const proShot   = document.getElementById('proShot').value;
  const proAction = document.getElementById('proAction').value;
  const proCustom = document.getElementById('proCustom').value.trim();
  const txtLine   = document.getElementById('txtLine').value.trim();
  const extras    = document.getElementById('extras').value.trim();

  const ratio    = RATIO.find(r=>r.id===curRatioID)||RATIO[0];
  const lens     = LENS.find(l=>l.id===curLensID)||LENS[0];
  const lightSt  = LIGHT_STYLE.find(l=>l.id===curLightID)||LIGHT_STYLE[0];
  const atm      = ATM.find(a=>a.id===curAtmID)||ATM[0];
  const identity = IDENTITY_LOCK.find(i=>i.id===curIdentityID)||IDENTITY_LOCK[0];
  const camLang  = CAMERA_LANG.find(c=>c.id===curCamLangID)||CAMERA_LANG[0];
  const posePack = getCategoryPosePack(cat);

  // Build scene description
  let sceneDesc = f('scene');
  if(!sceneDesc && tpl.scene_prefix){
    sceneDesc = `${tpl.scene_prefix}; ${entry.sub || entry.name}`;
  }

  // Build pro block
  const proParts = [];
  if(proShot)   proParts.push(`Camera framing priority: ${proShot}.`);
  if(proAction) proParts.push(`Action priority: ${proAction}.`);
  proParts.push(buildPoseGuidance({ cat, entry, camLang, proAction }));
  proParts.push(`Action safety: face must remain fully visible — if any action would obscure the face, modify to keep face open and clearly lit.`);
  proParts.push(`Costume completeness: full costume must be visible — no cropped hems, no missing sleeves, no cut-off accessories.`);
  if(proCustom) proParts.push(proCustom);

  const fallbackProp = !f('prop') && posePack ? pickRandom(posePack.prop) : '';
  const fallbackComp = !f('comp') && posePack ? pickRandom(posePack.comp) : '';

  const parts = [
    CORE_GATE,
    CORE_IDENTITY,
    CORE_ELASTICITY,
    CORE_ANTI_AI,
    CORE_ANATOMY,
    CORE_STRUCTURE,
    CORE_REALISM,
    proParts.join(' '),
    `[${cat.name} — ${entry.name}${entry.sub?' · '+entry.sub:''}]: ${entry.name} style, ${cat.name} aesthetic, strong authentic period or fantasy character styling, photorealistic cinematic editorial image.`,
    sceneDesc ? `Scene: ${sceneDesc}.` : '',
    f('light') ? `Lighting: ${f('light')}.` : '',
    f('char') ? `Character atmosphere (costume and mood only — does not affect face): ${f('char')}.` : '',
    `Makeup surface design: ${mk.desc}.`,
    tpl.ancient ? ANCIENT_BOOST : '',
    f('outfit') ? `Costume and styling: ${f('outfit')}.` : '',
    f('prop') ? `Props and action: ${f('prop')}.` : (fallbackProp ? `Props and action: ${fallbackProp}.` : ''),
    `Action, props, and composition must work together coherently: the action naturally incorporates the props, and the camera angle frames both the face and costume details optimally.`,
    `Prop and effect safety: no prop, hair ornament, veil, smoke, particle, or visual effect may cover the eyes, nose, mouth, or face outline.`,
    f('comp') ? `Camera and composition: ${f('comp')}. Angle guidance: ${ang.desc}.` : (fallbackComp ? `Camera and composition: ${fallbackComp}. Angle guidance: ${ang.desc}.` : `Angle guidance: ${ang.desc}.`),
    f('fx') ? `Visual effects: ${f('fx')}.` : '',
    f('tone') ? `Color tone: ${f('tone')}.` : '',
    f('quality') ? `${f('quality')}.` : QUALITY_BASE,
    txtLine ? `Typography overlay: ${txtLine}.` : '',
    extras ? `Special requirements: ${extras}.` : '',
    `Image format: ${ratio.desc}`,
    `Lens simulation: ${lens.desc}`,
    `Editorial lighting override: ${lightSt.desc}`,
    `Overall atmosphere: ${atm.desc}`,
    `Camera language: ${camLang.desc}`,
    identity.boost ? identity.boost : '',
    CORE_BEAUTY_SAFETY,
    `Avoid: ${AVOID_LOCK}.`,
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
  if(cat) applyDefs(cat.entries[0], cat.tpl);
})();
renderAll();
