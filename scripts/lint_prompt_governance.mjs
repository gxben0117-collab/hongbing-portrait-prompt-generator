import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const governanceSource = fs.readFileSync(path.join(ROOT, "prompt_governance.js"), "utf8");
const core = fs.readFileSync(path.join(ROOT, "core.js"), "utf8");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(governanceSource, sandbox);
const governance = sandbox.window.PROMPT_GOVERNANCE;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const lensIds = governance.lensOptions.map((lens) => lens.id);
const poseModeIds = governance.poseModes.map((mode) => mode.id);
const categoryRules = Object.values(governance.categoryRules);
const mappedCategories = categoryRules.flatMap((rule) => rule.categories || []);

assert(governance, "PROMPT_GOVERNANCE is missing");
assert(lensIds.includes("l_50"), "missing l_50");
assert(lensIds.length === 1, "lens policy must remain 50mm-only");
assert(governance.antiPatterns.bannedAngleIds.includes("huimou"), "huimou must remain blocked");
assert(governance.antiPatterns.bannedAngleIds.includes("yang"), "yang must remain blocked");
assert(governance.antiPatterns.bannedCameraLanguageIds.includes("cl_travel"), "cl_travel must remain blocked");
assert(governance.replacements.some(([from]) => from === "looking back over shoulder"), "missing look-back replacement");
assert(governance.replacements.some(([from]) => from === "arms overhead"), "missing arms-overhead replacement");
assert(poseModeIds.includes("micro_turn"), "missing micro_turn pose mode");
assert(poseModeIds.includes("full_body_stable"), "missing full_body_stable pose mode");
assert(mappedCategories.includes("wedding_diamond"), "wedding_diamond must have a category lens rule");
assert(mappedCategories.includes("cos_character"), "cos_character must have a category lens rule");
assert(mappedCategories.includes("xianxia"), "xianxia must have a category lens rule");
assert(core.includes("const GOVERNANCE"), "core.js must read governance config");
assert(core.includes("buildLensGuidance"), "core.js must emit lens guidance");
assert(core.includes("name:'鎖臉微側'"), "sanfen angle must be renamed to identity-safe micro turn");
assert(html.includes("prompt_governance.js"), "index.html must load prompt_governance.js before core.js");
assert(html.includes("鎖臉微側"), "advanced pose menu must include identity-safe micro turn");
assert(!html.includes("回眸一望"), "advanced pose menu must not expose unsafe look-back option");

console.log(JSON.stringify({
  ok: true,
  lensIds,
  poseModeIds,
  categoryRuleCount: categoryRules.length,
}, null, 2));
