import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const MD_PATH = path.join(ROOT, "核心資料", "風格範例.md");

const CAMERA_META = {
  ratio: {
    r_34: "3:4 直式人像，適合臉部可讀的半身到三分之二人像",
    r_23: "2:3 直式，適合完整服裝、姿勢與場景縱深",
    r_916: "9:16 手機直式，適合旅拍、地點感與社群直式輸出",
    r_169: "16:9 電影橫幅，適合大場景、山海或宏觀環境",
  },
  lens: {
    l_50: "50mm 自然視角，最穩定保護頭身比例與全身服裝",
    l_70: "70mm 平衡人像，保留臉部美感並維持身體比例",
    l_80: "80mm 角色近景，適合角色感較強的三分之二人像",
    l_85: "85mm 半身美臉，只用於近景或半身，避免全身大頭化",
  },
  ang: {
    sanfen: "鎖臉微側，臉部只允許 10-15 度自然微轉，肩身可配合場景",
    zheng: "正面人像，臉正對鏡頭，適合強眼神與對稱構圖",
    banshen: "半身人像，腰部以上，保留手部道具但不可遮五官",
    quan: "全身人像，頭到腳完整可讀，身體姿勢配合頭臉自然對齊",
    huanjing: "環境人像，人物融入場景但臉部仍清楚可辨",
  },
  light: {
    ls_golden: "黃金時刻或暖色自然光，柔和修飾但不改變五官",
    ls_natural: "自然日光或柔和環境光，真實清透、身份最穩",
    ls_studio: "棚拍控制光，適合時尚、宮廷、近景與高級寫真",
    ls_cinematic: "電影戲劇光，保留臉部主光，陰影不可吞掉五官",
  },
  atm: {
    at_clear: "晴空清透，背景乾淨、人物輪廓明確",
    at_misty: "輕霧朦朧，只放在背景與邊緣，不遮臉",
    at_warm: "暖光環繞，適合宮廷、婚紗、柔和故事感",
    at_moody: "暗黑氛圍，深影與輪廓光並存，臉部必須清楚",
  },
  camLang: {
    cl_fashion: "時尚大片語言，姿勢與服裝線條明確但不誇張扭身",
    cl_magazine: "雜誌封面語言，主體清楚、比例穩定、眼神有焦點",
    cl_social: "社群美圖語言，乾淨好讀、自然互動、地點感明確",
  },
};

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function decideCamera(text) {
  const value = text.toLowerCase();
  const isTravel = hasAny(value, ["旅", "travel", "street", "market", "landmark", "mountain", "sea", "beach", "temple", "shrine", "city", "coast", "harbor", "老街", "山", "海", "景點"]);
  const isDark = hasAny(value, ["魅魔", "地獄", "深淵", "暗", "黑", "夜", "gothic", "underworld", "abyss", "demon", "obsidian", "infernal", "candle", "torch"]);
  const isRoyal = hasAny(value, ["王座", "女王", "宮廷", "皇", "后", "throne", "queen", "palace", "court", "imperial", "regal"]);
  const isWide = hasAny(value, ["wide shot", "full-body", "full body", "全身", "grand", "colossal", "vast", "landscape", "staircase", "field", "花海", "山海", "宏大"]);
  const isClose = hasAny(value, ["close-up", "close up", "medium close-up", "近景", "特寫", "凝視", "眼", "半身"]);
  const isAction = hasAny(value, ["mid-stride", "walking", "wading", "raising one hand", "summon", "ritual", "dance", "turn", "轉身", "召喚", "行走", "巡視", "花海"]);
  const isStudio = hasAny(value, ["studio", "minimal", "charcoal background", "single key light", "棚拍", "影棚"]);

  if (isTravel) {
    return { ratio: "r_916", lens: "l_50", ang: "huanjing", light: "ls_natural", atm: "at_clear", camLang: "cl_magazine" };
  }
  if (isWide) {
    return { ratio: "r_23", lens: "l_50", ang: "quan", light: isDark ? "ls_cinematic" : "ls_golden", atm: isDark ? "at_moody" : "at_misty", camLang: isRoyal ? "cl_magazine" : "cl_fashion" };
  }
  if (isClose) {
    return { ratio: "r_34", lens: "l_85", ang: "banshen", light: isStudio ? "ls_studio" : "ls_cinematic", atm: isDark ? "at_moody" : "at_clear", camLang: "cl_fashion" };
  }
  if (isAction) {
    return { ratio: "r_23", lens: "l_70", ang: "quan", light: isDark ? "ls_cinematic" : "ls_golden", atm: isDark ? "at_moody" : "at_misty", camLang: "cl_fashion" };
  }
  if (isRoyal) {
    return { ratio: "r_34", lens: "l_70", ang: "sanfen", light: isDark ? "ls_cinematic" : "ls_studio", atm: isDark ? "at_moody" : "at_warm", camLang: "cl_magazine" };
  }
  return { ratio: "r_34", lens: "l_70", ang: "sanfen", light: isDark ? "ls_cinematic" : "ls_natural", atm: isDark ? "at_moody" : "at_clear", camLang: "cl_fashion" };
}

