# AUTO LINGO — Content Verification Protocol
Task ID: AI1-CONTENT-VERIFICATION-PROTOCOL-001
Prepared: 2026-11-12
Status: proposed / review-required
Scope: generic automotive terminology, component explanations, diagnostic education, and vehicle-specific service information.

## 1. Purpose and boundary
This protocol defines how AUTO LINGO content moves from draft to reviewed or verified. It is a QA procedure, not evidence that any existing record is technically correct. It does not select a canonical vocabulary batch, edit production records, or promote any record's verification status.

## 2. Separate the claims before reviewing a record
A single record may contain claims with different evidence requirements. Review these separately:
1. English headword and part of speech / concept type.
2. Persian equivalent, regional usage, and transliteration.
3. Technical definition and operating principle.
4. Function and physical location.
5. Symptoms, failure modes, and diagnostic interpretation.
6. Test procedure and expected results.
7. Numeric specifications, wiring, pinouts, torque, pressure, resistance, voltage, fluid, or calibration values.
8. Safety warnings.
9. Image identity, caption, ownership, and reuse license.

A source supporting one claim must not be treated as support for every field in the record.

## 3. Source hierarchy
Use the strongest source appropriate to the claim:
- Vehicle-specific service procedure/specification: OEM service information for the exact make, model, year, engine, market, and relevant configuration.
- Vehicle architecture, wiring, DTC strategy, calibration, and ECU behavior: OEM technical documentation or official technical service information for that application.
- Component design and general operating principles: component manufacturer's technical documentation (for example Bosch, DENSO, HELLA, NGK/NTK, ZF, Schaeffler/INA, BorgWarner, or the actual manufacturer of the component).
- Standardized terminology, test definitions, and diagnostic communication: the applicable published SAE / ISO standard, identified by exact designation and edition. A catalogue landing page is discovery metadata, not evidence for the standard's technical clauses.
- General educational explanation: reputable technical textbook or manufacturer training material.
- Secondary websites and forums: discovery leads only unless the claim is explicitly about reported field experience; never use them alone for safety-critical or vehicle-specific instructions.

Do not cite a publisher homepage as proof of a specific claim. Record the exact document/page and relevant section.

## 4. Minimum evidence record
For every material claim intended for publication, retain:
- entity_type and entity_id (or a stable draft identifier);
- claim / field supported (not just a general source link);
- source_id and source_type;
- exact title, publisher/manufacturer, document number if available;
- URL or document identifier;
- edition / revision / publication date where available;
- page, section, table, figure, or clause;
- application scope (generic, or exact vehicle configuration);
- access/review date and reviewer;
- short note explaining what the source actually supports and any limits.

Use the existing `sources` and `entity_sources` schema where suitable. The `citation_note` should identify the exact page/section and claim. If the schema cannot represent a required detail, document a schema-change proposal separately; do not silently overload unrelated fields.

## 5. Verification states
- `unverified`: draft or imported content not yet substantively checked.
- `needs_review`: a concrete issue, conflict, ambiguity, missing source, or incomplete review has been identified.
- `verified`: all material claims within the declared scope have been checked against adequate evidence; no unresolved high-severity issue remains; claim-level source traceability exists.
- `unknown`: the information is not currently known or evidence is unavailable. Do not replace unknown with a plausible guess.

A structurally valid JSON file is not technically verified. A source URL existing is not verification. One reviewer agreeing with another AI is not independent evidence.

## 6. Severity and release gate
- P0 — safety-critical misinformation or hazardous instruction: block publication immediately; correct only with authoritative evidence and safety review.
- P1 — materially wrong definition, translation, component classification, diagnostic implication, or vehicle-specific value: block the affected record/claim.
- P2 — ambiguity, weak synonym, incomplete relation, missing citation, or editorial issue: keep out of verified status until resolved; may be published only if clearly labelled draft and not misleading.
- P3 — cosmetic or non-material wording issue: may be scheduled for editorial cleanup.

A record containing one unresolved P0/P1 claim cannot be marked verified. A verified generic explanation must not imply that its values or procedure apply to every vehicle.

