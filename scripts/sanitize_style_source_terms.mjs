import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const files = [
  path.join(ROOT, "index.html"),
  path.join(ROOT, "核心資料", "風格範例.md"),
];

const governanceSource = fs.readFileSync(path.join(ROOT, "prompt_governance.js"), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(governanceSource, sandbox);

const replacements = [
  ...(sandbox.window.PROMPT_GOVERNANCE?.replacements || []).filter(([from]) => !["goddess", "heroine", "celebrity"].includes(from)),
  [/low angle shot/gi, "stable eye-level shot"],
  [/low angle dramatic tracking shot/gi, "stable eye-level dramatic tracking shot"],
  [/low angle heroic cinematic framing/gi, "stable eye-level heroic cinematic framing"],
  [/low angle cinematic shot/gi, "stable eye-level cinematic shot"],
  [/low angle side light/gi, "low side light from the environment"],
  [/looking back over (her )?shoulder/gi, "turning gently with face still readable"],
  [/looking back toward (the )?(camera|lens|camera lens)/gi, "turning gently toward the camera with face still readable"],
  [/looking back slightly/gi, "turning gently while keeping the face readable"],
  [/looking back sideways/gi, "turning gently with face still readable"],
  [/walking away but face/gi, "walking in a gentle side angle with face"],
  [/walking away from camera view but face/gi, "walking in a gentle side angle while face"],
  [/standing in side profile view looking back toward lens/gi, "standing in a gentle three-quarter view with face readable toward lens"],
  [/sharp side-profile framing/gi, "stable three-quarter framing"],
  [/side-profile framing/gi, "stable three-quarter framing"],
  [/side profile/gi, "gentle three-quarter view"],
  [/looking down toward camera lens/gi, "chin level, eyes calmly toward camera lens"],
  [/crouching naturally on stone platform ledge/gi, "resting in a supported seated angle on a stone platform"],
];

function sanitizeText(text) {
  let next = text;
  for (const [from, to] of replacements) {
    next = next.replace(from instanceof RegExp ? from : new RegExp(from, "gi"), to);
  }
  return next;
}

const result = {};
for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const after = sanitizeText(before);
  fs.writeFileSync(file, after, "utf8");
  result[path.relative(ROOT, file).replaceAll("\\", "/")] = {
    changed: before !== after,
    delta: after.length - before.length,
  };
}

console.log(JSON.stringify(result, null, 2));
