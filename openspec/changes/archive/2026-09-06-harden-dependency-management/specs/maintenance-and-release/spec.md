## ADDED Requirements

### Requirement: Workspace Dependency Linking

All workspace packages SHALL reference local sibling and root packages using standard workspace protocol version declarations (`*`) rather than relative directory paths (`file:..`).

#### Scenario: Updating Workspace Dependencies

- **WHEN** dependencies or lockfiles are updated by automation tools or developers
- **THEN** npm generates a portable root lockfile without invalid empty target references (`EMISSINGTARGET`).

### Requirement: Platform Toolchain Version Ceilings

Automated dependency update mechanisms SHALL enforce version ceilings on platform compilers and runtime toolchains (including TypeScript) to prevent premature major version updates.

#### Scenario: Automated TypeScript Upgrade Evaluation

- **WHEN** a new major version of TypeScript (such as v7.x) is released upstream
- **THEN** Renovate respects the configured version boundary (`<7.0.0`) and does not generate uncoordinated breaking PRs or attempt automatic merges.

### Requirement: Vulnerability Stability Cooldown

Security vulnerability updates SHALL enforce a minimum release age stability cooldown of at least 3 days prior to branch creation and automerge.

#### Scenario: Upstream Security Micro-Patch Churn

- **WHEN** an upstream dependency releases a zero-day advisory followed by rapid successive point releases
- **THEN** the automation pipeline delays PR generation until the release age satisfies the cooldown period, preventing redundant CI builds and rebase churn.

### Requirement: Renovate Grouping and Concurrency Bounds

Dependency update rules SHALL group packages into distinct, non-overlapping functional tiers and enforce a pull request concurrency limit to prevent lockfile rebase storms.

#### Scenario: Scheduled Dependency Check Execution

- **WHEN** the weekly scheduled dependency scan runs
- **THEN** updates are grouped into cohesive tiers without conflicting rules, and total open concurrent PRs do not exceed the configured concurrency limit.

### Requirement: Workspace-Aware Outdated and Update Management

Developer maintenance tooling SHALL support semver-bounded audits (`minor` vs `latest`) across all workspaces while dynamically respecting the configured release cooldown.

#### Scenario: Auditing Safe Non-Major Updates

- **WHEN** `npm run all:packages-outdated` is executed
- **THEN** the system checks for available minor and patch updates across root and workspace packages that satisfy the release cooldown threshold without displaying breaking major versions.

#### Scenario: Auditing Major Version Upgrades

- **WHEN** `npm run all:packages-outdated:major` is executed
- **THEN** the system explicitly reports breaking major version upgrades across root and workspace packages with transparent cooldown indicators.
