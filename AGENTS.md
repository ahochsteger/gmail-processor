# AI Agent Guidelines for Gmail Processor

This document provides essential information for AI agents to understand the project's structure, architecture, and conventions.

> [!CAUTION]
> **Strict Safe Git Protocol**: AI agents are strictly PROHIBITED from modifying the Git database.
>
> - **Zero-Push/Commit Policy**: You MUST NOT run `git add`, `git commit`, `git push`, or any other state-modifying Git commands.
> - **Local Prep Only**: You are only permitted to prepare and preview local file changes (HTML, JS, CSS, TS, JSON, MD, etc.).
> - **Human-Decision Mandatory**: All Git write operations are exclusively reserved for human maintainers after manual review of your prepared changes.

## Agent Mission & Knowledge Continuity

As an AI agent, your primary mission is to maintain the **Gmail Processor** repository in a professional, high-quality, and consistent state.

### 1. Continuous Knowledge Capture

Sustainability depends on shared understanding. You MUST update this document whenever:

- A new architectural decision is made.
- A significant workflow or script is changed or introduced.
- A technical constraint or "gotcha" is discovered and resolved.
- A new tool is added to the maintenance pipeline.

### 2. Guarding the Standard

You are responsible for enforcing the standards defined in this manual. Do not allow regressions in:

- **Canonical Formatting**: Use `npm run lint-fix` regularly.
- **Alphabetical Ordering**: Maintain order in all lists and maintenance scripts.
- **Project Hygiene**: Proactively use pruning and validation tools (`npm run lint-prune`, `npm run lint:devbox:unused`, `npm run lint:scripts`) to keep the codebase lean and reference-stable.

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

_File Reference:_ [Context.ts](src/lib/Context.ts)

### 2. Processing Flow

Processing is handled by specialized processor classes that follow the hierarchy:

1. `GmailProcessor` (Top-level)
2. `ThreadProcessor`
3. `MessageProcessor`
4. `AttachmentProcessor`

Base logic for matching and action execution is in the [BaseProcessor](src/lib/processors/BaseProcessor.ts) abstract class.

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

## Maintenance Triggers

To keep the workspace in a sane state, specific commands MUST be executed after modifying certain types of files:

| Affected Area               | Required Action       | Command                                  |
| :-------------------------- | :-------------------- | :--------------------------------------- |
| `src/lib/`                  | Rebuild & Update Docs | `npm run all:update && npm run test:lib` |
| `src/examples/*.ts`         | Re-generate Examples  | `npm run update:examples`                |
| `package.json`              | Node.js Pruning       | `npm run lint-prune`                     |
| `devbox.json`               | Devbox Pruning        | `npm run lint:devbox:unused`             |
| Root `*.md` files           | Sync Docs             | `npm run update:docs`                    |
| `package.json`              | Total Reinstall       | `npm run all:reinstall`                  |
| Documentation CSS/Config    | Verify Build          | `npm run ci:docs`                        |
| Deployment / Release        | Update Release Notes  | `npm run release:update`                 |
| Release Preview             | Dry-run Release Notes | `npm run release:notes`                  |
| `package.json` / `scripts/` | Script Integrity      | `npm run lint:scripts`                   |

## Generated Artifacts & Automation

The following paths contain automatically generated files and **MUST NOT** be modified manually. Always update their respective source files and run the corresponding update script.

| Generated Path           | Update Script             | Source of Truth                                |
| :----------------------- | :------------------------ | :--------------------------------------------- |
| `docs/docs/community/`   | `npm run update:docs`     | Root `*.md` files                              |
| `docs/docs/examples/`    | `npm run update:examples` | `src/examples/*.ts`                            |
| `docs/docs/reference/`   | `npm run update:docs`     | `src/lib/` (via TypeDoc)                       |
| `src/gas/examples/`      | `npm run update:examples` | `src/examples/*.ts`                            |
| `src/examples/*.json`    | `npm run update:examples` | `src/examples/*.ts`                            |
| `src/examples/*.spec.ts` | `npm run update:examples` | `src/examples/*.ts`                            |
| Release Notes Summary    | `npm run release:update`  | `scripts/prompts/*.md`                         |
| Release Notes Preview    | `npm run release:notes`   | `scripts/` (via `scripts/release-manager.mjs`) |
| Release Notes Prompt     | `npm run release:notes`   | `scripts/` (via `scripts/release-manager.mjs`) |

