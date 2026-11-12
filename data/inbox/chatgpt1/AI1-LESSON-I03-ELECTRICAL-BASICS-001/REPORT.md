# AI-1 Research Package — I03 Electrical Basics

## Status
Draft lesson package, version 0.1.0, `needs_review`. This is language-learning content with general electrical concepts, not a repair procedure.

## Blueprint alignment
- Blueprint ID: I03
- Level/order: LVL-4 / 3
- Title: Electrical Basics
- Language focus: Describing circuits; open/short/ground
- Target: 14 new terms
- Quiz: QZ-I03 — 12 slots, 75% pass threshold
- Estimated time: 31 minutes
- Featured IDs retained exactly from blueprint: PRT-ELE-001..007 and PRT-DIA-003.

## Candidate vocabulary
14 terms are included in `term-map.json`; all `term_id=null` because the current canonical `terms_batch_01.json` contains 41 engine-focused records and no exact matches for the electrical terms. No IDs were invented.

## Parts mapping
The blueprint featured IDs are retained as references only. Current crosswalk records for PRT-ELE-001..007 have no canonical_part_id and require review; PRT-DIA-003 also requires canonical mapping verification. No part IDs were invented.

## Technical and language notes
- Distinguishes open circuit, short circuit and short to ground.
- Distinguishes designed ground/return path from an unintended short to ground.
- Explains voltage/current/resistance at a qualitative level only.
- No generic voltage, resistance, current or pinout values are supplied.
- No hands-on test steps are prescribed. Any real test requires the exact OEM wiring diagram and safety procedure.
- Renderer-friendly vocabulary, examples, reading.comprehension_questions, guided_practice.items, and 12 quiz slots are provided.

## Sources
The three source entries are broad discovery sources and remain `candidate_unverified`. They are not adequate claim-level evidence. Before publication, add exact manufacturer technical documents and record the relevant passages for each technical claim.

## Publication blockers
1. Canonical term IDs unavailable for all 14 terms.
2. Featured part IDs not canonically mapped.
3. No real, licensed diagram image for QZ-I03-S09.
4. No real audio for QZ-I03-S08.
5. Exact claim-level technical references not yet verified.
6. Browser/device rendering QA not yet performed.

## Files
- lesson.json
- term-map.json
- sources.json
- REPORT.md
