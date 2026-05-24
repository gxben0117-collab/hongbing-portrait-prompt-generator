import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeIdentitySafety, identityRiskFields } from './identity_safety.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const STYLE_MD_PATH = path.join(ROOT, '核心資料', '風格範例.md');
export const INDEX_DRAFT_PATH = path.join(ROOT, '核心資料', '風格索引草案.json');
export const INDEX_PATH = path.join(ROOT, '核心資料', '風格索引.json');
export const HTML_PATH = path.join(ROOT, 'index.html');

export const REQUIRED_FIELDS = [
  'ID',
  '妝容',
  '場景背景',
  '光線',
  '服裝',
  '動作與鏡頭',
  '構圖',
  '特效',
  '色調',
  '鏡頭角度',
  '圖片比例',
  '鏡頭焦段',
  '燈光風格',
  '整體氛圍',
  '鏡頭語言',
];

export const RUNTIME_FIELDS = [
  ['妝容', 'mk'],
  ['場景背景', 'scene'],
  ['服裝', 'outfit'],
  ['動作與鏡頭', 'prop'],
  ['構圖', 'comp'],
  ['鏡頭角度', 'ang'],
  ['圖片比例', 'ratio'],
  ['鏡頭焦段', 'lens'],
  ['燈光風格', 'light'],
  ['整體氛圍', 'atm'],
  ['鏡頭語言', 'camLang'],
];

export const THEME_DEFS = [
  { id: 'theme_01', shortName: '魅魔系列', name: '魅魔之吻．煉獄誘惑', icon: '💋', tpl: 'succubus_demon' },
  { id: 'theme_02', shortName: '魔王系列', name: '魔王降臨．深淵王座', icon: '👑', tpl: 'succubus_demon' },
  { id: 'theme_03', shortName: '墮天使系列', name: '墮天使．黑色神諭', icon: '🖤', tpl: 'fallen_angel' },
  { id: 'theme_04', shortName: '長相思系列', name: '長相思旅拍．大荒情緒', icon: '🌿', tpl: 'china_drama' },
  { id: 'theme_05', shortName: '神話系列', name: '上古傳說．中國神話', icon: '🐉', tpl: 'goddess_myth' },
  { id: 'theme_06', shortName: '聊齋系列', name: '聊齋誌異．妖魅幻境', icon: '🦊', tpl: 'fantasy' },
  { id: 'theme_07', shortName: '名著系列', name: '傳世經典．四大名著', icon: '📜', tpl: 'classic_lit' },
  { id: 'theme_08', shortName: '武俠系列', name: '江湖至尊．金庸武俠', icon: '⚔️', tpl: 'jinyong' },
  { id: 'theme_09', shortName: '陸劇系列', name: '影視熱播．陸劇同款', icon: '🎬', tpl: 'china_drama' },
  { id: 'theme_10', shortName: '古裝系列', name: '大國風華．歷代古裝', icon: '🏯', tpl: 'hanfu' },
  { id: 'theme_11', shortName: '仙俠系列', name: '謫仙情緣．東方仙俠', icon: '✨', tpl: 'xianxia' },
  { id: 'theme_12', shortName: '環球系列', name: '環球美景旅拍．異國光景', icon: '🌍', tpl: 'world_travel' },
  { id: 'theme_13', shortName: '魔幻系列', name: '聖堂與暗黑．西方魔幻', icon: '🏰', tpl: 'gothic' },
  { id: 'theme_14', shortName: '動漫系列', name: '次元覺醒．動漫科幻', icon: '🌌', tpl: 'cyberpunk_sf' },
  { id: 'theme_15', shortName: '婚紗系列', name: '當代時尚．女王婚紗', icon: '👗', tpl: 'wedding_diamond' },
];

export const THEME_BY_ID = Object.fromEntries(THEME_DEFS.map((theme) => [theme.id, theme]));

