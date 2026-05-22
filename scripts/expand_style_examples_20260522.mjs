import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "index.html");

const CATEGORY_PREFIX = {
  taiwan_travel: "tw",
  mountain_sea: "ms",
  europe_travel: "eu",
  japan_travel: "jp",
  korea_sea: "ks",
  world_travel: "wt",
  china_mark: "cm",
  hanfu: "hf",
  dynasty_palace: "dp",
  tang_grandeur: "tg",
  song_grace: "sg",
  ming_grace: "mg",
  qing_grace: "qg",
  oriental: "or",
  reference_styles: "ref",
  xianxia: "xia",
  myth: "my",
  china_myth_chars: "cmh",
  drama: "dr",
  hotdrama: "hd",
  china_drama: "cd",
  three_kingdoms: "tk",
  jinyong: "jy",
  classic_lit: "cl",
  chinese_story: "cs",
  fantasy: "fa",
  gothic: "dg",
  darkfantasy: "df",
  spirits: "sp",
  water: "wa",
  goddess_myth: "gm",
  holy_angel: "ha",
  fallen_angel: "fl",
  succubus_demon: "sd",
  dragon_beast: "db",
  beast_tamer: "bt",
  modern_lady: "ml",
  realistic_life: "rl",
  queen: "qu",
  wedding_diamond: "wd",
  cyberpunk_sf: "cp",
  game: "ga",
  cos_character: "cos",
};

