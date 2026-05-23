// ── 1500 Entry Generator for CATS (15 categories × 100 entries) ──
// Each category: 10 scene settings × 10 action variants = 100 entries
// Output: scripts/cats_1500_output.json

import { writeFileSync } from 'fs';

const pad = (n) => String(n).padStart(2, '0');
const catNum = (idx) => pad(idx + 1);
const entId = (catIdx, entIdx) => `t${catNum(catIdx)}_${pad(entIdx + 1)}`;

// ─── Category Definitions ───────────────────────────────────────────────────
const CATEGORY_DEFS = [

  // ── theme_01: 魅魔之吻 · 煉獄誘惑 ──────────────────────────
  {
    id: 'theme_01', name: '魅魔之吻 · 煉獄誘惑', icon: '💋',
    tpl: 'succubus_demon', mk: 'succubus_alluring',
    settings: [
      { env: 'infernal palace with obsidian columns and crimson torch fire, supernatural dark elegance, demon court grandeur', outfit: 'elegant black corset gown with dark gemstone details, demon wing motif, sinister luxury', icon: '🔥', chBase: '地獄宮殿' },
      { env: 'dark enchanted rose garden at midnight, black roses with crimson petals, supernatural beauty trap', outfit: 'black rose gown with thorn and petal motif, dark luxury, dangerous beauty', icon: '🌹', chBase: '黑玫瑰園' },
      { env: 'dream realm at midnight, violet and black dream world atmosphere, floating dark flower petals', outfit: 'dream succubus flowing dress in dark violet and black, translucent dream-magic overlay', icon: '🌙', chBase: '夢境幻域' },
      { env: 'supernatural deep sea abyss, bioluminescent dark sea creatures, underwater demon domain', outfit: 'deep sea succubus dress in dark teal and black, oceanic demon accessories, pearl and shadow detail', icon: '🌊', chBase: '深海魔域' },
      { env: 'volcanic dark temple with lava flows and obsidian altars, fire and shadow supernatural realm', outfit: 'fire-element dark gown in crimson and black, flame motif accessories, volcanic dark beauty', icon: '🌋', chBase: '火焰聖殿' },
      { env: 'endless dark mirror hall with fractured reflections, supernatural vanity and infinite self-image', outfit: 'sleek dark mirror-finish gown, obsidian accessories, cold supernatural perfection', icon: '🪞', chBase: '暗鏡長廊' },
      { env: 'blood moon field under crimson moonlight, supernatural red-lit open landscape, dark romance', outfit: 'flowing deep crimson gown with blood moon motif, dark supernatural feminine power', icon: '🌑', chBase: '血月荒野' },
      { env: 'ancient dark forest clearing with supernatural fog, towering black trees, spirit realm boundary', outfit: 'dark forest succubus gown with leaf and shadow motif, supernatural nature dark beauty', icon: '🌲', chBase: '幽暗森林' },
      { env: 'high obsidian citadel terrace overlooking void darkness, cold wind at the edge of the demon realm', outfit: 'structured dark power gown with citadel motif, authority and cold supernatural elegance', icon: '🏰', chBase: '黑曜高台' },
      { env: 'dark crystal cavern with bioluminescent purple crystals, supernatural underground beauty', outfit: 'crystal succubus gown with crystalline detail, purple and black supernatural glamour', icon: '💜', chBase: '暗晶洞窟' },
    ],
    variants: [
      { sfx: '·降臨', sub: '女王降臨', prop: 'arriving at the central axis of the scene with supernatural sovereign composure, face toward camera with cold commanding presence', comp: 'full body, architectural axis reinforcing authority, face clearly readable' },
      { sfx: '·凝視', sub: '冷眼凝視', prop: 'standing still with absolute composure, arms lightly at sides, direct gaze toward camera with supernatural knowing', comp: 'medium to full body, environment as atmospheric backdrop, face dominant and clear' },
      { sfx: '·召喚', sub: '黑暗召喚', prop: 'one hand slightly raised in a summoning gesture below face level, face turned toward camera, supernatural authority radiating from stillness', comp: 'three-quarter body, dark energy particles framing the gesture, face clearly lit' },
      { sfx: '·王座', sub: '御座之威', prop: 'seated on throne or architectural seat with one hand resting on the arm, presiding with cold authority, face clearly directed toward camera', comp: 'full body or three-quarter with throne visible, regal commanding silhouette' },
      { sfx: '·巡視', sub: '俯瞰巡視', prop: 'standing at an elevated vantage point, head slightly tilted to survey the domain, face angled toward camera while body is positioned for authority', comp: 'three-quarter body with elevated platform, commanding overview composition' },
      { sfx: '·魅惑', sub: '妖媚誘惑', prop: 'standing with subtle forward lean, one hand lightly touching a nearby dark element, face toward camera with cold seductive awareness', comp: 'medium portrait, dark atmospheric element as visual frame, face prominent' },
      { sfx: '·沉思', sub: '深淵沉思', prop: 'hands clasped lightly, body angled away while face turns back toward camera in a quiet contemplative pose', comp: 'three-quarter body, environment depth behind, face and expression clearly readable' },
      { sfx: '·行進', sub: '威儀步行', prop: 'walking slowly forward with deliberate authority, coat or skirt in motion, face angled toward camera as if acknowledging the viewer in passing', comp: 'full body, motion suggested by fabric, face clearly lit and readable' },
      { sfx: '·轉身', sub: '優雅轉身', prop: 'three-quarter rear angle with face turning back toward camera over shoulder, one hand resting near the body, elegant and unhurried', comp: 'three-quarter body in elegant rotation, face clearly readable as focal point' },
      { sfx: '·靜立', sub: '威嚴靜立', prop: 'standing perfectly still at the composition center, both arms relaxed at sides, full body visible, face directly toward camera with supernatural composure', comp: 'full body centered, environment as atmospheric frame, face dominant and clear' },
    ],
  },

  // ── theme_02: 魔王降臨 · 深淵王座 ──────────────────────────
  {
    id: 'theme_02', name: '魔王降臨 · 深淵王座', icon: '👑',
    tpl: 'succubus_demon', mk: 'demon_lord',
    settings: [
      { env: 'obsidian throne hall with void-black pillars and infernal chains, demon empire sovereign court', outfit: 'dark imperial battle gown with void-metal armor accents, crown of dark iron and obsidian gems', icon: '🖤', chBase: '黑曜王座' },
      { env: 'dark fortress high tower with storm clouds surrounding, demon sovereign at the summit of power', outfit: 'dark military commander coat with rank insignia, storm-dark color palette, authoritative silhouette', icon: '🏯', chBase: '暗夜要塞' },
      { env: 'abyss bridge over endless void darkness, stone walkway at the edge of the demon realm', outfit: 'flowing dark sovereign robe with void-edge trim, billowing in supernatural wind at the abyss edge', icon: '🌑', chBase: '虛空橋道' },
      { env: 'underground lava temple with magma rivers and fire runes, primordial demon power location', outfit: 'fire-sovereign armor gown in dark crimson and gold-black, lava and flame motif accessories', icon: '🌋', chBase: '熔岩神殿' },
      { env: 'shadow war room with tactical dark crystal maps and black command table, demon empire strategy', outfit: 'military tactical coat over fitted dark armor, rank insignia, tactical command belt', icon: '⚔️', chBase: '暗域戰廳' },
      { env: 'colosseum of dark bones and void stone, trial grounds of the demon sovereign, ring of power', outfit: 'dark combat gown with bone motif accents, champion of the void aesthetic, dark victory', icon: '💀', chBase: '骸骨競技場' },
      { env: 'storm summit above the dark realm, lightning and cloud at the peak of the demon mountain', outfit: 'storm-sovereign dark long coat, lightning element accents, atmospheric dark power clothing', icon: '⛈️', chBase: '風暴山巔' },
      { env: 'void sanctum with floating void stones and dark energy pillars, sacred void power center', outfit: 'void-sovereign ritual robe in deep void-black, dark sigil embroidery, ceremonial void accessories', icon: '🌀', chBase: '虛空聖所' },
      { env: 'death forest fortress with dark ancient trees and mist, demon realm woodland stronghold', outfit: 'dark forest sovereign coat with bark and shadow motif, nature of darkness in elegant form', icon: '🌲', chBase: '死林要塞' },
      { env: 'phantom deep sea palace with dark coral architecture and ocean void depths', outfit: 'dark sea sovereign gown in deep charcoal with void-ocean trim, deep water power accessories', icon: '🌊', chBase: '幽海宮殿' },
    ],
    variants: [
      { sfx: '·凱旋', sub: '威嚴凱旋', prop: 'arriving at the center of the hall with absolute authority, body forward with sovereign composure, face toward camera announcing presence', comp: 'full body with hall axis behind, crown or power symbol visible, face dominant' },
      { sfx: '·裁決', sub: '冷靜裁決', prop: 'standing at the head of the space with one hand slightly raised in judgment, body still, face toward camera with absolute cold authority', comp: 'three-quarter body, commanding position, face clear and authoritative' },
      { sfx: '·覽境', sub: '俯瞰疆土', prop: 'standing at the highest point of the setting with arms slightly at sides, surveying the domain, face angled toward camera with sovereign composure', comp: 'full body at elevated position, domain visible below or behind, face clearly lit' },
      { sfx: '·議事', sub: '深謀議事', prop: 'leaning slightly over a map or command table with one hand resting on the surface, face raised toward camera in mid-deliberation', comp: 'medium shot, tactical surface as foreground element, face clearly readable' },
      { sfx: '·御駕', sub: '帝者御駕', prop: 'seated on the throne with both hands resting on the arms, presiding over the space with cold authority, face directly toward camera', comp: 'full body or three-quarter, throne visible and reinforcing authority, face dominant' },
      { sfx: '·行軍', sub: '威儀行軍', prop: 'walking forward with deliberate authority through the setting, coat or robe in motion, face angled toward camera as the most powerful presence in the frame', comp: 'full body in motion, setting providing atmospheric depth, face clearly lit' },
      { sfx: '·靜默', sub: '深淵靜默', prop: 'standing perfectly still in the center of the setting, hands clasped or at sides, face toward camera in quiet absolute power', comp: 'centered full body, dark environment as frame, face as the focal point of power' },
      { sfx: '·望遠', sub: '遠眺邊疆', prop: 'standing at a vantage point looking toward the horizon, body at three-quarter angle, face turning back toward camera over shoulder', comp: 'three-quarter body, vast dark landscape behind, face clearly readable' },
      { sfx: '·召見', sub: '召見臣屬', prop: 'standing at an elevated position with one hand extended slightly in a summoning gesture, body composed, face toward camera with cold authority', comp: 'full body at elevated position, gesture visible, face dominant and clearly lit' },
      { sfx: '·退朝', sub: '散朝離去', prop: 'turning to depart from the central position, coat in motion, face turned back toward camera in a final commanding glance', comp: 'three-quarter body in elegant motion, setting reinforcing authority, face clearly visible' },
    ],
  },

  // ── theme_03: 墮天使 · 黑色神諭 ──────────────────────────
  {
    id: 'theme_03', name: '墮天使 · 黑色神諭', icon: '🖤',
    tpl: 'fallen_angel', mk: 'fallen_angel',
    settings: [
      { env: 'ruined heaven gateway with crumbling divine white stone, dark feathers falling through broken pillars', outfit: 'torn celestial robes in white and void-black, cracked dark halo, asymmetric wings one intact one shattered', icon: '🕊️', chBase: '天門廢墟' },
      { env: 'storm cloud summit above divine and void realms, lightning fracturing the boundary between heaven and fall', outfit: 'torn divine armor in storm-silver and shadow, wings caught in storm wind, fallen divine crown', icon: '⛈️', chBase: '風暴雲巔' },
      { env: 'dark cathedral ruins with moonlight through broken stained glass, holy and dark elements in decay', outfit: 'dark fallen angel gown with cathedral window motif, holy silver and shadow-black combination', icon: '⛪', chBase: '廢棄聖堂' },
      { env: 'shattered halo altar in the void between realms, divine light fracturing against void darkness', outfit: 'divine white and void-black fallen robes, cracked halo as crown, fractured light accessories', icon: '💫', chBase: '破碎光壇' },
      { env: 'corrupted celestial garden where divine flowers turn dark, beauty in divine decay', outfit: 'corrupted divine gown where white fades to black at edges, dark flower crown, fallen grace', icon: '🌑', chBase: '腐化天苑' },
      { env: 'twilight void at the edge of existence, neither heaven nor hell, suspended between realms', outfit: 'void-edge fallen robes in twilight grey and shadow, wings suspended in the void, lost divine', icon: '🌅', chBase: '黃昏虛境' },
      { env: 'cracked marble hall of divine judgement with fracture lines of dark energy running through it', outfit: 'fallen divine armor with dark fracture-line accents, once-holy symbol now corrupted, dark grace', icon: '🏛️', chBase: '裂紋神殿' },
      { env: 'field of fallen dark feathers under starless sky, place where fallen angels land after descent', outfit: 'elegant dark feather gown made from fallen celestial feathers, divine-turned-dark aesthetic', icon: '🪶', chBase: '黑羽墜原' },
      { env: 'ancient void bridge at the boundary between realms, ancient stones with divine and dark markings', outfit: 'fallen traveler dark coat with divine remnant trim, wings folded in contemplative stillness', icon: '🌉', chBase: '邊界橋道' },
      { env: 'rain-soaked battlefield where divine and dark forces once met, memorial ground of the great fall', outfit: 'battle-worn fallen angel armor, dark and divine elements weathered by conflict, rain-wet wings', icon: '🌧️', chBase: '天戰遺址' },
    ],
    variants: [
      { sfx: '·墮落', sub: '神裂之墮', prop: 'standing at the center of the scene with wings partially spread, face toward camera with resigned but composed fallen dignity', comp: 'full body, wings framing the composition, face clearly readable with fallen grace' },
      { sfx: '·沉思', sub: '失落沉思', prop: 'arms loosely at sides or one hand touching a wing, face turned slightly away then back toward camera in deep contemplation', comp: 'three-quarter body, atmospheric setting behind, face in contemplative emotion' },
      { sfx: '·仰望', sub: '仰望殘天', prop: 'head tilted slightly upward as if looking toward where heaven once was, then turning face toward camera with quiet melancholy', comp: 'three-quarter upward composition, sky or void above, face clearly lit from above' },
      { sfx: '·佇立', sub: '寂寞佇立', prop: 'standing alone in the setting, wings folded behind, hands at sides, face directly toward camera with solitary grace', comp: 'full body centered, environment as atmospheric frame, fallen angel solitude visible' },
      { sfx: '·展翼', sub: '黑翼展開', prop: 'wings spread wide behind the body while standing with composed authority, face toward camera', comp: 'full body with wings as dramatic frame, face clearly readable at center' },
      { sfx: '·倚望', sub: '憑欄遙望', prop: 'leaning against a stone or pillar, arms lightly crossed, one wing partially visible, face toward camera with fallen composure', comp: 'medium three-quarter body, architectural support as narrative element' },
      { sfx: '·凝視', sub: '神明凝視', prop: 'direct frontal stance with both hands at sides, wings slightly open, unwavering gaze toward camera', comp: 'centered portrait, wings partially open as visual frame, face dominant' },
      { sfx: '·離去', sub: '轉身遠離', prop: 'three-quarter rear angle with face turning back toward camera, one wing visible behind, departing with fallen dignity', comp: 'three-quarter body in departure, setting providing depth, face clearly visible' },
      { sfx: '·坐息', sub: '廢墟坐息', prop: 'seated on a ruined stone or step with wings folded, hands in lap, face toward camera in quiet fallen solitude', comp: 'seated portrait with ruins as context, face clearly readable, wings visible' },
      { sfx: '·迎光', sub: '碎光沐浴', prop: 'standing in fractured divine light with arms slightly open, head tilted slightly upward then toward camera, receiving the last light', comp: 'full body, light fracturing around the figure, face clearly illuminated' },
    ],
  },

  // ── theme_04: 長相思旅拍 · 大荒情緒 ──────────────────────────
  {
    id: 'theme_04', name: '長相思旅拍 · 大荒情緒', icon: '🌿',
    tpl: 'china_drama', mk: 'outdoor_glow',
    settings: [
      { env: 'ancient silk road mountain path with distant peaks and golden afternoon light, vast natural landscape', outfit: 'elegant drama travel hanfu or modern-classical outfit in earthy warm tones, travel-appropriate beauty', icon: '⛰️', chBase: '古道山行' },
      { env: 'misty mountain waterfall valley with moss-covered rocks and cascading water, peaceful natural depth', outfit: 'flowing classical fabric in soft grey-green or white, natural material beauty in mountain setting', icon: '💧', chBase: '瀑布山谷' },
      { env: 'ancient lakeside pavilion with misty water and distant mountains, classical Chinese natural beauty', outfit: 'classical drama outfit in lake-blue or misty white, pavilion-appropriate elegant styling', icon: '🏯', chBase: '湖畔亭台' },
      { env: 'ancient bamboo grove pathway in golden afternoon light, peaceful natural corridor', outfit: 'fresh classical green or natural linen outfit, bamboo grove natural harmony', icon: '🎋', chBase: '竹林小道' },
      { env: 'coastal cliff with crashing sea below and sky above, dramatic natural landscape', outfit: 'dramatic flowing fabric in deep ocean blue or storm grey, cliff wind in fabric and hair', icon: '🌊', chBase: '海崖之巔' },
      { env: 'golden desert dune field at sunset with vast sky and sand ridges, epic natural scale', outfit: 'warm desert-toned classical or travel outfit, sand and gold palette, desert wind elegance', icon: '🏜️', chBase: '大漠落日' },
      { env: 'cherry blossom avenue with full bloom pink petals falling in soft spring light', outfit: 'soft pink or white classical-romantic outfit, cherry blossom spring elegance', icon: '🌸', chBase: '櫻花長廊' },
      { env: 'ancient maple forest in autumn deep red and orange, warm autumn natural beauty', outfit: 'warm autumn-palette classical outfit in red, rust, or gold, autumn forest natural harmony', icon: '🍁', chBase: '楓林秋色' },
      { env: 'open grassland with wildflowers under wide sky, freedom and natural scale', outfit: 'loose natural-tone travel outfit in grassland earth colors, open-field natural beauty', icon: '🌾', chBase: '草原野地' },
      { env: 'ancient stone arch bridge over clear mountain stream in dappled forest light', outfit: 'classic soft drama outfit in natural river tones, bridge setting classical romance', icon: '🌉', chBase: '古橋溪邊' },
    ],
    variants: [
      { sfx: '·佇立', sub: '遠眺深情', prop: 'standing at the scenic point looking into the distance with natural contemplative stillness, face angled toward camera', comp: 'full body with landscape behind, natural posture, face clearly readable' },
      { sfx: '·回眸', sub: '步行回望', prop: 'walking forward in the setting, then naturally glancing back toward camera over shoulder with genuine travel emotion', comp: 'three-quarter body in natural walking motion, setting as travel narrative context' },
      { sfx: '·靜思', sub: '片刻靜思', prop: 'sitting or pausing naturally in the setting, one hand lightly touching the environment, face turned toward camera in genuine moment', comp: 'medium to three-quarter portrait, environment providing natural atmospheric depth' },
      { sfx: '·行走', sub: '自然行走', prop: 'walking through the setting with natural relaxed movement, hair and fabric in gentle motion, face toward camera as if caught mid-journey', comp: 'full body in natural walking, path or setting providing movement narrative' },
      { sfx: '·憑欄', sub: '依欄凝望', prop: 'leaning against a natural or architectural support, arms relaxed, looking into the distance then turning to camera with travel emotion', comp: 'three-quarter body with support element, natural background depth, face clearly lit' },
      { sfx: '·展臂', sub: '自由展臂', prop: 'arms slightly extended at sides or one raised in natural freedom gesture, face toward camera with genuine travel joy', comp: 'full body with dramatic landscape framing the expansive gesture' },
      { sfx: '·拾影', sub: '留住瞬間', prop: 'crouching or reaching toward a natural element with genuine curiosity, face toward camera in candid natural moment', comp: 'medium shot with natural detail in foreground, genuine candid emotion' },
      { sfx: '·坐景', sub: '山水寫意', prop: 'seated naturally on a rock or step within the landscape, relaxed posture, face toward camera with natural beauty', comp: 'seated three-quarter body, landscape providing natural depth behind' },
      { sfx: '·迎風', sub: '迎風而立', prop: 'standing into the natural wind with hair and fabric in motion, face turned slightly toward camera with natural emotion', comp: 'full body with wind motion visible, dramatic natural setting as frame' },
      { sfx: '·尋跡', sub: '慢行尋路', prop: 'walking slowly forward in exploration, one hand lightly touching the environment, face toward camera in discovery moment', comp: 'three-quarter body in slow motion, setting providing discovery narrative' },
    ],
  },

  // ── theme_05: 上古傳說 · 中國神話 ──────────────────────────
  {
    id: 'theme_05', name: '上古傳說 · 中國神話', icon: '🐉',
    tpl: 'goddess_myth', mk: 'oracle_gold',
    settings: [
      { env: 'East Sea Dragon Palace underwater halls with jade pillars and ocean light filtering from above, divine sea domain', outfit: 'divine sea goddess robes in jade green and pearl white, ocean pearl accessories, underwater divinity', icon: '🌊', chBase: '東海龍宮' },
      { env: 'Kunlun Mountain divine summit with sacred divine peach trees and golden celestial light, immortal realm', outfit: 'Kunlun immortal goddess robes in white and divine gold, sacred headpiece with jade ornaments', icon: '⛰️', chBase: '崑崙仙境' },
      { env: 'Moon Palace among silver clouds with osmanthus trees and jade rabbit, Chang\'e celestial solitude', outfit: 'Moon Palace goddess robes in pure white and silver, moon-light accessories, lunar divinity', icon: '🌙', chBase: '廣寒宮闕' },
      { env: 'Phoenix Mountain with sacred fire and mythological bird, fire divine realm and legendary creature', outfit: 'Phoenix goddess divine robes in vermillion and gold, phoenix feather accessories, fire divinity', icon: '🔥', chBase: '鳳凰山巔' },
      { env: 'Heaven\'s jade court with celestial architecture and divine assembly, immortal bureaucracy setting', outfit: 'celestial court official robes in divine jade and imperial gold, celestial rank accessories', icon: '☁️', chBase: '天宮玉闕' },
      { env: 'Yellow River sacred waterfall with divine golden water and ancient stone, river deity domain', outfit: 'river goddess robes in flowing golden-bronze, water divine accessories, river deity elegance', icon: '💧', chBase: '黃河聖瀑' },
      { env: 'divine sacred ancient tree at world center with golden leaves and divine energy radiating', outfit: 'tree goddess divine robes in nature gold and deep green, sacred branch and leaf accessories', icon: '🌿', chBase: '世界神木' },
      { env: 'mortal-divine boundary veil where heaven and earth meet, liminal sacred space', outfit: 'boundary goddess robes in half-divine white and mortal earth color, veil of transition', icon: '🌫️', chBase: '天地邊界' },
      { env: 'ancient fire mountain with volcanic divine power, primordial creation energy, divine fire domain', outfit: 'creation goddess robes in earth-fire divine colors, primordial fire accessories, ancient divinity', icon: '🌋', chBase: '火焰神山' },
      { env: 'underground water kingdom with ancient divine springs and sacred light from depths', outfit: 'underground water goddess robes in deep jade and darkness, sacred deep water accessories', icon: '🌀', chBase: '地下水國' },
    ],
    variants: [
      { sfx: '·顯靈', sub: '神明顯靈', prop: 'standing at the sacred center of the divine environment with hands slightly raised in blessing, face toward camera with divine composure', comp: 'full body at sacred axis, divine elements framing the figure, face clearly readable' },
      { sfx: '·賜福', sub: '神恩賜福', prop: 'one hand extended in blessing gesture while other rests composed, face toward camera with benevolent divine expression', comp: 'three-quarter body with blessing gesture visible, divine environment behind' },
      { sfx: '·降世', sub: '天神降世', prop: 'arriving from above with composed divine authority, body slightly angled downward as if descending, face toward camera', comp: 'full body showing the divine descent angle, sacred environment providing scale' },
      { sfx: '·巡察', sub: '天巡地界', prop: 'standing at a vantage point observing the divine domain with calm divine awareness, face turned toward camera in divine survey', comp: 'full body at elevated position, divine domain visible below, face clearly lit' },
      { sfx: '·靜思', sub: '神明靜觀', prop: 'seated in a composed divine meditative position with hands in divine mudra, face toward camera with divine peace', comp: 'seated portrait with divine setting as context, face clearly readable' },
      { sfx: '·召靈', sub: '呼靈喚魂', prop: 'hands raised in a divine summoning gesture, body composed with divine authority, face toward camera', comp: 'three-quarter body with divine energy gathering visible, face as center of divine power' },
      { sfx: '·聆聽', sub: '傾聽祈願', prop: 'slightly inclined head in a listening posture, face turned toward camera in divine attention to mortal prayer', comp: 'medium portrait, divine environment as atmospheric frame, expression of divine empathy' },
      { sfx: '·往來', sub: '往來仙界', prop: 'walking through the divine setting with measured divine grace, robes in sacred motion, face toward camera', comp: 'full body in divine procession, sacred path or setting providing divine narrative' },
      { sfx: '·施法', sub: '天力施法', prop: 'both hands engaged in a divine power gesture, face toward camera as divine energy gathers around the figure', comp: 'full body with divine energy effect framing, face clearly readable as center of power' },
      { sfx: '·安息', sub: '神域靜憩', prop: 'standing in absolute divine stillness at the sacred center, hands at sides, face directly toward camera with complete divine composure', comp: 'centered full body, divine environment symmetrically framing, face as divine focal point' },
    ],
  },

  // ── theme_06: 聊齋誌異 · 妖魅幻境 ──────────────────────────
  {
    id: 'theme_06', name: '聊齋誌異 · 妖魅幻境', icon: '🦊',
    tpl: 'fantasy', mk: 'yaohou',
    settings: [
      { env: 'ancient fox spirit mountain shrine with old osmanthus trees and spirit light, supernatural folk realm', outfit: 'fox spirit classical robes in warm amber and white, fox ear hairpin, spirit world elegance', icon: '🦊', chBase: '狐仙山祠' },
      { env: 'moonlit ancient scholar study with spirit fox present, scholar and spirit world boundary', outfit: 'refined classical fox spirit female scholar outfit in ivory and soft gold, bookish spirit elegance', icon: '📚', chBase: '月下書齋' },
      { env: 'lantern festival night market with spirit beings and mortal mixing, supernatural folk celebration', outfit: 'festive classical fox spirit outfit in red and gold festival colors, lantern light spirit elegance', icon: '🏮', chBase: '燈會夜市' },
      { env: 'abandoned mansion spirit garden with overgrown ancient paths and supernatural atmosphere', outfit: 'classical abandoned-mansion spirit outfit in faded grandeur, ghost and spirit world aesthetic', icon: '🌙', chBase: '廢園靈境' },
      { env: 'spirit lake pavilion with water reflection and immortal spirit world beauty', outfit: 'water spirit classical robes in lake-blue and misty white, water spirit accessories, lake beauty', icon: '💧', chBase: '靈湖水榭' },
      { env: 'ancient willow tree clearing at night with spirit manifestation, classical ghost story setting', outfit: 'willow spirit classical dress in flowing green-white, willow branch motif, spirit nature beauty', icon: '🌿', chBase: '柳下靈顯' },
      { env: 'fox spirit wedding procession path through ancient forest, mythological marriage ritual', outfit: 'fox wedding classical bridal outfit in red and white with fox motif, spirit bride elegance', icon: '🔴', chBase: '狐婚花路' },
      { env: 'spirit world marketplace with supernatural goods and otherworldly beings, hidden realm', outfit: 'spirit world merchant classical outfit in mysterious multi-layered colors, spirit market style', icon: '🌀', chBase: '鬼市幽集' },
      { env: 'ancient walled town at twilight where mortal and spirit worlds briefly overlap', outfit: 'classical female spirit outfit that blends mortal and supernatural, twilight boundary elegance', icon: '🌅', chBase: '暮色古鎮' },
      { env: 'deep forest spirit realm boundary where ancient trees frame the entrance to the other world', outfit: 'forest spirit classical robes in deep green and earth gold, ancient forest spirit aesthetic', icon: '🌲', chBase: '林中靈門' },
    ],
    variants: [
      { sfx: '·現身', sub: '靈顯現身', prop: 'emerging from the supernatural setting with composed otherworldly grace, face toward camera in spirit being presence', comp: 'full body emerging from atmospheric setting, face clearly readable with spirit world quality' },
      { sfx: '·凝視', sub: '妖眼凝視', prop: 'standing with composed supernatural stillness, direct gaze toward camera with spirit being awareness that transcends ordinary', comp: 'medium to three-quarter portrait, supernatural atmosphere framing, face dominant' },
      { sfx: '·誘引', sub: '輕聲誘引', prop: 'slightly inclined posture as if inviting, one hand raised near shoulder, face toward camera with playful supernatural charm', comp: 'three-quarter body with inviting gesture, supernatural setting as context, face clear' },
      { sfx: '·靜立', sub: '幽靜佇立', prop: 'standing perfectly still in the supernatural setting with absolute spirit composure, face directly toward camera', comp: 'full body centered, supernatural environment as atmospheric frame' },
      { sfx: '·轉身', sub: '靈動轉身', prop: 'three-quarter rear position with face turning back toward camera, supernatural fabric in motion, spirit being elegance in movement', comp: 'three-quarter body rotation, supernatural motion visible, face clearly readable' },
      { sfx: '·施法', sub: '靈術施法', prop: 'hands engaged in a spirit magic gesture below face level, face toward camera with focused supernatural concentration', comp: 'three-quarter body with magic gesture visible, supernatural energy framing' },
      { sfx: '·聆聽', sub: '傾聽塵音', prop: 'head slightly tilted as if hearing the mortal world from the spirit realm, face turned toward camera with supernatural sensitivity', comp: 'medium portrait, supernatural setting behind, expression of spirit world awareness' },
      { sfx: '·行走', sub: '靈步輕移', prop: 'walking with supernatural grace through the setting, robes and hair in ethereal motion, face toward camera', comp: 'full body in graceful supernatural movement, spirit world setting providing depth' },
      { sfx: '·坐息', sub: '靈境小憩', prop: 'seated in a supernatural setting with composed spirit being stillness, hands in lap, face toward camera', comp: 'seated portrait in supernatural context, face clearly readable with spirit world quality' },
      { sfx: '·消逝', sub: '靈影消逝', prop: 'standing at the edge of the supernatural setting as if about to depart, face back toward camera in final spirit world moment', comp: 'three-quarter body at boundary of setting, departure suggested, face clearly visible' },
    ],
  },

  // ── theme_07: 傳世經典 · 四大名著 ──────────────────────────
  {
    id: 'theme_07', name: '傳世經典 · 四大名著', icon: '📜',
    tpl: 'classic_lit', mk: 'gudian_hong',
    settings: [
      { env: 'Dream of Red Chamber: Prospect Garden in spring bloom, Daiyu\'s study pavilion with curtained windows, classical scholar garden', outfit: 'Lin Daiyu style classical dress in pale rose and soft white, delicate flower hairpin, literary girl beauty', icon: '🌸', chBase: '瀟湘秋雨' },
      { env: 'Dream of Red Chamber: Grand Mansion ornate interior with carved screens and silk furnishings', outfit: 'Baochai style classical dress in warm peach or refined cream, classic wealthy girl beauty', icon: '🏯', chBase: '怡紅院廂' },
      { env: 'Dream of Red Chamber: Prospect Garden autumn with falling leaves and end-of-beauty melancholy', outfit: 'late garden seasonal classical dress in autumn muted gold and brown, end-of-beauty elegance', icon: '🍂', chBase: '大觀園秋' },
      { env: 'Water Margin: Liangshan camp with banners and heroic atmosphere, outlaw headquarters', outfit: 'Water Margin female hero outfit in warrior red or steel grey, sword belt, heroic female martial', icon: '⚔️', chBase: '梁山大寨' },
      { env: 'Water Margin: mountain inn with provincial travelers and heroic characters, action story setting', outfit: 'heroic female traveler outfit in earth tones, practical classical travel wear with attitude', icon: '🏔️', chBase: '古道山居' },
      { env: 'Romance of Three Kingdoms: battle camp with military banners and strategic atmosphere', outfit: 'female Three Kingdoms military advisor or princess outfit in dynasty-appropriate formal wear', icon: '🏴', chBase: '三國大帳' },
      { env: 'Romance of Three Kingdoms: imperial pavilion with political tension and power dynamics', outfit: 'Three Kingdoms noblewoman classical dress with political status visible in accessories', icon: '🏛️', chBase: '漢宮朝堂' },
      { env: 'Journey to the West: mountain temple along the sacred pilgrimage route', outfit: 'female pilgrim classical outfit in white or religious-influenced styling, sacred journey aesthetic', icon: '🏯', chBase: '取經山路' },
      { env: 'Journey to the West: supernatural demon realm with mythological atmosphere', outfit: 'female demon queen classical dress in supernatural colors, demon world feminine power', icon: '👑', chBase: '妖魔洞府' },
      { env: 'Journey to the West: celestial heaven court with sacred divine atmosphere', outfit: 'heavenly female immortal robes in white and divine gold, celestial court classical beauty', icon: '☁️', chBase: '天宮仙苑' },
    ],
    variants: [
      { sfx: '·吟詩', sub: '詩情畫意', prop: 'standing with a classical scroll or flower in hand, head slightly bowed in literary contemplation, face toward camera in poetic moment', comp: 'three-quarter body with literary prop as context, classical atmosphere, face clearly readable' },
      { sfx: '·坐亭', sub: '亭中雅坐', prop: 'seated in a pavilion with classical posture, hands folded or one resting on surface, face toward camera with classical literary elegance', comp: 'seated portrait in classical setting, architectural frame, face clearly readable' },
      { sfx: '·賞花', sub: '園中賞花', prop: 'standing among classical garden flowers, face turned from flowers toward camera with natural literary beauty', comp: 'three-quarter body with garden blooms as foreground frame, face clearly visible' },
      { sfx: '·讀書', sub: '靜室讀書', prop: 'holding a classical book or scroll, looking down at it with literary focus, then face raised toward camera in reading pause', comp: 'medium portrait with book as literary prop, classical interior as context' },
      { sfx: '·佇立', sub: '廊下佇立', prop: 'standing in a classical corridor or pavilion in composed literary beauty, hands at sides, face directly toward camera', comp: 'full body with classical architecture framing, literary atmosphere clear' },
      { sfx: '·撫琴', sub: '琴音款款', prop: 'hands positioned as if playing guqin or pausing mid-music, face toward camera in classical musical moment', comp: 'medium portrait with classical instrument as contextual element, face dominant' },
      { sfx: '·回眸', sub: '款步回望', prop: 'walking in the classical setting, naturally turning face toward camera over shoulder with classical literary beauty', comp: 'three-quarter body in classical movement, literary setting as narrative context' },
      { sfx: '·送別', sub: '依依送別', prop: 'standing at a gateway or path edge with one hand slightly raised in farewell, face toward camera with classical emotional depth', comp: 'full body at classical threshold, emotional literary narrative visible' },
      { sfx: '·繡工', sub: '閨中繡花', prop: 'hands held as if doing embroidery or classical handwork, face toward camera in classical feminine domestic art moment', comp: 'medium portrait with classical needlework suggestion, intimate classical setting' },
      { sfx: '·憑窗', sub: '窗畔凝思', prop: 'standing or sitting by a classical window with soft light, face turned from window toward camera in literary introspection', comp: 'three-quarter body at window, classical light framing, face clearly illuminated' },
    ],
  },

  // ── theme_08: 江湖至尊 · 金庸武俠 ──────────────────────────
  {
    id: 'theme_08', name: '江湖至尊 · 金庸武俠', icon: '⚔️',
    tpl: 'jinyong', mk: 'wuxia',
    settings: [
      { env: 'Peach Blossom Island surrounded by sea with ancient defensive mechanisms and floating blossoms', outfit: 'Huang Rong style clever female wuxia outfit with peach blossom motif, nimble and beautiful', icon: '🌸', chBase: '桃花島上' },
      { env: 'Ancient Shaolin Temple mountain approach with pine forest and martial arts heritage atmosphere', outfit: 'Wulin female hero outer robe with martial arts belt, practical but elegant classical wuxia', icon: '⛰️', chBase: '少室山下' },
      { env: 'ancient mountain inn at wuxia crossroads where heroes gather, adventure atmosphere', outfit: 'female traveler wuxia outfit in earth-tone practical classical wear, sword at back, heroic beauty', icon: '🏨', chBase: '武林古道' },
      { env: 'snow-peak mountain duel ground with dramatic cold wind and vast wuxia landscape', outfit: 'cold-weather wuxia female outfit in winter white and steel-grey, elegant martial cold beauty', icon: '❄️', chBase: '雪峰論劍' },
      { env: 'desert oasis fortress with sunset behind, Silk Road wuxia adventure setting', outfit: 'desert wuxia female outfit in warm sand and rust tones, exotic wuxia beauty of the west', icon: '🏜️', chBase: '大漠堡壘' },
      { env: 'imperial palace martial arts practice ground with dynasty architecture, Demi-Gods setting', outfit: 'imperial court female wuxia outfit with dynasty embroidery, powerful and beautiful palace female hero', icon: '🏯', chBase: '皇城武場' },
      { env: 'underground secret chamber with ancient martial arts scripture and hidden sect atmosphere', outfit: 'sect female disciple wuxia outfit in sect colors, traditional but powerful hidden sect elegance', icon: '🌀', chBase: '地下密室' },
      { env: 'cliff top martial arts training ground overlooking misty canyon, Mountain Sect atmosphere', outfit: 'cliff sect female disciple outfit in mist-blue and white, sword in hand, mountain sect beauty', icon: '🌫️', chBase: '山崖劍台' },
      { env: 'ancient sacred martial tomb with martial secrets and legendary atmosphere', outfit: 'martial arts female heir outfit in inheritance ceremonial style, sacred martial beauty', icon: '🪦', chBase: '武林古墓' },
      { env: 'river town bustling market with Jianghu atmosphere and civilian life backdrop', outfit: 'disguised civilian female hero outfit with concealed martial accessories, in-crowd heroic beauty', icon: '🏘️', chBase: '江湖市集' },
    ],
    variants: [
      { sfx: '·仗劍', sub: '仗劍天涯', prop: 'standing with one hand lightly on sword hilt or sword in hand pointed down, face toward camera with martial arts confidence', comp: 'full body with sword as wuxia prop, setting providing martial atmosphere, face clearly readable' },
      { sfx: '·凝氣', sub: '運氣凝神', prop: 'standing in a martial arts ready posture with focused energy concentration, face toward camera with internal power visible', comp: 'full body in martial stance, wuxia energy atmosphere, face clearly readable with power' },
      { sfx: '·遠眺', sub: '江湖遠眺', prop: 'standing at a vantage point looking at the wuxia world below, face angled toward camera with heroic wuxia emotion', comp: 'full body at elevated position, wuxia landscape behind, face clearly lit' },
      { sfx: '·行走', sub: '江湖行走', prop: 'walking through the wuxia setting with martial arts confidence and grace, wuxia fabric in motion, face toward camera', comp: 'full body in purposeful martial movement, wuxia setting as narrative context' },
      { sfx: '·論劍', sub: '論劍天下', prop: 'in a wuxia ready debate stance, hands at sides or on sword, face toward camera with martial arts authority', comp: 'three-quarter body with wuxia competition atmosphere, face dominant with martial spirit' },
      { sfx: '·拔劍', sub: '一劍出鞘', prop: 'one hand gripping sword with pull-draw motion, body in draw stance, face toward camera with sharp martial focus', comp: 'three-quarter body in draw motion, sword as dramatic prop, face clearly readable' },
      { sfx: '·佇立', sub: '武林佇立', prop: 'standing still in wuxia hero posture, natural martial composure, face directly toward camera with heroic presence', comp: 'full body in composed wuxia stance, martial arts setting as atmospheric frame' },
      { sfx: '·救人', sub: '義薄雲天', prop: 'mid-motion as if arriving to help with protective gesture forward, face toward camera with heroic determination', comp: 'three-quarter body in arriving motion, heroic narrative composition' },
      { sfx: '·苦練', sub: '勤練苦功', prop: 'in a training mid-pose with sword or natural position, face toward camera in martial arts dedication moment', comp: 'full body in training atmosphere, practice context visible, face clearly readable' },
      { sfx: '·問路', sub: '問路江湖', prop: 'standing in the town setting with relaxed civilian-mode composure, face toward camera in Jianghu life moment', comp: 'full body in market or town setting, Jianghu daily life as narrative' },
    ],
  },

  // ── theme_09: 影視熱播 · 陸劇同款 ──────────────────────────
  {
    id: 'theme_09', name: '影視熱播 · 陸劇同款', icon: '🎬',
    tpl: 'china_drama', mk: 'cinematic',
    settings: [
      { env: 'xianxia drama immortal realm with floating islands and celestial light, premium C-drama supernatural setting', outfit: 'premium C-drama xianxia female lead robes in white and jade, drama production quality costume', icon: '✨', chBase: '仙境劇情' },
      { env: 'ancient palace drama imperial court with ceremony and political atmosphere, hit imperial drama', outfit: 'palace drama female lead imperial court gown in dynasty ceremony colors, production costume quality', icon: '🏯', chBase: '宮廷大劇' },
      { env: 'wuxia drama mountain gate with heroes and martial atmosphere, C-drama wuxia opening', outfit: 'wuxia drama female lead outfit in martial arts elegance, drama production wuxia quality', icon: '⚔️', chBase: '武俠開場' },
      { env: 'romance drama scenic location with emotionally charged atmosphere, hit drama romantic moment', outfit: 'C-drama romance lead casual classical or modern outfit, drama romantic scene quality', icon: '💕', chBase: '浪漫場景' },
      { env: 'drama underwater palace scene with water and light, fantasy drama special effects setting', outfit: 'underwater fantasy drama female lead in aquatic supernatural costume, special production quality', icon: '🌊', chBase: '海底宮殿' },
      { env: 'drama spirit mountain cultivation setting with supernatural energy, xianxia cultivation drama', outfit: 'xianxia cultivation drama female disciple in sect robes with cultivation accessory belt', icon: '🌿', chBase: '仙山修煉' },
      { env: 'drama imperial garden with political tension and beauty, prestige imperial drama garden scene', outfit: 'imperial garden drama gown with political status markers, premium palace drama costume', icon: '🌸', chBase: '御苑宮廷' },
      { env: 'time-travel drama modern setting entering ancient world, modern meets ancient drama', outfit: 'time-travel drama outfit combining modern element with ancient setting, drama fish-out-of-water style', icon: '⏰', chBase: '穿越時空' },
      { env: 'drama battle pre-scene dramatic composition, war period C-drama emotional high-point', outfit: 'battle drama female character in war-period appropriate clothing, drama emotional peak costume', icon: '🏴', chBase: '戰前誓言' },
      { env: 'drama finale reunion scene with cinematic emotion, premium C-drama emotional peak', outfit: 'drama finale female lead outfit in emotionally resonant color and style, premium drama quality', icon: '🎭', chBase: '大結局戲' },
    ],
    variants: [
      { sfx: '·女主', sub: '主角光環', prop: 'standing in a drama lead protagonist pose with natural screen presence, face toward camera as the dramatic center of attention', comp: 'full body with drama setting as cinematic backdrop, face as dramatic focal point' },
      { sfx: '·轉場', sub: '場景轉換', prop: 'walking through the drama setting with natural drama-paced movement, face turning toward camera in character transition', comp: 'full body in drama movement, cinematic setting depth, face clearly readable' },
      { sfx: '·凝思', sub: '角色沉思', prop: 'standing in character with focused drama contemplation, face turned slightly then toward camera in dramatic introspection', comp: 'medium portrait in drama mood, cinematic atmosphere, face with drama emotion visible' },
      { sfx: '·對峙', sub: '雙雄對峙', prop: 'in a dramatic confrontation stance with composed drama energy, face toward camera with character intensity', comp: 'three-quarter body in confrontation posture, drama tension in composition, face clearly readable' },
      { sfx: '·情感', sub: '情感爆發', prop: 'in a drama emotional peak moment with contained but visible feeling, face toward camera with character depth', comp: 'medium portrait capturing drama emotion, cinematic close composition' },
      { sfx: '·行刑', sub: '執行使命', prop: 'walking with drama purpose toward the scene climax, character determination in movement, face toward camera', comp: 'full body with purposeful drama movement, cinematic setting, face dominant' },
      { sfx: '·等待', sub: '等候命運', prop: 'seated or standing in drama waiting pose with character patience, face toward camera in drama narrative', comp: 'three-quarter body in drama waiting, cinematic setting as emotional context' },
      { sfx: '·離別', sub: '依依離別', prop: 'standing in drama farewell position with emotional narrative body language, face toward camera in departure drama', comp: 'full body at threshold or path, drama farewell narrative, face clearly readable' },
      { sfx: '·覺醒', sub: '角色覺醒', prop: 'in drama power awakening stance with character transformation visible, face toward camera with newly awakened presence', comp: 'dramatic full body with awakening energy, cinematic composition, face as transformation focal point' },
      { sfx: '·謝幕', sub: '劇終謝幕', prop: 'in elegant final drama composition pose, face toward camera with character grace and drama finale emotion', comp: 'full body in drama finale composition, cinematic setting, face with character closure' },
    ],
  },

  // ── theme_10: 大國風華 · 歷代古裝 ──────────────────────────
  {
    id: 'theme_10', name: '大國風華 · 歷代古裝', icon: '🏯',
    tpl: 'hanfu', mk: 'imperial_empress',
    settings: [
      { env: 'Han dynasty palace long corridor with red pillars and carved railings, warm lantern light, imperial Han grandeur', outfit: 'Han dynasty imperial dress in dark red and black with wide sleeves and wrapped skirt, dynasty-authentic accessories', icon: '🏛️', chBase: '漢宮長廊' },
      { env: 'Tang dynasty blooming peony garden with warm afternoon sunlight and ornate garden walls, Tang prosperity', outfit: 'Tang dynasty female official or court beauty dress in rich silk with floral embroidery, Tang dynasty headpiece', icon: '🌸', chBase: '盛唐牡丹' },
      { env: 'Song dynasty elegant teahouse interior with scholar atmosphere and ink painting on screen', outfit: 'Song dynasty refined feminine dress in muted elegant colors, simple but tasteful accessories, Song literati aesthetic', icon: '🍵', chBase: '宋代茶肆' },
      { env: 'Ming dynasty official courtyard with ceremonial architecture and formal dynasty setting', outfit: 'Ming dynasty noblewoman formal attire with phoenix crown or dignified headpiece, Ming dynasty ceremonial beauty', icon: '🏯', chBase: '明代府邸' },
      { env: 'Qing dynasty imperial garden with ornate pavilions and seasonal flowers, dynasty elegance', outfit: 'Qing dynasty palace attire with banner dress or Manchurian court style, dynasty-specific accessories', icon: '🌺', chBase: '清宮御苑' },
      { env: 'Wei-Jin dynasty bamboo grove with scholar gathering atmosphere, literati dynasty aesthetics', outfit: 'Wei-Jin dynasty flowing scholar dress in soft colors, natural fabric hanfu with minimal accessories', icon: '🎋', chBase: '魏晉竹林' },
      { env: 'ancient imperial examination hall with scholarly atmosphere and dynasty achievement setting', outfit: 'scholarly dynasty dress appropriate for examination institution context, refined academic beauty', icon: '📜', chBase: '金科玉榜' },
      { env: 'dynasty imperial feast setting with banquet table and court ceremony atmosphere', outfit: 'dynasty banquet formal attire in ceremony colors with court rank accessories, festive dynasty elegance', icon: '🥢', chBase: '宮廷盛宴' },
      { env: 'classical Chinese private garden with pavilion and lotus pond, literati garden aesthetics', outfit: 'refined garden hanfu in soft colors coordinated with garden setting, garden stroll beauty', icon: '🪷', chBase: '古典私園' },
      { env: 'ancient great wall vicinity with dynasty architecture and historical monument setting', outfit: 'dynasty appropriate attire for monument visit setting, classical pride in historical landscape', icon: '🧱', chBase: '長城古道' },
    ],
    variants: [
      { sfx: '·朝服', sub: '朝服端莊', prop: 'standing in dynasty formal ceremony posture with appropriate dignity, face toward camera with dynasty elegance', comp: 'full body with dynasty architecture framing, ceremonial costume clearly visible' },
      { sfx: '·遊園', sub: '雅人遊園', prop: 'walking through the classical setting with dynasty grace, robes in natural motion, face toward camera', comp: 'full body in classical movement, garden or setting providing dynasty depth' },
      { sfx: '·品茗', sub: '雅士品茶', prop: 'in a tea ceremony or scholar contemplation posture, hands at tea position, face toward camera with dynasty refinement', comp: 'medium portrait with tea or scholar prop, dynasty interior, face clearly readable' },
      { sfx: '·吟詩', sub: '詩文風雅', prop: 'holding a scroll or poetry prop, face toward camera in literary contemplation with dynasty poetic elegance', comp: 'three-quarter body with literary prop, dynasty setting, face clearly readable' },
      { sfx: '·梳妝', sub: '閨房梳妝', prop: 'in a graceful grooming or dressing gesture, face toward camera in intimate dynasty beauty moment', comp: 'medium portrait in dynasty interior with dressing prop visible, face clearly readable' },
      { sfx: '·觀景', sub: '憑高觀景', prop: 'standing at an elevated or scenic viewpoint, face turned toward camera after taking in the dynasty landscape', comp: 'full body at viewpoint, dynasty landscape behind, face clearly lit' },
      { sfx: '·侍宴', sub: '宴會侍候', prop: 'in a dynasty banquet setting with composed court posture, face toward camera with dynasty court grace', comp: 'three-quarter body in banquet context, court ceremony visible, face clearly readable' },
      { sfx: '·刺繡', sub: '閨閣刺繡', prop: 'hands in embroidery position, face toward camera in classical feminine craft moment with dynasty elegance', comp: 'medium portrait in dynasty interior with embroidery context, face dominant' },
      { sfx: '·揮毫', sub: '書法揮毫', prop: 'one hand in calligraphy gesture near a writing surface, face toward camera in dynasty scholarly moment', comp: 'three-quarter body with calligraphy context, dynasty setting, face clearly readable' },
      { sfx: '·佇立', sub: '盛服佇立', prop: 'standing still in full dynasty costume with composed elegance, face directly toward camera with dynasty pride', comp: 'full body centered with complete dynasty costume visible, face as focal point' },
    ],
  },

  // ── theme_11: 謫仙情緣 · 東方仙俠 ──────────────────────────
  {
    id: 'theme_11', name: '謫仙情緣 · 東方仙俠', icon: '✨',
    tpl: 'xianxia', mk: 'xianxia',
    settings: [
      { env: 'xianxia celestial peak above cloud sea with immortal realm light and cultivator energy, sacred cultivation location', outfit: 'celestial cultivator robes in white and jade with cultivation belt, spiritual accessories, immortal elegance', icon: '☁️', chBase: '仙峰雲海' },
      { env: 'spirit mountain cultivation ground with ancient formation stones and spirit energy gathering', outfit: 'spirit mountain sect robes in deep cultivator blue-grey, sect badge, cultivation focus aesthetic', icon: '⛰️', chBase: '靈山修地' },
      { env: 'jade pavilion by spirit river at golden morning, xianxia romance setting', outfit: 'romantic xianxia female immortal robes in peach and white with river-inspired accessories', icon: '🌊', chBase: '玉亭靈河' },
      { env: 'spirit beast ancient forest with supernatural creatures and cultivation plant energy', outfit: 'beast tamer cultivation robes in natural green and brown with beast-bond accessories', icon: '🌿', chBase: '靈獸古林' },
      { env: 'ancient cultivation cave with glowing spirit crystals and cultivation array, sect secret ground', outfit: 'inner disciple cultivation robes for cave meditation, focused and refined cultivation aesthetic', icon: '💎', chBase: '修煉洞府' },
      { env: 'floating island above clouds with xianxia architecture and celestial light, aerial immortal domain', outfit: 'floating island immortal robes in cloud-white and celestial blue, sky-high cultivation elegance', icon: '🌤️', chBase: '浮空仙島' },
      { env: 'mirror spring at dawn reflecting the immortal realm, xianxia reflection and revelation setting', outfit: 'spring immortal robes in translucent water-white with mirror spring accessories, dawn cultivation beauty', icon: '🌅', chBase: '鏡泉晨曦' },
      { env: 'divine library hall with floating cultivation scrolls and ancient xianxia knowledge', outfit: 'library immortal scholar robes in refined ink-black and white, cultivation scroll accessories', icon: '📖', chBase: '仙道藏典' },
      { env: 'celestial war old battlefield with cultivation formation remnants and xianxia war energy', outfit: 'war-period cultivation battle robes in steel and white with protection array accessories', icon: '⚔️', chBase: '天戰舊址' },
      { env: 'forbidden valley entrance with ancient cultivation seal and xianxia danger atmosphere', outfit: 'investigating immortal robes in exploration-ready cultivation style, boundary-crossing aesthetic', icon: '🌀', chBase: '禁地入口' },
    ],
    variants: [
      { sfx: '·御劍', sub: '御劍飛行', prop: 'sword held at side or pointed forward in cultivation flight suggestion, face toward camera with immortal composure', comp: 'full body with sword as cultivation prop, xianxia energy framing, face clearly readable' },
      { sfx: '·打坐', sub: '靜心打坐', prop: 'seated in cultivation meditation posture with hands in mudra, face toward camera with inner cultivation peace', comp: 'seated portrait in cultivation setting, xianxia energy around, face clearly readable' },
      { sfx: '·催法', sub: '靈力催發', prop: 'hands raised in cultivation technique gesture with xianxia energy visible, face toward camera with cultivation focus', comp: 'three-quarter body with xianxia technique energy, face as cultivation focal point' },
      { sfx: '·行走', sub: '仙道步行', prop: 'walking through xianxia setting with immortal grace, cultivation robes in spirit motion, face toward camera', comp: 'full body in immortal movement, xianxia setting providing depth, face clearly lit' },
      { sfx: '·靜立', sub: '仙境靜立', prop: 'standing in composed immortal stillness at the xianxia setting center, face directly toward camera with celestial composure', comp: 'full body centered, xianxia energy framing, face as immortal focal point' },
      { sfx: '·感悟', sub: '天道感悟', prop: 'face slightly raised as if receiving xianxia insight, one hand near chest, turning face toward camera in cultivation revelation', comp: 'medium portrait in cultivation insight moment, xianxia atmosphere, face clearly readable' },
      { sfx: '·觀敵', sub: '對峙準備', prop: 'in a cultivation ready-stance with focused xianxia energy, face toward camera with immortal combat composure', comp: 'three-quarter body in cultivation stance, xianxia battle atmosphere, face dominant' },
      { sfx: '·望月', sub: '月下思仙', prop: 'face turned upward to moonlight then toward camera, xianxia contemplation visible in posture, cultivation romance', comp: 'three-quarter body, moon or celestial light above, xianxia romance composition' },
      { sfx: '·降落', sub: '從天而降', prop: 'arriving in xianxia landing pose, one foot forward, robes settling, face toward camera as immortal arrives', comp: 'full body in xianxia arrival, cultivation dust or energy settling around figure' },
      { sfx: '·傳法', sub: '師徒傳功', prop: 'one hand extended in teaching gesture, face toward camera with cultivation teacher composure and xianxia wisdom', comp: 'three-quarter body in teaching position, cultivation energy visible, face clearly readable' },
    ],
  },

  // ── theme_12: 環球美景旅拍 · 異國光景 ──────────────────────────
  {
    id: 'theme_12', name: '環球美景旅拍 · 異國光景', icon: '🌍',
    tpl: 'world_travel', mk: 'global_sun',
    settings: [
      { env: 'Paris iconic street with Eiffel Tower in background, golden afternoon light, European elegance', outfit: 'chic European fashion in classic Parisian colors — navy, cream, red accent — stylish travel elegance', icon: '🗼', chBase: '巴黎鐵塔' },
      { env: 'Japan cherry blossom park with sakura trees in full bloom, soft pink light, Tokyo romance', outfit: 'Japanese-influenced modern or light floral fashion for spring, elegant Asia-Pacific travel style', icon: '🌸', chBase: '東京賞櫻' },
      { env: 'Italy Amalfi coast or Cinque Terre colorful village perched on cliffs above turquoise sea', outfit: 'Mediterranean summer fashion in warm earth or bright coastal colors, Italian travel elegance', icon: '🏖️', chBase: '義大利海岸' },
      { env: 'Greece Santorini white-washed buildings with blue domes and Aegean sea view, iconic Greek islands', outfit: 'Mediterranean white and blue fashion for Greek island setting, sun-kissed travel elegance', icon: '🏛️', chBase: '希臘島嶼' },
      { env: 'Maldives overwater bungalow with crystal turquoise lagoon, tropical paradise setting', outfit: 'tropical resort fashion in white, coral, or tropical colors, luxury tropical travel elegance', icon: '🌊', chBase: '馬爾地夫' },
      { env: 'Scotland highland landscape with dramatic moorland, ancient castle ruins, and moody sky', outfit: 'heritage fashion with plaid or earth tones appropriate for highland dramatic landscape', icon: '🏴', chBase: '蘇格蘭高地' },
      { env: 'Morocco Marrakech colorful medina with ornate tiles and lanterns, North Africa exotic setting', outfit: 'Morocco-inspired fashion with colorful bohemian styling, exotic travel elegance', icon: '🕌', chBase: '摩洛哥古城' },
      { env: 'Iceland waterfall or black sand beach with dramatic northern landscape, unique natural beauty', outfit: 'Nordic earth-tone fashion appropriate for dramatic Iceland nature setting', icon: '🌊', chBase: '冰島瀑布' },
      { env: 'New York Manhattan skyline at twilight with city lights below, urban travel photography', outfit: 'contemporary urban chic fashion for New York rooftop or skyline setting, city travel style', icon: '🌃', chBase: '紐約天際' },
      { env: 'Turkey Istanbul Blue Mosque or Cappadocia balloon landscape, East-meets-West setting', outfit: 'Turkey-inspired fashion with warm colors appropriate for Byzantine or Cappadocia setting', icon: '🕌', chBase: '土耳其奇景' },
    ],
    variants: [
      { sfx: '·打卡', sub: '地標打卡', prop: 'standing at the iconic landmark location with natural travel joy, face toward camera as the authentic travel subject', comp: 'full body with landmark clearly visible behind, travel portrait composition, face clearly lit' },
      { sfx: '·步行', sub: '漫步街頭', prop: 'walking through the local setting with natural travel movement, face turned toward camera in candid travel moment', comp: 'full body in natural walking, location providing authentic depth, face clearly readable' },
      { sfx: '·停歇', sub: '景中小憩', prop: 'seated or pausing naturally in the local setting, relaxed travel rest pose, face toward camera with genuine travel moment', comp: 'three-quarter body in natural rest, location providing travel narrative, face clearly readable' },
      { sfx: '·眺望', sub: '遠眺美景', prop: 'standing at scenic viewpoint looking into the distance, face turned toward camera after taking in the view', comp: 'full body at viewpoint, iconic scenery behind, face clearly lit with travel emotion' },
      { sfx: '·品味', sub: '品味文化', prop: 'engaging with a local cultural element or detail, face toward camera in authentic cultural discovery moment', comp: 'medium shot with cultural detail visible, authentic travel context, face clearly readable' },
      { sfx: '·光影', sub: '光影構圖', prop: 'positioned in beautiful natural light of the location, face toward camera with golden travel light', comp: 'three-quarter body in best light of location, face beautifully lit with local quality' },
      { sfx: '·留念', sub: '留下足跡', prop: 'in a natural documentation pose in the location, face toward camera with genuine travel documentation emotion', comp: 'full body with location clearly establishing travel context, face as authentic travel subject' },
      { sfx: '·探索', sub: '深度探索', prop: 'mid-exploration in the setting with natural curiosity, face toward camera in discovery moment', comp: 'three-quarter body in exploration movement, location providing discovery context' },
      { sfx: '·黃昏', sub: '黃昏美光', prop: 'standing in golden hour light of the location, face toward camera with warm beautiful travel light', comp: 'full body in golden hour, location backlit by warm light, face golden-lit and clearly readable' },
      { sfx: '·回憶', sub: '永恆回憶', prop: 'in a quiet reflective pause in the iconic setting, face toward camera with travel memory emotion', comp: 'three-quarter body in iconic setting, face with genuine travel memory quality' },
    ],
  },

  // ── theme_13: 聖堂與暗黑 · 西方魔幻 ──────────────────────────
  {
    id: 'theme_13', name: '聖堂與暗黑 · 西方魔幻', icon: '🏰',
    tpl: 'gothic', mk: 'gothic',
    settings: [
      { env: 'gothic cathedral interior with soaring stone arches and stained glass light, sacred architectural grandeur', outfit: 'gothic female figure in dark Victorian or gothic fantasy gown, black lace and dark silk, cathedral elegance', icon: '⛪', chBase: '哥德聖堂' },
      { env: 'dark enchanted forest with ancient gnarled trees and bioluminescent fungi, western dark fantasy', outfit: 'dark forest mage female outfit in nature-dark colors with organic magical accessories, forest witch elegance', icon: '🌲', chBase: '魔幻森林' },
      { env: 'vampire castle grand hall with candlelight and ancient portraits, gothic aristocratic horror', outfit: 'vampire aristocrat female gown in blood red and black velvet, gothic ruby jewelry, undead elegance', icon: '🦇', chBase: '吸血鬼堡' },
      { env: 'fallen angel sanctuary ruins with broken divine statues and dark celestial architecture', outfit: 'dark celestial female outfit blending holy and dark, fractured angel aesthetic, gothic divine beauty', icon: '🕊️', chBase: '天使廢廟' },
      { env: 'night sea cliff fortress with moonlight and crashing waves below, gothic coastal darkness', outfit: 'dark coastal noblewoman gown in storm-grey and black, wind-swept gothic elegance', icon: '🌊', chBase: '海崖暗城' },
      { env: 'ancient tomb corridor with mystical runes and archaeological dark mystery', outfit: 'dark explorer or tomb keeper female outfit with mystical accessories, gothic adventure elegance', icon: '🪦', chBase: '古墓長廊' },
      { env: 'dark mage tower interior with magical instruments and arcane library, western dark magic', outfit: 'dark mage female robes in deep purple and black, arcane accessories, mage tower elegance', icon: '🔮', chBase: '黑魔法塔' },
      { env: 'medieval knight training hall with armor displays and castle architecture', outfit: 'female medieval knight or noble observer outfit in period appropriate dark formality', icon: '⚔️', chBase: '騎士大廳' },
      { env: 'elven ancient forest ruins with magical overgrowth and ancient elvish architecture', outfit: 'dark elven female outfit in forest-dark colors with elvish blade or bow accessory, elf dark beauty', icon: '🌿', chBase: '精靈廢墟' },
      { env: 'underground oracle chamber with mystical pool and dark prophecy atmosphere', outfit: 'oracle or seer female robes in midnight dark with prophecy symbol accessories, dark wisdom', icon: '🌀', chBase: '神諭地穴' },
    ],
    variants: [
      { sfx: '·佇立', sub: '暗黑佇立', prop: 'standing in the gothic setting with dark aristocratic composure, arms at sides, face toward camera with gothic presence', comp: 'full body in gothic setting, dark architectural or forest frame, face clearly readable' },
      { sfx: '·凝視', sub: '暗夜凝視', prop: 'direct unwavering gaze toward camera with gothic cold beauty, minimal movement, dark composure', comp: 'medium portrait with dark atmospheric setting, face dominant with gothic quality' },
      { sfx: '·施法', sub: '黑魔法施術', prop: 'one hand raised in dark magical gesture below face level, face toward camera with arcane focus', comp: 'three-quarter body with magical gesture, dark energy framing, face clearly readable' },
      { sfx: '·巡視', sub: '深夜巡視', prop: 'walking through the dark setting with gothic authority and grace, dark fabric in candlelight motion, face toward camera', comp: 'full body in gothic motion, dark setting providing atmosphere, face clearly lit by candlelight' },
      { sfx: '·臨窗', sub: '月光臨窗', prop: 'standing at a gothic window with moonlight, face toward camera with gothic contemplative beauty', comp: 'three-quarter body at gothic window, moonlight framing, face clearly illuminated' },
      { sfx: '·倚石', sub: '石柱相倚', prop: 'leaning against a gothic stone column or wall, arms loosely crossed, face toward camera with dark aristocratic ease', comp: 'medium three-quarter body against gothic architecture, dark atmosphere, face clearly readable' },
      { sfx: '·閱覽', sub: '翻閱典籍', prop: 'holding a dark tome or arcane book with dark literary focus, face toward camera in dark scholarly moment', comp: 'medium portrait with gothic book prop, dark library context, face clearly readable' },
      { sfx: '·迎光', sub: '燭光沐浴', prop: 'positioned in candlelight with gothic shadows around, face toward camera with dark beauty illuminated by candle', comp: 'three-quarter body in candlelight, dark shadows framing, face clearly lit with warm dark beauty' },
      { sfx: '·獨行', sub: '孤身前行', prop: 'walking alone through the gothic setting with composed dark independence, face toward camera with gothic solitude', comp: 'full body in gothic movement, setting providing dark narrative depth, face clearly readable' },
      { sfx: '·靜思', sub: '暗夜沉思', prop: 'seated in a gothic setting with dark contemplative stillness, hands resting, face toward camera in gothic introspection', comp: 'seated portrait in gothic context, dark atmospheric setting, face clearly readable' },
    ],
  },

  // ── theme_14: 次元覺醒 · 動漫科幻 ──────────────────────────
  {
    id: 'theme_14', name: '次元覺醒 · 動漫科幻', icon: '🌌',
    tpl: 'cyberpunk_sf', mk: 'cyber_idol',
    settings: [
      { env: 'neon cyberpunk city streets at night with rain-reflected electric lights and holographic signs', outfit: 'cyberpunk female outfit with tech-enhanced jacket, circuit detail bodysuit, cyberpunk accessories', icon: '🌆', chBase: '賽博街頭' },
      { env: 'mecha battlefield with giant robot in background and war debris, sci-fi action setting', outfit: 'mecha pilot female flight suit with tech details, cockpit access accessories, sci-fi warrior', icon: '🤖', chBase: '機甲戰場' },
      { env: 'virtual reality world interior with geometric light structures and digital reality', outfit: 'VR world avatar female outfit in impossible digital colors, glowing digital accessories', icon: '💻', chBase: '虛擬實境' },
      { env: 'space station corridor with earth visible through porthole, sci-fi deep space setting', outfit: 'space station female crew outfit with rank insignia, zero-gravity appropriate sci-fi fashion', icon: '🚀', chBase: '太空站艙' },
      { env: 'tournament arena with crowd and dramatic lighting, sci-fi or anime fighting tournament', outfit: 'tournament fighter female outfit in combat-ready design, arena appropriate sci-fi or fantasy gear', icon: '🏟️', chBase: '次元競技' },
      { env: 'dark magic academy library with floating tomes and mysterious arcane atmosphere', outfit: 'magic academy female student uniform with personal magical accessory, student wizard elegance', icon: '🔮', chBase: '黑魔法院' },
      { env: 'futuristic shrine with ancient meets advanced technology, spiritual sci-fi hybrid setting', outfit: 'futuristic priestess outfit blending traditional and advanced tech aesthetics', icon: '⛩️', chBase: '未來神社' },
      { env: 'post-apocalyptic city ruins with overgrown buildings and survivor atmosphere', outfit: 'post-apocalyptic female survivor outfit with practical gear and resourceful styling', icon: '🏚️', chBase: '廢土都市' },
      { env: 'parallel universe portal with dimensional crossing and reality-bending atmosphere', outfit: 'dimension traveler female outfit in reality-defying style with portal energy accessories', icon: '🌀', chBase: '次元門戶' },
      { env: 'anime-style school rooftop at golden hour with dramatic sky and urban setting', outfit: 'anime school uniform female with character-expression accessories, golden hour beauty', icon: '🏫', chBase: '動漫學園' },
    ],
    variants: [
      { sfx: '·覺醒', sub: '次元覺醒', prop: 'in a power awakening pose with sci-fi or magical energy gathering, face toward camera with awakened presence', comp: 'full body with awakening energy framing, face as power focal point, sci-fi atmosphere' },
      { sfx: '·戰鬥', sub: '準備戰鬥', prop: 'in a combat-ready stance with weapons or power at ready position, face toward camera with fighter determination', comp: 'three-quarter body in combat stance, sci-fi or fantasy battle setting, face clearly readable' },
      { sfx: '·行走', sub: '酷步前行', prop: 'walking with sci-fi cool attitude through the setting, tech or fantasy outfit in motion, face toward camera with character presence', comp: 'full body in cool movement, neon or sci-fi setting depth, face clearly readable' },
      { sfx: '·靜立', sub: '酷颯靜立', prop: 'standing with composed sci-fi or anime character presence, face directly toward camera with character coolness', comp: 'full body centered, dramatic sci-fi or fantasy setting framing, face dominant' },
      { sfx: '·技能', sub: '使用技能', prop: 'in a skill-use animation pose with energy or technique visible, face toward camera with focused technique concentration', comp: 'three-quarter body with skill effect framing, face as character focal point' },
      { sfx: '·凝視', sub: '深邃凝視', prop: 'direct intense gaze toward camera with anime or sci-fi character depth, minimal pose', comp: 'medium portrait with setting as atmospheric frame, face dominant with character intensity' },
      { sfx: '·出場', sub: '角色出場', prop: 'in a dramatic character entrance pose with character introduction energy, face toward camera', comp: 'full body in entrance composition, setting establishing character world, face clearly lit' },
      { sfx: '·獨白', sub: '角色獨白', prop: 'in a thoughtful character introspection position, face toward camera with character inner world visible', comp: 'medium portrait with character world as atmospheric backdrop, face with character depth' },
      { sfx: '·召喚', sub: '召喚夥伴', prop: 'in a summoning gesture with character companion energy, face toward camera with summoner confidence', comp: 'three-quarter body with summoning gesture, sci-fi or fantasy energy, face clearly readable' },
      { sfx: '·探索', sub: '次元探索', prop: 'in an exploration discovery pose with new-world curiosity, face toward camera in character discovery moment', comp: 'full body in exploratory composition, dimensional or sci-fi setting, face clearly readable' },
    ],
  },

  // ── theme_15: 當代時尚 · 女王婚紗 ──────────────────────────
  {
    id: 'theme_15', name: '當代時尚 · 女王婚紗', icon: '👗',
    tpl: 'wedding_diamond', mk: 'wedding',
    settings: [
      { env: 'luxury wedding chapel with white floral aisle and golden altar light, premium bridal ceremony', outfit: 'luxury bridal gown in pure ivory with diamond crystal embellishment, cathedral veil, luxury bridal jewelry', icon: '💒', chBase: '婚禮教堂' },
      { env: 'rooftop terrace above glittering city skyline at twilight, urban luxury wedding setting', outfit: 'sleek contemporary bridal column gown or luxury evening bridal, city skyline backdrop elegance', icon: '🌃', chBase: '天台婚禮' },
      { env: 'garden ceremony venue with arch of white roses and soft natural light, romantic garden wedding', outfit: 'garden bridal A-line gown with floral applique, flower crown or soft veil, botanical beauty', icon: '🌹', chBase: '花園婚禮' },
      { env: 'beach ceremony with golden sand, ocean horizon, and sunset light, destination beach wedding', outfit: 'light beach bridal dress in flowing chiffon or light silk, natural beach jewelry, barefoot elegance', icon: '🏖️', chBase: '沙灘婚禮' },
      { env: 'forest ceremony in dappled light with ancient trees and moss, fairy-tale woodland wedding', outfit: 'romantic forest bridal gown with natural texture and organic detail, woodland flower accessories', icon: '🌲', chBase: '森林婚禮' },
      { env: 'grand ballroom with crystal chandeliers and magnificent scale, luxury event wedding', outfit: 'ballgown silhouette bridal dress in full skirt with crystal beading, ballroom-appropriate luxury', icon: '💎', chBase: '豪華舞廳' },
      { env: 'studio fashion shoot with professional lighting and minimalist set, editorial bridal beauty', outfit: 'editorial bridal fashion in avant-garde or classic designer quality, fashion-forward bridal', icon: '📸', chBase: '時尚攝影棚' },
      { env: 'luxury hotel suite with designer interior and premium lifestyle, queen-power fashion shoot', outfit: 'power queen fashion outfit in luxury fabric — tailored suit or executive gown, commanding elegance', icon: '🏨', chBase: '奢華套房' },
      { env: 'fashion runway finale with dramatic lighting and high fashion atmosphere', outfit: 'runway-caliber fashion look with editorial dramatic styling, high fashion statement piece', icon: '👑', chBase: '時裝秀台' },
      { env: 'elegant private garden party with champagne and social elegance, luxury lifestyle setting', outfit: 'cocktail or garden party fashion in premium fabric, seasonal color palette, social elegance', icon: '🥂', chBase: '私人派對' },
    ],
    variants: [
      { sfx: '·優雅', sub: '優雅從容', prop: 'standing with composed bridal or fashion elegance, one hand lightly holding veil or bouquet, face toward camera', comp: 'full body with gown silhouette fully visible, elegant setting framing, face clearly readable' },
      { sfx: '·漫步', sub: '花徑漫步', prop: 'walking gracefully through the wedding or fashion setting, gown in natural motion, face toward camera with gentle smile', comp: 'full body in elegant walking, setting providing wedding or fashion narrative, face clearly readable' },
      { sfx: '·回眸', sub: '回眸一笑', prop: 'three-quarter rear position with face turning back toward camera, veil or train flowing, bridal grace in rotation', comp: 'three-quarter body rotation, veil or gown as visual narrative, face clearly visible' },
      { sfx: '·端坐', sub: '端坐等候', prop: 'seated gracefully with gown arranged around the seating position, hands folded, face toward camera with bridal calm', comp: 'seated portrait with gown fully visible, wedding setting as context, face clearly readable' },
      { sfx: '·捧花', sub: '玫瑰捧花', prop: 'holding bouquet at chest level with both hands, face toward camera with bridal warmth', comp: 'medium to full body with bouquet as prop, wedding setting as context, face clearly lit' },
      { sfx: '·撩裙', sub: '輕撩婚紗', prop: 'one hand lightly lifting the hem of the gown, face toward camera with playful bridal grace', comp: 'full body with gown hem gesture, elegant setting, face clearly readable with bridal joy' },
      { sfx: '·擁光', sub: '光中佇立', prop: 'standing in the best light of the venue with composed radiance, face toward camera beautifully illuminated', comp: 'full body in beautiful venue light, gown catching light, face perfectly illuminated' },
      { sfx: '·女王', sub: '女王氣場', prop: 'standing with power fashion composure, commanding presence in fashion outfit, face toward camera with queen energy', comp: 'full body with power fashion silhouette, luxury setting reinforcing status, face dominant' },
      { sfx: '·邊框', sub: '花環邊框', prop: 'framed by floral arch or natural elements, face toward camera within the natural frame of the setting', comp: 'full body within floral or natural frame, wedding setting completing the picture' },
      { sfx: '·序幕', sub: '婚禮序幕', prop: 'standing at the threshold of the ceremony venue as if about to enter, face toward camera in pre-ceremony anticipation', comp: 'full body at venue threshold, ceremony setting visible ahead, face with bridal anticipation' },
    ],
  },

];

