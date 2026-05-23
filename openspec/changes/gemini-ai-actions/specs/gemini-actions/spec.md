# Gemini AI Actions Specification

## Purpose

Specifies the requirements for AI-powered document classification, data extraction, custom Google Drive property writes, and execution lock boundaries.

## Requirements

## ADDED Requirements

### Requirement: Gemini AI Metadata Extraction

The processor SHALL support extracting structured JSON payloads from attachments and email text using the Gemini REST API via GAS `UrlFetchApp`.

#### Scenario: Extract Structured JSON

- **WHEN** `attachment.extractWithAI` is triggered with an expected response schema
- **THEN** it must retrieve the structured JSON and store it in the `actionMeta` map.

### Requirement: Write Custom GDrive Properties

The `attachment.store` action SHALL write extracted metadata fields directly as custom file properties on stored Google Drive files.

#### Scenario: Verify Custom Properties

- **WHEN** a file is saved via `attachment.store` with custom property metadata
- **THEN** it must invoke the Drive API to set the metadata attributes on the file object.
