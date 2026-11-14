# Autel MS906 Pro v0.3 — canonical pilot data

This folder contains the clean, versioned data set used by the AUTONEX technical academy.

- entries.json: 40 term/menu records in 9 categories.
- device.json: MS906 Pro / MS906 Pro-TS device metadata.
- sources.json: official manual registry; US V2.1 is the PDF edition, not the installed software build.
- entry.schema.json, device.schema.json, source.schema.json: strict v0.3 schemas.

The original AI-3 upload files in the repository root are retained unchanged for traceability. The duplicated service_functions (3).json upload is not part of this canonical set.

Validate from repository root with:
python3 tools/validate_autel_v03.py

Persian translations remain draft_unreviewed. A research-stage technical status is not independent AUTONEX approval or physical-device confirmation.
