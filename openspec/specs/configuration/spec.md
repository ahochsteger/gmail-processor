# Configuration & Validation Specification

## Purpose
This specification documents the configuration schemas, validation pipeline, JSON schema generation, and the roadmap for deprecated configuration properties.

## Requirements

### Requirement: Native JSON Schema Generation
The JSON schema (`config-schema-v2.json`) SHALL be derived programmatically from the Zod schemas using `zod-to-json-schema`.

#### Scenario: Schema Updates
- **WHEN** any typescript-based config schemas in `src/lib/config/` are updated
- **THEN** the developer must run the synchronization scripts to regenerate the JSON schema and update the documentation.

### Requirement: Documentation via JSDoc Comments
All action config properties defined in `src/lib/config/ActionConfigTypes.ts` SHALL have comprehensive JSDoc `/** */` comments.

#### Scenario: Docs Generation
- **WHEN** the documentation build script is run
- **THEN** it must parse the JSDoc comments to generate `actions.mdx` without losing any descriptions or annotations.

### Requirement: Google Apps Script Project Settings for Timezone
Timezone settings SHALL NOT be managed at the library config level. They should be configured via the GAS environment (`appscript.json`).

#### Scenario: Config Parsing with Timezone
- **WHEN** a configuration with a legacy `timezone` property is processed
- **THEN** a deprecation warning must be logged, and date parsing must fallback to the system/GAS timezone environment settings.
