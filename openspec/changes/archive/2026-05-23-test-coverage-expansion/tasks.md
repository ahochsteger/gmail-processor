## 1. Enable Global Coverage Enforcement

- [x] 1.1 Update global coverage thresholds to 95% (statements/functions/lines) and 90% (branches) in `jest.config.js`.

## 2. Actions Coverage Expansion

- [x] 2.1 Test duplicate ActionProvider registration and `getActionProviders()` in `src/lib/actions/ActionRegistry.spec.ts`.
- [x] 2.2 Test `noop()` logic in `src/lib/actions/MessageActions.spec.ts`.
- [x] 2.3 Test `noop()` logic in `src/lib/actions/ThreadActions.spec.ts`.

## 3. Adapters Coverage Expansion

- [x] 3.1 Test fallback strategy warning for invalid `ConflictStrategy` in `src/lib/adapter/GDriveAdapter.spec.ts`.
- [x] 3.2 Test empty/falsy labelName error path of `threadAddLabel()` in `src/lib/adapter/GmailAdapter.spec.ts`.
- [x] 3.3 Test warn log catch block in `createLogSheet()` when `openById()` fails in `src/lib/adapter/SpreadsheetAdapter.spec.ts`.
- [x] 3.4 Test custom field value extraction when `ctxValues[ctx.type]` is defined in `src/lib/adapter/LogAdapter.spec.ts`.

## 4. Config and Converter Coverage Expansion

- [x] 4.1 Test `configToJson()` with `withDefaults = false` in `src/lib/config/Config.spec.ts`.
- [x] 4.2 Test fallback paths when `globalFilter` and `newerThan` are missing from V1 configs in `src/lib/config/v1/V1ToV2Converter.spec.ts`.

## 5. Expression Evaluator and Filter Coverage Expansion

- [x] 5.1 Test `ExprEvaluator` object-to-string join fallback returning default value in `src/lib/expr/ExprEvaluator.spec.ts`.
- [x] 5.2 Test `offsetDate` duration parsing error catch in `src/lib/expr/ExprFilter.spec.ts`.
- [x] 5.3 Test `parseDuration` returning `null` on `parseFloat` NaN in `src/lib/expr/ParseDuration.spec.ts`.

## 6. Processors Coverage Expansion

- [x] 6.1 Test `BaseProcessor.buildRegExpSubstitutionMap()` non-matching RegExp in `src/lib/processors/BaseProcessor.spec.ts`.
- [x] 6.2 Test `ThreadProcessor` ordering rules and `processConfigs()` with message configs in `src/lib/processors/ThreadProcessor.spec.ts`.
- [x] 6.3 Test `MessageProcessor` error and non-matching query branches in `src/lib/processors/MessageProcessor.spec.ts`.
- [x] 6.4 Test `AttachmentProcessor` `buildMetaInfo()` index field values in `src/lib/processors/AttachmentProcessor.spec.ts`.
- [x] 6.5 Test `GmailProcessor.setupActionRegistry()` with custom ActionRegistry parameter in `src/lib/processors/GmailProcessor.spec.ts`.

## 7. E2E and Utilities Coverage Expansion

- [x] 7.1 Test `E2E.ensureTestData()`, `pruneObsoleteProperties()`, and `resetTests()` in `src/lib/e2e/E2E.spec.ts`.
- [x] 7.2 Test `Logger.redactJsonSecrets()` with null/undefined values in `src/lib/utils/Logger.spec.ts`.

## 8. Verification

- [x] 8.1 Run `npm run test:jest` to verify 95% global / 90% branch test coverage across all library files.
- [x] 8.2 Run `npm run all:pre-commit` to verify build and lint status.
