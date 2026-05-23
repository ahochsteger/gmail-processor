# Proposal: Spreadsheet Configuration Provider

## Why

Writing JSON or YAML configuration inside the Google Apps Script IDE is highly error-prone and daunting for non-technical users. A spreadsheet-based configuration interface will provide a low barrier of entry for defining rules and settings.

## What Changes

- Introduce `SpreadsheetConfigProvider` to load configuration rules and settings from Google Sheets.
- Parse a flat tabular rule structure into the hierarchical context structure required by Gmail Processor.
- Support bidirectional conversion between JSON and Spreadsheet configurations (JSON-to-Sheet and Sheet-to-JSON).
- Integrate the parsed output into the existing Zod validation pipeline (`ConfigSchema.parse()`).
- Add an entry point `GmailProcessor.runWithSpreadsheet(spreadsheetId)`.

## Capabilities

### New Capabilities

- `spreadsheet-config`: Allows configuring Gmail Processor rules and settings via Google Sheets.

### Modified Capabilities

- `test-coverage`: Adds new unit tests to satisfy the 100% coverage quality gate.

## Impact

- **Modules**: `src/lib/config/`, `src/lib/processors/GmailProcessor.ts`.
- **Dependencies**: None.

## Limitations of Bidirectional Conversion

- **Nesting Hierarchy Loss**: Converting a highly complex, deeply nested JSON config (e.g., multiple different message filters under a single thread, or multiple attachment actions per attachment rule) into a flat row model may result in repeated rows with duplicate thread queries.
- **Non-Standard Types**: JavaScript function expressions or custom validation callbacks configured via API code cannot be fully serialized into spreadsheet cells. Only standard strings, numbers, booleans, and JSON strings are supported in Sheet cells.
