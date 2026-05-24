export const IDENTITY_SAFETY_RULES = [
  {
    flag: 'beauty_template_risk',
    severity: 3,
    patterns: [
      /\bbeauty\b/gi,
      /\bbeautiful\b/gi,
      /\bgorgeous\b/gi,
      /\bglamorous\b/gi,
      /\bperfect skin\b/gi,
      /\bflawless(?: skin| face)?\b/gi,
      /\bporcelain skin\b/gi,
      /\bmodel face\b/gi,
      /\binfluencer face\b/gi,
      /\bAI glamour-face\b/gi,
      /女神感|絕世|無瑕|網紅臉/g,
    ],
  },
  {
    flag: 'archetype_face_risk',
    severity: 3,
    patterns: [
      /\bsuccubus queen\b/gi,
      /\bsuccubus woman\b/gi,
      /\bdemon queen\b/gi,
      /\bdemon sovereign\b/gi,
      /\bfantasy queen\b/gi,
      /\bfantasy empress\b/gi,
      /\bfantasy beauty\b/gi,
      /\bgoddess face\b/gi,
      /\bgoddess aura\b/gi,
      /\bimmortal aesthetic\b/gi,
      /\bxianxia heroine\b/gi,
      /\bdark fantasy heroine\b/gi,
      /\bheroine\b/gi,
      /妖魅|化形|仙女|神女臉|古偶女主|女王臉/g,
    ],
  },
  {
    flag: 'editorial_beauty_risk',
    severity: 2,
    patterns: [
      /\bmagazine cover\b/gi,
      /\bmagazine beauty\b/gi,
      /\beditorial realism\b/gi,
      /\bfashion editorial\b/gi,
      /\bcharacter editorial realism\b/gi,
      /\bpremium fantasy editorial realism\b/gi,
      /\bpremium .* editorial realism\b/gi,
      /\bconcept art quality\b/gi,
      /\bcharacter concept art\b/gi,
      /\bfashion beauty portrait\b/gi,
      /\bhigh-end magazine\b/gi,
    ],
  },
  {
    flag: 'dynamic_angle_identity_risk',
    severity: 2,
    patterns: [
      /\blooking upward\b/gi,
      /\blooking upwards\b/gi,
      /\blooking curious toward the side\b/gi,
      /\bdramatic side profile\b/gi,
      /\bside profile\b/gi,
      /\bover-the-shoulder\b/gi,
      /\bturning back over the shoulder\b/gi,
      /\blooking back over shoulder\b/gi,
      /\blow-angle hero shot\b/gi,
      /\bheroic angle\b/gi,
      /\bforced-perspective hero shot\b/gi,
      /仰頭|仰望|側臉|回眸|低角度英雄|英雄仰拍/g,
    ],
  },
  {
    flag: 'head_scale_risk',
    severity: 2,
    patterns: [
      /\bhalf-body close portrait\b/gi,
      /\bhalf-body portrait from waist up\b/gi,
      /\bwaist-up portrait\b/gi,
      /\bface-readable half-body\b/gi,
      /\bface-readable close framing\b/gi,
      /\bupper costume details\b/gi,
      /\bclose-up beauty portrait\b/gi,
      /\bbeauty-camera framing\b/gi,
      /半身近景|美妝近景|封面大頭/g,
    ],
  },
  {
    flag: 'makeup_restructure_risk',
    severity: 2,
    patterns: [
      /\bsharp winged eyeliner\b/gi,
      /\bcat-eye\b/gi,
      /\bfox-eye\b/gi,
      /\bdark regal contour\b/gi,
      /\bcontour(?:ing)?\b/gi,
      /\bsculpted\b/gi,
      /\bblackened red smoky eyes\b/gi,
      /\bheavy smoky eye\b/gi,
    ],
  },
];

