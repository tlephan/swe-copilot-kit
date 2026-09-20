---
name: swe.unit-test-generation
description: Design and implement focused unit tests for a function, class, module, or changed behavior. Use when asked to add unit tests or improve unit-level coverage; do not use for tests that require real external services.
---

# Unit Test Generation

Add small, deterministic tests that verify the behavior of the unit under test through its public interface.

## Approach

1. Inspect the implementation, its callers, nearby tests, and the repository's test conventions before writing tests.
2. Identify the observable contract: normal results, boundaries, invalid input, errors, and meaningful state transitions. Do not test private implementation details unless the project convention requires it.
3. Isolate external effects with the smallest appropriate fake, stub, mock, or in-memory dependency. Preserve real behavior when a dependency is already deterministic and inexpensive.
4. Write independent tests with descriptive names and clear arrange-act-assert structure. Each test should demonstrate one behavior or one closely related rule.
5. Run the focused test command and fix failures caused by the test or implementation. Do not alter production behavior solely to satisfy an incorrect test.

## Quality checks

- Include success, boundary, and failure cases that materially differ in behavior.
- Assert outputs, visible side effects, errors, and dependency interactions only when each is part of the contract.
- Avoid timing-dependent assertions, order coupling, shared mutable fixtures, and mocks that reproduce the implementation.
- Reuse the project's existing test framework, helpers, naming, and fixture patterns.

## Deliverable

Summarize the behavior covered, the test files changed, and any contract that could not be tested without an integration environment.
