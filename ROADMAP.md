# Gmail Processor Phased Roadmap

This roadmap organizes all planned work into a logical sequence of phases, prioritized by **risk reduction**, **developer experience**, and **user impact**. Each item links back to its source (TODO.md or GitHub issue) for traceability.

## Guiding Principles

1. **Stability first**: Fix bugs and reduce architectural risk before adding features.
2. **Unlock before build**: Architectural refactoring (circular deps, Zod migration) must happen before features that depend on a clean type system.
3. **GAS compatibility**: All changes must work within the Google Apps Script V8 runtime (ES2019, synchronous by default, `UrlFetchApp` for HTTP).
4. **Incremental delivery**: Each phase delivers independently shippable improvements.

---

## Phase 1: Bug Fixes, Testing & Developer Experience

*Goal: Eliminate known bugs, improve contributor onboarding, and reduce friction in the development loop.*

> [!IMPORTANT]
> This phase has the highest ROI — low risk, low effort, and immediate trust improvement for users and contributors.

### Bug Fixes

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **Attachment Action Exception** — Fix unnamed-group crash in `extractText` when using named regex groups in `extract` arg | TODO | Users hit a cryptic exception with no details. Breaks real-world OCR extraction workflows (see closed #260). |
| **Config Validation** — Catch undefined enum constants in GAS config (e.g., `UNKNOWN_ENUM` silently becomes `null`) | TODO | Silent misconfiguration is dangerous for a library that performs destructive actions like file overwrites and message deletion. |
| **Logsheet Caching** — Fix intermittent "Document is missing" errors during logSheet creation in GAS | TODO | Affects users with logSheet-heavy configurations (e.g., the `logSheetLogging` example). Likely a race condition in spreadsheet API calls. |

### Testing & Developer Experience

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **Consolidate Mocks** — Reuse `EnvProvider` initialization code in `MockFactory` instead of duplicating it | TODO | Reduces maintenance burden when `EnvInfo` changes (it has 13 fields). |
| **Gmail App Mock Data** — Provide structured Gmail mock data mirroring the existing GDrive mock pattern | TODO | Lowers the barrier for writing new tests and examples. |
| **Test Speed** — Reuse generated mocks via `beforeAll` where state isolation permits | TODO | Faster test feedback loop encourages contribution. Requires careful audit of test isolation. |
| **Getting Started Docs** — Add a minimal working configuration to README.md | TODO | First-time users currently have to navigate to the Docusaurus site to find a working example. A 10-line snippet in the README dramatically reduces time-to-value. |

### Quick Maintenance Wins

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **Task Naming** — Rename npm scripts to use `:` separator convention consistently | TODO | Many scripts already use `:` (e.g., `build:lib`), but some don't (e.g., `lint-fix`, `lint-code`). Consistency improves discoverability. |
| **Directory Structure** — Align `tsconfig.json` path configuration with TypeScript best practices | TODO | Reduces confusion for new contributors and improves IDE integration. |

---

## Phase 2: Architectural Refactoring

*Goal: Break circular dependencies and eliminate `class-transformer` to unlock future feature development.*

> [!WARNING]
> This is the highest-risk phase. Each item is a cross-cutting change that touches most files. Recommend an ADR (Architecture Decision Record) before starting each item.

### Circular Dependency Resolution

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **Break the Context ↔ ActionConfig cycle** — Currently `Context.ts` imports config types and `ActionConfig.ts` imports context types, creating 39 circular dependency chains detected via `madge`. See [CIRCULAR_DEPS.md](file:///home/a13870/private/ws/github/ahochsteger/gmail-processor/CIRCULAR_DEPS.md) for root cycles and resolution strategies. | TODO | Circular deps cause unpredictable import ordering, make tree-shaking impossible, and create subtle bugs during bundling with Rollup. This is the #1 architectural blocker. |
| **Context Refactoring** — Pass configs explicitly to processor functions instead of embedding them in the context hierarchy (`ThreadInfo.config`, `MessageInfo.config`, etc.) | TODO | `ThreadInfo`, `MessageInfo`, and `AttachmentInfo` each store their full config object, which forces the context types to import all config types. Decoupling these eliminates the primary circular dependency source. |

### Schema & Validation Migration

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **Zod Migration (#520)** — Replace `class-transformer` + `reflect-metadata` with Zod schemas for config validation, defaults, and type coercion | [#520](https://github.com/ahochsteger/gmail-processor/issues/520) | `class-transformer` hasn't been released since Nov 2021, has unresolved bugs (#1609, #1505), and requires experimental decorator metadata. Zod provides runtime validation, defaults handling, and can generate JSON Schema — solving three problems at once. |
| **JSON Schema Generation** — Generate `config-schema-v2.json` directly from Zod schemas | TODO | Currently generated from TypeScript types via `typescript-json-schema`. Generating from Zod schemas is more reliable and can include default values. |

### Code Quality

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **Method Visibility** — Audit public API surface and reduce visibility of internal methods | TODO | Several `BaseProcessor` methods (`effectiveCSV`, `effectiveValue`, etc.) are `protected static` but could be `private`. Reducing surface area prevents accidental coupling. |
| **PatternUtil Refinement** — Make `PatternUtil` fully context-aware and simplify its substitution logic | TODO | `PatternUtil.substitute()` is used throughout all actions and is a critical hot path. Simplifying it makes debugging substitution failures easier for users. |

---

## Phase 3: Feature Enhancements & AI Integration

*Goal: Deliver high-impact user-facing features, including AI-powered data extraction.*

> [!NOTE]
> Phase 3 items depend on a clean action/context architecture from Phase 2. The `actionMeta` mechanism (already used by `attachment.extractText`) is the foundation for action chaining and AI result injection.

### Action Pipeline Improvements

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **Action Result Storage** — Formalize the pattern of storing action results in context for use by subsequent actions | TODO | The `actionMeta` pattern already exists (see `AttachmentActions.extractText` at line 57) but isn't documented or generalized. Users need this for workflows like: extract data → use in filename → store file. Issue #531 shows a user struggling with exactly this gap. |
| **Custom Action Documentation (#540)** — Update examples to demonstrate `actionMeta` usage in custom actions | [#540](https://github.com/ahochsteger/gmail-processor/issues/540) | Directly addresses user confusion in #531. A working example showing `newMetaInfo()` in custom actions would unlock power-user workflows. |
| **Boolean Substitutions** — Support conditional expressions like `${thread.isImportant?'important':'not-important'}` | TODO | Enables dynamic path construction without custom actions. Extends the ANTLR4 expression grammar. |
| **Move `storeFromURL` to Global Action** — Currently lives in `MessageActions` but conceptually works at any context level | TODO | Any context that has `UrlFetchApp` can fetch URLs. Moving it to `GlobalActions` makes it available in thread/attachment processing stages too. |

### Data Extraction

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **XPath Extraction** — Extract structured data from HTML email bodies using XPath | TODO | Email bodies often contain structured HTML (invoices, receipts, notifications). Regex is brittle for HTML; XPath is purpose-built. GAS has `XmlService` that can parse well-formed XML/HTML. |
| **PDF Text Extraction** — Extract text from PDF attachments with language auto-detection and named group extraction | TODO | Builds on the existing `attachment.extractText` OCR action. Users need to extract invoice numbers, dates, amounts from PDFs (see closed #260). |

### AI Integration

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **AI-Powered Data Extraction** — New action (e.g., `message.extractWithAI` / `attachment.extractWithAI`) that sends content to an LLM and injects structured results into the context via `actionMeta` | TODO | GAS has `UrlFetchApp` which can call the Gemini REST API directly. Users can already do this via custom actions, but a first-party action would handle prompt templating, response parsing, error handling, and rate limiting. This transforms Gmail Processor from a rule-based tool into an intelligent data pipeline. |
| **AI-Based Categorization & Summarization** — Use LLMs to classify, tag, or summarize threads/messages based on content | TODO | Natural extension of the extraction action. Users could auto-label threads by topic, generate summaries for logsheet entries, or route messages based on AI-determined intent. The `actionMeta` pattern enables downstream actions to consume AI outputs. |

### Date Expression Enhancements

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **`parse("<format>")` as date expression** — Replace the `date-parse` modifier with a cleaner expression syntax | TODO | Aligns date parsing with the existing expression grammar. |
| **`format("<format>")` as date expression** — Replace modifier-based formatting with an explicit function call | TODO | Improves readability: `${message.date:date:format('yyyy-MM-dd')}` vs the current modifier chain. |
| **Support `date` as placeholder type** — Allow strings and numbers as date input, not just native date objects | TODO | Enables users to parse date strings extracted from email bodies or PDF OCR results. |

---

## Phase 4: Infrastructure & Long-term Modernization

*Goal: Improve CI/CD, formalize project governance, and position for future growth.*

### Infrastructure

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **Docs Build Decoupling (#526)** — Use pre-built parent project as dependency for the Docusaurus docs build | [#526](https://github.com/ahochsteger/gmail-processor/issues/526) | Currently docs directly include source files, causing tight coupling and preventing faster Docusaurus builds. Decoupling enables independent docs iteration. |
| **Renovate Merge Queues** — Enable GitHub merge queues for automated dependency updates | TODO | Prevents Renovate PRs from conflicting with each other and reduces manual merge coordination. |
| **CI Parallelization** — Run SonarQube and Coveralls analysis in parallel, gate on release only | TODO | Reduces CI feedback time for contributors without compromising release quality. |
| **Release Automation** — Include GAS library version numbers in generated changelogs automatically | TODO | Users deploying via GAS need to know which GAS version corresponds to which npm release. |

### Documentation & Governance

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **JSDoc Coverage** — Add JSDoc to all public functions and types | TODO | Enables better IDE support and TypeDoc-generated reference docs. |
| **Architecture Decision Records** — Maintain ADRs for significant decisions (Zod migration, AI integration, async strategy) | TODO | Preserves decision rationale for future contributors and prevents re-litigating resolved design choices. |
| **Branding Review** — Legal review of "Gmail Processor" name vs "Mail Processor" | TODO | "Gmail" is a Google trademark. This needs legal assessment before any major marketing push. Lower urgency but important for long-term sustainability. |

### Future Architecture (Research Phase)

| Item | Source | Rationale |
| :--- | :--- | :--- |
| **Async Execution Model** — Evaluate feasibility of async processing within GAS constraints | TODO | GAS V8 supports `async/await` but with significant caveats (6-minute execution limit, no background workers). The library already has `Promise`-based handling for `storeDecryptedPdf`. A full async migration needs careful scoping — it may be limited to I/O-heavy actions (AI calls, URL fetches) rather than the entire processing pipeline. |
| **Processed Entity Recording** — Record detailed metadata of processed entities, not just counts | TODO | `ProcessingResult` currently tracks counts (`processedThreads`, `processedMessages`). Recording entity details (IDs, subjects, actions taken) enables audit trails and post-processing reports. May require careful memory management for large mailboxes. |

---

## Risk & Impact Matrix

| Item | Effort | Risk | User Impact | Developer Impact |
| :--- | :--- | :--- | :--- | :--- |
| **Bug Fixes (Phase 1)** | Low | Low | High — Trust | Low |
| **Getting Started Docs** | Low | Low | Very High — Onboarding | Low |
| **Circular Dependencies** | High | Medium | Medium — Indirect | Very High — Maintainability |
| **Zod Migration (#520)** | Very High | High | Medium — Indirect | Very High — Eliminates tech debt |
| **Action Result Storage** | Medium | Low | Very High — Power users | Medium |
| **Custom Action Docs (#540)** | Low | Low | High — Unlocks existing capability | Low |
| **AI Data Extraction** | Medium | Medium | Very High — New capability | Medium |
| **AI Categorization** | Medium | Medium | High — Automation quality | Medium |
| **Async Transition** | Very High | High | Low — GAS constraints limit impact | High — Codebase modernization |
| **Docs Build Decoupling (#526)** | Medium | Low | Low — Indirect | High — Build speed |

## Open Issues Reference

| Issue | Title | Phase | Status |
| :--- | :--- | :--- | :--- |
| [#520](https://github.com/ahochsteger/gmail-processor/issues/520) | Replace class-transformer with Zod | Phase 2 | Open |
| [#526](https://github.com/ahochsteger/gmail-processor/issues/526) | Docs build decoupling | Phase 4 | Open |
| [#531](https://github.com/ahochsteger/gmail-processor/issues/531) | Custom actions question | Phase 3 (via #540) | Open |
| [#540](https://github.com/ahochsteger/gmail-processor/issues/540) | Custom action example with actionMeta | Phase 3 | Open |
| [#232](https://github.com/ahochsteger/gmail-processor/issues/232) | Dependency Dashboard (Renovate) | Ongoing | Open |
