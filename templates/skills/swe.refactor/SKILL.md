---
name: swe.refactor
description: Improve code structure, clarity, or maintainability while preserving externally observable behavior. Use for requested refactors without new product behavior.
---

# Refactor

Establish the behavior to preserve by reading callers and existing tests. Prefer small, reversible transformations that match local conventions. Keep public interfaces, error behavior, and performance characteristics stable unless explicitly changing them. Do not combine unrelated cleanup with a risky refactor. Update or add characterization tests when coverage does not protect the changed area, then run focused validation and summarize preserved contracts and remaining risk.
