# Contributing

<!-- See
 * https://github.com/github/docs/blob/main/CONTRIBUTING.md
 * https://mozillascience.github.io/working-open-workshop/contributing/
-->

Thank you for investing your time in contributing to our project!

Read our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

## New contributor guide

To get an overview of the project, read the [README](https://github.com/ahochsteger/gmail-processor/blob/main/README.md). Here are some resources to help you get started with open source contributions:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)

## Getting started

You can contribute to the project in several ways:

### Issues

#### Create a new issue

If you spot a problem, [search if an issue already exists](https://github.com/ahochsteger/gmail-processor/issues). If a related issue doesn't exist, you can open a new issue using a relevant [issue form](https://github.com/ahochsteger/gmail-processor/issues/new/choose).

#### Solve an issue

Scan through our [existing issues](https://github.com/ahochsteger/gmail-processor/issues) to find one that interests you. You can narrow down the search using `labels` as filters. See [How to use Labels](#how-to-use-labels) for more information. As a general rule, we don’t assign issues to anyone. If you find an issue to work on, you are welcome to open a PR with a fix.

#### How to use Labels

Labels can help you find an issue you'd like to help with.

- The [`help wanted` label](https://github.com/ahochsteger/gmail-processor/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) is for problems or updates that anyone in the community can start working on.
- The [`good first issue` label](https://github.com/ahochsteger/gmail-processor/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) is for problems or updates we think are ideal for beginners.
- The [`bug` label](https://github.com/ahochsteger/gmail-processor/issues?q=is%3Aopen+is%3Aissue+label%3Abug) is for bugs or problems. These will usually require some knowledge of TypeScript to fix.
- The [`enhancement` label](https://github.com/ahochsteger/gmail-processor/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement) is for improvements of existing functionality. These will usually require some knowledge of TypeScript to implement.
- The [`feature` label](https://github.com/ahochsteger/gmail-processor/issues?q=is%3Aopen+is%3Aissue+label%3Afeature) is for feature suggestions. These will usually require some knowledge of TypeScript to implement.
- The [`question` label](https://github.com/ahochsteger/gmail-processor/issues?q=is%3Aopen+is%3Aissue+label%3Aquestion) is for questions about the project. These will usually require some knowledge on how to use the project but not necessarily implementation know-how.

### Make Changes

1. [Fork the repository](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo#fork-an-example-repository) so that you can make your changes without affecting the original project until you're ready to merge them.
2. Install or update to **Node.js** to the [latest LTS release](https://nodejs.dev/en/about/releases/) or see the specified node engine version in [package.json](https://github.com/ahochsteger/gmail-processor/blob/main/package.json). For more information, see [Development Guidelines](#development-guide).
3. Create a working branch and start with your changes!

### Commit your update

Commit the changes once you are happy with them. Don't forget to do a self-review of the PR to speed up the review process:zap:.

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

| Type       | When to use                                            |
| ---------- | ------------------------------------------------------ |
| `feat`     | A new feature                                          |
| `fix`      | A bug fix                                              |
| `docs`     | Documentation-only changes                             |
| `style`    | Formatting, missing semicolons, etc. (no logic change) |
| `refactor` | Code change that is neither a fix nor a feature        |
| `perf`     | A performance improvement                              |
| `test`     | Adding or updating tests                               |
| `chore`    | Build process, dependency updates, tooling             |
| `ci`       | CI/CD configuration changes                            |

#### Scope (optional)

Use the affected component as the scope, e.g.:

- `feat(attachment)`, `fix(processor)`, `docs(config)`, `chore(deps)`

#### Examples

```
feat(attachment): add support for inline image extraction
fix(processor): handle empty thread list gracefully
docs: add conventional commits section to CONTRIBUTING.md
chore(deps): update class-transformer to 0.6.0
```

#### Breaking Changes

Append `!` after type/scope and add a `BREAKING CHANGE:` footer:

```
feat(config)!: rename markProcessedMode to markProcessedMethod

BREAKING CHANGE: The config key `markProcessedMode` has been renamed to `markProcessedMethod`.
```

### Pull Request

When you're finished with the changes, create a pull request, also known as a PR.

- Fill the template so that we can review your PR. This template helps reviewers understand your changes as well as the purpose of your pull request.
- Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge.
  Once you submit your PR, a team member will review your proposal. We may ask questions or request additional information.
- We may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) or pull request comments. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://github.com/skills/resolve-merge-conflicts) to help you resolve merge conflicts and other issues.

### Your PR is merged

Congratulations :tada::tada: The project team thanks you :sparkles:.

## Development Guide

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ahochsteger/gmail-processor.git
   cd gmail-processor
   ```

2. **Setup your environment**: Choose one of the following paths:
   - **Option A (Recommended): With [Devbox](https://www.jetify.com/devbox)**
     Ensures a perfectly consistent toolset (Node, Antlr, etc.) via Nix.

     ```bash
     devbox shell
     ```

   - **Option B: Traditional (No Devbox)**
     Ensure you have **Node.js 22+** installed on your system.

3. **Install dependencies**:
   ```bash
   npm run all:reinstall
   ```

---

### Development Flow

See [the steps at Pull Request](#pull-request) for instructions on forking.

```bash
# Follow the Quick Start above to get your environment ready

# Perform changes
code .

# Run pre-commit tasks (clean, build, tests, update docs, etc.)
npm run all:pre-commit
```

The recommended IDE for this project is [Visual Studio Code](https://code.visualstudio.com/), but any other IDEs with support for TypeScript and NPM will do. Make sure to configure the IDE to respect the [Code Style](#code-style) settings.

### Code Style

We use [Prettier](https://prettier.io/) to automatically format our code and ensure a consistent style. It is recommended to [configure your IDE](https://prettier.io/docs/en/editors) to format the code (e.g. on saving) using Prettier.

### Testing Locally

Please add/update the tests for any change to keep the codebase in a well-tested state. For every source file `*.ts` the corresponding test file is named `*.spec.ts` and they are implemented using [Jest](https://jestjs.io/) as the testing framework.
Remote services are mocked (see [MockFactory.ts](https://github.com/ahochsteger/gmail-processor/blob/main/src/test/mocks/MockFactory.ts)) to simplify local testing in isolation.

After the changes and tests are done run the `all:pre-commit` script that validates the changes and updates all generated artifacts (like documentation, examples, JSON schema files, ...) and include all updated files in your commit.

### Automated Reviews & Assistance

To maintain code quality and security, several automated tools assist in the review process:

- **Renovate**: Keeps dependencies up to date. You may see PRs from `renovate[bot]`.
- **Snyk**: Scans for security vulnerabilities. Check the "Security" tab or PR comments for results.
- **SonarSource**: Performs static analysis. It will comment on PRs with identified issues (bugs, smells, etc.).
- **Gemini Code Assist**: An AI assistant that may provide automated feedback or suggestions on your PR to help speed up the review.
- **Jules**: Provides additional AI-powered coding assistance.

Please review any feedback from these tools as they help ensure your contribution follows our standards before a manual review.

### Beta Testing on Google Apps Script

Use the following Script ID in combination with the version `HEAD` to test and give feedback before changes are released:

`1yhOQyl_xWtnGJn_bzlL7oA4d_q5KoMyZyWIqXDJX1SY7bi22_lpjMiQK`

### Development Resources

A list of tools, libraries and frameworks that are used for development:

- [NPM - Node Package Manager](https://docs.npmjs.com/about-npm): For package management and building
- [Clasp](https://github.com/google/clasp): For deploying the library and examples to Google Apps Script
- [TypeScript](https://www.typescriptlang.org/): The language used for developing the library
- [Jest](https://jestjs.io/): For test automation
- [webpack](https://webpack.js.org/): For packaging the library
- [release-please](https://github.com/googleapis/release-please): For release automation and changelog management
- [Gemini Flash](https://aistudio.google.com/app/prompts/new): For generating AI-enhanced release summaries

### Release Automation

We use an AI-enhanced release process (powered by `release-please` and a custom release manager) to create engaging and informative release notes.

- **Auto-Publishing Patch Updates**: If a release only contains patch updates (e.g., `v2.18.1`), it is automatically published immediately as it typically consists of solely bug fixes and dependency updates.
- **Drafting Minor & Major Updates**: Minor and Major releases (e.g., `v2.18.0` or `v3.0.0`) are created as **Draft Releases**, securely gated behind manual maintainer approval.
- **High-Fidelity Summaries**: Every release includes a human-friendly summary generated by Gemini, focusing on technical transparency and community impact.
- **Community Credits**: The system automatically recognizes and links all contributors (including co-authors) in the release notes.
- **Dependency Transparency**: Updates are automatically labeled with their impact (Major/Minor/Patch) to help users understand technical changes.
- **Local Preview**: You can preview upcoming release notes (including AI highlights, auto-linking, and GAS library info) by running:
  ```bash
  npm run release:notes
  ```
  The rendered results will be saved to `build/release-notes-preview.md`.
- **Manual Publishing & Announcements**: Once you are ready to publish a drafted Minor or Major release, you can approve it via the GitHub UI.

#### How to Publish Releases (Browser & Mobile)

To quickly publish a pre-staged **Draft Release** (and automatically announce it to the community):

**Via GitHub Mobile App (On Web or On The Go):**

1. Navigate to the `ahochsteger/gmail-processor` repository.
2. Go to **Actions** -> **Release Manager** (Workflow).
3. Click **Run Workflow**.
4. The workflow defaults to the `publish-release` job. You do not even need to specify the exact version tag—leave it blank and it will automatically find and publish the `"latest"` drafted release tag.
5. Click **Run Workflow** to finalize the release.

For a complete list of used technologies have a look at the dependencies in [`package.json`](https://github.com/ahochsteger/gmail-processor/blob/main/package.json)

Helpful resources about development for Google Apps Script:

- [https://github.com/labnol/apps-script-starter](https://github.com/labnol/apps-script-starter)
- [https://github.com/labnol/google-apps-script-awesome-list](https://github.com/labnol/google-apps-script-awesome-list)
- [https://blog.gsmart.in/es6-and-npm-modules-in-google-apps-script/](https://blog.gsmart.in/es6-and-npm-modules-in-google-apps-script/)
- [https://github.com/gsmart-in/AppsCurryStep1](https://github.com/gsmart-in/AppsCurryStep1)
- [https://developers.google.com/apps-script/guides/typescript](https://developers.google.com/apps-script/guides/typescript)
- [https://github.com/google/clasp/blob/master/docs/typescript.md](https://github.com/google/clasp/blob/master/docs/typescript.md)
- [https://github.com/grant/ts2gas](https://github.com/grant/ts2gas)
- [https://blog.filippo.io/gmail-bot-with-apps-script-and-typescript/](https://blog.filippo.io/gmail-bot-with-apps-script-and-typescript/)

---

## Maintenance Guide

The project uses a semantic naming convention for maintenance scripts to ensure they are isolated from standard build lifecycles.

### Total Environment Reset

| Script          | Command                 | Description                                                                                                                    |
| :-------------- | :---------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `all:reinstall` | `npm run all:reinstall` | **Recommended**. Performs a full clean and fresh installation of all components including Node modules and Devbox environment. |

### Lockfile & Dependency Management

| Script                | Namespace           | Description                                                        |
| :-------------------- | :------------------ | :----------------------------------------------------------------- |
| `all:locks-clean`     | `npm:locks:clean:*` | Safely removes all `package-lock.json` and `node_modules` folders. |
| `locks:clean:lib`     | -                   | Specifically cleans the root library dependencies.                 |
| `locks:clean:docs`    | -                   | Specifically cleans the documentation workspace.                   |
| `locks:clean:devbox`  | -                   | Removes the `.devbox` directory and `devbox.lock`.                 |
| `locks:update:devbox` | -                   | Runs `devbox update` to refresh the environment lockfile.          |

### Typical Maintenance Workflow

Follow this procedure when performing periodic dependency updates or fixing security vulnerabilities:

1.  **Baseline**: Ensure your environment is fresh via `npm run all:reinstall`.
2.  **Audit**: Check for outdated packages (`npm run all:packages-outdated`).
3.  **Update**: Modify `package.json` versions or `overrides`.
4.  **Regenerate & Verify**: Run `npm run all:reinstall` and `npm run all:ci`.
5.  **Audit Security**: Run `npm run all:audit-security`.

> [!CAUTION]
> **Documentation Build Sensitivity**: The documentation workspace uses a complex Webpack 5 / Docusaurus 3 setup that is sensitive to `ajv` version conflicts. Always verify the `ci:docs` task specifically after modifying any `ajv` or `schema-utils` related dependencies.
