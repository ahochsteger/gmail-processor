# Gemini AI Actions Specification

## Purpose

Specifies modified requirements to add draft response and summarization features.

## Requirements

## MODIFIED Requirements

### Requirement: Gemini AI Email Assistant

The Gemini actions SHALL support drafting context-aware email replies and generating thread digests.

#### Scenario: Create draft replies and summaries

- **WHEN** `message.draftReplyWithAI` is triggered
- **THEN** it must create a draft message in the user's GMail account for review.
