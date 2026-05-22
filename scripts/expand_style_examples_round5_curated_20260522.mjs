import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "index.html");
const STYLE_MD_PATH = path.join(ROOT, "核心資料", "風格範例.md");

const BAD_TERMS = [
  "heroine",
  "beauty",
  "goddess face",
  "celebrity face",
  "perfect beauty",
  "flawless",
  "luxury beauty",
  "movie trailer",
  "cinematic trailer",
  "turn-back glance",
  "back-facing",
  "jumping",
  "spinning",
  "ue5 cinematic",
];

const MODE_DEFS = {
  travel: {
    roleSuffixes: ["旅人", "漫遊者", "寫真", "行旅者", "風景肖像"],
    subPhrases: ["清晨片刻", "黃昏回聲", "微風停留", "光影定格", "慢步場景"],
    atmosphere: "grounded travel presence, relaxed observation, clear face readability, natural real-world realism",
    quality: "premium travel portrait, natural skin, coherent anatomy, readable location styling, stable identity-first realism",
    outfitBase: "location-aware travel styling with practical layers, readable silhouette, and identity-safe accessories",
    sceneBase: "travel portrait setting with clear environmental identity and grounded realism",
    mkDefault: "outdoor_glow",
    propGroup: "travel",
    compGroup: "travel",
  },
  mountain: {
    roleSuffixes: ["遠行者", "山海寫真", "地景旅人", "風境人物", "長途漫遊者"],
    subPhrases: ["曠野留影", "高線停步", "風景回聲", "長光片刻", "地貌定格"],
    atmosphere: "large-scale destination realism, stable body readability, calm observation, clear face visibility",
    quality: "premium destination portrait, natural skin, coherent anatomy, large-scene readability, stable identity-first realism",
    outfitBase: "destination statement styling balanced with realistic outdoor wear and readable silhouette",
    sceneBase: "grand landscape setting with strong place identity and believable environmental scale",
    mkDefault: "global_sun",
    propGroup: "travel",
    compGroup: "travel",
  },
  hanfu: {
    roleSuffixes: ["古意仕影", "雅集人物", "園林行者", "書閣寫真", "風華剪影"],
    subPhrases: ["簷影停步", "花窗微聲", "園林留光", "階前片刻", "長廊回聲"],
    atmosphere: "restrained historical grace, human realism, clear face readability, calm classical presence",
    quality: "premium hanfu portrait, natural skin, coherent anatomy, detailed textile texture, stable identity-first realism",
    outfitBase: "hanfu styling with restrained layers, readable sleeve rhythm, and balanced classical accessories",
    sceneBase: "Chinese historical setting with clear architectural identity and grounded period atmosphere",
    mkDefault: "gudian_hong",
    propGroup: "historical",
    compGroup: "historical",
  },
  court: {
    roleSuffixes: ["宮廷人物", "殿閣仕影", "朝階寫真", "內苑行者", "簾幕剪影"],
    subPhrases: ["晨省片刻", "宮道留影", "燈庭回聲", "雪院靜候", "殿前停步"],
    atmosphere: "court ceremonial restraint, grounded historical realism, clear face readability, composed authority",
    quality: "premium court portrait, natural skin, coherent anatomy, detailed ceremonial textile texture, stable identity-first realism",
    outfitBase: "court styling with readable ceremonial structure, controlled ornamentation, and balanced historical silhouette",
    sceneBase: "palace or court setting with clear ceremonial mood and grounded historical depth",
    mkDefault: "gongting",
    propGroup: "historical",
    compGroup: "historical",
  },
  tang: {
    roleSuffixes: ["盛唐人物", "長安仕影", "曲江寫真", "宮詞剪影", "花朝行者"],
    subPhrases: ["花宴片刻", "宮燈留影", "曲江回聲", "池畔靜候", "長街微風"],
    atmosphere: "Tang-era opulence with grounded human realism, clear face readability, lively but controlled presence",
    quality: "premium Tang portrait, natural skin, coherent anatomy, rich textile detail, stable identity-first realism",
    outfitBase: "Tang styling with readable volume, balanced floral or court accessories, and grounded ceremonial detail",
    sceneBase: "Tang dynasty setting with lively court or city atmosphere and readable historical depth",
    mkDefault: "tang_peony_soft",
    propGroup: "historical",
    compGroup: "historical",
  },
  song: {
    roleSuffixes: ["宋韻人物", "茶席仕影", "書閣寫真", "水榭行者", "窗下剪影"],
    subPhrases: ["茶煙片刻", "書頁回聲", "簾影留光", "松風靜候", "雪窗微聲"],
    atmosphere: "restrained Song literati presence, calm intelligence, natural human realism, clear face readability",
    quality: "premium Song portrait, natural skin, coherent anatomy, refined textile detail, stable identity-first realism",
    outfitBase: "Song styling with quiet layers, soft drape logic, and refined scholarly detail",
    sceneBase: "Song dynasty literati setting with clear domestic or garden atmosphere",
    mkDefault: "song_pearl_lady",
    propGroup: "historical",
    compGroup: "historical",
  },
  ming: {
    roleSuffixes: ["明制人物", "江南仕影", "畫舫寫真", "書房行者", "繡坊剪影"],
    subPhrases: ["桂影片刻", "河港留光", "廊橋回聲", "夜燈靜候", "窗紗微風"],
    atmosphere: "Ming cultural richness, poised dignity, grounded historical realism, clear face readability",
    quality: "premium Ming portrait, natural skin, coherent anatomy, layered textile detail, stable identity-first realism",
    outfitBase: "Ming styling with readable embroidered structure, period-appropriate layering, and balanced accessories",
    sceneBase: "Ming dynasty setting with city-culture, court, or Jiangnan atmosphere",
    mkDefault: "gudian_hong",
    propGroup: "historical",
    compGroup: "historical",
  },
  qing: {
    roleSuffixes: ["清韻人物", "御園仕影", "旗裝寫真", "宮道行者", "鏡閣剪影"],
    subPhrases: ["雪庭片刻", "宮燈留影", "湖岸微風", "窗影靜候", "松聲回廊"],
    atmosphere: "Qing court ceremonial restraint, refined discipline, grounded historical realism, clear face readability",
    quality: "premium Qing portrait, natural skin, coherent anatomy, refined ceremonial detail, stable identity-first realism",
    outfitBase: "Qing styling with balanced court detail, clear silhouette, and controlled ornamentation",
    sceneBase: "Qing dynasty palace or banner-family setting with readable ceremonial depth",
    mkDefault: "gongting",
    propGroup: "historical",
    compGroup: "historical",
  },
  classical: {
    roleSuffixes: ["古典人物", "庭園仕影", "橋畔寫真", "書齋行者", "月門剪影"],
    subPhrases: ["花窗片刻", "石階留光", "柳岸回聲", "夜燈靜候", "春影微風"],
    atmosphere: "East Asian classical restraint, grounded human realism, clear face readability, elegant stillness",
    quality: "premium classical portrait, natural skin, coherent anatomy, readable material detail, stable identity-first realism",
    outfitBase: "classical East Asian styling with coherent silhouette, restrained accessories, and readable textile logic",
    sceneBase: "East Asian classical setting with clear place identity and grounded atmosphere",
    mkDefault: "oriental",
    propGroup: "historical",
    compGroup: "historical",
  },
  reference: {
    roleSuffixes: ["肖像", "畫報", "習作", "寫真", "封面人物"],
    subPhrases: ["材質研究", "光影留白", "紙感片刻", "構成回聲", "反射定格"],
    atmosphere: "reference-led editorial restraint, material awareness, natural human realism, clear face readability",
    quality: "premium editorial concept portrait, natural skin, coherent anatomy, refined material detail, stable identity-first realism",
    outfitBase: "editorial styling built around material, texture, silhouette, and clean identity-safe fashion direction",
    sceneBase: "reference-driven editorial visual study with intentional light and compositional structure",
    mkDefault: "editorial",
    propGroup: "reference",
    compGroup: "reference",
  },
  xianxia: {
    roleSuffixes: ["仙門人物", "雲階寫真", "靈境行者", "山門剪影", "長亭仕影"],
    subPhrases: ["流雲片刻", "花影靜候", "燈樓回聲", "霧橋留光", "雪殿微風"],
    atmosphere: "xianxia world presence, grounded human realism, clear face readability, restrained mythic atmosphere",
    quality: "premium xianxia portrait, natural skin, coherent anatomy, readable costume texture, stable identity-first realism",
    outfitBase: "xianxia styling with readable sleeve rhythm, balanced ornaments, and identity-safe silhouette control",
    sceneBase: "xianxia realm setting with clear architecture, landscape, and grounded fantasy depth",
    mkDefault: "xianxia",
    propGroup: "fantasy",
    compGroup: "fantasy",
  },
  myth: {
    roleSuffixes: ["神話人物", "祭壇行者", "星柱仕影", "靈境寫真", "長卷角色"],
    subPhrases: ["曙色片刻", "月華回聲", "神柱留光", "霧島靜候", "秘壇微風"],
    atmosphere: "mythological ritual power, symbolic presence, calm gravity, clear face readability",
    quality: "premium myth portrait, natural skin, coherent anatomy, symbolic costume detail, stable identity-first realism",
    outfitBase: "mythic styling with symbolic materials, crown logic, and readable ceremonial silhouette",
    sceneBase: "mythological setting with symbolic ritual or natural power atmosphere and grounded fantasy logic",
    mkDefault: "oracle_gold",
    propGroup: "fantasy",
    compGroup: "fantasy",
  },
  dramaPeriod: {
    roleSuffixes: ["局中人", "夜行者", "人物寫真", "長街行者", "歸途中人"],
    subPhrases: ["風聲片刻", "簷影回聲", "燈河留影", "雪階靜候", "雨巷微聲"],
    atmosphere: "high-stakes story tension, role-driven action, grounded human realism, clear face readability",
    quality: "premium period-drama portrait, natural skin, coherent anatomy, readable costume detail, stable identity-first realism",
    outfitBase: "story-driven costume styling matched to role, period, and narrative pressure without archetype face language",
    sceneBase: "Chinese costume-drama setting with readable plot atmosphere and place identity",
    mkDefault: "cinematic",
    propGroup: "drama",
    compGroup: "drama",
  },
  dramaModern: {
    roleSuffixes: ["人物寫真", "場景角色", "夜色行者", "情境側影", "城市局中人"],
    subPhrases: ["街口片刻", "雨夜回聲", "櫥窗留影", "晨霧停步", "晚風微聲"],
    atmosphere: "recognizable drama-world presence, emotional clarity, grounded human realism, clear face readability",
    quality: "premium drama-inspired portrait, natural skin, coherent anatomy, readable wardrobe detail, stable identity-first realism",
    outfitBase: "modern or period-adjacent drama styling with clear silhouette and role-appropriate realism",
    sceneBase: "drama-inspired setting with recognizable narrative context and grounded place identity",
    mkDefault: "hk_film",
    propGroup: "modern",
    compGroup: "modern",
  },
  heroes: {
    roleSuffixes: ["人物寫真", "軍幕行者", "長道側影", "史詩局中人", "戰雲仕影"],
    subPhrases: ["戰雲片刻", "高臺回聲", "水榭留影", "古道靜候", "城門風聲"],
    atmosphere: "historical epic presence, grounded human realism, clear face readability, controlled narrative tension",
    quality: "premium heroic-history portrait, natural skin, coherent anatomy, readable costume detail, stable identity-first realism",
    outfitBase: "heroic historical styling with readable armor or robe logic and identity-safe silhouette control",
    sceneBase: "historical epic setting with grounded architecture or battlefield-adjacent atmosphere",
    mkDefault: "wuxia",
    propGroup: "drama",
    compGroup: "drama",
  },
  wuxia: {
    roleSuffixes: ["俠影人物", "江湖行者", "山門寫真", "長街側影", "刀劍局中人"],
    subPhrases: ["劍氣片刻", "燈市回聲", "雪道留影", "江湖靜候", "竹林微風"],
    atmosphere: "wuxia world presence, grounded human realism, clear face readability, restrained martial narrative",
    quality: "premium wuxia portrait, natural skin, coherent anatomy, readable costume detail, stable identity-first realism",
    outfitBase: "wuxia styling with readable mobility, balanced weapon logic, and identity-safe silhouette control",
    sceneBase: "wuxia setting with grounded period atmosphere and readable place identity",
    mkDefault: "wuxia",
    propGroup: "drama",
    compGroup: "drama",
  },
  classicLit: {
    roleSuffixes: ["書卷人物", "悲喜側影", "古典寫真", "故事行者", "樓園仕影"],
    subPhrases: ["詩頁片刻", "月橋回聲", "花園留影", "古寺靜候", "書院微風"],
    atmosphere: "classical literary presence, emotional clarity, grounded human realism, clear face readability",
    quality: "premium classical-literary portrait, natural skin, coherent anatomy, readable costume detail, stable identity-first realism",
    outfitBase: "story-led classical styling with readable textile logic and restrained decorative structure",
    sceneBase: "classical literary setting with clear narrative atmosphere and grounded place identity",
    mkDefault: "gudian_hong",
    propGroup: "historical",
    compGroup: "historical",
  },
  chineseStory: {
    roleSuffixes: ["故事人物", "傳說行者", "長歌側影", "古橋寫真", "山門仕影"],
    subPhrases: ["傳說片刻", "燈影回聲", "月橋留光", "長風靜候", "雪聲微夜"],
    atmosphere: "Chinese story presence, emotional clarity, grounded human realism, clear face readability",
    quality: "premium story portrait, natural skin, coherent anatomy, readable textile detail, stable identity-first realism",
    outfitBase: "story-driven Chinese styling with readable props and restrained costume structure",
    sceneBase: "Chinese story setting with grounded folklore or literary atmosphere",
    mkDefault: "gudian_hong",
    propGroup: "historical",
    compGroup: "historical",
  },
  fantasy: {
    roleSuffixes: ["秘境人物", "法陣行者", "塔階寫真", "森境側影", "異界剪影"],
    subPhrases: ["星芒片刻", "工坊回聲", "符光留影", "異界靜候", "微霧風聲"],
    atmosphere: "fantasy world presence, grounded human realism, clear face readability, restrained magical atmosphere",
    quality: "premium fantasy portrait, natural skin, coherent anatomy, readable magical detail, stable identity-first realism",
    outfitBase: "fantasy styling with readable costume silhouette, balanced magical accessories, and controlled visual emphasis",
    sceneBase: "fantasy setting with grounded magical architecture or landscape and clear environmental identity",
    mkDefault: "magic_girl",
    propGroup: "fantasy",
    compGroup: "fantasy",
  },
  gothic: {
    roleSuffixes: ["夜庭人物", "古堡側影", "霧園寫真", "月塔行者", "燭廳剪影"],
    subPhrases: ["月色片刻", "雨夜回聲", "燭光留影", "冷霧靜候", "石廊微風"],
    atmosphere: "gothic restraint, dark elegance, grounded human realism, clear face readability",
    quality: "premium gothic portrait, natural skin, coherent anatomy, readable material detail, stable identity-first realism",
    outfitBase: "gothic styling with readable velvet, lace, or structured dark materials and controlled identity-safe silhouette",
    sceneBase: "gothic setting with clear architectural identity and grounded dark-atmosphere realism",
    mkDefault: "gothic",
    propGroup: "fantasy",
    compGroup: "fantasy",
  },
  darkfantasy: {
    roleSuffixes: ["暗章人物", "深淵行者", "黑焰寫真", "廢墟側影", "影霧剪影"],
    subPhrases: ["冷焰片刻", "殘光回聲", "暗潮留影", "影霧靜候", "血月微風"],
    atmosphere: "dark fantasy presence, grounded human realism, clear face readability, controlled sinister atmosphere",
    quality: "premium dark-fantasy portrait, natural skin, coherent anatomy, readable dramatic detail, stable identity-first realism",
    outfitBase: "dark-fantasy styling with readable armor or robe structure, controlled crown logic, and identity-safe silhouette",
    sceneBase: "dark fantasy setting with grounded architecture, ritual, or wasteland atmosphere",
    mkDefault: "demon_lord",
    propGroup: "fantasy",
    compGroup: "fantasy",
  },
  spirits: {
    roleSuffixes: ["靈境人物", "狐火側影", "井庭寫真", "燈街行者", "霜林剪影"],
    subPhrases: ["流光片刻", "夜橋回聲", "蘆汀留影", "晨藍靜候", "風鈴微霧"],
    atmosphere: "folklore mystery, watchful intelligence, restrained supernatural atmosphere, clear face readability",
    quality: "premium folklore-spirit portrait, natural skin, coherent anatomy, readable magical detail, stable identity-first realism",
    outfitBase: "folklore styling with magical cues kept secondary to facial identity and readable anatomy",
    sceneBase: "folklore spirit setting with grounded magical place identity and story tension",
    mkDefault: "fox_noir",
    propGroup: "fantasy",
    compGroup: "fantasy",
  },
  water: {
    roleSuffixes: ["水境人物", "花亭寫真", "波光側影", "深池行者", "雨幕剪影"],
    subPhrases: ["流影片刻", "月色回聲", "水鏡留光", "薄霧靜候", "夜藍微風"],
    atmosphere: "water or floral fantasy presence, grounded human realism, clear face readability, restrained luminous atmosphere",
    quality: "premium water-fantasy portrait, natural skin, coherent anatomy, readable reflective detail, stable identity-first realism",
    outfitBase: "water-inspired styling with readable translucent layers, balanced pearl or floral accessories, and identity-safe silhouette",
    sceneBase: "water or floral fantasy setting with grounded reflective depth and clear place identity",
    mkDefault: "mermaid_pearl",
    propGroup: "fantasy",
    compGroup: "fantasy",
  },
  goddess: {
    roleSuffixes: ["神壇人物", "星柱側影", "祭庭寫真", "月臺行者", "聖牆剪影"],
    subPhrases: ["金光片刻", "曙色回聲", "月華留影", "霜林靜候", "薄霧微夜"],
    atmosphere: "mythic ritual power, symbolic presence, calm divine gravity, clear face readability",
    quality: "premium goddess portrait, natural skin, coherent anatomy, symbolic costume detail, stable identity-first realism",
    outfitBase: "goddess styling with symbolic ornaments, readable ceremonial silhouette, and controlled grandeur",
    sceneBase: "mythic deity setting with ritual or natural power atmosphere and grounded visual logic",
    mkDefault: "oracle_gold",
    propGroup: "regal",
    compGroup: "regal",
  },
  angel: {
    roleSuffixes: ["聖堂人物", "雲門寫真", "穹窗側影", "水庭行者", "石階剪影"],
    subPhrases: ["晨光片刻", "金束回聲", "白羽留影", "夜靜靜候", "薄霧微風"],
    atmosphere: "sacred calm, luminous order, compassionate vigilance, clear face readability",
    quality: "premium angelic portrait, natural skin, coherent anatomy, readable luminous detail, stable identity-first realism",
    outfitBase: "holy styling with clean ceremonial structure, controlled wing logic, and identity-safe silhouette",
    sceneBase: "holy celestial setting with sacred structure and luminous order",
    mkDefault: "angel_holy",
    propGroup: "regal",
    compGroup: "regal",
  },
  fallenAngel: {
    roleSuffixes: ["墮羽人物", "殘照側影", "黑翼寫真", "深井行者", "斷鐘剪影"],
    subPhrases: ["冷焰片刻", "月蝕回聲", "夜霧留影", "殘光靜候", "風黑微聲"],
    atmosphere: "fallen celestial tension, grounded human realism, clear face readability, controlled tragic darkness",
    quality: "premium fallen-angel portrait, natural skin, coherent anatomy, readable dark-luminous detail, stable identity-first realism",
    outfitBase: "fallen angel styling with restrained dark wing logic, readable silhouette, and controlled ceremonial detail",
    sceneBase: "fallen celestial setting with grounded ruined sanctum atmosphere",
    mkDefault: "fallen_angel",
    propGroup: "fantasy",
    compGroup: "fantasy",
  },
  demon: {
    roleSuffixes: ["魔宴人物", "黑曜側影", "焰座寫真", "紫霧行者", "深紅剪影"],
    subPhrases: ["流火片刻", "冷焰回聲", "夜宴留影", "月色靜候", "暗藤微風"],
    atmosphere: "demonic court presence, grounded human realism, clear face readability, controlled seductive darkness",
    quality: "premium demonic portrait, natural skin, coherent anatomy, readable dark-material detail, stable identity-first realism",
    outfitBase: "demonic styling with readable structured silhouette, controlled luxury-dark detail, and identity-safe facial priority",
    sceneBase: "demonic setting with grounded palace, banquet, or ritual atmosphere",
    mkDefault: "succubus_alluring",
    propGroup: "fantasy",
    compGroup: "fantasy",
  },
  dragon: {
    roleSuffixes: ["龍境人物", "高臺寫真", "峽谷行者", "雲岫側影", "熔脈剪影"],
    subPhrases: ["長風片刻", "曙色回聲", "夜霧留影", "暮光靜候", "雪聲微夜"],
    atmosphere: "creature-scale fantasy presence, grounded human realism, clear face readability, controlled epic atmosphere",
    quality: "premium dragon-beast portrait, natural skin, coherent anatomy, readable fantasy detail, stable identity-first realism",
    outfitBase: "dragon or beast-adjacent styling with readable silhouette, controlled armor or scale motifs, and grounded wearability",
    sceneBase: "creature-scale fantasy setting with grounded natural or volcanic place identity",
    mkDefault: "dragon_epic",
    propGroup: "fantasy",
    compGroup: "fantasy",
  },
  tamer: {
    roleSuffixes: ["馭獸人物", "林境寫真", "營地行者", "坡地側影", "古道剪影"],
    subPhrases: ["晨光片刻", "雪色回聲", "晚照留影", "薄霧靜候", "夜風微聲"],
    atmosphere: "human-animal bond presence, grounded human realism, clear face readability, controlled wilderness atmosphere",
    quality: "premium beast-tamer portrait, natural skin, coherent anatomy, readable outdoor detail, stable identity-first realism",
    outfitBase: "outdoor or tribal-inflected styling with practical movement, readable layering, and grounded realism",
    sceneBase: "animal-bond setting with grounded camp, field, or trail atmosphere",
    mkDefault: "outdoor_glow",
    propGroup: "modern",
    compGroup: "modern",
  },
  modern: {
    roleSuffixes: ["都會人物", "場景寫真", "晨行者", "夜色側影", "城市剪影"],
    subPhrases: ["通勤片刻", "櫥窗回聲", "中庭留影", "暖燈靜候", "清風微步"],
    atmosphere: "contemporary confidence, polished realism, believable real-world presence, clear face readability",
    quality: "premium contemporary portrait, natural skin, coherent anatomy, refined wardrobe detail, stable identity-first realism",
    outfitBase: "contemporary fashion styling with polished structure, readable tailoring, and grounded city realism",
    sceneBase: "modern city or interior setting with grounded place identity and lifestyle realism",
    mkDefault: "editorial",
    propGroup: "modern",
    compGroup: "modern",
  },
  lifestyle: {
    roleSuffixes: ["生活人物", "日常寫真", "窗邊側影", "街口行者", "季節剪影"],
    subPhrases: ["晨光片刻", "晚風回聲", "雨巷留影", "秋影靜候", "春色微步"],
    atmosphere: "real-life softness, grounded human realism, clear face readability, natural everyday presence",
    quality: "premium lifestyle portrait, natural skin, coherent anatomy, readable everyday detail, stable identity-first realism",
    outfitBase: "real-life styling with soft practical layers, readable silhouette, and grounded everyday logic",
    sceneBase: "lifestyle setting with grounded domestic, seasonal, or neighborhood atmosphere",
    mkDefault: "natural_clean",
    propGroup: "modern",
    compGroup: "modern",
  },
  queen: {
    roleSuffixes: ["王座人物", "朝階寫真", "權柄側影", "宮闕行者", "王庭剪影"],
    subPhrases: ["宣令片刻", "高臺回聲", "燈列留影", "穀殿靜候", "天階微風"],
    atmosphere: "sovereign command, measured authority, emotionally controlled presence, clear face readability",
    quality: "premium sovereign portrait, natural skin, coherent anatomy, detailed fabric and jewelry texture, stable identity-first realism",
    outfitBase: "sovereign styling with structured silhouette, controlled crown logic, and identity-safe ceremonial detail",
    sceneBase: "sovereign portrait setting with symbolic architecture and power atmosphere",
    mkDefault: "imperial_empress",
    propGroup: "regal",
    compGroup: "regal",
  },
  bridal: {
    roleSuffixes: ["婚紗人物", "花嫁寫真", "誓言側影", "長紗行者", "禮堂剪影"],
    subPhrases: ["誓言片刻", "長桌回聲", "窗影留光", "花束靜候", "晚宴微風"],
    atmosphere: "bridal tenderness, ceremonial stillness, natural emotional warmth, clear face readability",
    quality: "premium bridal portrait, natural skin, coherent anatomy, refined gown texture, stable identity-first realism",
    outfitBase: "bridal styling with clear gown silhouette, refined ornamentation, and ceremony-appropriate accessories",
    sceneBase: "bridal setting with ceremony or destination romance and elegant environment depth",
    mkDefault: "wedding",
    propGroup: "bridal",
    compGroup: "bridal",
  },
  cyber: {
    roleSuffixes: ["賽博人物", "雨夜寫真", "霓虹行者", "全息側影", "脈衝剪影"],
    subPhrases: ["零時片刻", "紅藍回聲", "脈衝留影", "夜雨靜候", "機械微光"],
    atmosphere: "controlled futuristic atmosphere, grounded human realism, clear face readability, restrained neon energy",
    quality: "premium cyber portrait, natural skin, coherent anatomy, readable neon-material detail, stable identity-first realism",
    outfitBase: "futuristic styling with readable mechanical or urban details, controlled silhouette, and identity-safe facial priority",
    sceneBase: "cyber setting with grounded neon city, clinic, or platform atmosphere and clear place identity",
    mkDefault: "cyber",
    propGroup: "reference",
    compGroup: "reference",
  },
  game: {
    roleSuffixes: ["角色寫真", "場景人物", "法陣行者", "競技側影", "舞臺剪影"],
    subPhrases: ["星芒片刻", "流影回聲", "戰備留影", "夜燈靜候", "雲場微風"],
    atmosphere: "game-inspired character presence, grounded human realism, clear face readability, controlled stylization",
    quality: "premium game-character portrait, natural skin, coherent anatomy, readable costume detail, stable identity-first realism",
    outfitBase: "game-inspired styling with readable silhouette, controlled accessories, and grounded wearable logic",
    sceneBase: "game-inspired setting with clear stage, arena, or mission-space identity",
    mkDefault: "character_pop",
    propGroup: "reference",
    compGroup: "reference",
  },
  cosplay: {
    roleSuffixes: ["展會人物", "角色寫真", "舞臺側影", "場館行者", "天臺剪影"],
    subPhrases: ["展會片刻", "場館回聲", "簾幕留影", "街景靜候", "夜燈微風"],
    atmosphere: "cosplay character presence, grounded human realism, clear face readability, controlled performance energy",
    quality: "premium cosplay portrait, natural skin, coherent anatomy, readable costume detail, stable identity-first realism",
    outfitBase: "cosplay styling with readable costume silhouette, controlled accessory logic, and identity-safe presentation",
    sceneBase: "cosplay setting with stage, venue, or outdoor scene identity and grounded realism",
    mkDefault: "character_pop",
    propGroup: "reference",
    compGroup: "reference",
  },
};

