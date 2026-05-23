# Proposal: Spreadsheet AI Integration

## Why

AI metadata extraction requires specifying schemas (what fields to extract) and target log columns. Writing these schemas in JSON is verbose and complex. Integrating the spreadsheet config with Gemini actions allows users to define AI schemas and logging columns easily using flat tables.

## What Changes

- Extend `SpreadsheetConfigProvider` to parse the `AI_Extraction` and `Document_Types` tabs in the configuration spreadsheet.
- Automatically construct Gemini `responseSchema` payloads at runtime based on the spreadsheet field definitions.
- Configure `SpreadsheetAdapter` to dynamically map extracted JSON properties to specific columns in the activity log sheet.

## Capabilities

### New Capabilities

_(None)_

### Modified Capabilities

- `spreadsheet-config`: Integrates sheet-based schema parsing for AI fields.
- `gemini-actions`: Binds Gemini actions dynamically to spreadsheet-defined schemas.

## Impact

- **Modules**: `src/lib/config/`, `src/lib/adapter/SpreadsheetAdapter.ts`.
- **Dependencies**: Requires `spreadsheet-config` and `gemini-actions` specifications to be present in the main specs.
