-- AUTO LINGO migration 002: learning media, wiring references, simulators and labs
-- PostgreSQL 15+ / Supabase. Run after database_schema.sql.
-- All imported material remains needs_review until independently sourced and checked.

create table if not exists educational_media (
  id text primary key,
  title text not null,
  subject text,
  source_page text not null,
  image_url text,
  license_claim text,
  attribution text,
  verification_status verification_status not null default 'needs_review',
  review_notes text,
  created_at timestamptz not null default now()
);

create table if not exists wiring_references (
  id text primary key,
  title_fa text not null,
  scope text not null default 'generic_educational',
  is_specific_vehicle boolean not null default false,
  reference_data jsonb not null default '{}'::jsonb,
  verification_status verification_status not null default 'needs_review',
  created_at timestamptz not null default now()
);

create table if not exists simulator_configs (
  id text primary key,
  simulator_type text not null,
  name_fa text not null,
  configuration jsonb not null,
  verification_status verification_status not null default 'needs_review',
  created_at timestamptz not null default now()
);

create table if not exists practical_labs (
  id text primary key,
  title_en text not null,
  title_fa text not null,
  content jsonb not null,
  verification_status verification_status not null default 'needs_review',
  created_at timestamptz not null default now()
);

create table if not exists assessment_configs (
  id text primary key,
  config jsonb not null,
  verification_status verification_status not null default 'needs_review',
  created_at timestamptz not null default now()
);

-- Diagnostic trouble code: P0300 is a symptom code, not proof of a failed component.
insert into diagnostics
(id,kind,dtc_code,description_en,description_fa,dtc_scope,possible_causes,diagnostic_procedure,difficulty,verification_status)
values
('DIAG-00001','dtc','P0300','Random/Multiple Cylinder Misfire Detected','تشخیص بدسوزی تصادفی یا چندسیلندری','generic',
'["ignition_fault","injector_fault","vacuum_leak","low_compression","fuel_delivery_issue"]'::jsonb,
'["Confirm stored and pending DTCs and freeze-frame data.","Inspect plugs, coils and connectors using correct service information.","Check intake leaks and fuel trims under comparable conditions.","Perform cylinder contribution, compression or leak-down tests as appropriate.","Test injector electrical and hydraulic performance using approved procedures."]'::jsonb,
'advanced','needs_review')
on conflict (id) do nothing;

insert into repair_scenarios
(id,title_en,title_fa,category_id,vehicle_symptoms,possible_causes,diagnostic_steps,required_tools,expected_observations,recommended_next_step,safety_notes,difficulty,verification_status)
values
('SCN-0001','Random/Multiple Cylinder Misfire at Idle','بدسوزی تصادفی یا چندسیلندری در دور آرام','CAT-06',
'["rough_idle","blinking_mil","power_loss"]'::jsonb,
'["ignition_fault","injector_fault","vacuum_leak","low_compression","fuel_delivery_issue"]'::jsonb,
'["Confirm stored and pending DTCs and freeze-frame data.","Inspect plugs, coils and connectors using correct service information.","Check intake leaks and fuel trims under comparable conditions.","Perform cylinder contribution, compression or leak-down tests as appropriate.","Test injector electrical and hydraulic performance using approved procedures."]'::jsonb,
'["scan_tool","multimeter","approved_compression_tester"]'::jsonb,
'{"rpm":850,"map_kpa":48,"stft_percent":12,"ect_c":90}'::jsonb,
'Continue with the test that best separates the remaining hypotheses; do not replace parts based on P0300 alone.',
'A flashing malfunction indicator lamp can indicate catalyst-damaging misfire. Avoid continued driving under active severe misfire; diagnose promptly. Live data alone does not identify a failed part.',
'advanced','needs_review')
on conflict (id) do nothing;

insert into scenario_diagnostics(scenario_id,diagnostic_id)
values ('SCN-0001','DIAG-00001') on conflict do nothing;

insert into educational_media(id,title,subject,source_page,image_url,license_claim,verification_status,review_notes) values
('IMG-INJ-001','Port Fuel Injector','Port Fuel Injector','https://commons.wikimedia.org/wiki/File:Fuel_injector.jpg','https://commons.wikimedia.org/wiki/File:Fuel_injector.jpg','CC BY-SA 3.0','needs_review','Verify exact file, author, license and attribution before production use.'),
('IMG-GDI-001','Possible Common Rail injector image','Diesel Common Rail injector','https://commons.wikimedia.org/wiki/File:Common_rail_diesel_injectors.jpg','https://commons.wikimedia.org/wiki/File:Common_rail_diesel_injectors.jpg',null,'needs_review','Likely diesel Common Rail, not gasoline GDI. Do not label as GDI unless independently confirmed.'),
('IMG-SEN-001','Crankshaft position sensor','CKP sensor','https://commons.wikimedia.org/wiki/File:Crankshaft_Position_Sensor.jpg','https://commons.wikimedia.org/wiki/File:Crankshaft_Position_Sensor.jpg','CC BY-SA 4.0','needs_review','Verify exact file, license and attribution.'),
('IMG-IGN-001','Ignition coil and spark plug','Ignition system','https://commons.wikimedia.org/wiki/File:Spark_plug_and_coil.jpg','https://commons.wikimedia.org/wiki/File:Spark_plug_and_coil.jpg','CC BY 2.0','needs_review','Verify exact file, license and attribution.'),
('IMG-TURBO-001','Turbocharger cutaway','Turbocharger','https://commons.wikimedia.org/wiki/File:Turbocharger_cutaway.jpg','https://commons.wikimedia.org/wiki/File:Turbocharger_cutaway.jpg','CC BY-SA 3.0','needs_review','Verify license and whether wastegate is visible.')
on conflict (id) do nothing;

