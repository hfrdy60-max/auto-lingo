# AI2 — Electrical Diagnostics Research (Initial A–F)

- Mission: AI2-ELECTRICAL-DIAGNOSTICS-RESEARCH-001
- Branch: ai2-electrical-diagnostics-research-001
- Folder: data/inbox/chatgpt2/AI2-ELECTRICAL-DIAGNOSTICS-RESEARCH-001/
- Status: candidate_unverified / research package only

## Repository reconnaissance
- Read `lesson_blueprints.json`: related existing curriculum includes I03 Electrical Basics (LVL-4, order 3; grammar: Describing circuits; open/short/ground; featured IDs PRT-ELE-001..007 and PRT-DIA-003; quiz QZ-I03), A02 CAN Bus and Vehicle Networks, A03 Oscilloscope and Signal Analysis, A06 Reading Wiring Diagrams, U03 OBD-II and Diagnostic Trouble Codes, U05 Scan Tools and Live Data, and U06 Mechanic and Electrician Communication.
- `terms_batch_01.json` contains 41 terms, all in CAT-01 engine category. No electrical measurement/diagnostic vocabulary was found. `terms_batch_02.json` was not present in the root or data path according to the current QA audit.
- Read `database_schema.sql`, `PROGRESS.md`, `QA/CONTENT_AUDIT.md`, and parts batches. Existing project policy requires source-backed claims and forbids vehicle-specific values without vehicle-specific service data.
- This mission is a supplementary research bank, not a new lesson or blueprint. Existing lesson IDs, quiz IDs and featured part IDs are unchanged.

## Coverage delivered in this first package
- A — Measurement tools: 21 vocabulary records.
- B — Electrical test terminology: 16 records.
- C — Wiring-diagram terminology: 24 records.
- D — Connectors and harnesses: 21 records.
- E — Electronic systems: 22 records.
- F — Generic scan-tool language: 17 records.
- Workshop phrase bank: 30 bilingual phrases.
- Translation traps: 11 focused notes.
- Total structured terms: 121.

## Evidence
Seven candidate references are recorded with direct URLs and claim scopes. Fluke and BMW training materials are used for the concept of voltage drop under current flow; Bosch training sources cover diagnostic/electronics and CAN learning; ZVEI connector guidance and a secondary engineering article support connector terminology. All sources remain candidate_unverified pending independent claim-level review and edition/page confirmation.

## Safety and limits
This is a language and conceptual package only. It intentionally omits practical lead-placement steps, ECU pin probing, SRS/airbag circuit testing, high-voltage procedures, current-measurement hookup steps, universal voltage/resistance/current limits, and vehicle pinouts. Any hands-on diagnosis requires a qualified technician, exact vehicle service information, appropriate rated equipment, and workshop safety controls. DTCs are clues, not proof that a named component has failed.

## Remaining mission work
- G: expand to at least 30 phrases (currently 30; done).
- H: 8 bilingual dialogues (6–10 turns each), 4 bilingual readings (120–180 English words each), 5 comprehension questions per reading, and 40-question quiz are not yet delivered.
- I: expand translation/US-UK/OEM notes and attach source-specific evidence where supportable.
- Media: no image/audio asset has been cleared; `media_index.json` is intentionally empty.
- Canonical mapping: all 121 local records remain unmatched; no TERM IDs invented.

## QA
- JSON files are serialized from structured objects.
- No blueprint, term DB, parts DB, crosswalk, quiz bank, schema, UI, main, SQL, migration or production file was modified.
- This package is isolated in AI-2 inbox and must remain needs_review/candidate_unverified until AI-1 review.
