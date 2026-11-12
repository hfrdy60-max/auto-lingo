# AI2 — Electrical Diagnostics Research

- Mission: AI2-ELECTRICAL-DIAGNOSTICS-RESEARCH-001
- Branch: `ai2-electrical-diagnostics-research-001`
- Folder: `data/inbox/chatgpt2/AI2-ELECTRICAL-DIAGNOSTICS-RESEARCH-001/`
- Status: `candidate_unverified` / research package only; not approved for release.
- Latest QA-fix commits: dialogue schema repair `d868883535244f35701982ea17c73ba2d10193b8`; pronunciation/overlap metadata `3167c213a8f591858e1aff7e9ababf95aa7e680`; prior report refresh `9423ac00998aaf6a114752936525fbf3535d9ff0`; latest dialogue content repair recorded in the subsequent Issue #1 handoff.

## Repository reconnaissance
- Read `lesson_blueprints.json`: related curriculum includes I03 Electrical Basics, A02 CAN Bus and Vehicle Networks, A03 Oscilloscope and Signal Analysis, A06 Reading Wiring Diagrams, U03 OBD-II and Diagnostic Trouble Codes, U05 Scan Tools and Live Data, and U06 Mechanic and Electrician Communication.
- Read `terms_batch_01.json`: 41 records, all in CAT-01 engine category. No electrical measurement/diagnostic terms were found in that batch. Canonical IDs remain null pending mapping.
- Read `database_schema.sql`, `PROGRESS.md`, `QA/CONTENT_AUDIT.md`, and parts batches. Project policy requires source-backed claims and forbids vehicle-specific values without vehicle-specific service data.
- This is a supplementary research bank, not a new lesson or blueprint. Existing lesson IDs, quiz IDs and featured part IDs are unchanged.

## Coverage delivered
- A–F: 121 structured vocabulary records (21 measurement tools, 16 electrical test terms, 24 wiring-diagram terms, 21 connector/harness terms, 22 vehicle-electronics terms, 17 scan-tool terms).
- G: 30 bilingual workshop phrases.
- H: 8 bilingual dialogues (6 turns each); 4 bilingual readings (157–164 English words) with 20 comprehension questions; 40 bilingual quiz questions with answer keys and Persian explanations.
- I: 11 terminology/translation notes.
- Quiz types: 28 multiple-choice and 12 term-to-definition. This is a general practice bank, not yet a varied lesson assessment; translation, cloze and contextual-use formats remain future improvements.

## QA response to AI-1
### P1. Dialogue structure — FIXED
All 8 dialogues use stable `{speaker,en,fa}` turns, with six alternating turns (Technician/Supervisor). After AI-1 identified repeated adjacent content despite valid structure, all 48 turns were rewritten as distinct, context-appropriate exchanges. Fetch-back validation is required to confirm schema, speaker order, and no accidental adjacent duplicate English or Persian text.

### P1. Pronunciation — PARTIALLY FIXED; coverage declared
Pronunciation support has been added to 36 of 121 records (29.8%): both `pronunciation_fa` and IPA are populated for core learner-facing terms. The remaining 85 records retain null values pending review. Persian phonetic renderings are approximate; IPA and pronunciation require human language review before release. Full coverage is not claimed.

### P1. AI-1 overlap — DOCUMENTED
Eight terms overlap the AI-1 multimeter package: Digital multimeter (DMM), Test lead, Clamp meter, Test light, Auto-ranging, Polarity, Input impedance, and Fused current input. They are retained for traceability, not proposed as new canonical duplicates. During integration they should cross-reference AI-1 canonical records once exact canonical IDs are available. No canonical IDs were invented.

## Evidence status and remaining P2
Seven sources are recorded with direct URLs and claim scopes. All remain `candidate_unverified`; none is declared verified. Claim-level page/section mapping is incomplete and requires AI-1 review. The generic Bosch training portal is not treated as standalone proof for CAN-specific claims. Example sentences are author-generated and are not source quotations or evidence.

## Canonical mapping
- 121 local term records in `term-map.json`.
- Canonical matches: 0; all `term_id` values are null and `mapping_status=unmatched_review_required`.
- No TERM, PART, LESSON or QUIZ identifiers were invented.

## Media
`media_index.json` contains zero assets. No image/audio asset was added without a verified source page and clear reuse license.

## Safety and technical limits
This is a language and conceptual package only. It omits practical lead-placement steps, ECU pin probing, SRS/airbag circuit testing, high-voltage procedures, current-measurement hookup steps, universal electrical limits, and vehicle pinouts. Hands-on diagnosis requires a qualified technician, exact vehicle service information, appropriately rated equipment, and workshop safety controls. A DTC is a clue, not proof that a named component has failed.

## QA and repository isolation
- Fetch-back validation: all seven JSON files parse successfully.
- Counts: 121 terms; 36/121 pronunciation+IPA pairs populated; 30 phrases; 8 dialogues/48 turns; 4 readings/20 comprehension questions; 40 quiz questions; 7 candidate sources; 0 cleared media assets.
- Dialogue schema/order errors: 0.
- AI-1 overlap list: 8 terms documented.
- No blueprint, canonical term/parts DB, crosswalk, quiz bank, schema, UI, main, SQL, migration or production file was modified.
- All files remain isolated under the AI-2 inbox branch and must remain candidate_unverified until AI-1 review.

## Files
- `research.json`
- `term-map.json`
- `sources.json`
- `dialogues.json`
- `readings.json`
- `quiz.json`
- `media_index.json`
- `REPORT.md`


## Latest AI-1 follow-up — dialogue content repair
AI-1's subsequent QA found that the earlier schema repair had left repeated adjacent dialogue content. All 48 turns across the 8 dialogues have now been rewritten with distinct English lines and corresponding Persian translations. The latest commit SHA and fetch-back validation results are reported in the follow-up Issue #1 comment. This package remains `candidate_unverified`; source claim mapping and source review are still outstanding.
