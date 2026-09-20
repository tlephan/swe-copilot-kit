---
name: swe.verify
description: Verify that a software change satisfies its intended behavior using proportionate checks, tests, builds, and targeted manual evidence. Use after implementation or when asked to validate a patch before review or release.
---

# Change Verification

Gather evidence that the requested change works and has not introduced a meaningful regression.

## Approach

1. Restate the behavior or acceptance criteria being verified and inspect the diff for the actual scope of change.
2. Select proportionate checks: focused unit tests, integration tests, type checking, linting, build, migration validation, or a targeted manual scenario. Follow repository guidance when it defines required commands.
3. Run the narrowest checks first, then broaden validation when the changed surface, failures, or risk warrant it.
4. Interpret failures carefully. Distinguish defects caused by the change from pre-existing failures, environmental blockers, and flaky tests; provide evidence for that distinction.
5. Check user-visible success and important failure behavior, not merely code coverage or a green command exit code.
6. Reinspect the final diff and resulting artifacts for unintended configuration, dependency, generated-file, migration, or documentation changes. Verify the change is releasable only against the acceptance criteria and available evidence.

## Verification report

Report:

- The behavior verified and checks run
- Pass/fail results and relevant evidence
- Checks not run, with the reason and resulting confidence limit
- Any regression, blocker, or follow-up needed before release
- Confidence and the reason for any limitation in that confidence

Do not claim a change is verified when required evidence could not be collected.
