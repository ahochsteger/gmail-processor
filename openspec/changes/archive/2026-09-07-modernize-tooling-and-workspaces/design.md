## Context

The repository uses npm workspaces with root representing the library and `docs` as a workspace. With tool updates (`@google/clasp` v3.4.1, `knip` v6.33.0), older patterns like `--prefix docs`, non-existent lockfiles in CI caching, and deprecated positional arguments in clasp commands lead to runtime errors or maintenance friction.

## Goals / Non-Goals

**Goals:**

- Eliminate runtime errors from Clasp v3 argument deprecations.
- Align all documentation and linting scripts to native npm workspace syntax (`-w docs`).
- Upgrade `scripts/lint-scripts.ts` to natively inspect workspace package manifests.
- Fix GitHub Actions cache key invalidation to accurately hash existing workspace files.
- Migrate `.knip.jsonc` to Knip v6 workspace schema.
- Keep all pre-commit, build, and test pipelines completely green.

**Non-Goals:**

- Restructuring the core library code or exported Apps Script API.
- Altering Docusaurus site contents or design.

## Decisions

### Decision: Clasp Log Delegation via Script Wrapper

- **Choice**: In `scripts/clasp.sh`, replace `runClasp logs "${functionName}" "${logTimeSeconds}"` in `run-with-logs` with calling the internal `logs` command (`"$0" "${CLASP_PROFILE}" logs "${functionName}" "${logTimeSeconds}"`).
- **Rationale**: Clasp v3 accepts 0 arguments on `clasp logs`. The script wrapper already implements rich JSON log extraction and time-window filtering via `gojq`. Reusing the wrapper keeps filtering functional while preventing Clasp argument validation errors.
- **Alternatives**: Calling `runClasp logs` directly without arguments would drop the function filter and time window.

### Decision: Workspace-Aware Script Verification in `lint-scripts.ts`

- **Choice**: Enhance `scripts/lint-scripts.ts` to detect `-w <workspace>` or `--workspace=<workspace>` flags, load `<workspace>/package.json`, and validate targets in that workspace scope.
- **Rationale**: Replaces the previous hack `(?!.*--prefix)` which simply bypassed checking scripts with `--prefix`. This ensures script references to `docs` are actually validated.
- **Alternatives**: Continue ignoring workspace calls via regex bypass. Rejected because it leaves script references unvalidated.

### Decision: CI Cache Hashing on Manifests

- **Choice**: In `.github/actions/setup-environment/action.yaml`, update `cache-npm` to hash `package-lock.json`, and `cache-docs` to hash `docs/package.json` alongside `package-lock.json`.
- **Rationale**: In npm workspaces, child workspaces do not have individual `package-lock.json` files. Hashing non-existent files returns an empty hash, degrading cache keys to static prefixes.
- **Alternatives**: Hashing all files in `docs/`. Rejected because content edits shouldn't invalidate dependency caches.

### Decision: Knip v6 Workspaces Adoption

- **Choice**: Structure `.knip.jsonc` using `workspaces: { ".": { ... }, "docs": { ... } }`.
- **Rationale**: Knip v6 has first-class workspace awareness. Splitting root and `docs` configs enables proper inclusion of React `.tsx` files in `docs/src/` and eliminates false configuration hints.

## Risks / Trade-offs

- [Risk] Changing npm scripts might affect developers accustomed to running `--prefix docs`.
  → Mitigation: `npm run ... -w docs` is the official standard and works identical or better across all Node/npm versions.
- [Risk] Knip v6 configuration might surface unused exports in `docs`.
  → Mitigation: Explicitly declare docs entrypoints (`docusaurus.config.js`, `sidebars.js`, `src/pages/**/*.{js,jsx,ts,tsx}`, etc.).
