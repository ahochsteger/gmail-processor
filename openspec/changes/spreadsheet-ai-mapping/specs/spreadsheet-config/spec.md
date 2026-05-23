# Spreadsheet Configuration Specification

## Purpose
Specifies modified requirements for configuration parsing to integrate AI field and log column mapping.

## Requirements

## MODIFIED Requirements

### Requirement: Parse Spreadsheet Configuration
The SpreadsheetConfigProvider SHALL parse settings from the "Settings" sheet, rules from the "Rules" sheet, and AI fields from the "AI_Extraction" sheet.

#### Scenario: Parse and Load Settings
- **WHEN** `GmailProcessor.runWithSpreadsheet` is called with AI extraction rules
- **THEN** it must build dynamic Gemini prompt schemas and target log mapping.
