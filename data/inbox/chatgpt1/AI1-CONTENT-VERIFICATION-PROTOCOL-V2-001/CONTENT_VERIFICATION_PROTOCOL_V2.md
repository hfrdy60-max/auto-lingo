# AUTO LINGO — Content Verification Protocol v2

- Task ID: AI1-CONTENT-VERIFICATION-PROTOCOL-V2-001
- Version: 2.0.0-draft
- Date: 2026-11-12
- Status: proposed / owner approval required
- Supersedes draft for review: `AI1-CONTENT-VERIFICATION-PROTOCOL-001`
- Scope: terminology, components, systems, diagnostics, lessons, vehicle-specific service information, images, and learning assets.

## 1. Purpose and authority

This protocol defines evidence, review, safety, release, and audit requirements for AUTO LINGO content. It is a proposed governance standard, not evidence that existing content is correct. It does not select a canonical dataset or authorize production changes.

Only the project owner may adopt this protocol, approve schema changes, select canonical sources, or authorize production release. AI reviewers assist with research and QA; agreement between AI systems is never a substitute for evidence or accountable human approval.

## 2. Review claims, not just records

Decompose each content record into material claims. Depending on the record, claims may cover:
- concept identity, English headword, part of speech, and taxonomy;
- Persian equivalent, transliteration, regional usage, and synonyms;
- definition, function, operating principle, and location;
- symptoms, causes, diagnostic interpretation, tests, and expected results;
- numeric specifications, wiring, pinouts, torque, pressure, resistance, voltage, fluid, calibration, and procedures;
- safety warnings and application limits;
- image identity, caption, provenance, and reuse rights.

A source supports only the claim and scope it actually documents. Do not infer that one citation validates every field in a record.

### Claim review outcomes

Use a review worksheet (or a future claim-review table if approved) with these outcomes:
- `supported`: adequate evidence supports the claim within its stated scope;
- `contradicted`: adequate evidence conflicts with the claim;
- `unresolved`: evidence is absent, insufficient, ambiguous, or conflicting;
- `not_applicable`: the claim does not apply to this record, with a reason.

These are claim-review outcomes, not new values for the existing `verification_status` enum.

### Record-level roll-up

Until the owner approves a claim-level schema, the database `verification_status` remains record-level. Apply this conservative rule:
- `verified`: every material claim required for the declared publication scope is `supported`; required sources and locators are recorded; no unresolved P0/P1 issue or material contradiction remains; the required qualified human review is complete.
- `needs_review`: a concrete ambiguity, conflict, missing evidence, or unresolved issue has been identified.
- `unverified`: content has not completed substantive review.
- `unknown`: the fact is genuinely not known or cannot currently be established.

A record cannot be `verified` if any material claim is unresolved, contradicted, unsupported, or outside the declared scope. Do not let a verified generic claim imply that vehicle-specific values or procedures are verified. If the product needs separate generic and application-specific states, submit a schema proposal; do not invent status values.

## 3. Source hierarchy and conflict handling

Select evidence appropriate to the claim:
1. Exact-application OEM service information for make, model, year, engine, market, build, and configuration.
2. OEM technical documentation / official service bulletins for architecture, wiring, DTC strategy, calibration, and ECU behavior.
3. Actual component manufacturer's technical documents for component design and general operating principles.
4. Exact published SAE/ISO standard, designation, edition, and relevant clause for standardized terminology or diagnostics.
5. Reputable technical textbooks and manufacturer training material for general education.
6. Secondary websites/forums as discovery leads only, not sole evidence for safety-critical or vehicle-specific instructions.

Record title, publisher, document number, revision/edition, effective/publication date, application scope, URL or document identifier, access date, and exact page/section/table/figure/clause. For dynamic portals without stable page numbers, record the document identifier, section heading, URL, access date, and a short locator explanation.

When sources conflict:
- do not silently choose one or average values;
- check application/build scope, revision, effective date, supersession, and applicable service bulletin;
- prefer the current authoritative document applicable to the exact vehicle configuration;
- preserve unresolved conflicts and block verification of the affected claim until resolved by evidence or an accountable owner decision.

A publisher homepage, search result, or bare URL is not evidence for a specific technical claim.

## 4. Minimum evidence and data contract

For every material claim intended for publication, retain:
- stable entity ID and field/claim being supported;
- source ID and source type;
- exact source title, publisher/manufacturer, document number where available;
- URL/document identifier and revision/edition/date;
- page, section, table, figure, clause, or dynamic-document locator;
- application scope (generic or exact vehicle configuration);
- reviewer identity, review date, conclusion, and concise rationale;
- unresolved limitations or conflicts.

