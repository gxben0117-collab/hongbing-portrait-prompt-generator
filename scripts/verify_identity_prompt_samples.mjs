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
      if (depth === 0) return html.slice(open, i + 1);
    }
  }

  throw new Error("Unable to extract CATS array");
}

function makeDocument() {
  const values = new Map([
    ["faceDesc", "original eye shape, original nose geometry, natural mouth shape, natural asymmetry, unretouched skin texture"],
    ["proShot", ""],
    ["proAction", ""],
    ["proCustom", ""],
    ["txtLine", ""],
    ["extras", ""],
  ]);
  const elements = new Map();

  return {
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, {
          get value() {
            return values.get(id) ?? "";
          },
          set value(next) {
            values.set(id, next ?? "");
          },
          innerHTML: "",
          textContent: "",
          style: {},
          classList: { add() {}, remove() {}, toggle() {} },
          scrollIntoView() {},
        });
      }
      return elements.get(id);
    },
    querySelectorAll() {
      return [];
    },
    querySelector() {
      return null;
    },
  };
}

const html = read("index.html");
const core = read("core.js");
const governanceSource = read("prompt_governance.js");
const catsArray = extractCatsArray(html);

const sandbox = {
  console,
  Math,
  CATS: vm.runInNewContext(`(${catsArray})`),
  curCatID: "theme_01",
  curEntryID: "",
  curMKID: "natural",
  curAngID: "sanfen",
  curRatioID: "r_916",
  curLensID: "l_50",
  curLightID: "ls_natural",
  curAtmID: "at_clear",
  curIdentityID: "il_standard",
  curCamLangID: "cl_fashion",
  document: makeDocument(),
  navigator: { clipboard: { writeText: async () => {} } },
  window: { scrollTo() {} },
  setTimeout(fn) { return fn(); },
  clearTimeout() {},
};

vm.createContext(sandbox);
vm.runInContext(governanceSource, sandbox);
vm.runInContext(core, sandbox);

function firstEntry(catId) {
  const cat = sandbox.CATS.find((item) => item.id === catId);
  if (!cat || !cat.entries?.length) throw new Error(`Missing category or entries: ${catId}`);
  return cat.entries[0].id;
}

const sampleTargets = [
  ["theme_01", firstEntry("theme_01")],
  ["theme_02", firstEntry("theme_02")],
  ["theme_03", firstEntry("theme_03")],
  ["theme_04", firstEntry("theme_04")],
  ["theme_05", firstEntry("theme_05")],
  ["theme_06", firstEntry("theme_06")],
  ["theme_07", firstEntry("theme_07")],
  ["theme_08", firstEntry("theme_08")],
  ["theme_09", "tv_01"],
  ["theme_10", firstEntry("theme_10")],
  ["theme_11", firstEntry("theme_11")],
  ["theme_12", "v027_eu_16"],
  ["theme_12", firstEntry("theme_12")],
  ["theme_13", "mh_25"],
  ["theme_13", firstEntry("theme_13")],
  ["theme_14", firstEntry("theme_14")],
  ["theme_15", "hs_01"],
  ["theme_15", firstEntry("theme_15")],
  ["theme_08", firstEntry("theme_08")],
  ["theme_05", firstEntry("theme_05")],
];

const bannedTerms = [...new Set([
  ...(sandbox.window.PROMPT_GOVERNANCE?.sanitizeTiers || []).flatMap((tier) => tier.bannedTerms || []),
  "magazine cover",
  "camera language: 雜誌封面",
  "cinematic glow makeup",
  "camera-ready",
  "photoshoot",
  "photographic polish",
  "ultra realistic",
  "8k hdr",
])].filter((term) => ![
  "template face",
  "cat-eye",
  "HDR",
  "heroine",
  "gorgeous",
  "glamorous",
  "premium",
].includes(term));

function buildFor(catId, entryId) {
  sandbox.curCatID = catId;
  sandbox.curEntryID = entryId;
  const cat = sandbox.CATS.find((item) => item.id === catId);
  const entry = cat.entries.find((item) => item.id === entryId);
  if (!entry) throw new Error(`Missing entry ${catId}/${entryId}`);
  sandbox.applyDefs(entry, cat.tpl);
  return sandbox.buildPrompt();
}

function creativePromptBody(prompt) {
  return prompt
    .split(/\n\n+/)
    .filter((segment) => ![
      "MANDATORY:",
      "IDENTITY & FACE PRIORITY CLAUSE",
      "ANTI-BEAUTY-TEMPLATE OVERRIDE",
      "FACE SCOPE LOCK",
      "DOCUMENTARY PERSON LOCK",
      "TIERED SANITIZE LOCK",
      "Avoid:",
      "IDENTITY LOCK",
      "ENHANCED IDENTITY LOCK",
      "MAXIMUM IDENTITY LOCK",
      "BEAUTY & ANATOMY SAFETY",
      "Natural variation is encouraged",
      "REAL-PERSON-IN-FANTASY RULE",
      "ANTI-PATTERN OVERRIDE",
      "FINAL IDENTITY OVERRIDE",
      "Render:",
    ].some((prefix) => segment.startsWith(prefix)))
    .join("\n\n");
}

function positiveTermHits(prompt, terms) {
  const body = creativePromptBody(prompt).toLowerCase();
  return terms.filter((term) => {
    const needle = term.toLowerCase();
    let index = body.indexOf(needle);
    while (index !== -1) {
      const before = body.slice(Math.max(0, index - 48), index);
      if (!/(?:\bno\b|\bforbid\b|\bavoid\b|\bwithout\b|\bnot\b|不|禁止|避免)[^.;:\n]{0,48}$/.test(before)) {
        return true;
      }
      index = body.indexOf(needle, index + needle.length);
    }
    return false;
  });
}

const results = sampleTargets.map(([catId, entryId]) => {
  const prompt = buildFor(catId, entryId);
  const hits = positiveTermHits(prompt, bannedTerms);
  const requiredAnchors = [
    "MANDATORY: Check for an uploaded reference photo",
    "IDENTITY & FACE PRIORITY CLAUSE",
    "ANTI-BEAUTY-TEMPLATE OVERRIDE",
    "FACE SCOPE LOCK",
    "DOCUMENTARY PERSON LOCK",
    "TIERED SANITIZE LOCK",
    "FINAL IDENTITY OVERRIDE",
  ];
  const missingAnchors = requiredAnchors.filter((anchor) => !prompt.includes(anchor));
  return {
    catId,
    entryId,
    promptLength: prompt.length,
    hits,
    missingAnchors,
    risk: hits.length || missingAnchors.length ? "high" : "low",
  };
});

const highRisk = results.filter((item) => item.risk === "high");
const highRiskRate = highRisk.length / results.length;

fs.mkdirSync(path.join(ROOT, "temp"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "temp", "identity_prompt_20_sample_verification.json"),
  JSON.stringify({
    generated_at: new Date().toISOString(),
    sample_count: results.length,
    high_risk_count: highRisk.length,
    high_risk_rate: highRiskRate,
    target_prompt_risk_rate: "< 10%",
    note: "This verifies prompt-level identity drift risk, not actual image face-match rate.",
    results,
  }, null, 2),
  "utf8",
);

console.log(JSON.stringify({
  sampleCount: results.length,
  highRiskCount: highRisk.length,
  highRiskRate,
  output: "temp/identity_prompt_20_sample_verification.json",
}, null, 2));

if (highRiskRate >= 0.1) {
  console.error(JSON.stringify({ highRisk }, null, 2));
  throw new Error(`Prompt-level identity risk rate must stay below 10%, got ${(highRiskRate * 100).toFixed(1)}%`);
}
