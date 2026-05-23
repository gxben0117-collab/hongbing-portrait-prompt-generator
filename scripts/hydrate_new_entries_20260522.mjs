import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "index.html");

const NEW_IDS = new Set([
  "tw_31","tw_32","tw_33",
  "ms_26","ms_27","ms_28","ms_29",
  "eu_27","eu_28","eu_29",
  "jp_33","jp_34","jp_35","jp_36",
  "ks_27","ks_28","ks_29","ks_30",
  "wt_34","wt_35","wt_36","wt_37",
  "cm_29","cm_30","cm_31",
  "hf_53","hf_54","hf_55","hf_56","hf_57","hf_58",
  "dp_26","dp_27","dp_28","dp_29",
  "tg_33","tg_34","tg_35","tg_36",
  "sg_18","sg_19","sg_20","sg_21","sg_22",
  "mg_18","mg_19","mg_20","mg_21",
  "qg_17","qg_18","qg_19","qg_20","qg_21",
  "or_26","or_27","or_28","or_29","or_30",
  "ref_26","ref_27","ref_28","ref_29","ref_30",
  "xia_34","xia_35","xia_36","xia_37","xia_38","xia_39","xia_40","xia_41",
  "my_26","my_27","my_28","my_29","my_30","my_31",
  "cmh_07","cmh_08","cmh_09","cmh_10","cmh_11","cmh_12",
  "dr_28","dr_29","dr_30","dr_31","dr_32","dr_33","dr_34","dr_35",
  "tk_28","tk_29","tk_30","tk_31",
  "jy_41","jy_42","jy_43",
  "cl_26","cl_27","cl_28","cl_29",
  "cs_32",
  "fa_36","fa_37","fa_38","fa_39","fa_40","fa_41",
  "dg_53","dg_54","dg_55","dg_56",
  "df_43","df_44","df_45","df_46","df_47","df_48",
  "sp_22","sp_23","sp_24","sp_25","sp_26","sp_27",
  "wa_33","wa_34","wa_35","wa_36","wa_37",
  "gm_26","gm_27","gm_28",
  "ha_23","ha_24","ha_25","ha_26",
  "fl_50","fl_51","fl_52","fl_53","fl_54",
  "sd_56","sd_57","sd_58","sd_59",
  "db_28","db_29","db_30","db_31",
  "bt_31","bt_32","bt_33","bt_34",
  "ml_24","ml_25","ml_26","ml_27",
  "rl_26","rl_27","rl_28","rl_29","rl_30",
  "qu_21","qu_22","qu_23","qu_24",
  "wd_26","wd_27","wd_28","wd_29",
  "cp_27","cp_28","cp_29","cp_30",
  "cos_27","cos_28","cos_29","cos_30","cos_31",
]);

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

function chooseByHash(seed, variants) {
  return variants[Math.abs(seed) % variants.length];
}

function hashText(value) {
  let hash = 0;
  for (const ch of value) hash = (hash * 33 + ch.charCodeAt(0)) | 0;
  return hash;
}

function normalize(value) {
  return String(value || "").toLowerCase();
}

function contextFromCategory(categoryId) {
  if (["taiwan_travel","mountain_sea","europe_travel","japan_travel","korea_sea","world_travel","china_mark"].includes(categoryId)) return "travel";
  if (["hanfu","dynasty_palace","tang_grandeur","song_grace","ming_grace","qing_grace","oriental","drama","hotdrama","china_drama","three_kingdoms","jinyong","classic_lit","chinese_story"].includes(categoryId)) return "hanfu";
  if (["queen"].includes(categoryId)) return "queen";
  if (["wedding_diamond"].includes(categoryId)) return "wedding";
  if (["gothic","darkfantasy","fallen_angel"].includes(categoryId)) return "gothic";
  return "fantasy";
}

function travelProp(seed) {
  return chooseByHash(seed, [
    "behaving like a real traveler inside the location, with a natural pause, turn-back, or walking moment instead of a static standing pose",
    "walking through the place with a grounded travel-photo rhythm, body slightly angled for motion, then turning the face naturally back toward camera",
    "pausing at the location with relaxed shoulders and a believable sightseeing posture, keeping the face fully visible and identity-safe",
  ]);
}

function travelComp(seed) {
  return chooseByHash(seed, [
    "vertical travel portrait with clear face, natural body angle, and enough environmental space to keep the location recognizable",
    "vertical environmental portrait, subject placed naturally within the scene depth, face readable, movement implied without distortion",
    "vertical three-quarter travel composition, face unobstructed, body readable, and landmark atmosphere preserved behind the subject",
  ]);
}

function hanfuProp(seed) {
  return chooseByHash(seed, [
    "choosing a culturally and role-appropriate classical action such as turning after footsteps, resting by a railing, carrying an object with purpose, or pausing mid-journey",
    "using a calm story-driven classical action that fits the character identity and scene atmosphere while keeping the face-body relationship natural",
    "avoiding flat frontal stiffness by giving the body a gentle three-quarter angle and the expression a clear narrative reason",
  ]);
}

