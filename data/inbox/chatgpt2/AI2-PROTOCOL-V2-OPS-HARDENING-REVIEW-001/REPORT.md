# AI-2 Independent Review — Protocol v2 Operational Hardening

- Task: AI2-PROTOCOL-V2-OPS-HARDENING-REVIEW-001
- Reviewed branch: `ai1-protocol-v2-ops-hardening-001`
- Reviewed commit: `66adb3ca274f4bc325cceb968182c0e20af04f82`
- Baseline schema: `main:database_schema.sql`
- Decision: **agree_with_changes — not ready for owner adoption**
- Scope: static review of addendum, v1.1 manifest, JSON Schema, Python validator, read-only SQL, review-packet schema, and protocol-v2 consistency.

## Executive result

The hardening package materially improves the prior draft. The proposed manifest now blocks `eligible` assets when the manifest is `proposed`, requires explicit permission booleans and reviewer/date fields, and can verify local SHA-256 values. The SQL diagnostics are SELECT-only and address the principal polymorphic-link and source-quality gaps. The addendum correctly keeps production changes and owner decisions separate.

However, this is **not yet a complete, adoption-ready control package**. I found 5 P1 and 4 P2 issues. Most importantly, the review-packet schema conflicts with protocol v2's claim outcomes and permits a reviewer record to declare `decision=verified` without separating an AI recommendation from an accountable human release decision. The asset validator also needs stronger scope-aware permission and path checks.

## Findings

### H-01 — P1 — Review-packet claim outcomes conflict with protocol v2
The protocol defines `supported`, `contradicted`, `unresolved`, and `not_applicable`. The supplied `data/reviews/review_packet.schema.json` instead allows `supported`, `contradicted`, `uncertain`, and `not_reviewed`.

**Required:** align the schema enum exactly with protocol v2; if legacy terms are intentionally retained, document a deterministic mapping and version it. Do not silently mix vocabularies.

### H-02 — P1 — Review packet conflates reviewer decision with verification/release authority
The schema allows `decision: verified` for any packet, including one whose reviewer_type is `AI`. Protocol v2 says AI cannot substitute for accountable human approval and cannot clear P0. This is a governance bypass if downstream tooling interprets the field literally.

**Required:** represent the packet outcome as a review recommendation (for example `recommendation`) and keep owner/release authorization in a separate, human-attributed release register. At minimum, prohibit an AI reviewer from recording an authoritative verified/released decision. P0 must require a named qualified human safety approver.

### H-03 — P1 — Evidence entries are not linked to the claims they support
The evidence objects contain source and locator metadata but no `claim_keys`/claim mapping. This repeats the protocol's explicit warning that entity-level linkage does not establish claim-level traceability.

**Required:** add a required, non-empty list of claim keys to each evidence item (or an explicit claim-evidence relation array); validate that every referenced key exists in `claims`. Require each material claim to have evidence or an explicit unresolved/not-applicable rationale.

### H-04 — P1 — Review packet entity identity is unconstrained
`entity_table` and `entity_id` accept arbitrary non-empty strings. A malformed or unsupported table/entity can therefore pass the schema.

**Required:** constrain entity_table to the supported schema/reviewable entity set, or define an explicit versioned registry for non-table assets and learning objects. Add table-specific ID patterns or a registry validation step. Include quizzes/questions/examples, which are not all verification_status-bearing entities but do require independent review packets.

### H-05 — P1 — Asset eligibility is not tied to the intended distribution/use scope
The manifest records four booleans, but the validator accepts an asset as eligible even when the permission relevant to the actual deployment is false (e.g. commercial=false), because no intended use/distribution profile is supplied. The separate release register is useful, but the asset's eligible state is ambiguous without a declared scope.

**Required:** define the intended release profile (educational/commercial/redistribution/derivatives) at manifest or release-register level and enforce that all required permissions are true for that profile. Explicit false values should remain valid for non-required permissions, but must block incompatible releases.

### H-06 — P2 — Validator can crash on malformed URLs and accepts looser dates than JSON Schema
`urlparse` can raise `ValueError` for malformed bracketed hosts; `urlok` does not catch it. Python `date.fromisoformat` accepts some compact forms that JSON Schema's date format expects in canonical form.

