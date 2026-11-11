# AI-1 Term Content Triage 001

## Scope
Preliminary editorial and taxonomy review of the 252-term archived set in `AUTO_LINGO_DATABASE_COMPLETE (1).zip`. This is not an external technical fact-check.

## Summary
- 20 candidate review findings recorded.
- 8 P1 and 12 P2 findings.
- No source record changed.
- No record was marked verified.
- No canonical version was selected.

## Additional field-level checks
- All 252 records have non-empty core text fields (English/Persian term, pronunciation, IPA, technical definition, simple explanation, difficulty, status, and date fields).
- All 134 `part` records populate the five part-oriented fields; the 118 non-part records set those fields to null.
- 38 records have an empty `synonyms` array.
- `last_reviewed_at` is set to the same date (2026-11-11) for all 252 records, despite all records being unverified and having no reviewer/source trace. This may be an import/generation date rather than a real review date; clarify before relying on it.
- `Condenser` is a synonym of Capacitor while also a separate AC-system term; `Reflash` is an alias for both ECU Programming and Flashing. Both need disambiguation.

## Highest-priority examples
| ID | Field | Finding |
|---|---|---|
| TERM-000083 / 084 | kind | Complete manual/automatic transmission assemblies are classified as `part`. |
| TERM-000094 | term_fa | Pressure Plate translated as `صفحه کلاچ`, easily confused with Clutch Disc. |
| TERM-000073 | term_fa | Crankshaft Position Sensor rendered only as `سنسور دور موتور`, losing the position/angle meaning. |
| TERM-000243 | term_fa | Stalling rendered as `خاموش کردن موتور`, which means causing the engine to stop rather than unintended engine shutdown. |
| TERM-000208 | concept scope | Bearing conflates rolling-element and plain/journal bearing concepts. |
| TERM-000224 | related_terms | References Seat Belt Pretensioner, absent from all six archived batches. |

## Full findings
See `findings.json` for all 17 IDs, priorities, fields, rationale, and recommended review action.

## Important limits
- Findings are candidates for human/technical review, not final corrections.
- No web/OEM/standard source verification was performed in this triage.
- The root-level Batch 01 conflict remains unresolved and was not included in this editorial pass.
- Do not import these recommendations directly into canonical data without review.
