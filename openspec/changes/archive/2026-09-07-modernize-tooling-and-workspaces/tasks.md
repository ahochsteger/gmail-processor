## 1. Clasp Compatibility & Logging

- [x] 1.1 Update `scripts/clasp.sh` line 313 to call `"$0" "${CLASP_PROFILE}" logs "${functionName}" "${logTimeSeconds}"` instead of passing positional args to `clasp logs`, and verify with `bash -n scripts/clasp.sh`.

## 2. Workspace Script Modernization

- [x] 2.1 Update `scripts/build-docs.sh` to use `npm run build -w docs --silent` instead of `--prefix docs`.
- [x] 2.2 Update `package.json` scripts (`docs:start`, `lint:docs`) to use native `-w docs` flags.
- [x] 2.3 Streamline `locks:clean:*` in `package.json` to define `locks:clean:npm` removing root and workspace node_modules and single lockfile, maintaining alphabetical ordering.
- [x] 2.4 Update `scripts/lint-scripts.ts` to parse `-w <workspace>` / `--workspace=<workspace>` arguments, resolve delegated scripts against that workspace's `package.json`, and verify with `npm run lint:scripts`.

## 3. CI Caching & Static Analysis Tooling

- [x] 3.1 Update `.github/actions/setup-environment/action.yaml` cache keys to remove `docs/package-lock.json` and hash `package-lock.json` and `docs/package.json`.
- [x] 3.2 Update `.knip.jsonc` to the Knip v6 workspace schema and verify via `npm run lint-prune`.
- [x] 3.3 Update `scripts/lint-devbox-unused.sh` to include `docs` in binary usage scanning and verify via `npm run lint:devbox:unused`.

## 4. Verification & Validation

- [x] 4.1 Run `npm run all:maintenance` in the devbox environment and verify all checks pass.
- [x] 4.2 Run `npm run all:build` and `npm run test:lib` to verify the workspace compiles and passes tests cleanly.
