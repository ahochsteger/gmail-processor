## Why

Renovate PRs consistently fail due to lockfile generation errors in the `docs/` workspace (`EMISSINGTARGET`), breaking major updates to core platform tooling (e.g., TypeScript 7 breaking `ts-node`), fragile manual overrides causing peer dependency conflicts, and uncoordinated Saturday morning PR storms. Hardening dependency management and automation policies establishes a resilient, predictable, and green dependency lifecycle.

## What Changes

- **Workspace Protocol Alignment**: Update [docs/package.json](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/docs/package.json) to reference `gmail-processor` via standard workspace protocol (`"gmail-processor": "*"`) instead of `"file:.."`, eliminating `EMISSINGTARGET` lockfile generation failures in Renovate and CI containers.
- **Platform Tooling Ceilings**: Constrain platform compilers and runtime tools (such as TypeScript `<7.0.0`) in [renovate.json](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/renovate.json) using `allowedVersions`, preventing uncoordinated major version bumps from breaking build and linting tooling (`ts-node`, `ts-jest`, `@typescript-eslint`).
- **Dependency Overrides Hygiene**: Audit and prune obsolete/phantom entries from root [package.json](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/package.json) `overrides` (`uuid`, `socksjs`), ensuring remaining overrides are strictly scoped and justified.
- **Vulnerability Cooldown & Stability Window**: Introduce a minimum stability age / cooldown (3–5 days) for vulnerability updates in Renovate to prevent zero-day point-release thrashing (e.g., rapid micro-patches of `brace-expansion`).
- **Renovate Rule & Concurrency Overhaul**: Reorganize [renovate.json](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/renovate.json) package rules into clear, non-overlapping tiers (Infra, Safe Dev Tools, Unified Workspace Non-Major, Major/Manual), eliminate artificial splits between `lib` and `docs`, and enforce concurrency limits (`prConcurrentLimit`) to prevent lockfile rebase storms.
- **Workspace-Aware Outdated & Update Script Modernization**: Streamline [scripts/npm-packages.sh](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/scripts/npm-packages.sh) using `npm-check-updates` (`ncu`), eliminating over 160 lines of custom `gojq` semver parsing, file backups, and directory fragmentation. Introduce first-class semver target differentiation (`all:packages-outdated` for safe minor/patch updates respecting cooldown, and `all:packages-outdated:major` for major version audits).

## Capabilities

### New Capabilities

<!-- None: This change hardens existing maintenance, build, and repository workflows. -->

### Modified Capabilities

- `maintenance-and-release`: Add requirements for npm workspace lockfile integrity, platform toolchain version bounds, dependency update stability cooldowns, and Renovate concurrency management.

## Impact

- **Configuration Files**: [package.json](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/package.json), [docs/package.json](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/docs/package.json), [renovate.json](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/renovate.json).
- **Lockfile**: Root [package-lock.json](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/package-lock.json) regenerated cleanly under standard workspace rules.
- **CI & Automation**: Renovate PRs become green and automergeable where safe; CI checks won't fail from premature TypeScript 7 bumps or colliding weekend lockfile diffs.