const ADDITIONS = {
  taiwan_travel: [
    ["蘭嶼達悟", "飛魚之鄉", "🐟"],
    ["大稻埕", "百年煙火", "🎆"],
    ["高美濕地", "天空之鏡", "🪞"],
  ],
  mountain_sea: [
    ["珠峰極境", "日照金山", "🏔️"],
    ["撒哈拉", "烈日狂沙", "🏜️"],
    ["科羅拉多", "紅岩大峽谷", "🪨"],
    ["茶卡鹽湖", "純白之境", "🧂"],
  ],
  europe_travel: [
    ["新天鵝堡", "童話公主", "🏰"],
    ["巴塞隆納", "高第狂想", "🌀"],
    ["瑞士小鎮", "因特拉肯", "🏞️"],
    ["佛羅倫斯", "文藝復興", "🎨"],
  ],
  japan_travel: [
    ["北海道", "小樽雪燈路", "🏮"],
    ["新宿街頭", "霓虹夜雨", "🌧️"],
    ["鎌倉高校前", "灌籃海景", "🚃"],
    ["銀山溫泉", "大正浪漫", "♨️"],
  ],
  korea_sea: [
    ["下龍灣", "海上石林", "⛵"],
    ["普吉島", "日落沙灘", "🌅"],
    ["長灘島", "白沙椰影", "🌴"],
    ["新加坡", "濱海灣未來", "🌉"],
  ],
  world_travel: [
    ["雪梨歌劇院", "海港晚霞", "🎼"],
    ["泰姬瑪哈陵", "永恆純白", "🤍"],
    ["里約基督像", "俯瞰山海", "⛰️"],
    ["莫斯科紅場", "洋蔥頭童話", "🧅"],
  ],
  china_mark: [
    ["外灘夜色", "十里洋場", "🌃"],
    ["西安大唐不夜城", "盛世", "🏮"],
    ["桂林山水", "灕江漁火", "🚣"],
    ["敦煌鳴沙山", "大漠駝鈴", "🐫"],
  ],
  hanfu: [
    ["衣冠上國", "束髮少年", "🪶"],
    ["青青子衿", "悠悠我心", "📜"],
    ["山有扶蘇", "皎皎明月", "🌕"],
    ["風蕭蕭兮", "易水俠骨", "⚔️"],
    ["蒹葭蒼蒼", "白露為霜", "🌾"],
    ["浮生若夢", "古韻流芳", "🕯️"],
  ],
  dynasty_palace: [
    ["大漢宣室", "椒房殿后", "👑"],
    ["大秦宣太后", "六國歸一", "🛡️"],
    ["北朝木蘭", "鐵血紅顏", "🐎"],
    ["康乾盛世", "八旗風采", "🏯"],
  ],
  tang_grandeur: [
    ["大唐女將", "平陽昭公主", "🗡️"],
    ["大明宮詞", "太平公主", "🏮"],
    ["梨園春曉", "絲竹管弦", "🎶"],
    ["上官婉兒", "巾幗簪筆", "🖋️"],
  ],
  song_grace: [
    ["清明上河", "汴京繁華", "🏙️"],
    ["點茶尋梅", "西窗剪燭", "🍵"],
    ["宋韻極簡", "汝窯天青", "🏺"],
    ["西湖尋夢", "蘇堤春曉", "🌿"],
    ["稼軒狂放", "金戈鐵馬", "🐎"],
  ],
  ming_grace: [
    ["錦衣夜行", "飛魚賜服", "🦂"],
    ["秦淮八艷", "柳如是詩", "📘"],
    ["大明督師", "鐵甲忠魂", "🛡️"],
    ["江南織造", "雲錦華服", "🧵"],
    ["桃花扇底", "哀江南怨", "🌸"],
  ],
  qing_grace: [
    ["延禧攻略", "莫蘭迪宮廷", "🎨"],
    ["甄嬛起居", "驚鴻舞影", "🦢"],
    ["步步驚心", "若曦折梅", "梅"],
    ["香妃引蝶", "西域傳奇", "🦋"],
    ["落日紫禁", "最後的皇朝", "🌇"],
  ],
  oriental: [
    ["鏡花緣", "海外仙踪", "🪞"],
    ["遊園驚夢", "情不知所起", "🎭"],
    ["長生殿", "半生緣盡", "🕊️"],
    ["桃花扇", "血染桃花", "🌺"],
    ["木蘭辭", "雙兔傍地走", "🐇"],
  ],
  reference_styles: [
    ["大師光影", "倫勃朗布光", "🕯️"],
    ["極簡美學", "留白意境", "⬜"],
    ["唯美古風", "水墨丹青", "🖌️"],
    ["新中式", "冷冽高級感", "🏮"],
    ["法式浪漫", "油畫質感", "🖼️"],
  ],
  three_kingdoms: [
    ["江東雙璧", "周郎顧曲", "🎼"],
    ["武聖關羽", "單刀赴會", "🗡️"],
    ["長坂英雄", "趙子龍", "🐎"],
    ["冢虎司馬", "隱忍奪權", "🦊"],
  ],
  jinyong: [
    ["笑傲江湖", "東方不敗飲酒", "🍷"],
    ["鹿鼎記", "阿珂絕色", "🌺"],
    ["俠客行", "白阿綉", "🪡"],
    ["書劍恩仇", "香塚香妃", "🏜️"],
  ],
  drama: [
    ["小夭", "清水鎮玟小六", "🍶"],
    ["相柳", "九頭妖王白髮", "⚪"],
    ["瑱璟", "青丘公子狐身", "🦊"],
    ["瑲玹", "西炎帝王權謀", "🏯"],
    ["阿念", "高辛王姬嬌蠻", "💠"],
    ["防風意映", "落日神弓", "🏹"],
    ["赤水豐隆", "熱血赤子", "🔥"],
    ["辰榮馨悅", "紫金頂后", "💜"],
    ["相柳", "防風邶浪蕩", "🍃"],
    ["小夭", "大王姬回歸", "👑"],
  ],
  xianxia: [
    ["太古洪荒", "開天闢地", "🌋"],
    ["蓬萊仙島", "雲海弈棋", "♟️"],
    ["崑崙掌門", "孤傲萬年", "🏔️"],
    ["誅仙劍陣", "青雲之巔", "🗡️"],
    ["三生石畔", "忘川彼岸", "🪨"],
    ["神魔大戰", "血染神界", "🩸"],
    ["仙骨入魔", "墮天成神", "🖤"],
    ["天道主宰", "法相萬尊", "☀️"],
  ],
  myth: [
    ["女媧補天", "萬物始祖", "🪨"],
    ["后羿射日", "九金烏落", "☀️"],
    ["夸父追日", "逐光而行", "🏃"],
    ["大禹治水", "定海神針", "🌊"],
    ["八仙過海", "各顯神通", "⛵"],
    ["共工觸山", "天崩地裂", "⛰️"],
  ],
  china_myth_chars: [
    ["哪吒三太子", "蓮花化身", "🔥"],
    ["二郎神楊戩", "天眼開", "👁️"],
    ["西王母", "瑤池蟠桃", "🍑"],
    ["鍾馗捉鬼", "鐵面無私", "👹"],
    ["月下老人", "紅線牽緣", "🧵"],
    ["閻羅天子", "判官執筆", "📜"],
  ],
  chinese_story: [
    ["梁祝化蝶", "萬世千生", "🦋"],
    ["孟姜女", "哭倒長城", "🧱"],
    ["牛郎織女", "鵲橋相會", "🐦"],
    ["包青天", "明鏡高懸", "⚖️"],
  ],
  classic_lit: [
    ["楚辭", "九歌少司命", "🌙"],
    ["史記", "項羽烏江自刎", "🗡️"],
    ["聊齋", "狐仙夜訪", "🦊"],
    ["文心雕龍", "字字珠璣", "📚"],
  ],
  spirits: [
    ["白骨夫人", "骷髏幻形", "💀"],
    ["蜘蛛精", "盤絲洞主", "🕷️"],
    ["青蛇", "小青妖嬈", "🐍"],
    ["夜叉", "巡海惡煞", "🌊"],
    ["旱魃", "赤地千里", "🔥"],
    ["饕餮化身", "貪婪吞噬", "👄"],
  ],
  water: [
    ["亞特蘭提斯", "遺落王妃", "🏛️"],
    ["水底芙蓉", "墨染荷花", "🪷"],
    ["水漾霓裳", "古裝水底", "👘"],
    ["水底芭蕾", "極致光影", "🩰"],
    ["水下霓虹", "賽博倒影", "🌈"],
  ],
  goddess_myth: [
    ["美杜莎", "致命凝視", "🐍"],
    ["女武神", "瓦爾基麗", "🪽"],
    ["印度女神", "吉祥天女", "🪔"],
    ["自由女神", "星火長明", "🗽"],
  ],
  holy_angel: [
    ["大天使", "米迦勒熾天使", "⚔️"],
    ["治癒之光", "拉斐爾", "💚"],
    ["神之喜訊", "加百列", "📯"],
    ["晨曦之星", "破曉使者", "🌅"],
  ],
  fallen_angel: [
    ["路西法", "晨星傲慢", "⭐"],
    ["莉莉絲", "暗夜魔女", "🌹"],
    ["阿撒茲勒", "荒野之首", "🏜️"],
    ["薩麥爾", "死亡天使", "🪦"],
    ["深淵凝視", "魔界君主", "👁️"],
  ],
  fantasy: [
    ["占星術士", "水晶球密語", "🔮"],
    ["至尊巫師", "元素掌控", "✨"],
    ["鍊金術士", "賢者之石", "⚗️"],
    ["塔羅預言", "命運之輪", "🃏"],
    ["時空法師", "沙漏停滯", "⌛"],
    ["符文禁地", "魔法風暴", "🌀"],
  ],
  gothic: [
    ["血族新娘", "黑色婚紗", "🖤"],
    ["烏鴉使者", "死亡詩篇", "🐦"],
    ["破碎人偶", "機械心臟", "🪆"],
    ["惡魔契約", "靈魂倒數", "⛓️"],
  ],
  darkfantasy: [
    ["深淵魔王", "幽冥王座", "👑"],
    ["亡靈巫師", "骷髏大軍", "☠️"],
    ["黑龍咆哮", "末日烈焰", "🐉"],
    ["陰影主宰", "潛伏暗夜", "🌑"],
    ["血月降臨", "百鬼夜行", "🌕"],
    ["墮落神明", "信仰崩塌", "🩶"],
  ],
  succubus_demon: [
    ["魔王降世", "萬魔臣服", "👿"],
    ["紫瞳魅影", "靈魂攝取", "💜"],
    ["魔界至尊", "黑曜石座", "🪑"],
    ["蛛后蘿絲", "深淵蛛網", "🕸️"],
  ],
  dragon_beast: [
    ["龍之母", "烈火不侵", "🔥"],
    ["獨角獸", "純潔之光", "🦄"],
    ["奇美拉", "混沌魔獸", "🐲"],
    ["地獄犬", "三頭咆哮", "🐕"],
  ],
  beast_tamer: [
    ["白虎訓獸師", "萬獸之王", "🐅"],
    ["飛鷹使者", "天空之眼", "🦅"],
    ["靈蛇使者", "致命溫柔", "🐍"],
    ["孔雀領主", "百鳥朝鳳", "🦚"],
  ],
  modern_lady: [
    ["律政俏佳人", "知性魅力", "⚖️"],
    ["時尚買手", "潮流尖端", "🛍️"],
    ["酒廊微醺", "都市夜色", "🥂"],
    ["極簡通勤", "高級感", "🚇"],
  ],
  realistic_life: [
    ["法式莊園", "落日油畫", "🏡"],
    ["草坪野餐", "午後陽光", "🧺"],
    ["圖書館女孩", "文藝書香", "📚"],
    ["雨中撐傘", "文藝復興", "☔"],
    ["時光照相館", "復古懷舊", "📸"],
  ],
  queen: [
    ["埃及豔后", "尼羅河權力", "🐍"],
    ["大英帝國", "維多利亞榮光", "👒"],
    ["黃金女王", "財富主宰", "💰"],
    ["凡爾賽王后", "瑪麗安東妮", "👸"],
  ],
  wedding_diamond: [
    ["皇室婚紗", "長尾拖裙", "👰"],
    ["極簡緞面", "赫本風格", "🦢"],
    ["森系精靈", "花嫁物語", "🌿"],
    ["古堡新娘", "世紀婚禮", "🏰"],
  ],
  cyberpunk_sf: [
    ["駭客帝國", "程式碼矩陣", "💻"],
    ["義體改造", "機械姬", "🤖"],
    ["地下黑市", "賽博醫生", "💉"],
    ["量子時空", "未來戰士", "⚛️"],
  ],
  cos_character: [
    ["初音未來", "電子歌姬", "🎤"],
    ["新世紀福音戰士", "綾波零", "💠"],
    ["最終幻想", "蒂法", "🥊"],
    ["命運守護夜", "Saber阿爾托莉雅", "🗡️"],
    ["間諜家家酒", "約爾太太", "🌹"],
    ["英雄聯盟", "阿璃九尾狐", "🦊"],
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
  return String(value || "").replace(/\s+/g, "").replace(/[·・．.]/g, "").toLowerCase();
}

function buildScene(categoryId, name, sub) {
  const label = `${name} ${sub}`.trim();
  const byCategory = {
    taiwan_travel: `${label}, Taiwan landmark travel portrait setting, strong local atmosphere, recognizable place identity, realistic environmental depth`,
    mountain_sea: `${label}, grand mountain or ocean destination setting, dramatic natural scale, cinematic landscape depth, grounded travel atmosphere`,
    europe_travel: `${label}, European travel portrait setting, recognizable landmark atmosphere, refined city or heritage backdrop, realistic environmental depth`,
    japan_travel: `${label}, Japanese travel portrait setting, recognizable local atmosphere, strong seasonal or urban mood, realistic place identity`,
    korea_sea: `${label}, Korean or Southeast Asian travel portrait setting, location-rich atmosphere, clear cultural place identity, realistic travel depth`,
    world_travel: `${label}, global landmark travel setting, iconic destination atmosphere, strong sense of place, realistic environmental depth`,
    china_mark: `${label}, iconic Chinese landmark setting, recognizable architecture or landscape, travel-photo realism, strong local atmosphere`,
    hanfu: `${label}, Chinese historical costume setting, poetic classical atmosphere, readable period environment, grounded ancient portrait context`,
    dynasty_palace: `${label}, imperial Chinese court setting, ceremonial palace atmosphere, strong dynasty context, formal historical portrait scene`,
    tang_grandeur: `${label}, High Tang court or cultural setting, flourishing imperial atmosphere, ceremonial architecture, rich period context`,
    song_grace: `${label}, Song dynasty refined setting, literati atmosphere, restrained classical elegance, readable historical environment`,
    ming_grace: `${label}, Ming dynasty setting, ceremonial costume context, architectural or garden background, strong historical atmosphere`,
    qing_grace: `${label}, Qing dynasty palace or bannerman setting, formal court atmosphere, strong last-imperial context, readable period scene`,
    oriental: `${label}, East Asian classical setting, literary stage atmosphere, refined traditional environment, story-rich cultural context`,
    reference_styles: `${label}, reference-inspired editorial art direction, strong visual motif, photorealistic style study, controlled atmosphere`,
    xianxia: `${label}, xianxia fantasy setting, spiritual worldbuilding, dramatic celestial or immortal environment, story-led atmosphere`,
    myth: `${label}, Chinese mythology-inspired setting, symbolic ritual atmosphere, mythic worldbuilding, strong legendary context`,
    china_myth_chars: `${label}, mythological character setting, symbolic environment, dramatic legendary atmosphere, recognizable story context`,
    drama: `${label}, Chinese costume-drama setting, character-driven atmosphere, strong narrative environment, readable story context`,
    hotdrama: `${label}, Chinese drama-inspired setting, story-led costume atmosphere, recognizable narrative world, rich visual context`,
    china_drama: `${label}, Chinese period-drama setting, character-led atmosphere, strong story worldbuilding, readable costume context`,
    three_kingdoms: `${label}, Three Kingdoms era setting, martial or court atmosphere, strong historical narrative context, readable battlefield or palace environment`,
    jinyong: `${label}, wuxia martial-arts setting, jianghu atmosphere, character-driven sword-and-clan worldbuilding, readable story context`,
    classic_lit: `${label}, Chinese classical literature setting, symbolic narrative atmosphere, story-rich cultural worldbuilding, readable dramatic context`,
    chinese_story: `${label}, Chinese folklore or historical-story setting, legendary narrative atmosphere, symbolic cultural environment, readable tale context`,
    fantasy: `${label}, magical fantasy setting, immersive worldbuilding, symbolic magical atmosphere, story-led visual context`,
    gothic: `${label}, gothic dark-fantasy setting, dramatic architecture or ritual atmosphere, controlled darkness, story-rich environment`,
    darkfantasy: `${label}, dark fantasy setting, dangerous world atmosphere, dramatic symbolic environment, strong story tension`,
    spirits: `${label}, supernatural spirit-court setting, shape-shifter or demon-folklore atmosphere, symbolic narrative worldbuilding, readable fantasy context`,
    water: `${label}, underwater or water-mirror fantasy setting, reflective environmental atmosphere, immersive aquatic worldbuilding, cinematic depth`,
    goddess_myth: `${label}, mythological deity setting, symbolic power atmosphere, ceremonial or sacred environment, story-rich divine context`,
    holy_angel: `${label}, holy celestial setting, radiant sacred atmosphere, monumental environment, symbolic protective context`,
    fallen_angel: `${label}, fallen celestial setting, ruined sacred atmosphere, dramatic dark wings context, story-rich descent motif`,
    succubus_demon: `${label}, dark demon-court setting, infernal throne or ritual atmosphere, strong supernatural authority, dramatic fantasy context`,
    dragon_beast: `${label}, dragon or mythic beast setting, large-scale fantasy environment, companion-creature worldbuilding, strong legendary atmosphere`,
    beast_tamer: `${label}, beast-companion setting, bond-driven fantasy environment, readable animal partnership, story-led adventure context`,
    modern_lady: `${label}, contemporary urban portrait setting, polished lifestyle atmosphere, strong social identity, grounded modern realism`,
    realistic_life: `${label}, contemporary lifestyle photo setting, soft daily-life atmosphere, realistic environmental storytelling, natural portrait context`,
    queen: `${label}, sovereign portrait setting, ceremonial power atmosphere, throne or court worldbuilding, dramatic authority context`,
    wedding_diamond: `${label}, bridal portrait setting, ceremony or destination-wedding atmosphere, detailed gown context, romantic but grounded environment`,
    cyberpunk_sf: `${label}, cyberpunk or sci-fi setting, high-tech worldbuilding, neon or futuristic atmosphere, strong narrative environment`,
    game: `${label}, game-inspired original character setting, themed worldbuilding, stylized but readable environment, strong visual identity`,
    cos_character: `${label}, character-inspired cosplay portrait setting, signature worldbuilding, recognizable costume atmosphere, vivid themed environment`,
  };
  return byCategory[categoryId] || `${label}, story-rich portrait setting, readable environment, strong thematic atmosphere`;
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

function main() {
  const original = fs.readFileSync(INDEX_PATH, "utf8");
  const catsBlock = extractCatsBlock(original);
  const cats = vm.runInNewContext(`(${catsBlock.arrayText})`);
  const report = [];

  for (const category of cats) {
    const additions = ADDITIONS[category.id];
    if (!additions || additions.length === 0) continue;
    const existingKeys = new Set(
      category.entries.flatMap((entry) => [
        normalize(entry.name),
        normalize(`${entry.name}${entry.sub || ""}`),
        normalize(entry.sub),
      ]),
    );

    let addedCount = 0;
    for (const [name, sub, icon] of additions) {
      const keys = [normalize(name), normalize(`${name}${sub}`), normalize(sub)];
      if (keys.some((key) => key && existingKeys.has(key))) continue;

      const entry = {
        id: nextEntryId(category.id, category.entries),
        name,
        sub,
        icon,
        scene: buildScene(category.id, name, sub),
      };
      category.entries.push(entry);
      keys.forEach((key) => key && existingKeys.add(key));
      addedCount += 1;
    }

    if (addedCount > 0) {
      report.push(`${category.id}\t+${addedCount}\t${category.entries.length}`);
    }
  }

  const updatedArray = JSON.stringify(cats, null, 2);
  const updated = `${original.slice(0, catsBlock.start)}${updatedArray}${original.slice(catsBlock.end)}`;
  fs.writeFileSync(INDEX_PATH, updated, "utf8");
  console.log(report.join("\n"));
}

main();
