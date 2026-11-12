# AUTONEX source-book integration review
Date: 2026-11-13

## Scope and source handling
Two newly uploaded source books were located and inspected:

1. **کتاب جامع سیستم برق و سوخت‌رسانی هیوندا و کیا** — Persian, 275 pages, author shown on title page: سید مهدی عربی.
2. **Gasoline-engine Management: Basics and Components** — Robert Bosch GmbH, Bosch Yellow Jackets, 2001 edition, 89 pages, Order No. 1 987 722 136, ISBN 3-934584-48-9.

The contents pages and selected technical sections were reviewed. This is a focused first integration, not a claim that every page, diagram or table has been independently audited. The complete PDFs are not copied to the public GitHub Pages site. The app uses independently worded instructional material with references to printed page ranges.

## Added files
- `data/technical_reference/hyundai_kia_electrical_fuel.json`
- `data/technical_reference/bosch_gasoline_engine_management.json`
- `source-academy.js`
- `source-academy.css`
- Updated `index.html` to load the two source-course assets.

## Course coverage
### Hyundai/Kia — 6 modules, 18 lessons
- Wiring-diagram structure, connector views, wire color codes and harness identification.
- Potentiometers, NTC/PTC thermistors, diodes, transistors, fuses and relay diagnosis.
- Multiplexing, CAN frame concepts, LIN, K-Line and communication fault workflow.
- BCM, FAM/RAM/IPM/SJB concepts, rain sensor/wipers and body convenience systems.
- MIL/DTC workflow, MAF/MAP/IAT, APP/ETC and fuel supply/injector fundamentals.
- Immobilizer service concepts and ADAS overview.

### Bosch — 7 modules, 15 lessons
- Four-stroke SI engine and engine-management goals.
- Electronic throttle, VVT, EGR, turbocharging, supercharging and intercooling.
- MPI/TBI/GDI architecture and electromagnetic injector basics.
- Fuel pump/filter/regulator and EVAP.
- GDI low/high-pressure circuit and mixture modes.
- Coil ignition, dwell, spark plugs, ignition timing and knock control.
- Three-way catalyst, Lambda sensors and closed-loop fuel control.

## Important source limitations and corrections in teaching treatment
- Hyundai/Kia book examples for connector pins, wiring colors, module architecture, CAN resistor measurements, sensor values, DTCs and system behavior are model/platform-specific. They are not rendered as universal repair specifications.
- Where a numerical example appears in a source, the academy directs the learner to the exact OEM wiring diagram/service data for the vehicle being repaired.
- Diagnostic procedures that could damage an ECU or create a safety risk (blindly bridging network lines, applying power to unknown pins, opening high-pressure GDI lines, testing airbag circuits with generic tools) are expressly cautioned against.
- Bosch manual is from 2001. It is used for fundamentals and the architectures it documents; claims about present-day GDI, emissions strategy and control logic must be checked against current engine-specific information.
- The books are copyrighted source material; the public app does not host complete PDF copies or reproduce large verbatim passages.

## Validation status
- Dataset design: JSON objects contain metadata, modules, topics, key concepts, workflows, diagnostic cautions, bilingual vocabulary, short quizzes and printed-page references.
- Frontend: a shared rendering module adds two independent academy chapters, module navigation, topic search, lesson cards and interactive quiz feedback.
- Static schema/JSON and JavaScript syntax checks should be run against the committed files.
- Browser testing across mobile and desktop, click-through testing and specialist/OEM review are not claimed as complete here.

## Release status
**Content integration: first structured release.**
**Technical publication: conditional.** Model-specific procedures and figures must be verified against OEM manuals before being presented as repair instructions. The source chapters are educational references, not vehicle-specific service instructions.
