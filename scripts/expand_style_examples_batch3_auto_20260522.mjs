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

const AUTO_ADDITIONS = {
  song_grace: [
    ["宋代香篆夜讀", "書窗殘燈", "🕯️", "晚間書案、香篆輕煙、淡青褙子與卷軸", "oriental"],
    ["宋代汴河畫舫", "雨絲欄影", "🚣", "汴河畫舫、細雨水紋、淡灰羅裙與油紙傘", "oriental"],
    ["宋代花朝小集", "庭院簪花", "🌺", "春日庭院、花朝雅會、簪花羅裙與花籃", "gudian_hong"],
    ["宋代焚香抄經", "古寺清晨", "📜", "古寺晨鐘、香案經卷、素色褙子與木魚", "oriental"],
    ["宋代青瓷煮雪", "雪庭茶席", "🍵", "雪庭茶席、青瓷茶器、月白披肩與手爐", "oriental"],
    ["宋代湖亭聽雨", "芭蕉風簷", "🌧️", "湖亭芭蕉、細雨敲簷、淡墨長裙與琴案", "oriental"],
    ["宋代女史題壁", "畫屏春山", "🖌️", "畫屏春山、書齋粉牆、青綠褙子與毛筆", "oriental"],
    ["宋代金石藏玩", "汝窯天光", "🏺", "汝窯青瓷、金石案几、象牙披帛與玉簪", "oriental"],
  ],
  ming_grace: [
    ["明代藥香女醫", "太醫署晨光", "🌿", "太醫署藥櫃、清晨斜光、素雅襖裙與藥箱", "oriental"],
    ["明代海禁遠眺", "月港潮聲", "🌊", "海港城樓、潮聲帆影、青黑披風與令牌", "gudian_hong"],
    ["明代祭海聖女", "海神香案", "🕯️", "海神香案、風中旗幟、硃紅禮裙與供盤", "gongting"],
    ["明代竹影清供", "畫閣修竹", "🎋", "修竹畫閣、石桌清供、淡綠長衫與折扇", "oriental"],
    ["明代金陵詞宴", "畫舫流光", "🏮", "金陵畫舫、燈影流光、鵝黃襖裙與詩箋", "gudian_hong"],
    ["明代宮門巡夜", "朱樓鼓角", "🛡️", "宮門夜巡、鼓角回聲、深色飛魚服與佩刀", "gongting"],
    ["明代繡坊初晴", "雲錦曬帛", "🧵", "繡坊天井、雲錦曬帛、粉藍馬面裙與繡繃", "gudian_hong"],
    ["明代江南月宴", "桂影畫橋", "🌙", "畫橋桂影、江南夜宴、月白褙子與小宮燈", "oriental"],
  ],
  qing_grace: [
    ["清宮晨省", "慈寧花影", "🌼", "慈寧宮花影、晨省儀節、石青旗裝與朝珠", "gongting"],
    ["清代書房格格", "窗雪硯香", "❄️", "書房窗雪、硯香淡墨、月白旗裝與詩冊", "oriental"],
    ["清代王府春宴", "海棠屏風", "🌸", "王府春宴、海棠屏風、粉藍旗服與小宮扇", "gongting"],
    ["清代木蘭秋獵", "圍場晨霧", "🏹", "木蘭圍場、晨霧草原、箭袖騎裝與弓袋", "gongting"],
    ["清代雨巷旗人", "江南行館", "☔", "江南行館、雨巷青石、墨綠旗服與油紙傘", "oriental"],
    ["清代點翠賞燈", "上元夜河", "🏮", "上元夜河、點翠頭面、紅金禮服與提燈", "gongting"],
    ["清代宮牆聽雪", "長街靜夜", "🌨️", "紅牆靜夜、積雪宮道、深紫斗篷與手爐", "gongting"],
    ["清代御園折柳", "昆明湖畔", "🌿", "御園湖畔、柳影春風、淡青旗裝與折柳枝", "oriental"],
  ],
  queen: [
    ["女王·群山法典", "雪嶺誓令", "📜", "雪嶺王座、法典卷軸、銀白披風與權杖", ""],
    ["女王·潮汐加冕", "海崖王權", "🌊", "海崖王座、潮汐拍岸、深藍冠冕與長披風", ""],
    ["女王·蒸汽議政", "齒輪宮廳", "⚙️", "蒸汽宮廳、黃銅齒輪、黑金制服與手套", ""],
    ["女王·星圖命令", "天文高塔", "✨", "天文高塔、星圖圓盤、紫黑披袍與水晶冠", ""],
    ["女王·荒原巡狩", "旌旗邊境", "🐎", "荒原邊境、旌旗獵獵、皮革長靴與披風", ""],
    ["女王·玉殿晨會", "白玉朝階", "🤍", "白玉朝階、晨光入殿、珍珠王冠與宮袍", ""],
    ["女王·夜港統治", "燈塔航令", "🗼", "夜港燈塔、黑海微光、長外套與金屬腰封", ""],
    ["女王·鏡廳詔令", "晶宮回聲", "🪞", "晶宮鏡廳、折射光線、銀灰禮服與細冠", ""],
  ],
  holy_angel: [
    ["雲海守誓天使", "誓門晨鐘", "☁️", "雲海誓門、晨鐘金光、羽翼鎧甲與長槍", ""],
    ["聖泉療癒使", "白石水庭", "💧", "白石水庭、聖泉微光、珍珠白長袍與水瓶", ""],
    ["審判台階天使", "金階裁決", "⚖️", "金階審判台、日光穿堂、金白鎧甲與法典", ""],
    ["星穹報信使", "天窗聖堂", "🌟", "天窗聖堂、星穹折光、長翼披肩與號角", ""],
    ["晨曦祈禱者", "百合祭壇", "🕊️", "百合祭壇、晨曦薄霧、白紗禮袍與百合束", ""],
    ["神殿巡光者", "琉璃回廊", "🪟", "琉璃回廊、彩窗聖光、銀線聖袍與羽飾", ""],
    ["寧光守夜天使", "靜夜碑庭", "🌙", "靜夜碑庭、月色石柱、深白長袍與燭燈", ""],
    ["冠羽歌詠使", "弦光穹頂", "🎶", "弦光穹頂、聖樂回響、羽冠長裙與豎琴", ""],
  ],
  goddess_myth: [
    ["月海女神", "潮汐神殿", "🌕", "月海神殿、潮汐銀光、珍珠白長裙與月冠", "xianxia"],
    ["豐穰穀神", "金麥聖野", "🌾", "金麥聖野、祭穀高台、亞麻長裙與穗束", "oriental"],
    ["黎明曙神", "朝霞山門", "🌅", "朝霞山門、晨霧金光、珊瑚色禮裙與光冠", "xianxia"],
    ["森林獵神", "鹿角秘徑", "🦌", "林中秘徑、鹿角祭壇、苔綠獵裝與銀弓", "wuxia"],
    ["火山熔星女神", "赤焰祭壇", "🔥", "赤焰祭壇、火山煙光、黑紅披袍與熔晶冠", "yaohou"],
    ["河源命運神女", "三泉分界", "🌀", "三泉分界、水霧石階、青藍長裙與命線環", "xianxia"],
    ["冥夜花神", "月下冥園", "🌺", "月下冥園、黑花綻放、深紫紗裙與夜花頭飾", "fox_noir"],
    ["晨星守序神女", "白金神柱", "⭐", "白金神柱、晨星光束、白金禮服與星形權杖", "xianxia"],
  ],
  spirits: [
    ["桃枝狐靈", "春祠夜火", "🦊", "春祠夜火、桃枝微光、緋色長裙與狐面飾", "fox"],
    ["山魈鼓舞者", "古木祭坪", "🥁", "古木祭坪、獸骨小鼓、深褐披風與藤飾", "fox_noir"],
    ["螢河水魅", "蘆花夜泊", "🪷", "蘆花夜泊、螢河倒影、青綠水紗與珠鏈", "mermaid"],
    ["紙傘魅影", "長街雨霧", "☂️", "長街雨霧、舊城紙傘、墨紫披帛與鈴飾", "fox_noir"],
    ["山茶花魄", "紅牆靜庭", "🌹", "紅牆靜庭、山茶落瓣、深紅交領與玉鐲", "fox"],
    ["雪狐夜巡", "殘碑雪原", "❄️", "殘碑雪原、狐火映雪、銀灰披風與短靴", "fox_noir"],
    ["古井水靈", "石欄月華", "🪞", "石欄古井、月華倒影、湖藍長裙與水紋環", "mermaid"],
    ["霜林鹿妖", "白樺晨霧", "🦌", "白樺晨霧、霜林鹿影、灰綠斗篷與角飾", "wuxia"],
  ],
  modern_lady: [
    ["高鐵月台通勤者", "晨班首發", "🚄", "清晨月台、玻璃反光、極簡大衣與行李箱", ""],
    ["精品珠寶策展人", "玻璃展櫃", "💍", "珠寶展櫃、暖白射燈、黑色套裝與白手套", ""],
    ["城市夜班主播", "落地窗錄影棚", "🎤", "錄影棚夜景、螢幕冷光、俐落套裝與耳麥", ""],
    ["美術館策展總監", "白牆長廊", "🖼️", "美術館長廊、留白光影、灰白長裙與平底鞋", ""],
    ["私人銀行顧問", "安靜會客室", "💼", "高端會客室、深色木牆、米色套裝與文件夾", ""],
    ["港灣晚餐名媛", "玻璃餐廳", "🥂", "玻璃餐廳、港灣夜色、絲緞長裙與手包", ""],
    ["書店講座作家", "獨立書牆", "📚", "獨立書店、暖木書牆、針織外套與筆記本", ""],
    ["高端健身教練", "全景落地窗", "🏃", "全景健身館、晨光窗景、機能運動裝與外套", ""],
  ],
  wedding_diamond: [
    ["雪國教堂婚紗", "鐘樓白晨", "⛪", "雪國教堂、鐘樓晨光、毛領婚紗與長手套", ""],
    ["遊艇甲板婚紗", "港灣金浪", "🛥️", "遊艇甲板、港灣金浪、緞面婚紗與短頭紗", ""],
    ["溫室花園婚紗", "玻璃穹頂", "🌿", "玻璃穹頂、溫室花園、花瓣婚紗與花束", ""],
    ["月光湖岸婚紗", "銀波倒影", "🌙", "月光湖岸、銀波倒影、珠光婚紗與披肩", ""],
    ["博物館階梯婚紗", "古典大廳", "🏛️", "古典大廳、白石階梯、長尾婚紗與耳墜", ""],
    ["晨霧草原婚紗", "野花微光", "🌼", "草原晨霧、野花微光、薄紗婚紗與花環", ""],
    ["歌劇院婚紗", "金色包廂", "🎭", "歌劇院包廂、金色燈光、華麗婚紗與短手套", ""],
    ["燈塔海崖婚紗", "風鹽誓言", "🗼", "海崖燈塔、風鹽誓言、貼身婚紗與長披紗", ""],
  ],
  hotdrama: [
    ["長街懸案", "燈下追兇", "🕵️", "古城長街、疑案燈影、深色披風與卷宗", "wuxia"],
    ["冷宮翻案", "雪夜證詞", "📜", "冷宮雪夜、證詞密卷、素色宮服與手燈", "gongting"],
    ["王城藥局", "救命藥香", "🌿", "藥局深院、藥香木櫃、青綠衣衫與藥包", "oriental"],
    ["禁軍護送", "朱門風聲", "🛡️", "朱門風聲、禁軍巡道、墨色官服與佩刀", "gongting"],
    ["江湖客棧", "夜雨埋伏", "🏮", "江湖客棧、夜雨埋伏、短斗篷與竹劍", "wuxia"],
    ["河岸密令", "小舟傳書", "🚣", "河岸小舟、傳書密令、素衣披帛與信筒", "oriental"],
    ["朝堂對弈", "珠簾權謀", "♟️", "珠簾朝堂、權謀暗線、深紫宮服與奏摺", "gongting"],
    ["邊城烽火", "暮色回營", "🔥", "邊城烽火、暮色回營、戰袍披風與令旗", "wuxia"],
  ],
  china_drama: [
    ["玉樓春·孫家春宴", "花廳回眸", "🌸", "花廳春宴、珠簾燈影、明制裙裝與團扇", "gongting"],
    ["周生如故·長安守候", "城樓晚風", "🏯", "城樓晚風、宮牆遠燈、素色長裙與披風", "oriental"],
    ["長風渡·市井新婚", "雨巷紅燈", "🏮", "市井雨巷、紅燈簷影、喜服外罩與油紙傘", "gongting"],
    ["玉骨遙·雪山誓言", "神廟晨光", "❄️", "雪山神廟、晨光祭壇、仙系長袍與玉飾", "xianxia"],
    ["雲之羽·宮門暗潮", "石階夜霧", "🌫️", "石階夜霧、宮門暗潮、黑綠長衫與短刃", "fox_noir"],
    ["寧安如夢·書局初見", "紙墨微塵", "📚", "書局紙墨、暖燈微塵、清雅裙裝與書冊", "oriental"],
    ["墨雨雲間·庭院布局", "棋盤深意", "♟️", "庭院棋盤、簷影花窗、青灰羅裙與棋子", "gudian_hong"],
    ["一念關山·關隘夜行", "火把山道", "🗡️", "關隘山道、火把夜行、俠氣披風與佩劍", "wuxia"],
  ],
  reference_styles: [
    ["雕塑博物館肖像", "大理石留白", "🗿", "白色雕塑館、側窗留白、灰白禮服與硬光雕塑感", "editorial_clean"],
    ["北歐雜誌封面", "冷霧紙張感", "📖", "北歐冷霧、紙張質感、極簡大衣與乾淨輪廓", "editorial_clean"],
    ["雨夜霓虹底片", "都市膠片顆粒", "🌆", "雨夜霓虹、膠片顆粒、深色風衣與反光地面", "editorial_clean"],
    ["古典油畫光束", "畫室窗邊", "🪟", "畫室窗邊、塵埃光束、方領長裙與靜物花瓶", "gudian_hong"],
    ["沙丘極簡大片", "高反差留白", "🏜️", "沙丘極簡、高反差留白、米色長裙與風痕線條", "editorial_clean"],
    ["海邊高訂剪影", "逆風絲緞", "🌬️", "海邊剪影、絲緞逆風、流線禮服與遠岸薄霧", "editorial_clean"],
    ["黑白劇場肖像", "聚光面影", "🎬", "黑白劇場、聚光面影、黑色長裙與椅背支撐", "editorial_clean"],
    ["玻璃溫室色塊", "植物通透感", "🌱", "玻璃溫室、植物通透感、淡彩長裙與透明材質", "editorial_clean"],
  ],
};

