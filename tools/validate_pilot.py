#!/usr/bin/env python3
"""Read-only AUTONEX Autel pilot validator.

Run from repository root:
    python3 tools/validate_pilot.py

Writes JSON and Persian Markdown reports under QA/. Source files are never
modified. Supports the current consolidated bank and the legacy entries/autel
folder layout. Uses jsonschema if installed, otherwise a built-in Draft-07
subset.
"""
import argparse
import collections
import glob
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENTRY_FILES = ["autel_all_entries (1).json", "autel_all_entries.json"]
SOURCE_FILES = ["sources (1).json", "sources/sources.json", "sources.json"]
DEVICE_FILES = ["autel_maxisys_ms906_pro.json", "devices/autel_maxisys_ms906_pro.json"]
ENTRY_SCHEMAS = ["entry.schema (1).json", "entry.schema.json", "schema/entry.schema.json"]
SOURCE_SCHEMAS = ["source.schema.json", "schema/source.schema.json"]
DEVICE_SCHEMAS = ["device.schema.json", "schema/device.schema.json"]
ROOT_IDS = {
    "autel-ms906pro-eobd",
    "autel-ms906pro-service-section",
    "autel-ms906pro-diagnosis-section",
    "autel-ms906pro-bms",
}
INVERSE = {"parent": "child", "child": "parent", "sibling": "sibling",
           "contrast": "contrast", "see_also": "see_also"}
PAGE_RE = re.compile(r"^(?:p{1,2}\.?\s*)?([0-9]+|[ivxlcdm]+)(?:\s*-\s*([0-9]+|[ivxlcdm]+))?$", re.I)


def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise RuntimeError("فایل پیدا نشد: " + str(path.relative_to(ROOT)))
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"JSON نامعتبر در {path.relative_to(ROOT)}، خط {exc.lineno}: {exc.msg}")


def pick(candidates, label):
    for name in candidates:
        path = ROOT / name
        if path.is_file():
            return path
    raise RuntimeError(f"فایل {label} پیدا نشد: {', '.join(candidates)}")


def pytype(value, kind):
    types = {"string": str, "array": list, "object": dict, "boolean": bool,
             "null": type(None), "integer": int, "number": (int, float)}
    cls = types.get(kind)
    if cls is None:
        return True
    if kind in ("integer", "number") and isinstance(value, bool):
        return False
    if kind == "integer" and isinstance(value, float):
        return value.is_integer()
    return isinstance(value, cls)


def fallback_check(value, schema, path, errors):
    if "const" in schema and value != schema["const"]:
        errors.append(f"{path}: expected const {schema['const']!r}")
    if "enum" in schema and value not in schema["enum"]:
        errors.append(f"{path}: enum mismatch ({value!r})")
    if "type" in schema:
        choices = schema["type"] if isinstance(schema["type"], list) else [schema["type"]]
        if not any(pytype(value, item) for item in choices):
            errors.append(f"{path}: wrong type; expected {choices}")
            return
    if isinstance(value, str):
        if "pattern" in schema and not re.search(schema["pattern"], value):
            errors.append(f"{path}: pattern mismatch")
        if "minLength" in schema and len(value) < schema["minLength"]:
            errors.append(f"{path}: string shorter than minLength")
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if "minimum" in schema and value < schema["minimum"]:
            errors.append(f"{path}: below minimum")
    if isinstance(value, list):
        if "minItems" in schema and len(value) < schema["minItems"]:
            errors.append(f"{path}: fewer than minItems")
        if "items" in schema:
            for index, item in enumerate(value):
                fallback_check(item, schema["items"], f"{path}[{index}]", errors)
    if isinstance(value, dict):
        for key in schema.get("required", []):
            if key not in value:
                errors.append(f"{path}: missing required field {key}")
        props = schema.get("properties", {})
        if schema.get("additionalProperties") is False:
            for key in value:
                if key not in props:
                    errors.append(f"{path}: unexpected field {key}")
        for key, sub in props.items():
            if key in value:
                fallback_check(value[key], sub, f"{path}.{key}", errors)


