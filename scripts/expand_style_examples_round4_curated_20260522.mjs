import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "index.html");
const STYLE_MD_PATH = path.join(ROOT, "核心資料", "風格範例.md");

const CATEGORY_PREFIX = {
  song_grace: "sg",
  ming_grace: "mg",
  qing_grace: "qg",
  queen: "qu",
  holy_angel: "ha",
  goddess_myth: "gm",
  spirits: "sp",
  modern_lady: "ml",
  wedding_diamond: "wd",
  hotdrama: "hd",
  china_drama: "cd",
  reference_styles: "ref",
};

const CATEGORY_TITLE = {
  song_grace: "宋代系列",
  ming_grace: "明代系列",
  qing_grace: "清代系列",
  queen: "女王系列",
  holy_angel: "聖堂天使",
  goddess_myth: "神話女神",
  spirits: "妖靈人物",
  modern_lady: "都市麗人",
  wedding_diamond: "鑽石婚紗",
  hotdrama: "熱播陸劇",
  china_drama: "大陸熱播劇",
  reference_styles: "參考圖精選",
};

const MAKEUP_BY_GROUP = {
  song_grace: "song_pearl_lady",
  ming_grace: "gudian_hong",
  qing_grace: "gongting",
  queen: "imperial_empress",
  holy_angel: "angel_holy",
  goddess_myth: "oracle_gold",
  spirits: "fox_noir",
  modern_lady: "editorial",
  wedding_diamond: "wedding",
  hotdrama: "cinematic",
  china_drama: "cinematic",
  reference_styles: "editorial",
};

const ATMOSPHERE_BY_GROUP = {
  song_grace: "restrained Song literati presence, calm intelligence, natural human realism, clear face readability",
  ming_grace: "Ming dynasty cultural richness, poised dignity, grounded historical realism, clear face readability",
  qing_grace: "Qing court ceremonial restraint, refined discipline, grounded historical realism, clear face readability",
  queen: "sovereign command, measured authority, emotionally controlled presence, clear face readability",
  holy_angel: "sacred calm, luminous order, compassionate vigilance, clear face readability",
  goddess_myth: "mythic ritual power, symbolic presence, calm divine gravity, clear face readability",
  spirits: "folklore mystery, watchful intelligence, restrained supernatural atmosphere, clear face readability",
  modern_lady: "contemporary confidence, polished realism, believable real-world presence, clear face readability",
  wedding_diamond: "bridal tenderness, ceremonial stillness, natural emotional warmth, clear face readability",
  hotdrama: "high-stakes story tension, role-driven action, grounded human realism, clear face readability",
  china_drama: "recognizable drama-world presence, emotional clarity, grounded human realism, clear face readability",
  reference_styles: "reference-led editorial restraint, material awareness, natural human realism, clear face readability",
};

const QUALITY_BY_GROUP = {
  song_grace: "premium Song-inspired portrait, natural skin, coherent anatomy, detailed textile texture, stable identity-first realism",
  ming_grace: "premium Ming-inspired portrait, natural skin, coherent anatomy, detailed textile texture, stable identity-first realism",
  qing_grace: "premium Qing-inspired portrait, natural skin, coherent anatomy, detailed textile texture, stable identity-first realism",
  queen: "premium sovereign portrait, natural skin, coherent anatomy, detailed fabric and jewelry texture, stable identity-first realism",
  holy_angel: "premium celestial portrait, natural skin, coherent anatomy, readable luminous detail, stable identity-first realism",
  goddess_myth: "premium mythological portrait, natural skin, coherent anatomy, symbolic costume detail, stable identity-first realism",
  spirits: "premium folklore fantasy portrait, natural skin, coherent anatomy, readable magical detail, stable identity-first realism",
  modern_lady: "premium contemporary editorial portrait, natural skin, coherent anatomy, refined wardrobe detail, stable identity-first realism",
  wedding_diamond: "premium bridal portrait, natural skin, coherent anatomy, refined gown texture, stable identity-first realism",
  hotdrama: "premium costume-drama portrait, natural skin, coherent anatomy, readable plot-oriented styling, stable identity-first realism",
  china_drama: "premium drama-inspired portrait, natural skin, coherent anatomy, readable character styling, stable identity-first realism",
  reference_styles: "premium editorial concept portrait, natural skin, coherent anatomy, refined material detail, stable identity-first realism",
};

