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
  curLensID: "l_85",
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
    catId: "china_drama",
    entryId: "cd_01",
    faceDesc: "single eyelids, natural eye spacing, straight nose bridge, soft squared chin, natural asymmetry",
  },
  {
    name: "sujin",
    catId: "china_drama",
    entryId: "cd_16",
    faceDesc: "defined eyelid structure, narrower lip width, longer philtrum, delicate jaw curvature, realistic skin texture",
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

console.log(
  JSON.stringify(
    {
      outputFile: "temp/identity_engine_verification.json",
      tests: tests.map((test) => test.name),
      checks: {
        promptOrderCorrect:
          baiqianSegments[0]?.includes("MANDATORY FIRST STEP") &&
          baiqianSegments[1]?.includes("SUBJECT FACE DESCRIPTION") &&
          baiqianSegments[2]?.startsWith("Avoid: "),
        faceAnchorPresent: output.baiqian.includes("SUBJECT FACE DESCRIPTION"),
        baiqianHasCoreIdentity: output.baiqian.includes("IDENTITY & EXPRESSION PRESERVATION"),
        baiqianHasProportionCore: output.baiqian.includes("PROPORTION COHERENCE OVERRIDE"),
        sujinHasAntiPatternOverride: output.sujin.includes("ANTI-PATTERN OVERRIDE"),
        sceneContextLabelUsed: output.sujin.includes("Scene context:"),
        noMovieTrailer:
          !output.baiqian.toLowerCase().includes("movie trailer") &&
          !output.sujin.toLowerCase().includes("movie trailer"),
        noLowAngle:
          !output.baiqian.toLowerCase().includes("low angle upward shot") &&
          !output.sujin.toLowerCase().includes("low angle upward shot"),
        noFashionEditorialCameraLanguage:
          !output.baiqian.toLowerCase().includes("fashion editorial camera language") &&
          !output.sujin.toLowerCase().includes("fashion editorial camera language"),
        noArchetypeCharTermsInTplChars: tplCharMatches.every(
          (line) =>
            !line.includes("heroine") &&
            !line.includes("beauty") &&
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
          lensIds.length === 2 &&
          lensIds.includes("l_50") &&
          lensIds.includes("l_85"),
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
        ancientBoostUnder100Words:
          ((core.match(/const ANCIENT_BOOST = `([\s\S]*?)`;/) || [])[1] || "")
            .split(/\s+/)
            .filter(Boolean).length < 100,
      },
    },
    null,
    2,
  ),
);
