#!/usr/bin/env python3
"""Compatibility entry point for the active Autel v0.3 validator.

The AI-3 upload originally placed a validator in this root path, but that
script assumed a different directory layout and had a broken type-union
fallback. Its original text is archived in the v0.3 data folder.
"""
from pathlib import Path
import runpy
import sys

ROOT = Path(__file__).resolve().parent
VALIDATOR = ROOT / "tools" / "validate_autel_v03.py"

if not VALIDATOR.is_file():
    raise SystemExit("Validator not found: " + str(VALIDATOR))

sys.argv[0] = str(VALIDATOR)
runpy.run_path(str(VALIDATOR), run_name="__main__")
