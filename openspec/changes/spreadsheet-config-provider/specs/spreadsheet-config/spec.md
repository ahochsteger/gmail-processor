# Spreadsheet Configuration Specification

## Purpose
Specifies the requirements for reading and parsing rule configurations and environment settings directly from a Google Sheet.

## Requirements

## ADDED Requirements

### Requirement: Parse Spreadsheet Configuration
The SpreadsheetConfigProvider SHALL parse settings from a "Settings" sheet (Key-Value pairs) and rules from a "Rules" sheet (flat table row mapping).

#### Scenario: Parse and Load Settings
- **WHEN** `GmailProcessor.runWithSpreadsheet(spreadsheetId)` is called
- **THEN** it must successfully query the Sheet data, construct a valid Config JSON, and run the processor pipeline.

### Requirement: Bidirectional Configuration Conversion
The SpreadsheetConfigProvider SHALL support converting from a valid JSON `Config` object into a flat Spreadsheet structure and vice-versa.

#### Scenario: Export JSON to Google Sheets
- **WHEN** the user exports a hierarchical JSON config to a target Google Sheet
- **THEN** it must write corresponding settings to the "Settings" sheet, generate flat rows in the "Rules" sheet (repeating query columns for nested items where necessary), and raise an warning/notice for non-serializable property types.

