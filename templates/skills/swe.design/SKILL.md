---
name: swe.design
description: Turn a software change request into an implementable technical design with scope, interfaces, data flow, risks, and validation. Use before non-trivial implementation when the solution shape or tradeoffs need to be made explicit.
---

# Technical Design

Produce a design that is concrete enough to implement and review without prematurely writing the solution.

## Approach

1. Establish the requested outcome, non-goals, constraints, and success criteria. Inspect the relevant code paths and existing conventions instead of assuming the architecture.
2. Describe the current state only as needed to explain the change. Identify affected modules, interfaces, data stores, external systems, and users.
3. Propose the smallest viable design. Specify responsibilities, data flow, API or schema changes, error handling, authorization, compatibility, and rollout or migration needs where applicable.
4. Surface meaningful alternatives only when they create a real tradeoff. State the decision and its rationale.
5. Break implementation into ordered, independently reviewable steps. Include tests and operational verification in the plan.
6. Define measurable acceptance criteria and the evidence that will demonstrate them. For changes with a rollout risk, include observability, rollback, and ownership rather than treating deployment as an afterthought.

## Design quality

- Preserve existing public contracts unless a breaking change is intentional and has a migration path.
- Prefer established project patterns over introducing abstractions without a demonstrated need.
- Call out unresolved assumptions and questions rather than disguising them as facts.
- Keep the design proportionate to the request; small changes need a short, focused plan.
- Model failure paths and data lifecycle explicitly when the change persists, transmits, or authorizes sensitive or user-owned data.
- Identify compatibility boundaries: published APIs, stored data, configuration, clients, automation, and supported environments.

## Deliverable

Return a concise design with: goal and non-goals, current context, affected areas, proposed approach, interfaces or data changes, failure and compatibility handling, alternatives and decision, risks, validation and rollout plan, acceptance criteria, and implementation steps.