Use existing `sources` and `entity_sources` where suitable. The current `entity_sources.citation_note` can hold a precise locator and claim note, but entity-level linkage alone may be insufficient for records with multiple independent claims. Do not claim claim-level traceability unless the mapping actually identifies which claim the source supports. If current schema cannot represent the evidence contract, document a separate migration proposal and obtain owner approval before changing SQL.

Distinguish dates:
- `sources.last_checked_at`: date the source itself was checked for currency/accessibility;
- content `last_reviewed_at`: date the content was substantively reviewed;
- `created_at` / import provenance: creation, generation, or import time.
Never copy an import date into `last_reviewed_at`. Do not backdate or mass-fill review dates.

## 5. Measurable gate for verified

Before a record may be marked `verified`, the reviewer must answer YES to all applicable checks:
1. Is the concept and taxonomy correct for the declared scope?
2. Is every material factual claim listed and individually assessed?
3. Does each material claim have a source fit for that claim and scope?
4. Is an exact locator recorded, or a documented reason why a stable page locator does not exist?
5. Are source revision, effective date, and supersession status checked where relevant?
6. Have conflicts, missing references, and contradictions been searched for and resolved?
7. Are numeric values and procedures tied to the exact application, or explicitly labelled generic without implying universal applicability?
8. Are safety warnings complete and reviewed at the required competency level?
9. Are translations, synonyms, relations, examples, and images checked for misleading ambiguity?
10. Is reviewer identity, date, rationale, and evidence retained?
11. Have required independent and qualified human reviews been completed?

Any NO or unknown answer blocks `verified`. Structural JSON validation, a working UI, a source URL existing, or AI consensus alone never passes this gate.

## 6. Severity and publication policy

- **P0 — critical safety hazard:** immediately quarantine and block learner-visible publication. Examples include dangerous high-voltage procedures, fuel/fire risk, unsafe lifting/support, rotating machinery, braking, airbags/pretensioners, and hazardous chemical exposure. Only a designated qualified human safety approver may clear P0; AI review cannot clear it.
- **P1 — materially wrong or misleading:** block the affected claim/record from learner-visible release until corrected and evidenced.
- **P2 — material ambiguity or evidence gap:** block learner-visible release when it can affect meaning, component identity, diagnosis, safety, or application scope. Internal staging is allowed with explicit status and access controls. A learner-visible draft exception is permitted only for a demonstrably non-material editorial issue, with visible draft labeling and explicit owner approval.
- **P3 — cosmetic/non-material:** may be scheduled for editorial cleanup, provided it does not alter meaning or mislead.

Internal authoring/staging is distinct from learner-visible publication. A `needs_review` or `unverified` label is not, by itself, permission to publish. The owner must approve any exception to the learner-visible release gate.

## 7. Safety review and escalation

The project owner must designate a named human safety approver with appropriate competence for the subject area. If no qualified approver is available, the content remains quarantined.

For P0:
1. stop publication and flag the affected asset/claim immediately;
2. preserve the original content and evidence;
3. notify the owner and designated safety approver;
4. document hazard, affected scope, and containment;
5. clear only after authoritative evidence and qualified human approval are recorded.

AI can identify hazards and prepare evidence summaries but cannot act as the accountable safety approver.

## 8. Automotive-specific rules

### Generic versus vehicle-specific
Label generic principles as generic. Any specification, pinout, wiring diagram, calibration, or repair procedure must carry an application key: make/model/year/engine/market/build/system variant. Never infer universal resistance, voltage, pressure, torque, pinout, waveform, fluid specification, or calibration values.

### Diagnostics
A DTC or symptom is evidence of a monitored condition, not automatic proof that a named component failed. Separate code definition, enabling conditions, possible causes, test steps, measured findings, and confirmed root cause.

### Taxonomy
Use only values allowed by the current schema enum. Do not invent enum values or force an assembly, fluid, consumable, or material into the nearest available kind. If a concept cannot be represented accurately, leave it unresolved and submit a separate taxonomy/schema proposal for owner approval. Do not alter the enum or production records as part of content review.

### Synonyms and relations
Do not add synonyms merely because terms are sometimes used loosely. Mark regional/workshop slang as such. Preserve distinct components. Every ID-based relation must resolve to an existing stable ID; never store a free-text label as if it were a resolvable ID. Keep unresolved relations flagged until reconciled against the full registry.