**Agent Instruction:** If you need to change documentation or examples, find the **Source of Truth** listed above. Manual changes to generated paths will be overwritten during the build process.

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

- Use Zod schemas in `src/lib/config/` for configuration validation, defaults, and type inference.
- Maintain the JSON schema (`config-schema-v2.json`) whenever config schemas change.

### Documentation & JSDoc

- **Action Arguments**: All action argument types in `src/lib/config/ActionConfigTypes.ts` MUST have comprehensive JSDoc `/** */` comments on every field. These comments are the **source of truth** for the generated `actions.mdx` documentation.
- **Persistence**: When refactoring or moving types, ensure that all JSDoc comments are preserved. Losing these comments breaks the automated documentation pipeline.

## Repository Hygiene

### Workspace Path Portability

To ensure documentation and specification files remain portable across different developer machines and workspaces, you MUST NOT use absolute paths (e.g. `file:///home/...` or `file:///C:/...`) inside committed markdown files or specifications. Always use workspace-relative paths (e.g., `src/lib/Context.ts` or markdown links like `[Context.ts](src/lib/Context.ts)`) instead.

### Formatting & Ordering

- **Canonical Formatting**: Every file (JS, TS, JSON, MD, etc.) must be canonically formatted before committing to prevent style-only changes in the Git history. Use `npm run lint-fix` (Prettier) for global formatting.

#### Script & Reference Integrity

To prevent regressions like "missing script" errors in the CI/CD pipeline, all script cross-references must be validated.

- **Automated Validation**: Use `npm run lint:scripts` to audit `package.json` and the `scripts/` directory.
- **Mandatory Check**: This tool MUST be run after any renaming or removal of npm scripts or files within the `scripts/` folder.
- **Fail-Fast**: Any broken reference (direct call, wildcard, or file path) will fail the build and must be resolved immediately.

#### Alphabetical Ordering

- `package.json`: entries in the `scripts`, `dependencies`, `devDependencies`, and `overrides` objects.
- `.gitignore`: entries within each functional group (see below).
- `devbox.json`: entries in the `packages` list.
- Shell scripts: cases in `case` statements.

### Git Ignore Conventions

To prevent configuration bloat and improve maintenance, the `.gitignore` file must follow these rules:

1.  **Functional Grouping**: Group entries by their source or purpose (e.g., `# Build Artifacts`, `# Environment & Secrets`).
2.  **Alphabetical Sorting**: Entries MUST be sorted alphabetically within each functional group.
3.  **Directory Slashing**: Always use a trailing slash for directory entries (e.g., `dist/` instead of `dist`) to differentiate them from files.
4.  **Exceptions Section**: Consolidate all negated rules (starting with `!`) into a dedicated `# Exceptions` section at the very end of the file.

### Temporary Files

- **Scratch Directory**: Always use the `scratch/` folder (at the project root) for temporary files, experiment data, or one-off scripts.
- **Git Exclusion**: This directory is already included in `.gitignore` to prevent accidental commits of transient data.

### Run-Mode Aware Actions

Actions must respect the `RunMode` (Dry-run, Safe, Dangerous) using decorators:

- `@readingAction()`: Safe for all modes.
- `@writingAction()`: Blocked in `DRY_RUN`.
- `@destructiveAction()`: Only allowed in `DANGEROUS` mode.

_File Reference:_ [Decorators.ts](src/lib/utils/Decorators.ts)

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
| `feat`     | A new feature (ONLY for user-visible improvements)     |
| `fix`      | A bug fix                                              |
| `docs`     | Documentation-only changes                             |
| `style`    | Formatting, missing semicolons, etc. (no logic change) |
| `refactor` | Code change that is neither a fix nor a feature        |
| `perf`     | A performance improvement                              |
| `test`     | Adding or updating tests                               |
| `chore`    | Build process, tooling, internal maintenance           |
| `ci`       | CI/CD configuration changes                            |

> [!IMPORTANT]
> **Versioning Guard**: NEVER use `feat` for non-user-facing features (like script improvements or internal tooling). Use `chore` or `ci` instead. `feat` triggers a minor version bump in the release pipeline, which should be reserved for functional improvements that benefit the library's end-users.

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
- Add the `AI-Tool: <tool-name>` trailer (e.g., `Antigravity`, `Aider`). This is **required** to identify the specific tool used.
- Alternatively or additionally, include a brief mention in the PR description.
- This ensures it's clear where AI tools were used for tedious, repetitive work or scaffolding, while acknowledging that the human developer remains responsible for reviewing, testing, and merging the code.

