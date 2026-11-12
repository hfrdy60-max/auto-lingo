# AI-2 — Sensors, Actuators and Diagnostic Language

- Mission: `AI2-SENSORS-ACTUATORS-TERMINOLOGY-001`
- Branch: `ai2-sensors-actuators-terminology-001`
- Folder: `data/inbox/chatgpt2/AI2-SENSORS-ACTUATORS-TERMINOLOGY-001/`
- Status: `candidate_unverified`; research inbox only, not approved for release.
- Scope: automotive electrical/electronic language; sensors, signal characteristics, actuators and diagnostic-tool terminology. Mechanical repair procedures are excluded.

## Coverage
- Glossary: 65 bilingual records: 18 sensors, undefined signal characteristics, 16 actuators and undefined diagnostic-language terms.
- Every record includes English/Persian term, Persian pronunciation, IPA, Persian definition, bilingual example, two collocations, workshop-language note, source claim reference and review status.
- Dialogues: 5 natural bilingual workshop dialogues / 30 turns.
- Readings: 3 bilingual technical readings, each with 4 comprehension questions.
- Quiz: 36 questions across 6 formats: multiple choice, FA→EN, EN→FA, fill-gap, contextual use and matching.
- Sources: 13 traceable candidate references with direct URLs and page locators; all remain candidate_unverified.

## Deduplication
Inspected AI-1 branch `ai1-electrical-core-glossary-001` (40 glossary terms) and AI-2 prior electrical diagnostics research (121 terms). Existing circuit fundamentals such as voltage, current, resistance, duty cycle, reference voltage, sensor ground, signal wire, wiring diagram and connector view were not recreated as new standalone glossary records. Some requested diagnostic phrases overlap semantically with prior content; these are declared in the glossary overlap register and must be cross-referenced rather than duplicated canonically. No canonical TERM/PART/LESSON/QUIZ IDs were invented; canonical mappings remain null.

## Evidence and limitations
All source claims remain `candidate_unverified`. Source locators are navigation aids, not verification approvals. Examples and dialogues are author-generated, not quotations. No universal voltage, resistance, frequency, pressure, duty-cycle threshold, pinout, sensor curve or test procedure is supplied. Sensor technologies, signal formats, naming, Bank/Sensor numbering and actuator architecture vary by OEM, model, engine and market. Diagnostic descriptions are observations, not proof that a named component failed. This package is conceptual language-learning content only; it does not instruct users to energize, probe, disassemble or physically test circuits or actuators.

## QA required before integration
Parse JSON; validate required fields, unique local IDs, source references and category counts; check dialogue speaker alternation and duplicate turns; check reading/question counts and quiz IDs/answers; complete human technical, Persian-language, IPA and claim-source review; complete canonical crosswalk and deduplication.

## Files
- `glossary.json`
- `sources.json`
- `dialogues.json`
- `readings.json`
- `quiz.json`
- `REPORT.md`
