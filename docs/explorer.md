# Explore Houston's Nonprofit Arts Sector

`explore.html` turns SMU DataArts' *Financial and Operational Profile of the Nonprofit Arts Sector in Houston, TX* into a page of selectable figures in two layers. A visitor picks Overall, a discipline, or a budget size. The first layer is one frame with four figures, each beside its national benchmark, and a Copy button for each. The second, behind "See all the figures", is five section cards with every figure: sector profile, funding and financial health, workforce, audience reach, and facilities and space.

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

The page has two layers. The first is one frame for the selected view: four figures, each beside its national benchmark, that anyone can read in a minute, screenshot for a slide, or copy into a grant application. The second is the five section cards with every figure, closed until a visitor opens it. Nothing about the data differs between the two.

- **Data loading.** `explore.html` loads `data/smu-houston-profile.js` with a plain `<script>` tag. The file assigns one global, `window.SMU_HOUSTON_PROFILE`. There's no `fetch()`, so the page works when opened straight from disk (`file://`) as well as on GitHub Pages. No local server is needed.
- **One selector.** A three-part control picks the mode (Overall, By discipline, By budget size), and a second row of chips picks the group. Both are native radio buttons, so Tab moves between the two groups and arrow keys move within one. Discipline and budget size are alternative breakdowns; they never combine. A status line announces the selected group and its size to screen readers. It's visually hidden, because the frame states the group on screen.
- **The URL.** The selected view is written to `?view=<id>` with `history.replaceState` (guarded for `file://`). Other query parameters are kept. A missing or unknown `view` falls back to Overall. View ids come from the data file: `overall`, `performing`, `visual`, `other`, `under-250k`, `250k-1m`, `1m-3m`, `3m-10m`, `10m-plus`. The page has its own URL, so it never meets the directory's `syncURL()` on `index.html`.
- **The hero.** The title, a two-sentence standfirst whose figures come from the data file, and the source line. "Back to all resources" is a quiet link above the title, so the selector is the one thing to do before a view is chosen.
- **Rendering.** Rendering is a set of pure functions that turn the data and a view id into HTML strings: `renderFrame()`, `renderCards()`, `copySentences()`, and the text around them. Every figure on the page goes through one function, `val()`, which writes the published display string and tags the element with its record (`data-m`, `data-g`, `data-c`, `data-v`, `data-s`). That's what lets `scripts/check-explorer.js` run the page's own code in Node and compare every figure with the data file.
- **Missing data.** Three cases, each with fixed wording, and none ever falls back to an overall figure:
  - "Not reported for this category": the metric's `coverage` doesn't include the view's mode.
  - "Not labeled in the report": a segment is drawn in the report's chart, but no value is printed.
  - "Not shown in the report": no segment is drawn for that category.
- **Attendance, spelled out.** The frame, the copy sentences, and the card summaries spell attendance out, so `61K` reads `61,000`. The page takes the published value, multiplies by 1,000, and marks the element `long`; the check recomputes it. Pictures, supporting figures, and the full-figures tables print the report's `61K`.
- **Band labels.** The report prints `$250k`. The page writes `$250K` to match `$1M`, in `label` and `componentLabels`. `reportLabel` keeps the report's spelling.
- **Ranges.** `keepBands()` wraps budget-band labels such as `$250K-$999K` and `$1M-$2.99M` in a `white-space: nowrap` span and keeps the ordinary hyphen. It's separate from `index.html`'s `keepRanges()`, which matches digits on both sides of a hyphen only and would miss the dollar signs and the k or M.
- **The CSV and the report.** "Download the data (CSV)" and "Read the full report (PDF)" sit beside "See all the figures", outside the second layer, so they stay in view while it's closed. The credit section also links the CSV, and About this data also links the report.
- **The PDF link.** It's built from `source.url` alone and appears beside "See all the figures" and in About this data. While `source.url` is null, those two places show `source.pdfFallback` instead ("The full report isn't posted online yet. For a copy, email data@haatx.com."), with the address linked. Setting `source.url` replaces the line with the link everywhere; nothing else changes.
- **Fonts.** Roobert loads from files.haatx.com, which allows only `https://haatx.github.io`. Opened from disk or a local server, the page falls back to the system font unless Roobert is installed on that computer.
- **Motion.** The frame's figures and the cards fade in when the view changes, bars grow, and the section rules draw in as on the homepage. All of it is off under `prefers-reduced-motion`, and the rules stay whole without JavaScript.

## The first layer: the frame

The frame sits directly under the selector. Its parts come in this order:

