import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const MD_PATH = path.join(ROOT, "核心資料", "風格範例.md");
const INDEX_PATH = path.join(ROOT, "index.html");

const CATEGORY_MAP = new Map([
  ["魅魔魔王", "theme_01"],
  ["墮天使系列", "theme_03"],
  ["長相思", "theme_04"],
  ["中國故事人物", "theme_05"],
  ["金庸武俠", "theme_08"],
  ["女王系列", "theme_09"],
  ["朝代宮服", "theme_10"],
  ["漢服古裝", "theme_10"],
  ["世界地標旅拍", "theme_12"],
  ["台灣景點", "theme_12"],
  ["都市麗人", "theme_12"],
  ["聖堂天使", "theme_13"],
]);

const TPL_BY_CATEGORY = new Map([
  ["魅魔魔王", "succubus_demon"],
  ["墮天使系列", "fallen_angel"],
  ["長相思", "china_drama"],
  ["中國故事人物", "chinese_story"],
  ["金庸武俠", "jinyong"],
  ["女王系列", "queen"],
  ["朝代宮服", "hanfu"],
  ["漢服古裝", "hanfu"],
  ["世界地標旅拍", "world_travel"],
  ["台灣景點", "world_travel"],
  ["都市麗人", "modern_lady"],
  ["聖堂天使", "holy_angel"],
]);

const ENTRY_KEY_ORDER = [
  "id",
  "name",
  "sub",
  "icon",
  "scene",
  "outfit",
  "prop",
  "comp",
  "fx",
  "tone",
  "mk",
  "tpl",
  "ratio",
  "lens",
  "ang",
  "camLang",
  "atm",
  "light",
];

function extractCatsBlock(text) {
  const declaration = "const CATS = [";
  const start = text.indexOf(declaration);
  if (start === -1) throw new Error("CATS declaration not found");
  const openIndex = text.indexOf("[", start);
  let depth = 0;
  let inString = false;
  let quote = "";
  let escape = false;
  let closeIndex = -1;
  for (let i = openIndex; i < text.length; i += 1) {
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
    else if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        closeIndex = i;
        break;
      }
    }
  }
  if (closeIndex === -1) throw new Error("CATS closing bracket not found");
  return {
    arrayStart: openIndex,
    arrayEnd: closeIndex + 1,
    arrayText: text.slice(openIndex, closeIndex + 1),
  };
}

function parseCats(arrayText) {
  return vm.runInNewContext(`(${arrayText})`);
}

function field(block, label) {
  const match = block.match(new RegExp(`^- \\*\\*${label}[:：]\\*\\*\\s*(.*)$`, "m"));
  return match ? match[1].trim().replace(/^`|`$/g, "") : "";
}

function parseReverseCards(md) {
  const section = md.split("## 逆推正常咒語樣本")[1] || "";
  return section
    .split(/(?=^#### )/m)
    .map((block) => block.trimStart())
    .filter((block) => block.startsWith("#### "))
    .map((block) => {
      const title = block.match(/^####\s+(.+)$/m)?.[1] || "";
      const parts = title.split(" · ");
      const category = parts[0] || "";
      const name = parts[1] || title;
      const sub = parts.slice(2).join(" · ") || category;
      return {
        category,
        targetCatId: CATEGORY_MAP.get(category),
        entry: orderEntry({
          id: field(block, "ID"),
          name,
          sub,
          icon: "↩",
          scene: field(block, "場景背景"),
          outfit: field(block, "服裝"),
          prop: field(block, "動作與鏡頭"),
          comp: field(block, "構圖"),
          fx: field(block, "特效"),
          tone: field(block, "色調"),
          mk: field(block, "妝容"),
          tpl: TPL_BY_CATEGORY.get(category) || "xianxia",
          ratio: field(block, "圖片比例"),
          lens: field(block, "鏡頭焦段"),
          ang: field(block, "鏡頭角度"),
          camLang: field(block, "鏡頭語言"),
          atm: field(block, "整體氛圍"),
          light: field(block, "燈光風格"),
        }),
      };
    })
    .filter((card) => card.targetCatId && card.entry.id);
}

function orderEntry(entry) {
  const ordered = {};
  for (const key of ENTRY_KEY_ORDER) {
    if (entry[key]) ordered[key] = entry[key];
  }
  return ordered;
}

function main() {
  const md = fs.readFileSync(MD_PATH, "utf8");
  const cards = parseReverseCards(md);
  const indexText = fs.readFileSync(INDEX_PATH, "utf8");
  const block = extractCatsBlock(indexText);
  const cats = parseCats(block.arrayText);

  let inserted = 0;
  const byCat = new Map();
  for (const card of cards) {
    if (!byCat.has(card.targetCatId)) byCat.set(card.targetCatId, []);
    byCat.get(card.targetCatId).push(card.entry);
  }

  for (const cat of cats) {
    const additions = byCat.get(cat.id) || [];
    cat.entries = cat.entries.filter((entry) => !String(entry.id || "").startsWith("rev_"));
    cat.entries.push(...additions);
    inserted += additions.length;
  }

  const nextArrayText = JSON.stringify(cats, null, 2);
  const nextText = indexText.slice(0, block.arrayStart) + nextArrayText + indexText.slice(block.arrayEnd);
  fs.writeFileSync(INDEX_PATH, nextText, "utf8");
  console.log(JSON.stringify({ reverseCards: cards.length, insertedRuntimeEntries: inserted }, null, 2));
}

main();
