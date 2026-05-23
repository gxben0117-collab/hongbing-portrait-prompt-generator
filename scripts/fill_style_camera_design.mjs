import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "index.html");

const CATEGORY_KEY_ORDER = ["id", "name", "icon", "tpl", "entries"];
const ENTRY_KEY_ORDER = [
  "id",
  "name",
  "sub",
  "icon",
  "scene",
  "light",
  "outfit",
  "prop",
  "comp",
  "fx",
  "tone",
  "quality",
  "mk",
  "tpl",
  "ratio",
  "lens",
  "ang",
  "camLang",
  "atm",
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

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function decideCamera(category, entry) {
  const text = [
    category.id,
    category.tpl || "",
    entry.name || "",
    entry.sub || "",
    entry.scene || "",
    entry.prop || "",
    entry.comp || "",
    entry.outfit || "",
  ].join(" ").toLowerCase();

  const isTravel = hasAny(category.id, ["travel", "mountain", "sea"]) || hasAny(category.tpl || "", ["travel"]);
  const isDark = hasAny(text, ["gothic", "underworld", "abyss", "demon", "dark", "night", "throne", "obsidian", "infernal"]);
  const isRoyal = hasAny(text, ["throne", "queen", "palace", "court", "imperial", "coronation", "regal"]);
  const isWide = hasAny(text, ["wide shot", "full-body", "full body", "landmark", "mountain", "sea", "landscape", "grand", "colossal", "vast"]);
  const isClose = hasAny(text, ["close-up", "close up", "medium close-up", "eye emotion", "portrait shot"]);
  const isAction = hasAny(text, ["mid-stride", "walking", "wading", "raising one hand", "summon", "ritual", "dance", "skirt movement", "wind"]);
  const isStudio = hasAny(text, ["studio", "minimal", "charcoal background", "single key light"]);

  if (isTravel) {
    return { ratio: "r_916", lens: "l_50", ang: "huanjing", camLang: "cl_magazine", light: "ls_natural", atm: "at_clear" };
  }
  if (isWide) {
    return { ratio: "r_23", lens: "l_50", ang: "quan", camLang: isRoyal ? "cl_magazine" : "cl_fashion", light: isDark ? "ls_cinematic" : "ls_golden", atm: isDark ? "at_moody" : "at_misty" };
  }
  if (isClose) {
    return { ratio: "r_34", lens: "l_85", ang: "banshen", camLang: "cl_fashion", light: isStudio ? "ls_studio" : "ls_cinematic", atm: isDark ? "at_moody" : "at_clear" };
  }
  if (isAction) {
    return { ratio: "r_23", lens: "l_70", ang: "quan", camLang: "cl_fashion", light: isDark ? "ls_cinematic" : "ls_golden", atm: isDark ? "at_moody" : "at_misty" };
  }
  if (isRoyal) {
    return { ratio: "r_34", lens: "l_70", ang: "sanfen", camLang: "cl_magazine", light: isDark ? "ls_cinematic" : "ls_studio", atm: isDark ? "at_moody" : "at_warm" };
  }
  return { ratio: "r_34", lens: "l_70", ang: "sanfen", camLang: "cl_fashion", light: isDark ? "ls_cinematic" : "ls_natural", atm: isDark ? "at_moody" : "at_clear" };
}

function reorderObject(source, preferredOrder) {
  const ordered = {};
  for (const key of preferredOrder) {
    if (Object.prototype.hasOwnProperty.call(source, key)) ordered[key] = source[key];
  }
  for (const [key, value] of Object.entries(source)) {
    if (!Object.prototype.hasOwnProperty.call(ordered, key)) ordered[key] = value;
  }
  return ordered;
}

function enrichCats(cats) {
  const counts = new Map();
  let updated = 0;

  const nextCats = cats.map((category) => {
    const entries = category.entries.map((entry) => {
      const camera = decideCamera(category, entry);
      const nextEntry = { ...entry, ...camera };
      const key = `${camera.ang}/${camera.ratio}/${camera.lens}/${camera.light}/${camera.atm}/${camera.camLang}`;
      counts.set(key, (counts.get(key) || 0) + 1);
      if (
        entry.ang !== camera.ang ||
        entry.ratio !== camera.ratio ||
        entry.lens !== camera.lens ||
        entry.light !== camera.light ||
        entry.atm !== camera.atm ||
        entry.camLang !== camera.camLang
      ) {
        updated += 1;
      }
      return reorderObject(nextEntry, ENTRY_KEY_ORDER);
    });
    return reorderObject({ ...category, entries }, CATEGORY_KEY_ORDER);
  });

  return { cats: nextCats, updated, counts: Object.fromEntries(counts) };
}

function main() {
  const originalText = fs.readFileSync(INDEX_PATH, "utf8");
  const block = extractCatsBlock(originalText);
  const cats = parseCats(block.arrayText);
  const { cats: nextCats, updated, counts } = enrichCats(cats);
  const nextArrayText = JSON.stringify(nextCats, null, 2);
  const nextText = originalText.slice(0, block.arrayStart) + nextArrayText + originalText.slice(block.arrayEnd);
  fs.writeFileSync(INDEX_PATH, nextText, "utf8");
  console.log(JSON.stringify({ file: "index.html", categories: nextCats.length, updated, cameraDesigns: counts }, null, 2));
}

main();
