# BIPE — Wikidata draft starter

Paste-ready content for creating a Wikidata Q-item for **Banaras Institute of Polytechnic & Engineering**.

Wikidata has no notability gate like Wikipedia — any verifiable entity gets a Q-item. Once published, Google's Knowledge Graph, Apple Spotlight, Bing Knowledge, ChatGPT, Perplexity, and most AI assistants will pick BIPE up as an entity with structured facts.

---

## 1. Sign in and start

1. Go to <https://www.wikidata.org/> and create an account (free, no notability check).
2. Click **Create a new item** (left sidebar).
3. Paste the fields below.

---

## 2. Top-level fields

### Label (en)

```
Banaras Institute of Polytechnic & Engineering
```

### Label (hi)

```
बनारस इंस्टीट्यूट ऑफ पॉलिटेक्निक एंड इंजीनियरिंग
```

### Description (en)

```
polytechnic institute in Phoolpur, Varanasi, Uttar Pradesh, India
```

### Description (hi)

```
उत्तर प्रदेश के वाराणसी में फूलपुर का एक पॉलिटेक्निक संस्थान
```

### Aliases (en) — add each as a separate alias

```
BIPE
BIPE Varanasi
BIPE Phoolpur
Banaras Polytechnic
BIPE Gajokhar
```

### Aliases (hi)

```
बीआईपीई
बीआईपीई वाराणसी
```

---

## 3. Statements — paste these one at a time

For each row: click **+ add statement**, search the property name (left column), then enter the value (right column). Add the reference URL when prompted ("+ add reference" → "reference URL P854" → paste the source URL).

### Identity & type

| Property | Value | Reference URL |
|---|---|---|
| `P31` instance of | **polytechnic** (Q3914) | https://www.bipevns.org/about |
| `P31` instance of | **educational institution** (Q2385804) | https://www.bipevns.org/about |

### Location

| Property | Value | Reference URL |
|---|---|---|
| `P17` country | **India** (Q668) | https://www.bipevns.org/contact |
| `P131` located in administrative territorial entity | **Varanasi district** (Q11058) — search to confirm exact Q-item | https://urise.up.gov.in/poly/4455 |
| `P276` location | **Varanasi** (Q1361) | https://www.bipevns.org/contact |
| `P281` postal code | `221206` | https://www.bipevns.org/contact |
| `P969` located at street address | `Village Gajokhar, Post Parsara, Phoolpur, Varanasi 221206, Uttar Pradesh` | https://www.bipevns.org/contact |
| `P625` coordinates | `25.53203° N, 82.84361° E` (from GPS-tagged admission-desk photo, May 2026) | self |

### Names

| Property | Value | Reference URL |
|---|---|---|
| `P1448` official name (en) | `Banaras Institute of Polytechnic & Engineering` | https://facilities.aicte-india.org/dashboard/pages/dashboardaa.php |
| `P1448` official name (hi) | `बनारस इंस्टीट्यूट ऑफ पॉलिटेक्निक एंड इंजीनियरिंग` | https://www.bipevns.org/ |

### Affiliation & approval

| Property | Value | Reference URL |
|---|---|---|
| `P1027` conferred by (for approval) | **All India Council for Technical Education** (Q1357113) | https://facilities.aicte-india.org/dashboard/pages/dashboardaa.php |
| `P1416` affiliation | **Board of Technical Education, Uttar Pradesh** — search Wikidata; create as Q-stub if missing | https://bteup.ac.in/ |

### Founding

| Property | Value | Reference URL |
|---|---|---|
| `P571` inception | `2010` (year — earliest cohort on record) | https://www.bipevns.org/about |

### Web presence

| Property | Value | Reference URL |
|---|---|---|
| `P856` official website | `https://www.bipevns.org/` | (self) |
| `P2002` Twitter/X username | `bipevns` | https://x.com/bipevns |
| `P2003` Instagram username | `bipevns` | https://www.instagram.com/bipevns/ |
| `P2013` Facebook ID | `bipevns` | https://www.facebook.com/bipevns/ |
| `P6634` LinkedIn company ID | `bipe-varanasi` | https://www.linkedin.com/school/bipe-varanasi/ |

### External identifiers

There may not be a dedicated AICTE/BTEUP property yet on Wikidata. If you can't find one, skip these — they live on the official site already.

| Property | Value | Notes |
|---|---|---|
| (none for AICTE) | AICTE Permanent ID: `1-488233171` | Add as a qualifier to `P1027` instead, using `P217` inventory number |
| (none for BTEUP) | BTEUP College Code: `4455` | Add as a qualifier to `P1416` using `P217` |
| (none for AISHE) | AISHE registered (Dept of Higher Education, MoE) | Skip until AISHE Code property exists on Wikidata |

---

## 4. References to cite (link these from the statements above)

Use these URLs whenever Wikidata asks for "reference URL" (P854):

| URL | What it verifies |
|---|---|
| https://www.bipevns.org/ | Self-declared facts |
| https://www.bipevns.org/about | Founding year, branch list, address |
| https://www.bipevns.org/contact | Phone, address, email |
| https://www.bipevns.org/approvals | Compiled list of approvals + verify-on-portal links |
| https://facilities.aicte-india.org/dashboard/pages/dashboardaa.php | AICTE approval status |
| https://bteup.ac.in/ | BTEUP affiliation |
| https://aishe.gov.in/ | AISHE registration |
| https://urise.up.gov.in/poly/4455 | UP government polytechnic portal listing |