1. **The group:** the view's tag ("All organizations", "Discipline: Performing Arts", "Budget size: Under $250K") as an h3, FY25 once at the right, and the group-size line: "Based on a group of [n] Houston and [n] national benchmark organizations."
2. **The small-group note,** for views whose Houston group has fewer than `SMALL_GROUP` (20) organizations: "A small group: these figures come from a group of [n] Houston organizations, and one organization can move them substantially." It says "figures", not "averages", because the frame mixes kinds: attendance is an average, the rent figure is a share of organizations, and local government support and personnel are shares of spending. The same note, worded the same way, appears on the four data cards in the second layer. Today it covers Visual Arts (17), $1M-$2.99M (19), $3M-$9.99M (12), and $10M+ (12).
3. **Four figures,** the same four for every view, in the order of the `FRAME` list in the script. Each Houston number sits inside its phrase, with the national figure on a smaller line beneath:

   | Metric | Before the number | After the number | Beneath |
   |---|---|---|---|
   | `local_gov_pct_expenses` | Local government support equals | of what they spend | Nationally: [n] |
   | `personnel_pct_expenses` | | of spending goes to staff and contract workers | Nationally: [n] |
   | `avg_attendance` | Each organization averages | in attendance | Nationally: [n] |
   | `primary_facility`, component `rent` | | rent their main space | Nationally: [n] |

   "Nationally" is `source.national.label`. All four are reported for both groups in all nine views. If a new report drops one, the check fails; the frame then needs a decision, never a stand-in figure.
4. **The source,** one line inside the frame, so a screenshot is citable: author, title, publication year, the pages of every figure in the frame (the group sizes included), and who the two groups are, "Houston: [source.houston.description], not a census. National benchmark: [source.national.benchmark]." This is the one place on the page, besides About this data, where the full cohort and benchmark description appears.

How it's drawn:

- **One piece.** A thin navy border holds the group, the figures, and the source, so a screenshot of the frame needs nothing around it. The frame uses navy and the page's text colors only. The section colors belong to the cards and pictures, where they have a key; the check fails if one appears in the frame.
- **By width.** At 1024px and wider the four figures sit in a row, and CSS subgrid puts the four numbers on one line. On tablets they make two rows of two. On phones each figure reads as a sentence: the phrase before the number gets its own line, the number runs into the words after it, and the national figure sits underneath.
- **On the first screen.** At 1440 x 900 the selector and the whole frame, source line included, fit without scrolling for every view. On a 375px phone, the selector and the frame's group line are on the first screen.
- **Screen readers.** The frame is a region named by its tag. Each figure is a list item holding one sentence for screen readers, such as "Local government support equals 6% of what they spend. Nationally: 8%." The drawn pieces are hidden from screen readers. That hidden sentence is also left out of mouse selection, so copying the frame's text doesn't paste each figure twice.

## Copy sentences