const AUTO_ADDITIONS = {
  song_grace: [
    ["宋代雨榭調香", "簾影爐煙", "🪔", "雨榭簾影、香爐細煙、月白褙子與香牌", "song_pearl_lady"],
    ["宋代雪窗織錦", "絹機微響", "🧵", "雪窗絹機、細緯絲線、淡杏長裙與梭具", "song_pearl_lady"],
    ["宋代水閣觀荷", "晨露風荷", "🪷", "水閣晨露、風荷微動、藕粉披帛與團扇", "song_pearl_lady"],
    ["宋代溪亭試墨", "石橋晴波", "🖋️", "溪亭石橋、晴波映影、青灰褙子與硯台", "oriental"],
    ["宋代畫屏理弦", "鳳尾箏心", "🎼", "畫屏靜室、鳳尾古箏、米白長裙與琴譜", "song_pearl_lady"],
    ["宋代花窗品茗", "瓷盞春溫", "🍵", "花窗柔光、瓷盞茶氣、嫩綠褙子與茶盤", "oriental"],
  ],
  ming_grace: [
    ["明代茶馬會盟", "驛亭山雨", "🐎", "驛亭山雨、茶馬古道、藏青披風與竹簡", "gudian_hong"],
    ["明代宮苑焚香", "金獸煙篆", "🪔", "宮苑深處、金獸香爐、朱紅襖裙與香匙", "gongting"],
    ["明代文會看畫", "曲廊春池", "🖼️", "曲廊春池、捲軸古畫、月白馬面裙與畫軸", "gudian_hong"],
    ["明代邊關傳令", "鼓樓殘照", "📯", "鼓樓殘照、邊關風沙、深青披甲與令箭", "gongting"],
    ["明代舟中夜話", "槳聲燈影", "🛶", "水巷畫舫、槳聲燈影、素色襖裙與手燈", "oriental"],
    ["明代雨庭晾書", "竹影微青", "📚", "雨庭竹影、木架晾書、煙青長衫與書冊", "oriental"],
  ],
  qing_grace: [
    ["清宮鏡閣理妝", "翠羽晨光", "🪞", "鏡閣晨光、點翠頭面、湖藍旗裝與小妝盒", "gongting"],
    ["清代園林品畫", "柳岸春池", "🎨", "園林春池、柳岸花影、粉綠旗服與畫卷", "oriental"],
    ["清代雪廊傳箋", "紅牆靜音", "✉️", "雪廊紅牆、靜音深庭、月白斗篷與信箋", "gongting"],
    ["清代花神祈歲", "福字燈河", "🏮", "燈河福字、歲末祈願、石榴紅旗裝與花枝", "gongting"],
    ["清代避暑山莊", "松風晚照", "🌲", "松風晚照、山莊回廊、淺青旗裝與折扇", "oriental"],
    ["清代行宮閱策", "雕窗茶霧", "📜", "行宮雕窗、茶霧輕起、深藍旗服與策卷", "gongting"],
  ],
  queen: [
    ["女王・霜原巡典", "白鹿旌旗", "🦌", "霜原風口、白鹿旌旗、銀灰禮袍與權戒", ""],
    ["女王・曜石諭令", "黑塔議庭", "🪨", "黑塔議庭、曜石長階、墨金長袍與戒杖", ""],
    ["女王・晨海頒令", "鹽風高台", "🌤️", "海崖高台、鹽風晨光、珍珠白披風與印章", ""],
    ["女王・月港回廊", "藍焰燈列", "🌙", "月港回廊、藍焰燈列、午夜藍禮服與腰封", ""],
    ["女王・金穗授冠", "收穫大殿", "🌾", "收穫大殿、金穗高柱、赭金長裙與冠飾", ""],
    ["女王・雲闕閱兵", "風旗天階", "☁️", "雲闕天階、風旗列陣、白金軍禮袍與肩章", ""],
  ],
  holy_angel: [
    ["聖環執卷使", "雲門裁示", "📘", "雲門聖堂、金環浮光、乳白長袍與卷冊", ""],
    ["曙色巡塔天使", "鐘翼晨風", "🕊️", "高塔鐘翼、晨風回旋、淡金披肩與手燈", ""],
    ["聖歌水庭天使", "白羽回音", "🎶", "白石水庭、回音穹頂、珍珠禮袍與短杖", ""],
    ["百合護門使", "石階靜耀", "🌼", "石階護門、百合靜耀、銀白戰裙與長匙", ""],
    ["祈雨雲廊天使", "薄光垂幕", "🌧️", "雲廊薄光、垂幕輕動、象牙色長衣與水瓶", ""],
    ["星紋照夜使", "穹窗守望", "✨", "穹窗守望、星紋地坪、霧白長袍與羽紋環", ""],
  ],
  goddess_myth: [
    ["霜林司命神女", "銀枝秘壇", "🌲", "銀枝秘壇、霜林晨息、灰藍祭裙與命紋牌", "oracle_gold"],
    ["潮月引航女神", "海圖石臺", "🧭", "海圖石臺、潮月銀光、靛藍長袍與貝冠", "oracle_gold"],
    ["穀穗祝禱神女", "秋壇暖風", "🌾", "秋壇暖風、穀穗金波、米金禮裙與麥束", "flower_fairy"],
    ["火紋護城神女", "熔脈高牆", "🔥", "熔脈高牆、火紋微耀、赤黑披袍與火印", "yaohou"],
    ["晨泉啟示女神", "石泉階影", "💧", "石泉階影、晨光薄霧、淺金長裙與水紋杖", "oracle_gold"],
    ["暮星授夢神女", "紫穹拱門", "⭐", "紫穹拱門、暮星流線、葡紫祭服與星輪", "xianxia"],
  ],
  spirits: [
    ["紙燈狐魅", "舊橋夜霧", "🏮", "舊橋夜霧、紙燈長列、深紅交領與狐紋鈴", "fox_noir"],
    ["柳塘鷺靈", "晨波微藍", "🪽", "柳塘晨波、蘆影微藍、青白水紗與羽飾", "mermaid_pearl"],
    ["石窟蜃影", "壁火回聲", "🪨", "石窟壁火、回聲深處、灰紫長袍與貝鏡", "fox_noir"],
    ["雪坪狼靈", "白霧斷松", "🐺", "雪坪白霧、斷松殘碑、銀灰斗篷與骨環", "fox_noir"],
    ["河燈水魅", "夜汀流光", "🪔", "河燈夜汀、流光映面、湖綠薄紗與珠鏈", "mermaid"],
    ["山鐘木魅", "苔門靜聽", "🔔", "苔門古鐘、山風靜聽、墨綠披帛與木符", "fox"],
  ],
  modern_lady: [
    ["港區晨會總監", "玻璃碼頭", "🛳️", "玻璃碼頭、晨會動線、米灰西裝與平板文件", ""],
    ["精品飯店經理人", "大廳暖燈", "🏨", "飯店大廳、暖燈石材、深黑套裝與房卡夾", ""],
    ["城市策展顧問", "金屬中庭", "🪩", "金屬中庭、展牆留白、煙灰長裙與名牌證", ""],
    ["高空餐廳主理人", "夜景落地窗", "🍷", "高空餐廳、夜景落地窗、酒紅長裙與菜單夾", ""],
    ["建築事務所合夥人", "模型會議桌", "🏙️", "模型會議桌、冷白天光、卡其套裝與圖紙筒", ""],
    ["週末花市採買者", "清晨街角", "💐", "清晨花市、街角霧光、亞麻洋裝與花束袋", ""],
  ],
  wedding_diamond: [
    ["雪松山谷婚紗", "松影誓言", "🌲", "雪松山谷、晨霧松影、細肩婚紗與長披紗", ""],
    ["美術館廊橋婚紗", "石光留白", "🏛️", "美術館廊橋、石光留白、緞面婚紗與珍珠耳墜", ""],
    ["古港碼頭婚紗", "海風燈塔", "⚓", "古港碼頭、海風燈塔、魚尾婚紗與短手套", ""],
    ["雨夜櫥窗婚紗", "城市倒影", "☔", "城市雨夜、櫥窗倒影、白紗婚裙與透明傘", ""],
    ["葡萄園長桌婚紗", "金藤晚宴", "🍇", "葡萄園長桌、金藤晚宴、象牙婚紗與花束", ""],
    ["古典書庫婚紗", "高窗柔塵", "📚", "古典書庫、高窗柔塵、蕾絲婚紗與髮夾", ""],
  ],
  hotdrama: [
    ["雪階密奏", "夜印未乾", "🧾", "雪階長廊、密奏未乾、月白官服與朱印", "cinematic"],
    ["邊城問藥", "火盆霜晨", "🔥", "邊城藥鋪、火盆霜晨、青褐披袍與藥囊", "oriental"],
    ["殿前留劍", "晨鐘回壁", "🗡️", "殿前石階、晨鐘回壁、墨色長衫與佩劍", "wuxia"],
    ["雨市尋證", "傘影追線", "☂️", "雨市長巷、傘影重疊、深灰斗篷與卷宗袋", "cinematic"],
    ["舟渡暗號", "蘆港微燈", "🛶", "蘆港微燈、夜渡小舟、靛青衣袍與竹匣", "oriental"],
    ["寒營回報", "旗雪壓城", "🏯", "寒營城口、旗雪壓城、暗紅披風與軍報", "wuxia"],
  ],
  china_drama: [
    ["長月燼明・鏡湖試心", "夜水微瀾", "🪞", "鏡湖夜水、微瀾月色、仙系長袍與玉飾", "xianxia"],
    ["夢華錄・花市晨約", "汴京薄霧", "🌸", "汴京花市、清晨薄霧、素色長裙與茶盒", "oriental"],
    ["知否・深院聽雨", "石窗燈影", "🌧️", "深院石窗、夜雨燈影、淡雅裙裝與團扇", "gudian_hong"],
    ["琅琊榜・雪亭籌局", "長燭微紅", "🕯️", "雪亭長燭、局中靜謀、墨青長衫與棋盒", "cinematic"],
    ["與鳳行・山門歸途", "雲橋殘照", "☁️", "山門雲橋、暮色殘照、靈動戰裙與佩飾", "xianxia"],
    ["繁花・櫥窗夜色", "黃浦霓光", "🌆", "黃浦櫥窗、霓光反射、復古套裝與皮手包", "hk_film"],
  ],
  reference_styles: [
    ["石灰光棚肖像", "粉塵定格", "🪨", "石灰色攝影棚、粉塵定格、骨白長裙與硬質材質", "editorial"],
    ["銀鹽暗房封面", "黑框留白", "🧪", "銀鹽暗房、黑框留白、黑色高領與細銀耳飾", "editorial"],
    ["古堡窗景質感", "絨幕冷金", "🏰", "古堡窗景、絨幕冷金、墨綠禮服與舊木椅", "editorial"],
    ["湖霧晨刊大片", "灰藍紙感", "📰", "湖霧清晨、灰藍紙感、長版大衣與皮革手套", "editorial"],
    ["金屬長廊寫真", "反射節奏", "🪞", "金屬長廊、反射節奏、銀灰長裙與硬挺輪廓", "editorial"],
    ["暖沙留白畫報", "低飽和日影", "🏜️", "暖沙留白、低飽和日影、奶茶色洋裝與草編飾物", "editorial"],
  ],
};

