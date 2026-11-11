# AI-1 Term Archive Audit 001

Date: 2026-11-12  
Status: **Archive extracted and structural audit completed; semantic/technical review still pending.**  
Source archive: `AUTO_LINGO_DATABASE_COMPLETE (1).zip` on repository `main`  
Archive SHA-256: `28f863f6b9cedd5e6aff5b16d784a15c974f207d61743512d59ec8a357d87c4b`

## Method
- Created isolated branch: `ai1-zip-extract-audit-001`.
- Added a GitHub Actions workflow to extract the ZIP and validate the archive CRCs and JSON syntax.
- Workflow run: [43122776811](https://github.com/hfrdy60-max/auto-lingo/actions/runs/43122776811)
- Downloaded and inspected the resulting workflow artifact.
- No canonical data files on `main` were modified.

## Archive inventory
The ZIP contains 15 files:
- 6 term batches
- `categories.json`
- `brands.json`
- `sources.json`
- `database_schema.sql`
- `PROGRESS.md`
- `REPORT.txt`
- 4 Python utility scripts

All 9 JSON files parsed successfully:
| File | Records |
|---|---:|
| terms_batch_01.json | 41 |
| terms_batch_02.json | 41 |
| terms_batch_03.json | 47 |
| terms_batch_04.json | 46 |
| terms_batch_05.json | 41 |
| terms_batch_06.json | 36 |
| categories.json | 26 |
| brands.json | 19 |
| sources.json | 11 |

Total terms: **252**.

## Term ID and duplicate audit
| Batch | Count | ID range |
|---|---:|---|
| 01 | 41 | TERM-000001–TERM-000041 |
| 02 | 41 | TERM-000042–TERM-000082 |
| 03 | 47 | TERM-000083–TERM-000129 |
| 04 | 46 | TERM-000130–TERM-000175 |
| 05 | 41 | TERM-000176–TERM-000216 |
| 06 | 36 | TERM-000217–TERM-000252 |

Results across all 252 records:
- Unique IDs: 252/252; no duplicate IDs found.
- Duplicate English term strings (case/outer-whitespace normalized): none found.
- Duplicate Persian term strings (outer-whitespace normalized): none found.
- ID ranges are consecutive from TERM-000001 through TERM-000252, with no gaps or overlaps.
- All 252 records have `verification_status: unverified`.

These checks establish structural consistency, not factual accuracy or translation quality.

## Important discrepancy: Batch 01
The active root-level file `terms_batch_01.json` on `main` is **not byte-identical** to the archive's `AUTO_LINGO_DATABASE/terms/terms_batch_01.json`.

Evidence:
- Active root file Git blob SHA: `1fda26bf4aa94881db8a1bbc4620ce2d97b14382`
- Archive Batch 01 Git-compatible blob SHA computed from extracted bytes: `1ff182180b5889d7fa41406af5cccc25cbed8909`
- Both files contain 41 records and IDs TERM-000001 through TERM-000041.
- The active root file's first record is `Internal Combustion Engine / موتور احتراق داخلی`; the archive Batch 01 first record is `Cylinder Block / بلوک سیلندر`.
- Therefore, this is a content/version conflict, not merely a formatting difference.

**Recommendation:** keep both versions preserved. Do not overwrite, merge, or designate either one canonical until a row-by-row reconciliation and owner approval are complete.



### Row-by-row reconciliation (completed)
A separate comparison workflow compared every record by `id` and every field:
- Both files contain 41 records and have exactly the same ID set.
- **All 41 of 41 records differ in at least one field.**
- `term_en` differs in 37 records; `term_fa` differs in 37.
- `technical_definition`, `simple_explanation`, `pronunciation_fa`, `example_en`, `example_fa`, and `related_terms` differ in all 41 records.
- `category_id` differs in 20 records.
- Other field-level differences are also present; the complete comparison artifact is retained in GitHub Actions run [43123097408](https://github.com/hfrdy60-max/auto-lingo/actions/runs/43123097408).

This proves the two Batch 01 files are competing content sets that reuse the same identifiers. They must not be merged by ID or silently substituted. A deliberate reconciliation plan is required.

## Remaining QA
1. Row-by-row reconciliation of active Batch 01 against archive Batch 01.
2. Validate all 252 definitions, Persian equivalents, IPA/pronunciation, examples, category assignments, and technical claims against reliable automotive sources.
3. Check related-term references and category IDs against the canonical category catalog.
4. Review whether the 6 batches have consistent schema semantics and field requirements.
5. Only after review, propose a canonical import plan. No automatic promotion is recommended.

## Safety / scope
- This audit did not edit or replace source batches.
- No term has been marked verified.
- No batch is declared canonical.
- Arduino/ESP32 content is outside AUTO LINGO scope.
