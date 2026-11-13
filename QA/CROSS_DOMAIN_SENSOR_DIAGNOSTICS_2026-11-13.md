# AUTONEX — Cross-domain Sensor Diagnostics QA (2026-11-13)

## Delivered
Added `data/technical_reference/cross_domain_sensor_diagnostics.json`.

The reference connects all 10 sensor records already catalogued from the Fardin Ghordi source to:
- live-data interpretation workflows;
- wiring-diagram and circuit-test workflows;
- relevant Bosch gasoline-engine-management topics;
- relevant Hyundai/Kia electrical and fuel-system topics;
- diagnostic domains and learner tasks.

## Coverage
CKP, CMP, TPS, Knock, ECT, O2, VSS, MAP, IAT, APP.

## Quality and safety rules
- Each sensor has three source references with printed-page locators.
- The file separates live-data analysis from electrical-circuit testing.
- It does not assign a universal numeric DTC to a sensor.
- It explicitly states that DTC definitions, enable criteria, freeze-frame interpretation, pinouts, resistance, voltage and waveforms must be checked against the exact vehicle/ECU/OEM documentation.
- It distinguishes the educational diagnostic sequence from an OEM repair procedure.
- It includes a standard evidence-led workflow from customer complaint through post-repair verification.

## Validation performed
- The JSON document was generated as a structured object and serialized with valid JSON formatting.
- 10 sensor workflow records were created, each with source references, live-data workflow, circuit workflow, DTC policy and learner task.
- Static content/structure review only. No application runtime, browser, database import, vehicle, scan tool or electrical measurement test was performed.

## Status
**Ready for controlled educational integration.** Do not present the workflows as manufacturer-specific procedures until reviewed against the exact vehicle and service documentation.