## Development Workflow

1. **Testing:**
   - Unit tests: `npm run test:lib` (uses Jest).
   - E2E tests: Located in `src/examples/`, run via GAS.
   - Mocking: Use `MockFactory` for GAS services in tests.
2. **Pre-commit:** Always run `npm run all:pre-commit` (or `npm run all:pre-commit:fast` for a quicker loop skipping docs) before pushing. This runs within the **Devbox environment** (e.g., via `devbox shell` or `devbox run -- npm run ...`) and ensures:
   - **Centralized Formatting**: Code is formatted via `npm run lint-fix`.
   - **Validation**: Linting (`npm run all:lint`) and builds (`npm run all:build`) are checked.
   - **Tests**: Full test suite (`npm run all:test`) is green.
   - **Synchronization**: Artifacts are updated (`npm run all:update`).
3. **Environment Maintenance:** If you encounter persistent dependency or environment issues, perform a total project reset:
   - Reset all lockfiles and environments: `npm run all:reinstall`.

## Tooling

- **Clasp**: For syncing code with Google Apps Script.
- **Rollup**: For bundling the library.
- **Prettier**: Code formatting (enforced via linting).
- **Act**: For running GitHub Actions locally. Use the namespaced `npm run gh-act:ci:*` scripts to test specific workflow profiles locally before pushing.
  - **Runner Image**: Ensure you use a comprehensive image (mapped via `.actrc`) to avoid "command not found" errors.
  - **Secrets**: Requires a local `.secrets` file to provide credentials for CLASP and GCloud.
  - **Local Testing**: To skip high-friction steps like Snyk scan, SonarQube, and Coveralls during local simulations, the `local-test` input (or the `ACT: true` environment variable) can be used. This is automatically handled by the unified `ci.yaml` workflow.

## Technical Resilience & Stability

This section documents established technical constraints and architectural decisions required to maintain environment stability.

### Node 25 / Webpack 5 Stability

The documentation build (Docusaurus 3) is sensitive to `ajv` and `schema-utils` version poisoning on Node 25.

- **Guideline**: NEVER use forced `overrides` or `resolutions` for AJV in the docs project; it fixes the build but breaks dependency resolution.
- **Solution**: Use `patch-package` (see `docs/patches/`) to surgically loosen Webpack's `ProgressPlugin` schema validation. This maintains a clean modern stack with zero vulnerabilities.

### Environment Resilience

If the NPM or Devbox environment becomes corrupted:

- **Guideline**: Use `npm run all:reinstall`. This is the project's "Total Reset" button, which destructively cleans all lockfiles (including `devbox.lock`) and re-resolves the entire environment.

### Mock Framework Decoupling & Test Isolation

To maintain environment stability, avoid test runner race conditions, and preserve perfect mock isolation:

- **Isolated Startup (`jest.setup.ts`)**: Keep `jest.setup.ts` isolated and free of global class/factory imports (such as `MockFactory.ts`). Global imports during Jest's setup phase force early evaluation of library modules before spec files can register their `jest.mock()` hooks. This bypasses Jest mocks (e.g., `@cantoo/pdf-lib` in `AttachmentActions.spec.ts`) and executes raw code on unconfigured environments.
- **Lazy Mock Registration**: Statically import `MockFactory` locally within specific spec files (`Timer.spec.ts`, `RegexUtils.spec.ts`, `PatternUtil.spec.ts`) where mock-context registration is needed. This registers the factory lazily at execution time and protects module-mock isolation.
- **Decoupled Mock Subclassing**: Always define raw mocked services in the leaf file `EnvMocks.ts` with zero external dependencies. The full context `Mocks` in `MockFactory.ts` subclasses `EnvMocks` and registers itself to `ContextMocks.mockFactoryRef` dynamically. `ContextMocks` then resolves fallbacks lazily, keeping a clean Directed Acyclic Graph (DAG) for compiled test code.

### Circular Dependency Prevention Policy

We enforce a strict **Zero Circular Dependency** policy across the entire workspace (both library and test files):

- **TypeScript Type-Only Imports**: Always use `import type` when importing interfaces, types, or classes purely for type annotations or signatures. This ensures references are completely erased during TypeScript compilation.
- **Fail-Fast Enforcement**: The circular dependency analysis (`npx madge`) is integrated directly into the `lint-code` pipeline. Any new circular dependencies will immediately fail the local checks and CI pipeline.

