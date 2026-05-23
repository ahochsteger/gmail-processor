# Gemini AI Actions Specification

## Purpose

Specifies modified requirements for Gemini actions to support dynamic dynamic schemas.

## Requirements

## MODIFIED Requirements

### Requirement: Gemini AI Metadata Extraction

The processor SHALL support dynamic schemas derived from the spreadsheet rule definitions.

#### Scenario: Extract Structured JSON

- **WHEN** `attachment.extractWithAI` is run on spreadsheet-defined rules
- **THEN** it must dynamically construct the Gemini request body with the matching Zod schema rules.
