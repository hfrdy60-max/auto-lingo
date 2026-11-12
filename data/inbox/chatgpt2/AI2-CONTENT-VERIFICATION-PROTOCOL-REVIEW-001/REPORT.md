# AUTO LINGO — Independent Review of Content Verification Protocol

- Task ID: AI2-CONTENT-VERIFICATION-PROTOCOL-REVIEW-001
- Reviewed artifact: AI1-CONTENT-VERIFICATION-PROTOCOL-001
- Reviewed branch/commit: `ai1-content-verification-protocol-001` / `f83d55ed90544929149ec3a2af71a8bcff1d29d7`
- Review date: 2026-11-12
- Result: `agree_with_changes` (suitable as a strong draft; not ready to be treated as an adopted release standard without clarifications)

## Executive summary
The protocol is directionally strong and materially improves AUTO LINGO's evidence discipline. Its best decisions are claim-level review, application-specific OEM evidence, explicit uncertainty, separation of editorial agreement from technical verification, preservation of conflicting batches, and owner approval before canonical changes.

I recommend accepting its core principles, but publishing a small revision before operational adoption. The main gaps are: (1) status semantics are not fully operational at claim versus record level; (2) the evidence threshold for `verified` needs a measurable acceptance rule; (3) P2 release wording is potentially unsafe/ambiguous; (4) safety review and escalation ownership need definition; (5) source/evidence metadata and image licensing need a more explicit data contract; and (6) review independence, conflicts, and re-review triggers need definition.

This review does not approve or modify the protocol, schema, production data, or verification statuses.

## Findings

### F-01 — Claim-level versus record-level status is underspecified
- Severity: P1
- Decision: needs_context
- Protocol sections: 2, 5, 6
- Finding: Section 2 correctly decomposes records into claims, but Section 5 defines statuses as though they apply to a record without specifying how mixed claim outcomes roll up. A record may have well-supported terminology but an unsupported vehicle-specific numeric value.
- Recommendation: define claim-level review outcomes and an explicit record roll-up rule. For example, a record cannot be `verified` while any material claim is `unknown`, `needs_review`, or unsupported; optionally distinguish `verified_generic` from application-specific verification if product/schema design permits.
- Evidence needed: owner decision on whether statuses remain record-level only or become claim-level entities.

### F-02 — The `verified` threshold needs an auditable checklist
- Severity: P1
- Decision: agree_with_change
- Protocol sections: 4, 5, 9
- Finding: "all material claims ... checked against adequate evidence" is correct but subjective. Different reviewers may interpret "adequate" differently.
- Recommendation: require each material claim to have (a) a source fit for the claim and scope, (b) exact supporting locator or a documented reason why no page locator exists, (c) reviewer conclusion, (d) unresolved-conflict check, and (e) scope label. Define exceptions for sources such as dynamic OEM portals where page numbers are unavailable.
- Schema note: current `entity_sources.citation_note` can store a page/section/URL fragment, but it does not itself enforce claim-level mapping. Consider a separate claim-evidence structure only if the current mapping proves insufficient; do not silently assume one source supports every field.

### F-03 — P2 publication rule is ambiguous
- Severity: P1
- Decision: needs_context
- Protocol section: 6
- Finding: P2 says the issue must be resolved before verified status, then says the item "may be published only if clearly labelled draft and not misleading." It is unclear whether this means publication in the learner-facing application, internal staging only, or visible draft content. For automotive education, a missing citation or ambiguous relation can still mislead.
- Recommendation: distinguish internal authoring/staging from learner-visible publication. Define a deny-list for P2 cases that affect meaning, diagnosis, component identity, safety, or application scope; these should remain unpublished until resolved. Permit learner-visible draft only for explicitly non-material editorial gaps with visible draft labeling and an owner-approved rule.

### F-04 — P0 safety gate needs accountable reviewer and escalation route
- Severity: P1
- Decision: agree_with_change
- Protocol sections: 6, 7, 9
- Finding: "safety review" is required for P0, but the role, minimum competency, response time, and escalation path are not defined. A generic second AI review should not count as safety approval.
- Recommendation: identify a human accountable safety approver (or formally designated qualified reviewer), define immediate quarantine/blocking, and specify that AI agreement cannot independently clear P0. Include hazardous high-voltage, fuel, lifting/support, rotating machinery, braking, airbag/pretensioner, and chemical exposure topics in the safety review checklist.

