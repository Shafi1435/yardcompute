// Checks that the worked examples written on calculator pages match what the calculator actually returns.
// When a page example is rewritten, add or update its case here.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appPath = path.join(__dirname, "..", "public", "assets", "app.js");
const source = fs.readFileSync(appPath, "utf8");
const start = source.indexOf("const configs={");
const end = source.indexOf("\n};\n\nfunction convertToBase", start);
const configSource = source.slice(start, end + 3).replace("const configs=", "module.exports=");
const context = { module: { exports: {} } };
vm.runInNewContext(configSource, context);
const configs = context.module.exports;

function run(key, overrides = {}) {
  const values = {};
  for (const [id, , , defaultValue] of configs[key].fields) values[id] = defaultValue;
  Object.assign(values, overrides);
  return Object.fromEntries(configs[key].calc(values));
}

function pageText(key) {
  const dir = fs.readdirSync(path.join(__dirname, "..", "public")).find((d) =>
    fs.existsSync(path.join(__dirname, "..", "public", d, key, "index.html")));
  return fs.readFileSync(path.join(__dirname, "..", "public", dir, key, "index.html"), "utf8");
}

const cases = [
  ["fence-rail-calculator", {}, { "Fence sections": "13 sections", "Rails without waste": "39 rails", "Rails to order": "43 rails" }, ["13 sections", "43 rails"]],
  ["fence-rail-calculator", { length: 150, rails: 2 }, { "Fence sections": "19 sections", "Rails without waste": "38 rails", "Rails to order": "42 rails" }, ["19 sections and 38 rails"]],
  ["fence-picket-calculator", {}, { "Pickets without waste": "214 pickets", "Pickets to order": "236 pickets" }, ["214 pickets", "236 pickets"]],
  ["fence-picket-calculator", { gap: 0 }, { "Pickets without waste": "219 pickets" }, ["219 pickets"]],
  ["deck-joist-calculator", {}, { "Deck area": "192.00 sq ft", "Joists": "10 joists", "Base linear feet": "160.0 ft", "Linear feet with waste": "176.0 ft" }, ["10 joists", "160 linear feet", "176 linear feet", "192 sq ft"]],
  ["deck-joist-spacing-calculator", {}, { "Joists": "10 joists", "Joist bays": "9 bays", "Adjusted spacing": "16.00 in" }, ["10 joists at exactly 16.00 in"]],
  ["deck-joist-spacing-calculator", { width: 13 }, { "Joists": "11 joists", "Joist bays": "10 bays", "Adjusted spacing": "15.60 in" }, ["11 joists", "15.60 in"]],
  ["deck-screw-calculator", {}, { "Deck boards": "26 boards", "Joist crossings": "13 per board", "Screws to order": "744 screws" }, ["26 boards", "13 joists", "676 screws", "744 screws"]],
];

for (const [key, overrides, expected, phrases] of cases) {
  test(`${key} ${JSON.stringify(overrides)} matches its page example`, () => {
    const results = run(key, overrides);
    for (const [label, value] of Object.entries(expected)) assert.equal(results[label], value, `${key}: ${label}`);
    const html = pageText(key);
    for (const phrase of phrases) assert.ok(html.includes(phrase), `${key} page should mention "${phrase}"`);
  });
}
