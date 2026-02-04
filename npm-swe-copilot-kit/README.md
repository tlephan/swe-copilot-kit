# SWE Copilot Kit

A CLI toolkit to initialize GitHub Copilot prompts and agents in your project to support Software Engineering tasks.

[![npm version](https://badge.fury.io/js/swe-copilot-kit.svg)](https://www.npmjs.com/package/swe-copilot-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

### Using npx (no installation required)

```bash
npx swe-copilot-kit init
```

### Global Installation

```bash
npm install -g swe-copilot-kit
swe-copilot-kit init
```

Or use the shorter alias:

```bash
sck init
```

## What It Does

This CLI toolkit unpacks pre-configured GitHub Copilot prompts and agents into your project's `.github` directory:

```
your-project/
├── .github/
│   ├── prompts/
│   │   └── swe.*.prompt.md
│   ├── agents/
│   │   └── swe.*.agent.md
│   └── skills/
│       └── swe.*
│           └── SKILL.md
```

## Commands

### `init`

Initialize GitHub Copilot configuration in your project.

```bash
swe-copilot-kit init [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `-f, --force` | Overwrite existing files |
| `-p, --prompts` | Initialize only prompts |
| `-a, --agents` | Initialize only agents |
| `--all` | Initialize both prompts and agents (default) |

**Examples:**

```bash
# Initialize everything
swe-copilot-kit init

# Only initialize prompts
swe-copilot-kit init --prompts

# Only initialize agents
swe-copilot-kit init --agents

# Force overwrite existing files
swe-copilot-kit init --force
```

### `list`

List available templates.

```bash
swe-copilot-kit list
```

## Included Templates

The package includes a variety of prompts and agents designed to assist with software engineering tasks, such as code committing, code reviewing, and coding assistance.

## Programmatic Usage

You can also use this package programmatically:

```typescript
import { copyPrompts, copyAgents, initAll, listTemplates } from 'swe-copilot-kit';

// Initialize prompts only
await copyPrompts({ force: true });

// Initialize agents only
await copyAgents({ targetDir: '/path/to/project' });

// Initialize everything
const result = await initAll({ force: true });

// List available templates
const templates = await listTemplates();
console.log(templates.prompts);
console.log(templates.agents);
```

## Using with GitHub Copilot

After initialization, you can use the prompts and agents with GitHub Copilot:

1. **Prompts**: Reference prompts in Copilot Chat using `/prompt <prompt-name>` to get specific assistance.
2. **Agents**: Agents provide extended capabilities and workflows for Copilot

## Customization

After initialization, you can customize the prompts and agents to match your project's needs:

1. Edit the `.github/prompts/swe.*.prompt.md` files to adjust prompt behavior
2. Modify `.github/agents/swe.*.agent.md` files to change agent capabilities

## Development

### Building from source

```bash
git clone https://github.com/tlephan/swe-copilot-kit.git
cd swe-copilot-kit/npm-swe-copilot-kit
npm install
npm run build
```

### Running locally

```bash
npm run dev -- init
```

## License

MIT License - see [LICENSE](LICENSE) for details.