### F-05 — Source hierarchy is strong but needs conflict and freshness rules
- Severity: P2
- Decision: agree_with_change
- Protocol sections: 3, 4
- Finding: The hierarchy is appropriate, but it does not state what to do when two OEM documents conflict, when a superseded revision is found, or when a source is withdrawn/updated.
- Recommendation: record revision/effective date and supersession status; prefer the document applicable to the exact vehicle build and service date; preserve conflicts as unresolved rather than choosing silently; define periodic re-check triggers for changing specifications and service bulletins.

### F-06 — Schema fit is mostly good, but source coverage is incomplete
- Severity: P1
- Decision: needs_context
- Protocol sections: 4, 8, 11
- Finding: The reviewed SQL schema includes `sources.last_checked_at`, `entity_sources.citation_note`, and a verified-without-source QA view for terms/parts/systems/diagnostics/scenarios. This supports basic source linkage. However, the view does not cover lessons, vehicle_models, or brands, and the mapping is entity-level rather than explicitly claim-level. Several records also have `last_reviewed_at` but sources have `last_checked_at`; their distinct meanings should be stated consistently.
- Recommendation: either extend QA coverage for every entity type eligible for `verified`, or explicitly state which tables are excluded and why. Define whether a single entity-level citation is sufficient (it generally is not for multi-claim lessons/diagnostics). Keep source review date separate from content review date.

### F-07 — Image section needs a complete asset provenance contract
- Severity: P2
- Decision: agree_with_change
- Protocol section: 7 / Images
- Finding: The protocol correctly requires identity, legibility, ownership, license, source page, and attribution. It should also require asset-specific license evidence, access date, modification/crop status, attribution text, and a record of whether commercial/educational redistribution is permitted. A search result or direct image URL is not a license grant.
- Recommendation: define mandatory image manifest fields and block use where license terms are unclear or incompatible. Separate technical identity verification from copyright/license clearance.

### F-08 — Two-reviewer independence and disagreement handling need detail
- Severity: P2
- Decision: agree_with_change
- Protocol section: 9
- Finding: The workflow is sound, but "independent" is not defined. It should prevent the second reviewer from merely copying the first review, and specify how conflicts are resolved.
- Recommendation: second reviewer records findings before seeing the first review where practical; retain both review records; disagreements remain open until evidence or owner decision resolves them. State that AI reviewers are assistants, not substitutes for qualified human approval on safety-critical or vehicle-specific claims.

### F-09 — Taxonomy guidance is useful but should defer to schema constraints
- Severity: P2
- Decision: agree_with_change
- Protocol section: 7 / Term kind and taxonomy
- Finding: The protocol's taxonomy guidance aligns with the current `term_kind` enum for the listed kinds. The schema has no explicit assembly, fluid/consumable, or material kind, so the instruction to "split the concept or record the ambiguity" is prudent but not sufficient to resolve existing cases.
- Recommendation: explicitly say reviewers must not invent enum values or force a nearest-fit category. Route unrepresentable concepts to a separate taxonomy/schema proposal approved by the owner.

### F-10 — Re-review triggers and audit trail should be explicit
- Severity: P2
- Decision: agree_with_change
- Protocol sections: 4, 8, 9
- Finding: The protocol describes intake and post-release history, but does not define when already-reviewed content must be re-opened.
- Recommendation: define triggers such as OEM service bulletin/revision, standard edition change, correction report, newly discovered contradiction, vehicle application expansion, translation change, image license change, or schema migration. Keep prior review decisions immutable and append a new review event.

## Confirmed strengths
1. Claim-by-claim evidence prevents a broad source link from being misused to support every field.
2. OEM-specific service data is required for vehicle-specific values and procedures.
3. DTCs and symptoms are correctly treated as evidence, not automatic proof of component failure.
4. The protocol correctly rejects structural JSON validity and AI consensus as technical verification.
5. It preserves both Batch 01 variants and refuses to infer canonical status from upload timestamps.
6. It correctly distinguishes content review dates from import/generation/upload dates.
7. Owner approval before canonical production changes is an essential release gate.

## Recommended disposition
- Accept the core principles.
- Request a revision addressing F-01 through F-10, prioritizing P1 findings F-01, F-02, F-03, F-04, and F-06.
- Then ask AI-1 to issue a revised protocol version and a concise change log.
- Owner approval remains required before adoption into main or before using it as a binding production gate.

## Scope and non-actions
- Only the proposed protocol and relevant portions of the current SQL schema were reviewed.
- No production JSON, SQL, frontend, catalog, progress file, or AI-1 artifact was changed.
- No content was marked verified; no canonical batch was selected.
- This is an independent process review, not technical verification of the 252 vocabulary records or any lesson.
