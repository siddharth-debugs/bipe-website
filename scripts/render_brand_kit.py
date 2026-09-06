"""
Generate the BIPE brand kit as a single-page 4:3 PDF using reportlab.

Run from project root:
    python scripts/render_brand_kit.py

Produces:
    public/bipe-brand-kit.pdf  (1600 × 1200 pt — 4:3 aspect)

Layout:
    - Top brand-gradient ribbon
    - Header (eyebrow + wordmark + serif italic full name + meta)
    - Left column  : logo lockup + identity meta
    - Right column : primary palette + system palette + typography
    - Footer strip
"""

from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import simpleSplit  # noqa: F401  (kept for future copy-fitting)
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF

# ─────────────────────────────────────────────────────────────────────────────
# Paths
# ─────────────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
LOGO_SVG = PUBLIC / "bipe-logo.svg"
OUT_PDF = PUBLIC / "bipe-brand-kit.pdf"

# ─────────────────────────────────────────────────────────────────────────────
# Page geometry (4:3)
# ─────────────────────────────────────────────────────────────────────────────
W, H = 1600, 1200            # points (1 pt = 1/72 in)
MARGIN = 40                  # outer padding to inner card
INNER_X = MARGIN
INNER_Y = MARGIN
INNER_W = W - 2 * MARGIN
INNER_H = H - 2 * MARGIN

# ─────────────────────────────────────────────────────────────────────────────
# Design tokens (from app/globals.css + logo)
# ─────────────────────────────────────────────────────────────────────────────
BRAND_BLUE = HexColor("#005FFF")     # logo dome
SAFFRON    = HexColor("#FF9601")     # logo band
DEEP_NAVY  = HexColor("#111D2F")     # logo wordmark
STEEL_GREY = HexColor("#C2C7CE")     # logo gear ring
ACCENT     = HexColor("#F0B429")     # site accent (gold)

INK   = HexColor("#0A1A3F")
INK_2 = HexColor("#2B3656")
INK_3 = HexColor("#5A6280")
INK_4 = HexColor("#8A92AC")
PAPER = HexColor("#F6F4EE")
PAPER_2 = HexColor("#EFEDE5")
LINE  = HexColor("#E4E2DA")
LINE_2 = HexColor("#D4D2C8")

# ─────────────────────────────────────────────────────────────────────────────
# Font families — use Helvetica/Times/Courier (PDF built-ins) so the file
# works everywhere without embedding additional fonts.
# ─────────────────────────────────────────────────────────────────────────────
F_SANS_BOLD = "Helvetica-Bold"
F_SANS = "Helvetica"
F_SERIF_ITALIC = "Times-Italic"
F_MONO = "Courier"
F_MONO_BOLD = "Courier-Bold"

# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────
def round_rect(c: Canvas, x, y, w, h, r=10, fill=None, stroke=None, stroke_w=1):
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(stroke_w)
    c.roundRect(x, y, w, h, r, stroke=1 if stroke else 0, fill=1 if fill else 0)


def text(c: Canvas, x, y, s, font=F_SANS, size=12, color=INK, anchor="left",
         char_space=0):
    """Draw text. y is the baseline. anchor: left|center|right.
    char_space: extra letter-spacing in points (used for mono caps)."""
    c.setFont(font, size)
    c.setFillColor(color)
    if char_space:
        # Insert a small space between every character via a TextObject.
        # reportlab 4.x doesn't expose setCharSpace on Canvas directly, so
        # we use the lower-level beginText() interface which does support it.
        if anchor == "left":
            tx = x
        elif anchor == "center":
            width = c.stringWidth(s, font, size) + char_space * (len(s) - 1)
            tx = x - width / 2
        else:  # right
            width = c.stringWidth(s, font, size) + char_space * (len(s) - 1)
            tx = x - width
        to = c.beginText(tx, y)
        to.setFont(font, size)
        to.setFillColor(color)
        to.setCharSpace(char_space)
        to.textOut(s)
        c.drawText(to)
        return
    if anchor == "left":
        c.drawString(x, y, s)
    elif anchor == "center":
        c.drawCentredString(x, y, s)
    elif anchor == "right":
        c.drawRightString(x, y, s)


