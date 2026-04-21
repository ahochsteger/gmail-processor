# Commit Message Skill

Generate a compliant commit message from staged changes based on the project's standards.

## Commands

- `/commit-message`: Generate a commit message for the currently staged changes.

## Objective

To provide a consistent, high-quality, and compliant commit message following the [Conventional Commits](https://www.conventionalcommits.org/) specification and project-specific trailers.

## Instructions

1.  **Retrieve Changes**: Run `git diff --cached` to analyze the changes currently staged for commit.
2.  **Analyze Intent**:
    - Identify the primary type of change (`feat`, `fix`, `docs`, `chore`, etc.).
    - Determine the scope if applicable (e.g., `processor`, `config`, `deps`).
    - Extract key details for the body and breaking changes if any.
3.  **Draft Message**:
    - **Header**: `<type>(<scope>): <description>` (max 50-72 chars).
    - **Body**: Detailed explanation of the changes (if needed).
    - **Footer**: Breaking changes or issue references.
4.  **Append Required Trailers**:
    - `AI-Assisted: true`
    - `AI-Tool: Antigravity`
5.  **Output**: Return the final commit message in a fenced code block for easy copying.

## Example Output

```text
feat(attachment): add support for inline image extraction

The new extraction logic handles 'multipart/related' messages correctly.

AI-Assisted: true
AI-Tool: Antigravity
```
