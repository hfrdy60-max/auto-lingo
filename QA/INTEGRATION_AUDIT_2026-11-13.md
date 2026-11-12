# AUTO LINGO — Integration Audit (2026-11-13)

## Purpose
A read-only integration review of the current repository data and PostgreSQL schema. This report does not modify application data or execute migrations.

## Executive finding
The repository contains useful learning content and a promising Autel pilot, but the JSON datasets are not yet safe for direct import into the current SQL schema. A normalization/mapping layer is required before database seeding.

## Confirmed compatibility gaps

| Area | Repository data | SQL schema expectation | Risk / required action |
|---|---|---|---|
| Source IDs | Autel pilot uses `src-001`; general `sources.json` uses `SRC-001` | Source IDs are referenced by entity source relations; project convention uses `SRC-...` | Normalize to one canonical ID and preserve old IDs in an explicit crosswalk. |
| Source object shape | Autel file uses `source_id`; general source file uses `id` | SQL `sources.id` | Map field names in importer; do not load raw JSON blindly. |
| Verification statuses | Autel schema allows `verified`, `partially_verified`, `unverified`, `needs_review` | SQL enum is `verified`, `unverified`, `needs_review`, `unknown` | `partially_verified` has no SQL enum equivalent. Add a deliberate mapping or revise the enum before import. |
| Autel entity model | Autel entries have `device_id`, `menu_path`, `software_version_note`, `source_pages` | Current SQL schema has no dedicated diagnostic-device/menu-entry table in the reviewed schema | Add a dedicated device catalogue model or store structured diagnostic assets separately; do not squeeze menu entries into generic `terms`. |
| Lesson IDs | Blueprints use `B01`… and `PR12` | SQL lessons require IDs matching `LESSON-[0-9]{4}` | Define a stable lesson-ID crosswalk before seeding. |
| Quiz IDs | Quiz bank uses `QZ-B01` etc. | SQL quizzes require IDs matching `QUIZ-[0-9]{4}` | Define quiz ID mapping; preserve original IDs as external keys. |
| Term/part IDs | Main term data uses `TERM-000001`; parts use `PART-000001` | SQL patterns align with these formats | These are comparatively compatible, subject to category and foreign-key validation. |

## Content completeness observations

- The lesson blueprint file contains 80 blueprints, but each blueprint explicitly marks `lesson_text` as `not_generated`. These are curriculum plans, not finished lessons.
- The quiz bank contains 80 quiz templates and 63 authored questions. The remaining template slots are intentionally unfilled and must not be counted as authored questions.
- The workshop dialogue dataset contains 10 dialogues. At least the inspected dialogue marks technical accuracy and Persian naturalness as needing expert/native review.
- The games dataset contains 17 game definitions. A game marked `design_ready` is a design specification, not proof that the game is implemented in the frontend.
- The Autel pilot contains 36 records. IDs are unique and required fields, menu paths, and page citations are populated. However, 10 OBD-II records contain placeholder workshop examples. All 36 translations are marked author translations and all examples author-generated; these are not independent review states.
- The Autel source record identifies the official manual and printed page references. The manual document version V2.1 must not be mistaken for the device's installed diagnostic software version.

## Recommended integration sequence

1. Freeze current source files as the raw layer; never overwrite raw research during normalization.
2. Establish canonical IDs and explicit crosswalks for sources, lessons, quizzes, and diagnostic devices.
3. Finalize a JSON Schema for each dataset and validate every batch automatically.
4. Add a dedicated diagnostic-device/menu-entry data model for Autel/Launch/Bosch scan-tool content, including device model, VCI, market, manual edition, software-version scope, menu path, term, page citation, and independent review states.
5. Normalize verification states across JSON and SQL; keep technical verification, translation review, and example review separate.
6. Run referential-integrity checks (all source IDs, category IDs, lesson links, quiz links, game links, and media IDs must resolve).
7. Only then prepare a seed/import script and test it against a disposable database; do not run migration 002 against production without backup and review.

## Acceptance gates before database import

- 100% valid JSON and schema validation.
- 0 duplicate primary IDs within each dataset.
- 0 unresolved foreign-key/cross-reference IDs, or an explicit documented exception list.
- Every `verified` technical claim has a resolvable source and page/section citation.
- Translation and example review states are independent of technical verification.
- No placeholder text in content presented to learners.
- Import is repeatable and idempotent; rerunning it must not create duplicate records.

## Scope and limitations
This is a static review of repository files and schema definitions. No database connection, SQL execution, migration, browser/device testing, or full line-by-line technical validation of every lesson/question was performed.
