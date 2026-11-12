# AUTO LINGO — Independent Review of Protocol v2 Operational Appendix

- Task ID: AI2-PROTOCOL-V2-OPS-APPENDIX-REVIEW-001
- Reviewed ref: `ai1-protocol-v2-ops-appendix-001`
- Reviewed artifacts: operational appendix, asset manifest, JSON Schema, Python validator
- Decision: **agree_with_changes**
- Scope: static review only; no production or AI-1 files modified.

## Executive result

The appendix gives useful interim controls and correctly avoids pretending that missing database columns or QA coverage already exist. The proposed review-packet convention, dependency-based release rules, and separation of asset rights from technical identity are sound starting points.

However, the current validator does **not** fully enforce the stated release contract. In particular, it can accept an asset as `eligible` while the manifest itself is still `proposed`; some rights/provenance fields can remain null; and several structural rules in the JSON Schema are not enforced by the Python validator. The package should remain proposed until the findings below are addressed.

## Review of N-01 through N-04

| Finding | Decision | Review |
|---|---|---|
| N-01 — table-by-table coverage matrix | agree_with_changes | Matrix accurately identifies the current five-table view and the missing entity/status coverage. It is useful operationally, but must not be mistaken for an automated gate. Clarify how release is blocked in the actual publishing workflow and who signs the manual register. |
| N-02 — quiz/question/example dependencies | agree_with_changes | Rules correctly require child-level review and dependency gates. Add an explicit rule for quizzes with no lesson_id: the quiz still requires its own review packet and every question/dependency must pass. |
| N-03 — append-only review packets | agree_with_changes | The convention is workable as an interim audit trail. Git history alone does not technically guarantee append-only behavior; repository permissions/branch protection and review packet validation are needed. Also record the reviewed file path and blob hash (or equivalent immutable content digest), not only source_commit, to identify the exact reviewed artifact unambiguously. |
| N-04 — asset manifest and validator | agree_with_changes | Canonical proposed paths are clear and the empty manifest is appropriately conservative. The validator has important release-gate gaps listed below; it is not yet safe to treat an `eligible` result as a complete release clearance. |

## New findings

### A-01 — Eligible assets can pass while the manifest is still proposed (P1)

The validator accepts top-level `status = proposed` and independently accepts per-asset `release_status = eligible`. This permits a manifest that is explicitly not active to contain release-eligible assets.

**Recommendation:** when manifest status is not `active`, reject any asset marked `eligible` (or require all assets to remain blocked). Define the activation authority separately.

### A-02 — Eligible gate does not require complete rights-holder/creator provenance (P1)

The schema allows `creator`, `rights_holder`, and `license_url` to be null. The Python eligible check does not require creator or rights holder, and it allows a null license_url. Depending on the license/permission basis, some nulls may be legitimate, but the current policy does not define exceptions.

**Recommendation:** require a documented rights-holder/creator value or a controlled reason such as `unknown` plus a separate permission basis that demonstrably grants use. Require a license URL or a documented non-URL permission instrument/reference. Do not infer rights from an image being publicly accessible.

### A-03 — Distribution permissions are not fully explicit for eligibility (P1)

The validator requires educational and redistribution permissions to be true, but commercial and derivatives may remain null. The appendix says distribution and modification permissions are explicitly recorded. A null is not an explicit grant or denial.

**Recommendation:** require all four permission fields to be boolean (true or false) for eligible assets. If AUTO LINGO only needs educational/non-commercial use, encode that as an explicit policy and still require explicit values for all relevant use cases. Clarify that modification_status=modified requires a non-empty modifications description.

### A-04 — Python validator does not enforce full JSON Schema structure (P1)

The JSON Schema sets `additionalProperties: false` at root and asset levels, but the Python validator does not reject unknown root or asset properties. It also does not consistently type-check all required nullable fields, arrays, enums, and nested values before using them. Since the appendix names the Python script as the validator, users may reasonably rely on it without separately running a JSON Schema validator.

**Recommendation:** either implement equivalent strict checks in the standard-library validator or make a standards-compliant JSON Schema validation step mandatory in CI. Add negative test fixtures for extra keys, wrong types, invalid enums, malformed dates/URLs, duplicate IDs, and incomplete eligible records.

### A-05 — Asset hash is syntax-checked but not verified against the actual asset (P2)

The validator checks that sha256 has 64 hexadecimal characters; it does not compute the digest of a local asset or downloaded file. Thus a valid-looking but incorrect hash passes.

**Recommendation:** add a separate optional asset-file verification mode that computes SHA-256 against a controlled local asset copy. Keep remote retrieval out of the default validator; record the exact file path or immutable asset reference used for hashing.

### A-06 — Entity references are not validated against the project catalog (P2)

`entity_refs` only needs to be a non-empty array of strings. It can contain malformed IDs or references to nonexistent entities.

**Recommendation:** define accepted reference syntax (for example PART-, TERM-, SYS-, DIAG-, LESSON-, VM-, BRAND-) and add a repository-level cross-reference check against the relevant canonical data. Keep unresolved references blocked.

### A-07 — JSON Schema identifier is a placeholder (P2)

The schema `$id` uses `https://example.invalid/...`, which is intentionally non-resolvable and unsuitable as a durable schema identifier.

**Recommendation:** replace it with a stable repository URL or a URN/versioned identifier before adopting the schema.

## Additional operational clarifications

1. A manual release register must identify the accountable release reviewer and the exact content commit; it must be checked by the publishing process, not merely stored.
2. A quiz with `lesson_id = null` must still receive independent quiz-level review.
3. The appendix should distinguish technical asset review, rights review, and final release authorization. The current two review gates do not explicitly identify who performs the final release action.
4. Review-packet JSON should have its own versioned schema and validator; required fields alone are not enough to ensure valid claim outcomes, stable IDs, and valid source locators.
5. Keep `parts_image_manifest.json` as legacy as stated; do not treat its entries as cleared assets.

## Final status

The operational approach is directionally correct, but the manifest validator and append-only controls need the changes above before the appendix can be considered operationally complete. This review is advisory only. No SQL, production content, manifest entry, verification status, or release state was changed.
