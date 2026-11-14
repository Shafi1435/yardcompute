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
  ["concrete-bag-calculator", {}, { "Base volume": "33.33 cu ft", "Order volume": "36.67 cu ft", "Cubic yards": "1.36 yd³", "Bags to order": "62 bags" }, ["33.33 cu ft", "1.36 cubic yards", "62 bags"]],
  ["concrete-bag-calculator", { bagYield: 0.45 }, { "Bags to order": "82 bags" }, ["82 bags"]],
  ["concrete-column-calculator", {}, { "Base concrete": "25.13 cu ft", "Order volume": "27.65 cu ft", "Cubic yards": "1.02 yd³" }, ["25.13 cu ft", "27.65 cu ft", "1.02 cubic yards"]],
  ["concrete-footing-calculator", {}, { "Base concrete": "14.14 cu ft", "Order volume": "15.55 cu ft", "Cubic yards": "0.58 yd³", "Approx. 80-lb bags": "26 bags" }, ["14.14 cu ft", "15.55 cu ft", "26 bags"]],
  ["concrete-patio-calculator", {}, { "Patio area": "240.00 sq ft", "Base concrete": "80.00 cu ft", "Order volume": "88.00 cu ft", "Cubic yards": "3.26 yd³" }, ["240 sq ft", "88 cu ft", "3.26 cubic yards"]],
  ["concrete-patio-calculator", { depth: 5 }, { "Base concrete": "100.00 cu ft", "Cubic yards": "4.07 yd³" }, ["100 cu ft", "4.07 cubic yards"]],
  ["deck-footing-calculator", {}, { "Base concrete": "14.14 cu ft", "Order volume": "15.55 cu ft", "Cubic yards": "0.58 yd³", "Approx. 80-lb bags": "26 bags" }, ["14.14 cu ft", "15.55 cu ft", "26 bags"]],
  ["deck-footing-calculator", { footings: 8 }, { "Base concrete": "18.85 cu ft", "Approx. 80-lb bags": "35 bags" }, ["18.85 cu ft", "35 bags"]],
  ["deck-materials-calculator", {}, { "Deck area": "192.00 sq ft", "Deck boards": "29 boards", "Deck board linear feet": "457.6 ft", "Joists": "13 joists", "Joist linear feet": "171.6 ft" }, ["29 boards", "457.6 linear feet", "13 joists", "171.6 linear feet"]],
  ["privacy-fence-materials-calculator", {}, { "Sections": "13 sections", "Posts": "14 posts", "Rails to order": "43 rails", "Pickets to order": "235 pickets" }, ["13 sections and 14 posts", "43 rails and 235 pickets"]],
  ["gravel-bag-calculator", {}, { "Project area": "200.00 sq ft", "Volume with waste": "55.00 cu ft", "Cubic yards": "2.04 yd³", "Bags to order": "110 bags" }, ["55 cu ft", "2.04 cubic yards", "110 bags"]],
  ["gravel-bag-calculator", { depth: 2 }, { "Volume with waste": "36.67 cu ft", "Bags to order": "74 bags" }, ["36.67 cu ft", "74 bags"]],
  ["gravel-tonnage-calculator", {}, { "Volume": "50.00 cu ft", "Cubic yards": "1.85 yd³", "Estimated weight": "2.63 tons" }, ["50 cu ft", "1.85 cubic yards", "2.63 tons"]],
  ["gravel-tonnage-calculator", { depth: 4 }, { "Volume": "66.67 cu ft", "Cubic yards": "2.47 yd³", "Estimated weight": "3.50 tons" }, ["66.67 cu ft", "2.47 cubic yards", "3.50 tons"]],
  ["river-rock-calculator", {}, { "Project area": "200.00 sq ft", "Volume with waste": "36.67 cu ft", "Cubic yards": "1.36 yd³", "Estimated weight": "1.83 tons" }, ["36.67 cu ft", "1.36 cubic yards", "1.83 tons"]],
  ["river-rock-calculator", { depth: 3 }, { "Volume with waste": "55.00 cu ft", "Cubic yards": "2.04 yd³", "Estimated weight": "2.75 tons" }, ["55 cu ft", "2.04 cubic yards", "2.75 tons"]],
  ["paver-sand-calculator", {}, { "Project area": "240.00 sq ft", "Sand with waste": "22.00 cu ft", "Cubic yards": "0.81 yd³" }, ["240 sq ft", "22 cu ft", "0.81 cubic yards"]],
];

for (const [key, overrides, expected, phrases] of cases) {
  test(`${key} ${JSON.stringify(overrides)} matches its page example`, () => {
    const results = run(key, overrides);
    for (const [label, value] of Object.entries(expected)) assert.equal(results[label], value, `${key}: ${label}`);
    const html = pageText(key);
    for (const phrase of phrases) assert.ok(html.includes(phrase), `${key} page should mention "${phrase}"`);
  });
}
