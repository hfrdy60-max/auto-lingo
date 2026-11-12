# Parts Batch 02 — Reconciliation Report

- Task ID: `AI1-PARTS-BATCH02-RECONCILIATION-001`
- Date: 2026-11-12
- Scope: compare `parts_batch_02.json` (repository root) with `data/parts_batch_02.json` on `main`.
- Status: `review_complete / canonical_selection_pending`
- Production impact: none. No source file was edited, deleted, merged, or promoted to verified.

## 1. Structural comparison

| Check | Root file | data/ file | Result |
|---|---:|---:|---|
| Records | 20 | 20 | Equal |
| ID range | PART-000016–PART-000035 | PART-000016–PART-000035 | Equal |
| Duplicate IDs | 0 | 0 | Equal |
| IDs missing on either side | 0 | 0 | Equal |
| Records with at least one differing field | 20 | 20 | All records differ |
| Fields that differ in every record | category_id, safety_notes | category_id, safety_notes | 2 systematic differences |
| Records whose images field differs | 4 | 4 | IDs 018, 024, 029, 030 |

Both files parse as JSON. The files are not byte-identical and must not be treated as interchangeable copies.

## 2. Record-level difference register

All 20 records have a different `category_id` and `safety_notes`.

| ID | English name | Root category | data/ category | Image difference |
|---|---|---|---|---|
| PART-000016 | Cooling Fan | CAT-COOLING | CAT-14 | No |
| PART-000017 | Oil Pump | CAT-LUBRICATION | CAT-15 | No |
| PART-000018 | Clutch | CAT-TRANSMISSION | CAT-09 | Root has a Getty search-page URL; data/ correctly replaces it with null pending a real asset |
| PART-000019 | Flywheel | CAT-TRANSMISSION | CAT-09 | No |
| PART-000020 | Timing Belt | CAT-ENGINE-TIMING | CAT-01 | No |
| PART-000021 | Timing Chain | CAT-ENGINE-TIMING | CAT-01 | No |
| PART-000022 | Tensioner | CAT-ENGINE-TIMING | CAT-01 | No |
| PART-000023 | Engine Bearing | CAT-ENGINE-INTERNAL | CAT-01 | No |
| PART-000024 | Piston | CAT-ENGINE-INTERNAL | CAT-01 | Same URL/subject; root claims CC BY-SA 4.0 while data/ conservatively records license as unverified |
| PART-000025 | Piston Ring | CAT-ENGINE-INTERNAL | CAT-01 | No |
| PART-000026 | Connecting Rod | CAT-ENGINE-INTERNAL | CAT-01 | No |
| PART-000027 | Crankshaft | CAT-ENGINE-INTERNAL | CAT-01 | No |
| PART-000028 | Camshaft | CAT-VALVETRAIN | CAT-01 | No |
| PART-000029 | Intake Valve | CAT-VALVETRAIN | CAT-01 | Root uses the same generic valve-pair image for intake and exhaust; data/ removes it pending distinct images |
| PART-000030 | Exhaust Valve | CAT-VALVETRAIN | CAT-01 | Root uses the same generic valve-pair image for intake and exhaust; data/ removes it pending distinct images |
| PART-000031 | Exhaust Manifold | CAT-EXHAUST | CAT-17 | No |
| PART-000032 | Catalytic Converter | CAT-EMISSIONS | CAT-18 | No |
| PART-000033 | Oxygen Sensor | CAT-EMISSIONS | CAT-18 | No |
| PART-000034 | EGR Valve | CAT-EMISSIONS | CAT-18 | No |
| PART-000035 | Turbocharger | CAT-FORCED-INDUCTION | CAT-01 | No |

## 3. Findings

### F-01 — Canonical category namespace
The root file uses nine category labels that do not exist in `categories.json`. The `data/` file uses canonical CAT IDs that do exist in the current category catalog. This is a strong structural reason to use the `data/` category values as the preferred review candidate, but category semantics still need review for edge cases:
- Flywheel and clutch are both assigned to CAT-09 (Clutch System); confirm whether the flywheel should instead be categorized under engine/drive-train taxonomy.
- Turbocharger is assigned to CAT-01 because there is no dedicated forced-induction category; confirm this is the intended taxonomy policy.
- The current schema has no separate subcategory namespace for timing/valvetrain/engine-internal components.

### F-02 — Safety notes
The root file repeats broad generic safety boilerplate across the batch. The `data/` version replaces it with shorter component-specific precautions. The latter is more useful for learner safety and less noisy, but this comparison is editorial, not a specialist safety approval. All 20 safety notes remain review-required; safety-critical procedures must be checked against appropriate service documentation.

### F-03 — Image handling
The `data/` version removes:
- a Getty Images search-result page that is not a direct asset (Clutch);
- one shared generic valve image used for both intake and exhaust valves.

This is a sound conservative intake choice. The Piston record also downgrades a license claim to `unverified`; this avoids treating an unverified license assertion as cleared. However, all remaining image URLs still require subject-identity, source-page, license, attribution, and reuse-rights checks. A direct image URL alone does not establish permission.

### F-04 — No technical verification established
Neither file contains sufficient evidence in this comparison to mark any record `verified`. Candidate image URLs and editorially improved safety notes do not establish the technical accuracy of all record claims.

## 4. Recommendation for owner decision

1. Keep both original files unchanged until an explicit owner decision.
2. Treat `data/parts_batch_02.json` as the **preferred QA candidate**, not yet as the canonical production source. Reasons: canonical category IDs, component-specific safety notes, removal of invalid/shared image placeholders, and conservative license status.
3. Before any replacement or merge, complete a targeted review of category edge cases (especially Flywheel and Turbocharger), safety notes, and all remaining image rights/identity.
4. If approved later, preserve the root version in Git history and record the chosen source/version in the data catalog. Do not silently merge fields from both files.
5. Keep all 20 records at their current unverified/review-required status until claim-level evidence and the required review process are complete.

## 5. Evidence and reproducibility

Compared on `main`:
- Root file blob SHA: `09430c6de4f629408c67e4ec914ac238fba0d92c`
- `data/` file blob SHA: `5dbd3c49cd1aefce54e6ff3813cd92d1d3b4c6a9`
- Category reference: `categories.json`

This report is an AI-1 structural/editorial reconciliation. It is not OEM validation, image-license clearance, or owner approval.
