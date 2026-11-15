"""Build Pinterest pin images and per-board RSS feeds from scripts/pinterest/pins.json.

Usage (from the repo root):  python3 scripts/pinterest/build.py
- Renders public/assets/pins/<id>.png (1000x1500) for every pin that has no image yet
  (add --force to re-render all).
- Writes public/pins/<board>.xml (RSS 2.0) for every board. Pinterest auto-publishes new
  items from these feeds to the matching board (oldest first, within ~24 hours).
Numbers on pins must be computed from the calculators in public/assets/app.js, never typed by hand.
"""
import json, sys
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path
from xml.sax.saxutils import escape
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
SITE = "https://yardcompute.com"
FONT_DIRS = [Path("/usr/share/fonts/opentype/inter"), ROOT / "scripts/pinterest/fonts"]
INK = (23, 50, 77); BRAND = (23, 107, 91); DARK = (15, 81, 69); BG = (246, 248, 247)
LINE = (219, 228, 224); ACC = (234, 245, 241); MUTED = (95, 113, 130)

def font(weight, size):
    for d in FONT_DIRS:
        p = d / f"Inter-{weight}.otf"
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.truetype("DejaVuSans-Bold.ttf" if weight in ("Bold", "ExtraBold", "SemiBold") else "DejaVuSans.ttf", size)

def wrap(d, text, f, maxw):
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= maxw:
            cur = t
        else:
            lines.append(cur); cur = w
    lines.append(cur)
    return lines

def render(pin, path):
    W, H = 1000, 1500
    im = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 520], fill=BRAND)
    d.text((70, 70), pin["kicker"].upper(), font=font("Bold", 30), fill=(190, 230, 215))
    y = 125
    for ln in wrap(d, pin["heading"], font("ExtraBold", 84), 860):
        d.text((70, y), ln, font=font("ExtraBold", 84), fill="white"); y += 98
    y += 10
    for ln in wrap(d, pin["sub"], font("Medium", 34), 860):
        d.text((70, y), ln, font=font("Medium", 34), fill=(220, 240, 233)); y += 46
    head, rows = pin["columns"], pin["rows"]
    top, rh, hh = 570, 92, 86; ch = hh + len(rows) * rh
    d.rounded_rectangle([50, top, 950, top + ch], radius=26, fill="white", outline=LINE, width=2)
    d.rounded_rectangle([50, top, 950, top + hh], radius=26, fill=ACC); d.rectangle([50, top + 40, 950, top + hh], fill=ACC)
    widths = [0.42] + [0.58 / (len(head) - 1)] * (len(head) - 1)
    xs = [80]
    for w in widths[:-1]:
        xs.append(xs[-1] + w * 840)
    for i, h in enumerate(head):
        d.text((xs[i], top + 26), h, font=font("Bold", 28), fill=DARK)
    for r, row in enumerate(rows):
        yy = top + hh + r * rh
        if r:
            d.line([80, yy, 920, yy], fill=LINE, width=2)
        for i, c in enumerate(row):
            d.text((xs[i], yy + 26), c, font=font("Bold" if i else "SemiBold", 36 if i else 34), fill=INK)
    y = top + ch + 40
    for ln in wrap(d, pin["note"], font("Regular", 28), 860):
        d.text((70, y), ln, font=font("Regular", 28), fill=MUTED); y += 40
    d.rectangle([0, H - 170, W, H], fill=DARK)
    d.text((70, H - 140), "Free calculator", font=font("Medium", 30), fill=(190, 230, 215))
    d.text((70, H - 95), "yardcompute.com", font=font("Bold", 40), fill="white")
    im.save(path, optimize=True)

def main():
    force = "--force" in sys.argv
    data = json.loads((ROOT / "scripts/pinterest/pins.json").read_text(encoding="utf-8"))
    boards, pins = data["boards"], data["pins"]
    ids = set()
    for p in pins:
        assert p["id"] not in ids, f"duplicate pin id {p['id']}"; ids.add(p["id"])
        assert p["board"] in boards, f"unknown board {p['board']}"
        assert p["link"].startswith(SITE + "/"), f"link must be on {SITE}: {p['link']}"
        assert len(p["rows"]) <= 6, f"{p['id']}: at most 6 rows fit on a pin"
        img = ROOT / "public/assets/pins" / f"{p['id']}.png"
        if force or not img.exists():
            render(p, img); print("rendered", img.relative_to(ROOT))
    now = format_datetime(datetime.now(timezone.utc))
    for key, b in boards.items():
        items = sorted([p for p in pins if p["board"] == key], key=lambda p: p["date"], reverse=True)
        out = ['<?xml version="1.0" encoding="UTF-8"?>',
               '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">', "<channel>",
               f"<title>{escape(b['name'])} | YardCompute</title>", f"<link>{SITE}/</link>",
               f"<description>{escape(b['description'])}</description>", "<language>en-us</language>",
               f"<lastBuildDate>{now}</lastBuildDate>"]
        for p in items:
            img = f"{SITE}/assets/pins/{p['id']}.png"
            size = (ROOT / "public/assets/pins" / f"{p['id']}.png").stat().st_size
            pub = format_datetime(datetime.fromisoformat(p["date"] + "T00:00:00+00:00"))
            out += ["<item>", f"<title>{escape(p['title'])}</title>", f"<link>{escape(p['link'])}</link>",
                    f"<description>{escape(p['description'])}</description>",
                    f'<guid isPermaLink="false">yardcompute-pin-{p["id"]}</guid>', f"<pubDate>{pub}</pubDate>",
                    f'<enclosure url="{img}" length="{size}" type="image/png"/>',
                    f'<media:content url="{img}" medium="image" type="image/png" width="1000" height="1500"/>', "</item>"]
        out += ["</channel>", "</rss>"]
        (ROOT / "public/pins" / f"{key}.xml").write_text("\n".join(out) + "\n", encoding="utf-8")
        print("feed", f"public/pins/{key}.xml", len(items), "items")

if __name__ == "__main__":
    main()
