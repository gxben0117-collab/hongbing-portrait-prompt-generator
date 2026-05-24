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
    ["faceDesc", ""],
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
const governance = read("prompt_governance.js");
const catsArray = extractCatsArray(html);

const sandbox = {
  console,
  Math,
  CATS: vm.runInNewContext(`(${catsArray})`),
  curCatID: "xianxia",
  curEntryID: "xia_01",
  curMKID: "xianxia",
  curAngID: "sanfen",
  curRatioID: "r_916",
  curLensID: "l_50",
  curLightID: "ls_golden",
  curAtmID: "at_misty",
  curIdentityID: "il_standard",
  curCamLangID: "cl_fashion",
  document: makeDocument(),
  navigator: { clipboard: { writeText: async () => {} } },
  window: { scrollTo() {} },
  setTimeout(fn) { return fn(); },
  clearTimeout() {},
};

vm.createContext(sandbox);
vm.runInContext(governance, sandbox);
vm.runInContext(core, sandbox);

function buildFor(catId, entryId) {
  sandbox.curCatID = catId;
  sandbox.curEntryID = entryId;
  const cat = sandbox.CATS.find((item) => item.id === catId);
  const entry = cat.entries.find((item) => item.id === entryId);
  sandbox.applyDefs(entry, cat.tpl);
  return sandbox.buildPrompt();
}

function setField(id, value) {
  const element = sandbox.document.getElementById(id);
  element.value = value;
}

const tests = [
  {
    name: "baiqian",
    catId: "theme_09",
    entryId: "tv_01",
    faceDesc: "single eyelids, natural eye spacing, straight nose bridge, soft squared chin, natural asymmetry",
  },
  {
    name: "bridal",
    catId: "theme_15",
    entryId: "hs_01",
    faceDesc: "defined eyelid structure, narrower lip width, longer philtrum, delicate jaw curvature, realistic skin texture",
  },
  {
    name: "londonTravel",
    catId: "theme_12",
    entryId: "v027_eu_16",
    faceDesc: "natural eye spacing, original eyelid structure, reference nose geometry, natural lip shape, real skin detail",
  },
  {
    name: "forestSpirit",
    catId: "theme_13",
    entryId: "mh_25",
    faceDesc: "original eye size, natural eyelid fold, reference nose width, natural smile lines, unretouched skin texture",
  },
];

const output = {};
for (const test of tests) {
  setField("faceDesc", test.faceDesc);
  output[test.name] = buildFor(test.catId, test.entryId);
}

const baiqianSegments = output.baiqian.split("\n\n").slice(0, 3);
const tplCharMatches = [...core.matchAll(/char:'([^']+)'/g)].map((match) => match[1].toLowerCase());
const categoryPoseGuidanceLines = [...core.matchAll(/'([^']+)'/g)]
  .map((match) => match[1].toLowerCase())
  .filter((line) => line.includes("generic costume model") || line.includes("role-appropriate behavior"));
