## MODIFIED Requirements

### Requirement: Security Audit CI Step

The Security Audit CI step SHALL perform dependency auditing without blocking the build pipeline on dev-dependency advisories.

#### Scenario: Running Security Audit in CI

- **WHEN** the `Audit Security` CI step executes in GitHub Actions
- **THEN** it executes `npm run all:audit-security` with non-blocking error handling (`continue-on-error: true`), logging advisories in the build output while allowing subsequent test and build steps to complete.