const CATEGORY_CONFIG = {
  taiwan_travel: { mode: "travel", anchors: ["九份山城", "淡水河岸", "阿里雲海", "大稻埕街屋", "高美濕地", "北投湯屋"], scenes: ["薄雨", "暮色", "晨光", "夜燈", "海風"], icons: ["🧋", "🏮", "🌊", "🚃", "🌄"] },
  mountain_sea: { mode: "mountain", anchors: ["雪峰高線", "黑沙海崖", "鹽湖鏡面", "峽灣絕壁", "火山礫岸", "雲海草甸"], scenes: ["曙色", "冷霧", "長風", "晚照", "星夜"], icons: ["🏔️", "🌊", "🌌", "🧊", "🌄"] },
  europe_travel: { mode: "travel", anchors: ["左岸石橋", "運河拱橋", "古堡長廊", "廣場鐘樓", "藍白坡城", "花窗宮廳"], scenes: ["晨光", "黃昏", "薄霧", "夜燈", "細雨"], icons: ["🗼", "🏰", "🌉", "⛪", "🌷"] },
  japan_travel: { mode: "travel", anchors: ["祇園石路", "神社參道", "雪燈木屋", "海岸鐵道", "竹林曲徑", "溫泉旅館"], scenes: ["櫻色", "晨霧", "夜雪", "夕照", "夏風"], icons: ["⛩️", "🌸", "🚃", "♨️", "🎐"] },
  korea_sea: { mode: "travel", anchors: ["韓屋庭院", "宮門回廊", "熱帶海灣", "古城燈河", "都會天臺", "海上石林"], scenes: ["春雪", "夜色", "晨光", "落日", "微雨"], icons: ["🌺", "🏯", "🌴", "🌃", "⛵"] },
  world_travel: { mode: "travel", anchors: ["都會廣場", "熱氣球谷", "沙海古蹟", "海港歌劇院", "山城遺址", "霧橋海灣"], scenes: ["曙色", "晚照", "夜雨", "金光", "清風"], icons: ["🌍", "🎈", "🏛️", "🌉", "🗽"] },
  china_mark: { mode: "travel", anchors: ["紅牆深巷", "江岸夜景", "山門雲橋", "石窟古道", "雪城長街", "湖亭斷橋"], scenes: ["晨霧", "晚鐘", "夜燈", "春風", "薄雪"], icons: ["🏯", "🏮", "🌉", "⛰️", "❄️"] },
  hanfu: { mode: "hanfu", anchors: ["竹院長廊", "月庭花影", "蘭亭水榭", "書閣窗紗", "春山石徑", "燈市橋頭"], scenes: ["清曉", "晚風", "微雪", "花朝", "燈影"], icons: ["🧧", "🎋", "🪷", "📜", "🏮"] },
  dynasty_palace: { mode: "court", anchors: ["宣室朝階", "鳳闕長廊", "深宮畫屏", "御園水榭", "寢殿珠簾", "雪庭宮道"], scenes: ["晨光", "夜雪", "燈影", "秋聲", "薄霧"], icons: ["👑", "🏯", "🏮", "❄️", "🪞"] },
  tang_grandeur: { mode: "tang", anchors: ["大明宮階", "曲江花亭", "華清池畔", "長安夜市", "胡旋舞庭", "梨園畫閣"], scenes: ["曉色", "花朝", "燈河", "暮風", "春宴"], icons: ["🌸", "🏮", "🎶", "🪷", "🧧"] },
  song_grace: { mode: "song", anchors: ["汴京書閣", "點茶小亭", "汝窯案几", "簾影水榭", "竹窗抄經", "梅庭折枝"], scenes: ["晨霧", "細雨", "晚風", "春光", "雪聲"], icons: ["🍵", "📜", "🪔", "🌿", "❄️"] },
  ming_grace: { mode: "ming", anchors: ["金陵畫舫", "雲錦繡坊", "宮門夜巡", "江南廊橋", "海港驛亭", "竹院書房"], scenes: ["晨光", "夜燈", "薄雨", "秋聲", "桂影"], icons: ["🏮", "🧵", "📚", "🛶", "🎋"] },
  qing_grace: { mode: "qing", anchors: ["紅牆宮道", "點翠鏡閣", "御園湖岸", "行宮雕窗", "雪廊深庭", "燈河花影"], scenes: ["晨光", "夜雪", "春風", "燈影", "松聲"], icons: ["💎", "🪞", "🏮", "❄️", "🌼"] },
  oriental: { mode: "classical", anchors: ["月門庭院", "古橋流水", "花窗書齋", "石階燈亭", "柳岸茶席", "深巷雨廊"], scenes: ["清曉", "晚照", "薄霧", "春影", "夜燈"], icons: ["🏮", "🌿", "🪷", "📚", "☔"] },
  reference_styles: { mode: "reference", anchors: ["銀鹽暗房", "雕塑光面", "玻璃溫室", "黑白劇場", "沙丘留白", "金屬長廊"], scenes: ["粉塵", "冷霧", "反射", "暖光", "靜影"], icons: ["🖼️", "🧪", "🪞", "🏜️", "🗿"] },
  xianxia: { mode: "xianxia", anchors: ["雲橋山門", "桃林石階", "仙島長亭", "雪殿回廊", "古城燈樓", "谷口霧橋"], scenes: ["晨霧", "花影", "夜燈", "晚雪", "流雲"], icons: ["✨", "🌸", "☁️", "🏯", "❄️"] },
  myth: { mode: "myth", anchors: ["古神祭壇", "河源石階", "天幕神柱", "海霧孤島", "星河高臺", "松風秘境"], scenes: ["曙色", "月華", "薄霧", "燈火", "靜夜"], icons: ["🐉", "⭐", "🔥", "🌊", "🌙"] },
  china_myth_chars: { mode: "myth", anchors: ["瑤池玉階", "蓮臺水鏡", "雲宮金闕", "月殿長廊", "古陵石門", "山海祭地"], scenes: ["晨光", "夜霧", "花影", "雪色", "流光"], icons: ["🌟", "🪷", "🌙", "🏯", "⭐"] },
  drama: { mode: "dramaPeriod", anchors: ["清水鎮巷", "王城長階", "山谷渡橋", "海邊高臺", "夜雪軍營", "林間秘路"], scenes: ["晨霧", "晚照", "風雪", "夜燈", "薄雨"], icons: ["⚔️", "🏯", "🌫️", "🌊", "🕯️"] },
  hotdrama: { mode: "dramaPeriod", anchors: ["宮門石階", "長街雨巷", "藥鋪深院", "邊城營門", "舟渡蘆港", "書局簷影"], scenes: ["夜印", "晨鐘", "微雨", "殘雪", "燈河"], icons: ["🎬", "🧾", "🗡️", "🌿", "🏮"] },
  china_drama: { mode: "dramaModern", anchors: ["黃浦櫥窗", "書局花市", "長街雨夜", "舊宅庭院", "雪亭長椅", "城市天橋"], scenes: ["夜色", "晨霧", "燈影", "細雨", "晚風"], icons: ["📺", "🌆", "📚", "🌧️", "🪞"] },
  three_kingdoms: { mode: "heroes", anchors: ["銅雀高臺", "軍帳沙盤", "江東水榭", "長坂古道", "宮門金殿", "草船江霧"], scenes: ["晨光", "夜燈", "秋風", "戰雲", "薄霧"], icons: ["⚔️", "🏯", "🌊", "🛡️", "🔥"] },
  jinyong: { mode: "wuxia", anchors: ["桃花島岸", "古墓石室", "雪山棧道", "酒肆長街", "山門竹林", "宮廷回廊"], scenes: ["晨霧", "夜燈", "晚雪", "春風", "月色"], icons: ["⚔️", "🌸", "⛰️", "🏮", "🎋"] },
  classic_lit: { mode: "classicLit", anchors: ["杏壇書院", "紅樓花園", "蓮池長橋", "古寺鐘廊", "山頂送別", "月下畫舫"], scenes: ["晨光", "夜雪", "春影", "秋聲", "薄霧"], icons: ["📖", "📜", "🪷", "⛩️", "🌙"] },
  chinese_story: { mode: "chineseStory", anchors: ["斷橋水畔", "長城烽臺", "花市橋頭", "山門軍道", "琵琶驛站", "彩雲祭地"], scenes: ["晨霧", "月華", "燈影", "晚風", "雪聲"], icons: ["🐲", "🏯", "🪕", "🌉", "☁️"] },
  fantasy: { mode: "fantasy", anchors: ["符文塔階", "占星圓廳", "森境祭壇", "藥水工坊", "時鐘高臺", "異界石橋"], scenes: ["晨光", "夜霧", "暮色", "星芒", "靜風"], icons: ["🔮", "✨", "🌿", "🧪", "⏳"] },
  gothic: { mode: "gothic", anchors: ["古堡石廊", "黑玫窗臺", "月塔長階", "燭廳王座", "霧園鐵門", "雨夜鐘樓"], scenes: ["月色", "燭光", "霧影", "夜雨", "冷風"], icons: ["🖤", "🌹", "🕯️", "🏰", "🌙"] },
  darkfantasy: { mode: "darkfantasy", anchors: ["深淵裂臺", "黑焰王座", "骸骨長橋", "血月祭地", "廢墟石門", "影霧山城"], scenes: ["暗潮", "冷焰", "夜霧", "殘光", "星黑"], icons: ["🌑", "🔥", "🩸", "🏚️", "🌫️"] },
  spirits: { mode: "spirits", anchors: ["狐火古橋", "蘆汀水岸", "霜林石碑", "井欄月庭", "山門鐘影", "紙燈長街"], scenes: ["薄霧", "夜雪", "流光", "晨藍", "風鈴"], icons: ["🦊", "🏮", "🌫️", "🪔", "🐺"] },
  water: { mode: "water", anchors: ["水鏡花亭", "玻璃魚道", "深池光廊", "荷塘石橋", "雨幕溫室", "海藍階臺"], scenes: ["晨光", "月色", "薄霧", "流影", "夜藍"], icons: ["🌊", "🪷", "🫧", "🐚", "💧"] },
  goddess_myth: { mode: "goddess", anchors: ["星柱祭庭", "潮月石臺", "穀風高壇", "霜林神徑", "火紋聖牆", "晨泉長階"], scenes: ["金光", "曙色", "月華", "薄霧", "靜夜"], icons: ["⚡", "⭐", "🌾", "🔥", "🌙"] },
  holy_angel: { mode: "angel", anchors: ["聖堂穹窗", "雲門高臺", "百合水庭", "鐘翼長廊", "祈雨石階", "琉璃回廳"], scenes: ["晨光", "夜靜", "薄霧", "金束", "風聲"], icons: ["👼", "🕊️", "🌼", "✨", "🪟"] },
  fallen_angel: { mode: "fallenAngel", anchors: ["黑翼石廊", "殘照祭臺", "墮羽長橋", "深井王庭", "斷鐘穹頂", "暗水高牆"], scenes: ["冷焰", "月蝕", "夜霧", "殘光", "風黑"], icons: ["🖤", "🌒", "🔥", "🏰", "🌫️"] },
  succubus_demon: { mode: "demon", anchors: ["黑曜宴廳", "血酒長桌", "焰紋王座", "暗藤花園", "紫霧劇場", "深紅石階"], scenes: ["夜燈", "冷焰", "霧影", "月色", "流火"], icons: ["😈", "🍷", "🔥", "🕸️", "🌹"] },
  dragon_beast: { mode: "dragon", anchors: ["龍脊山門", "冰焰谷地", "金巢高臺", "黑岩峽口", "雲岫草甸", "熔脈石橋"], scenes: ["曙色", "夜霧", "長風", "暮光", "雪聲"], icons: ["🐉", "🗻", "🔥", "🧊", "🌩️"] },
  beast_tamer: { mode: "tamer", anchors: ["林場石徑", "鷹塔草坡", "雪原營地", "獸欄木臺", "河谷牧線", "風沙古道"], scenes: ["晨光", "晚照", "薄霧", "夜風", "雪色"], icons: ["🦁", "🦅", "🐺", "🌾", "🏕️"] },
  modern_lady: { mode: "modern", anchors: ["玻璃碼頭", "中庭展牆", "高空餐廳", "模型會議桌", "花市街角", "精品大廳"], scenes: ["晨班", "夜色", "暖燈", "細雨", "清風"], icons: ["👔", "🏙️", "🍷", "💼", "💐"] },
  realistic_life: { mode: "lifestyle", anchors: ["草坪野餐", "圖書館窗邊", "海邊木道", "居家晨桌", "雨巷街口", "銀杏長椅"], scenes: ["晨光", "晚風", "細雨", "秋影", "春色"], icons: ["🌾", "📚", "🌊", "☕", "🍂"] },
  queen: { mode: "queen", anchors: ["霜原王庭", "曜石議臺", "海崖高階", "月港長廊", "金穗大殿", "天階閱兵"], scenes: ["宣令", "晨光", "夜燈", "靜風", "長影"], icons: ["👑", "⚖️", "🌊", "🌾", "🪄"] },
  wedding_diamond: { mode: "bridal", anchors: ["雪松山谷", "美術館廊橋", "古港碼頭", "雨夜櫥窗", "葡萄園長桌", "古典書庫"], scenes: ["誓言", "晨光", "晚宴", "花束", "長風"], icons: ["💍", "⛪", "⚓", "☔", "🍇"] },
  cyberpunk_sf: { mode: "cyber", anchors: ["霓虹高架", "義體診所", "雨夜市集", "全息舞臺", "量子車站", "黑市巷口"], scenes: ["夜雨", "藍霧", "紅光", "脈衝", "零時"], icons: ["🤖", "🌆", "💿", "🚉", "🩻"] },
  game: { mode: "game", anchors: ["戰備大廳", "法陣石臺", "偶像舞臺", "機甲港口", "學園走廊", "雲端競技場"], scenes: ["晨光", "夜燈", "星芒", "流影", "薄霧"], icons: ["⚡", "🛡️", "🎤", "🕹️", "🏟️"] },
  cos_character: { mode: "cosplay", anchors: ["舞台簾幕", "展館長廊", "城鎮街景", "森林空地", "科幻月臺", "學園天臺"], scenes: ["晨光", "夜燈", "清風", "霧影", "星色"], icons: ["🎮", "🎭", "🏙️", "🌲", "🚉"] },
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
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === quote) inString = false;
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
  return cleaned.slice(0, Math.min(cleaned.length, 8));
}

