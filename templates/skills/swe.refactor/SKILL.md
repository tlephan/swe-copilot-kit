---
name: swe.refactor
description: Improve code structure, clarity, or maintainability while preserving externally observable behavior. Use for requested refactors without new product behavior.
---

# Refactor

Improve the internal structure of code while preserving its observable behavior. This skill is not for a requested feature, behavior change, or broad cleanup campaign; surface those separately rather than hiding them inside a refactor.

## Before changing code

1. Define the preservation boundary by reading the implementation, callers, public interfaces, configuration, and existing tests. Record behavior that is easy to accidentally change: errors, ordering, side effects, timing, caching, resource ownership, and performance-sensitive paths.
2. Identify the specific maintainability problem and the smallest transformation that addresses it. Prefer existing project patterns over introducing a new abstraction or framework.
3. Add or strengthen characterization tests when current coverage does not protect the behavior being moved. A test should describe a stable contract, not freeze incidental private structure.

## Transformation rules

- Make small, reviewable steps. Keep each step buildable and easily reversible when the scope or risk warrants it.
- Preserve public types, signatures, serialization, error behavior, logging and metrics contracts, and configuration semantics unless the user explicitly authorizes a change.
- Retain performance and concurrency properties on hot or shared paths. Measure or test when the refactor changes allocation, batching, locking, I/O, or execution order.
- Do not mix unrelated formatting, renaming, dependency upgrades, or feature work into a risky structural change. Separate genuinely independent cleanup.
- Remove dead code only after confirming it is unreachable across supported entry points, generated code, reflection, configuration, and extension mechanisms.

## Validation and deliverable

Run focused tests plus relevant type, lint, build, or performance checks. Compare meaningful pre- and post-change behavior when possible. Report the maintainability problem addressed, preserved contracts, tests and checks run, and remaining risk or intentionally deferred cleanup.
