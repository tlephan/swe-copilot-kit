# SWE Copilot Kit - Repository Instructions

## Project Overview

This repository contains tools and configurations to help developers set up GitHub Copilot prompts and agents for Software Engineering (SWE) tasks.

## Repository Structure

```
swe-copilot-kit/
├── npm-swe-copilot-kit/     # NPM package with CLI tool
│   ├── src/                  # TypeScript source code
│   ├── templates/            # Prompt and agent templates
│   └── dist/                 # Compiled JavaScript
├── .github/
│   ├── prompts/              # GitHub Copilot prompts
│   ├── agents/               # GitHub Copilot agents
│   ├── instructions/         # Copilot instructions
│   ├── skills/               # Copilot skills
│   └── workflows/            # GitHub Actions
├── docs/                     # Documentation
└── prompts/                  # Prompt flow scripts
```

## Development Guidelines

### npm-swe-copilot-kit Package

- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **Testing**: Jest with ts-jest
- **Package Manager**: npm

### Code Style

- Use 4-space indentation
- TypeScript strict mode enabled
- ESM-compatible CommonJS output
- Comprehensive error handling with user-friendly messages

### Testing

```bash
cd npm-swe-copilot-kit
npm test                    # Run tests
npm test -- --coverage      # Run with coverage
```

### Building

```bash
npm run build               # Compile TypeScript
npm run dev -- [command]    # Run without building (ts-node)
```

### Local Testing

```bash
node dist/cli.js init       # Test init command
node dist/cli.js list       # Test list command
node dist/cli.js --help     # Show help
```

## Template Files

### Prompts (`.github/prompts/*.prompt.md`)

- Use YAML frontmatter with `mode`, `model`, and `description`
- Keep prompts focused on single tasks
- Reference instruction files when needed

### Agents (`.github/agents/*.agent.md`)

- Define comprehensive agent profiles
- Include capabilities, workflows, and quality standards
- Provide language-specific examples

## CI/CD

- **npm-ci.yml**: Runs tests on PRs and pushes (Node 18, 20, 22)
- **npm-publish.yml**: Publishes to npm on release

## Important Files

- `AGENTS.md`: GitHub Copilot agent instructions (root level)
- `npm-swe-copilot-kit/package.json`: Package configuration
- `npm-swe-copilot-kit/templates/`: Template files to be copied by CLI