function hanfuComp(seed) {
  return chooseByHash(seed, [
    "vertical full-body or three-quarter hanfu composition, costume layers and silhouette clearly visible, traditional atmosphere integrated without covering the face",
    "vertical classical portrait with clear face, elegant body angle, and enough environmental depth to support the character's story",
    "vertical story-led costume portrait, face unobstructed, body naturally aligned, and period styling readable from head to hem",
  ]);
}

function queenProp(seed) {
  return chooseByHash(seed, [
    "choosing a ruler's action such as issuing a command, receiving an audience, reviewing a decree, or rising from the throne, while keeping body control and facial clarity",
    "letting the role logic of sovereign, goddess, or dark queen drive the pose instead of relying on random gesture, with stable shoulders and natural face alignment",
    "using narrative authority rather than theatrical distortion, so the face remains unmistakably connected to the body and role",
  ]);
}

function queenComp(seed) {
  return chooseByHash(seed, [
    "vertical regal portrait with throne, steps, or architectural axis reinforcing authority, face clearly readable, body posed in a stable commanding silhouette",
    "vertical queenly composition with stable central axis, strong facial clarity, costume and power symbols fully legible without overcomplicated action",
    "vertical sovereignty portrait, face unobstructed, full styling readable, and ceremonial depth supporting the authority of the role",
  ]);
}

function weddingProp(seed) {
  return chooseByHash(seed, [
    "behaving like a bride inside a real wedding moment by preparing, entering, pausing in emotion, or gathering the dress naturally",
    "using a soft bridal action with veil, bouquet, or gown movement instead of a static standing pose, while keeping face and body harmonious",
    "holding bouquet or veil low while turning after hearing someone call, keeping the expression tender and the body line balanced",
  ]);
}

function weddingComp(seed) {
  return chooseByHash(seed, [
    "vertical bridal portrait with clear face, readable gown silhouette, and soft foreground layering from flowers, veil, or fabric without obscuring the subject",
    "vertical three-quarter to full-body wedding composition, face stable and identity-preserving, dress details and depth clearly readable",
    "vertical ceremony portrait, face unobstructed, gown volume readable, and background atmosphere romantic but grounded",
  ]);
}

function fantasyProp(seed) {
  return chooseByHash(seed, [
    "using a role-appropriate fantasy action that feels story-driven rather than random, while keeping the face open, readable, and naturally connected to the body",
    "letting the magical world support the pose through environment, props, or creature interaction, without pushing the head and torso into unrealistic angles",
    "using calm narrative movement with clear facial readability, coherent body alignment, and magical atmosphere supporting rather than replacing the subject",
  ]);
}

function fantasyComp(seed) {
  return chooseByHash(seed, [
    "vertical fantasy portrait with strong environmental storytelling, clear face, readable body line, and effects placed around rather than over the subject",
    "vertical three-quarter to full-body fantasy composition, identity-safe face visibility, atmospheric depth, and costume silhouette clearly preserved",
    "vertical cinematic fantasy portrait, face unobstructed, subject grounded in the scene, and magical details supporting the narrative without hiding anatomy",
  ]);
}

function valuesFor(categoryId, entryId) {
  const seed = hashText(`${categoryId}:${entryId}`);
  const group = contextFromCategory(categoryId);
  switch (group) {
    case "travel":
      return { prop: travelProp(seed), comp: travelComp(seed) };
    case "hanfu":
      return { prop: hanfuProp(seed), comp: hanfuComp(seed) };
    case "queen":
      return { prop: queenProp(seed), comp: queenComp(seed) };
    case "wedding":
      return { prop: weddingProp(seed), comp: weddingComp(seed) };
    default:
      return { prop: fantasyProp(seed), comp: fantasyComp(seed) };
  }
}

function main() {
  const original = fs.readFileSync(INDEX_PATH, "utf8");
  const block = extractCatsBlock(original);
  const cats = vm.runInNewContext(`(${block.arrayText})`);
  let updated = 0;

  for (const cat of cats) {
    for (const entry of cat.entries) {
      if (!NEW_IDS.has(entry.id)) continue;
      const next = valuesFor(cat.id, entry.id);
      if (!entry.prop) {
        entry.prop = next.prop;
        updated += 1;
      }
      if (!entry.comp) {
        entry.comp = next.comp;
        updated += 1;
      }
    }
  }

  const updatedArray = JSON.stringify(cats, null, 2);
  const nextText = `${original.slice(0, block.start)}${updatedArray}${original.slice(block.end)}`;
  fs.writeFileSync(INDEX_PATH, nextText, "utf8");
  console.log(JSON.stringify({ updatedFields: updated }, null, 2));
}

main();
