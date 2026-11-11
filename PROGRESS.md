# AUTO LINGO — Progress Log

## Stage 1 — Architecture (DONE)
- database_schema.sql: 27 tables + 1 QA view, RLS read-only, updated_at triggers
- categories.json: 26 records
- brands.json: 19 records (unverified)
- sources.json: 11 records (unverified)

## Stage 2 — Terms database
### Batch 01 — CAT-01 Engine & Combustion
- File: terms_batch_01.json
- Records generated: 41
- Validated structurally: JSON serialization successful; IDs sequential and unique (TERM-000001–TERM-000041); category_id CAT-01 exists in categories.json; part-specific fields are null for non-part terms.
- Verified: 0
- Needs review / unverified: 41 (all intentionally unverified; no record-level source has been checked and linked in entity_sources)
- Sources used: none as verified evidence. sources.json contains candidate references only; their listed status remains unverified.
- Missing/incomplete: related_terms left empty for later linking; synonyms empty where no safe synonym was established; part location is generic and must be refined per engine design; symptom and testing fields intentionally conservative.
- Potential issues: technical definitions and translations require expert review; no vehicle-specific values, torque, pressure, resistance, voltage, or pinout data included.

### Resume point
- Last ID: TERM-000041
- Completed categories: CAT-01 (initial batch; category coverage not yet complete)
- Next: continue CAT-01 with non-duplicate terms, then CAT-02 through CAT-26.


## Stage 3 — Gemini material staged for AUTO LINGO
- Added seven automotive-learning staging datasets under `data/staging/`: parts_images, wiring_diagrams, simulator_data, sensor_simulator, diagnostic_cases, electronics_labs, report_card_prompt.
- ESP32/microcontroller project content is excluded from AUTO LINGO scope and was not added. No `data/staging/esp32_projects.json` existed at the checked path.
- These staging files are curated/reconstructed from the supplied file summaries in the conversation, not byte-for-byte copies of the original Gemini JSON files. Reconcile any exact original records against these staged records before replacement.
- All technical records remain `needs_review` / unverified. No image license, technical value, wiring topology, or vehicle-specific parameter is represented as independently verified.
- Known issues are documented in-record: likely diesel Common Rail image mislabeled as GDI; injector circuit fuse/clamp values are not universal; CAN values are typical only; injector simulator needs calibration and engine/injector model parameters; MAP/CKP signals are sensor/application-specific; P0300 is a diagnostic case, not proof of a failed component.
- The datasets are staged for review and are not yet imported into production relational tables or connected to the frontend UI.
