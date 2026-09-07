## Context

The Gmail Processor repository is structured as an npm workspace containing the core library at root and documentation under `docs/`. While maintenance and release automation are extensive, the repository suffers from chronic Renovate PR failures:

1. Lockfile generation fails on all `docs/` updates with `npm error code EMISSINGTARGET` because [docs/package.json](/docs/package.json) references the root package via `"file:.."`.
2. Tooling PRs (such as TypeScript 7 in PR #702) crash CI due to ecosystem incompatibilities with `ts-node` and `typescript-eslint`.
3. Phantom and overly broad `overrides` in root [package.json](/package.json) distort resolution trees, while zero-day vulnerability updates create constant rebuild churn.
4. Conflicting, overlapping package grouping rules in [renovate.json](/renovate.json) cause multiple PRs to open simultaneously on Saturday mornings, continuously invalidating each other's lockfiles.

## Goals / Non-Goals

**Goals:**

- Eliminate `EMISSINGTARGET` lockfile generation errors in Renovate and CI container environments.
- Protect CI pipelines from uncoordinated major compiler/runtime upgrades (e.g. TypeScript 7) by bounding platform tools.
- Clean up root `package.json` overrides and introduce a stability cooldown on vulnerability PRs.
- Re-architect Renovate grouping to prevent lockfile rebase wars and establish non-overlapping update tiers.

**Non-Goals:**

- Upgrading to TypeScript 7 or rewrite tooling away from `ts-node` (deferred until ecosystem stability).
- Migrating from npm workspaces to pnpm or yarn.
- Removing Docusaurus or altering docs structure.

## Decisions

### Decision 1: Standardize Workspace Protocol (`"gmail-processor": "*"`)

- **Choice**: In [docs/package.json](/docs/package.json), replace `"gmail-processor": "file:.."` with `"gmail-processor": "*"`.
- **Rationale**: The `"file:.."` declaration forces npm's arborist lockfile generator to output `"resolved": ""`, which fails in isolated Renovate container checkouts with `EMISSINGTARGET`. The standard npm workspace protocol (`*`) ensures native workspace linking.
- **Alternatives Considered**: Keeping `"file:.."`. Rejected because it breaks Renovate's sparse/containerized lockfile generation.

### Decision 2: Impose Platform Tooling Version Ceilings in Renovate

- **Choice**: In [renovate.json](/renovate.json), add `"matchPackageNames": ["typescript"]` with `"allowedVersions": "<7.0.0"` and remove automatic merging for major toolchain updates.
- **Rationale**: Platform compilers dictate ecosystem compatibility. TypeScript 7 introduces breaking API changes that cause `ts-node` (used in script linting) to fail immediately with `TypeError: Cannot read properties of undefined (reading 'fileExists')`. TypeScript upgrades must be deliberate and coordinated.
- **Alternatives Considered**: Migrating from `ts-node` to `tsx` or `@swc/register`. While valuable, decoupling the platform compiler bound from the runtime runner is the correct defensive posture for automated updates.

### Decision 3: Prune Phantom Overrides & Implement Vulnerability Cooldown

- **Choice**:
  1. Remove `uuid: 14.0.2` and `socksjs: 0.5.0` from root [package.json](/package.json) `overrides` (neither is in the dependency tree).
  2. In [renovate.json](/renovate.json), change `deps:security` `minimumReleaseAge` from `"0 days"` to `"3 days"`.
- **Rationale**: Phantom overrides clutter maintenance without providing value. A 3-day cooldown on vulnerability patches prevents churn storms when upstream libraries publish rapid successive micro-patches (e.g., `brace-expansion` 5.0.7 &rarr; 5.0.8 &rarr; 5.0.9).
- **Alternatives Considered**: Leaving zero-day alerts enabled. Rejected because premature patch updates frequently introduce regressions or get superseded within 48 hours.

### Decision 4: Tiered, Non-Overlapping Renovate Rules & Concurrency Control

- **Choice**:
  1. Remove overlapping rules `deps:all-non-major`, `deps:lib-non-major`, and `deps:docs-non-major`. Unify workspace non-major updates into cohesive, non-competing groups.
  2. Structure clear tiers:
     - **Tier 1 (Infra)**: GitHub Actions digests, devbox packages (`automerge: true`).
     - **Tier 2 (Tooling & Types)**: Prettier, ESLint, `@types/*` (`automerge: true`).
     - **Tier 3 (Workspace Non-Major)**: Shared dependencies across root and `docs/`.
     - **Tier 4 (Major Upgrades)**: Individual PRs, no automerge.
  3. Set `"prConcurrentLimit": 3` to cap simultaneous open PRs.
- **Rationale**: Resolves the Saturday morning race condition where 6+ PRs touch the same root `package-lock.json` simultaneously.
- **Alternatives Considered**: Setting `prConcurrentLimit: 1`. Rejected as overly restrictive when infra/type PRs can safely merge quickly.

### Decision 5: Modernize Outdated & Update Scripting with `npm-check-updates` (`ncu`)

- **Choice**:
  1. Add `npm-check-updates` to root `devDependencies` in `package.json`.
  2. Refactor [scripts/npm-packages.sh](/scripts/npm-packages.sh) from 207 lines of custom `gojq` parsing and manual file backups down to a ~40-line script using `ncu`.
  3. Support distinct target levels: `all:packages-outdated` runs `ncu --target minor` (displaying only safe minor/patch bumps respecting cooldown), while `all:packages-outdated:major` runs `ncu --target latest` to explicitly audit breaking major updates.
  4. Preserve cooldown period synchronization by reading `minimumReleaseAge` from `renovate.json` and passing `--cooldown "${DAYS}d"`.
- **Rationale**: Standard `npm outdated` cannot filter out major version updates when exact versions are pinned, misses intermediate minor updates when newer majors exist (e.g., `@docsearch/react 4.7.0`), and exits with code 1. `ncu` natively supports workspaces, semver levels, transparent cooldown reporting, and clean exit codes.
- **Alternatives Considered**: Keeping `npm outdated` with custom `gojq` filtering. Rejected because maintaining 200 lines of custom JSON AST transformations and parallel `concurrently` child processes across workspaces is fragile and unnecessary.

## Risks / Trade-offs

- **[Risk] Workspace reference `*` compatibility with local clasp/GAS builds** &rarr; _Mitigation_: The GAS build scripts and rollup bundle `src/` directly, independent of `docs/`. Verification with `devbox run -- npm run all:build` ensures zero disruption.
- **[Risk] Delayed critical security patch due to 3-day cooldown** &rarr; _Mitigation_: Critical CVEs can still be triggered manually via Renovate dashboard or npm audit/overrides if immediate intervention is required.
- **[Risk] Stale lockfile entries when merging multi-tier PRs** &rarr; _Mitigation_: Renovate's `rebaseWhen: "behind-base-branch"` and weekly `lockFileMaintenance` ensure continuous reconciliation.
