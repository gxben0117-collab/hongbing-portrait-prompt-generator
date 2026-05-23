import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function extractCatsArray(html) {
  const marker = "const CATS = [";
  const start = html.indexOf(marker);
  const open = html.indexOf("[", start);
  let depth = 0;
  let inString = false;
  let quote = "";
  let escape = false;

  for (let i = open; i < html.length; i += 1) {
    const ch = html[i];
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
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) return html.slice(open, i + 1);
    }
  }
  throw new Error("Unable to extract CATS array");
}

const html = read("index.html");
const governanceSource = read("prompt_governance.js");
const cats = vm.runInNewContext(`(${extractCatsArray(html)})`);
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(governanceSource, sandbox);
const governance = sandbox.window.PROMPT_GOVERNANCE;

const riskChecks = [
  { flag: "identity_risk", terms: ["heroine", "beauty", "goddess face", "celebrity face", "perfect beauty", "influencer face", "AI beauty"] },
  { flag: "pose_risk", terms: ["looking back over shoulder", "back-facing", "jumping", "spinning", "arms overhead", "covering face", "extreme pose"] },
  { flag: "camera_risk", terms: ["movie trailer", "low angle upward shot", "low-angle", "ultra-wide", "tiny subject", "bird's-eye"] },
  { flag: "beauty_risk", terms: ["flawless", "luxury beauty", "porcelain skin", "V-face", "doll face", "cat-eye"] },
  { flag: "fx_risk", terms: ["ethereal atmosphere", "celestial mist", "divine radiance", "face-obscuring", "heavy smoke"] },
];

const fullResults = [];
const byRiskType = {};
let missingComp = 0;
let missingProp = 0;

for (const cat of cats) {
  for (const entry of cat.entries || []) {
    const text = [entry.name, entry.sub, entry.scene, entry.outfit, entry.prop, entry.comp, entry.fx, entry.tone, entry.quality]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const flags = [];
    for (const check of riskChecks) {
      if (check.terms.some((term) => text.includes(term.toLowerCase()))) {
        flags.push(check.flag);
        byRiskType[check.flag] = (byRiskType[check.flag] || 0) + 1;
      }
    }
    if (!entry.prop) {
      flags.push("mapping_gap");
      missingProp += 1;
      byRiskType.mapping_gap = (byRiskType.mapping_gap || 0) + 1;
    }
    if (!entry.comp) {
      flags.push("mapping_gap");
      missingComp += 1;
      byRiskType.mapping_gap = (byRiskType.mapping_gap || 0) + 1;
    }
    fullResults.push({
      id: entry.id,
      name: entry.name,
      category_id: cat.id,
      tpl: entry.tpl || cat.tpl,
      status: flags.length ? "review" : "approved",
      risk_flags: [...new Set(flags)],
    });
  }
}

const summary = {
  total: fullResults.length,
  approved: fullResults.filter((result) => result.status === "approved").length,
  review: fullResults.filter((result) => result.status === "review").length,
  missingProp,
  missingComp,
  byRiskType,
  governanceTerms: governance.antiPatterns.bannedPromptTerms.length,
};

fs.mkdirSync(path.join(ROOT, "temp"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "temp", "risk_flags_report.json"), JSON.stringify({ summary, fullResults }, null, 2), "utf8");
console.log(JSON.stringify({ outputFile: "temp/risk_flags_report.json", summary }, null, 2));
