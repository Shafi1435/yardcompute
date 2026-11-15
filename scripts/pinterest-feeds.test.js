// Checks the Pinterest RSS feeds built by scripts/pinterest/build.py.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "scripts/pinterest/pins.json"), "utf8"));

test("every pin has an image, a live page link and a feed entry", () => {
  for (const pin of data.pins) {
    assert.ok(fs.existsSync(path.join(root, "public/assets/pins", `${pin.id}.png`)), `${pin.id}: image missing (run scripts/pinterest/build.py)`);
    const rel = pin.link.replace("https://yardcompute.com", "");
    assert.ok(fs.existsSync(path.join(root, "public", rel, "index.html")), `${pin.id}: link ${pin.link} is not a page on the site`);
    const feed = fs.readFileSync(path.join(root, "public/pins", `${pin.board}.xml`), "utf8");
    assert.ok(feed.includes(`yardcompute-pin-${pin.id}</guid>`), `${pin.id}: not in ${pin.board}.xml (run scripts/pinterest/build.py)`);
  }
});

test("feeds only link to yardcompute.com", () => {
  for (const board of Object.keys(data.boards)) {
    const feed = fs.readFileSync(path.join(root, "public/pins", `${board}.xml`), "utf8");
    for (const [, url] of feed.matchAll(/(?:<link>|url=")([^<"]+)/g)) assert.ok(url.startsWith("https://yardcompute.com/"), `${board}.xml: ${url}`);
  }
});
