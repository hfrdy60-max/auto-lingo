# AI2-TERM-CONTENT-REVIEW-001

## Scope and method
Independent review of all 20 findings in `AI1-TERM-CONTENT-TRIAGE-001/findings.json`, using the triage descriptions, terminology references listed in `sources.json`, and available repository history. This is an editorial/terminology review, not a vehicle-specific OEM validation.

**Decision vocabulary:** `agree`, `disagree`, `needs_context`.

## Executive summary
- 20 findings reviewed.
- 11 `agree`; 9 `needs_context`; 0 `disagree`.
- No source records, canonical files, verification states, catalogues, or progress files were changed.
- No batch was declared canonical.
- No exact OEM service manual for a particular vehicle/model was available for this review.

The `agree` decisions mean the concern raised is substantively valid; they do not authorize a direct edit. `needs_context` means the concern is plausible but cannot be resolved without the schema's allowed kinds, full record definitions, category policy, or intended usage.

## Item-by-item review

| ID / item | Decision | Independent assessment |
|---|---|---|
| TERM-000083 Manual Transmission kind | needs_context | A complete manual transmission is an assembly/system rather than a single elementary component. However, if `kind=part` is the database's umbrella for all catalogued physical service units, this may be intentional. Check the enum and taxonomy rules before reclassifying. |
| TERM-000084 Automatic Transmission kind | needs_context | Same reasoning as TERM-000083. It is a complete transmission assembly; the proper kind depends on whether the schema distinguishes assembly/system from component. |
| TERM-000094 Pressure Plate Persian | agree | Pressure plate and clutch disc are distinct clutch members. The Persian label `صفحه کلاچ` can be ambiguous in workshop usage and should not be allowed to collapse the two concepts. Preserve a distinct label and define its role: it clamps the friction disc against the flywheel. A terminology reference explicitly distinguishes the pressure plate from the clutch disc. |
| TERM-000102 Brake Drum Persian | needs_context | `کاسه ترمز` is more explicit and less ambiguous as a technical label. `کاسه چرخ` is also encountered colloquially/regionally, so whether it is wrong depends on the record's intended audience and actual Persian definition. Prefer `کاسه ترمز` as the primary term and retain `کاسه چرخ` only as a colloquial synonym if validated. |
| TERM-000073 Crankshaft Position Sensor Persian | agree | `سنسور دور موتور` is a familiar workshop expression, but it foregrounds speed and omits the crankshaft-position/angle information. A technically explicit primary label such as `حسگر موقعیت میل‌لنگ` is preferable; the colloquial phrase may remain a search synonym. Bosch describes crankshaft-speed sensors as measuring both speed and position. |
| TERM-000243 Stalling Persian | agree | `خاموش کردن موتور` is causative (“to switch/turn the engine off”). Engine stalling describes the engine stopping unexpectedly/unintentionally. `خاموش‌شدن ناخواسته موتور` is semantically closer. |
| TERM-000209 Tensioner Persian | agree | `تسمه‌کش (تایمینگ)` is too narrow if the definition includes belt and chain tensioning or multiple drive systems. Use a general equivalent such as `کشنده` / `سفت‌کن`, and qualify timing-belt, timing-chain, or accessory-belt tensioner in the subtype/context. |
| TERM-000208 Bearing scope | agree | Bearing is a valid umbrella term, but rolling-element bearings and plain/journal bearings are materially different designs and should not be treated as interchangeable synonyms. Keep a broad parent concept only if the definition explicitly covers the family and links to distinct subtypes; otherwise split into scoped entries. SKF training material explicitly treats rolling and plain bearings as separate types. |
| TERM-000123 Strut Persian | agree | The concern is valid: a suspension strut is not synonymous with a MacPherson strut in every context. Monroe describes a strut as a structural suspension component that also performs damping; it is distinct from a conventional shock absorber. Use a general, context-appropriate Persian term and reserve `مک‌فرسون` for the MacPherson subtype. Exact Persian wording should be checked against local technical usage. |
| TERM-000062 ECU transliteration | agree | `ایسییو` is difficult to parse and is not a clear rendering of the letters E-C-U. Use a consistent form such as `ای‌سی‌یو` and expand the abbreviation on first use (Electronic Control Unit / واحد کنترل الکترونیکی). This is a Persian editorial convention decision, not an OEM technical issue. |
| TERM-000089 Transmission Fluid kind | needs_context | It is a fluid/consumable, not a discrete mechanical part. Reclassify only if the schema provides a fluid/material/consumable kind. If `part` is a broad inventory class, document that convention instead. |
| TERM-000107 Brake Fluid kind | needs_context | Same taxonomy issue as TERM-000089. Brake fluid is a hydraulic working fluid/consumable, but the correct database value depends on the allowed kind enum and product taxonomy. |
| TERM-000135 Coolant kind | needs_context | Coolant is a service fluid/working medium, not a discrete component. A dedicated fluid/consumable kind is preferable if supported; otherwise document the umbrella convention. |
| TERM-000142 Engine Oil kind | needs_context | Engine oil is a lubricant/consumable, not a mechanical part. Final classification depends on whether the schema distinguishes fluids, materials, and service consumables. |
| TERM-000151 Refrigerant kind | needs_context | Refrigerant is a working fluid, not a physical part. The record may also need a safety/environmental handling context, but this review does not alter the record. Classification depends on schema options. |
| TERM-000224 Airbag related_terms target | agree | A related-term reference to a concept absent from the six-batch set is unresolved within that set. Do not silently invent an ID or treat the reference as valid. Confirm whether the concept exists elsewhere in the full database; otherwise flag it as an unresolved external/missing relation for a separately authorized task. |
| TERM-000220 Body Control Module category | needs_context | BCM is an electronic control module, but its vehicle function is body electronics. Placement under Body & Chassis may be defensible in a vehicle-system taxonomy; placement under Electrical/Electronics may be preferable in a component-domain taxonomy. Define primary-category rules and support cross-category tags before moving it. |
| TERM-000057 Capacitor synonym “Condenser” | agree | “Condenser” is a historical/alternate term for an electrical capacitor in some contexts, but in automotive HVAC it also denotes the refrigerant heat exchanger. An unqualified synonym can misroute search. Qualify the synonym by electrical context or use a disambiguated concept. |
| TERM-000068 / TERM-000215 Reflash synonym overlap | needs_context | The terms are related but may not be equivalent in every record: “flashing” commonly refers to writing firmware/software to memory, while “reflash” often denotes rewriting/updating existing ECU software. Inspect both full definitions and examples before changing synonym routing. A shared synonym may be acceptable only if the search model supports context-aware ranking. |
| All 252 records: last_reviewed_at | agree | A single identical date on every record, with all records unverified and no reviewer/source trace, is not evidence of review. Treat the date as untrusted until provenance is established. If it represents generation/import, it belongs in a creation/import timestamp; reserve `last_reviewed_at` for a traceable review event with reviewer and evidence. |