export const SERIES_ORDER = {
  theme_01: ['魅魔系列', '莉莉絲', '夜之女王', '魅魔魔王', '圖片逆推', '待審'],
  theme_02: ['女魔王', '魔冕女皇', '暗夜魔女', '叛逆女神', '冥界女王', '滅世魔女', '魅魔魔王', '圖片逆推', '待審'],
  theme_03: ['墮天使', '熾天使黑化', '聖女墮落', '復仇女神', '審判官', '末日預言', '流放者', '圖片逆推', '待審'],
  theme_04: ['小夭', '玟小六', '瑱瑱', '青丘王妃', '防風意映', '辰榮馨悅', '阿念', '皓翎王姬', '大荒神女', '西陵珩', '桑甜兒', '長相思', '熱播陸劇 v0.27', '待審'],
  theme_05: ['創世神祇', '崑崙瑤池', '月神日神', '山海神獸', '神女仙子', '冥府人間', '神話系列', '圖片逆推', '待審'],
  theme_06: ['聶小倩', '狐仙', '花妖精怪', '異獸妖魅', '聊齋人物', '聊齋系列', '待審'],
  theme_07: ['三國', '紅樓夢', '西遊記', '水滸傳', '木蘭', '傳世經典', '待審'],
  theme_08: ['黃蓉', '小龍女', '任盈盈', '周芷若', '東方不敗', '武俠群像', '金庸武俠', '女武士', '圖片逆推', '待審'],
  theme_09: ['甄嬛', '清宮權謀', '陸劇女主', '仙俠陸劇', '民國家族', '熱播陸劇 v0.27', '待審'],
  theme_10: ['漢服古裝', '朝代宮服', '漢代', '唐代', '宋代', '明代', '清代', '宮廷', '民國旗袍', '圖片逆推', '待審'],
  theme_11: ['仙子', '青丘狐仙', '月宮仙境', '桃花仙境', '月下劍仙', '暗黑東方', '東方仙俠', '待審'],
  theme_12: ['韓國東南亞', '中國地標', '歐洲旅拍', '世界地標旅拍', '世界民族', '異域幻想', '異域騎行', '清新旅拍', '旅拍補充 v0.27', '圖片逆推', '待審'],
  theme_13: ['聖堂神殿', '暗黑哥德', '奇幻魔法', '神話女神', '魔龍魔獸', '水下花境', '暗黑史詩', '精靈', '人魚', '圖片逆推', '待審'],
  theme_14: ['機械姬', '科幻', '魔法少女', '動漫遊戲', '遊戲角色', '偶像舞台', '賽博華風', '待審'],
  theme_15: ['赫本風', '婚紗經典', '復古婚紗', '拖尾婚紗', '魚尾婚紗', '黑色婚紗', '紅色婚紗', '彩色婚紗', '輕婚紗', '國潮婚紗', '旅拍婚紗', '中式喜嫁', '都市麗人', '時尚禮服', '待審'],
};

export const STATUS_ORDER = {
  core: 0,
  official: 1,
  supplement: 2,
  review: 3,
  duplicate: 4,
  hidden: 5,
};

export const DISPLAYABLE_STATUSES = new Set(['core', 'official', 'supplement']);
export const VALID_STATUSES = new Set(['core', 'official', 'supplement', 'review', 'hidden', 'duplicate']);
export const VALID_THEME_IDS = new Set(THEME_DEFS.map((theme) => theme.id));

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

export function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

export function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeTitle(title) {
  return String(title || '').replace(/\s+/g, ' ').trim();
}

export function markdownTable(rows, headers) {
  const header = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell ?? '').replace(/\r?\n/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

export function countBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item) || '(空)';
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), 'zh-Hant'));
}

export function groupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item) || '';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

export function duplicates(items, keyFn) {
  return [...groupBy(items, keyFn).entries()]
    .filter(([key, list]) => key && list.length > 1)
    .sort((a, b) => b[1].length - a[1].length || String(a[0]).localeCompare(String(b[0]), 'zh-Hant'));
}