export const IDENTITY_SAFE_REPLACEMENTS = [
  [/premium fantasy editorial realism/gi, 'natural cinematic realism with real-person identity fidelity'],
  [/premium ([a-z\s-]*?)character editorial realism/gi, 'natural cinematic environmental realism with real-person identity fidelity'],
  [/premium ([a-z\s-]*?)editorial realism/gi, 'natural cinematic realism with real-person identity fidelity'],
  [/editorial realism/gi, 'natural cinematic realism'],
  [/fashion editorial camera language/gi, 'controlled real-person environmental camera framing'],
  [/magazine cover camera language/gi, 'natural environmental portrait photography language'],
  [/magazine cover/gi, 'natural environmental portrait photography'],
  [/high-end magazine visual grammar/gi, 'clear real-person photographic composition'],
  [/luxury fashion photography aesthetic/gi, 'refined real-person photographic styling'],
  [/fashion beauty portrait/gi, 'controlled real-person portrait photography'],
  [/concept art quality/gi, 'real-person photographic quality'],
  [/character concept art/gi, 'real photograph of the uploaded person inside a designed environment'],
  [/cinematic character concept quality/gi, 'cinematic real-person photographic quality'],

  [/succubus queen/gi, 'uploaded real person in dark supernatural costume styling'],
  [/succubus woman/gi, 'uploaded real person wearing dark supernatural costume styling'],
  [/demon queen/gi, 'real woman inside a dark supernatural environment'],
  [/demon sovereign/gi, 'real woman in dark supernatural royal styling'],
  [/fantasy queen/gi, 'uploaded real person wearing fantasy-inspired royal costume styling'],
  [/fantasy empress/gi, 'uploaded real person wearing fantasy-inspired royal costume styling'],
  [/fantasy beauty/gi, 'real-person portrait in a fantasy environment'],
  [/goddess face/gi, 'mythic environment styling, no facial redesign'],
  [/goddess aura/gi, 'mythic atmosphere around the environment'],
  [/immortal aesthetic/gi, 'xianxia-inspired environment, not facial styling'],
  [/dark fantasy heroine/gi, 'real person inside a dark fantasy environment'],
  [/妖魅/g, 'mythic atmosphere'],
  [/化形/g, 'mythic transformation atmosphere'],
  [/仙女/g, 'xianxia-inspired figure styling around the uploaded real person'],
  [/\bheroine\b/gi, 'central real person'],

  [/realistic everyday beauty/gi, 'realistic natural skin appearance'],
  [/perfect beauty reconstruction/gi, 'authentic real-person appearance'],
  [/perfect beauty/gi, 'authentic real-person appearance'],
  [/perfect skin/gi, 'natural skin texture with real imperfections'],
  [/flawless skin/gi, 'natural skin texture with real imperfections'],
  [/\bflawless\b/gi, 'natural'],
  [/porcelain skin/gi, 'authentic human skin texture'],
  [/model face/gi, 'authentic real-person appearance'],
  [/glamorous beauty/gi, 'authentic real-person appearance'],
  [/\bbeauty\b/gi, 'real-person appearance'],
  [/\bgorgeous\b/gi, 'authentic'],
  [/\bglamorous\b/gi, 'refined'],
  [/\bsculpted\b/gi, 'surface-defined'],

  [/sharp winged eyeliner/gi, 'soft eyeliner color only, no eye-shape-changing liner'],
  [/cat-eye liner reshaping/gi, 'soft liner color following the original eye shape'],
  [/\bcat-eye\b/gi, 'soft liner following the original eye shape'],
  [/\bfox-eye\b/gi, 'soft liner following the original eye shape'],
  [/dark regal contour/gi, 'surface-only shadow toning, no facial reshaping'],
  [/\bcontouring\b/gi, 'surface color toning only, no facial reshaping'],
  [/\bcontour\b/gi, 'surface color toning only'],
  [/blackened red smoky eyes/gi, 'subtle dark red smoky makeup, surface-only'],
  [/heavy smoky eye/gi, 'controlled smoky eye kept surface-only'],

  [/looking curious toward the side/gi, 'gentle natural eye contact toward camera'],
  [/looking upwards thoughtfully/gi, 'soft neutral gaze slightly above camera level'],
  [/looking upward/gi, 'camera-level gaze with stable face orientation'],
  [/looking upwards/gi, 'camera-level gaze with stable face orientation'],
  [/dramatic side profile/gi, 'mild three-quarter face angle with stable facial geometry'],
  [/side profile/gi, 'mild three-quarter face angle with stable facial geometry'],
  [/over-the-shoulder turn-back pose/gi, 'mild body turn while face remains camera-level and structurally readable'],
  [/turning back over the shoulder/gi, 'mild body turn while face remains directed toward camera'],
  [/looking back over shoulder/gi, 'mild body turn while face remains directed toward camera'],
  [/low-angle hero shot/gi, 'eye-level or natural chest-height shot'],
  [/heroic angle/gi, 'stable eye-level camera angle'],
  [/forced-perspective hero shot/gi, 'stable eye-level camera angle without forced perspective'],

  [/half-body close portrait/gi, 'medium three-quarter portrait with balanced body proportion'],
  [/half-body portrait from waist up/gi, 'medium three-quarter portrait with balanced head-to-shoulder-to-torso proportion'],
  [/waist-up portrait/gi, 'medium three-quarter body composition'],
  [/face-readable half-body/gi, 'identity-readable three-quarter portrait without enlarging the head'],
  [/face-readable close framing/gi, 'identity-readable medium framing without enlarging the head'],
  [/upper costume details/gi, 'complete upper-body silhouette'],
  [/beauty-camera framing/gi, 'real-person camera framing with natural body scale'],
  [/close-up beauty portrait/gi, 'medium three-quarter real-person portrait'],

  [/travel documentary/gi, 'location-based real-person photography'],
  [/candid travel/gi, 'grounded location-based real-person photography'],
  [/location editorial/gi, 'location-based real-person photography'],
  [/travel editorial/gi, 'location-based real-person photography'],
  [/\beditorial\b/gi, 'real-person photographic'],
];