def gradient_ribbon(c: Canvas, x, y, w, h):
    """Draw the brand→saffron→accent ribbon as discrete steps (PDF gradients
    are doable but stepwise interpolation is simpler and renders identically
    in every viewer)."""
    stops = [
        (0.00, BRAND_BLUE),
        (0.55, BRAND_BLUE),
        (0.78, SAFFRON),
        (1.00, ACCENT),
    ]
    steps = 240
    for i in range(steps):
        t = i / (steps - 1)
        # Find segment
        for j in range(len(stops) - 1):
            t0, c0 = stops[j]
            t1, c1 = stops[j + 1]
            if t0 <= t <= t1:
                local = (t - t0) / max(t1 - t0, 1e-6)
                r = c0.red + (c1.red - c0.red) * local
                g = c0.green + (c1.green - c0.green) * local
                b = c0.blue + (c1.blue - c0.blue) * local
                col = HexColor(_rgb_to_hex(r, g, b))
                break
        c.setFillColor(col)
        c.rect(x + (w * i / steps), y, (w / steps) + 0.5, h, stroke=0, fill=1)


def _rgb_to_hex(r, g, b) -> str:
    return "#{:02X}{:02X}{:02X}".format(int(round(r * 255)),
                                        int(round(g * 255)),
                                        int(round(b * 255)))


def eyebrow(c: Canvas, x, y, label, color=BRAND_BLUE, char_space=2.4):
    text(c, x, y, label.upper(), font=F_MONO_BOLD, size=11,
         color=color, char_space=char_space)


# ─────────────────────────────────────────────────────────────────────────────
# Sections
# ─────────────────────────────────────────────────────────────────────────────
def draw_background(c: Canvas):
    # Page bg
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # Top gradient ribbon (8pt)
    gradient_ribbon(c, 0, H - 8, W, 8)

    # Inner white card
    round_rect(c, INNER_X, INNER_Y, INNER_W, INNER_H,
               r=14, fill=white, stroke=LINE)


def draw_header(c: Canvas):
    # PDF coords are bottom-up. Anchor at top.
    top = H - 80      # baseline of eyebrow
    eyebrow(c, 80, top, "§ BRAND KIT · V1")

    # BIPE wordmark
    text(c, 80, top - 48, "BIPE", font=F_SANS_BOLD, size=46, color=INK)

    # Full name
    text(c, 80, top - 80, "Banaras Institute of Polytechnic & Engineering",
         font=F_SERIF_ITALIC, size=22, color=INK_3)

    # Right meta
    text(c, W - 80, top, "BIPEVNS.ORG", font=F_MONO_BOLD,
         size=13, color=INK_3, anchor="right", char_space=1.8)
    text(c, W - 80, top - 22, "EST. 2010 · PHOOLPUR · VARANASI",
         font=F_MONO, size=11, color=INK_4, anchor="right", char_space=1.3)

    # Divider under header
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.line(80, H - 220, W - 80, H - 220)


def draw_logo_block(c: Canvas):
    # § LOGO label
    eyebrow(c, 80, H - 260, "§ LOGO", color=INK_3)

    # Logo card
    card_x = 80
    card_y = H - 800
    card_w = 600
    card_h = 520
    round_rect(c, card_x, card_y, card_w, card_h,
               r=12, fill=white, stroke=LINE)

    # Embed SVG logo
    drawing = svg2rlg(str(LOGO_SVG))
    if drawing is not None:
        # Logo native viewBox: 2162 × 2497. Scale to fit ~280 × 460 inside card.
        target_w = 280
        target_h = 460
        scale_x = target_w / 2162
        scale_y = target_h / 2497
        scale = min(scale_x, scale_y)
        drawing.scale(scale, scale)
        # Center in card
        rendered_w = 2162 * scale
        rendered_h = 2497 * scale
        offset_x = card_x + (card_w - rendered_w) / 2
        offset_y = card_y + (card_h - rendered_h) / 2
        renderPDF.draw(drawing, c, offset_x, offset_y)

    # Card meta (top-left + bottom-right)
    text(c, card_x + 20, card_y + card_h - 24,
         "LOGO · SVG", font=F_MONO, size=10, color=INK_4, char_space=1.6)
    text(c, card_x + card_w - 20, card_y + 20,
         "VECTOR · 2162 × 2497", font=F_MONO, size=10, color=INK_4,
         anchor="right", char_space=1.4)
    text(c, card_x + 20, card_y + 20,
         "/bipe-logo.svg", font=F_MONO, size=10, color=INK_4, char_space=1.2)

    # § IDENTITY block
    eyebrow(c, 80, H - 850, "§ IDENTITY", color=INK_3)
    rows = [
        ("FOUNDED", "2010 · Phoolpur, Varanasi"),
        ("TRUST", "Purwanchal Educational Trust"),
        ("AICTE ID", "1-488233171"),
        ("JEECUP", "4455"),
    ]
    for i, (k, v) in enumerate(rows):
        y = H - 890 - i * 32
        text(c, 80, y, k, font=F_MONO, size=11, color=INK_3, char_space=1.4)
        text(c, 220, y, v, font=F_SANS, size=14, color=INK_2)


