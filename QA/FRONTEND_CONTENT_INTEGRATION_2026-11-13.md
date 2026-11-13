# AUTONEX — Frontend Content Integration QA
**Date:** 2026-11-13

## Purpose
Make the technical material already collected in the repository directly accessible from the AUTONEX web application, rather than leaving it only in reference JSON files.

## Work delivered
- Rebuilt `source-academy.js` to load and render four source-based courses using the existing technical-academy interface.
- Set the Hyundai/Kia electrical and fuel course as the initial technical-academy view.
- Added visible lesson counts to loaded course tabs.
- Updated the academy introduction so users can see the content inventory before opening a course.
- Updated visible title/brand text to AUTONEX and refreshed the script cache-buster in `index.html`.

## Content now wired to the frontend
| Course / reference | Chapters or groups | Lessons / entries |
|---|---:|---:|
| Hyundai/Kia electrical and fuel | 6 | 23 |
| Bosch gasoline-engine management | 7 | 20 |
| Autel MaxiSys MS906 Pro / MS906 Pro-TS | 9 | 36 |
| Cross-domain sensor diagnostics | 5 | 11 |
| Existing Fardin Ghordi sensor reference | Existing separate module | 10 sensors |

The cross-domain diagnostic course contains one general evidence-led diagnostic workflow and 10 individual sensor workflows. The Autel course reads the 36-record pilot and device metadata, then displays each item's English label, proposed Persian equivalent, technical description, menu path, prerequisites, related terms, source locator, and review-state distinctions.

## Validation performed
- JavaScript syntax parsing of the final `source-academy.js`: **PASS**.
- JSON parsing of the Bosch, Hyundai/Kia, Autel entries, Autel device metadata, cross-domain sensor workflow, and Fardin Ghordi sensor reference files: **PASS**.
- Source structure counts: Hyundai/Kia 23 lessons; Bosch 20 lessons; Autel 36 unique IDs across 9 categories; cross-domain diagnostics 11 lessons; sensor reference 10 records.
- Required data files and frontend script references are present in the repository.
- `index.html` points to the updated source-academy script using a new cache-buster.

## Important accuracy labels
- Autel's 36 technical records carry the AI-3 pilot's `verified` status against the cited manual; this was not a fresh independent hardware test.
- All 36 Persian translations remain `draft_unreviewed`. The UI exposes this status.
- Workshop examples are author-generated educational examples, not documented real repair cases.
- Autel menu availability and labels can vary by vehicle and installed diagnostic software. The installed software version was not documented in the user manual used for this pilot.
- Sensor diagnostic workflows are educational synthesis, not OEM-specific repair procedures. Vehicle-specific wiring, pinouts, electrical values, DTC definitions and test limits must be checked against the exact vehicle service information.

## Not performed
- No browser or mobile-device runtime test was available during this pass.
- No live GitHub Pages deployment fetch was performed; repository commits are confirmed, but deployment propagation is not independently confirmed.
- No database import or migration was executed.
- No independent translation review or physical Autel hardware validation was performed.

## Status
**Frontend integration committed; static validation passed.** The new courses are wired into the technical academy and the data should appear after the Pages build/cache refresh. Runtime/deployment confirmation remains outstanding.