const MAKEUP_BY_GROUP = {
  song_grace: "oriental",
  ming_grace: "gudian_hong",
  qing_grace: "gongting",
  hotdrama: "oriental",
  china_drama: "oriental",
  reference_styles: "editorial_clean",
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
  if (!prefix) throw new Error(`Missing id prefix for ${categoryId}`);
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
      "choosing a calm story-driven classical action that fits the role and setting while keeping the face-body relationship natural and identity-safe",
      "using composed hand placement, stable shoulders, and a readable three-quarter body angle so costume detail supports the story without stiffness",
      "letting ritual, study, tea, travel, or court context shape the posture instead of relying on a generic static pose",
    ],
    regal: [
      "letting authority guide the gesture through stillness, decree-like hand placement, or measured forward motion while keeping the face unmistakably readable",
      "using a sovereign or sacred presence with stable shoulders, compatible head and torso alignment, and narrative control rather than theatrical distortion",
      "occupying the ceremonial axis of the scene with controlled posture, readable costume logic, and strong face-body coherence",
    ],
    fantasy: [
      "using a role-appropriate supernatural action that feels narrative and readable, with the face open and naturally connected to the body",
      "letting the fantasy environment shape the movement through ritual, listening, offering, or cautious motion while avoiding face-obscuring effects",
      "using magical atmosphere to support the subject instead of replacing clear anatomy, keeping the head, neck, and torso physically compatible",
    ],
    modern: [
      "using a polished real-world action such as walking, reviewing, presenting, pausing, or adjusting clothing while keeping the face fully visible and natural",
      "letting the professional or lifestyle context guide the pose through movement and environment interaction rather than a stiff front-facing stance",
      "using confident but believable city-photo body language, with relaxed shoulders, readable hands, and grounded identity-safe posture",
    ],
    bridal: [
      "behaving like a bride inside a real ceremonial or emotional moment by gathering the dress, pausing at an aisle, or reacting softly to the setting",
      "using veil, bouquet, or gown movement as supporting rhythm while keeping the face-body connection natural and identity-safe",
      "letting the wedding space guide a soft turn, a small step, or a composed pause rather than a mannequin-like formal pose",
    ],
    drama: [
      "using a story-first action tied to court intrigue, investigation, travel, battle, or reunion while keeping the face readable and the body naturally aligned",
      "letting the scene logic drive the gesture through a decree, letter, lamp, blade, or glance toward the setting instead of exaggerated twisting",
      "using a role-appropriate dramatic pause with controlled shoulders, clear facial readability, and coherent head-to-torso direction",
    ],
    reference: [
      "using an editorial action that feels intentional but identity-safe, with clear face visibility and natural body support",
      "letting the visual concept shape the posture through texture, lighting, and material interaction rather than theatrical posing",
      "using a controlled portrait movement with readable hands, stable shoulders, and a clean relationship between face and body",
    ],
  };
  return chooseByHash(seed, groups[propGroup(categoryId)]);
}

