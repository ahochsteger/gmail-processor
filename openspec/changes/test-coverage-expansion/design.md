## Context

Gmail Processor currently has an overall statement coverage of ~96.21%. While the core library is heavily tested, several files have small uncovered branches, error-handling blocks, and fallback paths. To guarantee stability and prevent regressions as we build new features, we must achieve and enforce 100% code coverage. This design document describes the strategy to fill the coverage gaps and configure Jest to strictly enforce the 100% gate.

## Goals / Non-Goals

**Goals:**

- Add targeted unit tests to cover all listed lines and branches in [spec.md](specs/test-coverage/spec.md).
- Update `jest.config.js` to set the global coverage threshold to 100% for statements, branches, functions, and lines.
- Verify 100% code coverage in local pre-commit checks and CI.

**Non-Goals:**

- Refactoring or altering production logic (unless fixing a syntax error or logic flow that is untestable).
- Creating new example files or altering standard end-to-end (E2E) execution behavior.

## Decisions

### 1. Enforce 100% Global Coverage Threshold in `jest.config.js`

We will configure Jest to reject any builds that do not achieve 100% statement, branch, function, and line coverage.

- **Rationale:** A global 100% check prevents developers from introducing uncovered code.
- **Alternatives:**
  - _Per-file thresholds:_ Increases maintenance overhead as we would need to specify configuration rules for every new file.
  - _No hard threshold:_ Code coverage will decay over time.

### 2. Expand Existing Unit Test Suites (`*.spec.ts`)

We will add targeted test cases to the existing spec files in `src/lib/` to address the missing lines.

- **Rationale:** Maximizes test locality and reduces codebase bloat.
- **Alternatives:**
  - _Separate files for coverage expansion:_ Unnecessarily splits tests for a single module.

### 3. Strategy for Testing Gaps:

- **`ActionRegistry.ts`**: Register a provider under an existing name to trigger the duplicate registration error, and assert on the returned map from `getActionProviders()`.
- **`MessageActions.ts`** & **`ThreadActions.ts`**: Invoke `noop()` in unit tests and verify it logs a NOOP message.
- **`GDriveAdapter.ts`**: Pass an unknown/invalid `ConflictStrategy` string to the factory to trigger the default fallback warning.
- **`GmailAdapter.ts`**: Call `threadAddLabel()` with an empty string/falsy label name and verify it throws an error.
- **`SpreadsheetAdapter.ts`**: Mock `spreadsheetApp.openById` to throw an error, verifying the warning is caught and logged.
- **`LogAdapter.ts`**: Define a custom log config where `ctxValues[ctx.type]` is defined, to cover the custom field value extraction.
- **`Config.ts`**: Call `configToJson()` with `withDefaults = false` and assert on the output structure.
- **`V1ToV2Converter.ts`**: Provide V1 configuration objects that both contain and omit `globalFilter` / `newerThan` keys to cover the default fallback operators.
- **`E2E.ts`**: Mock the `getUserProperties()` interface to test `pruneObsoleteProperties()`, `ensureTestData()` (reusing existing batches, caching metadata), and trigger errors in pruning to test catch blocks.
- **`ExprEvaluator.ts`**: Pass a mock value that causes `executeFilter("join")` to return `undefined`, exercising the `|| defaultValue` fallback.
- **`ExprFilter.ts`**: Pass a malformed date offset duration string to `offsetDate` and verify it throws the date offset parsing error.
- **`ParseDuration.ts`**: Call `parseDuration` with a malformed value that fails `parseFloat` parsing (yielding `NaN`) to return `null`.
- **`BaseProcessor.ts`**: Trigger a non-matching RegExp in `buildRegExpSubstitutionMap()` to exercise the branch where `hasAtLeastOneMatch` is false.
- **`ThreadProcessor.ts`**: Execute `processConfigs()` with a config that specifies `messages` and verify message configuration processing is triggered, and test orderRules for ID and first message subject ordering.
- **`MessageProcessor.ts`**: Trigger the error and no-match branches of message processing.
- **`AttachmentProcessor.ts`**: Call `buildMetaInfo()` and verify the metadata fields (e.g. `attachment.index`) are properly set.
- **`GmailProcessor.ts`**: Call `setupActionRegistry` with and without a custom action registry parameter.
- **`Logger.ts`**: Call `redactJsonSecrets` with a falsy value (null/undefined/empty string) and assert that it returns `""`.

## Risks / Trade-offs

- **Risk [Mock Pollution]**: Modifying global mock objects (e.g. in `MockFactory`) could cause unrelated tests to fail if state is not reset.
  - _Mitigation:_ Ensure mocks are cleaned before and after tests (using `jest.clearAllMocks()` and restoring functions where necessary).
- **Risk [Slow Runs]**: Running full coverage checks can slow down pre-commit loops.
  - _Mitigation:_ We already have `npm run all:pre-commit:fast` which runs without documentation updates, keeping test runtime low.
