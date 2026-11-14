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
  ["drywall-calculator", {}, { "Net wall area": "408.00 sq ft", "Area with waste": "448.80 sq ft", "Sheets to order": "15 sheets" }, ["408 sq ft", "448.8 sq ft", "15 sheets"]],
  ["drywall-calculator", { sheetArea: 48 }, { "Sheets to order": "10 sheets" }, ["10 sheets"]],
  ["flooring-calculator", {}, { "Floor area": "192.00 sq ft", "Area to order": "211.20 sq ft", "Boxes to order": "11 boxes" }, ["192 sq ft", "211.2 sq ft", "11 boxes"]],
  ["paint-calculator", {}, { "Gross wall area": "352.00 sq ft", "Net paint area": "312.00 sq ft", "Paint to order": "2 gallons" }, ["352 sq ft", "312 sq ft", "2 gallons"]],
  ["paint-calculator", { length: 16, width: 14 }, { "Net paint area": "440.00 sq ft", "Paint to order": "3 gallons" }, ["440 sq ft", "3 gallons"]],
  ["stair-stringer-calculator", {}, { "Risers": "13 risers", "Actual riser height": "7.38 in", "Total run": "120.00 in", "Approx. stringer length": "12.81 ft" }, ["13 risers", "7.38 in", "120 in", "12.81 ft"]],
  ["tile-calculator", {}, { "Project area": "120.00 sq ft", "Tiles to order": "132 tiles" }, ["120 sq ft", "132 tiles"]],
  ["tile-calculator", { tileWidth: 24 }, { "Tiles to order": "66 tiles" }, ["66 tiles"]],
  ["raised-bed-soil-calculator", {}, { "Total bed area": "32.00 sq ft", "Soil volume": "35.20 cu ft", "Cubic yards": "1.30 yd³" }, ["35.2 cu ft", "1.30 cubic yards"]],
  ["raised-bed-soil-calculator", { beds: 3 }, { "Soil volume": "105.60 cu ft", "Cubic yards": "3.91 yd³" }, ["105.6 cu ft", "3.91 cubic yards"]],
  ["retaining-wall-calculator", {}, { "Courses": "6 courses", "Blocks to order": "119 blocks", "Caps to order": "20 caps", "Base aggregate volume": "26.40 cu ft", "Base aggregate": "0.98 yd³" }, ["18 blocks", "6 courses", "119 with 10% extra", "20 caps", "26.4 cu ft", "0.98 cubic yards"]],
  ["sod-calculator", {}, { "Lawn area": "800.00 sq ft", "Sod area to order": "880 sq ft" }, ["800 sq ft", "880 sq ft"]],
  ["topsoil-calculator", {}, { "Topsoil with waste": "73.33 cu ft", "Cubic yards": "2.72 yd³" }, ["73.33 cu ft", "2.72 cubic yards"]],
  ["topsoil-calculator", { depth: 6 }, { "Topsoil with waste": "110.00 cu ft", "Cubic yards": "4.07 yd³" }, ["110 cu ft", "4.07 cubic yards"]],
  ["paver-edge-restraint-calculator", {}, { "Project perimeter": "64.00 ft", "Edge restraint with waste": "70.40 linear ft", "Suggested order quantity": "71 linear ft" }, ["64 ft", "70.4 ft", "71 linear feet"]],
  ["paver-edge-restraint-calculator", { length: 10, width: 12 }, { "Project perimeter": "44.00 ft", "Edge restraint with waste": "48.40 linear ft" }, ["44 ft", "48.4 ft"]],
  ["permeable-paver-calculator", {}, { "Project area": "240.00 sq ft", "Pavers to order": "1056 pavers", "Base aggregate volume": "176.00 cu ft", "Base aggregate": "6.52 yd³" }, ["960 pavers", "1,056", "176 cu ft", "6.52 cubic yards"]],
  ["concrete-driveway-calculator", {}, { "Driveway area": "480.00 sq ft", "Base concrete": "200.00 cu ft", "Order volume": "220.00 cu ft", "Cubic yards": "8.15 yd³" }, ["480 sq ft", "220 cu ft", "8.15 cubic yards"]],
  ["concrete-driveway-calculator", { width: 20 }, { "Cubic yards": "13.58 yd³" }, ["13.58 cubic yards"]],
  ["concrete-driveway-calculator", { depth: 6 }, { "Base concrete": "240.00 cu ft", "Cubic yards": "9.78 yd³" }, ["240 cu ft", "9.78 cubic yards"]],
  ["concrete-calculator", { length: 12, width: 12 }, { "Concrete": "48.00 cu ft", "Approx. cubic yards": "1.96 yd³" }, ["48 cu ft", "1.96 cubic yards"]],
  ["concrete-calculator", { length: 3, width: 30 }, { "Concrete": "30.00 cu ft", "Approx. cubic yards": "1.22 yd³" }, ["30 cu ft", "1.22 cubic yards"]],
  ["gravel-calculator", {}, { "Gravel volume": "50.00 cu ft", "With 10% waste": "55.00 cu ft", "Estimated weight": "2.89 tons" }, ["55 cu ft", "2.04 cubic yards", "2.89 tons"]],
  ["gravel-calculator", { length: 4, width: 40 }, { "Gravel volume": "40.00 cu ft", "With 10% waste": "44.00 cu ft", "Estimated weight": "2.31 tons" }, ["44 cu ft", "2.31 tons"]],
  ["fence-calculator", {}, { "Fence sections": "13 sections", "Posts": "14 posts" }, ["13 sections and 14 posts"]],
  ["fence-calculator", { length: 150 }, { "Fence sections": "19 sections", "Posts": "20 posts" }, ["19 sections and 20 posts"]],
  ["fence-calculator", { length: 150, spacing: 6 }, { "Fence sections": "25 sections", "Posts": "26 posts" }, ["25 sections and 26 posts"]],
  ["paver-base-sand-calculator", {}, { "Base volume with waste": "132.00 cu ft", "Bedding sand with waste": "22.00 cu ft" }, ["132.00 cubic feet", "22.00 cubic feet"]],
  ["paver-base-sand-calculator", { length: 10, width: 14, baseDepth: 4 }, { "Base volume with waste": "51.33 cu ft", "Base volume": "1.90 yd³", "Bedding sand with waste": "12.83 cu ft", "Bedding sand volume": "0.48 yd³" }, ["51.33 cu ft", "1.90 cubic yards", "12.83 cu ft", "0.48 cubic yards"]],
  ["mulch-calculator", {}, { "Mulch": "40.00 cu ft", "With 10% waste": "44.00 cu ft", "Cubic yards": "1.63 yd³" }, ["44 cu ft", "1.63 cubic yards"]],
  ["mulch-calculator", { depth: 2 }, { "With 10% waste": "29.33 cu ft", "Cubic yards": "1.09 yd³" }, ["29.33 cu ft", "1.09 cubic yards"]],
  ["mulch-calculator", { length: 4, width: 50 }, { "With 10% waste": "55.00 cu ft", "Cubic yards": "2.04 yd³" }, ["55 cu ft", "2.04 cubic yards"]],
];

for (const [key, overrides, expected, phrases] of cases) {
  test(`${key} ${JSON.stringify(overrides)} matches its page example`, () => {
    const results = run(key, overrides);
    for (const [label, value] of Object.entries(expected)) assert.equal(results[label], value, `${key}: ${label}`);
    const html = pageText(key);
    for (const phrase of phrases) assert.ok(html.includes(phrase), `${key} page should mention "${phrase}"`);
  });
}
