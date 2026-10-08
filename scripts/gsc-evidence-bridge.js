#!/usr/bin/env node
/**
 * YardCompute GSC Evidence Bridge
 *
 * Converts a supplied Google Search Console Search Analytics payload into the
 * normalized file consumed by the laptop agent.
 *
 * Security rule: this bridge accepts data only. It never asks for or stores
 * Google credentials, refresh tokens, cookies, or service-account keys.
 *
 * Usage:
 *   node scripts/gsc-evidence-bridge.js --input data/gsc-evidence.json
 *   node scripts/gsc-evidence-bridge.js --input data/gsc-evidence.json --output data/gsc-live.json
 */

const fs = require("node:fs");
const path = require("node:path");

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const inputPath = arg("--input", "data/gsc-evidence.json");
const outputPath = arg("--output", "data/gsc-live.json");

function fail(message) {
  console.error("GSC Evidence Bridge: " + message);
  process.exitCode = 1;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function pick(obj, keys) {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function normalizeRow(row) {
  const keys = Array.isArray(row.keys) ? row.keys : [];
  const query = String(pick(row, ["query"]) ?? keys[0] ?? "");
  const page = String(pick(row, ["page"]) ?? keys[1] ?? "");
  return {
    query,
    page,
    clicks: num(pick(row, ["clicks", "Clicks"])),
    impressions: num(pick(row, ["impressions", "Impressions"])),
    ctr: num(pick(row, ["ctr", "CTR"])),
    position: num(pick(row, ["position", "Position"]))
  };
}

function unwrap(payload) {
  if (Array.isArray(payload)) return { rows: payload };
  if (payload && Array.isArray(payload.rows)) return payload;
  if (payload && payload.data && Array.isArray(payload.data.rows)) return { ...payload, ...payload.data };
  if (payload && payload.result && Array.isArray(payload.result.rows)) return { ...payload, ...payload.result };
  return null;
}

if (!fs.existsSync(inputPath)) {
  fail("input file not found: " + inputPath);
  process.exit();
}

let payload;
try {
  payload = readJson(inputPath);
} catch (error) {
  fail("could not parse JSON: " + error.message);
  process.exit();
}

const source = unwrap(payload);
if (!source) {
  fail("expected an array or an object containing a rows array");
  process.exit();
}

const rows = source.rows.map(normalizeRow).filter(row => row.query || row.page);

const property = String(pick(source, ["property", "siteUrl", "site", "propertyUrl"]) ?? "");
const startDate = String(pick(source, ["startDate", "start_date"]) ?? "");
const endDate = String(pick(source, ["endDate", "end_date"]) ?? "");

if (!rows.length) {
  fail("no usable Search Analytics rows were found");
  process.exit();
}

const output = {
  status: "LIVE_EVIDENCE",
  source: "Google Search Console evidence handoff",
  generatedAt: new Date().toISOString(),
  property: property || "unknown",
  dateRange: { startDate, endDate },
  dimensions: ["query", "page"],
  metrics: ["clicks", "impressions", "ctr", "position"],
  rows,
  security: {
    credentialsStored: false,
    tokensStored: false,
    cookiesStored: false
  },
  notes: [
    "This file is a data handoff, not a Google credential.",
    "Verify the property and date range before using it for implementation decisions.",
    "The laptop agent should treat LIVE_EVIDENCE as current only within the supplied date range."
  ]
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n", "utf8");
console.log("GSC Evidence Bridge: normalized " + rows.length + " rows -> " + outputPath);
