# E02 Electrical Components — Research and QA Report

## Mission
- Task: `AI2-LESSON-E02-ELECTRICAL-COMPONENTS-001`
- Lesson: `E02`, fourteenth item in canonical lesson array
- Level/order: `LVL-2 / 2`
- Approved title: **Electrical Components and Their Functions** / **قطعات الکتریکی خودرو و عملکرد آن‌ها**
- Approval: AI-1 comment `6824453437`
- Branch: `ai2-lesson-e02-electrical-components-001`
- Status: `needs_review`; authoring package only; not verified/released.

## Scope and content
The lesson has been rewritten around the six approved topics: battery, alternator, starter motor, fuse, relay, and wiring connector. Each section includes Persian meaning, approximate pronunciation, IPA, collocations, bilingual example sentences, terminology contrasts, a short workshop dialogue, and a guided practice item. It also includes a bilingual reading, Present Simple grammar focus, guided practice, and a 10-slot knowledge check.

The lesson is language-focused. It does not provide hands-on electrical repair instructions, generic voltage/current/fuse ratings, pinouts, wire colours, connection steps, or diagnostic procedures. The common low-voltage battery is explicitly distinguished from high-voltage traction systems.

## Blueprint alignment and required owner decision
The existing E02 blueprint was read from `lesson_blueprints.json` on main. Its title, query, target count and featured IDs still describe the previous mixed-components lesson:
- Existing featured IDs: `PRT-COL-001`, `PRT-COL-002`, `PRT-LUB-002`, `PRT-FUE-002`, `PRT-ELE-002`, `PRT-ELE-003`.
- The approved new six-topic scope includes only Alternator and Starter motor among those existing featured IDs.
- Battery, Fuse and Relay have manifest IDs, but are not current featured IDs; Wiring connector has no matching record in the inspected crosswalk.
- Existing vocabulary query is LVL-2/E02 with categories cooling/electrical/fuel/lubrication and target_new_terms=10. The current term file contains only 41 engine-category records.
- Current quiz template QZ-E02 has 10 slots and its distribution is preserved exactly.

No blueprint, canonical data, schema, frontend, production data, quiz bank or crosswalk was changed. The proposed blueprint amendments are recorded in `lesson.json` for AI-1/owner review only.

## Term database cross-check
- Inspected `terms_batch_01.json` on main: exactly 41 records, TERM-000001 through TERM-000041.
- No exact target terms among the ten proposed vocabulary candidates were found in that file.
- `terms_batch_02.json` was not present in the main tree inspected.
- Therefore all ten candidate vocabulary records have `term_id: null`; no TERM IDs were invented and no canonical status was assigned.

## Parts/crosswalk check
Inspected `data/mappings/parts_image_crosswalk.json`:
| Topic | Manifest ID | Canonical part ID | Crosswalk status |
|---|---|---|---|
| Battery | PRT-ELE-001 | null | unmatched_review_required |
| Alternator | PRT-ELE-002 | null | unmatched_review_required |
| Starter motor | PRT-ELE-003 | null | unmatched_review_required |
| Fuse | PRT-ELE-005 | null | unmatched_review_required |
| Relay | PRT-ELE-006 | null | unmatched_review_required |
| Wiring connector | none found | null | no_manifest_record_found |

All five listed electrical manifest records are `needs_review`; none is a confirmed canonical part. The package references manifest IDs only as provisional references and does not present them as canonical IDs.

## Quiz QA
The ten question slots follow the current QZ-E02 template distribution exactly:
- 2 MCQ
- 2 FA→EN
- 1 EN→FA
- 1 fill blank
- 1 identify correct term
- 1 listening
- 1 image part ID
- 1 sentence building

Two publication blockers remain:
1. QZ-E02-S08 has a transcript but no real audio file (`audio_asset: null`).
2. QZ-E02-S09 requires a real image of a fuse; no image with confirmed source and reuse permission is included (`image_asset: null`).

## Sources and evidence
Twelve direct publisher references are recorded in `sources.json`. They cover battery terminology/energy management (Interstate, Bosch), starter and alternator function (DENSO, Bosch), fuse protection and relays (HELLA), and automotive terminals/connectors (TE Connectivity). Each source is candidate/unverified and linked to specific claim scopes. No source has been promoted to verified.

## Structural QA performed
- Lesson JSON object assembled with renderer-facing top-level fields: lesson_id, lesson_title_fa/en, blueprint_alignment, learning_objectives, prerequisites, lesson_intro_fa, sections[].vocabulary, english_focus, reading, guided_practice, knowledge_check.
- Separate term-map JSON contains ten candidate records with null term IDs.
- Separate sources JSON contains 12 direct publisher sources and claim-support descriptions.
- Quiz count and type distribution match QZ-E02 template.
- IDs are not fabricated; canonical IDs remain null where absent.
- Package is isolated under `data/inbox/chatgpt2/AI2-LESSON-E02-ELECTRICAL-COMPONENTS-001/`.

## Open items for AI-1
1. Confirm whether the renderer accepts the additional vocabulary fields (pronunciation_fa, ipa, term_id, collocations, canonical_status) and the proposed `knowledge_check` structure.
2. Decide/authorize the E02 blueprint title, featured_part_ids, vocabulary category query and quiz image mapping changes; AI-2 has not changed the blueprint.
3. Resolve electrical part crosswalk mappings and add/approve a wiring connector manifest/canonical record if required.
4. Locate or create a real audio asset and a properly licensed real fuse image before publication.
5. Review technical claims and language quality; all evidence and content remain `needs_review`.

## Explicit non-actions
No main files, blueprint, term database, parts database, crosswalk, quiz bank, SQL, migration, frontend, production data, canonical selection, verification status, or release status was changed.
