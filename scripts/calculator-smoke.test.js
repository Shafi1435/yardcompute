const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appPath = path.join(__dirname, "..", "public", "assets", "app.js");
const source = fs.readFileSync(appPath, "utf8");
const start = source.indexOf("const configs={");
const end = source.indexOf("\n};\n\nfunction convertToBase", start);

assert.notEqual(start, -1, "calculator configuration block must exist");
assert.notEqual(end, -1, "calculator configuration block must have a closing boundary");

const configSource = source.slice(start, end + 3).replace("const configs=", "module.exports=");
const configs = {};
vm.runInNewContext(configSource, { module: { exports: configs } });

test("all calculator configurations return results for their documented default values", () => {
  const entries = Object.entries(configs);
  assert.equal(entries.length, 50, "expected all 50 calculator configurations");

  for (const [key, config] of entries) {
    const values = {};
    for (const [id, , , defaultValue] of config.fields) values[id] = defaultValue;
    assert.ok(config.fields.length > 0, key + " should define input fields");
    const results = config.calc(values);
    assert.ok(Array.isArray(results) && results.length > 0, key + " should return results");
    for (const result of results) {
      assert.ok(Array.isArray(result) && result.length >= 2, key + " result rows need a label and value");
      assert.ok(!/NaN|Infinity|undefined/.test(String(result[1])), key + " returned an invalid result: " + result[1]);
    }
  }
});

test("grass seed calculator matches the documented 800-square-foot example", () => {
  const result = configs["grass-seed-calculator"].calc({
    length: 40, width: 20, rate: 5, waste: 10, bagSize: 20
  });
  assert.equal(result[0][1], "800.00 sq ft");
  assert.equal(result[1][1], "4.00 lb");
  assert.equal(result[2][1], "4.40 lb");
  assert.equal(result[3][1], "1 bags");
});

test("fence picket spacing calculator keeps the 100-foot example within the 2-inch maximum gap", () => {
  const result = configs["fence-picket-spacing-calculator"].calc({
    length: 100, picket: 5.5, gap: 2
  });
  assert.equal(result[1][1], "161 pickets");
  assert.equal(result[2][1], "1.966 in");
  assert.ok(Number.parseFloat(result[2][1]) <= 2);
});