export function applyIdentitySafeReplacements(text) {
  let next = String(text || '');
  for (const [pattern, replacement] of IDENTITY_SAFE_REPLACEMENTS) {
    next = next.replace(pattern, replacement);
  }
  return next.replace(/\s{2,}/g, ' ').trim();
}

export function analyzeIdentitySafety(text) {
  const source = String(text || '');
  const flags = new Set();
  let score = 0;
  const hits = [];

  for (const rule of IDENTITY_SAFETY_RULES) {
    for (const rawPattern of rule.patterns) {
      const pattern = new RegExp(rawPattern.source, rawPattern.flags);
      const matches = [...source.matchAll(pattern)];
      if (!matches.length) continue;
      flags.add(rule.flag);
      score += rule.severity * matches.length;
      hits.push(...matches.slice(0, 5).map((match) => ({
        flag: rule.flag,
        term: match[0],
      })));
    }
  }

  return {
    score,
    level: score >= 8 ? 'high' : score >= 3 ? 'medium' : 'low',
    flags: [...flags],
    hits,
  };
}

export function riskLevelForFlag(analysis, flag) {
  const count = analysis.hits.filter((hit) => hit.flag === flag).length;
  if (count >= 3) return 'high';
  if (count >= 1) return 'medium';
  return 'low';
}

export function identityRiskFields(text) {
  const analysis = analyzeIdentitySafety(text);
  return {
    identity_mode: 'identity_sovereign',
    fantasy_scope: ['environment', 'costume', 'props', 'lighting', 'atmosphere'],
    face_scope: 'preserve_only',
    identity_risk_score: analysis.score,
    style_contamination_risk: analysis.level,
    beauty_template_risk: riskLevelForFlag(analysis, 'beauty_template_risk'),
    archetype_face_risk: riskLevelForFlag(analysis, 'archetype_face_risk'),
    editorial_beauty_risk: riskLevelForFlag(analysis, 'editorial_beauty_risk'),
    dynamic_angle_identity_risk: riskLevelForFlag(analysis, 'dynamic_angle_identity_risk'),
    head_scale_risk: riskLevelForFlag(analysis, 'head_scale_risk'),
    makeup_restructure_risk: riskLevelForFlag(analysis, 'makeup_restructure_risk'),
    identity_risk_flags: analysis.flags,
    rewrite_needed: analysis.level !== 'low',
  };
}
