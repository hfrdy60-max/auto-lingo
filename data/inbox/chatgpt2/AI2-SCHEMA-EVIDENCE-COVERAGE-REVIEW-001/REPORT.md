# AUTO LINGO — Independent Review: Schema Evidence Coverage Audit

- Task ID: AI2-SCHEMA-EVIDENCE-COVERAGE-REVIEW-001
- Reviewed branch: `main`
- Reviewed files: `database_schema.sql` and AI-1 report `AI1-SCHEMA-EVIDENCE-COVERAGE-AUDIT-001/REPORT.md`
- Review branch: `ai2-schema-evidence-coverage-review-001`
- Decision: **agree_with_changes**
- Scope: independent static review only. No schema, migration, production data, catalog, status, or frontend changes.

## Executive result

All eight AI-1 findings are substantively supported by the current SQL schema. I agree with F-01 through F-08, with policy qualifications noted below. I also identified two additional structural gaps:

- F-09 (P1): `entity_sources.entity_id` is a polymorphic text field without a foreign key to the referenced entity table; orphan/mistyped entity links can exist.
- F-10 (P1): the current QA view checks only whether a verified row has an entity-source link. It does not check whether the linked source itself is verified, current, accessible, or sufficiently located. Direct-source vehicle tables have the same source-quality limitation.

The SQL header says every content row carries verification status and last-reviewed date, but the actual schema does not satisfy that statement for multiple learning/relation tables. Treat this as documentation/schema-contract drift, not proof that every such table must receive new columns immediately.

## Review of AI-1 findings

| Finding | Review | Rationale |
|---|---|---|
| F-01 Allow-list and QA view mismatch | agree | `entity_sources` accepts eight entity types; `v_verified_without_source` checks only five and omits lessons, vehicle_models, brands. |
| F-02 Vehicle-specific evidence path | agree | Both vehicle tables have direct `source_id` and a CHECK for verified rows, but no common QA coverage for source quality, locator, freshness, or exact applicability. |
| F-03 Learning content evidence gates | agree | `term_translations` has status but no source/reviewer/date; quizzes, questions, and learning_examples have no verification/evidence fields. |
| F-04 Asset provenance | agree | Media is referenced through URLs/JSON without an asset-level provenance and rights contract. |
| F-05 Claim-level evidence | agree | `entity_sources` links sources to records, not individual claims/fields. A free-text citation_note is not a reliable claim-evidence map. |
| F-06 Source verification semantics | agree | Source status and last_checked_at exist, but no enforceable requirements for document revision, exact locator, access outcome, or freshness policy. |
| F-07 Relations/taxonomy review provenance | agree | Synonyms, relations, categories, and join rows lack independent review/evidence states. Whether they inherit parent review is a policy decision, not settled by SQL. |
| F-08 P0 safety approval | agree | `safety_notes` is descriptive only; no structured quarantine, qualified approver, approval timestamp, or release decision exists. |

### Important qualifications

1. F-01 is a confirmed QA coverage defect if lessons, vehicle_models, and brands are allowed to become verified. Owner policy could instead block those statuses, but that restriction is not currently enforced.
2. F-02 does not mean the direct `source_id` design is inherently invalid. It means its checks must be equivalent in outcome to the common evidence QA, including source validity and applicability.
3. F-03 requires an explicit release policy. Inheriting a lesson gate may be acceptable for a quiz container, but individual question correctness, answer keys, explanations, and media still need an accountable review rule. A parent lesson's source does not automatically substantiate each answer.
4. F-04 should distinguish technical correctness from rights clearance. A technically correct image can still be legally unusable.
5. F-07 should not force independent status columns onto every join table by default. Define which relationships materially affect learner meaning and how they are reviewed.
6. F-08 should remain a human-controlled release gate. An AI-generated review record must never count as qualified human safety approval.

## Additional findings

### F-09 — Polymorphic entity_sources references are not referentially enforced (P1)

`entity_sources.entity_table` is constrained to an allow-list and `entity_id` is plain text. Because a conventional foreign key cannot target one of several tables, SQL does not ensure that the referenced entity exists or that its ID belongs to the named table. A typo or deleted entity can leave an orphan evidence link.

**Recommendation:** add a staging QA query that checks each allowed table/entity pair for existence. If a future migration is considered, compare a normalized entity registry against per-table source-link tables; do not redesign before owner approval.

### F-10 — QA verifies link presence, not evidence adequacy (P1)

The view `v_verified_without_source` only detects the absence of an `entity_sources` row. It does not join to `sources.verification_status`, inspect `last_checked_at`, test URL/document accessibility, or require a citation locator. A verified entity linked to an unverified or stale source can therefore pass this view. The vehicle-specific direct-source tables similarly require only a non-null source ID.

**Recommendation:** define separate QA outputs for (a) missing source link, (b) source not verified, (c) source stale/unreachable, and (d) missing precise locator. Do not collapse these into one boolean until the owner approves freshness and source-status policy.

## Proposed non-migration actions

1. Create a table-by-table evidence coverage matrix and explicitly label each table as independently reviewed, parent-gated, or not learner-visible.
2. Add read-only QA queries/tests for all verified-capable entity types, including source status/freshness and orphan polymorphic links.
3. Define release dependencies for quizzes, questions, examples, translations, and media without assuming that a parent lesson proves all child claims.
4. Use repository-based, append-only review artifacts for claim worksheets and P0 human approvals until a separately approved schema design exists.
5. Define an asset manifest contract with a canonical path, schema version, license/attribution fields, and validator.
6. Keep all proposed changes in design/staging until owner approval; no migration is implied by this review.

## Final status

AI-1's eight findings are confirmed, with the qualifications above. Two additional P1 findings are recorded. This review is advisory only. No production SQL, data, verification status, canonical selection, or release state was changed.