export function parseCodeValue(rawValue) {
  const text = String(rawValue || '').trim();
  const code = text.match(/`([^`]+)`/);
  if (code) return code[1].trim();
  const beforeDash = text.split(/[—-]/)[0].trim();
  return beforeDash || text;
}

export function parseCards(markdown) {
  const lines = markdown.split(/\r?\n/);
  const cards = [];
  let current = null;

  function finish(endLine) {
    if (!current) return;
    current.endLine = endLine;
    current.block = current.lines.join('\n');
    current.fields = {};

    for (const field of REQUIRED_FIELDS) {
      const re = new RegExp(`\\*\\*${escapeRegExp(field)}[:：]\\*\\*\\s*([^\\n]+)`);
      const match = current.block.match(re);
      if (match) current.fields[field] = match[1].trim();
    }

    const idMatch = current.block.match(/\*\*ID[:：]\*\*\s*`?([^`\n]+)`?/);
    current.id = idMatch ? idMatch[1].trim() : '';
    const parts = current.title.split('·').map((part) => part.trim()).filter(Boolean);
    current.prefix = parts[0] || current.title.trim();
    current.name = parts[1] || current.title.trim();
    current.extraTitle = parts.slice(2).join(' · ');
    current.sourceHint = inferSourceHint(current);
    current.fieldCodes = {};
    for (const [mdField, runtimeField] of RUNTIME_FIELDS) {
      current.fieldCodes[runtimeField] = parseCodeValue(current.fields[mdField]);
    }
    cards.push(current);
  }

  lines.forEach((line, idx) => {
    const heading = line.match(/^####\s+(.+?)\s*$/);
    if (heading) {
      finish(idx);
      current = {
        title: heading[1].trim(),
        startLine: idx + 1,
        endLine: idx + 1,
        lines: [],
      };
      return;
    }
    if (current) current.lines.push(line);
  });
  finish(lines.length);
  return cards;
}

export function inferSourceHint(card) {
  const text = `${card.title}\n${card.block || ''}`;
  if (/rev_\d+|來源檔名|圖片逆推/.test(text)) return 'rev/image-analysis';
  if (/v0\.27|v027_/.test(text)) return 'v0.27 supplement';
  if (/補充/.test(text)) return 'supplement';
  return 'manual/official-like';
}

export function parseUiCats(htmlText) {
  const match = htmlText.match(/const CATS = ([\s\S]*?);\s*let curCatID/);
  if (!match) {
    throw new Error('Cannot find const CATS block in index.html');
  }
  return JSON.parse(match[1]);
}

export function flattenUiEntries(uiCats) {
  return uiCats.flatMap((cat) => (cat.entries || []).map((entry, entryIndex) => ({
    ...entry,
    catId: cat.id,
    catName: cat.name,
    catTpl: cat.tpl,
    catIcon: cat.icon,
    entryIndex,
  })));
}

export function buildDuplicateInfo(cards) {
  const titleDups = duplicates(cards, (card) => normalizeTitle(card.title));
  const idDups = duplicates(cards, (card) => card.id);
  return {
    titleDups,
    idDups,
    duplicateTitleKeys: new Set(titleDups.map(([title]) => title)),
    duplicateIds: new Set(idDups.map(([id]) => id)),
  };
}