insert into wiring_references(id,title_fa,scope,is_specific_vehicle,reference_data,verification_status) values
('WIR-001','مدار آموزشی کنترل انژکتور','generic_educational',false,
'{"topology_note":"Many PFI systems use a shared fused supply and ECU low-side switching, but relay arrangement and driver topology vary by vehicle and injector type. High-side and peak-and-hold systems must be represented separately where applicable.","claims_to_review":[{"claim":"15 A fuse","issue":"vehicle-specific; not universal"},{"claim":"flyback peak up to 50 V","issue":"driver- and circuit-dependent"}],"safety_notes":["Do not treat fuse rating or clamp voltage as universal.","Do not probe ECU outputs without approved procedures and wiring information.","Use service information for the exact vehicle."]}'::jsonb,'needs_review'),
('WIR-002','شبکه آموزشی CAN Bus','generic_educational',false,
'{"typical_values":{"can_h_v":"2.5–3.5 V","can_l_v":"1.5–2.5 V","termination":"two 120-ohm terminators in conventional high-speed CAN; about 60 ohms across CAN-H/L when powered down"},"notes":"Typical references only; network topology, termination and CAN variant require vehicle documentation.","safety_notes":["Measure resistance only with power removed and network appropriately isolated.","Do not assume every vehicle bus exposes two accessible 120-ohm terminators."]}'::jsonb,'needs_review')
on conflict (id) do nothing;

insert into simulator_configs(id,simulator_type,name_fa,configuration,verification_status) values
('SIM-INJ-001','injector','شبیه‌ساز مفهومی انژکتور',
'{"scope":"educational_model_not_a_calibrated_flow_bench","inputs":{"rpm":{"min":600,"max":7000,"default":3000,"unit":"rpm"},"pulse_width_ms":{"min":1.5,"max":15,"default":3.2},"fuel_pressure_bar":{"min":2,"max":7,"default":3.5}},"fault_modes":["nozzle_blockage","leaking_needle","electrical_open","low_rail_pressure"],"limitations":"RPM and pulse width alone cannot determine real fuel flow. Do not present cc/min or atomization as measured/validated without a documented physical model and calibration data.","safety_notes":["Simulation only; not a substitute for a calibrated injector test bench.","Do not use simulated values to set real engine calibration."]}'::jsonb,'needs_review'),
('SENSIM-MAP-001','sensor','شبیه‌ساز سنسور MAP',
'{"sensor":"MAP","signal_model":"analog_voltage","example_range_v":[0.5,4.5],"notes":"Illustrative range only. Transfer function and voltage range vary by sensor; configure by part number before numeric diagnosis."}'::jsonb,'needs_review'),
('SENSIM-CKP-001','sensor','شبیه‌ساز سنسور CKP',
'{"sensor":"CKP","signal_models":["hall_digital_square_wave","inductive_variable_reluctance_sine_wave"],"features":["toothed_wheel","missing_tooth_reference"],"notes":"Amplitude, polarity, tooth count, gap pattern and signal conditioning are application-specific."}'::jsonb,'needs_review')
on conflict (id) do nothing;

insert into practical_labs(id,title_en,title_fa,content,verification_status) values
('LAB-RELAY-001','Automotive 4-pin and 5-pin Relay Lab','آزمایشگاه رله خودرویی ۴ و ۵ پایه',
'{"components":["automotive_relay","fused_low_voltage_supply","low_current_control_switch","test_load"],"learning_objectives":["Identify terminals 30, 85, 86, 87 and 87a where present.","Distinguish normally-open and changeover relay operation.","Measure coil resistance and verify contact switching.","Understand suppression diode/resistor polarity."],"steps":["Identify the relay diagram printed on its case.","With power disconnected, inspect coil and contact continuity.","Energize the coil only with a fused, current-limited supply of rated voltage.","Verify contact state changes and observe polarity if a suppression diode is fitted."],"safety_notes":["Use a fuse close to the supply.","Never infer terminal function from physical position; follow relay diagram.","A diode-suppressed coil is polarity-sensitive.","Use appropriately rated load and wiring; avoid mains voltage."]}'::jsonb,'needs_review')
on conflict (id) do nothing;

insert into assessment_configs(id,config,verification_status) values
('REPORT-CARD-001',
'{"type":"learning_assessment_config","language":"fa","secondary_language":"en","levels":["beginner","intermediate","advanced","professional","expert"],"metrics":["theory","simulator","projects","automotive_vocabulary"],"required_output_fields":["student_id","full_name","course_level","metrics","strengths","areas_for_improvement","recommendations","instructor_notes","next_lesson"],"rules":["Never invent scores or progress when source data is missing.","Evaluate practical work using documented performance, workmanship and safety criteria.","Show progress over time only when historical assessments exist.","Provide actionable recommendations and next lesson.","Use Persian RTL layout with English technical terms where useful."]}'::jsonb,'needs_review')
on conflict (id) do nothing;

-- Public read-only access follows the existing AUTO LINGO content model.
do $$
declare t text;
begin
  foreach t in array array['educational_media','wiring_references','simulator_configs','practical_labs','assessment_configs']
  loop
    execute format('alter table %I enable row level security;',t);
    execute format('drop policy if exists "public read" on %I;',t);
    execute format('create policy "public read" on %I for select using (true);',t);
  end loop;
end $$;
