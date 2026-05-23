# Actions & Providers Specification

## Purpose

This specification documents the action registry, action provider implementation patterns, runtime execution modes, and safety guidelines for handling action arguments.

## Requirements

### Requirement: Scoped Action Decorators

Actions SHALL be decorated to specify their runtime impact: `@readingAction()`, `@writingAction()`, or `@destructiveAction()`.

#### Scenario: Dry-Run Action Gating

- **WHEN** the engine runs in DRY_RUN mode and attempts to execute a `@writingAction` or `@destructiveAction`
- **THEN** execution of the action body must be intercepted and prevented, returning a simulated success result instead.

#### Scenario: Dangerous Action Protection

- **WHEN** a `@destructiveAction` is triggered
- **THEN** it must only execute if the environment run-mode is explicitly set to `DANGEROUS`.

### Requirement: Default Empty Arguments

All action arguments SHALL default to an empty object `{}` when not explicitly defined in the rule configuration.

#### Scenario: Fallback Context Generation

- **WHEN** the action configuration does not provide an `args` block
- **THEN** the parsing engine or execution wrapper must supply `{}` to the action provider instead of passing `undefined`.
