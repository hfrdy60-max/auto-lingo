# AUTO LINGO — Lesson Content Research Package

- Mission ID: `AI2-LESSON-B09-UNDER-HOOD-001`
- Lesson: `B09` — Under the Hood: Five Key Parts
- Base branch: `main`
- Output status: `needs_review`
- Date: 2026-11-12
- Role: AI-2 — independent technical research and lesson authoring

## Scope and alignment

Reviewed `lesson_blueprints.json` and selected existing lesson B09, not a new lesson ID. The authored package follows its five featured part IDs exactly:
- `PRT-ELE-001` — Battery
- `PRT-COL-001` — Radiator
- `PRT-FUE-007` — Air filter
- `PRT-LUB-004` — Dipstick
- `PRT-COL-005` — Coolant expansion tank

The lesson retains its planned English focus on spatial prepositions (under, on, next to, behind), eight target vocabulary items, 25-minute estimate and 70% suggested mastery threshold. The component names were checked against the existing `parts_image_manifest.json`; no part IDs or canonical records were changed.

## Research performed

Used manufacturer and OEM material:
1. Bosch Classic battery brochure — basic battery energy-storage and supply role.
2. Gates cooling-system troubleshooting guide — radiator heat transfer, expansion tank volume compensation, overall system roles, and hot-cap safety.
3. MANN-FILTER technical page — engine air filtration and protection of engine/air-measurement components.
4. Ford owner-manual page — example of dipstick reading and the fact that measurement conditions are vehicle-specific.

The lesson distinguishes generic engineering principles from model-specific service information. It intentionally avoids universal voltage, pressure, torque, fluid, or replacement-interval values.

## Deliverables

- `lesson.json`: full Persian lesson content, English terminology, objectives, explanations for all five components, system relationships, language practice, safe visual activity, common misconceptions, and eight assessment items.
- `sources.json`: source metadata, exact locators, claim coverage and scope/limitations.
- This report: selection rationale, QA notes and integration boundaries.

## QA and safety notes

- All five featured part IDs match the B09 blueprint.
- The lesson's examples of component location are explicitly illustrative; real layouts vary by vehicle.
- Dipstick procedure is not generalized from Ford to all vehicles.
- Cooling-system safety warning explicitly prohibits opening a hot/pressurized cap.
- Activity is visual-only: no touching battery terminals, opening caps, disassembly, or repair instructions.
- No AI-generated or unlicensed images were added.
- Assessment is included in the lesson package only; `quiz_bank.json` was not edited.
- Existing blueprint, parts records, catalog, progress, frontend, SQL and production data were not changed.

## Integration recommendation

Keep this package in the AI-2 inbox until AI-1 checks the target lesson schema and loader contract. If accepted, AI-1 can map the lesson payload into the product's lesson-content structure and separately link the eight questions through the quiz workflow. Do not set `verified` or learner-visible release status based only on this authoring package.

## Remaining limitations

- Static research and authoring only; no runtime import or frontend rendering test was performed.
- The selected sources support the stated generic claims, but do not validate all possible vehicle layouts.
- A second technical reviewer and the project's approved content-verification workflow are still required before any release.
