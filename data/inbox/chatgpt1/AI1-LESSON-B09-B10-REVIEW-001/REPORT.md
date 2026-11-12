# AI-1 Review — AI-2 Lesson Packages B09 and B10

- Task ID: `AI1-LESSON-B09-B10-REVIEW-001`
- Date: 2026-11-12
- Scope: static review of AI-2 lesson drafts, source metadata, lesson blueprints, part manifest, active term file and quiz-bank conventions.
- Inputs:
  - `AI2-LESSON-B09-UNDER-HOOD-001` (lesson.json, sources.json, REPORT.md)
  - `AI2-LESSON-B10-CAR-FLUIDS-001` (lesson.json, sources.json, REPORT.md)
- Decision: `accept_as_research_drafts_with_changes`
- Release status: both remain `needs_review`. No canonical or learner-visible content was changed.

## 1. Executive summary

AI-2 delivered two useful Persian lesson drafts for LVL-1:
- B09 — Under the Hood: Five Key Parts
- B10 — Car Fluids

The drafts follow their existing lesson IDs and featured part IDs. The educational explanations are generally cautious about vehicle-specific differences and avoid universal service specifications. Both include eight practice questions and language-learning material.

They are not ready for production integration. The main blockers are inconsistent quiz payload formats, incomplete evidence metadata in B10, an orphan B10 source, and a vocabulary-count mismatch in B10. The current lesson loader/runtime contract has not been tested.

## 2. Blueprint and part-reference audit

| Check | B09 | B10 |
|---|---:|---:|
| Blueprint exists | Yes | Yes |
| Level/order | LVL-1 / 9 | LVL-1 / 10 |
| Featured part IDs in draft | 5/5 exact | 6/6 exact |
| Part IDs found in parts_image_manifest.json | 5/5 | 6/6 |
| Sections | 5 | 6 |
| Practice questions | 8 | 8 |
| Estimated duration in blueprint | 25 min | 25 min |
| Suggested mastery threshold | 70% | 70% |

All referenced PRT IDs resolve in the existing image manifest. This confirms identifier alignment only; it does not verify the technical record or image asset. The manifest marks the referenced parts as pending expert review and their image assets are not yet available.

## 3. B09 — findings

### Positive findings
- All five featured part IDs match blueprint B09 exactly: Battery, Radiator, Air Filter, Dipstick and Coolant Expansion Tank.
- Eight target vocabulary items are supplied, matching the blueprint target of eight.
- Four sources are supplied. Section-level source references resolve to the source IDs in the package.
- Sources include Bosch Classic, Gates, MANN-FILTER and a Ford owner-manual page. The draft distinguishes generic principles from vehicle-specific procedures.
- Safety language is appropriately conservative: no opening of hot cooling-system caps, battery-terminal contact or disassembly is included in the activity.
- The lesson correctly distinguishes the engine air filter from the cabin filter, radiator from the complete cooling system, and dipstick level reading from oil pressure/quality.

### Required changes
**B09-F01 — P1: quiz payload is not normalized to the existing quiz-bank contract.**
The eight questions use mixed shapes:
- some use `options_fa` plus numeric `correct_option`;
- one uses `options_en`;
- some use `correct_answer` without options.

The existing `quiz_bank.json` authored-question convention uses fields such as `prompt_fa`, `prompt_en`, `options` with option IDs, and `correct_option_id`, or explicit accepted-answer fields for non-MCQ question types. B09 needs a mapping into the existing question types and stable answer representation before integration. The first five MCQs also all place the correct answer at index 0; vary answer positions to avoid a learnable answer-position pattern.

**B09-F02 — P2: assessment source coverage is incomplete.**
Only some questions include `source_ids`. Questions without technical claims may not need citations, but each factual automotive answer should have claim-level evidence or a documented reason why no citation is required.

**B09-F03 — P2: no term-level canonical mapping yet.**
The eight lesson vocabulary items have no exact match in the currently active `terms_batch_01.json`. This does not prove they are absent from the full archive or future batches. Do not create duplicate canonical terms from this lesson; first reconcile against the complete term archive and the approved canonical vocabulary.

## 4. B10 — findings