Optional press references (already shipped on /about): once Wikidata pulls these in as references, the entity becomes harder to dispute.

| Press clipping | Date | What it covers |
|---|---|---|
| Hindustan — *बनारस इंस्टीट्यूट में 'स्पर्धा' का आरंभ* | 25 Feb 2020 | Spardha sports week launch |
| Amar Ujala — *कबड्डी: रेड ने यलो हाउस को किया पराजित* | 26 Feb 2020 | Spardha kabaddi final |
| Aaj — *स्पर्धा के विजेताओं को किया गया पुरस्कृत* | 8 Mar 2020 | Spardha awards ceremony |
| Gandiv — *टेक्नोफेस्ट-2020 में भावी इंजीनियरों ने दिखायी अपनी प्रतिभा* | 7 Mar 2020 | Technofest project fair |
| Janmukh — *'टेक्नोफेस्ट 2020' में भावी इंजीनियरों ने दिखाई अपनी प्रतिभा* | 7 Mar 2020 | Technofest |
| Jansandesh Times — *बीआईपी में आन लाइन कैम्पस सेलेक्शन* | 9 Oct 2020 | HFCL placement drive |

Cite by referring to the date and publication; physical clippings are linkable via the /about page section. URL: https://www.bipevns.org/about#in-the-press

---

## 5. QuickStatements format (advanced — for batch import)

If you'd rather batch-import via the QuickStatements tool (<https://quickstatements.toolforge.org/>), paste this. **Replace `LAST` after creating the item, OR use `CREATE` at the top to make a new item:**

```
CREATE
LAST	Len	"Banaras Institute of Polytechnic & Engineering"
LAST	Lhi	"बनारस इंस्टीट्यूट ऑफ पॉलिटेक्निक एंड इंजीनियरिंग"
LAST	Den	"polytechnic institute in Phoolpur, Varanasi, Uttar Pradesh, India"
LAST	Dhi	"उत्तर प्रदेश के वाराणसी में फूलपुर का एक पॉलिटेक्निक संस्थान"
LAST	Aen	"BIPE"
LAST	Aen	"BIPE Varanasi"
LAST	Aen	"BIPE Phoolpur"
LAST	Aen	"BIPE Gajokhar"
LAST	P31	Q3914	S854	"https://www.bipevns.org/about"
LAST	P31	Q2385804	S854	"https://www.bipevns.org/about"
LAST	P17	Q668	S854	"https://www.bipevns.org/contact"
LAST	P276	Q1361	S854	"https://www.bipevns.org/contact"
LAST	P281	"221206"	S854	"https://www.bipevns.org/contact"
LAST	P969	en:"Village Gajokhar, Post Parsara, Phoolpur, Varanasi 221206, Uttar Pradesh"	S854	"https://www.bipevns.org/contact"
LAST	P625	@25.53203/82.84361	S854	"https://www.bipevns.org/contact"
LAST	P1448	en:"Banaras Institute of Polytechnic & Engineering"	S854	"https://facilities.aicte-india.org/dashboard/pages/dashboardaa.php"
LAST	P1448	hi:"बनारस इंस्टीट्यूट ऑफ पॉलिटेक्निक एंड इंजीनियरिंग"	S854	"https://www.bipevns.org/"
LAST	P1027	Q1357113	S854	"https://facilities.aicte-india.org/dashboard/pages/dashboardaa.php"
LAST	P571	+2010-01-01T00:00:00Z/9	S854	"https://www.bipevns.org/about"
LAST	P856	"https://www.bipevns.org/"
LAST	P2002	"bipevns"	S854	"https://x.com/bipevns"
LAST	P2003	"bipevns"	S854	"https://www.instagram.com/bipevns/"
LAST	P2013	"bipevns"	S854	"https://www.facebook.com/bipevns/"
LAST	P6634	"bipe-varanasi"	S854	"https://www.linkedin.com/school/bipe-varanasi/"
```

Note on QuickStatements:
- `S854` is "reference URL" — attached to the preceding statement.
- `P571` inception uses `/9` precision = year only (so 2010-01-01 is treated as "the year 2010").
- `P625` coordinates use `@lat/lng` form.
- If `Q11058` (Varanasi district) or BTEUP's Q-item don't yet exist when you check, leave those lines out.

---

## 6. After creating the item

1. **Note the Q-number** Wikidata assigns (e.g., Q12345678).
2. **Wait 48 hours** — Google's knowledge graph, Bing entity search, and downstream LLM crawlers (ChatGPT, Perplexity, Claude) start ingesting Wikidata changes within a day or two.
3. **Optionally start a Wikipedia article** — once the Q-item is solid, a Wikipedia article that links to it becomes far easier to land. Use the press clippings + AICTE approval + BTEUP affiliation as the citations.

---

## 7. What this unlocks for SEO

- **Google Knowledge Panel** — Google often auto-generates a knowledge panel for institutions with a Wikidata entry + Wikipedia article.
- **Bing Entity Search** — Bing pulls structured data from Wikidata directly.
- **AI assistants** — ChatGPT, Claude, Perplexity, Gemini all use Wikidata as a primary entity source when answering questions about institutions. A BIPE Wikidata entry means accurate AI-generated answers about location, affiliations, branches, and founding year.
- **Schema.org `sameAs` link** — Once you have a Q-number, add it to `lib/data.ts > DATA.social` so the homepage's schema.org JSON-LD includes the Wikidata URL in `sameAs`. This is a direct signal to Google: "this site is the entity at Wikidata:Qxxxxxxx."