def schema_errors(value, schema, label):
    errors = []
    try:
        import jsonschema
        for err in jsonschema.Draft7Validator(schema).iter_errors(value):
            loc = ".".join(str(x) for x in err.absolute_path)
            errors.append(f"{label}{('.' + loc) if loc else ''}: {err.message[:180]}")
    except ImportError:
        fallback_check(value, schema, label, errors)
    return errors


def roman_num(token):
    values = {"i": 1, "v": 5, "x": 10, "l": 50, "c": 100, "d": 500, "m": 1000}
    total = 0
    previous = 0
    for ch in token.lower()[::-1]:
        current = values[ch]
        total += -current if current < previous else current
        if current >= previous:
            previous = current
    return total


def page_token(token):
    if token.isdigit():
        return "n:" + str(int(token))
    if re.fullmatch(r"[ivxlcdm]+", token, re.I):
        return "r:" + str(roman_num(token))
    raise ValueError("شماره صفحه نامعتبر: " + token)


def parse_pages(spec):
    if spec is None or spec == "":
        return set()
    if isinstance(spec, (int, float)) and not isinstance(spec, bool):
        return {page_token(str(int(spec)))}
    if not isinstance(spec, str):
        raise ValueError("فرمت شماره صفحه پشتیبانی نمی‌شود: " + repr(spec))
    result = set()
    for part in re.split(r"[;,]", spec):
        part = part.strip()
        if not part:
            continue
        match = PAGE_RE.fullmatch(part)
        if not match:
            raise ValueError("قالب ارجاع صفحه نامعتبر است: " + part)
        first, last = match.group(1), match.group(2) or match.group(1)
        a, b = page_token(first), page_token(last)
        if a[:2] != b[:2]:
            raise ValueError("بازه رومی و عددی با هم ترکیب شده است: " + part)
        lo, hi = int(a[2:]), int(b[2:])
        if hi < lo:
            raise ValueError("بازه صفحات نزولی است: " + part)
        result.update(a[:2] + str(n) for n in range(lo, hi + 1))
    return result


def add_citation(citations, source_id, spec, label, errors):
    try:
        citations[source_id].update(parse_pages(spec))
    except ValueError as exc:
        errors.append(f"{label}: {exc}")


def source_manifest(source):
    result = set()
    cited = source.get("pages_cited", {})
    for item in cited.get("front_matter", []):
        result.add(page_token(str(item)))
    for span in cited.get("numbered", []):
        lo, hi = int(span["from"]), int(span["to"])
        if hi < lo:
            raise ValueError("بازه pages_cited نزولی است")
        result.update("n:" + str(n) for n in range(lo, hi + 1))
    return result


def get_entries(explicit_path=None):
    if explicit_path:
        path = ROOT / explicit_path
        payload = load_json(path)
        label = str(path.relative_to(ROOT))
    else:
        path = next((ROOT / n for n in ENTRY_FILES if (ROOT / n).is_file()), None)
        if path:
            payload = load_json(path)
            label = str(path.relative_to(ROOT))
        else:
            files = sorted(glob.glob(str(ROOT / "entries" / "autel" / "*.json")))
            if not files:
                raise RuntimeError("بانک Autel در مسیرهای پشتیبانی‌شده پیدا نشد.")
            payload = []
            for filename in files:
                part = load_json(Path(filename))
                payload.extend(part.get("entries", []) if isinstance(part, dict) else part)
            label = "entries/autel/*.json"
    if isinstance(payload, dict):
        entries = payload.get("entries")
        if not isinstance(entries, list):
            raise RuntimeError("فیلد entries در بانک تجمیع‌شده آرایه نیست.")
        if payload.get("count") is not None and payload["count"] != len(entries):
            return entries, label, [f"count داخل فایل {payload['count']} با entries={len(entries)} برابر نیست."]
        return entries, label, []
    if isinstance(payload, list):
        return payload, label, []
    raise RuntimeError("ساختار بانک باید آرایه یا object دارای entries باشد.")


