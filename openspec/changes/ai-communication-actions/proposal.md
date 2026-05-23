# Proposal: AI Communication Actions

## Why

Intelligent email processing goes beyond data extraction; it should assist users in drafts and digests. Adding auto-responder drafting and thread digests will speed up communication cycles safely.

## What Changes

- Add `message.draftReplyWithAI` to analyze incoming messages and create draft replies in GMail.
- Add `thread.summarizeWithAI` to write bulleted summaries of GMail threads for activity logs or digest emails.
- Ensure strict gating (only creating drafts, never auto-sending) to keep a human-in-the-loop.

## Capabilities

### New Capabilities

_(None)_

### Modified Capabilities

- `gemini-actions`: Adds draft-reply and summarization actions under the Gemini provider.

## Impact

- **Modules**: `src/lib/actions/MessageActions.ts`, `src/lib/actions/ThreadActions.ts`.
- **Dependencies**: Requires `gemini-actions` specification to be present in the main specs.
