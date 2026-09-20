---
name: swe.dependency-upgrade
description: Upgrade a project dependency safely, assess compatibility changes, and validate the resulting lockfile and application behavior. Use for planned dependency or runtime upgrades.
---

# Dependency Upgrade

Upgrade dependencies deliberately, preserving reproducibility and making compatibility changes only when supported by the new release's documented behavior or a failing check.

## Assessment

1. Identify the package or runtime, installed and declared versions, requested target, package manager, lockfile, and direct consumers. Check whether it is runtime, build, test, or tooling-only before choosing validation scope.
2. Inspect release notes, migration guidance, peer-dependency requirements, supported runtimes, and security advisories when the version range crosses a major release or the upgrade is security-driven. Prefer authoritative upstream sources for compatibility claims.
3. Determine whether the target is compatible with the project's runtime, framework, package manager, license policy, and other pinned packages. Raise an explicit decision when an upgrade needs a breaking migration or changes support commitments.

## Upgrade

- Use the project's package manager so the manifest and authoritative lockfile stay consistent. Do not hand-edit lockfile resolution data unless the ecosystem requires it and the result is validated.
- Keep the requested dependency change focused. Do not fold unrelated version churn into the same update unless it is necessary to resolve a declared compatibility constraint.
- Address actual compilation, test, or runtime breakages using documented migration paths. Avoid broad compatibility shims that hide a version conflict or change unrelated behavior.
- Inspect the resulting manifest and lockfile for unexpected package, source, integrity, or license changes. Preserve overrides, resolutions, and workspace conventions unless deliberately changing them.

## Validation and deliverable

Run the narrowest relevant install-integrity, type-check, build, test, and runtime checks. For production dependencies, exercise a representative path that loads or uses the dependency. Report the old and new versions, transitive or peer changes of note, migration work, checks run, known advisories, and any deferred follow-up. Do not claim that an advisory is resolved unless the installed resolution demonstrates it.