## 7. Rules for common automotive content risks
### Generic versus vehicle-specific
Always label general principles as generic. Any specification or repair procedure must carry an application key (make/model/year/engine/market/system variant). Never infer universal resistance, voltage, pressure, torque, pinout, waveform, fluid specification, or calibration values.

### Diagnostic language
A DTC or symptom is evidence of a monitored condition, not automatic proof that a named component has failed. Distinguish code definition, enabling conditions, possible causes, diagnostic tests, and confirmed root cause.

### Term kind and taxonomy
Use `part` only for a discrete component. Use `system` for assemblies/functional systems, `process` for operations, `measurement` for measured quantities, `tool` for equipment, `concept` for general ideas, `fault` for failure conditions, and `abbreviation` for acronyms. If an item legitimately spans types, split the concept or record the ambiguity for taxonomy review rather than forcing it into `part`.

### Synonyms and translations
Do not add a synonym solely because two words are sometimes used loosely. Check whether they identify the same object in the intended automotive context. Mark regional or workshop slang as such. Preserve distinctions between similar components (for example, clutch pressure plate versus clutch disc).

### Relations
Every related-term reference must resolve to an existing stable ID. State relation semantics (related, part_of, type_of, causes, tested_with, etc.) where the schema supports them. Do not store a free-text label as though it were a resolvable ID.

### Images
Confirm the depicted component matches the record, the image is legible and contextually useful, and the exact asset page permits the intended reuse. A search-result URL or image URL alone is insufficient. Retain author, license, source page, and attribution requirements.

## 8. Date semantics
The schema's `last_reviewed_at` / `last_checked_at` should mean the date a human or accountable review process actually checked the content/source, not the file creation, import, generation, or upload date. If the date's meaning is unknown, leave it null where permitted and record the import date in a separate provenance field/log. Do not backdate or mass-fill review dates. This is a proposed data-governance rule; existing dates must not be rewritten without provenance evidence.

## 9. Two-reviewer workflow
1. Intake: preserve original file and hash; assign task ID; note source branch and commit.
2. Structural validation: parse JSON, check schema, IDs, references, duplicates, enum values, and required fields.
3. Editorial review: terminology, translation, grammar, and taxonomy.
4. Technical review: inspect each material claim and source scope.
5. Independent review: second reviewer records agree / disagree / needs_context with reasons; do not treat agreement as source evidence.
6. Reconcile: record disagreements and resolve only with evidence or explicit owner decision.
7. Release: prepare a proposed patch and diff; obtain owner approval before changing canonical data.
8. Post-release: run automated validation and retain source/reviewer/change history.

## 10. Review result template
For each record or claim:
- ID:
- Field / claim:
- Current content:
- Proposed finding: agree / disagree / needs_context
- Severity: P0 / P1 / P2 / P3
- Evidence: exact source, revision, page/section/figure
- Scope: generic or exact application
- Rationale:
- Required action:
- Reviewer and review date:
- Remaining uncertainty:

## 11. Current project implications
- The 252-term archive is structurally organized but has no claim-level source links in the reviewed dataset; it must not be called verified on structural checks alone.
- The two Batch 01 variants reuse the same IDs but differ in content. This protocol does not choose between them; preserve both until provenance and owner decision resolve the conflict.
- A common `last_reviewed_at` date across unverified records must not be interpreted as proof of review. Confirm its origin before changing it.
- The 80 lesson blueprints are outlines, not complete lessons. Lesson text should be authored only after learning objectives, terminology, evidence, level, and safety requirements are established.
- Staging simulators, diagnostic cases, and wiring material remain educational drafts until model assumptions, application scope, safety, and evidence are reviewed.

## 12. Non-actions in this task
No production JSON, SQL schema, frontend, `DATA_CATALOG.md`, or `PROGRESS.md` was changed. No term was added, merged, deleted, canonicalized, or promoted to verified. This file is a proposed QA standard on an isolated branch and requires project-owner approval before adoption.