**Required:** catch URL parsing exceptions and validate canonical YYYY-MM-DD by round-trip equality. Add negative fixtures for malformed URLs, wrong JSON types, bad dates, extra keys, and malformed arrays.

### H-07 — P2 — File path safety is enforced only with --verify-files
The validator checks absolute paths and `..` only inside the optional hash-verification branch. A default validation can therefore accept an unsafe path string.

**Required:** always validate repository-relative path syntax and containment; make file existence/hash verification optional if desired. Resolve the candidate path and ensure it remains under repository root (including symlink considerations when files exist).

### H-08 — P2 — Manifest schema and custom validator are not proven equivalent
The custom validator is stricter than some schema constraints in places, while the JSON Schema does not encode all conditional eligibility rules. No fixtures or automated parity tests are included. The addendum explicitly notes validator/CI work remains incomplete.

**Required:** add a test suite with valid and invalid fixtures and, where feasible, validate fixtures against both JSON Schema and Python validator. Document intentional differences. Treat the manifest as non-operational until CI runs these tests.

### H-09 — P2 — Review packet does not enforce unique claim keys or supersession integrity
Duplicate claim_key values make claim-to-evidence mapping ambiguous. `supersedes_review_id` is an unrestricted string and cannot prove the referenced packet exists or belongs to the same entity.

**Required:** use `uniqueItems`-compatible claim objects or CI checks for unique claim_key; validate supersedes references against prior committed packets and require same entity/task lineage.

## SQL review against main

- F-09 diagnostic query covers all eight allowed `entity_sources.entity_table` values in main: terms, parts, systems, diagnostics, repair_scenarios, lessons, vehicle_models, brands. It flags missing/mismatched polymorphic targets. This is a reasonable read-only workaround; it does not create a real FK and should not be described as equivalent to referential integrity.
- Verified-without-entity-source UNION covers the same eight entity types. This supplements the existing view, which only covers five.
- Source-quality query uses columns present in main: `sources.verification_status`, `sources.last_checked_at`, and `entity_sources.citation_note`.
- Vehicle-specification and part-fitment queries use columns present in main and correctly acknowledge that part-fitment has no locator field.
- The 365-day interval is clearly labelled a test placeholder. It must not become a production freshness rule without owner approval and source-class-specific policy.
- All supplied statements are SELECT-only. No migration or live database execution was performed.

**Additional SQL caution:** the orphan query's `ELSE true` branch reports unsupported entity_table values as invalid, which is appropriate as a defensive check. The query still cannot guarantee uniqueness/correctness of source-to-claim evidence; that remains a separate review-packet concern.

## Review packet schema / protocol consistency

In addition to H-01 through H-04 and H-09:
- `reviewed_blob_sha` is described as a content digest; confirm whether it is specifically a Git blob SHA-1 (40 hex) or a SHA-256 digest. The current field name/documentation is ambiguous.
- JSON Schema `format` checks may be annotation-only depending on validator configuration; CI must enable format assertion or validate timestamps/dates independently.
- The schema permits an empty claims/evidence array. A packet for an entity with no claims may be legitimate only with a documented reason; otherwise require non-empty claims and define evidence expectations.
- The schema's decision enum should not use the database's `verification_status` value `verified` as an AI review conclusion.

## Owner decision readiness

The package is **not ready to be adopted as-is** because H-01 to H-05 are P1 governance/traceability blockers. Once these are addressed and negative fixtures pass, the technical package can be presented to the owner as a proposed governance bundle.

Still requiring explicit owner decisions:
1. Rights policy and intended distribution profiles.
2. Named qualified human safety approver and release authority.
3. Source freshness windows by source class/application.
4. Branch protection/rulesets and CI enforcement for append-only review packets.
5. Whether to retain polymorphic `entity_sources` with QA diagnostics or propose a future normalized FK design.
6. Adoption of protocol v2, operational appendix, manifest policy, and review-packet convention.

No AI-1 files, main files, SQL, migration, production data, verification states, canonical selection, or frontend were changed by this review.
