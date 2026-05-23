# Proposal: Gemini AI Actions

## Why
Automating GMail attachments and messages often requires semantic understanding (e.g., classifying a message, naming an invoice according to its content, or extracting specific metadata fields). Introducing first-party Gemini API actions enables intelligent automation directly within Gmail Processor.

## What Changes
- Implement a Gemini REST API client wrapper using Google Apps Script's native `UrlFetchApp`.
- Create actions `attachment.extractWithAI` and `message.classifyWithAI`.
- Support structured JSON output from Gemini using the model's native `responseSchema` options.
- Integrate metadata fields returned by Gemini into the processing context `actionMeta` map.
- Support writing extracted metadata as custom Google Drive file properties during the `attachment.store` action.
- Implement MD5 byte hash checks and semantic fingerprint checks inside `GDriveAdapter` to prevent duplicate files.
- Protect execution using script locks and time-buffered checks to prevent GAS execution timeouts.

## Capabilities

### New Capabilities
- `gemini-actions`: Adds Gemini-powered classification, metadata extraction, and GDrive custom property storage to Gmail Processor.

### Modified Capabilities
- `test-coverage`: Adds new unit tests for the Gemini REST client and AI action providers to satisfy the 100% coverage quality gate.

## Impact
- **Modules**: `src/lib/actions/`, `src/lib/adapter/GDriveAdapter.ts`, `src/lib/processors/BaseProcessor.ts`.
- **Secrets**: Requires a `GEMINI_API_KEY` script property.
