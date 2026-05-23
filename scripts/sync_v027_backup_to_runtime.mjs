import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const MD_PATH = path.join(ROOT, "核心資料", "風格範例.md");
const INDEX_PATH = path.join(ROOT, "index.html");

const CATEGORY_MAP = [
  [/暗黑哥德 v0\.27/, { cat: "theme_13", tpl: "gothic", icon: "☾" }],
  [/奇幻魔法 v0\.27/, { cat: "theme_13", tpl: "fantasy", icon: "✦" }],
  [/水下花境 v0\.27/, { cat: "theme_13", tpl: "water", icon: "≈" }],
  [/動漫遊戲 v0\.27/, { cat: "theme_14", tpl: "game", icon: "◇" }],
  [/長相思 v0\.27/, { cat: "theme_04", tpl: "china_drama", icon: "✿" }],
  [/熱播陸劇 v0\.27/, { cat: "theme_09", tpl: "drama", icon: "映" }],
  [/旅拍補充 v0\.27/, { cat: "theme_12", tpl: "world_travel", icon: "⌖" }],
  [/熱門COS v0\.27/, { cat: "theme_14", tpl: "cos_character", icon: "◇" }],
];

const ENTRY_KEYS = ["id", "name", "sub", "icon", "scene", "outfit", "prop", "comp", "mk", "tpl", "ratio", "lens", "ang", "camLang", "atm", "light"];

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
  return { arrayStart: openIndex, arrayEnd: closeIndex + 1, arrayText: text.slice(openIndex, closeIndex + 1) };
}

function parseCats(arrayText) {
  return vm.runInNewContext(`(${arrayText})`);
}

function field(block, label) {
  const match = block.match(new RegExp(`^- \\*\\*${label}[:：]\\*\\*\\s*(.*)$`, "m"));
  return match ? match[1].trim().replace(/^`|`$/g, "") : "";
}

function configFor(title) {
  const hit = CATEGORY_MAP.find(([re]) => re.test(title));
  return hit ? hit[1] : null;
}

function order(entry) {
  const next = {};
  for (const key of ENTRY_KEYS) if (entry[key]) next[key] = entry[key];
  return next;
}

function parseCards(md) {
  const start = md.indexOf("## v0.27 備檔整理匯入");
  const end = md.indexOf("## 逆推正常咒語樣本", start);
  const section = start === -1 ? "" : md.slice(start, end === -1 ? undefined : end);
  return section
    .split(/(?=^#### )/m)
    .map((block) => block.trimStart())
    .filter((block) => block.startsWith("#### "))
    .map((block) => {
      const title = block.match(/^####\s+(.+)$/m)?.[1] || "";
      const parts = title.split(" · ");
      const cfg = configFor(parts[0] || "");
      if (!cfg) return null;
      return {
        targetCatId: cfg.cat,
        entry: order({
          id: field(block, "ID"),
          name: parts[1] || title,
          sub: parts.slice(2).join(" · ") || parts[0],
          icon: cfg.icon,
          scene: field(block, "場景背景"),
          outfit: field(block, "服裝"),
          prop: field(block, "動作與鏡頭"),
          comp: field(block, "構圖"),
          mk: field(block, "妝容"),
          tpl: cfg.tpl,
          ratio: field(block, "圖片比例"),
          lens: field(block, "鏡頭焦段"),
          ang: field(block, "鏡頭角度"),
          camLang: field(block, "鏡頭語言"),
          atm: field(block, "整體氛圍"),
          light: field(block, "燈光風格"),
        }),
      };
    })
    .filter((card) => card && card.entry.id);
}

function main() {
  const md = fs.readFileSync(MD_PATH, "utf8");
  const cards = parseCards(md);
  const html = fs.readFileSync(INDEX_PATH, "utf8");
  const block = extractCatsBlock(html);
  const cats = parseCats(block.arrayText);
  const byCat = new Map();
  for (const card of cards) {
    if (!byCat.has(card.targetCatId)) byCat.set(card.targetCatId, []);
    byCat.get(card.targetCatId).push(card.entry);
  }
  let inserted = 0;
  for (const cat of cats) {
    const additions = byCat.get(cat.id) || [];
    cat.entries = cat.entries.filter((entry) => !String(entry.id || "").startsWith("v027_"));
    cat.entries.push(...additions);
    inserted += additions.length;
  }
  const next = html.slice(0, block.arrayStart) + JSON.stringify(cats, null, 2) + html.slice(block.arrayEnd);
  fs.writeFileSync(INDEX_PATH, next, "utf8");
  console.log(JSON.stringify({ v027Cards: cards.length, insertedRuntimeEntries: inserted }, null, 2));
}

main();
