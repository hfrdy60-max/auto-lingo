# AI-3 Autel pilot QA — 2026-11-13

## Decision
**Conditional pass for the next controlled research stage. Not approved for production import or unrestricted bulk generation yet.**

The updated pilot is materially better structured and more transparent than the earlier draft. AI-3 may continue with the next Autel research batch using the same source-first method, but must address the blockers below and submit the next batch for review before scaling.

## Scope inspected
Commit: `8e12179d04c13e2f4c9c746484cc9eb97d9df713`

Files inspected include:
- `autel_all_entries (1).json`
- category files: active_test, clear_codes, ecu_information, live_data, obd2, read_codes, service_functions, special_functions, system_scan
- `autel_maxisys_ms906_pro.json`
- `sources (1).json`
- `entry.schema (1).json`, `device.schema.json`, `source.schema.json`
- `cross_brand (1).json`, `media_index (1).json`

## Positive findings
- 36 consolidated entries across 9 categories.
- No duplicate record IDs.
- Every entry has required core fields, at least one source reference, printed page and locator.
- All 36 technical verification objects identify the official-manual basis, source ID and checked fields.
- Model applicability is explicitly limited to MaxiSys MS906 Pro / MS906 Pro-TS; VCI is recorded as MaxiVCI V200.
- The manual edition (US V2.1) is correctly distinguished from the diagnostic software build.
- The diagnostic software version is not invented; it is explicitly marked undocumented and requiring physical-device confirmation.
- The new source record identifies the manufacturer manual and its URL.
- Non-null related-term target IDs resolve to existing entries; no broken non-null foreign references were found.
- The two “Live data” entries are contextually distinct (vehicle-specific diagnosis vs generic EOBD), so this is not automatically a duplicate. Keep both contexts explicit.

## Remaining blockers / required corrections
1. **Persian translation review:** all 36 records still have `translation.status = draft_unreviewed`. Do not label the Persian translations approved or publish them as reviewed. Arrange a separate Persian automotive terminology review.
2. **Workshop examples:** 10 are marked complete and 26 are marked brief. Expand the 26 brief examples into useful workshop scenarios with symptom/context, diagnostic action, expected observation and interpretation; clearly label invented teaching scenarios as author-generated, not documented real cases.
3. **Relationship graph:** 78 related-term links have `target_id: null` (including child, see_also and part_of_screen). Resolve targets where an in-dataset target exists. Where the relation intentionally points outside this pilot or is only a label/alias, explain that explicitly and do not invent an ID.
4. **Schema/source mismatch:** `source.schema.json` requires `source_id`, `type`, `title`, `url`, `accessed`, `page_numbering`; the new source record uses `source_id`, `type`, `title`, `url`, `accessed`, `pages_used`. Align the schema and source record (prefer retaining both `pages_used` and a clear `page_numbering` description) before automated validation.
5. **Independent source verification:** this was a structural/content audit of the repository payload. The PDF and on-device UI were not independently opened or compared in this audit. Keep the manual page citations, but do not treat this report as independent confirmation of every menu path or UI label.
6. **Physical software build:** if AI-3 later obtains a physical MS906 Pro / Pro-TS, record the displayed diagnostic software build from the device itself. Until then, keep it null/undocumented.

## Instructions to AI-3
- Continue only the next controlled Autel batch, not mass production across all brands.
- Preserve the current schema version and source-first evidence discipline.
- Do not guess software versions, vehicle-specific menu availability, or cross-brand equivalents.
- Correct the 26 brief examples and relationship targets where possible.
- Fix the source schema mismatch.
- Keep translation review status as draft_unreviewed until a qualified reviewer actually reviews it.
- Deliver a revised consolidated JSON plus a short change log and QA self-check. Do not modify application code or production data files.

## QA conclusion
**Approve continuation of the Autel pilot/research in a controlled next batch. Do not yet approve production import, final publication, or unrestricted expansion.**

 
## Follow-up remediation and live validator run (2026-11-13)

The repository layout and the AI-3 validator draft were reconciled. The AI-3 draft expected separate folders such as `entries/autel/`, `sources/` and `devices/`, while this repository stores a consolidated bank and selected files at the repository root. The original script also expected device page-reference fields and source page manifests that were not present.

### Data and schema fixes
- Added `document_edition`, `page_numbering`, `pages_used` and exact `pages_cited` page ranges to the Autel source record.
- Extended `pages_used` to cover all structured references in the current pilot: printed pages 5, 13, 17–49, 63 and 74–79.
- Added explicit printed-page locators to device hardware and software metadata.
- Updated `source.schema.json` to match the actual source registry.
- Populated `target_context` on all 106 internal relationship links from the actual target record context.
- Classified all 78 null-target relationships using `target_scope` and an explanatory note. No target IDs were invented. Categories: alias 7, status label 6, contrast 6, part-of-screen 22, child 11 and see-also 26.
- Expanded all 26 brief workshop examples with complaint, diagnostic actions, expected observation, interpretation and safety note. All are explicitly author-generated scenarios, not documented real repair cases. The 26 statuses are now complete; all 36 examples remain labelled as author-generated where applicable.

### Repository-native validator
- Added `tools/validate_pilot.py`; it reads the current consolidated file paths, supports schema validation, checks source/document edition links, device IDs, page citation coverage, duplicate IDs/terms, relationship targets and inverse links, translation state and example provenance.
- It writes JSON and Persian Markdown reports under `QA/` and does not mutate source data.
- Added workflow `.github/workflows/autel-pilot-validation.yml` to run the validator on relevant changes and upload both reports as an artifact.

### Real GitHub Actions execution
- Workflow run: [AUTONEX Autel pilot validation](https://github.com/hfrdy60-max/auto-lingo/actions/runs/43445017759).
- Result: **success**; validator reported 36 records, 184 relationships, 0 errors and 1 warning (**PASS_WITH_WARNINGS**).
- Remaining warning: all 36 Persian translations are still `draft_unreviewed`. This is intentional; they must not be treated as approved before human automotive-terminology review.
- The previous warnings for 26 brief examples and 78 unexplained null targets are resolved.
- Report artifact: [JSON and Markdown validation reports](https://github.com/hfrdy60-max/auto-lingo/actions/runs/43445017759/artifacts/14046613406).

### Limits
This is a successful structural and cross-file integrity run. It does not independently prove every technical statement, translation, UI label or menu path against physical hardware. The 36 technical `verified` states remain the AI-3 research team's evidence status; they are not created by the validator itself.
