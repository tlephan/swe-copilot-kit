---
name: swe.integration-test-generation
description: Design and implement integration tests across real application boundaries such as HTTP, databases, queues, files, or service modules. Use when behavior depends on components working together rather than one isolated unit.
---

# Integration Test Generation

Create reliable tests that prove a user-relevant flow works across the components it actually depends on.

## Approach

1. Map the flow from its entry point through the relevant boundary and identify the smallest meaningful end-to-end slice.
2. Read the repository's integration-test setup, environment configuration, cleanup patterns, and existing tests before selecting tools or fixtures.
3. Use real components where their interaction is the purpose of the test. Replace only unavailable, costly, unsafe, or unrelated external systems with a faithful test double.
4. Establish known data before each test and clean up after it. Make resource names unique when tests can run concurrently.
5. Test the successful flow plus realistic failure responses, authorization, validation, persistence, serialization, and retry behavior when the changed path owns them.
6. Run the narrowest relevant integration suite and report any environment prerequisite that prevents execution.

## Reliability rules

- Do not depend on test order, production data, wall-clock timing, or unrestricted network access.
- Assert externally visible behavior: status codes, messages, stored records, emitted events, or rendered output.
- Keep fixtures minimal and use the project's approved configuration for credentials and service endpoints.
- Do not silently skip a test because infrastructure is unavailable; report the blocker clearly.

## Deliverable

Summarize the flow exercised, components covered, setup or cleanup added, and the command used to validate it.
