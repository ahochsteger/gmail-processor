# Test Coverage Specification

## Purpose
Specifies the requirements for enforcing, maintaining, and verifying 100% test coverage across all codebase branches, lines, functions, and statements.

## Requirements

## ADDED Requirements

### Requirement: Strict 100% Test Coverage Enforcement
The Jest test runner and build pipeline SHALL enforce a 100% threshold for statements, branches, functions, and lines across the core library.

#### Scenario: Verify CI Failure on Code Coverage Regression
- **WHEN** a change is introduced that lacks full test coverage for its lines or branches
- **THEN** the Jest coverage check must fail and halt the pre-commit or CI run.

### Requirement: Address Coverage Gaps in Core Library
Specific uncovered lines and branches in the core modules SHALL be covered by targeting tests:
- **`lib/actions/ActionRegistry.ts`**: lines `87`, `118-119` (uncovered functions/branches).
- **`lib/actions/MessageActions.ts`**: lines `29-30`.
- **`lib/actions/ThreadActions.ts`**: lines `19-20`.
- **`lib/adapter/GDriveAdapter.ts`**: lines `171-178` (uncovered error handling/paths).
- **`lib/adapter/GmailAdapter.ts`**: lines `92-93`.
- **`lib/adapter/SpreadsheetAdapter.ts`**: lines `58-61` (logSheet opening warn catches).
- **`lib/adapter/LogAdapter.ts`**: line `87`.
- **`lib/config/Config.ts`**: lines `98-100` (defaults config fallback logic).
- **`lib/config/v1/V1ToV2Converter.ts`**: lines `124`, `193-194`.
- **`lib/e2e/E2E.ts`**: lines `941-950`, `953-1109` (E2E assertion logs and matching helpers; currently at 72.61%).
- **`lib/expr/ExprEvaluator.ts`**: line `213`.
- **`lib/expr/ExprFilter.ts`**: lines `101-102`.
- **`lib/expr/parseDuration.ts`**: lines `78-79`.
- **`lib/processors/BaseProcessor.ts`**: lines `115-116`.
- **`lib/processors/ThreadProcessor.ts`**: lines `368`, `392`, `403`, `423`.
- **`lib/processors/MessageProcessor.ts`**: lines `66`, `70`, `144`.
- **`lib/processors/AttachmentProcessor.ts`**: lines `47-48`, `170-171`.
- **`lib/processors/GmailProcessor.ts`**: lines `89-90` (visibility logic).
- **`lib/utils/Logger.ts`**: line `70`.

#### Scenario: Full Branch Verification
- **WHEN** the Jest coverage test suite is executed
- **THEN** it must show 100% coverage on all these modules without leaving any uncovered lines.

