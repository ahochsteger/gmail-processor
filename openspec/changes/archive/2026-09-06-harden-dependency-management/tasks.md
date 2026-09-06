## 1. Workspace Protocol & Lockfile Resolution

- [x] 1.1 Update `docs/package.json` to reference `gmail-processor` via `"gmail-processor": "*"` instead of `"file:.."`
- [x] 1.2 Reconcile and regenerate root `package-lock.json` via `devbox run -- npm install`
- [x] 1.3 Verify local library, examples, and docs builds via `devbox run -- npm run all:build` and `devbox run -- npm run ci:docs`

## 2. Platform Tooling Boundaries

- [x] 2.1 Add TypeScript version boundary (`allowedVersions: "<7.0.0"`) in `renovate.json` to protect against TS 7 breaking `ts-node`
- [x] 2.2 Ensure major compiler and dev tool updates have `automerge: false` in `renovate.json`

## 3. Dependency Overrides & Vulnerability Cooldown

- [x] 3.1 Remove phantom overrides (`uuid`, `socksjs`) from root `package.json` and keep only actively required overrides
- [x] 3.2 Update `renovate.json` vulnerability rule `minimumReleaseAge` from `0 days` to `3 days` to prevent point-release churn

## 4. Renovate Rule & Concurrency Overhaul

- [x] 4.1 Remove conflicting `deps:lib-non-major` and `deps:docs-non-major` file-specific rules from `renovate.json`
- [x] 4.2 Establish non-overlapping update tiers in `renovate.json` (Infra, Safe Dev Tools, Workspace Core Non-Major, Major)
- [x] 4.3 Add `prConcurrentLimit: 3` to `renovate.json` to prevent concurrent Saturday lockfile collision storms
- [x] 4.4 Validate updated Renovate configuration using `devbox run -- npm run lint:renovate`

## 5. Verification & Repo Hygiene

- [x] 5.1 Run full pre-commit validation suite via `devbox run -- npm run all:pre-commit`
- [x] 5.2 Validate script references and repository integrity via `devbox run -- npm run lint:scripts`

## 6. Modernized Outdated & Update Tooling with `ncu`

- [x] 6.1 Add `npm-check-updates` to root `devDependencies` in `package.json`
- [x] 6.2 Streamline `scripts/npm-packages.sh` using `ncu --workspaces --root`, dynamic cooldown from `renovate.json`, and semver target levels
- [x] 6.3 Update `package.json` npm scripts to expose `all:packages-outdated` (minor) and `all:packages-outdated:major` (latest)
- [x] 6.4 Validate script references and execution via `devbox run -- npm run lint:scripts` and `devbox run -- npm run all:packages-outdated`
