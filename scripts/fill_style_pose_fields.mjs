import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "index.html");

const CATEGORY_GROUPS = {
  taiwan_travel: "travel",
  mountain_sea: "travel",
  europe_travel: "travel",
  japan_travel: "travel",
  korea_sea: "travel",
  world_travel: "travel",
  china_mark: "travel",
  modern_lady: "modern",
  realistic_life: "modern",
  wedding_diamond: "wedding",
  hanfu: "hanfu",
  dynasty_palace: "hanfu",
  tang_grandeur: "hanfu",
  song_grace: "hanfu",
  ming_grace: "hanfu",
  qing_grace: "hanfu",
  oriental: "hanfu",
  xianxia: "hanfu",
  china_drama: "hanfu",
  drama: "hanfu",
  hotdrama: "hanfu",
  three_kingdoms: "hanfu",
  jinyong: "hanfu",
  classic_lit: "hanfu",
  chinese_story: "hanfu",
  queen: "queen",
  succubus_demon: "queen",
  goddess_myth: "queen",
  myth: "queen",
  fantasy: "fantasy",
  gothic: "fantasy",
  darkfantasy: "fantasy",
  spirits: "fantasy",
  water: "fantasy",
  holy_angel: "fantasy",
  fallen_angel: "fantasy",
  dragon_beast: "fantasy",
  beast_tamer: "fantasy",
  china_myth_chars: "fantasy",
  cyberpunk_sf: "fantasy",
  game: "fantasy",
  cos_character: "fantasy",
};

const MARK_GROUPS = {
  wuxia: "hanfu",
  xianxia: "hanfu",
  gongting: "hanfu",
  oriental: "hanfu",
  yaohou: "queen",
  gothic: "fantasy",
};

const ENTRY_KEY_ORDER = [
  "id",
  "name",
  "sub",
  "icon",
  "scene",
  "light",
  "outfit",
  "prop",
  "comp",
  "fx",
  "tone",
  "quality",
  "mk",
  "ratio",
  "lens",
  "ang",
  "camLang",
];

const CATEGORY_KEY_ORDER = ["id", "name", "icon", "tpl", "entries"];

function extractCatsBlock(text) {
  const declaration = "const CATS = [";
  const start = text.indexOf(declaration);
  if (start === -1) {
    throw new Error("CATS declaration not found");
  }

  const openIndex = text.indexOf("[", start);
  let depth = 0;
  let inString = false;
  let quote = "";
  let escape = false;
  let closeIndex = -1;

  for (let i = openIndex; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === quote) {
        inString = false;
      }
      continue;
    }

    if (ch === "'" || ch === "\"") {
      inString = true;
      quote = ch;
      continue;
    }

    if (ch === "[") {
      depth += 1;
    } else if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        closeIndex = i;
        break;
      }
    }
  }

  if (closeIndex === -1) {
    throw new Error("CATS closing bracket not found");
  }

  return {
    arrayStart: openIndex,
    arrayEnd: closeIndex + 1,
    arrayText: text.slice(openIndex, closeIndex + 1),
  };
}

function parseCats(arrayText) {
  return vm.runInNewContext(`(${arrayText})`);
}

function chooseByHash(seed, variants) {
  if (!variants.length) {
    throw new Error("chooseByHash received no variants");
  }
  const index = Math.abs(seed) % variants.length;
  return variants[index];
}

