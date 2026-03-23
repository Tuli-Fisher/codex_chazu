# AGENTS.md

## Purpose
Local working preferences for this workspace.

## Engineering Preferences
- Use ES6 modules only (`import` / `export`), no CommonJS.
- Prefer modern TypeScript/React tooling and patterns.

## Git
- Use git for functionality changes.
- When commits are requested, use one commit per feature/change.
- Commit messages should be clear and concise.
- Use conventional branch names like `codex/<short-feature-name>` when a branch is needed.

## Testing
- Run tests and lint on every change if a test suite exists.
- Do not proceed if lint fails.
- Always run the TypeScript compiler to verify builds when TS is present.
- If tests are missing or too slow, call it out and ask before skipping.

## Specs
- Keep specs updated as work is completed, including how items were implemented.

## Development Phases
- Default to mock data during early UI build before DB wiring, per tech spec.

## Skills
- If a task matches a listed skill or the user names a skill, open its `SKILL.md` and follow it.