def draw_color_swatch(c: Canvas, x, y, w, h, hex_color, name, hex_label, role):
    """A 190×180 swatch: top 120pt is the color, bottom 60pt is text."""
    round_rect(c, x, y, w, h, r=10, fill=white, stroke=LINE)
    # Color top (with rounded top corners only — using filled rounded rect
    # then a white strip across the bottom is simplest).
    c.setFillColor(hex_color)
    c.roundRect(x, y + 60, w, 120, 10, stroke=0, fill=1)
    # Mask the bottom corners back to flat by overlaying a rect above the
    # text strip line.
    c.setFillColor(hex_color)
    c.rect(x, y + 60, w, 8, stroke=0, fill=1)

    # Text
    text(c, x + 14, y + 38, name, font=F_SANS_BOLD, size=13, color=INK)
    text(c, x + 14, y + 22, hex_label, font=F_MONO, size=11, color=INK_2)
    text(c, x + 14, y + 8, role, font=F_MONO, size=9, color=INK_3,
         char_space=1.4)


def draw_palette(c: Canvas):
    # Right column starts at x=720
    base_x = 720
    base_y_top = H - 260           # baseline of eyebrow

    # § PRIMARY PALETTE
    eyebrow(c, base_x, base_y_top, "§ PRIMARY PALETTE", color=INK_3)
    text(c, base_x + 800, base_y_top, "FROM LOGO · sRGB",
         font=F_MONO, size=10, color=INK_4, anchor="right", char_space=1.6)

    swatches = [
        (BRAND_BLUE, "Brand Blue", "#005FFF", "DOME"),
        (SAFFRON,    "Saffron",    "#FF9601", "BAND"),
        (DEEP_NAVY,  "Deep Navy",  "#111D2F", "WORDMARK"),
        (STEEL_GREY, "Steel Grey", "#C2C7CE", "GEAR RING"),
    ]
    sw_w = 190
    sw_h = 180
    gap = 14
    sw_y = base_y_top - 200
    for i, (col, n, hx, role) in enumerate(swatches):
        sx = base_x + i * (sw_w + gap)
        draw_color_swatch(c, sx, sw_y, sw_w, sw_h, col, n, hx, role)

    # § SYSTEM PALETTE
    sys_y_top = sw_y - 50
    eyebrow(c, base_x, sys_y_top, "§ SYSTEM", color=INK_3)
    text(c, base_x + 800, sys_y_top, "UI · BACKGROUNDS",
         font=F_MONO, size=10, color=INK_4, anchor="right", char_space=1.6)

    sys = [
        (INK,    "Ink",    "#0A1A3F · text"),
        (PAPER,  "Paper",  "#F6F4EE · bg"),
        (LINE,   "Line",   "#E4E2DA · borders"),
        (ACCENT, "Accent", "#F0B429 · highlights"),
    ]
    chip_y = sys_y_top - 70
    for i, (col, n, role) in enumerate(sys):
        cx = base_x + i * 200
        # Chip swatch (40×40)
        c.setFillColor(col)
        c.setStrokeColor(LINE if col != LINE else LINE_2)
        c.setLineWidth(1)
        c.roundRect(cx, chip_y, 40, 40, 8, stroke=1, fill=1)
        # Label
        text(c, cx + 54, chip_y + 22, n, font=F_SANS_BOLD, size=13, color=INK)
        text(c, cx + 54, chip_y + 6, role, font=F_MONO, size=10, color=INK_3)