const lensIds = [...core.matchAll(/\{id:'(l_[^']+)'/g)].map((match) => match[1]);
const cameraLangIds = [...core.matchAll(/\{id:'(cl_[^']+)'/g)].map((match) => match[1]);
const lightStyleIds = [...core.matchAll(/\{id:'(ls_[^']+)'/g)].map((match) => match[1]);
const atmIds = [...core.matchAll(/\{id:'(at_[^']+)'/g)].map((match) => match[1]);
const tplDefaultsBody = (core.match(/const TPL_DEFAULTS = \{([\s\S]*?)\n\};/) || [])[1] || "";

fs.mkdirSync(path.join(ROOT, "temp"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "temp", "identity_engine_verification.json"),
  JSON.stringify(output, null, 2),
  "utf8",
);

const checks = {
        promptOrderCorrect:
          baiqianSegments[0]?.includes("MANDATORY: Check for an uploaded reference photo") &&
          baiqianSegments[1]?.includes("IDENTITY & FACE PRIORITY CLAUSE") &&
          baiqianSegments[2]?.includes("ANTI-BEAUTY-TEMPLATE OVERRIDE"),
        identitySovereigntyPresent: output.baiqian.includes("IDENTITY & FACE PRIORITY CLAUSE"),
        antiBeautyTemplatePresent: output.baiqian.includes("ANTI-BEAUTY-TEMPLATE OVERRIDE"),
        finalIdentityOverridePresent: output.baiqian.includes("FINAL IDENTITY OVERRIDE"),
        faceAnchorPresent: output.baiqian.includes("SUBJECT FACE DESCRIPTION"),
        baiqianHasCoreIdentity: output.baiqian.includes("IDENTITY LOCK (CRITICAL)"),
        baiqianHasProportionCore: output.baiqian.includes("Head-to-body proportion must be realistic"),
        bridalHasAntiPatternOverride: output.bridal.includes("ANTI-PATTERN OVERRIDE"),
        sceneContextLabelUsed: output.bridal.includes("Character context:"),
        noMovieTrailer:
          !output.baiqian.toLowerCase().includes("movie trailer") &&
          !output.bridal.toLowerCase().includes("movie trailer"),
        noLowAngle:
          !output.baiqian.toLowerCase().includes("low angle upward shot") &&
          !output.bridal.toLowerCase().includes("low angle upward shot"),
        noFashionEditorialCameraLanguage:
          !output.baiqian.toLowerCase().includes("fashion editorial camera language") &&
          !output.bridal.toLowerCase().includes("fashion editorial camera language"),
        noArchetypeCharTermsInTplChars: tplCharMatches.every(
          (line) =>
            !line.includes("heroine") &&
            !line.includes("luminous") &&
            !line.includes("alluring") &&
            !line.includes("divine presence"),
        ),
        noArchetypeTermsInPoseGuidance: categoryPoseGuidanceLines.every(
          (line) =>
            !line.includes("heroine") &&
            !line.includes("beauty"),
        ),
        lensPrunedToSafeSet:
          lensIds.length === 1 &&
          lensIds.includes("l_50"),
        governanceLoaded:
          html.includes("prompt_governance.js") &&
          core.includes("const GOVERNANCE") &&
          governance.includes("PROMPT_GOVERNANCE"),
        microTurnAngleUsed:
          core.includes("name:'鎖臉微側'") &&
          core.includes("10-15 degree head turn"),
        cameraLangTravelRemoved:
          !cameraLangIds.includes("cl_travel"),
        lowkeyRemoved:
          !lightStyleIds.includes("ls_lowkey"),
        darkAndEtherealRemoved:
          !atmIds.includes("at_dark") &&
          !atmIds.includes("at_ethereal"),
        tplDefaultsNoDeprecatedIds:
          !/l_28|l_35|l_135|cl_travel|ls_lowkey|at_dark|at_ethereal/.test(tplDefaultsBody),
        antiPatternsBlockTravel:
          core.includes("bannedCameraLanguageIds: ['cl_movie', 'cl_travel']"),
        mistyHasVisibilityGuard:
          core.includes("body and face remain clearly visible and fully lit"),
        faceDescGuidanceUpdated:
          html.includes("優先填：眼型（單/雙/丹鳳眼）") &&
          html.includes("填越具體越能鎖住本人五官"),
        londonTravelNoCommercialBeautyTokens:
          [
            "magazine cover",
            "camera language: 雜誌封面",
            "camera language: 時尚大片",
            "cinematic glow makeup",
            "glow makeup",
            "camera-ready",
            "premium world travel",
            "premium travel",
            "editorial realism",
            "travel editorial",
            "environmental portrait",
            "fashion",
            "beauty templates",
            "softly defined brows",
            "defined lashes",
            "healthy peach or rose lip",
            "ultra realistic",
            "8k hdr",
            "vivid colors",
            "crisp clean air",
          ].every((term) => !output.londonTravel.toLowerCase().includes(term.toLowerCase())),
        londonTravelUsesDocumentaryLanguage:
          output.londonTravel.toLowerCase().includes("documentary") &&
          output.londonTravel.toLowerCase().includes("real tourist") &&
          output.londonTravel.toLowerCase().includes("natural dynamic range") &&
          output.londonTravel.toLowerCase().includes("unretouched"),
        forestSpiritNoFantasyBeautyArchetype:
          [
            "flower fairy",
            "fairy makeup",
            "luminous pastel eye shimmer",
            "luminous",
            "romantic fantasy freshness",
            "botanical glow",
            "premium cinematic",
            "cinematic travel photoshoot",
            "photoshoot",
            "high-end",
            "photographic polish",
            "magazine cover",
            "environmental portrait",
            "professional travel photography",
            "8k hdr",
            "ultra realistic",
          ].every((term) => !output.forestSpirit.toLowerCase().includes(term.toLowerCase())),
        forestSpiritUsesAccidentalFantasyDocumentary:
          output.forestSpirit.toLowerCase().includes("real person accidentally photographed inside a fantasy environment") &&
          output.forestSpirit.toLowerCase().includes("minimal botanical makeup") &&
          output.forestSpirit.toLowerCase().includes("no fantasy-eye styling") &&
          output.forestSpirit.toLowerCase().includes("unretouched facial detail"),
        ancientBoostUnder100Words:
          ((core.match(/const ANCIENT_BOOST = `([\s\S]*?)`;/) || [])[1] || "")
            .split(/\s+/)
            .filter(Boolean).length < 100,
};

const report = {
  outputFile: "temp/identity_engine_verification.json",
  tests: tests.map((test) => test.name),
  checks,
};

console.log(JSON.stringify(report, null, 2));

const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) {
  throw new Error(`Identity engine verification failed: ${failed.join(", ")}`);
}
