---
name: swe.code-review
description: Review a pull request, patch, or code change for correctness, security, regressions, maintainability, and missing tests. Use when asked to review code or validate a proposed change.
---

# Code Review

Review changes as an owner of the affected code. Focus on actionable defects introduced by the change, not broad refactoring ideas or pre-existing issues unless the change makes them materially worse.

## Review process

1. Establish the change scope. Read the diff, identify the intended behavior, and inspect the surrounding code, tests, types, configuration, and public interfaces that the diff affects.
2. Trace important execution paths end to end. Check normal behavior, failure behavior, boundaries, concurrency or lifecycle transitions, and compatibility with callers and persisted data.
3. Prioritize findings in this order:
   - Correctness and user-visible regressions
   - Security, privacy, authorization, and secret handling
   - Data loss, corruption, race conditions, reliability, and performance risks
   - API compatibility, error handling, maintainability, and test coverage
4. Validate every finding against the repository. Cite the precise file and line or a small code location, explain the triggering condition, and state the concrete consequence. Do not report speculative concerns without evidence.
5. Check the tests. Confirm that the changed behavior and meaningful failure paths are covered. Recommend a specific missing test only when it would expose a realistic defect or protect a changed contract.
6. Separate defects introduced by this change from pre-existing observations and optional improvements. If a concern depends on an assumption that cannot be checked, state that assumption and lower confidence rather than presenting it as a confirmed finding.

## What to look for

- Incorrect conditions, off-by-one errors, null or empty input handling, stale state, and unhandled errors
- Authentication or authorization bypasses, unsafe input handling, injection, path traversal, insecure deserialization, exposed secrets, and sensitive-data logging
- Incorrect retries, idempotency failures, transaction boundaries, resource leaks, race conditions, and partial updates
- Breaking changes to public APIs, schemas, configuration, command-line behavior, or migration paths
- Expensive operations in hot paths, unbounded reads or retries, N+1 access patterns, and unnecessary memory growth
- Missing, misleading, flaky, or overly narrow tests

## Findings format

Report only findings that warrant action. Put the most serious issue first. For each finding, use this format:

```markdown
### [severity] Short, imperative title

**Location:** `path/to/file.ext:line`

Explain what happens, the condition required to trigger it, and why it matters. Include a concise remediation or test direction when useful.
```

Use these severities:

- `critical`: data exposure/loss, privilege escalation, or widespread outage
- `high`: likely functional failure, security issue, or significant regression
- `medium`: bounded but real defect, reliability issue, or missing protection for changed behavior
- `low`: a minor defect with limited impact

If no actionable findings are present, say so clearly and mention any residual test gap or assumption that could not be verified. Do not invent issues merely to fill a review.
