# AUTO LINGO — Protocol v2 Operational Appendix

- Task ID: AI1-PROTOCOL-V2-OPS-APPENDIX-001
- Parent: AI1-CONTENT-VERIFICATION-PROTOCOL-V2-001
- Status: proposed / owner approval required
- Purpose: resolve AI-2 review findings N-01 through N-04 without changing production SQL or content.

## A. Table-by-table verification and release coverage (N-01)

This matrix describes the reviewed `database_schema.sql` and its current `v_verified_without_source` view. "Manual gate" below is a proposed interim workflow, not an existing database constraint.

| Table/entity | Has verification_status? | Evidence path currently present | Current QA view? | Interim learner-visible rule |
|---|---|---|---:|---|
| terms | Yes | entity_sources | Yes | Block unless record and material claims pass protocol gate |
| parts | Yes | entity_sources | Yes | Same |
| systems | Yes | entity_sources | Yes | Same |
| diagnostics | Yes | entity_sources | Yes | Same; DTC/application scope must be explicit |
| repair_scenarios | Yes | entity_sources | Yes | Block P0 pending qualified human safety approval |
| lessons | Yes | entity_sources | No | Block unless manual evidence/review packet passes; current view does not protect it |
| brands | Yes | entity_sources | No | Block until manual evidence/review packet passes |
| vehicle_models | Yes | entity_sources | No | Block until manual evidence/review packet passes |
| vehicle_specifications | Yes | direct source_id + CHECK when verified | No | Exact vehicle/build source locator and manual review required |
| part_vehicle_compatibility | Yes | direct source_id + CHECK when verified | No | Exact fitment/OEM evidence and manual review required |
| term_translations | Yes | No source/reviewer/date fields | No | Do not release independently; manual translation review packet required |
| sources | Yes (source-level) | Source metadata fields | No | A source being verified does not verify content that cites it |
| quizzes | No | lesson_id relation only | No | Block unless parent lesson and every question/dependency pass manual release review |
| quiz_questions | No | quiz_id plus optional term_id/part_id/media_url | No | Block unless quiz, question answer/explanation, and all referenced dependencies pass manual review |
| learning_examples | No | term_id / optional lesson_id | No | Block unless linked term/lesson and the example itself pass manual review |
| categories | No | None | No | Taxonomy content stays draft until reviewed in a category review packet |
| term_synonyms / related_terms | No | Parent term relation only | No | Treat each material synonym/relation as part of the parent term review packet; unresolved items block release |
| join tables (part_terms, system_components, lesson_terms, etc.) | No | Foreign-key relationships | No | Review material relationships with the parent record; check all references resolve |
| media URLs / embedded media | No dedicated asset entity | URL/JSON fields | No | Block use until asset manifest rights and technical-identity gates pass |
| entity_sources | No | Entity-to-source link and citation_note | No | Evidence index only; not a verification status or claim-level proof |

### Exact current automated coverage

- `entity_sources.entity_table` permits: terms, parts, systems, diagnostics, repair_scenarios, lessons, vehicle_models, brands.
- `v_verified_without_source` checks only: terms, parts, systems, diagnostics, repair_scenarios.
- `vehicle_specifications` and `part_vehicle_compatibility` have direct-source CHECK constraints but are absent from that view.
- `term_translations` has a verification_status field but no source relation in the reviewed schema.
- `quizzes`, `quiz_questions`, and `learning_examples` have no verification_status fields.

Therefore, the current view is a partial check, not a complete publication gate. Until an owner-approved QA/schema change expands coverage, the manual release register below is mandatory for all tables not fully covered by the view. No record may be marked verified merely because it is absent from the view.

## B. Interim dependency-based release rules for quizzes and learning assets (N-02)

These rules are manual release controls pending any approved schema design:

1. A quiz is learner-visible only if its linked lesson (when present) is eligible for learner-visible release.
2. Every question must be reviewed as a complete unit: prompt, options, correct answer, explanation, difficulty, and any image/audio.
3. If a question references a term or part, that referenced record must pass its own applicable release gate. A question cannot make an unverified dependency safe by repeating it.
4. Every learning example must pass its own language/technical review and its linked term and lesson dependencies must pass their gates.
5. Media attached to a quiz/question/example must pass the asset manifest's rights gate and technical identity gate.
6. If a dependency is missing, unresolved, unverified, or blocked, the dependent quiz/question/example remains blocked.
7. The release reviewer records the dependency IDs and their review packet IDs in the release worksheet. This is not a database constraint and must not be represented as one.

No new verification_status column is assumed for quizzes, quiz_questions, or learning_examples. A future schema proposal may add one, but that requires separate owner approval.

## C. Interim append-only review record contract (N-03)

Until a database review-event/claim-evidence schema is approved, store review packets in the repository using this convention:

`data/reviews/<entity_table>/<entity_id>/<REVIEW-ID>.json`

Examples:
- `data/reviews/terms/TERM-000001/REV-2026-000001.json`
- `data/reviews/quiz_questions/QQ-000001/REV-2026-000002.json`

Each packet must include:
- `review_id`, `task_id`, `entity_table`, `entity_id`;
- `source_commit` (commit hash of the exact content version reviewed);
- `reviewed_at` (ISO-8601 timestamp with timezone);
- `reviewer` (name/agent, role, competency scope; AI must be labelled AI);
- `claims[]`: stable `claim_key` (JSON pointer or field path), claim text/scope, outcome, severity, rationale;
- `evidence[]`: source_id, exact title/publisher, document revision/date, URL or document ID, locator, application scope, access date;
- `issues[]`, `required_actions[]`, `decision`, and `limitations`;
- `supersedes_review_id` for a later review, or null for the first review.

Append-only rules:
- Never edit or overwrite a committed review packet to change its conclusion.
- Corrections require a new review ID and a new packet that references the prior packet in `supersedes_review_id`.
- Keep review packets in Git history; a new review does not erase the old one.
- Store each independent review separately, preserving reviewer conclusions.
- The review packet is an audit artifact, not a production database row and not proof that a record is verified by itself.
- A record's `last_reviewed_at` may be updated only through a separately approved content patch after substantive review; do not derive it from packet creation/import time.

## D. Canonical asset manifest and validation (N-04)

Proposed canonical location:
`data/assets/asset_manifest.json`

Proposed validator:
`scripts/validate_asset_manifest.py`

The existing root `parts_image_manifest.json` remains a legacy image-requirements/catalog manifest. It is not the canonical rights/provenance register and must not be silently moved, overwritten, or treated as proof of license. Existing media stays blocked until represented and cleared in the proposed asset manifest.

The manifest starts empty intentionally. No existing image is presumed licensed or technically approved. Its structure is versioned in `data/assets/asset_manifest.schema.json`; the validator checks structural completeness and release eligibility fields. It cannot independently prove that a license statement is authentic or that an image depicts the correct component; human review and source evidence remain required.

Required gates for each asset:
- rights status is `cleared` with exact license/permission evidence and required attribution;
- distribution and modification permissions are explicitly recorded;
- technical identity status is `approved` by a named reviewer;
- source URL/provider, creator/rights holder, access date, and asset hash are recorded;
- no unresolved rights or identity issue remains.

## E. No schema or production changes

This appendix does not change SQL, migrations, frontend, production JSON, catalog, progress, or verification statuses. It is a proposed interim operating procedure. Owner approval is required before adoption. Any future schema migration must be a separate task with backup, staging test, test fixtures, and rollback plan.
