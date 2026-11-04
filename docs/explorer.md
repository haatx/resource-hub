# Explore Houston's Nonprofit Arts Sector

`explore.html` turns SMU DataArts' *Financial and Operational Profile of the Nonprofit Arts Sector in Houston, TX* into a page of selectable figures. A visitor picks Overall, a discipline, or a budget size, and five section cards update together: sector profile, funding and financial health, workforce, audience reach, and facilities and space.

This file covers how it's built, the data schema, and how to update the figures from a new report.

## Files

| File | What it is |
|---|---|
| `explore.html` | The page. Inline CSS and JavaScript, no build step, like `index.html`. |
| `data/smu-houston-profile.js` | **The canonical data.** Every figure, label, definition, note, and the source metadata. Edited by hand. |
| `data/smu-houston-summaries.js` | HAA's plain-language findings for every view and section, with the claims each one makes. Edited by hand. |
| `data/smu-houston-profile.csv` | Generated from the data file. Offered on the page as a download. |
| `docs/smu-houston-profile-inventory.md` | Generated from the data file. Every statistic with its source page. |
| `scripts/build-smu-profile.js` | Writes the CSV and the inventory from the data file. |
| `scripts/check-explorer.js` | Checks the page against the data file for all nine views. |

The scripts need Node (any current version) and no packages. Nothing in them runs on the live site.

## How the page works

- **Data loading.** `explore.html` loads `data/smu-houston-profile.js` with a plain `<script>` tag. The file assigns one global, `window.SMU_HOUSTON_PROFILE`. There's no `fetch()`, so the page works when opened straight from disk (`file://`) as well as on GitHub Pages. No local server is needed.
- **One selector.** A three-part control picks the mode (Overall, By discipline, By budget size), and a second row of chips picks the group. Both are native radio buttons, so Tab moves between the two groups and arrow keys move within one. Discipline and budget size are alternative breakdowns; they never combine. A polite live region announces the selected group and its size.
- **The URL.** The selected view is written to `?view=<id>` with `history.replaceState` (guarded for `file://`). Other query parameters are kept. A missing or unknown `view` falls back to Overall. View ids come from the data file: `overall`, `performing`, `visual`, `other`, `under-250k`, `250k-1m`, `1m-3m`, `3m-10m`, `10m-plus`. The page has its own URL, so it never meets the directory's `syncURL()` on `index.html`.
- **Cards.** Each card opens with a snapshot: a self-contained frame holding a finding, why it matters, one picture, up to four supporting figures, and its own definitions, group sizes, and source. It's built so a screenshot of the frame can stand alone. The expandable full-figures table sits below the frame. The `CARDS` list in the script decides which metrics each card shows. That list is the only part of the page tied to particular metrics; figures are read from the data file.
- **Summaries.** `data/smu-houston-summaries.js` holds one finding and one "why it matters" line per view and section, 45 pairs in all. They're HAA's sentences, not SMU DataArts', and each frame says so. Three rules keep them honest:
  - No figure is typed. Each is a token such as `{h:local_gov_pct_expenses}` that reads the data file through `val()`.
  - Each entry lists the `claims` its wording makes, such as "above the benchmark" or "highest of any budget size." `scripts/check-explorer.js` tests every claim, so a new report can't leave a false sentence behind.
  - "Why it matters" stays within what the report supports: a plain restatement, another published figure, or a simple implication. No outside facts and no causal claims. Comparisons use "vs." or "compared with"; "close to" means within one unit; better/worse framing fails the check.
- **Attendance in sentences.** Summaries spell attendance out, so `61K` reads `61,000`. The page takes the published value, multiplies by 1,000, and marks the element `long`; the check recomputes it. Pictures, supporting figures, and the full-figures table print the report's `61K`.
- **Rendering.** Rendering is a set of pure functions that turn the data and a view id into HTML strings. Every figure goes through one function, `val()`, which writes the published display string and tags the element with its record (`data-m`, `data-g`, `data-c`, `data-v`, `data-s`). That's what lets `scripts/check-explorer.js` run the page's own code in Node and compare every figure with the data file.
- **Missing data.** Three cases, each with fixed wording, and none ever falls back to an overall figure:
  - "Not reported for this category": the metric's `coverage` doesn't include the view's mode.
  - "Not labeled in the report": a segment is drawn in the report's chart, but no value is printed.
  - "Not shown in the report": no segment is drawn for that category.
- **Pictures.** Every picture counts in squares, drawn as inline SVG with every value printed as text. No library is used. A square always stands for one thing, and the caption says what: one organization, $1 of every $100 in average expenses, 1 in every 100 organizations, or 1,000 in attendance. Squares are never scaled to fit a value, and the check confirms each count matches its figure.
  - A figure the report doesn't give fills no squares, so nothing is back-solved from 100%. Rows that sum to 99% or 101% need no adjustment, because each part has its own hundred squares.
  - The picture sits on a navy plate, where every section's accent color clears 3:1. Houston is the accent color; the national benchmark is a lighter neutral. Every value is labeled in text, so color is never the only signal.
