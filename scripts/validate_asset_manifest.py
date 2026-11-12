#!/usr/bin/env python3
"""Validate AUTO LINGO asset manifest structure and conservative release gates.

Uses only Python standard library. This does not verify that license claims are
authentic or that an asset depicts the correct component; human review remains
mandatory.
"""
import hashlib
import json
import re
import sys
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

REQUIRED = {
    "asset_id", "entity_refs", "asset_type", "source_url", "provider",
    "creator", "rights_holder", "license_name", "license_url",
    "permission_evidence", "attribution", "accessed_at", "sha256",
    "modification_status", "modifications", "distribution_permissions",
    "technical_identity_status", "technical_reviewer", "technical_reviewed_at",
    "rights_status", "rights_reviewer", "rights_reviewed_at", "release_status"
}
PERMISSIONS = {"educational", "commercial", "redistribution", "derivatives"}
errors = []

def err(where, message):
    errors.append(f"{where}: {message}")

def valid_date(value):
    try:
        date.fromisoformat(value)
        return True
    except (TypeError, ValueError):
        return False

def valid_url(value):
    try:
        parsed = urlparse(value)
        return parsed.scheme in ("http", "https") and bool(parsed.netloc)
    except Exception:
        return False

def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("data/assets/asset_manifest.json")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"ERROR: cannot read valid JSON: {exc}")
        return 2

    if data.get("manifest_name") != "AUTO LINGO asset provenance manifest":
        err("manifest", "unexpected manifest_name")
    if data.get("schema_version") != "1.0.0":
        err("manifest", "schema_version must be 1.0.0")
    if data.get("status") not in ("proposed", "active"):
        err("manifest", "status must be proposed or active")
    if not isinstance(data.get("assets"), list):
        err("manifest", "assets must be an array")
        data["assets"] = []

    seen = set()
    for i, asset in enumerate(data["assets"]):
        where = f"assets[{i}]"
        if not isinstance(asset, dict):
            err(where, "must be an object")
            continue
        missing = REQUIRED - set(asset)
        if missing:
            err(where, "missing fields: " + ", ".join(sorted(missing)))
            continue
        aid = asset["asset_id"]
        if not isinstance(aid, str) or not re.fullmatch(r"ASSET-[A-Z0-9-]+", aid):
            err(where, "invalid asset_id")
        elif aid in seen:
            err(where, f"duplicate asset_id {aid}")
        seen.add(aid)

        if not isinstance(asset["entity_refs"], list) or not asset["entity_refs"]:
            err(where, "entity_refs must be a non-empty array")
        if asset["asset_type"] not in {"image", "audio", "video", "diagram", "document", "other"}:
            err(where, "invalid asset_type")
        if not valid_url(asset["source_url"]):
            err(where, "source_url must be an http(s) URL")
        if not isinstance(asset["provider"], str) or not asset["provider"].strip():
            err(where, "provider is required")
        if not valid_date(asset["accessed_at"]):
            err(where, "accessed_at must be YYYY-MM-DD")
        if not isinstance(asset["sha256"], str) or not re.fullmatch(r"[a-fA-F0-9]{64}", asset["sha256"]):
            err(where, "sha256 must contain 64 hexadecimal characters")
        if asset["modification_status"] not in {"unmodified", "modified", "unknown"}:
            err(where, "invalid modification_status")
        if not isinstance(asset["modifications"], list):
            err(where, "modifications must be an array")

        perms = asset["distribution_permissions"]
        if not isinstance(perms, dict) or set(perms) != PERMISSIONS:
            err(where, "distribution_permissions must contain exactly " + ", ".join(sorted(PERMISSIONS)))
            perms = {}
        elif any(v not in (True, False, None) for v in perms.values()):
            err(where, "permission values must be true, false, or null")

        if asset["technical_identity_status"] not in {"pending", "approved", "rejected"}:
            err(where, "invalid technical_identity_status")
        if asset["rights_status"] not in {"pending", "cleared", "rejected"}:
            err(where, "invalid rights_status")
        if asset["release_status"] not in {"blocked", "eligible", "retired"}:
            err(where, "invalid release_status")

        if asset["technical_reviewed_at"] is not None and not valid_date(asset["technical_reviewed_at"]):
            err(where, "technical_reviewed_at must be null or YYYY-MM-DD")
        if asset["rights_reviewed_at"] is not None and not valid_date(asset["rights_reviewed_at"]):
            err(where, "rights_reviewed_at must be null or YYYY-MM-DD")

        if asset["release_status"] == "eligible":
            required_text = ["license_name", "permission_evidence", "attribution",
                             "rights_reviewer", "technical_reviewer"]
            for key in required_text:
                if not isinstance(asset[key], str) or not asset[key].strip():
                    err(where, f"eligible asset requires non-empty {key}")
            if asset["license_url"] is not None and not valid_url(asset["license_url"]):
                err(where, "license_url must be null or an http(s) URL")
            if asset["rights_status"] != "cleared":
                err(where, "eligible asset requires rights_status=cleared")
            if asset["technical_identity_status"] != "approved":
                err(where, "eligible asset requires technical_identity_status=approved")
            if not valid_date(asset["rights_reviewed_at"]) or not valid_date(asset["technical_reviewed_at"]):
                err(where, "eligible asset requires both review dates")
            if any(perms.get(k) is not True for k in ("educational", "redistribution")):
                err(where, "eligible asset requires explicit educational and redistribution permission")
            if asset["modification_status"] == "unknown":
                err(where, "eligible asset cannot have unknown modification_status")

    if errors:
        print("\n".join("ERROR: " + e for e in errors))
        return 1
    print(f"OK: manifest structure and release gates passed ({len(data['assets'])} assets).")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
