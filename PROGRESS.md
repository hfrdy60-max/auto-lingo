# AUTO LINGO — Progress Log

## Stage 1 — Architecture (DONE)
- database_schema.sql: 27 tables + 1 QA view, RLS read-only, updated_at triggers
- categories.json: 26 records
- brands.json: 19 records (unverified)
- sources.json: 11 records (unverified)

## Stage 2 — Terms database
### Batch 01 — CAT-01 Engine & Combustion
- File: terms_batch_01.json
- Records generated: 41
- Validated structurally: JSON serialization successful; IDs sequential and unique (TERM-000001–TERM-000041); category_id CAT-01 exists in categories.json; part-specific fields are null for non-part terms.
- Verified: 0
- Needs review / unverified: 41 (all intentionally unverified; no record-level source has been checked and linked in entity_sources)
- Sources used: none as verified evidence. sources.json contains candidate references only; their listed status remains unverified.
- Missing/incomplete: related_terms left empty for later linking; synonyms empty where no safe synonym was established; part location is generic and must be refined per engine design; symptom and testing fields intentionally conservative.
- Potential issues: technical definitions and translations require expert review; no vehicle-specific values, torque, pressure, resistance, voltage, or pinout data included.

### Resume point
- Last ID: TERM-000041
- Completed categories: CAT-01 (initial batch; category coverage not yet complete)
- Next: continue CAT-01 with non-duplicate terms, then CAT-02 through CAT-26.


## Stage 3 — Gemini material staged for AUTO LINGO
- Added seven automotive-learning staging datasets under `data/staging/`: parts_images, wiring_diagrams, simulator_data, sensor_simulator, diagnostic_cases, electronics_labs, report_card_prompt.
- ESP32/microcontroller project content is excluded from AUTO LINGO scope and was not added. No `data/staging/esp32_projects.json` existed at the checked path.
- These staging files are curated/reconstructed from the supplied file summaries in the conversation, not byte-for-byte copies of the original Gemini JSON files. Reconcile any exact original records against these staged records before replacement.
- All technical records remain `needs_review` / unverified. No image license, technical value, wiring topology, or vehicle-specific parameter is represented as independently verified.
- Known issues are documented in-record: likely diesel Common Rail image mislabeled as GDI; injector circuit fuse/clamp values are not universal; CAN values are typical only; injector simulator needs calibration and engine/injector model parameters; MAP/CKP signals are sensor/application-specific; P0300 is a diagnostic case, not proof of a failed component.
- The datasets are staged for review and are not yet imported into production relational tables or connected to the frontend UI.


## Stage 4 — Frontend and database integration prepared
- Added `automotive-data.js`, which loads the seven staging JSON datasets and renders them in the new responsive `#learningLab` section on the GitHub Pages frontend.
- Added an interactive educational injector-command calculator with explicit simplified assumptions; it does not claim real fuel-flow measurement or calibration.
- Added `database_migration_002_learning_assets.sql`: creates relational tables for educational media, generic wiring references, simulator configurations, practical labs and assessment configuration; seeds those tables and maps P0300 to the existing diagnostics and repair_scenarios model.
- Added public read-only RLS policies for the new content tables, consistent with the current schema's public learning-content model.
- Validation: frontend script parses; HTML includes the learning lab and loads the new script; CSS includes the lab styles.
- Important deployment step: the SQL migration is committed but has NOT been executed against Supabase. Run `database_migration_002_learning_assets.sql` in Supabase SQL Editor after `database_schema.sql`. GitHub Pages frontend reads static JSON files directly and does not require Supabase for this learning-lab display.
- All staged technical records remain `needs_review`; image licenses and technical claims require independent source verification before being marked verified.


