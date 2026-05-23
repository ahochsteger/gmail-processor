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
