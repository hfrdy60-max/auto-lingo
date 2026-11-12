# AI2 — Electrical Diagnostics Research

- Mission: AI2-ELECTRICAL-DIAGNOSTICS-RESEARCH-001
- Branch: `ai2-electrical-diagnostics-research-001`
- Folder: `data/inbox/chatgpt2/AI2-ELECTRICAL-DIAGNOSTICS-RESEARCH-001/`
- Status: `candidate_unverified` / research package only; not approved for release.

## Repository reconnaissance
- Read `lesson_blueprints.json`: related curriculum already includes I03 Electrical Basics (LVL-4, order 3; grammar: Describing circuits; open/short/ground; featured IDs PRT-ELE-001..007 and PRT-DIA-003; quiz QZ-I03), A02 CAN Bus and Vehicle Networks, A03 Oscilloscope and Signal Analysis, A06 Reading Wiring Diagrams, U03 OBD-II and Diagnostic Trouble Codes, U05 Scan Tools and Live Data, and U06 Mechanic and Electrician Communication.
- Read `terms_batch_01.json`: 41 records, all in CAT-01 engine category. No electrical measurement/diagnostic terms were found. `terms_batch_02.json` was not present in the root or data path according to the current QA audit.
- Read `database_schema.sql`, `PROGRESS.md`, `QA/CONTENT_AUDIT.md`, and parts batches. Project policy requires source-backed claims and forbids vehicle-specific values without vehicle-specific service data.
- This is a supplementary research bank, not a new lesson or blueprint. Existing lesson IDs, quiz IDs and featured part IDs are unchanged.

## Coverage delivered
- A — Measurement tools: 21 vocabulary records.
- B — Electrical test terminology: 16 records.
- C — Wiring-diagram terminology: 24 records.
- D — Connectors and harnesses: 21 records.
- E — Electronic systems: 22 records.
- F — Generic scan-tool language: 17 records.
- Total structured terms: 121.
- G — Workshop phrase bank: 30 bilingual phrases.
- H — Dialogues: 8 bilingual dialogues, 6 turns each.
- H — Readings: 4 bilingual texts (164, 160, 157 and 160 English words) with 5 comprehension questions each (20 total).
- H — Quiz: 40 bilingual technical-language questions with answer keys and Persian explanations.
- I — Translation traps: 11 terminology notes.

## Evidence status
Seven sources are recorded with direct URLs and claim scopes. The sources include Fluke automotive voltage-drop materials, BMW Group Technical Training, Bosch Mobility/Bosch Engineering, ZVEI's low-voltage automotive connector guideline, and a secondary connector engineering article. All seven remain `candidate_unverified`; none is declared verified. Claim-level review, source edition/page confirmation and independent technical QA remain AI-1 tasks.

## Canonical mapping
- 121 local term records are mapped in `term-map.json`.
- Canonical matches: 0; all `term_id` values are null and `mapping_status=unmatched_review_required`.
- No TERM, PART, LESSON or QUIZ identifiers were invented.

## Media
`media_index.json` contains zero assets. No image/audio asset was added without a verified source page and clear reuse license. The listening/audio and real image assets remain blockers for any later lesson integration.

## Safety and technical limits
This is a language and conceptual package only. It intentionally omits practical lead-placement steps, ECU pin probing, SRS/airbag circuit testing, high-voltage procedures, current-measurement hookup steps, universal voltage/resistance/current limits, and vehicle pinouts. Hands-on diagnosis requires a qualified technician, exact vehicle service information, appropriately rated equipment, and workshop safety controls. A DTC is a clue, not proof that a named component has failed.

## QA and repository isolation
- Fetch-back validation: all seven JSON files parsed successfully.
- Counts confirmed from fetched files: A-F = 121 terms; 30 phrases; 8 dialogues with 6 turns each; 4 readings with 20 comprehension questions; 40 quiz questions; 7 candidate sources; 0 cleared media assets.
- No blueprint, term DB, parts DB, crosswalk, quiz bank, schema, UI, main, SQL, migration or production file was modified.
- All files are isolated under the AI-2 inbox branch and must remain needs_review/candidate_unverified until AI-1 review.

## Files
- `research.json`
- `term-map.json`
- `sources.json`
- `dialogues.json`
- `readings.json`
- `quiz.json`
- `media_index.json`
- `REPORT.md`
