---
name: swe.dependency-upgrade
description: Upgrade a project dependency safely, assess compatibility changes, and validate the resulting lockfile and application behavior. Use for planned dependency or runtime upgrades.
---

# Dependency Upgrade

Identify the exact dependency, current constraint, target release, and direct consumers before changing files. Review release notes or migration guidance when a major version or behavior change is involved. Update the manifest and lockfile together, then address concrete compatibility failures rather than applying broad workarounds. Run the narrowest relevant build, tests, and runtime checks. Report the versions changed, compatibility work, validation, and any unresolved advisory or follow-up.