- **Group size.** On all five cards, every view shows "Based on a group of [n] Houston and [n] national benchmark organizations." followed by who the two groups are. On the four data cards, when the Houston group has fewer than `SMALL_GROUP` (20) organizations, the card adds: "A small group: these averages come from a group of [n] Houston organizations, and one organization can move them substantially."
- **Band labels.** The report prints `$250k`. The page writes `$250K` to match `$1M`, in `label` and `componentLabels`. `reportLabel` keeps the report's spelling.
- **Ranges.** `keepBands()` wraps budget-band labels such as `$250K-$999K` and `$1M-$2.99M` in a `white-space: nowrap` span and keeps the ordinary hyphen. It's separate from `index.html`'s `keepRanges()`, which matches digits on both sides of a hyphen only and would miss the dollar signs and the k or M.
- **Source lines.** Each snapshot's source line names the report, the publication year, the period, and the pages of every figure in the frame, all generated from the data file. The full-figures table has its own page column.
- **The PDF link.** It's built from `source.url` alone and appears in the hero and in About this data. While `source.url` is null, those two places show `source.pdfFallback` instead ("The full report isn't posted online yet. For a copy, email data@haatx.com."), with the address linked. Setting `source.url` replaces the line with the link everywhere; nothing else changes.
- **Motion.** Cards fade in and bars grow when the view changes, and the section rules draw in as on the homepage. All of it is off under `prefers-reduced-motion`, and the rules stay whole without JavaScript.

## Data schema

`window.SMU_HOUSTON_PROFILE` has these parts:

- **`source`**: report metadata.
  - `title`, `author`, `initiative`, `creditLine` (the report's credit line, verbatim), and `presentedBy`.
  - `fileName`, `fileGenerated`, `pageCount`, and `printedPageNumbers`.
  - `publicationYear` and `publicationDate` (null until SMU DataArts confirms it).
  - `url`: the single address of the report PDF on files.haatx.com. If it's ever set to null, the page falls back to `pdfFallback`.
  - `pdfFallback`: the line shown wherever the PDF link would appear while `url` is null.
  - `period`; `houston` and `national` (label, n, description, and the report's own wording); `statistic`; and `extractionNotes`.
- **`units`**: readable names for each unit code, used in the CSV and the inventory.
- **`sections`**: the five cards' ids and names, with optional card-level `note`.
- **`views`**: the nine views, each with:
  - `id`, `mode` (`overall`, `discipline`, or `budget`), `label` (used on the page), and `reportLabel` (the report's own label).
  - `cardDefinition` (disciplines) or `definition` (budget bands).
- **`metrics`**: one entry per statistic the report publishes, each with:
  - `id`, `section`, `name` (the full name), and `label` (the headline label).
  - `unit`; `precision` (the published precision, in the unit); and `coverage` (the modes the report covers).
  - `pages`; `components` (for compositions); `definition`; and optional `cardNote` and `tableNote`.
- **`componentLabels`**: display names for components.
- **`definitions.disciplineDefinitions`**: the plain-language NTEE definitions used in About this data.
- **`values`**: one record per published statistic:

  ```js
  {metric: "avg_attendance", view: "under-250k", geo: "houston", value: 7, display: "7K",
   status: "reported", period: "FY25", page: 14, note: "..."}
  ```

  - **`value`** is the published number in the metric's unit, at published precision: 3.2 means $3.2 million, and 61 means 61 thousand. Never add precision.
  - **`display`** is the string exactly as printed.
  - **`status`** is `reported`, `not-labeled`, or `not-shown`. Records that aren't `reported` have `value` and `display` set to null.
  - **`component`** is present for composition metrics.
  - **`page`** is the PDF page index.
- **`rowNotes`**: composition rows whose published values don't sum to 100%, or that have unlabeled or missing segments.

The cohort counts (`orgs_total`, `orgs_by_discipline_count`, `orgs_by_budget_count`, and their shares) live on the `overall` view. The page reads every group's n from them, so the n is never typed twice.

## Updating the figures from a new report

1. **Extract.** Read the new PDF the same way the first one was read:
   - Render every page and assign each chart value from the rendered image: legend color for the series, row or axis label for the category.
   - Use the text layer only to confirm digits.
   - Record a drawn segment with no printed value as `not-labeled`, and a category with no segment as `not-shown`. Never derive either by subtraction.
2. **Edit `data/smu-houston-profile.js`.**
   - Update `source`: title, dates, `url` (or `pdfFallback` while there's no URL), cohort sizes and descriptions, and `period`.
   - Update `values` and `rowNotes`.
   - Add or change `metrics`, `views`, or `coverage` only if the report's structure changed.
   - Keep display strings exactly as printed.
3. **Rebuild the generated files:**

   ```bash
   node scripts/build-smu-profile.js
   ```

4. **Check:**

   ```bash
   node scripts/check-explorer.js
   ```

   It must print `PASS`. It fails if any figure on any view differs from the data file, if a summary's claim no longer holds, if a picture's squares don't match its figures, if the source or cohort line leaves a frame, if the PDF link or its fallback line shows in the wrong state, if a card shows more than four headline figures or more than one picture, if a digit appears in the page's text outside a figure or data-derived text, if a band label can break at its hyphen, if the CSV or inventory is stale, or if a file has LF line endings.
5. **Reread `data/smu-houston-summaries.js`.** A failed claim tells you which sentence went wrong, but a sentence can pass and still stop being the most useful thing to say. Rewrite what needs it, and update its `claims`.
6. **Adjust `CARDS` in `explore.html`** only if the report adds or drops a metric that a card shows.
7. **Update the directory record** in `index.html` (year, summary, finding) to match.

The check confirms the page matches the data file. It can't confirm the data file matches the PDF, so the extraction in step 1 is where the care goes.

## Line endings

`index.html` and every file listed above use CRLF. `scripts/build-smu-profile.js` writes CRLF, and `scripts/check-explorer.js` fails on LF.