def draw_type_card(c: Canvas, x, y, w, h, eyebrow_text, sample, sample_font,
                   sample_size, sample_color, body, body_font, footnote):
    round_rect(c, x, y, w, h, r=10, fill=white, stroke=LINE)
    text(c, x + 16, y + h - 26, eyebrow_text, font=F_MONO, size=10,
         color=INK_3, char_space=1.6)
    text(c, x + 16, y + h - 78, sample,
         font=sample_font, size=sample_size, color=sample_color)
    text(c, x + 16, y + h - 105, body, font=body_font, size=13, color=INK_2)
    text(c, x + 16, y + 16, footnote, font=F_MONO, size=10, color=INK_3)


def draw_typography(c: Canvas):
    base_x = 720
    # Pushed below the system-palette chips (which sit at y=620-660).
    head_y = H - 620
    eyebrow(c, base_x, head_y, "§ TYPOGRAPHY", color=INK_3)
    text(c, base_x + 800, head_y, "3 FAMILIES",
         font=F_MONO, size=10, color=INK_4, anchor="right", char_space=1.6)

    card_w = 260
    card_h = 170
    gap = 14
    card_y = head_y - card_h - 30

    # Sans · Geist (substitute Helvetica)
    draw_type_card(c, base_x, card_y, card_w, card_h,
                   eyebrow_text="SANS · GEIST",
                   sample="Aa Bb 01",
                   sample_font=F_SANS_BOLD, sample_size=58, sample_color=INK,
                   body="The quick brown fox jumps", body_font=F_SANS,
                   footnote="Body · UI · Headings")

    # Serif · Instrument (substitute Times Italic)
    draw_type_card(c, base_x + (card_w + gap), card_y, card_w, card_h,
                   eyebrow_text="SERIF · INSTRUMENT",
                   sample="Aa Bb 01",
                   sample_font=F_SERIF_ITALIC, sample_size=64,
                   sample_color=BRAND_BLUE,
                   body="The quick brown fox jumps", body_font=F_SERIF_ITALIC,
                   footnote="Display · accents · italic")

    # Mono · JetBrains (substitute Courier)
    draw_type_card(c, base_x + 2 * (card_w + gap), card_y, card_w, card_h,
                   eyebrow_text="MONO · JETBRAINS",
                   sample="Aa Bb 01",
                   sample_font=F_MONO_BOLD, sample_size=44,
                   sample_color=INK,
                   body="the quick brown fox", body_font=F_MONO,
                   footnote="Eyebrows · meta · code")


def draw_footer(c: Canvas):
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.line(80, 120, W - 80, 120)
    text(c, 80, 82, "BIPEVNS.ORG · BRAND KIT",
         font=F_MONO, size=11, color=INK_3, char_space=2.2)
    text(c, W / 2, 82, "FOR PRESS & PARTNERS",
         font=F_MONO, size=11, color=INK_3, anchor="center", char_space=2.2)
    text(c, W - 80, 82, "V1 · 2026",
         font=F_MONO, size=11, color=INK_3, anchor="right", char_space=2.2)


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────
def main():
    c = Canvas(str(OUT_PDF), pagesize=(W, H))
    c.setTitle("BIPE Brand Kit")
    c.setAuthor("Banaras Institute of Polytechnic & Engineering")
    c.setSubject("Logo, palette and typography reference")
    c.setKeywords("BIPE, brand, logo, palette, typography")
    c.setCreator("bipe.ac.in")

    draw_background(c)
    draw_header(c)
    draw_logo_block(c)
    draw_palette(c)
    draw_typography(c)
    draw_footer(c)

    c.showPage()
    c.save()

    size_kb = OUT_PDF.stat().st_size / 1024
    rel = OUT_PDF.relative_to(ROOT).as_posix()
    print(f"OK  {rel}  ({size_kb:.1f} KB, {W}x{H} pt, 4:3)")


if __name__ == "__main__":
    main()