### Positive findings
- All six featured part IDs match blueprint B10 exactly: Dipstick, Coolant Expansion Tank, Oil Filler Cap, Brake Master Cylinder, Power Steering Fluid Reservoir and Fuel Tank.
- Six lesson sections cover the associated fluids/components.
- The draft correctly distinguishes engine oil, coolant, brake fluid, power-steering fluid and fuel.
- It does not assume all vehicles have hydraulic power steering.
- It avoids universal fluid grades, quantities, service intervals and model-specific procedures.
- Eight practice questions are present.

### Required changes
**B10-F01 — P1: source metadata is incomplete.**
The seven source records do not provide the claim-level locators and `claims_supported` mapping used in B09. The source list therefore cannot yet demonstrate exactly which technical statement each source supports. Add a page/section locator, publication or revision detail when available, application scope, supported claim IDs and explicit limitations.

**B10-F02 — P1: one orphan source.**
`SRC-CASTROL-ATF-001` is listed in the lesson's top-level `source_ids` and in `sources.json`, but is not referenced by any section or question. It appears relevant to the vocabulary item “transmission fluid”, but that relationship is not recorded. Either link it to the exact claim/question it supports or remove it from the lesson source list.

**B10-F03 — P1: quiz payload is not normalized.**
B10 uses a different question format from both B09 and the existing `quiz_bank.json`: `options` plus free-text `answer`, sometimes with no options. Question IDs use `B10-K01…`, while the blueprint identifies the quiz as `QZ-B10`. Map the eight questions to the existing quiz-bank slot/type convention and use stable option IDs or accepted-answer arrays. Do not load these questions directly into production as-is.

**B10-F04 — P2: vocabulary target mismatch.**
The blueprint requests eight new terms, but the lesson provides fourteen vocabulary entries. This may be acceptable if six are explicitly marked as review/support vocabulary, but the package does not distinguish new terms from review terms. Label the eight target terms and separate the additional six.

**B10-F05 — P2: weak evidence fit for some broad claims.**
The Ford “Blue Certification” URL is described as a vehicle inspection checklist, not a technical fluid reference. It should not be the sole support for detailed claims about power-steering fluid, fuel or dipstick procedures unless exact relevant passages are located. The Castrol and Prestone pages are supplier material; their generic claims must not be converted into vehicle-specific service recommendations. Source URLs have not been independently live-checked in this static review.

**B10-F06 — P2: no term-level canonical mapping yet.**
The fourteen lesson vocabulary entries have no exact match in the currently active `terms_batch_01.json`. This is only a comparison against the active 41-record file, not the full six-batch archive. Reconcile against the full archive before creating or promoting canonical terms.

## 5. Cross-package and integration findings

1. The lesson JSON files share the same top-level field names, which is a useful starting point for a common content contract.
2. Their nested quiz question formats differ materially and must be normalized before any loader integration.
3. Both drafts use existing PRT identifiers correctly, but referenced image assets remain missing/pending. No images were supplied in these lesson packages.
4. Both packages are marked `needs_review`; that status must be preserved.
5. The existing blueprint quiz IDs are `QZ-B09` and `QZ-B10`. Lesson-local question IDs do not yet map to the existing quiz slots or authored-question IDs.
6. No runtime import, frontend rendering, accessibility, or learner-progress test was performed.
7. No lesson terms were added to the canonical term database. No quiz-bank, blueprint, part record, schema, frontend or production file was modified.

## 6. AI-1 organization recommendation

- Retain both original AI-2 packages unchanged in their inbox branches as research provenance.
- Treat B09 as the stronger first candidate for normalization: its blueprint alignment and source metadata are substantially complete. Resolve the quiz mapping and evidence gaps first.
- Keep B10 in review until source locators/claim coverage are added, the orphan ATF source is resolved, the vocabulary target is clarified, and quiz items are normalized.
- After those changes, AI-1 should create a separate normalized integration package in its own inbox. Only after schema/loader testing and the project's review gates should any content be promoted to production.
- Do not mark either lesson, source, part, image or quiz as `verified` based on this review.

## 7. Files reviewed

- `lesson_blueprints.json`
- `parts_image_manifest.json`
- `terms_batch_01.json`
- `quiz_bank.json`
- AI-2 B09 and B10 lesson packages and reports

This is a static editorial/structural review, not OEM certification, independent live source verification, image-rights clearance, or production runtime QA.
