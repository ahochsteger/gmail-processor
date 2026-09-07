## Why

The repository integrated the `docs/` folder as an npm workspace, upgraded `@google/clasp` to v3, and upgraded other tooling (`knip` v6, `typedoc`, `npm-check-updates`). However, several npm scripts, validation scripts, and GitHub Actions workflows retained outdated patterns, legacy `--prefix` directory switching, non-existent lockfile references in CI cache keys, obsolete positional argument calls to `clasp logs`, and a legacy Knip v5 configuration. Modernizing these scripts and configs ensures clean workspace ergonomics, reliable CI caching, and error-free clasp operations.

## What Changes

- **Clasp v3 Compatibility**: Update [scripts/clasp.sh](/scripts/clasp.sh) to fix `run-with-logs` by invoking the script's internal `logs` handler instead of passing positional arguments to `clasp logs` (which errors with `Expected 0 arguments but got 2` in Clasp v3).
- **Native Workspace Targeting**:
  - Replace `--prefix docs` with native `-w docs` in [package.json](/package.json) (`docs:start`, `lint:docs`) and [scripts/build-docs.sh](/scripts/build-docs.sh).
  - Modernize [scripts/lint-scripts.ts](/scripts/lint-scripts.ts) to parse `-w <workspace>` / `--workspace=<workspace>` arguments and validate workspace-delegated scripts against the workspace package manifest.
- **CI Setup & Caching Hardening**:
  - Update [.github/actions/setup-environment/action.yaml](/.github/actions/setup-environment/action.yaml) cache keys to remove references to `docs/package-lock.json` (which does not exist in an npm workspace) and hash `package-lock.json` and `docs/package.json` appropriately.
- **Knip v6 Workspace Configuration**:
  - Update [.knip.jsonc](/.knip.jsonc) with the Knip v6 schema and explicit `workspaces` configuration covering root and `docs` (`.tsx` components).
- **Workspace Hygiene & Script Streamlining**:
  - Streamline `locks:clean:*` in [package.json](/package.json) to reflect single-lockfile monorepo semantics (`locks:clean:npm`).
  - Update [scripts/lint-devbox-unused.sh](/scripts/lint-devbox-unused.sh) to include `docs/` in the tool scan.

## Capabilities

### Modified Capabilities

- `maintenance-and-release`: Add requirements for npm workspace execution patterns (`-w`), CI cache key validation for workspace monorepos, and Clasp v3 execution boundaries.

## Impact

- `scripts/clasp.sh`, `scripts/build-docs.sh`, `scripts/lint-scripts.ts`, `scripts/lint-devbox-unused.sh`
- `package.json`, `.knip.jsonc`
- `.github/actions/setup-environment/action.yaml`
- Zero breaking changes to the published library API.
