# Architecture & Execution Flow Specification

## Purpose

This specification documents the context-aware execution hierarchy, the service adapter layer, strict circular dependency constraints, and Google Apps Script runtime characteristics.

## Requirements

### Requirement: Context Hierarchy Flow

The processing engine SHALL pass data sequentially through the hierarchical contexts: EnvContext -> ProcessingContext -> ThreadContext -> MessageContext -> AttachmentContext.

#### Scenario: Metadata Propagation

- **WHEN** an attachment is processed
- **THEN** it must have access to its parent MessageContext, ThreadContext, ProcessingContext, and EnvContext values.

### Requirement: Fully Isolated GAS Adapters

All external service interactions (GDrive, GMail, Spreadsheets, Logs) SHALL be wrapped behind abstract Adapters to maintain unit-testability and mock isolation.

#### Scenario: Running in Dry-Run Mode

- **WHEN** an adapter method that performs a writing action is invoked in DRY_RUN mode
- **THEN** it must log the simulated operation and bypass the actual GAS API execution.

### Requirement: Compile-Time Type-Only Imports

All imports of interfaces, type definitions, or classes that are used solely for signatures or type annotations SHALL use `import type` to prevent runtime dependency cycles.

#### Scenario: Type Elimination

- **WHEN** the TypeScript code is compiled to JS
- **THEN** type-only imports must be completely erased from the output, ensuring no compile-time circular loops remain.

### Requirement: Static Mock Registry for Test Isolation

Unit test mock objects SHALL be decoupled. Concrete mocks (e.g., GDrive, GMail) must not statically import `MockFactory`, and `MockFactory` must dynamically register references to leaf mocks.

#### Scenario: Dynamic Mock Selection

- **WHEN** mock context is requested during Jest setup
- **THEN** the MockFactory must lazily resolve mock fallbacks using registered references on `ContextMocks.mockFactoryRef` instead of direct static instantiation.

### Requirement: Plain Object Property Preservation

Configuration data passed to GAS SHALL exist as plain JavaScript objects. Static properties and prototype methods on class instances may be lost or behave unexpectedly when serialized.

#### Scenario: Parameter Access

- **WHEN** an action executes within the GAS environment
- **THEN** it must query properties on plain config objects without relying on class helpers or instance prototype checks.
