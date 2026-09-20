---
name: swe.implement
description: Implement an approved software change safely and incrementally, including focused tests and validation. Use when the task is ready for code changes rather than discovery or high-level design.
---

# Implementation

Implement the requested behavior with the smallest defensible change that fits the repository's existing architecture and conventions.

## Approach

1. Reconfirm the requested outcome, relevant constraints, and affected files. Read local instructions, existing implementations, and tests before editing.
2. Make a focused change that preserves unrelated behavior and public contracts. Avoid opportunistic refactors unless they are necessary for correctness.
3. Handle expected errors, validation, authorization, resource cleanup, and compatibility at the layer that owns them.
4. Add or update the narrowest appropriate tests for the changed contract. Prefer unit tests; add integration coverage when behavior crosses a real boundary.
5. Run formatting, type checks, tests, and build commands relevant to the change. Investigate failures instead of masking them.

## Guardrails

- Do not overwrite unrelated user changes.
- Do not add dependencies, modify infrastructure, or perform external actions unless the task authorizes them.
- Keep generated files and migrations consistent with their source definitions.
- Report any assumption, blocked validation, or follow-up work that remains.

## Deliverable

Summarize the implementation, files changed, validation performed, and any remaining risk or limitation.
