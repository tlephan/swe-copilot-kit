---
name: swe.summarize-logic
description: Create clear, concise summaries of code logic, functions, classes, and systems.
---

## Task: Summarize Code Logic

Create clear, concise summaries that capture the essential aspects of provided code or systems. Start with a high-level overview, break down complex logic into sections, and maintain flow from general to specific.

## Summarization Framework

### For Functions/Methods

1. **Purpose**: What does this function do?
2. **Parameters**: What inputs does it accept?
3. **Process**: How does it accomplish its task?
4. **Output**: What does it return?
5. **Side Effects**: Any external changes?
6. **Edge Cases**: How does it handle errors?

### For Classes

1. **Responsibility**: Main purpose
2. **Key Properties**: Important attributes
3. **Main Methods**: Core functionality
4. **Relationships**: Interactions with other classes
5. **Usage Pattern**: Typical usage flow

### For Systems/Modules

1. **Architecture**: Structure and components
2. **Data Flow**: How information moves
3. **Key Interactions**: Communication between parts
4. **External Dependencies**: Third-party libraries
5. **Configuration**: Setup requirements

## Output Template

```markdown
## Summary

Brief one-paragraph overview.

## Key Components

- **Component 1**: Role and responsibility
- **Component 2**: Role and responsibility

## Process Flow

1. Step-by-step breakdown
2. Decision points or branching
3. Final output

## Important Details

- Implementation choices
- Performance characteristics
- Error handling
- Dependencies
```

## Style Guidelines

- Use active voice: "The function validates input" ✅
- Be specific: "Converts timestamps to ISO format" ✅
- Include context: "Caches results to improve performance" ✅
- Focus on purpose, not line-by-line description
- Define technical terms when introduced
- Cover error handling and edge cases
