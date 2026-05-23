# Proposal: Test Coverage Expansion

## Why

As we introduce new capabilities (Spreadsheet configurations, Gemini AI integration, etc.) and perform structural cleanups (reducing circular dependencies, refactoring context objects), we need absolute confidence that existing logic does not regress. Enforcing and maintaining 95% global / 90% branch test coverage provides a safety net for all subsequent roadmap phases.

## What Changes

- Upgrade the Jest configuration (`jest.config.js`) to set a strict `95%` global coverage threshold (statements/functions/lines) and `90%` for branches.
- Audit the current test suite and identify any gaps in `src/lib/`.
- Add unit tests for any untested branches, edge cases, and error-handling routines in adapters and processors.
- Enforce the coverage check in the local pre-commit hooks and the CI pipeline (`ci.yaml`).

## Capabilities

## New Capabilities

- `test-coverage`: Quality gate ensuring 95% global and 90% branch coverage, integrated into local and remote build pipelines.

## Modified Capabilities

_(None)_

## Impact

- **Modules**: `jest.config.js`, `.github/workflows/ci.yaml`, all uncovered files in `src/lib/`.
- **Dependencies**: None.