function hashText(value) {
  let hash = 0;
  for (const ch of value) {
    hash = (hash * 33 + ch.charCodeAt(0)) | 0;
  }
  return hash;
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function describeContext(text) {
  if (hasAny(text, ["sea", "ocean", "beach", "shore", "harbor", "harbour", "coast"])) {
    return "water";
  }
  if (hasAny(text, ["lake", "river", "waterfall", "pool", "spring", "hot spring", "pond", "canal"])) {
    return "water";
  }
  if (hasAny(text, ["street", "market", "alley", "old street", "night market", "corridor", "path", "road", "promenade"])) {
    return "street";
  }
  if (hasAny(text, ["temple", "shrine", "palace", "tower", "gate", "stairs", "bridge", "courtyard", "pavilion", "hall", "terrace"])) {
    return "architecture";
  }
  if (hasAny(text, ["mountain", "cliff", "canyon", "forest", "meadow", "grassland", "valley", "snowfield", "plateau", "desert", "dune"])) {
    return "landscape";
  }
  if (hasAny(text, ["snow", "rain", "storm", "mist", "fog", "wind"])) {
    return "weather";
  }
  if (hasAny(text, ["wedding", "bride", "veil", "bouquet", "gown", "ceremony", "aisle"])) {
    return "bridal";
  }
  if (hasAny(text, ["sword", "battle", "armor", "banner", "war", "horse", "general", "fortress"])) {
    return "martial";
  }
  if (hasAny(text, ["throne", "crown", "queen", "court", "decree", "audience", "coronation", "command"])) {
    return "royal";
  }
  if (hasAny(text, ["scroll", "book", "letter", "study", "desk", "calligraphy", "map"])) {
    return "study";
  }
  if (hasAny(text, ["dance", "dancing", "pipa", "guqin", "music", "aria", "performance", "stage"])) {
    return "performance";
  }
  if (hasAny(text, ["wing", "angel", "feather", "halo"])) {
    return "winged";
  }
  if (hasAny(text, ["dragon", "phoenix", "wolf", "fox", "tiger", "horse", "bird", "beast", "creature", "qilin", "deer", "hound"])) {
    return "beast";
  }
  if (hasAny(text, ["altar", "rune", "magic circle", "ritual", "sigil", "portal", "spell", "summon", "grimoire"])) {
    return "ritual";
  }
  if (hasAny(text, ["underwater", "undersea", "coral", "jellyfish", "mermaid"])) {
    return "underwater";
  }
  if (hasAny(text, ["neon", "holographic", "cyber", "android", "spaceship", "galaxy", "command bridge"])) {
    return "tech";
  }
  return "general";
}

function resolveNarrativeGroup(category, entry) {
  return (
    CATEGORY_GROUPS[category.id] ||
    CATEGORY_GROUPS[category.tpl] ||
    MARK_GROUPS[entry.mk] ||
    "fantasy"
  );
}

function buildTravelProp(context, seed) {
  const variants = {
    water: [
      "standing at the water's edge with one hand lightly holding the skirt or coat, body angled toward the view, then turning the face naturally back toward camera",
      "walking slowly along the shoreline or lakeside path, wind moving hair and clothing naturally, expression calm and observant, face fully visible",
      "pausing beside the reflective water with relaxed shoulders, one hand resting near the railing or at the side, letting the scenery lead the body line",
    ],
    street: [
      "walking through the street as if arriving into the scene, one hand brushing a railing, lantern, or wall detail, then turning back toward camera",
      "pausing mid-step in the alley or market with relaxed shoulders and a natural traveler posture, face clear and open toward the viewer",
      "moving through the path with an unforced travel-photo rhythm, body slightly angled for motion, then looking back gently toward camera",
    ],
    architecture: [
      "standing on the stone steps or beside the carved railing, one hand resting naturally on the architecture, face turned clearly toward camera",
      "pausing near the gate, bridge, or courtyard edge with a calm sightseeing posture, body aligned to the location before turning the face back",
      "leaning lightly into the architectural line of the scene, posture upright but relaxed, using the environment instead of a stiff frontal pose",
    ],
    landscape: [
      "standing at the overlook with posture opened toward the landscape, coat or skirt moving in the wind, then turning the face back toward camera",
      "walking along the scenic edge with a calm travel-editorial stride, letting the environment guide the shoulders and body direction",
      "pausing at the viewpoint with one foot slightly forward, body grounded by the landscape, expression alert and naturally engaged with the scene",
    ],
    weather: [
      "adjusting the coat, shawl, or hair against the weather while keeping the face clear, body angle natural, and expression quietly responsive to the atmosphere",
      "holding posture steady inside the wind, rain, or snow moment, letting the weather move the clothing while the face stays open and readable",
      "walking through the weather with measured calm, one hand lightly stabilizing fabric or hair, avoiding rigid front-facing posing",
    ],
    general: [
      "behaving like a real traveler inside the location, with a natural pause, turn-back, or walking moment instead of a static standing pose",
      "using a calm travel-editorial body line with subtle motion, relaxed shoulders, and clear facial visibility rather than a stiff frontal stance",
      "taking in the environment first, then turning the face back toward camera with a believable sightseeing posture and balanced body angle",
    ],
  };

  return chooseByHash(seed, variants[context] || variants.general);
}

function buildTravelComp(context, seed) {
  const variants = {
    water: [
      "vertical environmental travel portrait with waterline or reflection visible, face clear, subject slightly off-center for scenic scale",
      "vertical three-quarter travel composition, face unobstructed, body readable against the shoreline or lake edge, layered depth behind the subject",
    ],
    street: [
      "vertical travel portrait with leading lines from the street or steps, face clear, body in gentle motion, background location still recognizable",
      "vertical environmental portrait, subject placed naturally within the alley or market depth, face readable, movement implied without distortion",
    ],
    architecture: [
      "vertical three-quarter portrait with the subject placed forward of the architecture, face large enough to preserve identity, columns, gate, or bridge adding depth",
      "vertical travel-editorial composition, face clear, body aligned to the architectural lines, landmark details readable behind the subject",
    ],
    landscape: [
      "vertical environmental portrait with full or three-quarter body readable, landscape scale visible behind, face unobstructed and stable",
      "vertical wide travel composition, subject anchored naturally within the scenery, clear facial visibility, atmospheric depth across foreground and background",
    ],
    weather: [
      "vertical atmospheric portrait with weather depth visible around the body, face still clear and brighter than the surroundings, travel-story composition",
      "vertical three-quarter travel composition, body readable through rain, snow, or mist, face unobstructed, environment carrying the mood",
    ],
    general: [
      "vertical travel portrait with clear face, natural body angle, and enough environmental space to keep the location recognizable",
      "vertical three-quarter environmental composition, face unobstructed, subject readable inside the scene rather than flattened against it",
    ],
  };

  return chooseByHash(seed, variants[context] || variants.general);
}

function buildWeddingProp(context, seed) {
  const variants = {
    water: [
      "standing at the water or shoreline with one hand lightly guiding the veil or skirt, bouquet held low, expression soft and fully visible",
      "walking slowly through the waterside scene, gathering the gown just enough for natural movement, then turning the face gently back toward camera",
    ],
    architecture: [
      "standing at the aisle entrance or on elegant steps with one hand lightly gathering the gown or veil, face turned softly toward camera",
      "pausing beside a doorway, columns, or grand railing as if preparing for the next wedding moment, shoulders relaxed and expression warm",
    ],
    landscape: [
      "walking through the garden or open landscape while lifting the skirt slightly, bouquet or hands kept low, face open and romantic",
      "pausing in the scenery with the gown train allowed to breathe behind the body, posture gentle and bridal rather than fashion-model stiff",
    ],
    bridal: [
      "adjusting the veil or gown with a calm pre-ceremony emotion, body softly angled, face clear and naturally connected to the movement",
      "holding bouquet or veil low while turning after hearing someone call, keeping the expression tender and the body line balanced",
    ],
    general: [
      "behaving like a bride inside a real wedding moment by preparing, entering, pausing in emotion, or gathering the dress naturally",
      "using a soft bridal action with veil, bouquet, or gown movement instead of a static standing pose, while keeping face and body harmonious",
    ],
  };

  return chooseByHash(seed, variants[context] || variants.general);
}

function buildWeddingComp(context, seed) {
  const variants = {
    water: [
      "vertical bridal portrait with clear face, readable gown silhouette, and waterside depth supporting the romantic mood",
      "vertical three-quarter wedding composition, face large enough to preserve identity, train and waterline visible, elegant scenic spacing behind",
    ],
    architecture: [
      "vertical bridal portrait with clear face, architecture framing the subject, and gown volume readable from shoulder to hem",
      "vertical three-quarter to full-body wedding composition, face unobstructed, aisle, doorway, or stairs reinforcing ceremony depth",
    ],
    landscape: [
      "vertical environmental bridal portrait, face clear, body and dress silhouette readable, flowers or landscape layering the background",
      "vertical romantic wedding composition, full or three-quarter body visible, train and scenery balanced without overpowering the face",
    ],
    general: [
      "vertical bridal portrait with clear face, readable gown silhouette, and soft foreground layering from flowers, veil, or fabric without obscuring the subject",
      "vertical three-quarter to full-body wedding composition, face stable and identity-preserving, dress details and depth clearly readable",
    ],
  };

  return chooseByHash(seed, variants[context] || variants.general);
}

function buildHanfuProp(context, seed) {
  const variants = {
    martial: [
      "one hand near the sword hilt, robe belt, or battle prop, body angled as if pausing before action, eyes turned back with story tension",
      "standing or stepping forward with a composed martial posture, sleeves or cloak moving naturally, face turned clearly toward camera",
      "holding a ready-but-controlled warrior stance that matches the role, keeping the shoulders grounded and the face unobstructed",
    ],
    royal: [
      "standing on ceremonial steps or beside a palace railing, sleeves falling naturally, one hand resting near the waist, decree, or throne line, composed authority in the gaze",
      "seated or standing with calm court posture, hands controlled and low, letting authority come from bearing rather than exaggerated gesture",
      "turning back inside the ceremonial space with noble restraint, body stable and front-face-friendly, expression carrying the status of the role",
    ],
    study: [
      "holding the scroll, letter, map, or writing tool low near the body, gaze focused then lifted toward camera, posture calm and intentional",
      "leaning into a quiet scholar or strategist moment, one hand near the desk or text, then turning the face back with measured concentration",
      "resting naturally beside the study object with composed shoulders and a thoughtful expression, avoiding a rigid frontal pose",
    ],
    performance: [
      "poised between dance or music movements, long sleeves or instrument clearly visible, face open and balanced toward camera",
      "mid-turn with controlled sleeve arc or instrument posture, body rhythm readable while the face remains stable and unobstructed",
      "holding the instrument or dance line with elegant tension, allowing the costume silhouette to move naturally around a clear face",
    ],
    architecture: [
      "walking through the corridor, gate, or courtyard with sleeves trailing, then pausing to look back, expression carrying the scene emotion",
      "standing beside the bridge, railing, or stone steps with one hand lightly touching the architecture, face clearly readable",
      "using the architectural line to guide the shoulders and hips into a natural classical pose instead of a stiff frontal stance",
    ],
    water: [
      "standing beside the pond, stream, or boat edge with one hand lightly touching the sleeve or railing, then turning back gently toward camera",
      "pausing at the waterline in a lyrical classical posture, face open, body soft, and sleeves falling naturally with the scene mood",
      "leaning slightly toward the reflective water while keeping the head and face aligned naturally to the body, expression calm and poetic",
    ],
    landscape: [
      "standing in the wider classical landscape with one foot slightly forward, sleeves and hair moved by wind, face turned back with grounded calm",
      "walking through the scene with measured story intent, using a traveler, heroine, or noblewoman body line instead of a static pose",
      "pausing at the overlook or path edge with posture guided by the terrain, body stable and face clearly visible",
    ],
    general: [
      "choosing a culturally and role-appropriate classical action such as turning after footsteps, resting by a railing, carrying an object with purpose, or pausing mid-journey",
      "using a calm story-driven hanfu action that fits the character identity and scene atmosphere while keeping the face-body relationship natural",
      "avoiding flat frontal stiffness by giving the body a gentle three-quarter angle and the expression a clear narrative reason",
    ],
  };

  return chooseByHash(seed, variants[context] || variants.general);
}

function buildHanfuComp(context, seed) {
  const variants = {
    martial: [
      "vertical full-body cinematic historical portrait, robe or armor silhouette clearly visible, environment scale behind, face still sharp and readable",
      "vertical dramatic three-quarter to full-body portrait, face unobstructed, action tension visible through the body line, historical setting readable behind",
    ],
    royal: [
      "vertical regal three-quarter portrait, face clear, palace depth and columns behind, costume layers readable from shoulder to hem",
      "vertical courtly composition with calm central balance, face unobstructed, ceremonial space reinforcing the character's status",
    ],
    study: [
      "vertical half-body to three-quarter portrait, face clear, desk or interior elements layered to the side, elegant depth without cluttering the subject",
      "vertical intimate classical portrait, face readable, scholarly objects supporting the narrative while the body remains naturally posed",
    ],
    performance: [
      "vertical dynamic full-body portrait, movement arc readable, face stable, fabric or instrument supporting the rhythm of the scene",
      "vertical dance or music composition, body line elegant and clear, face unobstructed, costume motion readable without distortion",
    ],
    architecture: [
      "vertical classical portrait with clear face, readable sleeve and hair ornament details, and architectural depth guiding the eye behind the body",
      "vertical three-quarter hanfu composition, subject forward of corridor, bridge, or gate lines, face stable and costume silhouette legible",
    ],
    water: [
      "vertical lyrical three-quarter portrait, face unobstructed, sleeves and environmental layers framing the body, calm poetic spacing around the water scene",
      "vertical classical environmental portrait, face clear, body readable at the water edge, reflections or mist supporting the mood",
    ],
    landscape: [
      "vertical full-body or three-quarter historical portrait, subject grounded in the landscape, face readable, costume layers visible against the wider setting",
      "vertical scenic classical composition, face clear, body angled naturally into the terrain, environmental scale supporting the story",
    ],
    general: [
      "vertical full-body or three-quarter hanfu composition, costume layers and silhouette clearly visible, traditional atmosphere integrated without covering the face",
      "vertical classical portrait with clear face, elegant body angle, and enough environmental depth to support the character's story",
    ],
  };

  return chooseByHash(seed, variants[context] || variants.general);
}

function buildQueenProp(context, seed) {
  const variants = {
    royal: [
      "seated on the throne or standing before it with chin level and shoulders stable, one hand on the armrest, scepter, decree, or robe line, calm command in the eyes",
      "holding a ruler's posture at the top of the ceremonial steps, body still and authoritative, expression steady rather than overacted",
      "receiving an audience, decree, or coronation moment with controlled hands and a clear forward-facing identity-preserving pose",
    ],
    study: [
      "standing or seated at the strategy table reviewing a decree or map, one hand placed decisively, gaze lifted toward camera with ruling authority",
      "leaning over the desk or council surface just enough to show active governance, then returning the face clearly toward camera",
      "holding a document, seal, or planning object low in frame while the upper body stays poised and unmistakably sovereign",
    ],
    martial: [
      "standing at the edge of the platform or fortress steps, cape moving in the wind, posture steady as if issuing a command to the realm below",
      "rising into a battle-sovereign stance with the weapon, sigil, or standard controlled at the side, face fully visible and calm",
      "using a command posture that feels like ruling through action rather than flailing, with strong grounded shoulders and readable facial identity",
    ],
    architecture: [
      "standing in the ceremonial space with calm authority, one hand resting lightly on a throne arm, railing, or staff, face clearly readable",
      "descending or pausing on the steps with a ruler's measured pace, body stable and symmetrical enough to preserve face-body harmony",
      "occupying the architectural axis of the scene like a sovereign entering court, using stillness and bearing instead of exaggerated posing",
    ],
    landscape: [
      "holding court against the open landscape with a commanding travel-throne posture, cape or train moved by wind while the face remains open and centered",
      "standing at the overlook, cliff, or battlefield edge with calm dominion, body fully committed to the scene and the face clearly turned toward camera",
      "using the larger world as a ruled domain, posture balanced and queenly, with authority carried through bearing and eye line",
    ],
    general: [
      "choosing a ruler's action such as issuing a command, receiving an audience, reviewing a decree, or rising from the throne, while keeping body control and facial clarity",
      "letting the role logic of sovereign, goddess, or dark queen drive the pose instead of relying on random gesture, with stable shoulders and natural face alignment",
      "using narrative authority rather than theatrical distortion, so the face remains unmistakably connected to the body and role",
    ],
  };

  return chooseByHash(seed, variants[context] || variants.general);
}

function buildQueenComp(context, seed) {
  const variants = {
    royal: [
      "vertical throne-room or coronation composition, subject elevated or centered, steps, columns, or court depth reinforcing power, face unobstructed",
      "vertical regal portrait with central axis or subtle low angle, face clear, authority symbols readable, costume silhouette strong and stable",
    ],
    study: [
      "vertical governance portrait, face clear, desk, maps, or decree objects layered low in frame, authority conveyed through composition rather than clutter",
      "vertical three-quarter queenly composition, face large and stable, strategic environment readable behind or beside the subject",
    ],
    martial: [
      "vertical heroic queen portrait, full or three-quarter body readable, environment scale behind, face stable against dramatic lighting and motion",
      "vertical battle-sovereign composition, subtle low angle, strong silhouette, face unobstructed while banners, weapon, or domain reinforce command",
    ],
    architecture: [
      "vertical regal architectural portrait, face clear, body aligned to the ceremonial lines of the space, throne or steps reinforcing authority",
      "vertical queenly composition with stable symmetry, full costume readability, and enough depth to feel like a ruling chamber rather than a flat backdrop",
    ],
    landscape: [
      "vertical environmental power portrait, subject clearly readable against the larger ruled world, face unobstructed, cape or train supporting scale",
      "vertical wide queen composition, body grounded in the landscape, face stable and bright enough to hold identity against the dramatic setting",
    ],
    general: [
      "vertical regal portrait with throne, steps, or architectural axis reinforcing authority, face clearly readable, body posed in a stable commanding silhouette",
      "vertical queenly composition with subtle low angle or central axis, strong facial clarity, costume and power symbols fully legible without overcomplicated action",
    ],
  };

  return chooseByHash(seed, variants[context] || variants.general);
}

function buildFantasyProp(context, seed) {
  const variants = {
    beast: [
      "standing beside the creature with one hand lightly touching its mane, scales, feathers, or reins, letting the bond read clearly while the face remains unobstructed",
      "walking or pausing in step with the magical beast, body angled naturally toward the companion before turning the face back toward camera",
      "holding a calm summoner or beast-tamer stance that prioritizes eye line and interaction over exaggerated distortion, face fully visible",
    ],
    underwater: [
      "floating or standing within the water scene with one hand reaching toward a glowing current, flower, or creature, body relaxed and face clearly turned toward camera",
      "pausing in the underwater atmosphere with hair and fabric drifting naturally, shoulders stable, and the face kept large and readable inside the fantasy motion",
      "using a gentle aquatic action that matches the world logic, with one hand guiding the movement and the body remaining coherent with the head angle",
    ],
    water: [
      "standing or kneeling near the enchanted water with one hand reaching toward the surface, lotus, or reflected light, face fully visible and calm",
      "leaning into the magical water scene with controlled posture, body softened by the environment but face still open and readable",
      "touching the water, mist, or floating light with believable intent, allowing the environment to animate the pose without breaking body coherence",
    ],
    ritual: [
      "standing at the ritual center with one hand controlling the magic phenomenon, shoulders grounded, face fully visible above the effects",
      "holding a restrained summoning posture, letting runes, chains, sigils, or light respond around the body while the face remains the anchor",
      "using a deliberate spellcasting action with stable torso alignment, controlled hands, and clear facial identity instead of chaotic gesturing",
    ],
    winged: [
      "standing with wings partially opened behind the body, one hand resting near the chest, relic, or blade, expression calm and supernatural",
      "holding a celestial or fallen-angel pose with the wings framing the silhouette instead of covering the face, body angle kept natural and readable",
      "stepping or pausing under the wing spread with quiet power, keeping the head, neck, and shoulders aligned so the identity stays stable",
    ],
    tech: [
      "standing at the holographic console, neon street edge, or command bridge with one hand interacting with projected light while the body angle stays natural and the face clear",
      "using an in-world sci-fi action such as reviewing data, touching a visor, or issuing a digital command, with the face still fully readable",
      "turning within the futuristic environment as if reacting to a signal or interface, keeping the pose believable and identity-safe rather than over-stylized",
    ],
    martial: [
      "holding the signature weapon or magical relic low or at the side, body angled in-character, then turning the face clearly back toward camera",
      "stepping through the fantasy battlefield or shrine space with controlled purpose, using the weapon, armor, or aura as support instead of overacting",
      "taking a ready-but-readable heroic stance, power conveyed through intent and silhouette while the face stays unobstructed",
    ],
    architecture: [
      "walking through the shrine, ruins, or gate with a relic, lantern, or magical object held low, then pausing to look back toward camera",
      "standing within the fantasy structure using one hand to touch the environment or nearby artifact, body stable and face clearly visible",
      "occupying the magical architecture with calm narrative intent, allowing the setting to shape the pose instead of forcing a generic gesture",
    ],
    general: [
      "choosing a fantasy action that fits the creature, magic system, or world logic, such as summoning, listening to a spirit, guiding light, or reacting to a supernatural presence",
      "acting like the subject truly belongs in the magical world, with believable intent and a stable face-body relationship instead of a mannequin pose",
      "using a magical but readable action with story logic, while keeping the head, neck, and torso naturally compatible for identity stability",
    ],
  };

  return chooseByHash(seed, variants[context] || variants.general);
}

function buildFantasyComp(context, seed) {
  const variants = {
    beast: [
      "vertical bonded-hero portrait, subject and creature both readable, face unobstructed, interaction placed near eye level or shoulder line",
      "vertical fantasy composition with the beast supporting the story rather than hiding the subject, face clear, body and companion both legible",
    ],
    underwater: [
      "vertical underwater fantasy portrait, face clear, body readable through drifting fabric or hair, magical sea depth layered around the subject",
      "vertical aquatic composition with clear facial identity, readable silhouette, and surrounding water life or glow supporting rather than swallowing the subject",
    ],
    water: [
      "vertical fantasy portrait with water depth or reflection visible, face clear, magical environment layered around the body without overpowering identity",
      "vertical three-quarter magical-water composition, face unobstructed, body readable, atmospheric effects kept secondary to the subject",
    ],
    ritual: [
      "vertical full-body dark or mystical fantasy composition, magic circle, altar, or sigils framing the subject, face stable and brighter than the surrounding effects",
      "vertical ritual portrait with clear face, controlled effect placement, and enough architectural or magical depth to support the action",
    ],
    winged: [
      "vertical celestial or fallen-angel portrait, wings framing the silhouette without covering the face, strong upper-body readability and stable identity",
      "vertical winged fantasy composition, face clear, body and wing shape legible together, atmosphere supporting rather than obscuring the subject",
    ],
    tech: [
      "vertical sci-fi portrait with neon depth and projected interfaces layered around the subject, face clear, body language controlled and readable",
      "vertical futuristic character composition, face unobstructed, signature costume and tech elements visible, environment depth supporting the role",
    ],
    martial: [
      "vertical character-action portrait, face stable, weapon and silhouette readable, fantasy environment adding scale without overpowering the identity",
      "vertical heroic fantasy composition, three-quarter to full-body readable, face unobstructed, dramatic world-building positioned behind the subject",
    ],
    architecture: [
      "vertical fantasy portrait with clear face, readable subject silhouette, and layered magical architecture supporting the action without overwhelming the identity",
      "vertical environmental fantasy composition, face unobstructed, body naturally placed within shrine, ruins, or portal depth",
    ],
    general: [
      "vertical three-quarter or full-body fantasy composition, face unobstructed, magic effects orbiting or responding to the subject rather than replacing the subject",
      "vertical fantasy portrait with clear face, readable magical silhouette, and layered supernatural environment supporting the story without overpowering identity",
    ],
  };

  return chooseByHash(seed, variants[context] || variants.general);
}

function generateFields(group, context, seed) {
  switch (group) {
    case "travel":
    case "modern":
      return {
        prop: buildTravelProp(context, seed),
        comp: buildTravelComp(context, seed),
      };
    case "wedding":
      return {
        prop: buildWeddingProp(context, seed),
        comp: buildWeddingComp(context, seed),
      };
    case "hanfu":
      return {
        prop: buildHanfuProp(context, seed),
        comp: buildHanfuComp(context, seed),
      };
    case "queen":
      return {
        prop: buildQueenProp(context, seed),
        comp: buildQueenComp(context, seed),
      };
    default:
      return {
        prop: buildFantasyProp(context, seed),
        comp: buildFantasyComp(context, seed),
      };
  }
}

function reorderObject(source, preferredOrder) {
  const ordered = {};
  for (const key of preferredOrder) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      ordered[key] = source[key];
    }
  }
  for (const [key, value] of Object.entries(source)) {
    if (!Object.prototype.hasOwnProperty.call(ordered, key)) {
      ordered[key] = value;
    }
  }
  return ordered;
}

