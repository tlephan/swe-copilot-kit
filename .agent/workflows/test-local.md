---
description: Test the CLI locally before publishing
---

# Local Testing Workflow

// turbo-all

## Steps

1. Build the package
```bash
cd npm-swe-copilot-kit && npm run build
```

2. Test help commands
```bash
node dist/cli.js --help
node dist/cli.js init --help
node dist/cli.js list
```

3. Create a test directory and run init
```bash
mkdir -p ../test-local
cd ../test-local
node ../npm-swe-copilot-kit/dist/cli.js init
```

4. Verify files were created
```bash
ls -la .github/prompts/
ls -la .github/agents/
```

5. Clean up test directory
```bash
cd ..
rm -rf test-local
```