Under the frame, outside its border, is one quiet text button per figure: "Local government support", "Staff and contract workers", "Attendance", and "Renting their main space" (each figure's `name` in `FRAME`). A button copies one plain-text sentence for the current view, a space, and a source sentence, ready to paste into a grant application. For Under $250K, local government support:

> For Houston nonprofit arts organizations with budgets under $250K, local government support equals 12% of what they spend, compared with 14% nationally (FY25). Source: SMU DataArts, Financial and Operational Profile of the Nonprofit Arts Sector in Houston, TX (2026). Houston: 93 organizations that applied for Houston Arts Alliance operating support. National: 657 organizations in SMU DataArts FY25 Cultural Data Profiles.

How they're built (`copySentences()`):

- **The four sentences** come from each figure's `copy` template in `FRAME`, in this order:
  - "For [group], local government support equals [h] of what they spend, compared with [n] nationally (FY25)."
  - "For [group], [h] of spending goes to staff and contract workers, compared with [n] nationally (FY25)."
  - "For [group], attendance averages [h] per organization, compared with [n] nationally (FY25)."
  - "Among [group], [h] rent their main space, compared with [n] nationally (FY25)."

  The group comes first so a long group name reads cleanly, and no sentence opens with a number. Attendance is spelled out.
- **The group** is named in full, because the sentence travels without the frame:
  - Overall: "Houston nonprofit arts organizations".
  - Budget sizes: built from each view's `label`: "with budgets under $250K", "of $250K to $999K", "of $1M to $2.99M", "of $3M to $9.99M", "of $10M or more". A label of a new shape stops the page with an error instead of writing a wrong phrase.
  - Disciplines, from `COPY_GROUP` in the script: "performing arts organizations"; "visual arts and media organizations", because the report's Visual Arts includes media and communications (NTEE A3); and "arts and culture organizations outside the performing arts, visual arts, and media" for Other Arts, the report's catch-all. Its examples are in About this data.
- **The source sentence** names both groups, built from the data file: the report's author, title, and year; "Houston: [n] organizations that applied for Houston Arts Alliance operating support."; and "National: [n] organizations in [source.national.benchmark]." A sentence pasted on its own loses the frame, and "nationally" alone would read like a national average.
- **Nothing is typed.** Every figure and group size comes from the data file. Where either figure isn't reported, `copySentences()` returns null and the figure's button is hidden.

How the buttons behave:

- **Copied.** A click writes the text with `navigator.clipboard.writeText()`. The button reads "Copied", with a check, for a few seconds, and a polite live region announces it. Both labels share one grid cell, so the row doesn't shift.
- **When the clipboard is refused.** Some browsers refuse on `file://`. The sentence then appears in a text box under the buttons, focused and selected, with a line saying to press Ctrl+C, or Cmd+C on a Mac. Changing the view closes it.
- **Names.** Screen readers hear each button as "Copy: Local government support" and so on, inside a group named "Copy a figure as a sentence, with its source:". On phones the four buttons become full-width rows.

## The second layer: the cards

- **See all the figures.** One button under the frame opens the second layer: the five section cards, closed by default. It's a button with `aria-expanded` and `aria-controls`, and its plus turns to a close mark while the layer is open. Once a visitor opens it, it stays open as they change the view, because only the cards inside it are redrawn. Open Full figures tables keep their state the same way.
- **Cards.** Each card opens with a snapshot: a finding, a second sentence on what it means, one picture, up to four supporting figures, the card's own definitions and notes, the small-group note where it applies, and a one-line source. The expandable full-figures table sits below the snapshot. The `CARDS` list in the script decides which metrics each card shows. That list and `FRAME` are the only parts of the page tied to particular metrics; figures are read from the data file.
- **One-line sources.** Each card ends with "Source: SMU DataArts (2026), FY25 data, pp. [pages]. Summary by Houston Arts Alliance." The pages are those of every figure on the card, and the credit stays because the cards' sentences are HAA's words about SMU DataArts' figures. The group size and the full cohort and benchmark description aren't repeated on the cards; the frame states them once. The full-figures table has its own page column.
- **Summaries.** `data/smu-houston-summaries.js` holds one finding (`lead`) and one second sentence (`why`) per view and section, 45 pairs in all. They're HAA's sentences, not SMU DataArts', and each card's source line says so. The second sentence follows the lead as plain text, with no label. Three rules keep them honest:
  - No figure is typed. Each is a token such as `{h:local_gov_pct_expenses}` that reads the data file through `val()`.
  - Each entry lists the `claims` its wording makes, such as "above the benchmark" or "highest of any budget size." `scripts/check-explorer.js` tests every claim, so a new report can't leave a false sentence behind.
  - The second sentence stays within what the report supports: a plain restatement, another published figure, or a simple implication. No outside facts and no causal claims. Comparisons use "vs." or "compared with"; "close to" means within one unit; better/worse framing fails the check.
- **Pictures.** Every picture counts in squares, drawn as inline SVG with every value printed as text. No library is used. A square always stands for one thing, and the caption says what: one organization, $1 of every $100 in average expenses, 1 in every 100 organizations, or 1,000 in attendance. Squares are never scaled to fit a value, and the check confirms each count matches its figure.
  - A figure the report doesn't give fills no squares, so nothing is back-solved from 100%. Rows that sum to 99% or 101% need no adjustment, because each part has its own hundred squares.
  - The picture sits on a navy plate, where every section's accent color clears 3:1. Houston is the accent color; the national benchmark is a lighter neutral. Every value is labeled in text, so color is never the only signal.

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

   It must print `PASS`. It fails if any figure on any view differs from the data file, whether in the frame, a copy sentence, or a card; if a summary's claim no longer holds; if a picture's squares don't match its figures; if the frame loses one of its four figures, its group line, its small-group note, or its source line, or picks up a section color; if a copy sentence's figures, group size, or source sentence don't match; if a card's one-line source is wrong, or the cohort description or group line comes back to a card; if the second layer stops starting closed, or the CSV and report links move inside it; if the PDF link or its fallback line shows in the wrong state; if a card shows more than four headline figures or more than one picture; if a digit appears in the page's text outside a figure or data-derived text; if a band label can break at its hyphen; if a function in the page script is declared twice; if the CSV or inventory is stale; or if a file has LF line endings.
5. **Reread `data/smu-houston-summaries.js`.** A failed claim tells you which sentence went wrong, but a sentence can pass and still stop being the most useful thing to say. Rewrite what needs it, and update its `claims`.
6. **Adjust `CARDS` or `FRAME` in `explore.html`** only if the report adds or drops a metric that a card or the frame shows. If one of the frame's four figures goes missing for a view, the check fails; decide what the frame shows instead, rather than filling the gap.
7. **Update the directory record** in `index.html` (year, summary, finding) to match.

The check confirms the page matches the data file. It can't confirm the data file matches the PDF, so the extraction in step 1 is where the care goes.

## Line endings

`index.html` and every file listed above use CRLF. `scripts/build-smu-profile.js` writes CRLF, and `scripts/check-explorer.js` fails on LF.