### Images and other assets
Maintain an asset-specific manifest containing:
- asset ID and exact source page/provider;
- creator/rights holder where known;
- exact license name/version and URL or evidence of permission;
- access date and archived evidence of license terms where possible;
- required attribution text;
- whether educational and commercial redistribution are permitted;
- whether modification, cropping, annotation, or derivative use is permitted;
- modifications actually made;
- technical identity reviewer, conclusion, and date.

Technical identity approval and copyright/license clearance are separate gates. A search result or direct image URL is not a license grant. Do not use an asset if rights are unclear or incompatible with intended distribution.

## 9. Independent review and disagreement

The second reviewer should assess the source material and claims independently before seeing the first review where practical. Record both reviews and preserve their original conclusions.

- AI reviewers are assistants; they are not qualified human signatories.
- Agreement between reviewers does not replace evidence.
- Disagreement remains open until resolved by stronger evidence or an explicit owner decision.
- P0 and other safety-critical claims require qualified human review regardless of AI agreement.
- Record reviewer identity, role/competency, date, scope, and conflicts of interest.

Do not rewrite the first review to make it appear that reviewers agreed.

## 10. Re-review triggers and immutable history

Re-open affected claims when any of the following occurs:
- OEM manual, service bulletin, calibration, or technical document is revised or superseded;
- a standard edition changes;
- a correction report or credible contradiction is received;
- vehicle application scope is expanded or changed;
- translation, synonym, definition, diagnostic procedure, or numeric value changes;
- an image license or permission changes, expires, or is withdrawn;
- schema migration changes the meaning or representation of a field;
- a source becomes inaccessible, withdrawn, or materially outdated.

Keep prior review decisions immutable. Append a new review event with date, reviewer, reason, changed scope, evidence, and outcome. A new review does not erase the previous decision or its provenance.

## 11. Coverage limits of the current schema and QA

The current SQL schema provides basic source linkage and some QA checks, but entity-level source links do not automatically prove every claim. Before operational adoption, inventory every table/entity type eligible for `verified` and ensure the release QA covers it.

At minimum, document explicit coverage or exclusion for terms, parts, systems, diagnostics, lessons, quizzes, scenarios, vehicle models, brands, vehicle specifications, compatibility records, images, and learning assets. Any excluded entity type must not be marked `verified` until an approved review/evidence path exists.

The existing QA view's coverage must not be assumed to include tables it does not query. Keep source currency checks separate from content review checks. If a claim-evidence table or broader QA view is needed, propose it separately; do not silently migrate the schema.

## 12. Workflow

1. **Intake:** preserve source file, hash/commit, task ID, branch, and scope.
2. **Structural QA:** validate JSON/schema, IDs, references, duplicates, enums, required fields, and file integrity.
3. **Editorial QA:** review terminology, translation, grammar, and taxonomy.
4. **Technical QA:** list material claims and check each against fit-for-purpose evidence.
5. **Independent review:** obtain a separate review and retain both records.
6. **Safety review:** route P0/high-risk claims to the designated qualified human.
7. **Reconciliation:** resolve conflicts with evidence or explicit owner decision; unresolved items remain blocked.
8. **Patch proposal:** provide exact diff, affected IDs, evidence, and rollback plan.
9. **Owner release approval:** no canonical or production change without explicit approval.
10. **Post-release:** rerun automated QA and retain immutable provenance.

## 13. Review record template

- Task / entity ID:
- Field or material claim:
- Current content:
- Declared scope:
- Claim outcome: supported / contradicted / unresolved / not_applicable
- Severity: P0 / P1 / P2 / P3
- Source ID and exact document:
- Revision/effective date:
- Locator:
- Reviewer identity / role:
- Review date:
- Rationale:
- Conflict/freshness check:
- Required action:
- Remaining uncertainty:
- Human safety approval (if required):

## 14. Current project implications

- The archived 252-term set remains unverified until it passes the evidence gate.
- Both conflicting Batch 01 variants remain preserved; provenance is unknown and no canonical choice is implied.
- The 80 lesson blueprints are outlines, not complete lessons.
- Staging simulators, diagnostic cases, wiring material, and images remain drafts until scope, assumptions, safety, evidence, and rights are reviewed.
- The existing SQL enum does not include dedicated assembly/fluid/consumable/material kinds; no reviewer may invent such values.
- The identical `last_reviewed_at` date across unverified imported records must not be treated as proof of review.

## 15. Non-actions in this version

This document is a proposed revision on an isolated branch. It does not change production JSON, SQL schema, frontend, catalog, progress, verification states, or canonical dataset selection. Owner approval is required before adoption.