## Key terminology conclusions
1. **Pressure Plate vs Clutch Disc:** separate components. The pressure plate applies clamping force; the clutch disc is the friction member splined to the transmission input shaft. Do not share an ambiguous Persian primary label.
2. **Crankshaft Position Sensor:** measures crankshaft position and/or rotational speed depending on sensor/system; “سنسور دور موتور” alone is an incomplete technical label.
3. **Stalling:** in engine context, the engine stops unexpectedly/unintentionally; it is not the act of switching it off.
4. **Bearing:** broad family term. Rolling-element and plain bearings are distinct types; represent the hierarchy rather than flattening them into interchangeable synonyms.
5. **Strut:** in suspension context, a structural suspension member with damping function; not simply another word for shock absorber and not limited to the MacPherson design.
6. **last_reviewed_at:** cannot be trusted as an actual review timestamp without reviewer identity and evidence.

## Batch 01 provenance review
The available evidence does **not** establish which Batch 01 content was authored first, reviewed first, or intended to be canonical:
- The root-level Batch 01 was added to GitHub on 2026-11-11 16:34:27 UTC.
- The complete ZIP (1) was uploaded on 2026-11-11 22:37:06 UTC.
- Those timestamps establish repository upload order only; they do not establish when either dataset was generated, who authored it, or whether it passed review.
- The four complete ZIPs (1)–(4) are byte-identical copies; they are not four independent provenance records.
- The archived Batch 01 is consistent across those identical ZIP copies, but its agreement across copies does not prove correctness or canonical status.
- No authoring prompt, source manifest, review record, signed approval, or generation log was found in the reviewed triage/report material to explain the duplicate ID reuse.

**Conclusion:** provenance remains unknown. Keep both Batch 01 variants quarantined from canonical selection until an attributable author/reviewer or original generation artifact provides evidence.

## Recommended next steps for AI-1
1. Keep all records unverified and both Batch 01 variants unresolved.
2. Publish an explicit taxonomy decision for the allowed `kind` values (part, assembly/system, fluid/consumable, material, etc.) before reclassifying the transmission/fluid records.
3. Resolve high-impact terminology ambiguities first: Pressure Plate, Crankshaft Position Sensor, Stalling, Bearing, Strut.
4. Validate Persian primary terms against automotive technical usage and OEM/local service literature; retain colloquial terms only as labeled synonyms.
5. Clarify timestamp semantics and require reviewer identity + source evidence for every real review event.
6. Resolve related-term references against the full canonical term registry, not only the six archived batches.

## Limitations
- This review used the findings and summary supplied by AI-1; the complete 252-record JSON bodies were not available as readable standalone files in the reviewed branch.
- No model-specific OEM service manual was available. Vehicle-specific naming, installation, or diagnostic statements require the applicable OEM manual.
- Web references support general terminology only; they do not validate every Persian synonym or every underlying term record.
- No source data was edited, verified, merged, or designated canonical.