const THEME_PREFIX_RULES = [
  ['theme_01', /(魅魔系列|莉莉絲|夜之女王)/],
  ['theme_02', /(女魔王|魔冕女皇|暗夜魔女|叛逆女神|冥界女王|滅世魔女|冥界魔后)/],
  ['theme_03', /(墮天使|熾天使|智天使|座天使|暮光神女|聖女|祈禱少女|荒原孤影|盲目信仰|復仇女神|命運主宰|守護星|預言女巫|黑化審判官|荊棘之路|孤獨者|叛逆黑翼)/],
  ['theme_04', /(小夭|玟小六|瑱瑱|青丘王妃|防風意映|辰榮馨悅|阿念|皓翎王姬|大荒神女|西陵珩|桑甜兒|長相思)/],
  ['theme_05', /(女媧|西王母|常羲|羲和|精衛|嫦娥|織女|巫山神女|洛神|九天玄女|孟婆|后土|祝融|玄冥|嫘祖|鳳凰|青鸞|白鹿|九尾狐|麒麟女|聆聽者|瑤池仙子|月宮玉兔|太陽鳥|軒轅妭|旱魃|姑射仙子|湘夫人|神話|神女|山海)/],
  ['theme_06', /(聶小倩|嬰寧|辛十四娘|狐仙|花妖|白秋練|聊齋|畫皮|鬼狐)/],
  ['theme_07', /(小喬|貂蟬|甄宓|王昭君|西施|黛玉|寶釵|熙鳳|探春|湘雲|悟空|嫦娥仙子|女兒國|白骨夫人|潘金蓮|扈三娘|李師師|花木蘭|名著|三國|紅樓|西遊|水滸)/],
  ['theme_08', /(黃蓉|小龍女|任盈盈|周芷若|趙敏|郭襄|東方不敗|王語嫣|阿朱|阿紫|木婉清|程靈素|殷素素|李莫愁|梅超風|俠女|金庸武俠|女武士|月下劍仙)/],
  ['theme_09', /(甄嬛|若曦|魏瓔珞|如懿|羋月|楚喬|陸貞|花千骨|白淺|素錦|錦覓|璇璣|時宜|陸劇|熱播陸劇|劇集)/],
  ['theme_10', /(漢服古裝|朝代宮服|漢代|唐代|宋代|明代|清代|宮廷|古裝|民國|旗袍|春庭仕女|宮廷劍姬|明朝娘娘)/],
  ['theme_11', /(仙子|仙俠|青丘|桃花仙境|月宮|紫月|月下劍仙|暗黑東方|賽博華風)/],
  ['theme_12', /(韓服|和服|泰式|印度|法式|英倫|美式|世界民族|世界地標旅拍|旅拍補充|異域|環球|清新旅拍|異域旅拍|異域騎行)/],
  ['theme_13', /(精靈|人魚|女巫|吸血鬼|哥德|暗黑哥德|奇幻|魔幻|聖殿|聖堂|魔龍|魔獸|水下花境|暗黑史詩|星夜精靈)/],
  ['theme_14', /(動漫|遊戲|科幻|機械姬|魔法少女|賽博|拳姬|掌宗|偶像|搖滾)/],
  ['theme_15', /(婚紗|喜嫁|赫本風|都市麗人|禮服|中式喜嫁|白紗|黑紗|紅色婚紗|拖尾婚紗|魚尾婚紗)/],
];

export function inferTheme(card, uiEntry) {
  if (uiEntry?.catId) return uiEntry.catId;
  const text = `${card.title} ${card.id}`;
  for (const [themeId, re] of THEME_PREFIX_RULES) {
    if (re.test(text)) return themeId;
  }
  return 'theme_13';
}