def md_report(report):
    s = report["summary"]
    lines = [
        "# گزارش اعتبارسنجی پایلوت Autel — AUTONEX",
        "",
        "وضعیت: **" + report["status"] + "**",
        "",
        "- تاریخ اجرا: " + report["run_date"],
        "- بانک: " + report["files"]["entries"],
        "- منابع: " + report["files"]["sources"],
        "- دستگاه: " + report["files"]["device"],
        "- موتور Schema: " + report["schema_engine"],
        "",
        "## خلاصه",
        "",
        "| شاخص | مقدار |",
        "|---|---:|",
        f"| رکوردها | {s['records']} |",
        f"| شناسه یکتا | {s['unique_ids']} |",
        f"| روابط کل | {s['relations']} |",
        f"| روابط داخلی | {s['internal_relations']} |",
        f"| روابط بدون target | {s['null_target_relations']} |",
        f"| دسته‌ها | {s['categories']} |",
        f"| صفحات استنادشده | {s['cited_pages']} |",
        f"| خطاها | {s['errors']} |",
        f"| هشدارها | {s['warnings']} |",
        "",
        "## ترجمه و مثال",
        "",
        f"- ترجمه‌های draft_unreviewed: {s['translation_draft_unreviewed']}",
        f"- مثال کامل: {s['examples_complete']}",
        f"- مثال brief: {s['examples_brief']}",
        "",
        "## پوشش صفحات منبع",
        "",
    ]
    for sid, item in report["page_coverage"].items():
        lines.append(
            f"- {sid}: استنادشده {item['cited']} صفحه؛ pages_used شامل {item['used']} صفحه؛ "
            f"خارج از pages_used: {item['outside_pages_used']}"
        )
    lines.extend(["", "## خطاها", ""])
    lines.extend(["- ERROR: " + x for x in report["errors"]] or ["خطای مسدودکننده پیدا نشد."])
    lines.extend(["", "## هشدارها", ""])
    lines.extend(["- WARN: " + x for x in report["warnings"]] or ["هشداری ثبت نشد."])
    lines.extend([
        "",
        "## محدودیت اعتبارسنجی",
        "",
        "- این ابزار ساختار JSON، پیوندهای شناسه‌ای و پوشش ارجاع صفحات را بررسی می‌کند.",
        "- این گزارش تأیید مستقل محتوای فنی، صحت ترجمه یا عملکرد منوها روی دستگاه فیزیکی نیست.",
        "- وضعیت verified در داده، ادعای ثبت‌شده در مرحله تحقیق است و این اسکریپت آن را مستقلاً راستی‌آزمایی نمی‌کند.",
        "- ترجمه‌ها تا بازبینی انسانی باید draft_unreviewed بمانند.",
        "- مثال‌های تألیفی، سناریوهای آموزشی‌اند و نباید پرونده واقعی تعمیرگاه معرفی شوند.",
        "",
    ])
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="اعتبارسنجی بانک Autel در مخزن AUTONEX")
    parser.add_argument("--entries", help="مسیر بانک تجمیع‌شده، نسبت به ریشه مخزن")
    parser.add_argument("--sources", help="مسیر فایل منابع")
    parser.add_argument("--device", help="مسیر فایل دستگاه")
    parser.add_argument("--json-report", default="QA/AI3_AUTEL_PILOT_VALIDATION.json")
    parser.add_argument("--md-report", default="QA/AI3_AUTEL_PILOT_VALIDATION.md")
    parser.add_argument("--strict-warnings", action="store_true")
    args = parser.parse_args()

    errors, warnings, notes = [], [], []
    schema_engine = "built-in fallback"
    try:
        entries, entry_label, bank_notes = get_entries(args.entries)
        notes.extend(bank_notes)
        source_path = ROOT / args.sources if args.sources else pick(SOURCE_FILES, "منابع")
        device_path = ROOT / args.device if args.device else pick(DEVICE_FILES, "دستگاه")
        entry_schema_path = pick(ENTRY_SCHEMAS, "Schema رکورد")
        source_schema_path = pick(SOURCE_SCHEMAS, "Schema منبع")
        device_schema_path = pick(DEVICE_SCHEMAS, "Schema دستگاه")
        sources = load_json(source_path)
        device = load_json(device_path)
        entry_schema = load_json(entry_schema_path)
        source_schema = load_json(source_schema_path)
        device_schema = load_json(device_schema_path)
        try:
            import jsonschema
            schema_engine = "jsonschema Draft-07"
        except ImportError:
            pass
    except Exception as exc:
        print("FATAL:", exc, file=sys.stderr)
        return 2

    files = {
        "entries": entry_label,
        "sources": str(source_path.relative_to(ROOT)),
        "device": str(device_path.relative_to(ROOT)),
        "entry_schema": str(entry_schema_path.relative_to(ROOT)),
        "source_schema": str(source_schema_path.relative_to(ROOT)),
        "device_schema": str(device_schema_path.relative_to(ROOT)),
    }

    errors.extend(schema_errors(entries, {"type": "array", "items": entry_schema}, "entries"))
    errors.extend(schema_errors(sources, source_schema, "sources"))
    errors.extend(schema_errors(device, device_schema, "device"))

    if not isinstance(sources, list):
        errors.append("sources باید آرایه باشد.")
        sources = []
    if not isinstance(device, dict):
        errors.append("device باید object باشد.")
        device = {}

    by_id = {}
    duplicate_ids = []
    for rec in entries:
        if not isinstance(rec, dict):
            errors.append("یکی از رکوردهای بانک object نیست.")
            continue
        rid = rec.get("id")
        if not rid:
            errors.append("رکوردی فاقد id است.")
            continue
        if rid in by_id:
            duplicate_ids.append(rid)
        else:
            by_id[rid] = rec
    if duplicate_ids:
        errors.append("شناسه‌های تکراری: " + ", ".join(sorted(set(duplicate_ids))))

    source_by_id = {}
    for source in sources:
        sid = source.get("source_id") if isinstance(source, dict) else None
        if not sid:
            errors.append("رکورد منبع فاقد source_id است.")
            continue
        if sid in source_by_id:
            errors.append("source_id تکراری: " + sid)
        source_by_id[sid] = source

    if device.get("documentation", {}).get("source_id") not in source_by_id:
        errors.append("documentation.source_id دستگاه در sources پیدا نشد.")
    device_sid = device.get("documentation", {}).get("source_id")
    if device_sid in source_by_id:
        if device.get("documentation", {}).get("document_edition") != source_by_id[device_sid].get("document_edition"):
            errors.append("نسخه راهنمای دستگاه با document_edition منبع برابر نیست.")

    software = device.get("device_software", {})
    if software.get("diagnostic_software_version") is not None:
        errors.append("نسخه نرم‌افزار دستگاه باید تا مشاهده روی سخت‌افزار واقعی null بماند.")
    if software.get("status") != "not_documented_in_source":
        errors.append("device_software.status باید not_documented_in_source باشد.")

    citations = collections.defaultdict(set)
    relation_counts = collections.Counter()
    null_counts = collections.Counter()
    term_context_counts = collections.Counter()
    example_counts = collections.Counter()
    translation_counts = collections.Counter()
    categories = set()
    relation_total = 0
    internal_relations = 0
    unclassified_null_targets = 0
    allowed_target_scopes = {"alias_or_synonym", "ui_status_label", "ui_element", "distinct_function", "outside_pilot_child", "outside_pilot_related"}

    for group in (device.get("hardware_facts", {}), software):
        for ref in group.get("source_refs", []) if isinstance(group, dict) else []:
            sid = ref.get("source_id", device_sid)
            if sid not in source_by_id:
                errors.append("ارجاع اطلاعات دستگاه به منبع ناشناخته: " + str(sid))
            add_citation(citations, sid, ref.get("printed_page"), "device.source_refs", errors)

    for rec in entries:
        if not isinstance(rec, dict):
            continue
        rid = rec.get("id", "?")
        categories.add(str(rec.get("category", "سایر")))
        term_context_counts[(str(rec.get("term_en", "")), str(rec.get("context", "")))] += 1

        if rec.get("device_id") != device.get("device_id"):
            errors.append(f"{rid}: device_id با فایل دستگاه برابر نیست.")
        if rec.get("brand") != device.get("brand"):
            errors.append(f"{rid}: brand با فایل دستگاه برابر نیست.")

        source_doc = rec.get("source_document", {})
        sid = source_doc.get("source_id")
        if sid not in source_by_id:
            errors.append(f"{rid}: source_document به منبع ناشناخته {sid} اشاره می‌کند.")
        elif source_doc.get("document_edition") != source_by_id[sid].get("document_edition"):
            errors.append(f"{rid}: نسخه سند با رجیستری منبع یکسان نیست.")

        record_software = rec.get("device_software", {})
        if record_software.get("diagnostic_software_version") is not None:
            errors.append(f"{rid}: نسخه نرم‌افزار باید null بماند.")
        if record_software.get("status") != "not_documented_in_source":
            errors.append(f"{rid}: وضعیت نسخه نرم‌افزار نامعتبر است.")

        translation = rec.get("verification", {}).get("translation", {}).get("status", "missing")
        translation_counts[translation] += 1
        if translation != "draft_unreviewed":
            errors.append(f"{rid}: ترجمه بدون بازبینی انسانی نباید تأییدشده نشان داده شود.")

        example = rec.get("verification", {}).get("workshop_example", {})
        example_status = str(example.get("status", "missing"))
        example_counts[example_status] += 1
        example_text = str(rec.get("workshop_example_fa", "")).strip()
        if not example_text or "هنوز تکمیل نشده" in example_text:
            errors.append(f"{rid}: مثال کارگاهی خالی یا placeholder است.")
        if example.get("origin") == "author_generated_educational_scenario" and example.get("documented_real_case") is not False:
            errors.append(f"{rid}: مثال تألیفی باید documented_real_case=false داشته باشد.")

        refs = rec.get("source_refs", [])
        if not refs:
            errors.append(f"{rid}: حداقل یک source_ref لازم است.")
        for ref in refs:
            ref_sid = ref.get("source_id")
            if ref_sid not in source_by_id:
                errors.append(f"{rid}: source_ref به منبع ناشناخته {ref_sid} اشاره می‌کند.")
            add_citation(citations, ref_sid, ref.get("printed_page"), f"{rid}.source_refs", errors)

        for variant in rec.get("term_variants_in_manual", []):
            add_citation(citations, sid, variant.get("printed_pages"), f"{rid}.term_variants_in_manual", errors)
        for basis in rec.get("workshop_example_basis", []):
            basis_sid = basis.get("source_id", sid)
            add_citation(citations, basis_sid, basis.get("printed_page"), f"{rid}.workshop_example_basis", errors)
        if rec.get("usage_basis"):
            add_citation(citations, sid, rec.get("usage_basis"), f"{rid}.usage_basis", errors)

        parents = []
        seen = set()
        for rel in rec.get("related_terms", []):
            relation_total += 1
            relation = str(rel.get("relation", ""))
            relation_counts[relation] += 1
            if relation == "parent":
                parents.append(rel)
            key = (rel.get("term"), relation, rel.get("target_id"))
            if key in seen:
                errors.append(f"{rid}: رابطه تکراری {key}")
            seen.add(key)

            add_citation(citations, sid, rel.get("source_pages"), f"{rid}.related_terms", errors)
            target_id = rel.get("target_id")
            if target_id:
                internal_relations += 1
                if target_id == rid:
                    errors.append(f"{rid}: self relation")
                target = by_id.get(target_id)
                if target is None:
                    errors.append(f"{rid}: target_id ناموجود {target_id}")
                    continue
                if rel.get("term") != target.get("term_en"):
                    errors.append(f"{rid}: term با term_en هدف {target_id} برابر نیست.")
                if rel.get("target_context") != target.get("context"):
                    errors.append(f"{rid}: target_context برای {target_id} اشتباه یا خالی است.")
                inverse = INVERSE.get(relation)
                if inverse and not any(
                    back.get("target_id") == rid and back.get("relation") == inverse
                    for back in target.get("related_terms", [])
                ):
                    errors.append(f"{rid}: رابطه معکوس {inverse} در {target_id} موجود نیست.")
            else:
                null_counts[relation] += 1
                if rel.get("target_context") is not None:
                    errors.append(f"{rid}: رابطه بدون target باید target_context=null داشته باشد.")
                scope = rel.get("target_scope")
                if scope not in allowed_target_scopes:
                    unclassified_null_targets += 1
                    errors.append(f"{rid}: رابطه بدون target_id باید target_scope معتبر داشته باشد.")
                elif not str(rel.get("note", "")).strip():
                    warnings.append(f"{rid}: دلیل بیرونی‌بودن رابطه {rel.get('term')} توضیح داده نشده است.")

        if len(parents) > 1:
            errors.append(f"{rid}: بیش از یک parent دارد.")
        elif len(parents) == 0 and rid not in ROOT_IDS:
            warnings.append(f"{rid}: parent ندارد؛ ریشه‌بودن آن نیازمند تأیید است.")

    for (term, context), count in term_context_counts.items():
        if count > 1:
            errors.append(f"ترکیب term_en/context تکراری است: {term!r} / {context!r}")

    page_coverage = {}
    for sid, source in source_by_id.items():
        cited = citations.get(sid, set())
        try:
            manifest = source_manifest(source)
            used = parse_pages(source.get("pages_used", ""))
        except (ValueError, TypeError, KeyError) as exc:
            errors.append(f"{sid}: manifest صفحات نامعتبر است: {exc}")
            manifest, used = set(), set()
        missing_manifest = sorted(cited - manifest)
        outside_used = sorted(cited - used)
        extras = sorted(manifest - cited)
        if missing_manifest:
            errors.append(f"{sid}: pages_cited بعضی استنادها را پوشش نمی‌دهد: {missing_manifest[:20]}")
        if outside_used:
            errors.append(f"{sid}: صفحات استنادشده خارج از pages_used هستند: {outside_used[:20]}")
        if extras:
            warnings.append(f"{sid}: pages_cited شامل صفحات بدون ارجاع ساختاریافته است: {extras[:20]}")
        page_coverage[sid] = {
            "cited": len(cited),
            "used": len(used),
            "outside_pages_used": outside_used,
            "missing_from_manifest": missing_manifest,
            "extra_in_manifest": extras,
        }

    if example_counts.get("brief", 0):
        warnings.append(f"{example_counts['brief']} مثال کارگاهی هنوز brief است و باید توسعه یابد.")
    null_total = sum(null_counts.values())
    if unclassified_null_targets:
        warnings.append(f"{unclassified_null_targets} رابطه بدون target_id هنوز target_scope مستند ندارد.")
    draft_total = translation_counts.get("draft_unreviewed", 0)
    if draft_total:
        warnings.append(f"{draft_total} ترجمه draft_unreviewed است؛ این وضعیت تا بازبینی انسانی حفظ شود.")
    warnings.extend(notes)

    errors = list(dict.fromkeys(errors))
    warnings = list(dict.fromkeys(warnings))
    page_total = sum(item["cited"] for item in page_coverage.values())
    summary = {
        "records": len(entries),
        "unique_ids": len(by_id),
        "relations": relation_total,
        "internal_relations": internal_relations,
        "null_target_relations": null_total,
        "unclassified_null_target_relations": unclassified_null_targets,
        "null_target_by_relation": dict(null_counts),
        "categories": len(categories),
        "cited_pages": page_total,
        "translation_draft_unreviewed": draft_total,
        "examples_complete": example_counts.get("complete", 0),
        "examples_brief": example_counts.get("brief", 0),
        "errors": len(errors),
        "warnings": len(warnings),
    }
    status = "FAIL" if errors else ("PASS_WITH_WARNINGS" if warnings else "PASS")
    from datetime import datetime, timezone
    report = {
        "validator": "AUTONEX Autel Pilot Validator",
        "version": "2.0.0",
        "run_date": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "status": status,
        "schema_engine": schema_engine,
        "files": files,
        "device_software_status": software.get("status", "missing"),
        "summary": summary,
        "relationship_counts": dict(relation_counts),
        "page_coverage": page_coverage,
        "errors": errors,
        "warnings": warnings,
        "read_only": True,
    }

    json_path = ROOT / args.json_report
    md_path = ROOT / args.md_report
    json_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    md_path.write_text(md_report(report), encoding="utf-8")

    print(
        f"records: {summary['records']} | relations: {summary['relations']} | "
        f"errors: {summary['errors']} | warnings: {summary['warnings']} | status: {status}"
    )
    print("JSON report:", json_path.relative_to(ROOT))
    print("Markdown report:", md_path.relative_to(ROOT))
    for item in errors[:50]:
        print("ERROR:", item)
    for item in warnings[:30]:
        print("WARN:", item)
    return 1 if errors or (args.strict_warnings and warnings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