### ESLint Coding Conventions & Strictness Patterns

To prevent regressions and maintain a clean static analysis status, adhere to the following patterns when writing or refactoring library code:

- **Strict Type Safety (`no-explicit-any`)**:
  - Avoid broad `any` typings. Use strict `unknown` for raw, untrusted parameters (such as configuration files during schema validation or parsing).
  - Use exact types (e.g., `Promise<ActionReturnType>[]` instead of `Promise<any>[]`) for tracking internal async tasks.
- **Unnecessary Condition Prevention (`no-unnecessary-condition`)**:
  - **Optional Chaining**: Never use optional chaining (`?.`) on properties that are typed as non-optional or are statically guaranteed to exist (e.g., `ctx.meta` or `ctxValues`).
  - **Redundant Coalescing**: Remove `?? ""` coalescing guards on variables whose TypeScript types are non-nullable and already defined as strings (e.g., action arguments with default schemas).
  - **Looping Constructs**: Standard infinite loops like `while (true)` trigger conditional warnings because `true` is statically known to be truthy. Use the structural loop construct `for (;;)` instead to completely avoid conditional statements.
  - **Mapping & Filtering**: When checking runtime validity of mapped list entities, avoid explicit conditional operators on types TypeScript infers as always truthy (e.g., `.filter(l => !!l)`). Instead, use standard functional filters like `.filter(Boolean)` which cleanly bypass the linter's condition parsing.
- **Template Literal Integrity (`restrict-template-expressions`)**:
  - **Caught Errors**: Catch blocks yield `unknown` types. In template strings, wrap caught exceptions in `String(e)` to enforce safe, string-compliant rendering without explicit `any` casting.
  - **Switch Cases Coverage**: Enums with total branch coverage narrow the `default:` branch variable to `never`. To print or log the unmatched default value, cast it as a `string` (e.g., `${conflictStrategy as string}`) inside template literal statements.
- **Unused Variable Enforcement (`no-unused-vars`)**:
  - Utilize modern ES2019 **optional catch binding** (`catch { ... }` instead of `catch (e) { ... }`) when the caught error parameter is not explicitly referenced in the block.

## Modernized Release Pipeline

The release process is managed by `scripts/release-manager.mjs`, which orchestrates high-fidelity, community-centric release notes using a **Draft-First (Option C+)** workflow.

### Release Workflow Lifecycle

1.  **PR & Draft Creation**: `release-please` automatically opens a **Draft Pull Request** and creates a **GitHub Draft Release**. This release is invisible to the public and serves as the staging area.
2.  **AI Enrichment**: The `release-manager.mjs` script (triggered by CI or manually) patches the draft release with AI-generated summaries, community context, and technical metadata.
3.  **Manual Verification**: All releases (Patch, Minor, Major) require manual review. The maintainer must click "Ready for review" on the Draft PR, merge it, and then preview the draft release.
4.  **Final Publication**: Publication is a deliberate manual step that removes the 'draft' status from the release and triggers community announcements.

### Core Architecture & Hardening

- **AI Section Persistence**: AI-generated content is wrapped in `<!-- RELEASE_NOTES_AI_START -->` and `<!-- RELEASE_NOTES_AI_END -->` delimiters. Re-running the script will **only** update the section between these markers, preserving any manual edits made to the header or changelog.
- **Surgical Community Context**: Automatically detects human contributors via Git trailers (`Co-authored-by`), filters bots/maintainers, and maps names to GitHub profiles.
- **Notification Safety**: The AI prompt strictly forbids `@` mentions to prevent redundant notifications. All human recognition is done via hyperlinked names.
- **Technical Transparency**:
  - Automatically labels dependency updates with `[MAJOR]`, `[MINOR]`, or `[PATCH]`.
  - Reconstructs hyperlinked Google Apps Script (GAS) library versions in the metadata bar.
  - **Documentation Indexing**: Scans `docs/` to provide AI with precise deep-linking capabilities to reference pages and examples.
- **Announcement Guard**: Community announcements in GitHub Discussions are only triggered during the final `--publish` phase to prevent noise from draft updates.

### Maintenance & Manual Triggers

The `.github/workflows/release.yaml` workflow provides a UI for the following tasks:

