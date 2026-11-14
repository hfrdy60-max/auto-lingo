#!/usr/bin/env python3
"""Read-only validator for the AI-3 Autel v0.3 pilot bank.

This validator intentionally supports JSON Schema type unions (for example
["string", "null"]) without requiring the optional jsonschema package.
It checks structure, IDs, reciprocal links, source editions and page coverage.
It does not independently verify technical claims or translations.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "data/technical_reference/autel_ms906pro_v03"
DEFAULTS = {
    "entries": BASE / "entries.json",
    "device": BASE / "device.json",
    "sources": BASE / "sources.json",
    "entry_schema": BASE / "entry.schema.json",
    "device_schema": BASE / "device.schema.json",
    "source_schema": BASE / "source.schema.json",
}
INVERSE = {
    "parent": "child",
    "child": "parent",
    "sibling": "sibling",
    "contrast": "contrast",
    "see_also": "see_also",
}
PAGE_RE = re.compile(
    r"^(?:p{1,2}\.?\s*)?(\d+|[ivxlcdm]+)(?:\s*-\s*(\d+|[ivxlcdm]+))?$",
    re.IGNORECASE,
)


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise RuntimeError(f"فایل پیدا نشد: {path.relative_to(ROOT)}") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"JSON نامعتبر در {path.relative_to(ROOT)}، خط {exc.lineno}: {exc.msg}"
        ) from exc


def json_type_matches(value: Any, expected: str) -> bool:
    if expected == "null":
        return value is None
    if expected == "object":
        return isinstance(value, dict)
    if expected == "array":
        return isinstance(value, list)
    if expected == "string":
        return isinstance(value, str)
    if expected == "boolean":
        return isinstance(value, bool)
    if expected == "integer":
        return isinstance(value, int) and not isinstance(value, bool)
    if expected == "number":
        return isinstance(value, (int, float)) and not isinstance(value, bool)
    return True


def schema_check(value: Any, schema: dict[str, Any], path: str, errors: list[str]) -> None:
    """Small Draft-07 subset sufficient for the checked v0.3 schemas."""
    if "const" in schema and value != schema["const"]:
        errors.append(f"{path}: مقدار باید {schema['const']!r} باشد.")
    if "enum" in schema and value not in schema["enum"]:
        errors.append(f"{path}: مقدار خارج از enum است: {value!r}")
    if "type" in schema:
        expected = schema["type"]
        choices = expected if isinstance(expected, list) else [expected]
        if not any(json_type_matches(value, item) for item in choices):
            errors.append(f"{path}: نوع نامعتبر؛ انتظار {choices}، دریافت {type(value).__name__}.")
            return

    if isinstance(value, str):
        if "minLength" in schema and len(value) < schema["minLength"]:
            errors.append(f"{path}: طول رشته کمتر از minLength است.")
        if "pattern" in schema and re.search(schema["pattern"], value) is None:
            errors.append(f"{path}: الگوی متنی pattern رعایت نشده است.")

    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if "minimum" in schema and value < schema["minimum"]:
            errors.append(f"{path}: مقدار از minimum کمتر است.")

    if isinstance(value, list):
        if "minItems" in schema and len(value) < schema["minItems"]:
            errors.append(f"{path}: تعداد اعضای آرایه کمتر از minItems است.")
        item_schema = schema.get("items")
        if isinstance(item_schema, dict):
            for index, item in enumerate(value):
                schema_check(item, item_schema, f"{path}[{index}]", errors)

    if isinstance(value, dict):
        for key in schema.get("required", []):
            if key not in value:
                errors.append(f"{path}: فیلد الزامی {key!r} وجود ندارد.")
        properties = schema.get("properties", {})
        if schema.get("additionalProperties") is False:
            for key in value:
                if key not in properties:
                    errors.append(f"{path}: فیلد اضافی {key!r} مجاز نیست.")
        for key, child_schema in properties.items():
            if key in value and isinstance(child_schema, dict):
                schema_check(value[key], child_schema, f"{path}.{key}", errors)


def roman_to_int(value: str) -> int:
    values = {"i": 1, "v": 5, "x": 10, "l": 50, "c": 100, "d": 500, "m": 1000}
    total = 0
    previous = 0
    for char in value.lower()[::-1]:
        current = values[char]
        total += -current if current < previous else current
        if current >= previous:
            previous = current
    return total


def page_key(token: str) -> tuple[str, int]:
    token = token.strip().lower()
    if token.isdigit():
        return ("n", int(token))
    if re.fullmatch(r"[ivxlcdm]+", token):
        return ("r", roman_to_int(token))
    raise ValueError(f"شماره صفحه نامعتبر: {token}")


def parse_pages(spec: Any) -> set[tuple[str, int]]:
    if spec is None or spec == "":
        return set()
    result: set[tuple[str, int]] = set()
    if isinstance(spec, int) and not isinstance(spec, bool):
        return {("n", spec)}
    if not isinstance(spec, str):
        raise ValueError(f"نوع شماره صفحه پشتیبانی نمی‌شود: {type(spec).__name__}")
    for part in re.split(r"[;,]", spec):
        part = part.strip()
        if not part:
            continue
        match = PAGE_RE.fullmatch(part)
        if not match:
            raise ValueError(f"قالب ارجاع صفحه نامعتبر است: {part}")
        start = page_key(match.group(1))
        end = page_key(match.group(2) or match.group(1))
        if start[0] != end[0]:
            raise ValueError(f"بازه عددی و رومی ترکیب شده است: {part}")
        if end[1] < start[1]:
            raise ValueError(f"بازه صفحات نزولی است: {part}")
        result.update((start[0], number) for number in range(start[1], end[1] + 1))
    return result


def collect_pages(
    citations: dict[str, set[tuple[str, int]]],
    source_id: str,
    spec: Any,
    label: str,
    errors: list[str],
) -> None:
    try:
        citations[source_id].update(parse_pages(spec))
    except ValueError as exc:
        errors.append(f"{label}: {exc}")


def manifest_pages(source: dict[str, Any]) -> set[tuple[str, int]]:
    pages = source.get("pages_cited", {})
    result = {page_key(str(item)) for item in pages.get("front_matter", [])}
    for span in pages.get("numbered", []):
        start, end = int(span["from"]), int(span["to"])
        if end < start:
            raise ValueError("بازه pages_cited نزولی است.")
        result.update(("n", number) for number in range(start, end + 1))
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="اعتبارسنجی پایلوت Autel v0.3 در AUTONEX")
    for name in ("entries", "device", "sources", "entry_schema", "device_schema", "source_schema"):
        parser.add_argument("--" + name.replace("_", "-"), default=str(DEFAULTS[name].relative_to(ROOT)))
    parser.add_argument("--json-report", default="QA/AUTEL_V03_VALIDATION.json")
    parser.add_argument("--md-report", default="QA/AUTEL_V03_VALIDATION.md")
    parser.add_argument("--strict-warnings", action="store_true")
    args = parser.parse_args()

    paths = {
        "entries": ROOT / args.entries,
        "device": ROOT / args.device,
        "sources": ROOT / args.sources,
        "entry_schema": ROOT / args.entry_schema,
        "device_schema": ROOT / args.device_schema,
        "source_schema": ROOT / args.source_schema,
    }
    try:
        loaded = {key: load_json(path) for key, path in paths.items()}
    except Exception as exc:
        print("FATAL:", exc, file=sys.stderr)
        return 2

    bank = loaded["entries"]
    device = loaded["device"]
    sources = loaded["sources"]
    schemas = {
        "entry": loaded["entry_schema"],
        "device": loaded["device_schema"],
        "source": loaded["source_schema"],
    }
    errors: list[str] = []
    warnings: list[str] = []

    if not isinstance(bank, dict) or not isinstance(bank.get("entries"), list):
        errors.append("ساختار بانک باید object دارای آرایه entries باشد.")
        records: list[dict[str, Any]] = []
    else:
        records = bank["entries"]
        if bank.get("count") != len(records):
            errors.append(f"count بانک ({bank.get('count')}) با تعداد entries ({len(records)}) برابر نیست.")
        if bank.get("schema_version") != "0.3":
            errors.append("schema_version بانک باید 0.3 باشد.")

    if not isinstance(sources, list):
        errors.append("ساختار sources باید آرایه باشد.")
        sources = []
    if not isinstance(device, dict):
        errors.append("ساختار device باید object باشد.")
        device = {}

    schema_check(device, schemas["device"], "device", errors)
    schema_check(sources, schemas["source"], "sources", errors)
    for index, record in enumerate(records):
        schema_check(record, schemas["entry"], f"entries[{index}]", errors)

    by_id: dict[str, dict[str, Any]] = {}
    duplicates: list[str] = []
    for record in records:
        if not isinstance(record, dict):
            errors.append("یکی از رکوردها object نیست.")
            continue
        record_id = record.get("id")
        if not isinstance(record_id, str) or not record_id:
            errors.append("رکوردی فاقد شناسه معتبر است.")
            continue
        if record_id in by_id:
            duplicates.append(record_id)
        by_id[record_id] = record
    if duplicates:
        errors.append("شناسه‌های تکراری: " + ", ".join(sorted(set(duplicates))))

    source_by_id: dict[str, dict[str, Any]] = {}
    for source in sources:
        if not isinstance(source, dict) or not source.get("source_id"):
            errors.append("رکورد منبع فاقد source_id است.")
            continue
        source_id = source["source_id"]
        if source_id in source_by_id:
            errors.append(f"source_id تکراری: {source_id}")
        source_by_id[source_id] = source

    doc = device.get("documentation", {})
    device_source_id = doc.get("source_id")
    if device_source_id not in source_by_id:
        errors.append("documentation.source_id دستگاه در فهرست منابع نیست.")
    elif doc.get("document_edition") != source_by_id[device_source_id].get("document_edition"):
        errors.append("نسخه سند دستگاه با document_edition در فهرست منابع برابر نیست.")

    device_software = device.get("device_software", {})
    if device_software.get("diagnostic_software_version") is not None:
        errors.append("نسخه نرم‌افزار دیاگ باید تا مشاهده روی دستگاه واقعی null بماند.")
    if device_software.get("status") != "not_documented_in_source":
        errors.append("وضعیت نسخه نرم‌افزار دستگاه باید not_documented_in_source باشد.")

    citations: dict[str, set[tuple[str, int]]] = defaultdict(set)
    categories = Counter()
    translations = Counter()
    technical_status = Counter()
    example_status = Counter()
    relation_types = Counter()
    relation_total = 0
    internal_relations = 0
    null_relations = 0
    context_pairs = Counter()

    for group_name in ("hardware_facts", "device_software"):
        group = device.get(group_name, {})
        for ref in group.get("source_refs", []) if isinstance(group, dict) else []:
            source_id = ref.get("source_id", device_source_id)
            if source_id not in source_by_id:
                errors.append(f"device.{group_name}: source_id ناشناخته {source_id}")
            collect_pages(citations, source_id, ref.get("printed_page"), f"device.{group_name}", errors)

    for record in records:
        if not isinstance(record, dict):
            continue
        record_id = record.get("id", "?")
        categories[str(record.get("category", "سایر"))] += 1
        context_pairs[(record.get("term_en", ""), record.get("context", ""))] += 1

        if record.get("device_id") != device.get("device_id"):
            errors.append(f"{record_id}: device_id با فایل دستگاه برابر نیست.")
        if record.get("brand") != device.get("brand"):
            errors.append(f"{record_id}: brand با فایل دستگاه برابر نیست.")

        source_doc = record.get("source_document", {})
        source_id = source_doc.get("source_id")
        if source_id not in source_by_id:
            errors.append(f"{record_id}: source_document به منبع ناشناخته {source_id} اشاره می‌کند.")
        elif source_doc.get("document_edition") != source_by_id[source_id].get("document_edition"):
            errors.append(f"{record_id}: edition رکورد با رجیستری منبع برابر نیست.")

        record_software = record.get("device_software", {})
        if record_software.get("diagnostic_software_version") is not None:
            errors.append(f"{record_id}: نسخه نرم‌افزار باید null بماند.")
        if record_software.get("status") != "not_documented_in_source":
            errors.append(f"{record_id}: وضعیت نسخه نرم‌افزار نامعتبر است.")

        translation = record.get("verification", {}).get("translation", {}).get("status", "missing")
        translations[translation] += 1
        if translation != "draft_unreviewed":
            errors.append(f"{record_id}: ترجمه بدون بازبینی انسانی نباید تأییدشده علامت‌گذاری شود.")

        technical = record.get("verification", {}).get("technical", {})
        technical_status[str(technical.get("status", "missing"))] += 1
        example = record.get("verification", {}).get("workshop_example", {})
        example_status[str(example.get("status", "missing"))] += 1
        example_text = str(record.get("workshop_example_fa", "")).strip()
        if not example_text:
            errors.append(f"{record_id}: متن مثال آموزشی خالی است.")
        if example.get("scenario_origin") != "author_generated_educational_scenario":
            errors.append(f"{record_id}: منشأ مثال باید author_generated_educational_scenario باشد.")
        if example.get("documented_real_case") is not False:
            errors.append(f"{record_id}: مثال تألیفی باید documented_real_case=false داشته باشد.")
        if not record.get("workshop_example_basis"):
            errors.append(f"{record_id}: مبنای صفحه‌ای مثال آموزشی خالی است.")

        refs = record.get("source_refs", [])
        if not refs:
            errors.append(f"{record_id}: حداقل یک source_ref لازم است.")
        for ref in refs:
            ref_source_id = ref.get("source_id")
            if ref_source_id not in source_by_id:
                errors.append(f"{record_id}: source_ref به منبع ناشناخته {ref_source_id} اشاره می‌کند.")
            collect_pages(citations, ref_source_id, ref.get("printed_page"), f"{record_id}.source_refs", errors)

        for variant in record.get("term_variants_in_manual", []):
            collect_pages(citations, source_id, variant.get("printed_pages"), f"{record_id}.term_variants_in_manual", errors)
        for basis in record.get("workshop_example_basis", []):
            basis_source = basis.get("source_id", source_id)
            collect_pages(citations, basis_source, basis.get("printed_page"), f"{record_id}.workshop_example_basis", errors)
        collect_pages(citations, source_id, record.get("usage_basis"), f"{record_id}.usage_basis", errors)

        parents = []
        seen_relations = set()
        for relation in record.get("related_terms", []):
            relation_total += 1
            rel_type = str(relation.get("relation", ""))
            relation_types[rel_type] += 1
            if rel_type == "parent":
                parents.append(relation)
            unique_key = (relation.get("term"), rel_type, relation.get("target_id"))
            if unique_key in seen_relations:
                errors.append(f"{record_id}: رابطه تکراری {unique_key}")
            seen_relations.add(unique_key)
            collect_pages(citations, source_id, relation.get("source_pages"), f"{record_id}.related_terms", errors)

            target_id = relation.get("target_id")
            if target_id:
                internal_relations += 1
                if target_id == record_id:
                    errors.append(f"{record_id}: رابطه خودارجاع دارد.")
                target = by_id.get(target_id)
                if target is None:
                    errors.append(f"{record_id}: target_id ناموجود {target_id}")
                    continue
                if relation.get("term") != target.get("term_en"):
                    errors.append(f"{record_id}: term با term_en رکورد مقصد {target_id} برابر نیست.")
                if relation.get("target_context") != target.get("context"):
                    errors.append(f"{record_id}: target_context برای {target_id} نادرست است.")
                inverse = INVERSE.get(rel_type)
                if inverse and not any(
                    back.get("target_id") == record_id and back.get("relation") == inverse
                    for back in target.get("related_terms", [])
                ):
                    errors.append(f"{record_id}: رابطه معکوس {inverse} در {target_id} وجود ندارد.")
            else:
                null_relations += 1
                if relation.get("target_context") is not None:
                    errors.append(f"{record_id}: target_context در رابطه بیرونی باید null باشد.")
                if not str(relation.get("note", "")).strip():
                    warnings.append(f"{record_id}: رابطه بیرونی {relation.get('term')} توضیح کافی ندارد.")

        if len(parents) != 1:
            errors.append(f"{record_id}: باید دقیقاً یک رابطه parent داشته باشد؛ تعداد فعلی {len(parents)} است.")

    for (term, context), count in context_pairs.items():
        if count > 1:
            errors.append(f"ترکیب term_en/context تکراری است: {term!r} / {context!r}")

    page_coverage = {}
    for source_id, source in source_by_id.items():
        cited = citations.get(source_id, set())
        try:
            listed = manifest_pages(source)
        except Exception as exc:
            errors.append(f"{source_id}: pages_cited نامعتبر است: {exc}")
            listed = set()
        missing = sorted(cited - listed)
        extra = sorted(listed - cited)
        page_coverage[source_id] = {
            "cited_pages": len(cited),
            "manifest_pages": len(listed),
            "missing_from_manifest": [f"{kind}:{number}" for kind, number in missing],
            "manifest_only_pages": [f"{kind}:{number}" for kind, number in extra],
        }
        if missing:
            errors.append(f"{source_id}: صفحات ارجاع‌شده در pages_cited نیستند: {missing[:20]}")
        if extra:
            warnings.append(
                f"{source_id}: {len(extra)} صفحه در pages_cited ثبت شده ولی در رکوردها استفاده نشده؛ "
                "صفحات مقدماتی ii/iii می‌توانند اطلاعات کتاب‌شناختی باشند."
            )

    if translations.get("draft_unreviewed", 0) == len(records):
        warnings.append("تمام ترجمه‌های فارسی هنوز draft_unreviewed هستند و باید بازبینی انسانی شوند.")
    if device_software.get("diagnostic_software_version") is None:
        warnings.append("نسخه نرم‌افزار نصب‌شده روی دستگاه از راهنمای US V2.1 قابل تعیین نیست.")
    if technical_status.get("verified", 0) == len(records):
        warnings.append(
            "وضعیت technical=verified همان وضعیت ثبت‌شده توسط پژوهشگر است؛ "
            "این ابزار تأیید مستقل فنی یا تطبیق با دستگاه فیزیکی انجام نمی‌دهد."
        )

    summary = {
        "records": len(records),
        "unique_ids": len(by_id),
        "categories": dict(categories),
        "relations": relation_total,
        "relation_types": dict(relation_types),
        "internal_relations": internal_relations,
        "null_target_relations": null_relations,
        "translation_draft_unreviewed": translations.get("draft_unreviewed", 0),
        "technical_verified_claims": technical_status.get("verified", 0),
        "workshop_examples_complete": example_status.get("complete", 0),
        "errors": len(errors),
        "warnings": len(warnings),
    }
    report = {
        "status": "FAIL" if errors else ("PASS_WITH_WARNINGS" if warnings else "PASS"),
        "run_date_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "files": {key: str(value.relative_to(ROOT)) for key, value in paths.items()},
        "schema_engine": "built-in Draft-07 subset (supports type unions)",
        "summary": summary,
        "page_coverage": page_coverage,
        "errors": errors,
        "warnings": warnings,
        "limitations": [
            "اعتبارسنجی ساختاری و رابطه‌ای، تأیید مستقل محتوای فنی یا ترجمه نیست.",
            "برچسب verified در داده، وضعیت ثبت‌شده توسط پژوهشگر است و به‌معنای مشاهده مستقل دستگاه نیست.",
            "ترجمه‌ها تا بازبینی انسانی باید draft_unreviewed بمانند.",
            "سناریوها تألیفی‌اند و گزارش مورد واقعی تعمیرگاه محسوب نمی‌شوند.",
        ],
    }

    json_path = ROOT / args.json_report
    md_path = ROOT / args.md_report
    json_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# گزارش اعتبارسنجی پایلوت Autel v0.3 — AUTONEX",
        "",
        f"**وضعیت: {report['status']}**",
        "",
        f"- تاریخ اجرا (UTC): {report['run_date_utc']}",
        f"- رکوردها: {summary['records']} | شناسه یکتا: {summary['unique_ids']}",
        f"- روابط: {summary['relations']} (داخلی: {summary['internal_relations']}، بدون مقصد داخلی: {summary['null_target_relations']})",
        f"- مثال‌های تألیفی کامل: {summary['workshop_examples_complete']}",
        f"- ترجمه‌های نیازمند بازبینی: {summary['translation_draft_unreviewed']}",
        f"- خطاها: {summary['errors']} | هشدارها: {summary['warnings']}",
        "",
        "## خطاها",
        "",
    ]
    lines.extend([f"- {item}" for item in errors] or ["- خطای ساختاری/رابطه‌ای پیدا نشد."])
    lines += ["", "## هشدارها", ""]
    lines.extend([f"- {item}" for item in warnings] or ["- هشداری ثبت نشد."])
    lines += ["", "## پوشش صفحات منبع", ""]
    for source_id, coverage in page_coverage.items():
        lines.append(
            f"- {source_id}: {coverage['cited_pages']} صفحه ارجاع‌شده؛ "
            f"{coverage['manifest_pages']} صفحه در manifest؛ "
            f"صفحات جاافتاده: {len(coverage['missing_from_manifest'])}؛ "
            f"صفحات اضافی manifest: {len(coverage['manifest_only_pages'])}"
        )
    lines += [
        "",
        "## محدودیت اعتبارسنجی",
        "",
        *[f"- {item}" for item in report["limitations"]],
        "",
    ]
    md_path.write_text("\n".join(lines), encoding="utf-8")

    print(json.dumps({"status": report["status"], "summary": summary, "reports": [str(json_path), str(md_path)]}, ensure_ascii=False))
    return 1 if errors or (args.strict_warnings and warnings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
