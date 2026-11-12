# AUTO LINGO — Independent Review of Content Verification Protocol v2

- Task ID: AI2-CONTENT-VERIFICATION-PROTOCOL-V2-REVIEW-001
- Reviewed: `AI1-CONTENT-VERIFICATION-PROTOCOL-V2-001`
- Branch / commit reviewed: `ai1-content-verification-protocol-v2-001` / `83d5c1e743ad5a074556fbf67024c9456426ba73`
- Review date: 2026-11-12
- Overall decision: `agree_with_changes`
- Scope: protocol v2, its changelog, and relevant current `database_schema.sql` structures. This is a governance review, not verification of automotive technical content.

## Executive decision

AI-1 has addressed the substance of all ten findings from the first review. The v2 draft is substantially clearer and is suitable to proceed toward owner consideration after a few operational clarifications.

- Prior findings: 9 agree; 1 needs_context (F-06).
- New findings: 4 (3 P1, 1 P2).
- No prior finding is disagreed with.
- Main remaining blocker: the protocol defines stronger evidence and audit requirements than the current schema and QA view can enforce. It correctly says not to migrate without owner approval, but an interim operational mechanism and exact release coverage must be specified before treating v2 as an enforceable production gate.

## 1. Re-review of original findings F-01 to F-10

| Finding | Decision | Review |
|---|---|---|
| F-01 claim vs record status | agree | Claim outcomes and conservative record roll-up are now explicit. The draft correctly avoids adding enum values. Residual caveat is recorded in N-03: claim outcomes need a durable review record. |
| F-02 measurable verified gate | agree | The 11-point YES/NO gate is a meaningful improvement. It correctly blocks verified on any NO/unknown. A reviewer worksheet can operate before schema changes, provided its storage and required fields are standardized. |
| F-03 P2 publication ambiguity | agree | Internal staging is separated from learner-visible release; material P2 issues are blocked. The narrow editorial exception requires explicit owner approval. |
| F-04 P0 accountable safety reviewer | agree | A designated qualified human approver is required and AI cannot clear P0. The owner must operationally identify the approver and competence scope before any P0 content is released. |
| F-05 source conflict/freshness | agree | Revision, effective date, supersession, conflict handling, and dynamic portal locators are addressed. A fixed periodic review interval is not mandated, which is acceptable if event-based re-review triggers are enforced. |
| F-06 schema/source coverage | needs_context | V2 recognizes entity-level citations are not claim-level evidence and requires a coverage inventory. However, the current SQL QA view does not cover all verified-capable entities, and the document's list includes entity types whose schema support differs. See N-01 and N-02. |
| F-07 image provenance | agree | Asset-level rights, attribution, access date, modification, and redistribution permissions are now distinguished from technical identity review. |
| F-08 reviewer independence | agree | Independent first-pass review, retained separate conclusions, role/competence, and unresolved disagreement handling are explicit. |
| F-09 taxonomy/schema constraints | agree | V2 correctly prohibits invented enum values and nearest-fit classification; taxonomy gaps are routed to an owner-approved proposal. |
| F-10 re-review triggers | agree | Concrete triggers and immutable appended review history are now defined. The storage mechanism for that history remains to be made operational (N-03). |

## 2. New findings

### N-01 — Verified release QA coverage is not yet enumerated against the actual schema
- Severity: P1
- Decision: needs_context
- Evidence: current `v_verified_without_source` checks `terms`, `parts`, `systems`, `diagnostics`, and `repair_scenarios`; it does not check `lessons`, `vehicle_models`, or `brands`. The schema also contains verified-capable `vehicle_specifications` and `part_vehicle_compatibility`, each with source fields/checks, but these are not in that view.
- Finding: V2 is correct to demand a coverage inventory, but the exact table-by-table allowlist and automated release gate remain unspecified.
- Recommendation: add a non-mutating coverage matrix to the protocol package: entity/table, whether a verification status exists, whether learner-visible release is possible, required source path, and automated/manual gate. Until the view or equivalent QA is expanded, do not mark excluded verified-capable records verified or release them under an assumed source check.

### N-02 — Quiz and learning-asset release control is not mapped to status-bearing records
- Severity: P1
- Decision: needs_context
- Evidence: the reviewed SQL defines `quizzes` and `quiz_questions` without their own `verification_status` fields. V2 lists quizzes, images, and learning assets among coverage targets.
- Finding: it is unclear whether quiz/question content inherits the parent lesson's release state, has a separate manual QA gate, or is intended to receive new status fields later. Image/asset manifest governance also needs a canonical storage location.
- Recommendation: explicitly define a release dependency rule (for example, quiz/question visibility is blocked unless its quiz and all referenced lesson/term/part/media dependencies pass their applicable gates), or submit a separate schema proposal. Do not imply that a table has a verification status where it does not.

### N-03 — Append-only review history and claim worksheets lack an interim storage contract
- Severity: P1
- Decision: needs_context
- Evidence: v2 requires immutable appended review events and claim outcomes, while the current schema has no dedicated review-event or claim-evidence table in the reviewed SQL excerpt.
- Finding: The protocol is conceptually correct, but until a schema proposal is approved, teams need to know where the worksheet and immutable review history live and how they are keyed to entity IDs/commit hashes.
- Recommendation: define an interim repository-based record format and exact path convention, including task ID, entity ID, claim key, reviewer, timestamp, source IDs/locators, outcome, and supersedes/re-review linkage. Treat it as an audit artifact, not a new production database table. Any later database migration remains owner-approved.

### N-04 — Asset manifest requirements need a canonical file location and validator
- Severity: P2
- Decision: agree_with_change
- Evidence: v2 specifies the required asset-level fields but does not name the canonical manifest path, schema version, or automated validation process.
- Recommendation: nominate a canonical manifest location (or explicitly preserve the existing project manifest as a draft pending audit), version its schema, and validate required license/provenance fields. Do not treat missing rights evidence as permission to use an asset.

## 3. Confirmed improvements and strengths

1. All ten original findings were explicitly dispositioned in the changelog.
2. Claim outcomes and conservative record-level roll-up are clear without silently changing the existing enum.
3. The 11-point verification gate is measurable and auditable.
4. P2 staging and learner-visible publication are clearly separated.
5. P0 clearance requires a qualified human; AI cannot sign off.
6. Source conflicts and document supersession are handled explicitly.
7. Image rights clearance is separated from technical image identification.
8. Taxonomy gaps cannot be hidden by inventing enum values.
9. Review disagreements and historical decisions are preserved.
10. V2 repeatedly protects the owner-controlled release boundary and avoids unauthorized production/schema changes.

## 4. Recommended disposition to AI-1

1. Keep v2 as `proposed`; do not merge or call it adopted yet.
2. Resolve N-01 through N-03 with a short operational appendix or a separate non-mutating coverage matrix and interim audit-record convention.
3. For N-04, identify the canonical asset manifest path and validation owner/tool.
4. After these clarifications, request project-owner approval. No SQL migration is required to approve the governance principles; schema changes, if later needed, must remain a separate owner-approved task.

## 5. Scope and non-actions

- Reviewed protocol v2 and its changelog, plus the current SQL definitions relevant to statuses, source links, and QA view coverage.
- Did not validate the 252 vocabulary records, lesson content, vehicle specifications, or image licenses.
- Did not change AI-1 files, production JSON, SQL, frontend, catalog, progress, verification states, or canonical dataset selection.
- No content was marked verified and no production release was authorized.
