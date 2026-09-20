# SWE Copilot Kit

[![npm version](https://badge.fury.io/js/swe-copilot-kit.svg)](https://badge.fury.io/js/swe-copilot-kit)
[![npm-ci](https://github.com/tlephan/swe-copilot-kit/actions/workflows/npm-ci.yml/badge.svg)](https://github.com/tlephan/swe-copilot-kit/actions/workflows/npm-ci.yml)
[![npm-publish](https://github.com/tlephan/swe-copilot-kit/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/tlephan/swe-copilot-kit/actions/workflows/npm-publish.yml)

A CLI toolkit that installs curated software-engineering prompts, agents, and skills into the native project layout of your AI coding tool.

| Tool | Supported | Prompt workflow | Agents | Skills |
|------|-----------|-----------------|--------|--------|
| GitHub Copilot | Yes (default) | `.github/prompts/` | `.github/agents/` | `.github/skills/` |
| Claude Code | Yes | Skills | `.claude/agents/` | `.claude/skills/` |
| Antigravity | Yes | Skills | Skill-based profile | `.agents/skills/` |
| Codex | Yes | Skills | `.codex/agents/` | `.agents/skills/` |
| Kiro | Yes | Skills | `.kiro/agents/` | `.kiro/skills/` |

For tools without vendor-specific prompt files, SWE prompt templates are converted to portable Agent Skills. This preserves their instructions and makes them available as on-demand slash commands where supported.

## Quick Start

```bash
npx swe-copilot-kit init
npx swe-copilot-kit init --platform claude-code
```

Or install globally:

```bash
npm install -g swe-copilot-kit
sck init --platform codex
```

## Commands

### `init`

Initialize the templates for one tool. GitHub Copilot is the default.

```bash
swe-copilot-kit init [options]
```

| Option | Description |
|--------|-------------|
| `-f, --force` | Overwrite generated template files in the target layout |
| `--gitignore` | Add generated template paths to `.gitignore` instead of committing them |
| `-p, --platform <name>` | `github-copilot`, `claude-code`, `antigravity`, `codex`, or `kiro` |
| `--claude-code` | Alias for `--platform claude-code` |
| `--antigravity` | Alias for `--platform antigravity` |
| `--codex` | Alias for `--platform codex` |
| `--kiro` | Alias for `--platform kiro` |

Examples:

```bash
# GitHub Copilot
sck init

# Claude Code
sck init --claude-code

# Antigravity
sck init --platform antigravity

# Codex
sck init --codex

# Kiro, replacing existing generated templates
sck init --kiro --force
```

### `list`

List the bundled source templates.

```bash
sck list
```

### `validate`

Validate bundled frontmatter and cross-platform portable skill names before publishing or extending the kit.

```bash
sck validate
```

## Generated layouts

```text
# Claude Code
.claude/
  agents/swe-coder.md
  skills/swe-code-review/SKILL.md

# Antigravity
.agents/
  skills/swe-code-review/SKILL.md

# Codex
.codex/
  agents/swe-coder.toml
.agents/
  skills/swe-code-review/SKILL.md

# Kiro
.kiro/
  agents/swe-coder.md
  skills/swe-code-review/SKILL.md
```

GitHub Copilot retains its established `.github/prompts`, `.github/agents`, and `.github/skills` layout.

## Included Templates

The kit contains reusable workflows for commits, debugging, refactoring, documentation, dependency upgrades, code review, design, implementation, verification, and test generation.

## Programmatic Usage

```typescript
import { initPlatform, listTemplates } from 'swe-copilot-kit';

const result = await initPlatform('claude-code', {
  targetDir: '/path/to/project',
  force: true,
});

await initPlatform('github-copilot');

const templates = await listTemplates();
console.log(templates.skills);
```

## Customization

Generated files are regular project files. Edit them to match your repository conventions, then commit them if the whole team should share the configuration.

Use `--gitignore` only when the generated configuration is intentionally local to one developer.

## Development

```bash
git clone https://github.com/tlephan/swe-copilot-kit.git
cd swe-copilot-kit
npm install
npm test
npm run build
```
