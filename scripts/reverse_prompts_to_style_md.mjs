import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "咒語逆推.txt");
const OUT = path.join(ROOT, "核心資料", "風格範例.md");

const FIELD_MAP = [
  ["Scene:", "場景背景"],
  ["Lighting:", "光線"],
  ["Makeup surface design:", "妝容描述"],
  ["Costume and styling:", "服裝"],
  ["Props and action:", "動作與鏡頭"],
  ["Camera and composition:", "構圖"],
  ["Visual effects:", "特效"],
  ["Color tone:", "色調"],
];

const STOP_PREFIXES = [
  ...FIELD_MAP.map(([prefix]) => prefix),
  "Scene context:",
  "Ancient Chinese costume styling:",
  "Action, props, and composition",
  "Prop and effect safety:",
  "Image format:",
  "Lens simulation:",
  "Editorial lighting override:",
  "Overall atmosphere:",
  "Camera language:",
  "PROMPT STRUCTURING",
  "[CRITICAL",
  "MANDATORY FIRST STEP",
  "Avoid:",
  "IDENTITY &",
  "REFERENCE PRIORITY",
  "FACE-BODY",
  "PROPORTION",
  "MAKEUP SAFETY",
  "IDENTITY ELASTICITY",
  "PROMPT GENERATION",
  "ANATOMY &",
  "VISUAL REALISM",
];

const MK_MAP = [
  [/succubus|魅魔/i, "succubus_alluring"],
  [/魔王|demon/i, "demon_lord"],
  [/墮天使|fallen/i, "fallen_angel"],
  [/聖堂|天使|angel/i, "fallen_angel"],
  [/女王|empress|imperial/i, "yaohou"],
  [/婚紗|bridal/i, "wedding"],
  [/旅拍|travel|中央公園|野柳/i, "outdoor_glow"],
  [/武俠|金庸|wuxia/i, "oriental"],
  [/朝代|宮服|漢服|唐朝|明朝|清朝|古裝/i, "oriental"],
  [/嫦娥|神話|myth/i, "xianxia"],
];

const CAMERA_IDS = {
  "3:4": { ratio: "r_34", angle: "sanfen" },
  "2:3": { ratio: "r_23", angle: "quan" },
  "9:16": { ratio: "r_916", angle: "huanjing" },
  "16:9": { ratio: "r_169", angle: "huanjing" },
  "50mm": { lens: "l_50" },
  "70mm": { lens: "l_50" },
  "80mm": { lens: "l_50" },
  "85mm": { lens: "l_50" },
  "Golden hour": { light: "ls_golden" },
  "Cinematic lighting": { light: "ls_cinematic" },
  "Natural": { light: "ls_natural" },
  "Studio": { light: "ls_studio" },
  "Clear atmospheric": { atm: "at_clear" },
  "Warm glow": { atm: "at_warm" },
  "Cinematic moody": { atm: "at_moody" },
  "Ethereal atmosphere": { atm: "at_misty" },
  "Fashion editorial": { camLang: "cl_fashion" },
  "controlled portrait camera framing": { camLang: "cl_magazine" },
  "Social media": { camLang: "cl_social" },
};

const CAMERA_META = {
  ratio: {
    "3:4": "r_34",
    "2:3": "r_23",
    "9:16": "r_916",
    "16:9": "r_169",
    "2.39:1": "r_239",
  },
  lens: {
    "50mm": "l_50",
    "70mm": "l_50",
    "80mm": "l_50",
    "85mm": "l_50",
  },
  light: {
    "Golden hour": "ls_golden",
    "Cinematic lighting": "ls_cinematic",
    "Natural": "ls_natural",
    "Studio": "ls_studio",
  },
  atm: {
    "Clear atmospheric": "at_clear",
    "Warm glow": "at_warm",
    "Cinematic moody": "at_moody",
    "Ethereal atmosphere": "at_misty",
  },
  camLang: {
    "Fashion editorial": "cl_fashion",
    "controlled portrait camera framing": "cl_magazine",
    "Social media": "cl_social",
  },
};

function oneLine(value) {
  return value.replace(/\s+/g, " ").trim();
}

function field(block, prefix) {
  const normalized = block.replace(/\r\n/g, "\n");
  const idx = normalized.indexOf(prefix);
  if (idx === -1) return "";
  const start = idx + prefix.length;
  const rest = normalized.slice(start);
  const labels = STOP_PREFIXES
    .filter((label) => label !== prefix)
    .map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const next = rest.search(new RegExp(`\\n\\n(?:${labels}|premium |ultra realistic )`, "i"));
  return oneLine((next === -1 ? rest : rest.slice(0, next)));
}

