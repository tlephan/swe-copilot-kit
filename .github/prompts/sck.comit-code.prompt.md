---
name: sck.commit-code
description: Commit code changes with a clear and concise message summarizing the modifications made.
---

Commit the recent code changes with a clear and concise commit message that summarizes the modifications made. Ensure the message follows best practices, such as using the imperative mood, being specific about the changes, and referencing any related issues or tickets if applicable.
Example commit message format:

```
[type]: [short description]
```

Where `[type]` can be one of the following: feat, fix, docs, style, refactor, test, chore.

Git command:

```bash
git add -A && git commit -m "<message>"
```

IMPORTANT: Get confirmation before executing the git command.
