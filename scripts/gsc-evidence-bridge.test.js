const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

test("normalizes a Search Analytics rows payload without credentials", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "yardcompute-gsc-"));
  const input = path.join(dir, "input.json");
  const output = path.join(dir, "output.json");
  fs.writeFileSync(input, JSON.stringify({
    property: "sc-domain:yardcompute.com",
    startDate: "2026-09-08",
    endDate: "2026-10-05",
    rows: [
      { keys: ["grass seed calculator", "https://yardcompute.com/landscaping-calculators/grass-seed-calculator/"], clicks: 1, impressions: 2, ctr: 0.5, position: 13 }
    ],
    token: "must-not-be-copied"
  }));
  const result = spawnSync(process.execPath, [
    "scripts/gsc-evidence-bridge.js", "--input", input, "--output", output
  ], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(fs.readFileSync(output, "utf8"));
  assert.equal(data.status, "LIVE_EVIDENCE");
  assert.equal(data.rows.length, 1);
  assert.equal(data.rows[0].query, "grass seed calculator");
  assert.equal(data.rows[0].position, 13);
  assert.equal(data.security.credentialsStored, false);
  assert.equal(JSON.stringify(data).includes("must-not-be-copied"), false);
});

test("rejects payloads without rows", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "yardcompute-gsc-"));
  const input = path.join(dir, "input.json");
  const output = path.join(dir, "output.json");
  fs.writeFileSync(input, JSON.stringify({ property: "sc-domain:yardcompute.com" }));
  const result = spawnSync(process.execPath, [
    "scripts/gsc-evidence-bridge.js", "--input", input, "--output", output
  ], { encoding: "utf8" });
  assert.notEqual(result.status, 0);
});
