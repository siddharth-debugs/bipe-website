# Placement data — design-system pipeline

This folder is the **single point of input** for every placement
number on the BIPE website (the alumni directory, the homepage
stats strip, the /placements page hero, the Schema.org JSON-LD,
the SEO meta descriptions — all of them).

The flow:

```
data/source/all-placed-students.xlsx          ← TPO writes here
              ↓ scripts/parse-placement-xlsx.py
lib/alumni-manifest.json                       ← parsed manifest
              ↓ lib/placement-stats.ts
PLACEMENT_STATS / PLACEMENT_VERIFIED constants
              ↓ named-import everywhere
/alumni · /placements · homepage · Schema.org · meta tags
```

## How to update placement numbers everywhere

1. **Replace the XLSX**

   Drop the new TPO-maintained file into this folder, named
   `all-placed-students.xlsx`. The parser expects the same row
   structure as the previous file:

   - A **drive header row** for each recruiter visit. Column A
     contains the company name (with or without a leading
     "Company Name-" prefix). Column C contains "date of Drive-…"
     or has the date in some other form.
   - One **student data row** per placed student following each
     drive header. Column A is the s.no, B is the name, C is the
     branch (with year in parens like "Electrical Engg-(2017)"),
     D is the contact number.

2. **Run the parser**

   ```bash
   python3 scripts/parse-placement-xlsx.py
   ```

   This rewrites `lib/alumni-manifest.json` with the new totals,
   drives, alumni rows, and the canonical recruiter leaderboard.
   The console output shows the new headline numbers so you can
   sanity-check before committing.

3. **Verify the build**

   ```bash
   npm run build
   ```

   Every consumer of `lib/placement-stats.ts` will automatically
   pick up the new numbers. No grep-for-1,331 is needed.

4. **Commit**

   ```bash
   git add data/source/all-placed-students.xlsx \
           lib/alumni-manifest.json
   git commit -m "Refresh placement data — Q… 2026"
   ```

## What `lib/placement-stats.ts` exports

- `PLACEMENT_STATS` — the combined public constants. Use this on
  hero strips, stat tiles, copy.
- `PLACEMENT_VERIFIED` — strict data-derived numbers. Use these on
  Schema.org JSON-LD, admin dashboards, anywhere you need a
  number you can defend down to a row in the XLSX.
- `PLACEMENT_CANONICAL` — manual override block. Currently only
  holds `totalRecruiters: 44` (the marketing claim — exceeds the
  29 distinct single-recruiter companies because the TPO knows
  about recruiters folded into multi-recruiter pool drives).

## Tweaking the parser

If the TPO ever changes the XLSX shape (different column order,
new "Status" column for joined/offered, etc.), edit
`scripts/parse-placement-xlsx.py` — specifically:

- `parse_xlsx()` — the main loop that walks the sheet.
- `extract_company_and_date()` — drive-header row parsing.
- `canonicalize_recruiter()` — the recruiter-name dedupe table.
  Add new patterns at the top (first match wins).
- `normalize_branch()` — branch-name normalisation.

Run the script after every edit; the console output is the
correctness check.