## Stage 5 — Modern global vehicle features curriculum
- Added `data/modern_features.json` with 25 modern vehicle technologies and options, each containing Persian/English titles, overview, architecture, diagnostic approach, safety notes, keywords, and `needs_review` status.
- Topics include ADAS Level 2, DMS/OMS, V2X, software-defined vehicles, OTA, zonal E/E architecture, Automotive Ethernet, steer-by-wire, brake-by-wire, rear-wheel steering, adaptive air suspension, active aerodynamics, 48V mild hybrid, integrated thermal management, heat pumps, bidirectional charging (V2L/V2H/V2G), battery preconditioning, UWB digital keys, biometrics, AR-HUD, LiDAR/imaging radar, remote parking, eCall, cybersecurity, and solid-state batteries as an emerging technology.
- Connected the dataset to the Learning Lab UI with expandable learning cards. JavaScript syntax validation passed.
- Content is general educational material, not vehicle-specific service data; feature availability varies by manufacturer/model/year/market. All records remain `needs_review`; no unsupported universal specifications are claimed.
- ESP32 and microcontroller projects remain excluded from AUTO LINGO.

## Stage 6 — Generic parts database (in progress)
- Added `data/parts_batch_01.json` with 15 generic automotive part records (`PART-000001`–`PART-000015`): air filter, oil filter, fuel injector, fuel pump, throttle body, spark plug, ignition coil, MAF, MAP, crankshaft position sensor, camshaft position sensor, engine coolant temperature sensor, thermostat, radiator, and water pump.
- Each record includes bilingual names, a generic description, function, typical installation area, operating principle, common failure modes, symptoms, cautious test approaches, required tools, category mapping, and candidate source links.
- All records are marked `needs_review`. Candidate publisher homepages are discovery leads, not record-level proof; no record is marked verified.
- Safety notes are embedded where relevant, including high-pressure GDI/diesel fuel precautions and hot pressurized cooling-system hazards.
- Generic content only: no universal electrical values, pressures, torques, pinouts, or vehicle-specific repair steps are asserted.
- Note: the supplied 2026-11-12 external progress report says 82 terms, while the repository's current `PROGRESS.md` still documents 41 terms and an earlier resume point. Reconcile the term batches and progress record before assigning more TERM IDs.


## Stage 6 — Generic parts database (continued)
- Added `data/parts_batch_02.json` with 20 generic part records (`PART-000016`–`PART-000035`).
- Corrected all category IDs to existing `categories.json` values: cooling CAT-14, lubrication CAT-15, clutch CAT-09, engine/timing/valvetrain CAT-01, exhaust CAT-17, and emissions CAT-18.
- Replaced misleading or missing image entries (Getty search page, absent images, and one shared valve image that did not distinguish intake from exhaust) with null placeholders; no replacement image URLs were invented. Remaining direct image URLs are unverified candidates and must not be published until subject match and reuse rights are checked.
- Replaced unrelated boilerplate safety notes with component-specific precautions.
- QA: exactly 20 sequential unique IDs; JSON valid; category IDs match existing category namespace; all records remain `needs_review`; no vehicle-specific specifications are asserted.

## Stage 4 — Content QA & integration audit (IN PROGRESS)
- Central audit: [QA/CONTENT_AUDIT.md](QA/CONTENT_AUDIT.md)
- Six uploaded content files were structurally reviewed: games, lesson blueprints, image manifest, progression rules, quiz bank, workshop dialogues.
- Recorded issues: 80 lesson blueprints have no generated lesson text; 43 lessons lack authored quiz questions; 4 games need content authoring; all 164 image assets are missing; 10 dialogue-to-lesson level mismatches require content review; image/category/part identifiers need a crosswalk; frontend does not yet load these six files.
- Terms count discrepancy remains unresolved: this log previously recorded 41 terms in `terms_batch_01.json`; a separate AI report claims 82 across two batches, but `terms_batch_02.json` was not found in repository root or `data/` during the 2026-11-12 audit. Do not treat 82 as repository-verified until the second file is located.
- No technical content was silently promoted to verified. Vehicle-specific repair values require vehicle-specific sources.
- Next QA action: resolve the terms batch discrepancy, then build an explicit mapping file for image-manifest part/category IDs to canonical parts/categories.

