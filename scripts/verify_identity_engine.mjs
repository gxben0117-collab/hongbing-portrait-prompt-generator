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
    ["proShot", ""],
    ["proAction", ""],
    ["proCustom", ""],
    ["txtLine", ""],
    ["extras", ""],
  ]);

  return {
    getElementById(id) {
      return {
        value: values.get(id) ?? "",
        innerHTML: "",
        textContent: "",
        style: {},
        classList: { add() {}, remove() {}, toggle() {} },
        scrollIntoView() {},
      };
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
  curAtmID: "at_ethereal",
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

const tests = [
  { name: "baiqian", catId: "china_drama", entryId: "cd_01" },
  { name: "sujin", catId: "china_drama", entryId: "cd_16" },
];

const output = {};
for (const test of tests) {
  output[test.name] = buildFor(test.catId, test.entryId);
}

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
        baiqianHasCoreIdentity: output.baiqian.includes("IDENTITY & EXPRESSION PRESERVATION"),
        baiqianHasProportionCore: output.baiqian.includes("PROPORTION COHERENCE OVERRIDE"),
        sujinHasAntiPatternOverride: output.sujin.includes("ANTI-PATTERN OVERRIDE"),
        noMovieTrailer:
          !output.baiqian.toLowerCase().includes("movie trailer") &&
          !output.sujin.toLowerCase().includes("movie trailer"),
        noLowAngle:
          !output.baiqian.toLowerCase().includes("low angle upward shot") &&
          !output.sujin.toLowerCase().includes("low angle upward shot"),
      },
    },
    null,
    2,
  ),
);
