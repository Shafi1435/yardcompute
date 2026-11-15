// Notify IndexNow (Bing, Yandex, Seznam, Naver and other participating engines) about changed pages.
// Usage in CI after a deploy:
//   node scripts/indexnow-submit.js --changed <base-sha> <head-sha>   (pages changed in that range)
//   node scripts/indexnow-submit.js --all                              (every URL in the sitemap)
// Google does not use IndexNow; Search Console and the sitemap cover Google.
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.join(__dirname, "..");
const HOST = "yardcompute.com";
const keyFile = fs.readdirSync(path.join(root, "public")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("IndexNow key file public/<key>.txt not found");
const KEY = keyFile.replace(".txt", "");

function sitemapUrls() {
  const worker = fs.readFileSync(path.join(root, "src/worker.js"), "utf8");
  return [...worker.matchAll(/<loc>(https:\/\/yardcompute\.com\/[^<]*)<\/loc>/g)].map((m) => m[1]);
}

function changedUrls(base, head) {
  const out = execFileSync("git", ["diff", "--name-only", "--diff-filter=AM", base, head, "--", "public"], { cwd: root, encoding: "utf8" });
  const allowed = new Set(sitemapUrls());
  return out.split("\n").filter((f) => f.endsWith("index.html"))
    .map((f) => `https://${HOST}/` + f.replace(/^public\//, "").replace(/index\.html$/, ""))
    .filter((u) => allowed.has(u));
}

async function main() {
  const [mode, base, head] = process.argv.slice(2);
  const urls = mode === "--all" ? sitemapUrls() : changedUrls(base, head);
  if (!urls.length) { console.log("IndexNow: no changed pages to submit."); return; }
  const body = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(0, 10000) };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify(body),
  });
  console.log(`IndexNow: submitted ${urls.length} URL(s), HTTP ${res.status}`);
  urls.forEach((u) => console.log("  " + u));
  if (![200, 202].includes(res.status)) process.exitCode = 1;
}
main().catch((e) => { console.error(e); process.exitCode = 1; });