## Parts Batch 03 — QA intake (2026-11-12)
- File: `parts_batch_03.json`
- Batch: `PARTS-BATCH-003`; declared/actual records: 20.
- IDs: `PART-000036`–`PART-000055`; all 20 unique and sequential; no duplicate IDs.
- JSON parsed successfully; required descriptive fields present; every record includes a safety note and at least one source candidate.
- Category IDs checked against canonical `categories.json`: CAT-07, CAT-10, CAT-11, CAT-12, CAT-13 all exist. No invented category IDs found.
- All 20 records remain `needs_review` (correctly not promoted to verified).
- Images: all 20 image URLs are null; image sourcing remains outstanding. This is preferable to fabricated or unlicensed image URLs.
- Technical/source review still required: source_candidates are candidate references, not proof that every statement in every record is supported. Brake and steering content is safety-critical; test procedures and component descriptions require authoritative evidence and specialist review before publication.
- Intake result: structurally accepted; not yet technically verified or production-ready.


## Stage 7 — Interface organization refresh (2026-11-12)
- Simplified the primary navigation to six clear destinations: home, quick-start guide, learning paths, technical academy, practice lab, and learner progress.
- Added a four-step Persian quick-start guide with direct links and a realistic 15–20 minute daily learning routine.
- Refined spacing, typography, cards, navigation hierarchy, and responsive mobile navigation while preserving existing section IDs and learning functionality.
- This is a presentation/organization pass only. The six recently uploaded JSON content packages are still not fully integrated into the learner-facing UI; missing images and unverified technical content remain QA items.


## Stage 8 — App-style navigation redesign (2026-11-12)
- Replaced the conventional horizontal website navigation with an application shell: persistent desktop sidebar, compact page header, and five primary destinations.
- Main destinations: Home, Learning Courses, Dictionary, Practice & Tests, and My Progress. On mobile, navigation becomes a fixed five-item bottom dock.
- Content is grouped into separate page views so the learner no longer has to scroll through the entire product as one long landing page. Existing learning components and their IDs are retained.
- This is a UI/navigation restructuring; the new JSON content packages still require separate data QA and integration.


## Stage 9 — Central data organization and image crosswalk (2026-11-12)
- Added `DATA_CATALOG.md` as the central index of current datasets, canonical ID namespaces, QA states, known gaps, source policy and execution order.
- Added `data/mappings/parts_image_crosswalk.json` with all 164 image-manifest entries. 35 have exact English-name candidate matches to canonical PART IDs; 129 remain unmatched. Every row remains `needs_review`; no ID was overwritten and no unmatched record was fabricated.
- Confirmed `data/parts_batch_02.json` and root `parts_batch_02.json` contain the same 20 PART IDs but differ in fields: category_id and safety_notes differ in all 20 records; images also differ in 4 records. Keep both until an explicit version reconciliation; the corrected data/ copy is the current preferred review candidate based on prior QA notes, not a verified final release.
- Confirmed current repository contains 41 terms in `terms_batch_01.json`; `terms_batch_02.json` was not found in root or data. Do not generate more TERM IDs until the discrepancy is resolved.
- External source links in the catalog are research starting points only. No technical record was promoted to verified in this stage.


## Stage 7 — Structured lesson content UI (in progress)
- Added curriculum content for the 13th curriculum item: E01, Engine Basics: Main Components (LVL-2). Note: canonical blueprint ID is E01, not B13.
- Organized lesson data into `data/lessons/E01.json`, sources into `data/lessons/E01.sources.json`, vocabulary mapping into `data/lessons/E01.term-map.json`, and index into `data/lessons/index.json`.
- Added `curriculum.js` and a responsive structured lesson area to the learning page; it renders objectives, lesson sections, vocabulary/examples, grammar, reading, guided practice, quiz, term mappings and source links.
- Added exact matches to the existing term bank only. Ten vocabulary items have exact TERM IDs; spark plug has a part-only match; engine has no exact term match. No IDs were fabricated.
- Validation performed: JSON parse checks passed for all lesson assets; JavaScript syntax checks passed for `curriculum.js` and `app-shell.js`; HTML section and script references confirmed.
- Release status remains `needs_review`: candidate sources are unverified, audio and real part images are not supplied, and browser-level QA has not yet been run. Changes are isolated on branch `ai1-lesson-13-e01-engine-basics-001`; production/main data has not been replaced.
