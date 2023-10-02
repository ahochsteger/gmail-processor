---
sidebar_position: 50
---
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

### Development Flow

See [the steps at Pull Request](#pull-request) for instructions on forking.

```bash
# Pre-requisites: Make sure a recent Node.js LTS version is installed

# Clone the repository and navigate to the project folder
git clone https://github.com/ahochsteger/gmail-processor.git
cd gmail-processor

# Install dependencies
npm install

# Perform changes
code .

# Run pre-commit tasks to make sure the code is in an acceptable state to be commited
# (clean, build, run tests, update docs, do some sanity checks, ...)
npm run pre-commit
```

The recommended IDE for this project is [Visual Studio Code](https://code.visualstudio.com/), but any other IDEs with support for TypeScript and NPM will do. Make sure to configure the IDE to respect the [Code Style](#code-style) settings.

### Testing

Please add/update the tests for any change to keep the codebase in a well-tested state. For every source file `*.ts` the corresponding test file is named `*.spec.ts` and they are implemented using [Jest](https://jestjs.io/) as the testing framework.
Remote services are mocked (see [MockFactory.ts](https://github.com/ahochsteger/gmail-processor/blob/main/src/test/mocks/MockFactory.ts)) to simplify local testing in isolation.

After the changes and tests are done run the `pre-commit` script that validates the changes and updates all generated artifacts (like documentation, examples, JSON schema files, ...) and include all updated files in your commit.

### Code Style

We use [Prettier](https://prettier.io/) to automatically format our code and ensure a consistent style. It is recommended to [configure your IDE](https://prettier.io/docs/en/editors) to format the code (e.g. on saving) using Prettier.

### Development Resources

A list of tools, libraries and frameworks that are used for development:

- [NPM - Node Package Manager](https://docs.npmjs.com/about-npm): For package management and building
- [Clasp](https://github.com/google/clasp): For deploying the library and examples to Google Apps Script
- [TypeScript](https://www.typescriptlang.org/): The language used for developing the library
- [Jest](https://jestjs.io/): For test automation
- [webpack](https://webpack.js.org/): For packaging the library
- [semantic-release](https://github.com/semantic-release/semantic-release): For release automation and publishing
- For a complete list have a look at the dependencies in [`package.json`](https://github.com/ahochsteger/gmail-processor/blob/main/package.json)

Helpful resources about development for Google Apps Script:

- [https://github.com/labnol/apps-script-starter](https://github.com/labnol/apps-script-starter)
- [https://github.com/labnol/google-apps-script-awesome-list](https://github.com/labnol/google-apps-script-awesome-list)
- [https://blog.gsmart.in/es6-and-npm-modules-in-google-apps-script/](https://blog.gsmart.in/es6-and-npm-modules-in-google-apps-script/)
- [https://github.com/gsmart-in/AppsCurryStep1](https://github.com/gsmart-in/AppsCurryStep1)
- [https://developers.google.com/apps-script/guides/typescript](https://developers.google.com/apps-script/guides/typescript)
- [https://github.com/google/clasp/blob/master/docs/typescript.md](https://github.com/google/clasp/blob/master/docs/typescript.md)
- [https://github.com/grant/ts2gas](https://github.com/grant/ts2gas)
- [https://blog.filippo.io/gmail-bot-with-apps-script-and-typescript/](https://blog.filippo.io/gmail-bot-with-apps-script-and-typescript/)