// ─── Generate CATS Array ────────────────────────────────────────────────────
const CATS = CATEGORY_DEFS.map((catDef, catIdx) => {
  const entries = [];
  for (let envIdx = 0; envIdx < 10; envIdx++) {
    const setting = catDef.settings[envIdx];
    for (let varIdx = 0; varIdx < 10; varIdx++) {
      const variant = catDef.variants[varIdx];
      const entryNum = envIdx * 10 + varIdx + 1;
      entries.push({
        id: entId(catIdx, entryNum - 1),
        name: `${setting.chBase}${variant.sfx}`,
        sub: variant.sub,
        icon: setting.icon,
        scene: setting.env,
        outfit: setting.outfit,
        prop: variant.prop,
        comp: variant.comp,
        mk: catDef.mk,
        tpl: catDef.tpl,
      });
    }
  }
  return {
    id: catDef.id,
    name: catDef.name,
    icon: catDef.icon,
    tpl: catDef.tpl,
    entries,
  };
});

// Validate
let total = 0;
CATS.forEach(c => {
  total += c.entries.length;
  console.error(`${c.id} (${c.name}): ${c.entries.length} entries`);
});
console.error(`Total: ${total}`);

writeFileSync(
  'C:\\AIProjects\\測試區\\紅兵風格寫真咒語產生器\\scripts\\cats_1500_output.json',
  JSON.stringify(CATS, null, 2)
);
console.error('Written to scripts/cats_1500_output.json');