export function inferSeries(card, themeId, uiEntry) {
  const title = card.title || '';
  const prefix = card.prefix || '';
  if (card.sourceHint === 'rev/image-analysis') {
    if (/都市麗人/.test(prefix) && themeId === 'theme_15') return '都市麗人';
    if (/動漫遊戲/.test(prefix)) return '動漫遊戲';
    if (/世界民族/.test(prefix)) return '世界民族';
    if (/異域騎行/.test(prefix)) return '異域騎行';
    if (/異域/.test(prefix)) return '異域幻想';
    if (/漢服|朝代|宮廷|明朝|春庭/.test(prefix)) return '圖片逆推';
    if (/暗黑哥德/.test(prefix)) return '暗黑哥德';
    if (/奇幻/.test(prefix)) return '奇幻魔法';
    if (/婚|喜嫁/.test(prefix)) return '中式喜嫁';
    if (/神話仙界|神話火鳳/.test(prefix)) return '圖片逆推';
    if (/冥界魔后/.test(prefix)) return '冥界女王';
    if (/賽博華風/.test(prefix)) return '賽博華風';
    if (/暗黑東方/.test(prefix)) return '暗黑東方';
    if (/清新旅拍/.test(prefix)) return '清新旅拍';
    return prefix || '圖片逆推';
  }

  if (themeId === 'theme_01') {
    if (/魅魔魔王/.test(prefix)) return '魅魔魔王';
    if (/莉莉絲/.test(prefix)) return '莉莉絲';
    if (/夜之女王/.test(prefix)) return '夜之女王';
    return '魅魔系列';
  }
  if (themeId === 'theme_02') {
    if (/女魔王/.test(prefix)) return '女魔王';
    if (/魔冕女皇/.test(prefix)) return '魔冕女皇';
    if (/暗夜魔女/.test(prefix)) return '暗夜魔女';
    if (/叛逆女神/.test(prefix)) return '叛逆女神';
    if (/冥界|冥府/.test(prefix)) return '冥界女王';
    if (/滅世/.test(prefix)) return '滅世魔女';
    if (/魅魔魔王/.test(prefix)) return '魅魔魔王';
    return prefix || '待審';
  }
  if (themeId === 'theme_03') {
    if (/墮天使|墮落之翼|黑翼/.test(prefix + title)) return '墮天使';
    if (/熾天使|智天使|座天使/.test(prefix)) return '熾天使黑化';
    if (/聖女|祈禱少女/.test(prefix)) return '聖女墮落';
    if (/黑化審判官/.test(prefix)) return '審判官';
    if (/復仇女神/.test(prefix)) return '復仇女神';
    if (/守護星|預言女巫|命運主宰/.test(prefix)) return '末日預言';
    if (/荒原孤影|盲目信仰|荊棘之路|孤獨者|暮光神女/.test(prefix)) return '流放者';
    return '墮天使';
  }
  if (themeId === 'theme_04') {
    if (/熱播陸劇|v0\.27/.test(title)) return '熱播陸劇 v0.27';
    return prefix || '長相思';
  }
  if (themeId === 'theme_05') {
    if (/女媧|后土|嫘祖/.test(prefix)) return '創世神祇';
    if (/西王母|瑤池/.test(prefix)) return '崑崙瑤池';
    if (/常羲|羲和|嫦娥|月宮玉兔|太陽鳥|洛神/.test(prefix)) return '月神日神';
    if (/精衛|祝融|玄冥|鳳凰|青鸞|白鹿|九尾狐|麒麟|聆聽者|精靈|山海/.test(prefix)) return '山海神獸';
    if (/孟婆|旱魃/.test(prefix)) return '冥府人間';
    if (/巫山神女|九天玄女|姑射仙子|湘夫人|神女|仙子/.test(prefix)) return '神女仙子';
    if (/神話|雅典娜|奇幻史詩|神話仙界|神話火鳳/.test(prefix)) return '神話系列';
    return '神話系列';
  }
  if (themeId === 'theme_06') {
    if (/聶小倩/.test(prefix)) return '聶小倩';
    if (/狐仙|辛十四娘|九尾/.test(prefix)) return '狐仙';
    if (/嬰寧|花|水仙|白秋練/.test(prefix)) return '花妖精怪';
    if (/妖|精怪|人魚/.test(prefix)) return '異獸妖魅';
    if (/聊齋/.test(prefix)) return '聊齋系列';
    return '聊齋人物';
  }
  if (themeId === 'theme_07') {
    if (/小喬|大喬|貂蟬|甄宓|王昭君|西施|三國/.test(prefix + title)) return '三國';
    if (/黛玉|寶釵|熙鳳|探春|湘雲|紅樓/.test(prefix + title)) return '紅樓夢';
    if (/悟空|女兒國|白骨|西遊/.test(prefix + title)) return '西遊記';
    if (/潘金蓮|扈三娘|李師師|水滸/.test(prefix + title)) return '水滸傳';
    if (/木蘭|花木蘭/.test(prefix + title)) return '木蘭';
    return '傳世經典';
  }
  if (themeId === 'theme_08') {
    if (/黃蓉/.test(prefix)) return '黃蓉';
    if (/小龍女/.test(prefix)) return '小龍女';
    if (/任盈盈/.test(prefix)) return '任盈盈';
    if (/周芷若/.test(prefix)) return '周芷若';
    if (/東方不敗/.test(prefix)) return '東方不敗';
    if (/女武士/.test(prefix)) return '女武士';
    if (/金庸武俠/.test(prefix)) return '金庸武俠';
    return '武俠群像';
  }
  if (themeId === 'theme_09') {
    if (/甄嬛/.test(prefix)) return '甄嬛';
    if (/若曦|魏瓔珞|如懿|羋月|宮|清/.test(prefix + title)) return '清宮權謀';
    if (/白淺|素錦|錦覓|璇璣|花千骨/.test(prefix + title)) return '仙俠陸劇';
    if (/民國|家業|徽商/.test(prefix + title)) return '民國家族';
    if (/熱播陸劇|v0\.27/.test(title)) return '熱播陸劇 v0.27';
    return '陸劇女主';
  }
  if (themeId === 'theme_05' && /(常羲|羲和|嫦娥|月宮玉兔|太陽鳥)/.test(prefix)) return '月神日神';
  if (themeId === 'theme_05' && /(鳳凰|青鸞|白鹿|九尾狐|麒麟|精靈)/.test(prefix)) return '山海神獸';
  if (themeId === 'theme_10') {
    if (/(民國|旗袍|都市麗人)/.test(prefix + title)) return '民國旗袍';
    if (/朝代宮服/.test(prefix)) return '朝代宮服';
    if (/漢代/.test(prefix)) return '漢代';
    if (/唐代/.test(prefix)) return '唐代';
    if (/宋代/.test(prefix)) return '宋代';
    if (/明代|明朝/.test(prefix)) return '明代';
    if (/清代/.test(prefix)) return '清代';
    if (/宮廷|春庭|劍姬|喜嫁/.test(prefix)) return '宮廷';
    if (/漢服古裝|古裝/.test(prefix)) return '漢服古裝';
    return '圖片逆推';
  }
  if (themeId === 'theme_11') {
    if (/青丘|狐仙/.test(prefix + title)) return '青丘狐仙';
    if (/月宮|玉兔/.test(prefix + title)) return '月宮仙境';
    if (/桃花/.test(prefix + title)) return '桃花仙境';
    if (/劍仙/.test(prefix + title)) return '月下劍仙';
    if (/暗黑東方|賽博華風|玄鴉/.test(prefix + title)) return '暗黑東方';
    if (/仙子/.test(prefix)) return '仙子';
    return '東方仙俠';
  }
  if (themeId === 'theme_12' && /旅拍補充/.test(prefix)) return '旅拍補充 v0.27';
  if (themeId === 'theme_12') {
    if (/韓服|和服|泰式|印度|清邁|東南亞|韓國/.test(prefix + title)) return '韓國東南亞';
    if (/中國|烏鎮|西塘|鳳凰古城/.test(prefix + title)) return '中國地標';
    if (/法式|英倫|倫敦|歐洲/.test(prefix + title)) return '歐洲旅拍';
    if (/世界地標|羚羊谷|烏尤尼|紐約|加拿大|冰島|澳洲|巴西|土耳其/.test(prefix + title)) return '世界地標旅拍';
    if (/世界民族|草原/.test(prefix + title)) return '世界民族';
    if (/異域騎行/.test(prefix + title)) return '異域騎行';
    if (/異域/.test(prefix + title)) return '異域幻想';
    if (/清新旅拍/.test(prefix + title)) return '清新旅拍';
    return '世界地標旅拍';
  }
  if (themeId === 'theme_13' && /暗黑哥德/.test(prefix)) return '暗黑哥德';
  if (themeId === 'theme_13' && /奇幻魔法/.test(prefix)) return '奇幻魔法';
  if (themeId === 'theme_13') {
    if (/聖殿|聖堂|聖女|女騎士|教堂|神殿/.test(prefix + title)) return '聖堂神殿';
    if (/暗黑哥德|哥德|吸血鬼|石像鬼|黑曜/.test(prefix + title)) return '暗黑哥德';
    if (/奇幻魔法|女巫|魔法|精靈|獨角獸|蘑菇/.test(prefix + title)) return '奇幻魔法';
    if (/神話女神|女神/.test(prefix + title)) return '神話女神';
    if (/魔龍|魔獸|龍裔/.test(prefix + title)) return '魔龍魔獸';
    if (/水下|人魚|水底|泳池|海/.test(prefix + title)) return '水下花境';
    if (/暗黑史詩|鳳凰|戰甲/.test(prefix + title)) return '暗黑史詩';
    if (/精靈/.test(prefix + title)) return '精靈';
    if (/人魚/.test(prefix + title)) return '人魚';
    return '奇幻魔法';
  }
  if (themeId === 'theme_14') {
    if (/機械姬/.test(prefix + title)) return '機械姬';
    if (/科幻|賽博/.test(prefix + title)) return '科幻';
    if (/魔法少女/.test(prefix + title)) return '魔法少女';
    if (/偶像|舞台|流量|搖滾/.test(prefix + title)) return '偶像舞台';
    if (/動漫遊戲|拳姬|掌宗/.test(prefix + title)) return '動漫遊戲';
    if (/遊戲|原神|楓丹/.test(prefix + title)) return '遊戲角色';
    return '動漫遊戲';
  }
  if (themeId === 'theme_15') {
    if (/赫本/.test(prefix + title)) return '赫本風';
    if (/經典|鑽石|蓬蓬裙/.test(prefix + title)) return '婚紗經典';
    if (/復古/.test(prefix + title)) return '復古婚紗';
    if (/拖尾/.test(prefix + title)) return '拖尾婚紗';
    if (/魚尾/.test(prefix + title)) return '魚尾婚紗';
    if (/黑色|黑紗/.test(prefix + title)) return '黑色婚紗';
    if (/紅色|烈焰/.test(prefix + title)) return '紅色婚紗';
    if (/藍色|粉色|香檳/.test(prefix + title)) return '彩色婚紗';
    if (/輕婚紗/.test(prefix + title)) return '輕婚紗';
    if (/國潮/.test(prefix + title)) return '國潮婚紗';
    if (/旅拍/.test(prefix + title)) return '旅拍婚紗';
    if (/中式喜嫁|喜嫁/.test(prefix + title)) return '中式喜嫁';
    if (/都市麗人/.test(prefix + title)) return '都市麗人';
    return '時尚禮服';
  }
  return prefix;
}

