# Operational Hardening Addendum — AI-1

Task: AI1-PROTOCOL-V2-OPS-HARDENING-001
Status: proposed; owner approval required. No production SQL, migrations, content, verification states, or release states changed.

## Asset manifest findings A-01 to A-07
The v1.0 draft remains preserved. A stricter v1.1 candidate is supplied in versioned files alongside it. The v1.1 validator rejects unknown keys, wrong types/enums, duplicate IDs/references, invalid dates/URLs, and incomplete eligible assets. It blocks eligible assets while manifest status is proposed; requires explicit boolean values for all four permissions; requires creator, rights holder, license name, permission evidence, attribution, reviewers and review dates; requires a modification description when modified; and supports optional local SHA-256 verification with --verify-files. Entity references are syntax-checked; actual catalog existence remains a separate read-only repository QA check.

The validator cannot prove that rights evidence is authentic or that an image depicts the correct component. Those require human review.

## Release authority
Technical identity review, rights/provenance review, and final release authorization are three separate gates. An asset marked eligible is only technically ready; publication also requires active manifest status and explicit owner/release-maintainer authorization recorded in a release register.

## Quiz dependencies
Every quiz requires its own review packet, including quizzes whose lesson_id is null. Every question independently requires review of prompt, options, answer key, explanation, difficulty and media. Parent lesson review never automatically verifies child question claims.

## Append-only review packets
Git convention alone does not guarantee immutability. Before operational use, configure branch protection/rulesets, prohibit force-push/deletion, require PR review, and run a review-packet validator in CI. Each packet must record exact reviewed path, blob SHA/content digest and source commit. Corrections create a new packet with supersedes_review_id.

A proposed review-packet JSON Schema is supplied; a validator and CI workflow remain future work.

## Schema findings F-09/F-10
Read-only SQL diagnostics are supplied for orphan/mismatched entity_sources links, missing evidence links across all eight allowed entities, unverified/stale sources, missing citation locators, and vehicle-specific direct-source gaps. The 365-day freshness interval is a test placeholder, not an approved policy. Queries are SELECT-only.

## Owner decisions still required
Approve rights policy and release authority; select source freshness window; decide whether to normalize polymorphic entity_sources in a future migration or retain integrity QA; approve branch protection/CI; approve protocol v2 and this addendum. No migration is implied.