- **Preview Release Notes**: Generates a local preview (`build/release-notes-preview.md`) and the exact AI prompt for verification.
- **Update Release Notes**: Patches an existing GitHub Draft Release with the latest enriched content. Supports a `--pr` override to target specific PRs.
- **Publish Release**: Finalizes the draft release, sets it to 'latest', and announces it to the community. You can run this seamlessly from the **GitHub Mobile App**: simply navigate to Actions -> Release Manager -> Run Workflow without specifying a tag, and it will resolve `latest` automatically!

**CLI Reference:**

- `npm run release:notes`: Local dry-run preview.
- `npm run release:update`: CI command to patch draft releases.
- `npm run release:publish`: CI command to finalize and announce.

## Advanced Dependency Management

The project uses a custom, industrial-grade dependency maintenance system to ensure stability and security while minimizing maintenance noise.

### 1. Release Cool-down Policy

To avoid "version zero" bugs and unstable releases, all automated updates strictly follow a release cool-down period.

- **Source of Truth**: The `minimumReleaseAge` setting in `renovate.json`.
- **Enforcement**: The `scripts/npm-packages.sh` script automatically calculates the cut-off date.
- **Override**: Use the `RELEASE_COOLDOWN_DAYS` environment variable to bypass the default period if an immediate update is required.

### 2. Dynamic Security Overrides

Rather than manual tracking, security vulnerabilities are handled via automated injection.

- **Process**: `npm run all:packages-update` performs a clean `npm update`, audits the tree, and automatically generates required `overrides` for vulnerable packages (still respecting the cool-down period).
- **Validation**: Every override is validated via a fresh `npm install` and `npm audit` before being committed.
- **Hygiene**: The system automatically strips old overrides that are no longer necessary.

### 3. Usage & Triggers

| Goal                | Command                       | Context                                                                       |
| :------------------ | :---------------------------- | :---------------------------------------------------------------------------- |
| **Safe Update**     | `npm run all:packages-update` | Performs natural updates, enforces pinning, and generates security overrides. |
| **Manual Override** | `npm run packages:update:lib` | Targets a specific workspace (root or docs).                                  |
| **Security Audit**  | `npm run all:audit-security`  | Verifies that the current tree is clean.                                      |
| **Integrity Check** | `npm run lint:scripts`        | Ensures all script references are valid after renames or reordering.          |

### 4. Version Pinning & Update Policy

To ensure fully reproducible builds and environment stability, the project enforces strict version pinning.

- **Strict Pinning**: All dependencies in `package.json` MUST be pinned to exact versions (no `^` or `~` prefixes). The `npm run all:packages-update` script automatically enforces this.
- **Update Level Control**: By default, only **minor** and **patch** updates are performed.
  - **Patch Updates**: Only allowed if `NPM_UPDATE_LEVEL=patch` is set (skips minor/major updates).
  - **Major Updates**: Only allowed if `NPM_UPDATE_LEVEL=major` is set.
- **Reproducibility**: This combination of pinning and controlled updates ensures that the local environment, CI pipeline, and GAS deployment remain in lock-step.

### 5. Dependency Management (Renovate)

The project uses Renovate to automate dependency updates with a focus on noise reduction and logical grouping.

#### Configuration Standards

- **Modern Matchers**: Always prefer `matchPackagePatterns` for regex-based rules to ensure clarity and standard compliance.
- **Normalization**: Avoid redundant `/` wrappers or trailing slashes in patterns.

#### Maintenance Automation (CI)

The CI pipeline (`ci.yaml`) includes a **Maintenance Auto-Fix** step that can automatically synchronize artifacts.

- **Toggle**: This feature is controlled by the `enable_maintenance_fix` workflow input and is **DISABLED** by default to ensure pipeline stability.
- **Auto-Fix Logic**: When enabled, it runs `npm run all:update` and `npm run lint-fix`, then auto-commits and pushes changes back to the PR branch.
- **Permission Requirement**: Note that the CI DOES NOT have `workflows: write` permission for security reasons. If maintenance scripts (like `lint-fix`) modify any files in `.github/workflows/`, the auto-commit will fail, and those changes must be pushed manually by a human.
- **Manual Action Required**: Since auto-fix is disabled by default (and restricted for workflow files), if a PR (e.g., from Renovate) fails the integrity check or shows drift, you MUST run `npm run all:pre-commit` locally and push the changes manually.
