# AUTO LINGO — Schema Evidence Coverage Audit

- Task ID: AI1-SCHEMA-EVIDENCE-COVERAGE-AUDIT-001
- Date: 2026-11-12
- Reviewed: `database_schema.sql` on `main`
- Status: proposed audit findings only
- Non-actions: no SQL, migration, production data, frontend, or verification status changed.

## Executive summary

The schema has a useful source-link foundation, but it does not yet implement all evidence and release gates proposed in protocol v2. The most important gap is that the `entity_sources` allow-list and `v_verified_without_source` QA view cover different, incomplete subsets. Several entity types can be marked verified without being detected by the current QA view; other learner-facing content has no source or verification mechanism at all.

## 1. Evidence coverage matrix

| Table/entity | Verification status? | Evidence path | In QA view? | Finding |
|---|---:|---|---:|---|
| terms | Yes | entity_sources | Yes | Entity-level only; no claim mapping |
| parts | Yes | entity_sources | Yes | Entity-level only |
| systems | Yes | entity_sources | Yes | Entity-level only |
| diagnostics | Yes | entity_sources | Yes | Multi-claim record needs more granular evidence |
| repair_scenarios | Yes | entity_sources | Yes | Safety approval not represented |
| lessons | Yes | entity_sources | No | Verified-without-source can escape QA view |
| vehicle_models | Yes | entity_sources | No | Verified-without-source can escape QA view |
| brands | Yes | entity_sources | No | Verified-without-source can escape QA view |
| vehicle_specifications | Yes | direct source_id + CHECK | No | Source existence required, but scope/freshness/locator not checked |
| part_vehicle_compatibility | Yes | direct source_id + CHECK | No | Same direct-source limitation |
| term_translations | Yes | None | No | Can be verified without source/reviewer/date |
| quizzes / quiz_questions | No | None | No | Learner-facing assessment has no verification gate |
| learning_examples | No | None | No | Learner-facing examples have no verification gate |
| term_synonyms / related_terms / join tables | No | Indirect only | No | Relations/synonyms have no independent provenance |
| categories | No | None | No | Taxonomy labels/descriptions have no verification workflow |
| media URLs / embedded assets | No asset table | URL/JSON fields | No | No asset-level rights/provenance contract |

## 2. Findings

### F-01 — Allow-list and QA view are inconsistent (P1)
The `entity_sources.entity_table` constraint permits eight entity types: terms, parts, systems, diagnostics, repair_scenarios, lessons, vehicle_models, and brands. The QA view checks only five, omitting lessons, vehicle_models, and brands. These can therefore be marked verified without a source and escape the current view.

**Recommendation:** align the allow-list and QA coverage for every entity eligible for verified status, or explicitly block verified status for excluded types.

### F-02 — Vehicle-specific tables use a separate evidence path (P1)
`vehicle_specifications` and `part_vehicle_compatibility` have direct `source_id` fields and CHECK constraints requiring a source when verified. However, they are absent from the common QA view. A foreign key proves only that a source row exists; it does not prove exact vehicle/build applicability, source currency, or a precise citation locator.

**Recommendation:** document this as a distinct evidence pattern with equivalent QA checks, or propose a unified model. Do not remove existing CHECK constraints without an approved replacement.

### F-03 — Some learner-facing content has no evidence gate (P1)
`term_translations` has verification status but no source link, reviewer identity, or review date. `quizzes`, `quiz_questions`, and `learning_examples` have no verification status or source linkage. Incorrect answers and misleading examples could therefore be exposed without a content-level release gate.

**Recommendation:** define whether these assets are independently reviewed or inherit a strictly specified parent gate. A lesson source must not automatically be assumed to validate every question/example.

### F-04 — Asset provenance is not represented (P1)
Media appears through `media_url`, `audio_url`, JSON content, and other URL-bearing fields. There is no asset entity enforcing creator, exact license, attribution, access date, modifications, or redistribution permissions.

**Recommendation:** introduce an asset manifest in a separately approved design. Keep technical identity review and copyright/license clearance as separate gates.

### F-05 — Entity-level citation is not claim-level evidence (P1)
`entity_sources` links a source to an entity and stores one free-text `citation_note`. It cannot reliably show which source supports which claim/field in a multi-claim lesson, diagnostic, repair scenario, or specification.

**Recommendation:** keep it as a coarse source index; use a structured review worksheet for now. Propose a claim-evidence mapping only after the owner decides required granularity. Do not claim automated claim-level traceability.

### F-06 — Source verification semantics are under-constrained (P2)
The `sources` table has `verification_status` and `last_checked_at`, but no rule requires a document identifier/URL, revision, locator, or checked date when a source itself is verified. An entity may link to an unverified or stale source.

**Recommendation:** distinguish source currency from content review and add QA for source status, revision, access, and freshness.

### F-07 — Synonyms, relations, and taxonomy lack review provenance (P2)
`term_synonyms`, `related_terms`, `categories`, and join tables have no review state or evidence mapping. A correct term can still expose a misleading synonym or relation.

**Recommendation:** decide whether these are reviewed as part of the parent record or independently; if inherited, define the rule so material unreviewed relations cannot hide behind a verified parent.

### F-08 — P0 safety approval is not structured in the schema (P1)
The schema includes `safety_notes` for repair scenarios but no severity, quarantine state, qualified human approver, approval timestamp, or release decision. Protocol v2 requires accountable human approval for P0; ordinary `verified` cannot prove that approval.

**Recommendation:** initially use a controlled quarantine workflow and audit record. Consider structured safety-review fields/table in a separate approved migration. Never infer safety clearance from ordinary verified status.

## 3. Suggested next steps — no migration yet

1. Decide which entity types may be learner-visible and which may be marked verified.
2. Define inheritance/independent review for translations, quiz questions, examples, synonyms, relations, and assets.
3. Draft a schema v1.1 proposal covering complete QA coverage, source freshness, asset provenance, safety approval history, optional claim-evidence mapping, and immutable review events.
4. Build test fixtures proving every verified entity without adequate evidence is detected.
5. Only after owner approval: backup, staging migration/test, rollback plan, then controlled execution.

## 4. Owner decisions required

- Should lessons, vehicle_models, and brands be eligible for verified now, or blocked until QA coverage expands?
- Should quiz questions, examples, and translations have independent verification or inherit a defined parent gate?
- Should vehicle specifications retain direct source_id with equivalent QA, or move to a common evidence relation?
- Is a claim-evidence table required now, or is a structured review worksheet sufficient for first release?
- Who is the qualified human safety approver for P0 content?

## 5. Final status

The current schema is a useful architecture draft but does not yet enforce all protocol v2 requirements. This report is a proposed audit artifact only. No production SQL or content changed, no migration ran, and no record was promoted to verified.
