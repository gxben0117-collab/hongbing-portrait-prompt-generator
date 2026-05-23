import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "核心資料", "風格範例_append_v027.md");
const OUT = path.join(ROOT, "核心資料", "風格範例.md");

const GROUPS = [
  { re: /^dg_/, category: "暗黑哥德 v0.27", mk: "gothic", tpl: "gothic" },
  { re: /^fa_/, category: "奇幻魔法 v0.27", mk: "xianxia", tpl: "fantasy" },
  { re: /^wa_/, category: "水下花境 v0.27", mk: "mermaid", tpl: "water" },
  { re: /^ga_/, category: "動漫遊戲 v0.27", mk: "character_pop", tpl: "game" },
  { re: /^dr_/, category: "長相思 v0.27", mk: "xianxia", tpl: "china_drama" },
  { re: /^hd_/, category: "熱播陸劇 v0.27", mk: "oriental", tpl: "drama" },
  { re: /^(eu_|ks_|wt_|cm_)/, category: "旅拍補充 v0.27", mk: "outdoor_glow", tpl: "world_travel" },
  { re: /^cos_/, category: "熱門COS v0.27", mk: "character_pop", tpl: "cos_character" },
];

function oneLine(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function field(block, label) {
  const match = block.match(new RegExp(`^- \\*\\*${label}[:：]\\*\\*\\s*(.*)$`, "m"));
  return oneLine(match ? match[1] : "");
}

function titleOf(block) {
  return oneLine(block.match(/^####\s+(.+)$/m)?.[1] || "");
}

function originalId(block) {
  return (field(block, "ID").match(/`?([^`]+)`?/) || [])[1] || "";
}

function groupFor(id) {
  return GROUPS.find((group) => group.re.test(id)) || GROUPS[0];
}

function safeId(id) {
  return `v027_${id.replace(/[^a-zA-Z0-9_]/g, "_")}`;
}

function cameraFor(card) {
  const text = `${card.title} ${card.scene} ${card.outfit} ${card.action}`.toLowerCase();
  const travel = /london|chiang|canyon|uyuni|times square|banff|iceland|sydney|rio|cappadocia|wuzhen|xitang|fenghuang|旅拍|古城|地標/.test(text);
  const water = /underwater|sea|ocean|水|海|pool|jellyfish|mermaid|coral/.test(text);
  const dark = /dark|gothic|blood|hell|ghost|bone|moon|night|abyss|demon|黑|血|幽|冥|夜|地獄/.test(text);
  const action = /battle|sword|raised|running|kneeling|crouching|dance|storm|wind|戰|劍|跪|舞|風/.test(text);
  const close = /portrait|interior|tea|ledger|atelier|piano|music/.test(text) && !travel;

  if (travel) return { ang: "huanjing", ratio: "r_916", lens: "l_50", light: "ls_natural", atm: "at_clear", camLang: "cl_magazine" };
  if (water) return { ang: "huanjing", ratio: "r_23", lens: "l_50", light: "ls_natural", atm: "at_misty", camLang: "cl_magazine" };
  if (action) return { ang: "quan", ratio: "r_23", lens: "l_50", light: dark ? "ls_cinematic" : "ls_golden", atm: dark ? "at_moody" : "at_misty", camLang: "cl_fashion" };
  if (close) return { ang: "banshen", ratio: "r_34", lens: "l_50", light: dark ? "ls_cinematic" : "ls_golden", atm: dark ? "at_moody" : "at_warm", camLang: "cl_magazine" };
  return { ang: "sanfen", ratio: "r_34", lens: "l_50", light: dark ? "ls_cinematic" : "ls_natural", atm: dark ? "at_moody" : "at_clear", camLang: "cl_magazine" };
}

function buildAction(card) {
  if (card.action) return card.action;
  const text = `${card.title} ${card.scene}`.toLowerCase();
  if (/battle|sword|war|dojo|arena|戰|劍|武/.test(text)) {
    return "holding a grounded ready stance with the weapon kept low or to the side, face clearly readable and body weight balanced";
  }
  if (/tea|ledger|music|piano|instrument|宴|茶|琴|書|文/.test(text)) {
    return "interacting calmly with the scene object at chest or waist level, hands away from the face, expression connected to the story";
  }
  if (/travel|tower|city|canyon|lake|lagoon|ancient town|地標|古城/.test(text)) {
    return "standing or walking naturally within the location, body angled to the scenery, face turned clearly toward camera";
  }
  if (/water|sea|underwater|pool|海|水/.test(text)) {
    return "floating or standing with gentle fabric movement, hands away from the face, body aligned naturally with the head";
  }
  return "standing or pausing with a natural three-quarter body angle, hands kept below face level, face open and readable";
}

function buildComp(card, camera) {
  if (camera.ang === "huanjing") {
    return "environmental portrait composition with clear face, readable body silhouette, and the location visible as story context";
  }
  if (camera.ang === "quan") {
    return "vertical full-body or three-quarter composition, costume silhouette readable from head to hem, face stable and unobstructed";
  }
  if (camera.ang === "banshen") {
    return "vertical half-body or three-quarter portrait, face clear, hands and props placed below eye level, costume details readable";
  }
  return "vertical identity-safe three-quarter portrait, slight natural head turn, stable neck and shoulder alignment, costume and scene readable";
}

function parseCards(src) {
  return src
    .split(/(?=^#### )/m)
    .map((block) => block.trim())
    .filter((block) => block.startsWith("#### "))
    .map((block) => {
      const id = originalId(block);
      const group = groupFor(id);
      const card = {
        id,
        newId: safeId(id),
        group,
        title: titleOf(block),
        mk: field(block, "妝容") || group.mk,
        scene: field(block, "場景背景"),
        light: field(block, "光線"),
        outfit: field(block, "服裝"),
        action: field(block, "道具"),
      };
      card.camera = cameraFor(card);
      card.action = buildAction(card);
      card.comp = buildComp(card, card.camera);
      return card;
    })
    .filter((card) => card.id && card.title && card.scene);
}

function renderCard(card) {
  const lines = [
    `#### ${card.group.category} · ${card.title}`,
    `- **ID:** \`${card.newId}\``,
    `- **原始ID：** \`${card.id}\``,
    `- **妝容：** ${card.mk}`,
    `- **場景背景：** ${card.scene}`,
  ];
  if (card.light) lines.push(`- **光線：** ${card.light}`);
  if (card.outfit) lines.push(`- **服裝：** ${card.outfit}`);
  lines.push(`- **動作與鏡頭：** ${card.action}`);
  lines.push(`- **構圖：** ${card.comp}`);
  lines.push(`- **鏡頭角度：** \`${card.camera.ang}\``);
  lines.push(`- **圖片比例：** \`${card.camera.ratio}\``);
  lines.push(`- **鏡頭焦段：** \`${card.camera.lens}\``);
  lines.push(`- **燈光風格：** \`${card.camera.light}\``);
  lines.push(`- **整體氛圍：** \`${card.camera.atm}\``);
  lines.push(`- **鏡頭語言：** \`${card.camera.camLang}\``);
  return lines.join("\n");
}

function main() {
  const src = fs.readFileSync(SRC, "utf8");
  const cards = parseCards(src);
  const existing = fs.readFileSync(OUT, "utf8");
  const withoutOld = existing.replace(/\n\n---\n## v0\.27 備檔整理匯入[\s\S]*?(?=\n\n---\n## 逆推正常咒語樣本|\s*$)/m, "");
  const reverseSection = existing.match(/\n\n---\n## 逆推正常咒語樣本[\s\S]*$/m)?.[0] || "";
  const base = reverseSection ? withoutOld.replace(reverseSection, "") : withoutOld;
  const block = `\n\n---\n## v0.27 備檔整理匯入\n\n${cards.map(renderCard).join("\n\n")}\n`;
  const next = `${base.trimEnd()}${block}${reverseSection}`;
  fs.writeFileSync(OUT, next, "utf8");
  const byGroup = {};
  for (const card of cards) byGroup[card.group.category] = (byGroup[card.group.category] || 0) + 1;
  console.log(JSON.stringify({ source: "核心資料/風格範例_append_v027.md", imported: cards.length, byGroup }, null, 2));
}

main();
