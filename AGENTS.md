# AI Agent Guidelines for Gmail Processor

This document provides essential information for AI agents to understand the project's structure, architecture, and conventions, ensuring changes are consistent with the established patterns.

## Project Overview

Gmail Processor is a TypeScript-based library designed to automate the processing of Gmail messages and attachments using Google Apps Script (GAS). It uses a rule-based configuration (JSON/YAML) to perform actions like storing attachments in Google Drive or logging information in spreadsheets.

## Architecture & Core Concepts

### 1. Context-Aware Hierarchy

The system uses a hierarchical context model to pass information through the processing layers:

- **EnvContext:** Global environment info (GAS services, run mode).
- **ProcessingContext:** Configuration, adapters, and action registry.
- **ThreadContext:** Info about the current GMail thread.
- **MessageContext:** Info about the current GMail message.
- **AttachmentContext:** Info about the current GMail attachment.

_File Reference:_ [Context.ts](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/src/lib/Context.ts)

### 2. Processing Flow

Processing is handled by specialized processor classes that follow the hierarchy:

1. `GmailProcessor` (Top-level)
2. `ThreadProcessor`
3. `MessageProcessor`
4. `AttachmentProcessor`

Base logic for matching and action execution is in the [BaseProcessor](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/src/lib/processors/BaseProcessor.ts) abstract class.

### 3. Action Registry & Providers

Actions (e.g., `attachment.store`, `thread.addLabel`) are organized into providers and registered in the `ActionRegistry`.

- **GlobalActions:** General actions.
- **ThreadActions / MessageActions / AttachmentActions:** Context-specific actions.

_Pattern:_ Actions are typically static methods in classes implementing `ActionProvider`.

### 4. Adapter Layer

To maintain testability and GAS compatibility, external service interactions are wrapped in adapters:

- `GmailAdapter`, `GDriveAdapter`, `SpreadsheetAdapter`, `LogAdapter`.

## Project Structure

- `src/lib/`: Core library logic.
  - `actions/`: Action provider implementations.
  - `adapter/`: GAS service abstractions.
  - `config/`: Configuration models and validation.
  - `processors/`: Hierarchical logic for processing GMail entities.
- `src/examples/`: Reference configurations and E2E tests.
- `scripts/`: Build and maintenance scripts.

## Examples Structure & Generation

The project examples serve multiple purposes and are all generated from a single source of truth: `src/examples/**.ts`. This file defines the example logic, configuration, end-to-end (E2E) tests, and documentation metadata.

When you modify or create an example in `src/examples/**.ts`, the build process (`npm run update:examples`) automatically generates the following artifacts:

1. **End-to-end tests:** Generated into `src/gas/examples/**-test.js` (used for running tests in Google Apps Script).
2. **Working example code:** The standalone code that has been E2E-tested, generated into `src/gas/examples/**.js`.
3. **Example JSON config files:** Configuration representations, generated into `src/examples/**.json`.
4. **Example unit tests:** Local tests generated into `src/examples/**.spec.ts`.
5. **Documentation:** Markdown documentation pages generated into `docs/docs/examples/**.mdx`.

**Agent Instruction:** Ensure that any new or updated examples are modified **only** in the source of truth (`src/examples/**.ts`). Do not manually edit the generated files listed above, as they will be overwritten during the build process.

## Coding Conventions

### Language & Runtime

- **TypeScript:** Targeting **ES2019** for Google Apps Script V8 engine compatibility.
- **Types:** Always use `@types/google-apps-script` for GAS services.

### Configuration Management

- Use `class-transformer` decorators (`@Expose`, `@Type`) for configuration classes in `src/lib/config/`.
- Maintain the JSON schema (`config-schema-v2.json`) whenever config classes change.

### Run-Mode Aware Actions

Actions must respect the `RunMode` (Dry-run, Safe, Dangerous) using decorators:

- `@readingAction()`: Safe for all modes.
- `@writingAction()`: Blocked in `DRY_RUN`.
- `@destructiveAction()`: Only allowed in `DANGEROUS` mode.

_File Reference:_ [Decorators.ts](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/src/lib/utils/Decorators.ts)

## Commit Messages

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | When to use                                            |
| ---------- | ------------------------------------------------------ |
| `feat`     | A new feature                                          |
| `fix`      | A bug fix                                              |
| `docs`     | Documentation-only changes                             |
| `style`    | Formatting, missing semicolons, etc. (no logic change) |
| `refactor` | Code change that is neither a fix nor a feature        |
| `perf`     | A performance improvement                              |
| `test`     | Adding or updating tests                               |
| `chore`    | Build process, dependency updates, tooling             |
| `ci`       | CI/CD configuration changes                            |

### Scope (optional)

Use the affected component as the scope, e.g.:

- `feat(attachment)`, `fix(processor)`, `docs(config)`, `chore(deps)`

### Examples

```
feat(attachment): add support for inline image extraction
fix(processor): handle empty thread list gracefully
docs: add conventional commits section to AGENTS.md
chore(deps): update class-transformer to 0.6.0
```

### Breaking Changes

Append `!` after type/scope and add a `BREAKING CHANGE:` footer:

```
feat(config)!: rename markProcessedMode to markProcessedMethod

BREAKING CHANGE: The config key `markProcessedMode` has been renamed to `markProcessedMethod`.
```

### Attribution and Community Credits

Every contribution from the community, no matter how small (e.g., an idea, a suggestion, documentation, an issue report, or discussion), must be properly credited. This applies even if the originally suggested implementation is modified or completely re-implemented from scratch by the repository maintainers or an AI agent. Community involvement is highly valued and must be reflected in the commit history and release notes.

**How to credit contributors:**

- Add a `Co-authored-by: Name <email>` trailer to the end of your commit message. If you only know the contributor's GitHub username, you can use `Co-authored-by: Username <Username@users.noreply.github.com>`.
- If the contribution originated from an issue or discussion, reference it in the commit message body (e.g., `closes #123` or `resolves #123`). This ensures the release process (like release-please) picks it up.
- Use the all-contributors CLI to add them to the README.md contributors list. You can run npx all-contributors add <username> <contribution> (e.g. bug, ideas, code, doc) to track it.

### AI-Assisted Development Transparency

In alignment with the 2026 EU AI Act and security best practices, we disclose AI involvement to ensure accountability and auditability. The human remains responsible for all code changes.

**How to declare AI assistance:**

- Add the `AI-Assisted: true` trailer to the end of your commit message. This trailer is **required** if AI was used for logic or generation.
- (Optional) Add the `AI-Tool: <tool-name>` trailer (e.g., `Claude-Code`, `Copilot`, `Aider`).
- (Optional) Add the `AI-Model: <model-version>` trailer (e.g., `claude-3-5-sonnet-20241022`).
- Alternatively or additionally, include a brief mention in the PR description.
- This ensures it's clear where AI tools were used for tedious, repetitive work or scaffolding, while acknowledging that the human developer remains responsible for reviewing, testing, and merging the code.

## Development Workflow

1. **Testing:**
   - Unit tests: `npm run test` (uses Jest).
   - E2E tests: Located in `src/examples/`, run via GAS.
   - Mocking: Use `MockFactory` for GAS services in tests.
2. **Pre-commit:** Always run `npm run pre-commit` before pushing. This runs:
   - Linting (ESLint/Prettier).
   - Build.
   - Tests.
   - Documentation updates.

## Tooling

- **Clasp:** For syncing code with Google Apps Script.
- **Rollup:** For bundling the library.
- **Prettier:** Code formatting (enforced via linting).
