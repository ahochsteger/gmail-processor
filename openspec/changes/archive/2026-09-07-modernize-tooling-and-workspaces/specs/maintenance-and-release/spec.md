## ADDED Requirements

### Requirement: Native Workspace Script Execution

Commands and scripts delegating to workspace packages SHALL use npm workspace arguments (`-w <workspace>` or `--workspace=<workspace>`) rather than legacy `--prefix <directory>`.

#### Scenario: Running Workspace Commands

- **WHEN** executing a script belonging to a workspace package (such as `docs`) from root
- **THEN** the script is dispatched using npm workspace flags (`-w docs`) while preserving the root execution environment and hoisting hierarchy.

### Requirement: Workspace-Aware Script Reference Validation

The script integrity validator (`lint:scripts`) SHALL parse workspace target flags and validate script references against the target workspace package manifest.

#### Scenario: Validating Workspace Delegations

- **WHEN** `lint:scripts` processes an npm script with `-w <workspace>` or `--workspace=<workspace>`
- **THEN** it validates that the referenced script exists within that workspace's `package.json` without emitting false-positive missing-script errors against the root package.

### Requirement: Accurate Monorepo Cache Key Hashing

GitHub Actions cache configurations SHALL only hash files that exist in the repository and SHALL NOT reference non-existent child workspace lockfiles.

#### Scenario: Caching Dependencies and Build Metadata

- **WHEN** setting up cache keys for NPM and Docusaurus metadata in CI
- **THEN** the cache keys hash valid files (`package-lock.json` and `docs/package.json`) and avoid empty hash outputs from non-existent files like `docs/package-lock.json`.

### Requirement: Clasp Argument Compliance

Clasp execution wrappers SHALL comply with the CLI command schemas and SHALL NOT pass unsupported positional arguments.

#### Scenario: Viewing Logs with Function and Duration Filters

- **WHEN** running Apps Script logs via the clasp wrapper
- **THEN** positional filters are processed through structured JSON filtering (via `gojq`) rather than passing raw positional arguments to `clasp logs`.