function idSlug(text, index) {
  return `rev_${String(index + 1).padStart(3, "0")}`;
}

function makeupFor(title, text) {
  const titleHit = MK_MAP.find(([re]) => re.test(title));
  return (titleHit || MK_MAP.find(([re]) => re.test(text)) || [null, "xianxia"])[1];
}

function cameraIds(cardText) {
  const ids = {};
  const format = field(cardText, "Image format:");
  const lens = field(cardText, "Lens simulation:");
  const light = field(cardText, "Editorial lighting override:");
  const atm = field(cardText, "Overall atmosphere:");
  const camLang = field(cardText, "Camera language:");
  for (const [key, value] of Object.entries(CAMERA_META.ratio)) {
    if (format.includes(key)) ids.ratio = value;
  }
  for (const [key, value] of Object.entries(CAMERA_META.lens)) {
    if (lens.includes(key)) ids.lens = value;
  }
  for (const [key, value] of Object.entries(CAMERA_META.light)) {
    if (light.includes(key)) ids.light = value;
  }
  for (const [key, value] of Object.entries(CAMERA_META.atm)) {
    if (atm.includes(key)) ids.atm = value;
  }
  for (const [key, value] of Object.entries(CAMERA_META.camLang)) {
    if (camLang.includes(key)) ids.camLang = value;
  }
  return {
    angle: ids.ratio === "r_916" || ids.ratio === "r_169" ? "huanjing" : ids.ratio === "r_23" ? "quan" : "sanfen",
    ratio: ids.ratio || "r_34",
    lens: "l_50",
    light: ids.light || "ls_natural",
    atm: ids.atm || "at_clear",
    camLang: ids.camLang || "cl_magazine",
  };
}

function parseCards(text) {
  const headers = [...text.matchAll(/^\[([^\]]+?)\]:/gm)]
    .filter((match) => !match[1].startsWith("CRITICAL"));
  const seen = new Set();
  return headers
    .map((match, index) => {
      const nextHeader = headers[index + 1];
      const title = match[1].trim();
      const block = text.slice(match.index + match[0].length, nextHeader ? nextHeader.index : text.length);
      const parts = title.split(" — ");
      const category = parts[0] || "逆推樣本";
      const nameParts = (parts[1] || title).split(" · ");
      const name = nameParts[0] || title;
      const sub = nameParts[1] || category;
      const raw = `${title}\n${block}`;
      const ids = cameraIds(raw);
      const key = `${category}|${name}|${sub}`;
      if (seen.has(key)) return null;
      seen.add(key);
      return {
        id: idSlug(title, index),
        category,
        name,
        sub,
        mk: makeupFor(title, raw),
        ids,
        fields: FIELD_MAP.map(([prefix, label]) => [label, field(block, prefix)]).filter(([, value]) => value),
      };
    })
    .filter(Boolean);
}

function renderCard(card) {
  const lines = [
    `#### ${card.category} · ${card.name}${card.sub ? ` · ${card.sub}` : ""}`,
    `- **ID:** \`${card.id}\``,
    `- **妝容：** ${card.mk}`,
  ];
  for (const [label, value] of card.fields) lines.push(`- **${label}：** ${value}`);
  lines.push(`- **鏡頭角度：** \`${card.ids.angle}\``);
  lines.push(`- **圖片比例：** \`${card.ids.ratio}\``);
  lines.push(`- **鏡頭焦段：** \`${card.ids.lens}\``);
  lines.push(`- **燈光風格：** \`${card.ids.light}\``);
  lines.push(`- **整體氛圍：** \`${card.ids.atm}\``);
  lines.push(`- **鏡頭語言：** \`${card.ids.camLang}\``);
  return lines.join("\n");
}

function main() {
  const src = fs.readFileSync(SRC, "utf8");
  const cards = parseCards(src);
  const existing = fs.readFileSync(OUT, "utf8");
  const blockHeader = "\n\n---\n## 逆推正常咒語樣本\n\n";
  const withoutOld = existing.replace(/\n\n---\n## 逆推正常咒語樣本[\s\S]*$/m, "");
  const next = `${withoutOld.trimEnd()}${blockHeader}${cards.map(renderCard).join("\n\n")}\n`;
  fs.writeFileSync(OUT, next, "utf8");
  console.log(JSON.stringify({ source: "咒語逆推.txt", output: "核心資料/風格範例.md", cards: cards.length }, null, 2));
}

main();
