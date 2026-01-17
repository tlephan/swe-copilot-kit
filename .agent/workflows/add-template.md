---
description: Add a new prompt or agent template to the package
---

# Add New Template Workflow

## Adding a New Prompt

1. Create the prompt file in the templates directory
```bash
touch npm-swe-copilot-kit/templates/prompts/your-prompt-name.prompt.md
```

2. Add the prompt content with YAML frontmatter
```markdown
---
mode: agent
model: Claude Sonnet 4 (copilot)
description: Brief description of what this prompt does
---

## Task: Your Task Title

Your detailed prompt instructions here...
```

3. Rebuild the package
```bash
cd npm-swe-copilot-kit
npm run build
```

4. Test that the new prompt is listed
```bash
node dist/cli.js list
```

## Adding a New Agent

1. Create the agent file in the templates directory
```bash
touch npm-swe-copilot-kit/templates/agents/your-agent-name.agent.md
```

2. Add the agent profile content
```markdown
# Your Agent Name

## Agent Identity

**Name**: Your Agent Name
**Version**: 1.0.0
**Purpose**: What this agent does
**Model Preference**: Claude Sonnet 4 (copilot)
**Execution Mode**: agent

## Core Mission

Describe the agent's main purpose...

## Capabilities

### Primary Functions
- Function 1
- Function 2

## Workflow & Process

### Phase 1: ...
...
```

3. Rebuild and test
```bash
cd npm-swe-copilot-kit
npm run build
node dist/cli.js list
```

4. Update README if needed to document the new template
