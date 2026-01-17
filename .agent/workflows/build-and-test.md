---
description: Build and test the npm-swe-copilot-kit package
---

# Build and Test Workflow

## Steps

1. Navigate to the package directory
```bash
cd npm-swe-copilot-kit
```

2. Install dependencies
```bash
npm install
```

3. Build the TypeScript code
```bash
npm run build
```

4. Run the tests
```bash
npm test
```

5. Verify the CLI works
```bash
node dist/cli.js --help
node dist/cli.js list
```