function hashText(value) {
  let hash = 0;
  for (const ch of value) hash = (hash * 33 + ch.charCodeAt(0)) | 0;
  return hash;
}

function chooseByHash(seed, variants) {
  return variants[Math.abs(seed) % variants.length];
}

function ensureSafe(text) {
  const value = String(text || "");
  const lower = value.toLowerCase();
  for (const term of BAD_TERMS) {
    if (lower.includes(term)) {
      throw new Error(`Unsafe generated content contains term: ${term}`);
    }
  }
  return value;
}

function derivePrefix(category) {
  const sample = category.entries?.[0]?.id || "";
  const match = sample.match(/^([a-z]+)_/i);
  if (!match) throw new Error(`Unable to derive prefix for ${category.id}`);
  return match[1];
}

function nextEntryId(category, entries) {
  const prefix = derivePrefix(category);
  const maxNum = entries
    .map((entry) => {
      const match = String(entry.id || "").match(/_(\d+)$/);
      return match ? Number(match[1]) : 0;
    })
    .reduce((max, value) => Math.max(max, value), 0);
  return `${prefix}_${String(maxNum + 1).padStart(2, "0")}`;
}

function buildProp(mode, entryId) {
  const seed = hashText(`${mode}:${entryId}:prop`);
  const groups = {
    travel: [
      "behaving like a real traveler in the setting by pausing, walking, or lightly interacting with nearby architecture, weather, or terrain while keeping the face fully readable",
      "using a grounded travel-photo action with relaxed shoulders, a natural body angle, and clear face-body coherence instead of a stiff standing pose",
      "letting the destination guide the body language through a calm pause, a small step, or a soft interaction with local details while preserving face-body coherence",
    ],
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
    drama: [
      "using a story-first action tied to intrigue, travel, investigation, reunion, or campaign while keeping the face readable and the body naturally aligned",
      "letting the scene logic drive the gesture through a decree, letter, lamp, blade, or prop interaction instead of exaggerated twisting",
      "using a role-appropriate dramatic pause with controlled shoulders, stable neck line, and coherent head-to-torso direction",
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
    reference: [
      "using an editorial action that feels intentional but identity-safe, with clear facial readability and natural body support",
      "letting material, light, and environment shape the posture rather than theatrical motion, keeping the subject readable as one real person",
      "using controlled portrait movement with readable hands, stable shoulders, and a clean relationship between face and body",
    ],
  };
  return chooseByHash(seed, groups[mode]);
}

function buildComp(mode, entryId) {
  const seed = hashText(`${mode}:${entryId}:comp`);
  const groups = {
    travel: [
      "vertical travel portrait with clear face, readable body line, and enough environmental space to preserve destination recognition",
      "vertical environmental portrait with stable facial readability, natural body support, and layered scene depth behind the subject",
      "vertical travel-editorial composition with face unobstructed, body readable, and landmark atmosphere preserved around the subject",
    ],
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
    drama: [
      "vertical drama-led portrait with clear face, readable costume silhouette, and enough scene depth to support plot and atmosphere without obscuring identity",
      "vertical three-quarter story composition with body naturally aligned, face unobstructed, and props integrated without covering the subject",
      "vertical narrative portrait with readable hands, costume, and environment, keeping dramatic tension secondary to face-body coherence",
    ],
    modern: [
      "vertical lifestyle portrait with clear face, believable body angle, and enough environmental detail to preserve the setting",
      "vertical city-editorial composition with readable clothing shape, grounded stance, and scene depth that feels like a real photographed space",
      "vertical contemporary portrait with stable anatomy, clear facial visibility, and architectural lines supporting a polished but realistic silhouette",
    ],
    bridal: [
      "vertical bridal portrait with clear face, readable gown volume, and romantic depth built from architecture, veil, flowers, or light",
      "vertical three-quarter to full-body wedding composition with stable facial readability and dress detail visible from shoulder to hem",
      "vertical ceremony portrait with unobstructed face, balanced body line, and enough surrounding space for the wedding atmosphere to breathe",
    ],
    reference: [
      "vertical editorial portrait with clean face readability, controlled body support, and strong material or light language without distortion",
      "vertical concept portrait with stable anatomy, clear facial visibility, and enough compositional space for the visual idea to register cleanly",
      "vertical premium portrait framing with crisp unobstructed face, natural body support, and style cues layered through lighting and setting",
    ],
  };
  return chooseByHash(seed, groups[mode]);
}

function buildName(config, modeDef, anchor, scene, idx) {
  return `${anchor}${scene}${modeDef.roleSuffixes[idx % modeDef.roleSuffixes.length]}`;
}

function buildSub(modeDef, idx) {
  return modeDef.subPhrases[idx % modeDef.subPhrases.length];
}

function buildScene(category, config, modeDef, anchor, scene) {
  return ensureSafe(
    `${category.name}, ${anchor}, ${scene}, ${modeDef.sceneBase}, clear place identity, readable environmental depth, and grounded visual realism`
  );
}

function buildOutfit(modeDef, anchor, scene) {
  return ensureSafe(`${modeDef.outfitBase}, details aligned to ${anchor} and ${scene}`);
}

function buildMarkdownBlock(category, modeDef, entry) {
  return [
    `### ${entry.name} · ${entry.sub}`,
    `- **ID:** \`${entry.id}\``,
    `- **妝容：** ${entry.mk || modeDef.mkDefault}`,
    `- **角色氛圍：** ${modeDef.atmosphere}`,
    `- **場景背景：** ${entry.scene}`,
    `- **服裝：** ${entry.outfit}`,
    `- **道具：** ${entry.prop}`,
    `- **構圖：** ${entry.comp}`,
    `- **品質：** ${modeDef.quality}`,
    "",
  ].join("\n");
}

function appendMarkdown(existingText, groupedEntries, catsById) {
  const stamp = "## 第五輪 Curated 補充（2026-05-22）";
  if (existingText.includes(stamp)) return existingText;
  const blocks = [stamp, ""];
  for (const [categoryId, entries] of Object.entries(groupedEntries)) {
    if (!entries.length) continue;
    const category = catsById.get(categoryId);
    blocks.push(`## ${category.name}（第五輪補充，新增 ${entries.length} 組）`);
    blocks.push("");
    const modeDef = MODE_DEFS[CATEGORY_CONFIG[categoryId].mode];
    for (const entry of entries) {
      blocks.push(buildMarkdownBlock(category, modeDef, entry));
    }
  }
  return `${existingText.trimEnd()}\n\n---\n\n${blocks.join("\n")}`.trimEnd() + "\n";
}

function deriveTargetAdds(cats) {
  const sorted = [...cats].sort((a, b) => a.entries.length - b.entries.length || a.id.localeCompare(b.id));
  const targetMap = new Map();
  for (let i = 0; i < sorted.length; i += 1) {
    targetMap.set(sorted[i].id, i < 11 ? 24 : 23);
  }
  return targetMap;
}

function main() {
  const original = fs.readFileSync(INDEX_PATH, "utf8");
  const styleMd = fs.readFileSync(STYLE_MD_PATH, "utf8");
  const catsBlock = extractCatsBlock(original);
  const cats = vm.runInNewContext(`(${catsBlock.arrayText})`);
  const catsById = new Map(cats.map((cat) => [cat.id, cat]));
  const styleMdNorm = normalize(styleMd);
  const targetAdds = deriveTargetAdds(cats);
  const report = [];
  const addedForMarkdown = {};

  for (const category of cats) {
    const config = CATEGORY_CONFIG[category.id];
    if (!config) throw new Error(`Missing category config for ${category.id}`);
    const modeDef = MODE_DEFS[config.mode];
    if (!modeDef) throw new Error(`Missing mode definition for ${config.mode}`);

    const existingNorms = new Set();
    const existingStems = new Set();
    for (const entry of category.entries) {
      existingNorms.add(normalize(entry.name));
      existingNorms.add(normalize(entry.sub));
      existingNorms.add(normalize(`${entry.name}${entry.sub || ""}`));
      existingStems.add(extractStem(entry.name));
    }

    const targetCount = targetAdds.get(category.id) || 23;
    const candidates = [];
    let idx = 0;
    for (const anchor of config.anchors) {
      for (const scene of config.scenes) {
        const name = buildName(config, modeDef, anchor, scene, idx);
        const sub = buildSub(modeDef, idx);
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
          idx += 1;
          continue;
        }
        candidates.push({
          name,
          sub,
          icon: config.icons[idx % config.icons.length] || category.icon || "✦",
          scene: buildScene(category, config, modeDef, anchor, scene),
          outfit: buildOutfit(modeDef, anchor, scene),
          mk: modeDef.mkDefault,
        });
        idx += 1;
      }
    }

    if (candidates.length < targetCount) {
      throw new Error(`${category.id} only generated ${candidates.length} candidates, needs ${targetCount}`);
    }

    addedForMarkdown[category.id] = [];
    let added = 0;
    for (const candidate of candidates.slice(0, targetCount)) {
      const entryId = nextEntryId(category, category.entries);
      const prop = ensureSafe(buildProp(modeDef.propGroup, entryId));
      const comp = ensureSafe(buildComp(modeDef.compGroup, entryId));
      const entry = {
        id: entryId,
        name: candidate.name,
        sub: candidate.sub,
        icon: candidate.icon,
        scene: candidate.scene,
        outfit: candidate.outfit,
        prop,
        comp,
        mk: candidate.mk,
      };
      category.entries.push(entry);
      addedForMarkdown[category.id].push(entry);
      added += 1;
    }
    report.push(`${category.id}\t+${added}\ttotal=${category.entries.length}`);
  }

  const totalAdded = report.reduce((sum, row) => sum + Number(row.split("\t")[1].slice(1)), 0);
  if (totalAdded !== 1000) {
    throw new Error(`Expected to add 1000 entries, actually added ${totalAdded}`);
  }

  const updatedArray = JSON.stringify(cats, null, 2);
  const updatedIndex = `${original.slice(0, catsBlock.start)}${updatedArray}${original.slice(catsBlock.end)}`;
  fs.writeFileSync(INDEX_PATH, updatedIndex, "utf8");

  const updatedMarkdown = appendMarkdown(styleMd, addedForMarkdown, catsById);
  fs.writeFileSync(STYLE_MD_PATH, updatedMarkdown, "utf8");

  console.log(report.join("\n"));
  console.log(`TOTAL_ADDED\t${totalAdded}`);
}

main();
