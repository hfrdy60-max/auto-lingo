# AI2-LESSON-E04-DASHBOARD-WARNING-LIGHTS-001 — Research and Authoring Report

## 1. Executive summary
- Lesson: **E04 — Dashboard Warning Lights / چراغ‌های هشدار داشبورد**
- Canonical position: **16th item in the lesson array; LVL-2, order 4**.
- Blueprint title, lesson ID, language focus, skills, vocabulary query, featured part IDs, quiz ID, timing and mastery threshold were preserved exactly.
- Package status: **needs_review**. This is an independent authoring package, not a canonical or released lesson.

## 2. Blueprint verification
Source file: `lesson_blueprints.json` on `main`  
SHA: `96c408a52889f5e7025f5284ce8ceacf54b5d0a6`

Exact E04 fields:
- title: Dashboard Warning Lights / چراغ‌های هشدار داشبورد
- level/order: LVL-2 / 4
- language focus: `'must/mustn't'; color words; 'The light is on/off'`
- skills: vocabulary, reading, listening, translation_fa_to_en, part_recognition
- vocabulary query: LVL-2, E04, categories ecu/electrical/sensors; target_new_terms=10
- featured_part_ids: PRT-ECU-007, PRT-ELE-001, PRT-SEN-011
- quiz: QZ-E04; 10 questions; 70% pass threshold; 27 minutes
- games: GAME-14, GAME-07, GAME-13, GAME-04
- review schedule: 3, 7, 21, 60 days

No blueprint changes were made.

## 3. Lesson content
Five sections cover:
1. Instrument cluster; warning light vs indicator light; on/off/flashing language.
2. Charging-system/battery warning light.
3. Malfunction Indicator Lamp (MIL), check-engine light and DTC.
4. ABS warning light and terminology.
5. SRS and EPS warning lights.

The language focus is preserved: must/mustn't, colour words, and the structures `The light is on/off` and `The light is flashing`. The lesson contains bilingual explanations, ten target vocabulary records, collocations, pronunciation/IPA, examples, short workshop dialogues, guided practice, bilingual reading and comprehension questions.

## 4. Technical boundaries and evidence
- A warning lamp is an indication, not a component-level diagnosis. A DTC is a diagnostic code, not the warning lamp itself.
- The battery symbol may refer to the charging system, not necessarily a failed battery alone.
- MIL scope, ABS/SRS/EPS warning behavior, lamp colour and driver response vary by vehicle, model year and market. OEM owner manuals are the authority for the specific vehicle.
- No universal driving instruction, diagnostic procedure, wiring action, repair instruction or safety-system disassembly instruction is supplied.
- SRS is treated as a safety-critical system; content directs readers to the manufacturer's instructions and qualified professionals.

All technical sources are marked `candidate_unverified` for AI-1 review. Each section links to relevant source IDs in lesson.json.

## 5. Vocabulary mapping audit
- Active `terms_batch_01.json`: 41 records.
- Exact/usable target matches for the ten E04 terms: **0 found**.
- All ten term-map records have `term_id: null`, `mapping_status: unmatched`, and `canonical_status: candidate_unverified`.
- No TERM ID was invented and no term database was changed.

## 6. Featured-part / crosswalk audit
The exact blueprint IDs were preserved:
| Manifest ID | Name | Canonical PART ID | QA status |
|---|---|---|---|
| PRT-ECU-007 | Instrument cluster | null | needs_review |
| PRT-ELE-001 | Battery | null | needs_review |
| PRT-SEN-011 | Oil pressure sensor | null | needs_review |

The three crosswalk records have `canonical_part_id=null` and `qa_status=needs_review`. They are references from the blueprint/manifest, not approved canonical part IDs. No PART ID was assigned.

## 7. Quiz QA
QZ-E04 has exactly 10 slots and the package preserves the required distribution:
- 2 MCQ
- 2 FA→EN
- 1 EN→FA
- 1 fill_blank
- 1 identify_correct_term
- 1 listening
- 1 image_part_id
- 1 sentence_building

All ten slots are populated with draft prompts/answers. Listening has a bilingual transcript but no audio file (`audio_asset: null`). The image slot uses a real photograph from Wikimedia Commons under CC BY 2.0; attribution to Shixart1985 and a license link are required. Before release, verify that the deployed renderer loads the external image URL and preserves attribution.

## 8. Image asset and license
- Page: https://commons.wikimedia.org/wiki/File:Warning_lights_on_a_vehicle%27s_dashboard_glow_brightly,_indicating_possible_engine_problems._The_display_shows_the_time_as_1806_on_September_4,_2020,_creating_urgency.jpg
- Photographer/uploader: Shixart1985
- License: Creative Commons Attribution 2.0 Generic (CC BY 2.0)
- Required credit: “Photo: Shixart1985, via Wikimedia Commons, CC BY 2.0” with a link to the file page and license.
- The image is a real photograph of an illuminated dashboard. It is used only to identify the instrument cluster; it is not used to infer a specific fault or the meaning of a particular icon.

## 9. Blockers / review requests
1. AI-1 should confirm renderer compatibility for the lesson sections, question types, and external image URL.
2. Audio asset for QZ-E04-S08 is absent; keep the slot blocked from audio-dependent release until a real recording exists.
3. The ten target terms have no canonical matches in the active 41-term bank; a separate owner-approved vocabulary batch/mapping decision is required.
4. All three featured-part crosswalk rows remain needs_review with no canonical PART IDs.
5. OEM technical sources are candidate_unverified and need claim-level review before any verified promotion.
6. Confirm that the CC BY 2.0 image credit and license link remain visible wherever the image is displayed.

## 10. Files and scope control
Files in this mission folder:
- `lesson.json`
- `term-map.json`
- `sources.json`
- `REPORT.md`

Only these four files were created on branch `ai2-lesson-e04-dashboard-warning-lights-001`. No main file, blueprint, term DB, parts DB, crosswalk, quiz bank, schema, UI, SQL, migration, production data, canonical ID, verified status or release status was changed.

## 11. Validation
- JSON parse validation: to be completed after GitHub fetch-back.
- Quiz count/type-distribution cross-check: matches QZ-E04 template.
- Vocabulary count: 10 target terms.
- Featured part IDs: exact blueprint IDs preserved.
