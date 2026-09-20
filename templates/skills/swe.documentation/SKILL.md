---
name: swe.documentation
description: Create or update developer-facing documentation that accurately reflects implemented behavior, APIs, setup, or operational workflows. Use when code changes require documentation.
---

# Documentation

Create documentation that a reader can use without reverse-engineering the implementation. Treat the current code, executable commands, and approved behavior as the source of truth; do not document intended or inferred behavior as if it exists.

## Process

1. Identify the audience and their goal: contributor setup, API consumer integration, operator response, maintainer workflow, or end-user task. Match vocabulary and depth to that reader.
2. Inspect the implementation, configuration, public interfaces, existing documentation, and relevant tests. Distinguish stable supported behavior from internal details, experimental features, and environment-specific examples.
3. Update the smallest set of affected documents in their existing structure. Keep terminology, headings, links, code style, and versioning conventions consistent with the repository.
4. Explain prerequisites, inputs, outputs, permissions, defaults, failure behavior, and cleanup where each matters to successful use. State platform assumptions and safety implications rather than hiding them in examples.
5. Include only examples that correspond to a real, supportable workflow. Ensure commands, paths, option names, response shapes, and links match the repository and can be checked.

## Quality bar

- Prefer task-oriented instructions and concrete outcomes over a paraphrase of source code.
- Keep secrets, credentials, personal data, internal hosts, and production-only values out of examples. Use clearly non-sensitive placeholders.
- Preserve API and configuration compatibility information, including deprecated behavior or migrations when a reader must act on them.
- Do not duplicate reference material without a reader benefit; link to the canonical location when it exists.
- When behavior cannot be verified, label the uncertainty or omit the claim rather than presenting it as fact.

## Deliverable

Summarize the audience and documentation changed, the behavior or workflow documented, examples or commands verified, and any remaining documentation gap.
