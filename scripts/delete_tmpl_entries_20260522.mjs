/**
 * 刪除所有模板殘留條目（[TMPL]）：
 * 判斷標準：entry.name 以 anchor 開頭，且 name 長度 > anchor 長度（排除純地名原始條目）
 * 同步更新 index.html 和 核心資料/風格範例.md
 */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// 完整 anchor 字串（來自 CATEGORY_CONFIG）
const ANCHORS = {
  taiwan_travel:  ['九份山城','淡水河岸','阿里雲海','大稻埕街屋','高美濕地','北投湯屋'],
  mountain_sea:   ['雪峰高線','黑沙海崖','鹽湖鏡面','峽灣絕壁','火山礫岸','雲海草甸'],
  europe_travel:  ['左岸石橋','運河拱橋','古堡長廊','廣場鐘樓','藍白坡城','花窗宮廳'],
  japan_travel:   ['祇園石路','神社參道','雪燈木屋','海岸鐵道','竹林曲徑','溫泉旅館'],
  korea_sea:      ['韓屋庭院','宮門回廊','熱帶海灣','古城燈河','都會天臺','海上石林'],
  world_travel:   ['都會廣場','熱氣球谷','沙海古蹟','海港歌劇院','山城遺址','霧橋海灣'],
  china_mark:     ['紅牆深巷','江岸夜景','山門雲橋','石窟古道','雪城長街','湖亭斷橋'],
  hanfu:          ['竹院長廊','月庭花影','蘭亭水榭','書閣窗紗','春山石徑','燈市橋頭'],
  dynasty_palace: ['宣室朝階','鳳闕長廊','深宮畫屏','御園水榭','寢殿珠簾','雪庭宮道'],
  tang_grandeur:  ['大明宮階','曲江花亭','華清池畔','長安夜市','胡旋舞庭','梨園畫閣'],
  song_grace:     ['汴京書閣','點茶小亭','汝窯案几','簾影水榭','竹窗抄經','梅庭折枝'],
  ming_grace:     ['金陵畫舫','雲錦繡坊','宮門夜巡','江南廊橋','海港驛亭','竹院書房'],
  qing_grace:     ['紅牆宮道','點翠鏡閣','御園湖岸','行宮雕窗','雪廊深庭','燈河花影'],
  oriental:       ['月門庭院','古橋流水','花窗書齋','石階燈亭','柳岸茶席','深巷雨廊'],
  reference_styles:['銀鹽暗房','雕塑光面','玻璃溫室','黑白劇場','沙丘留白','金屬長廊'],
  xianxia:        ['雲橋山門','桃林石階','仙島長亭','雪殿回廊','古城燈樓','谷口霧橋'],
  myth:           ['古神祭壇','河源石階','天幕神柱','海霧孤島','星河高臺','松風秘境'],
  china_myth_chars:['瑤池玉階','蓮臺水鏡','雲宮金闕','月殿長廊','古陵石門','山海祭地'],
  drama:          ['清水鎮巷','王城長階','山谷渡橋','海邊高臺','夜雪軍營','林間秘路'],
  hotdrama:       ['宮門石階','長街雨巷','藥鋪深院','邊城營門','舟渡蘆港','書局簷影'],
  china_drama:    ['黃浦櫥窗','書局花市','長街雨夜','舊宅庭院','雪亭長椅','城市天橋'],
  three_kingdoms: ['銅雀高臺','軍帳沙盤','江東水榭','長坂古道','宮門金殿','草船江霧'],
  jinyong:        ['桃花島岸','古墓石室','雪山棧道','酒肆長街','山門竹林','宮廷回廊'],
  classic_lit:    ['杏壇書院','紅樓花園','蓮池長橋','古寺鐘廊','山頂送別','月下畫舫'],
  chinese_story:  ['斷橋水畔','長城烽臺','花市橋頭','山門軍道','琵琶驛站','彩雲祭地'],
  fantasy:        ['符文塔階','占星圓廳','森境祭壇','藥水工坊','時鐘高臺','異界石橋'],
  gothic:         ['古堡石廊','黑玫窗臺','月塔長階','燭廳王座','霧園鐵門','雨夜鐘樓'],
  darkfantasy:    ['深淵裂臺','黑焰王座','骸骨長橋','血月祭地','廢墟石門','影霧山城'],
  spirits:        ['狐火古橋','蘆汀水岸','霜林石碑','井欄月庭','山門鐘影','紙燈長街'],
  water:          ['水鏡花亭','玻璃魚道','深池光廊','荷塘石橋','雨幕溫室','海藍階臺'],
  goddess_myth:   ['星柱祭庭','潮月石臺','穀風高壇','霜林神徑','火紋聖牆','晨泉長階'],
  holy_angel:     ['聖堂穹窗','雲門高臺','百合水庭','鐘翼長廊','祈雨石階','琉璃回廳'],
  fallen_angel:   ['黑翼石廊','殘照祭臺','墮羽長橋','深井王庭','斷鐘穹頂','暗水高牆'],
  succubus_demon: ['黑曜宴廳','血酒長桌','焰紋王座','暗藤花園','紫霧劇場','深紅石階'],
  dragon_beast:   ['龍脊山門','冰焰谷地','金巢高臺','黑岩峽口','雲岫草甸','熔脈石橋'],
  beast_tamer:    ['林場石徑','鷹塔草坡','雪原營地','獸欄木臺','河谷牧線','風沙古道'],
  modern_lady:    ['玻璃碼頭','中庭展牆','高空餐廳','模型會議桌','花市街角','精品大廳'],
  realistic_life: ['草坪野餐','圖書館窗邊','海邊木道','居家晨桌','雨巷街口','銀杏長椅'],
  queen:          ['霜原王庭','曜石議臺','海崖高階','月港長廊','金穗大殿','天階閱兵'],
  wedding_diamond:['雪松山谷','美術館廊橋','古港碼頭','雨夜櫥窗','葡萄園長桌','古典書庫'],
  cyberpunk_sf:   ['霓虹高架','義體診所','雨夜市集','全息舞臺','量子車站','黑市巷口'],
  game:           ['戰備大廳','法陣石臺','偶像舞臺','機甲港口','學園走廊','雲端競技場'],
  cos_character:  ['舞台簾幕','展館長廊','城鎮街景','森林空地','科幻月臺','學園天臺'],
};