function extractCatsBlock(text) {
  const marker = "const CATS = [";
  const start = text.indexOf(marker);
  if (start === -1) throw new Error("CATS declaration not found");
  const open = text.indexOf("[", start);
  let depth = 0;
  let inString = false;
  let quote = "";
  let escape = false;
  let close = -1;
  for (let i = open; i < text.length; i += 1) {
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
    if (ch === "[") depth += 1;
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  if (close === -1) throw new Error("CATS closing bracket not found");
  return { start: open, end: close + 1, arrayText: text.slice(open, close + 1) };
}

function normalize(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/[·・．.，,、：:／/（）()\-—'"`]/g, "")
    .toLowerCase();
}

function extractStem(title) {
  const cleaned = String(title || "").replace(/[·・．.，,、：:／/（）()\-—'"`\s]/g, "");
  return cleaned.slice(0, Math.min(cleaned.length, 6));
}

function nextEntryId(categoryId, entries) {
  const prefix = CATEGORY_PREFIX[categoryId];
  const maxNum = entries
    .map((entry) => {
      const match = String(entry.id || "").match(/_(\d+)$/);
      return match ? Number(match[1]) : 0;
    })
    .reduce((max, value) => Math.max(max, value), 0);
  return `${prefix}_${String(maxNum + 1).padStart(2, "0")}`;
}

function chooseByHash(seed, variants) {
  return variants[Math.abs(seed) % variants.length];
}

function hashText(value) {
  let hash = 0;
  for (const ch of value) hash = (hash * 33 + ch.charCodeAt(0)) | 0;
  return hash;
}

function propGroup(categoryId) {
  if (["song_grace", "ming_grace", "qing_grace"].includes(categoryId)) return "historical";
  if (["queen", "holy_angel", "goddess_myth"].includes(categoryId)) return "regal";
  if (["spirits"].includes(categoryId)) return "fantasy";
  if (["modern_lady"].includes(categoryId)) return "modern";
  if (["wedding_diamond"].includes(categoryId)) return "bridal";
  if (["hotdrama", "china_drama"].includes(categoryId)) return "drama";
  return "reference";
}

function buildProp(categoryId, entryId) {
  const seed = hashText(`${categoryId}:${entryId}:prop`);
  const groups = {
    historical: [
      "using a role-appropriate classical action with stable shoulders, readable hands, and a face-first identity-safe body line",
      "letting study, ceremony, tea, travel, or court context guide the gesture instead of defaulting to a plain standing pose",
      "using a composed pause, a small step, or a controlled sleeve adjustment while keeping the face fully readable and naturally connected to the body",
    ],
    regal: [
      "letting authority guide the gesture through measured stillness, ceremonial hand placement, or controlled forward motion while keeping the face fully readable",
      "using a sovereign or sacred posture with stable shoulders, compatible head and torso alignment, and no theatrical face-body mismatch",
      "occupying the symbolic axis of the scene with calm command, readable costume logic, and strong identity-safe body support",
    ],
    fantasy: [
      "using a restrained supernatural action that feels narrative and readable, with the face open and naturally connected to the body",
      "letting ritual, listening, offering, or watchfulness shape the movement while avoiding face-obscuring effects or extreme twisting",
      "using magical atmosphere to support the subject rather than replace anatomy, keeping the head, neck, shoulders, and torso physically compatible",
    ],
    modern: [
      "using a believable real-world action such as walking, reviewing, presenting, pausing, or lightly interacting with the space while keeping the face fully visible",
      "letting the professional or lifestyle context guide the pose with relaxed shoulders, readable hands, and grounded city-photo body language",
      "using a polished but natural contemporary action, avoiding stiff front-facing posing and avoiding any face-body mismatch",
    ],
    bridal: [
      "behaving like a bride inside a real emotional or ceremonial moment by gathering the gown, pausing at an aisle, or reacting softly to the setting",
      "using bouquet, veil, or gown rhythm only as support while keeping the face-body connection stable, readable, and identity-safe",
      "letting the wedding space guide a soft turn, a small step, or a composed pause instead of a mannequin-like formal pose",
    ],
    drama: [
      "using a story-first action tied to court intrigue, travel, investigation, reunion, or campaign while keeping the face readable and the body naturally aligned",
      "letting the scene logic drive the gesture through a decree, letter, lamp, blade, or prop interaction instead of exaggerated twisting",
      "using a role-appropriate dramatic pause with controlled shoulders, stable neck line, and coherent head-to-torso direction",
    ],
    reference: [
      "using an editorial action that feels intentional but identity-safe, with clear facial readability and natural body support",
      "letting material, light, and environment shape the posture rather than theatrical motion, keeping the subject readable as one real person",
      "using controlled portrait movement with readable hands, stable shoulders, and a clean relationship between face and body",
    ],
  };
  return chooseByHash(seed, groups[propGroup(categoryId)]);
}

function buildComp(categoryId, entryId) {
  const seed = hashText(`${categoryId}:${entryId}:comp`);
  const groups = {
    historical: [
      "vertical classical portrait with clear face, elegant body angle, and enough environmental depth to support the story",
      "vertical full-body or three-quarter historical composition, costume layers readable, face unobstructed, and architecture or landscape guiding the eye",
      "vertical story-led costume portrait with stable facial readability, natural body alignment, and clear period styling from head to hem",
    ],
    regal: [
      "vertical regal portrait with a strong symbolic axis, clear face, stable body silhouette, and ceremonial depth supporting authority",
      "vertical sovereignty composition with full styling readable, face unobstructed, and environment reinforcing power without overpowering identity",
      "vertical throne, shrine, or ritual portrait, body grounded and naturally connected to the face, with controlled scene hierarchy",
    ],
    fantasy: [
      "vertical fantasy portrait with clear face, readable body line, and atmospheric effects placed around rather than over the subject",
      "vertical magical-environment composition with unobstructed face, readable body, and layered worldbuilding that does not hide anatomy",
      "vertical three-quarter fantasy portrait with stable facial visibility, readable costume silhouette, and controlled supernatural depth",
    ],
    modern: [
      "vertical lifestyle portrait with clear face, believable body angle, and enough environmental detail to preserve the modern setting",
      "vertical city-editorial composition with readable clothing shape, grounded stance, and scene depth that feels like a real photographed space",
      "vertical contemporary portrait with stable anatomy, clear facial visibility, and architectural lines supporting a polished but realistic silhouette",
    ],
    bridal: [
      "vertical bridal portrait with clear face, readable gown volume, and romantic depth built from architecture, veil, flowers, or light",
      "vertical three-quarter to full-body wedding composition with stable facial readability and dress detail visible from shoulder to hem",
      "vertical ceremony portrait with unobstructed face, balanced body line, and enough surrounding space for the wedding atmosphere to breathe",
    ],
    drama: [
      "vertical drama-led portrait with clear face, readable costume silhouette, and enough scene depth to support plot and atmosphere without obscuring identity",
      "vertical three-quarter historical-drama composition with body naturally aligned, face unobstructed, and props integrated without covering the subject",
      "vertical story composition with readable hands, costume, and environment, keeping dramatic tension secondary to face-body coherence",
    ],
    reference: [
      "vertical editorial portrait with clean face readability, controlled body support, and strong material or light language without distortion",
      "vertical concept portrait with stable anatomy, clear facial visibility, and enough compositional space for the visual idea to register cleanly",
      "vertical premium portrait framing with crisp unobstructed face, natural body support, and style cues layered through lighting and setting",
    ],
  };
  return chooseByHash(seed, groups[propGroup(categoryId)]);
}

function buildScene(categoryId, name, sub, desc) {
  const bases = {
    song_grace: "Song dynasty refined setting with restrained literati atmosphere",
    ming_grace: "Ming dynasty setting with readable court, garden, or city-culture depth",
    qing_grace: "Qing dynasty palace or banner-family setting with clear ceremonial mood",
    queen: "sovereign portrait setting with symbolic architecture and power atmosphere",
    holy_angel: "holy celestial setting with sacred structure and luminous order",
    goddess_myth: "mythological deity setting with symbolic ritual or natural power atmosphere",
    spirits: "supernatural folklore setting with readable magical environment and story tension",
    modern_lady: "contemporary city or lifestyle portrait setting with polished real-world context",
    wedding_diamond: "bridal setting with ceremony or destination romance and elegant environment depth",
    hotdrama: "Chinese costume-drama setting with plot-rich atmosphere and strong visual stakes",
    china_drama: "Chinese drama-inspired setting with recognizable narrative world and emotional context",
    reference_styles: "reference-driven editorial visual study with intentional light and material language",
  };
  return `${name}, ${sub}, ${bases[categoryId]}, cue details inspired by ${desc}, clear place identity and grounded environmental depth`;
}

function buildOutfit(categoryId, name, desc) {
  const bases = {
    song_grace: "refined Song styling with restrained layers and scholarly detailing",
    ming_grace: "Ming styling with embroidered structure, layered textiles, and period readability",
    qing_grace: "Qing styling with balanced court detail, clear silhouette, and controlled ornamentation",
    queen: "sovereign styling with strong silhouette, controlled regal accessories, and readable authority cues",
    holy_angel: "sacred celestial styling with clean wing or halo logic and luminous ceremonial detailing",
    goddess_myth: "mythic deity styling with symbolic materials, crown logic, and story-led adornment",
    spirits: "folklore creature styling with magical cues kept secondary to facial identity and readable anatomy",
    modern_lady: "contemporary fashion styling with polished structure and grounded lifestyle realism",
    wedding_diamond: "bridal styling with clear gown silhouette, refined ornamentation, and ceremony-appropriate accessories",
    hotdrama: "drama-led costume styling matched to the role, period, and narrative pressure",
    china_drama: "story-driven costume styling that signals character identity without relying on archetype beauty language",
    reference_styles: "editorial styling built around material, texture, silhouette, and lighting behavior",
  };
  return `${bases[categoryId]}, wardrobe direction inspired by ${name}, details drawn from ${desc}`;
}

function buildMarkdownBlock(categoryId, entry) {
  return [
    `### ${entry.name} · ${entry.sub}`,
    `- **ID:** \`${entry.id}\``,
    `- **妝容：** ${entry.mk || MAKEUP_BY_GROUP[categoryId]}`,
    `- **角色氛圍：** ${ATMOSPHERE_BY_GROUP[categoryId]}`,
    `- **場景背景：** ${entry.scene}`,
    `- **服裝：** ${entry.outfit}`,
    `- **道具：** ${entry.prop}`,
    `- **構圖：** ${entry.comp}`,
    `- **品質：** ${QUALITY_BY_GROUP[categoryId]}`,
    "",
  ].join("\n");
}

function appendMarkdown(existingText, groupedEntries) {
  const blocks = [];
  for (const [categoryId, entries] of Object.entries(groupedEntries)) {
    if (!entries.length) continue;
    blocks.push(`## ${CATEGORY_TITLE[categoryId]}（第四輪補充，新增 ${entries.length} 組）`);
    blocks.push("");
    for (const entry of entries) {
      blocks.push(buildMarkdownBlock(categoryId, entry));
    }
  }
  if (!blocks.length) return existingText;
  const stamp = "## 第四輪 Curated 補充（2026-05-22）";
  if (existingText.includes(stamp)) return existingText;
  return `${existingText.trimEnd()}\n\n---\n\n${stamp}\n\n${blocks.join("\n")}`.trimEnd() + "\n";
}

function main() {
  const original = fs.readFileSync(INDEX_PATH, "utf8");
  const styleMd = fs.readFileSync(STYLE_MD_PATH, "utf8");
  const catsBlock = extractCatsBlock(original);
  const cats = vm.runInNewContext(`(${catsBlock.arrayText})`);
  const styleMdNorm = normalize(styleMd);
  const report = [];
  const addedForMarkdown = {};

  for (const category of cats) {
    const additions = AUTO_ADDITIONS[category.id];
    if (!additions) continue;

    const existingNorms = new Set();
    const existingStems = new Set();
    for (const entry of category.entries) {
      existingNorms.add(normalize(entry.name));
      existingNorms.add(normalize(entry.sub));
      existingNorms.add(normalize(`${entry.name}${entry.sub || ""}`));
      existingStems.add(extractStem(entry.name));
    }

    let added = 0;
    let skipped = 0;
    addedForMarkdown[category.id] = [];

    for (const [name, sub, icon, desc, mk] of additions) {
      const comboNorm = normalize(`${name}${sub}`);
      const stem = extractStem(name);
      if (
        existingNorms.has(normalize(name)) ||
        existingNorms.has(normalize(sub)) ||
        existingNorms.has(comboNorm) ||
        existingStems.has(stem) ||
        styleMdNorm.includes(comboNorm) ||
        styleMdNorm.includes(normalize(name))
      ) {
        skipped += 1;
        continue;
      }

      const entryId = nextEntryId(category.id, category.entries);
      const entry = {
        id: entryId,
        name,
        sub,
        icon,
        scene: buildScene(category.id, name, sub, desc),
        outfit: buildOutfit(category.id, name, desc),
        prop: buildProp(category.id, entryId),
        comp: buildComp(category.id, entryId),
      };
      if (mk || MAKEUP_BY_GROUP[category.id]) entry.mk = mk || MAKEUP_BY_GROUP[category.id];

      category.entries.push(entry);
      addedForMarkdown[category.id].push(entry);
      existingNorms.add(normalize(name));
      existingNorms.add(normalize(sub));
      existingNorms.add(comboNorm);
      existingStems.add(stem);
      added += 1;
    }
    report.push(`${category.id}\t+${added}\tskip=${skipped}\ttotal=${category.entries.length}`);
  }

  const updatedArray = JSON.stringify(cats, null, 2);
  const updatedIndex = `${original.slice(0, catsBlock.start)}${updatedArray}${original.slice(catsBlock.end)}`;
  fs.writeFileSync(INDEX_PATH, updatedIndex, "utf8");

  const updatedMarkdown = appendMarkdown(styleMd, addedForMarkdown);
  fs.writeFileSync(STYLE_MD_PATH, updatedMarkdown, "utf8");

  console.log(report.join("\n"));
}

main();