export function inferSourceType(card) {
  if (card.sourceHint === 'rev/image-analysis') return 'rev';
  if (card.sourceHint === 'v0.27 supplement') return 'v0.27';
  if (card.sourceHint === 'supplement') return 'supplement';
  return 'manual';
}

export function inferSourceBatch(card) {
  if (card.sourceHint === 'rev/image-analysis') return 'rev';
  if (card.sourceHint === 'v0.27 supplement') return 'v0.27';
  if (/補充/.test(card.title)) return 'supplement';
  return 'core';
}

export function missingFields(card) {
  return REQUIRED_FIELDS.filter((field) => !card.fields[field]);
}

export function runtimeMappingGaps(card) {
  return ['妝容', '場景背景', '服裝', '動作與鏡頭'].filter((field) => !card.fields[field]);
}

export function inferRiskFlags(card, duplicateInfo) {
  const flags = [];
  const missing = missingFields(card);
  const runtimeGaps = runtimeMappingGaps(card);
  const text = `${card.title}\n${card.block || ''}`;
  if (runtimeGaps.length) flags.push('mapping_gap');
  if (missing.length) flags.push('field_gap');
  if (duplicateInfo.duplicateTitleKeys.has(normalizeTitle(card.title))) flags.push('duplicate_title');
  if (duplicateInfo.duplicateIds.has(card.id)) flags.push('duplicate_id');
  if (/rev_\d+/.test(card.id) || card.sourceHint === 'rev/image-analysis') flags.push('reverse_sample');
  if (/v0\.27|v027_/.test(text)) flags.push('v0.27');
  if (/(heroine|beauty|goddess face|celebrity|perfect beauty|flawless|luxury beauty|actress template|influencer face)/i.test(text)) flags.push('identity_risk');
  const identityAnalysis = analyzeIdentitySafety(text);
  flags.push(...identityAnalysis.flags);
  if (identityAnalysis.level !== 'low') flags.push('identity_rewrite_needed');
  if (/(仰拍|回眸|back-facing|jumping|spinning|arms overhead|covering face|遮臉)/i.test(text)) flags.push('pose_risk');
  if (/(movie trailer|cinematic trailer|超廣角|廣角仰拍|人物渺小|bird's-eye tiny subject|epic scale subject tiny)/i.test(text)) flags.push('camera_risk');
  if (/(UE5 cinematic|仙氣縹緲|女神感|純淨無瑕|冷豔絕世|光芒萬丈)/i.test(text)) flags.push('legacy_style_drift');
  return [...new Set(flags)];
}

export function inferIdentityRiskFields(card) {
  return identityRiskFields(`${card.title}\n${card.block || ''}`);
}

export function inferUiStatus(card, uiEntry, duplicateInfo) {
  const flags = inferRiskFlags(card, duplicateInfo);
  if (flags.includes('duplicate_title') || flags.includes('duplicate_id')) return 'duplicate';
  if (card.sourceHint === 'rev/image-analysis') return 'review';
  if (card.sourceHint === 'v0.27 supplement') return uiEntry ? 'supplement' : 'review';
  if (!uiEntry) return 'review';
  if (runtimeMappingGaps(card).length > 0) return 'review';
  return 'official';
}

export function isCoreCandidate(indexEntry, perThemeSeenCount) {
  if (indexEntry.ui_status !== 'official') return false;
  if (perThemeSeenCount >= 2) return false;
  const blockingFlags = new Set([
    'duplicate_title',
    'duplicate_id',
    'reverse_sample',
    'identity_risk',
    'identity_rewrite_needed',
    'beauty_template_risk',
    'archetype_face_risk',
    'editorial_beauty_risk',
    'dynamic_angle_identity_risk',
    'head_scale_risk',
    'makeup_restructure_risk',
    'pose_risk',
    'camera_risk',
  ]);
  if ((indexEntry.risk_flags || []).some((flag) => blockingFlags.has(flag))) return false;
  return true;
}

export function seriesRank(themeId, series) {
  const order = SERIES_ORDER[themeId] || [];
  const idx = order.indexOf(series);
  return idx === -1 ? 80 : idx;
}

export function sortWeightFor(entry, sequenceInTheme) {
  const base = {
    core: 1000,
    official: 2000,
    supplement: 5000,
    review: 7000,
    duplicate: 9000,
    hidden: 9500,
  }[entry.ui_status] ?? 7000;
  return base + seriesRank(entry.theme_id, entry.series) * 20 + sequenceInTheme;
}

export function indexSort(a, b) {
  return (
    a.theme_id.localeCompare(b.theme_id) ||
    a.sort_weight - b.sort_weight ||
    seriesRank(a.theme_id, a.series) - seriesRank(b.theme_id, b.series) ||
    STATUS_ORDER[a.ui_status] - STATUS_ORDER[b.ui_status] ||
    a.title.localeCompare(b.title, 'zh-Hant') ||
    a.id.localeCompare(b.id)
  );
}

export function entrySort(a, b) {
  return (
    (a.sort_weight ?? 9999) - (b.sort_weight ?? 9999) ||
    String(a.series || '').localeCompare(String(b.series || ''), 'zh-Hant') ||
    String(a.sub || '').localeCompare(String(b.sub || ''), 'zh-Hant') ||
    String(a.name || '').localeCompare(String(b.name || ''), 'zh-Hant')
  );
}

export function loadProjectData() {
  const md = readText(STYLE_MD_PATH);
  const html = readText(HTML_PATH);
  const cards = parseCards(md);
  const uiCats = parseUiCats(html);
  const uiEntries = flattenUiEntries(uiCats);
  return { md, html, cards, uiCats, uiEntries };
}