function isTmpl(catId, entryName) {
  const anchors = ANCHORS[catId] || [];
  for (const a of anchors) {
    if (entryName.startsWith(a) && entryName.length > a.length) return true;
  }
  return false;
}

// ── Part 1: index.html ────────────────────────────────────────────────────────

const htmlPath = path.join(ROOT, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const marker = 'const CATS = [';
const open = html.indexOf('[', html.indexOf(marker));
let depth=0,inStr=false,q='',esc=false,end=open;
for(let i=open;i<html.length;i++){const ch=html[i];if(inStr){if(esc){esc=false;continue;}if(ch==='\\'){esc=true;continue;}if(ch===q)inStr=false;continue;}if(ch==="'"||ch==='"'){inStr=true;q=ch;continue;}if(ch==='[')depth++;if(ch===']'){depth--;if(depth===0){end=i+1;break;}}}
const cats = vm.runInNewContext('('+html.slice(open,end)+')');

let htmlDeleted = 0;
const deletedIds = new Set();

for (const cat of cats) {
  const before = cat.entries.length;
  cat.entries = cat.entries.filter(e => {
    if (isTmpl(cat.id, e.name)) {
      deletedIds.add(e.id);
      return false;
    }
    return true;
  });
  htmlDeleted += before - cat.entries.length;
}

const newHtml = html.slice(0, open) + JSON.stringify(cats, null, 2) + html.slice(end);
fs.writeFileSync(htmlPath, newHtml, 'utf8');
console.log(`index.html: deleted ${htmlDeleted} template entries`);

// ── Part 2: 風格範例.md ──────────────────────────────────────────────────────

const mdPath = path.join(ROOT, '核心資料/風格範例.md');
const md = fs.readFileSync(mdPath, 'utf8');
const lines = md.split('\n');

const result = [];
let sectionLines = [];
let sectionHasDeleteId = false;
let mdDeleted = 0;
let inSection = false;

function flushSection() {
  if (!inSection) return;
  if (sectionHasDeleteId) { mdDeleted++; }
  else { result.push(...sectionLines); }
  sectionLines = [];
  sectionHasDeleteId = false;
  inSection = false;
}

for (const line of lines) {
  if (line.startsWith('### ')) {
    flushSection();
    inSection = true;
    sectionLines = [line];
  } else if (/^#{1,2} /.test(line)) {
    flushSection();
    result.push(line);
  } else {
    if (inSection) {
      sectionLines.push(line);
      const m = line.match(/\*\*ID:\*\*\s*`([^`]+)`/);
      if (m && deletedIds.has(m[1])) sectionHasDeleteId = true;
    } else {
      result.push(line);
    }
  }
}
flushSection();

fs.writeFileSync(mdPath, result.join('\n'), 'utf8');
console.log(`風格範例.md: deleted ${mdDeleted} sections`);

// ── 最終統計 ─────────────────────────────────────────────────────────────────

const remaining = cats.reduce((s,c)=>s+c.entries.length,0);
console.log(`剩餘條目：${remaining}`);