function buildComp(categoryId, entryId) {
  const seed = hashText(`${categoryId}:${entryId}:comp`);
  const groups = {
    historical: [
      "vertical classical portrait with clear face, elegant body angle, and enough environmental depth to support the character's story",
      "vertical full-body or three-quarter historical composition, costume layers clearly visible, face unobstructed, and architecture or landscape guiding the eye",
      "vertical story-led costume portrait, face readable from a stable angle, body naturally aligned, and period styling legible from head to hem",
    ],
    regal: [
      "vertical regal portrait with strong architectural or symbolic axis, clear face, stable body silhouette, and ceremonial depth supporting authority",
      "vertical sovereignty composition with full styling readable, face unobstructed, and environment reinforcing power without overpowering identity",
      "vertical throne, shrine, or ritual portrait, body grounded and naturally connected to the face, with strong but controlled scene hierarchy",
    ],
    fantasy: [
      "vertical fantasy portrait with clear face, readable body line, and atmospheric effects placed around rather than over the subject",
      "vertical magical-environment composition, face unobstructed, body readable, and supernatural details supporting the narrative without hiding anatomy",
      "vertical three-quarter fantasy portrait, stable facial visibility, readable costume silhouette, and layered worldbuilding behind the subject",
    ],
    modern: [
      "vertical lifestyle portrait with clear face, believable body angle, and enough environmental detail to preserve the modern setting",
      "vertical city-editorial composition, face readable, body naturally anchored, and architectural lines supporting a polished but realistic silhouette",
      "vertical contemporary portrait with readable clothing shape, grounded stance, and scene depth that feels like a real photographed space",
    ],
    bridal: [
      "vertical bridal portrait with clear face, readable gown volume, and romantic depth built from architecture, veil, flowers, or light",
      "vertical three-quarter to full-body wedding composition, face stable and identity-preserving, dress detail visible from shoulder to hem",
      "vertical ceremony portrait with unobstructed face, balanced body line, and enough surrounding space for the wedding atmosphere to breathe",
    ],
    drama: [
      "vertical drama-led portrait, clear face, readable costume silhouette, and enough scene depth to support plot and atmosphere without obscuring identity",
      "vertical three-quarter historical-drama composition, body naturally aligned, face unobstructed, and props integrated without covering the subject",
      "vertical story composition with readable hands, costume, and environment, keeping dramatic tension secondary to face-body coherence",
    ],
    reference: [
      "vertical editorial portrait with clean face readability, controlled body support, and strong material or light language without distortion",
      "vertical concept portrait with stable anatomy, clear facial visibility, and enough compositional space for the visual idea to register cleanly",
      "vertical premium portrait framing, face crisp and unobstructed, body naturally supported, and style cues layered through lighting and setting",
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

function loadExistingStyleMarkdown() {
  return normalize(fs.readFileSync(STYLE_MD_PATH, "utf8"));
}

function main() {
  const original = fs.readFileSync(INDEX_PATH, "utf8");
  const catsBlock = extractCatsBlock(original);
  const cats = vm.runInNewContext(`(${catsBlock.arrayText})`);
  const styleMdNorm = loadExistingStyleMarkdown();
  const report = [];

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
      const makeup = mk || MAKEUP_BY_GROUP[category.id];
      if (makeup) entry.mk = makeup;

      category.entries.push(entry);
      existingNorms.add(normalize(name));
      existingNorms.add(normalize(sub));
      existingNorms.add(comboNorm);
      existingStems.add(stem);
      added += 1;
    }
    report.push(`${category.id}\t+${added}\tskip=${skipped}\ttotal=${category.entries.length}`);
  }

  const updatedArray = JSON.stringify(cats, null, 2);
  const updated = `${original.slice(0, catsBlock.start)}${updatedArray}${original.slice(catsBlock.end)}`;
  fs.writeFileSync(INDEX_PATH, updated, "utf8");
  console.log(report.join("\n"));
}

main();