function enrichCats(cats) {
  let updatedEntries = 0;
  let updatedProps = 0;
  let updatedComps = 0;

  const nextCats = cats.map((category, categoryIndex) => {
    const nextEntries = category.entries.map((entry, entryIndex) => {
      const textForContext = [
        category.id,
        category.name,
        category.tpl || "",
        entry.id,
        entry.name || "",
        entry.sub || "",
        entry.scene || "",
        entry.outfit || "",
        entry.prop || "",
        entry.mk || "",
      ]
        .join(" ")
        .toLowerCase();

      const group = resolveNarrativeGroup(category, entry);
      const context = describeContext(textForContext);
      const seed = hashText(`${category.id}:${entry.id}:${categoryIndex}:${entryIndex}`);
      const generated = generateFields(group, context, seed);

      let changed = false;
      const nextEntry = { ...entry };

      if (!nextEntry.prop) {
        nextEntry.prop = generated.prop;
        updatedProps += 1;
        changed = true;
      }

      if (!nextEntry.comp) {
        nextEntry.comp = generated.comp;
        updatedComps += 1;
        changed = true;
      }

      if (changed) {
        updatedEntries += 1;
      }

      return reorderObject(nextEntry, ENTRY_KEY_ORDER);
    });

    const nextCategory = { ...category, entries: nextEntries };
    return reorderObject(nextCategory, CATEGORY_KEY_ORDER);
  });

  return {
    cats: nextCats,
    stats: {
      updatedEntries,
      updatedProps,
      updatedComps,
    },
  };
}

function main() {
  const originalText = fs.readFileSync(INDEX_PATH, "utf8");
  const block = extractCatsBlock(originalText);
  const cats = parseCats(block.arrayText);
  const { cats: nextCats, stats } = enrichCats(cats);
  const nextArrayText = JSON.stringify(nextCats, null, 2);
  const nextText =
    originalText.slice(0, block.arrayStart) +
    nextArrayText +
    originalText.slice(block.arrayEnd);

  fs.writeFileSync(INDEX_PATH, nextText, "utf8");
  console.log(
    JSON.stringify(
      {
        file: "index.html",
        categories: nextCats.length,
        ...stats,
      },
      null,
      2,
    ),
  );
}

main();