function fieldLine(label, id, group) {
  return `- **${label}：** \`${id}\` — ${CAMERA_META[group][id]}`;
}

function renderCameraFields(camera) {
  return [
    fieldLine("鏡頭角度", camera.ang, "ang"),
    fieldLine("圖片比例", camera.ratio, "ratio"),
    fieldLine("鏡頭焦段", camera.lens, "lens"),
    fieldLine("燈光風格", camera.light, "light"),
    fieldLine("整體氛圍", camera.atm, "atm"),
    fieldLine("鏡頭語言", camera.camLang, "camLang"),
  ].join("\n");
}

function stripExistingCameraFields(block) {
  return block
    .split("\n")
    .filter((line) => !/^- \*\*(鏡頭角度|圖片比例|鏡頭焦段|燈光風格|整體氛圍|鏡頭語言)：\*\*/.test(line))
    .join("\n");
}

function enrichBlock(block) {
  if (!/^####\s/m.test(block)) return { block, changed: false };
  const clean = stripExistingCameraFields(block);
  const camera = decideCamera(clean);
  const cameraFields = renderCameraFields(camera);

  if (clean.includes("- **構圖：**")) {
    return {
      block: clean.replace(/(- \*\*構圖：\*\*.*)(\n|$)/, `$1\n${cameraFields}$2`),
      changed: true,
    };
  }
  if (clean.includes("- **動作與鏡頭：**")) {
    return {
      block: clean.replace(/(- \*\*動作與鏡頭：\*\*.*)(\n|$)/, `$1\n${cameraFields}$2`),
      changed: true,
    };
  }
  return { block: `${clean.trimEnd()}\n${cameraFields}\n`, changed: true };
}

function main() {
  const original = fs.readFileSync(MD_PATH, "utf8");
  const parts = original.split(/(?=^####\s)/m);
  let changedCards = 0;
  const next = parts.map((part) => {
    const result = enrichBlock(part);
    if (result.changed) changedCards += 1;
    return result.block;
  }).join("");

  fs.writeFileSync(MD_PATH, next, "utf8");
  const missing = [...next.matchAll(/^####\s.*$/gm)].filter((match) => {
    const start = match.index;
    const nextHeading = next.indexOf("\n#### ", start + 1);
    const block = next.slice(start, nextHeading === -1 ? undefined : nextHeading);
    return !block.includes("- **鏡頭角度：**") || !block.includes("- **圖片比例：**") || !block.includes("- **鏡頭焦段：**") || !block.includes("- **燈光風格：**") || !block.includes("- **整體氛圍：**") || !block.includes("- **鏡頭語言：**");
  }).length;

  console.log(JSON.stringify({ file: "核心資料/風格範例.md", changedCards, missingCameraFieldCards: missing }, null, 2));
}

main();
