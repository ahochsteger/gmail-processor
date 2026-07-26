## 1. Package Configuration & Audit Script

- [x] 1.1 Update `all:audit-security` script in `package.json` to target runtime dependencies (`npm audit --omit=dev --audit-level high || true`).

## 2. GitHub Actions Workflow Configuration

- [x] 2.1 Add `continue-on-error: true` to the `audit-security` step in `.github/workflows/ci.yaml`.

## 3. Documentation & Hygiene Updates

- [x] 3.1 Update `all:audit-security` documentation in `AGENTS.md` and `CONTRIBUTING.md`.
- [x] 3.2 Run maintenance synchronization (`npm run all:update`) to update generated docs artifacts.
