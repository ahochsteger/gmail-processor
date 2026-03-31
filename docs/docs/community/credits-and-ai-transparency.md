---
id: credits-and-ai-transparency
title: Credits and AI Transparency
---

# Credits and AI Transparency

We value community involvement and aim to be transparent about the development process of Gmail Processor.

## Proper Attribution of Community Contributions

Community involvement is more important than the final code. We ensure contributions are mentioned in PRs and release notes.

1. **Commit Message Trailers:** Use the `Co-authored-by:` trailer to credit the person who provided the idea or initial code.
    ```text
    Co-authored-by: Name <name@example.com>
    ```
2. **Issue/PR References:** Mention the issue (e.g., `closes #123`) to automate release notes via `release-please`.
3. **All-Contributors:** We use the [all-contributors](https://allcontributors.org/) spec.
    ```bash
    @all-contributors please add @username for ideas, code, bug
    ```

---

## Transparent AI-Assisted Development

In alignment with the 2026 EU AI Act and security best practices, we disclose AI involvement to ensure accountability and auditability. The human remains responsible for all code changes.

### Standardized AI Metadata (Trailers)

To allow for automated auditing and security tracking, use the following git trailers in your commit messages:

| Trailer | Required | Description |
| :--- | :--- | :--- |
| `AI-Assisted:` | **Yes** | Set to `true` if AI was used for logic or generation. |
| `AI-Tool:` | Optional | The tool used (e.g., `Claude-Code`, `Copilot`, `Aider`). |
| `AI-Model:` | Optional | The specific model version used for the task. |

**Example Commit Message:**
```text
feat: add automatic label retry logic

Implementing a backoff strategy for Gmail API rate limits.
Checked for side effects in the processor loop.

AI-Assisted: true
AI-Tool: Claude Code
AI-Model: claude-3-5-sonnet-20241022
```
