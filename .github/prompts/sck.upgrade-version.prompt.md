---
name: sck.upgrade-version
description: Upgrade the version number in project files such as package.json, pom.xml, pyproject.toml, or similar.
---

You will update the version number in project files such as package.json, pom.xml, pyproject.toml, or similar. Ensure that all version references are updated consistently across all relevant files in the project.

If no version is found in a file, do not modify it. If multiple version numbers are found in a file, update all of them to the new version.

Make sure to follow the versioning format used in the project (e.g., semantic versioning). After updating, verify that the files are correctly formatted and valid.

If application is using beta or alpha versions, just update beta/alpha minor version while keeping the pre-release tag intact.

E.g., 1.2.3-beta.1 to 1.2.3-beta.2
