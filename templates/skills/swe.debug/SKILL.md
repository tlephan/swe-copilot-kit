---
name: swe.debug
description: Investigate and fix a reproducible defect, failing test, error, or unexpected behavior. Use for diagnosis and targeted remediation, not broad refactoring.
---

# Debug

Resolve the reported behavior by establishing a causal explanation and making the smallest safe correction. Do not treat an error message, failing assertion, or intermittent symptom as the root cause without evidence.

## Investigation

1. Capture the report precisely: expected and actual behavior, inputs, environment, version or revision, frequency, and the exact command, error, or trace. Read local instructions and recent relevant changes before changing code.
2. Reproduce the failure with the smallest reliable case. When it is intermittent, record the conditions that correlate with it rather than repeatedly guessing.
3. Trace the affected path across the entry point, state changes, dependencies, configuration, and error handling. Compare a failing path with a known-good path when that narrows the difference.
4. Form explicit, falsifiable hypotheses. Use focused logging, a debugger, a temporary assertion, a small experiment, or a targeted test to rule hypotheses in or out. Remove temporary diagnostics before handing off unless they are intentionally useful observability.
5. Identify the root cause and its blast radius: which inputs, callers, persisted data, versions, or concurrent operations are affected. Do not broaden the fix unless the evidence shows a shared cause.

## Remediation

- Fix the cause at the layer that owns the invariant. Avoid swallowing errors, adding unbounded retries, or special-casing one input when the underlying contract remains broken.
- Preserve public behavior outside the defect unless a contract change is explicitly requested. Consider validation, cleanup, idempotency, authorization, migration state, and backward compatibility when they are on the affected path.
- Add a regression test at the lowest level that would have caught the defect. Use an integration test instead when the bug only exists across a real boundary.
- Run the reproduction case and proportionate focused validation after the fix. Separate a product failure from a test, environment, or infrastructure failure with evidence.

## Deliverable

Report the reproduction, root cause, affected scope, fix, regression coverage, validation performed, and any remaining uncertainty or environment blocker.
