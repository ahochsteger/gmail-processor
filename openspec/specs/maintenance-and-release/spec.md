# Maintenance, Build & Release Specification

## Purpose

This specification documents the strict Safe Git Protocol, repository hygiene rules, dependency auditing, automated E2E test data reuse, Webpack build sensitivity, and the draft-first release pipeline.

## Requirements

### Requirement: Safe Git Gating

Agents SHALL NOT perform state-modifying Git operations (`git add`, `git commit`, `git push`).

#### Scenario: Code Contribution

- **WHEN** file changes are prepared by an agent
- **THEN** they must remain local and be left for a human maintainer to review and commit.

### Requirement: Alphabetical List Sorting

Certain configuration files and objects SHALL be sorted alphabetically to prevent merge conflicts.

#### Scenario: Script & Dependency Additions

- **WHEN** items are added to `package.json` scripts/dependencies, `devbox.json` packages, or `.gitignore` groups
- **THEN** they must be ordered alphabetically within their sections.

### Requirement: E2E Test Data Caching & Reuse

The E2E test runner SHALL check configuration hashes before sending new emails.

#### Scenario: Recurring Test Run

- **WHEN** E2E tests are run and the SHA-256 hash of the test configuration matches the cached hash in `UserProperties`
- **THEN** the runner must bypass email generation, reset the existing test threads (unread status, removed labels), trash stale test directories, and reuse the historical test data.

### Requirement: Documentation Verification on AJV Changes

Any modifications to AJV or dependency configurations SHALL undergo manual build verification.

#### Scenario: Dependency Modification

- **WHEN** any dependency or lockfile is updated
- **THEN** the developer must run `npm run ci:docs` explicitly to verify that the documentation compiles without progress/schema conflicts.

### Requirement: Draft Staging

All release candidates SHALL be initialized as draft releases and draft PRs.

#### Scenario: Staging Release Notes

- **WHEN** `release-please` creates a new release draft
- **THEN** the custom release manager must enrich the draft with AI summaries and link community contributors before publication.

### Requirement: Manual Release Runner UI

Draft releases SHALL be publishable manually on the go via GitHub Actions.

#### Scenario: Manual Release Trigger

- **WHEN** the `publish-release` job is run in the Maintenance Runner workflow
- **THEN** it must auto-detect and publish the `"latest"` draft release without requiring a hardcoded tag input.

### Requirement: Security Audit CI Step

The Security Audit CI step SHALL perform dependency auditing without blocking the build pipeline on dev-dependency advisories.

#### Scenario: Running Security Audit in CI

- **WHEN** the `Audit Security` CI step executes in GitHub Actions
- **THEN** it executes `npm run all:audit-security` with non-blocking error handling (`continue-on-error: true`), logging advisories in the build output while allowing subsequent test and build steps to complete.

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
