# 📧 Gmail Processor 🤖 - Automate Email Processing with Ease

[![GitHub](https://img.shields.io/github/license/ahochsteger/gmail-processor)](#license)
[![GitHub release (with filter)](https://img.shields.io/github/v/release/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/releases)
[![GitHub Release Date - Published_At](https://img.shields.io/github/release-date/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/releases)
[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/ahochsteger/gmail-processor/ci.yaml)](https://github.com/ahochsteger/gmail-processor/actions/workflows/ci.yaml)
[![Coveralls branch](https://img.shields.io/coverallsCoverage/github/ahochsteger/gmail-processor)](https://coveralls.io/github/ahochsteger/gmail-processor)

<details>
<summary>More badges ...</summary>

[![GitHub tag (with filter)](https://img.shields.io/github/v/tag/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/tags)
[![GitHub Repo stars](https://img.shields.io/github/stars/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/forks?include=active&page=1&period=2y&sort_by=last_updated)
[![GitHub all releases](https://img.shields.io/github/downloads/ahochsteger/gmail-processor/total)](https://github.com/ahochsteger/gmail-processor/releases)

[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/t/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/commits)
![GitHub repo size](https://img.shields.io/github/repo-size/ahochsteger/gmail-processor)
[![GitHub contributors](https://img.shields.io/github/contributors/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/graphs/contributors)
[![All Contributors](https://img.shields.io/badge/all_contributors-12-orange.svg?style=flat-square)](#contributors)

[![GitHub issues](https://img.shields.io/github/issues/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/issues?q=is%3Aissue+is%3Aclosed)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/pulls)
[![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/pulls?q=is%3Apr+is%3Aclosed)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=bugs)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
</details>

**[Gmail Processor](https://github.com/ahochsteger/gmail-processor)** is an open-source [Google Apps Script](https://www.google.com/script/start/) library that automates the processing of Gmail messages and attachments by executing actions (e.g. store attachments in a GDrive folder, log information in a spreadsheet) depending on powerful matching criteria.

![Dall-e generated image: A friendly smiling robot sitting on a table, sorting mails into three paper trays, colorful flat style, white background](./docs/images/gmail-processor-robot-320.png)

Gmail Processor is the successor of [Gmail2GDrive](https://github.com/ahochsteger/gmail-processor/tree/1.x) with vastly enhanced functionality, completely re-written in [TypeScript](https://www.typescriptlang.org/) with extensibility and stability in mind, using a modern development setup and automation all over the place (dependency updates, tests, documentation, releases, deployments). There's a convenient migration available to convert your old configuration to the new format (see [Getting Started: Migrating from GMail2GDrive v1](#migrate-from-gmail2gdrive)).

## Key Features

- 🤖 **Extensive Automation**: Automate email processing using the provided configuration to match threads, messages, and attachments, and trigger actions accordingly.
- 📁 **Google Drive Integration**: Store files such as attachments, PDFs of messages, or entire threads into any location within Google Drive, providing easy organization and accessibility.
- 📄 **Google Spreadsheet Logging**: Keep track of processed threads, messages, and attachments by logging valuable information to a Google Spreadsheet.
- 🔧 **Flexible Configuration**: Gmail Processor operates based on a JSON configuration that allows you to define matching rules and specify corresponding actions to be executed.
- 📐 **Extensible Architecture**: Designed with extensibility in mind, Gmail Processor enables seamless addition of new actions and integrations in the future to adapt to evolving requirements.

## How it Works

**[Gmail Processor](https://github.com/ahochsteger/gmail-processor)** is fed with a JSON configuration that defines a hierarchical list of matching configurations (for threads, containing messages and containing attachments) as well as a list of actions on each level (e.g. export the thread as PDF to Google Drive, add a label to a thread, mark a message as read, store an attachment to a Google Drive folder, ...).

To remember, which threads or messages have already been processed the following methods are currently supported (more to come if there is some demand):

- **Mark processed threads by attaching a label**: This is recommended for simple cases without multiple mail messages in a single thread
  - PROS: Keeps processed messages in an unread state.
  - CONS: Cannot process additional messages that may be added after a thread has already been processed.
- **Mark processed messages as read**: This is the recommended way because it also can deal with multiple messages per thread.
  - PROS: Can process additional messages within the same thread even after a thread has already been processed.
  - CONS: Marks the processed messages as read, which may be surprising if not paying attention to.
- **Custom**: Leaves the decision on how to remember processed threads/messages to the user of the library using actions
  - PROS: Most flexible, can deal with edge cases
  - CONS: Great care has to be taken that the matching configuration and the actions to mark entities as processed fit together. Otherwise they may get processed over and over again.

## Getting Started

There are different ways to get started with GmailProcessor in your Google Apps Script project:

1. [**Use** a library reference (recommended)](#use-a-library-reference-recommended): Use this, if you just want to use the library, get easy updates and don't want to fiddle with the library code at all.
2. [**Copy** the library code (advanced)](#copy-the-library-code-advanced): Use this if you want full control over what's being executed or if you want to use your own modified library versions.
3. [**Migrate** from GMail2GDrive](#migrate-from-gmail2gdrive): Use this, if you've used GMail2GDrive before and want to migrate to Gmail Processor.

### Use a Library Reference (recommended)

To use the Gmail Processor library directly within Google Apps Script, you can choose from three available release channels with the associated script IDs - depending on your needs:

Follow these steps:

1. Open [Google Apps Script](https://script.google.com/home?hl=en).
2. Create an empty project and give it a name (e.g. `MyGmailProcessor`) or select an existing one.
3. Add the library in the Libraries section using the ＋ icon and insert one of these Script IDs:
   - **Stable** (recommended):
     `1Qvk0v7ggfW-TJ84dlYPlDzJG8y-Dif-j9kdA1aWv4wzxE_IOkeV2juLB`
   - **Beta** (for pre-release tests):
     `1yhOQyl_xWtnGJn_bzlL7oA4d_q5KoMyZyWIqXDJX1SY7bi22_lpjMiQK`
4. Press "Look up" and select the desired release number as **version** or "HEAD (Development Mode)" if you always want to use the latest version of the desired release channel.
   - Unfortunately Google Apps Script does not show the description of the library version to see the corresponding release version. This URL can be used to verify the release version of a Google Apps Script Library: <https://script.google.com/macros/library/d/1Qvk0v7ggfW-TJ84dlYPlDzJG8y-Dif-j9kdA1aWv4wzxE_IOkeV2juLB/{libVersion}> (replace `{libVersion}` with the number from the drop-down in Google Apps Script).
5. Set the **identifier** to `GmailProcessorLib` (any name will do, but we will use this identifier as a reference in all examples and documentation)
6. Replace the contents of the initially created file `Code.gs` with the example from [gettingStarted.js](src/gas/examples/gettingStarted.js) and save the changes.
7. Perform initial start of the function `run` to grant the permissions (see below for an explanation why these are required):
   1. Select the account you want to grant access for
   2. When the message "Google did not verify the app" click on "Advanced" and "Go to ..." to proceed
   3. Grant access to GMail, Google Drive and Google Sheets by clicking "Allow"

Now you can start using the Gmail Processor Library in your script file (e.g. `Code.gs`) of your Google Apps Script project as follows:

```javascript
var config = {
  // Define your configuration JSON
}

function run() {
  // NOTE: Switch to "safe-mode" after testing the config
  GmailProcessorLib.run(config, "dry-run")
}
```

Adjust the configuration (see section [Configuration Reference](#configuration-reference)) to your needs. It's always recommended to test config changes using a _dry-run_ by passing `dry-run` as the 2nd parameter to the `run` function. That doesn't touch anything (neither in GMail nor GDrive) but produces a log that shows what would have been done. This way any change in your configuration or an upgrade to a newer version of the library can be tested without any risk of data-loss.

If you're satisfied with the results change the run mode from `dry-run` to `safe-mode` to actually do the processing and execute the `run` function again.
For automatic triggering you can create a time-based trigger that runs at certain intervals (e.g. once per day or every hour).

### Copy the Library Code (advanced)

To use a copy of the library code in your project simply replace steps 3-5 from above with the following steps:

1. Create a new file using the + icon at "Files" and selecting "Script"
2. Give it a name (e.g. `GmailProcessorLib` resulting in the file `GmailProcessorLib.gs` to be created)
3. Replace the contents of the file with the library code of the release asset [`GmailProcessorLib.js`](https://github.com/ahochsteger/gmail-processor/releases/latest/download/GmailProcessorLib.js) from the latest release or your own built version from [`build/gas/lib/GmailProcessorLib.js`](build/gas/lib/GmailProcessorLib.js).

Follow the remaining steps from step 6 onwards from above.

### Required API Permissions

To enable full processing of the emails the following [OAuth Scopes for Google APIs](https://developers.google.com/identity/protocols/oauth2/scopes#script) are requested and need to be granted:

- `https://mail.google.com/`: Access Gmail API to process emails
- `https://www.googleapis.com/auth/drive`: Access Google Drive API to store files
- `https://www.googleapis.com/auth/spreadsheets`: Access Google Spreadsheets API to store logs of processed emails
- `https://www.googleapis.com/auth/userinfo.email`: Get the user's email address to be used in the configuration

### Migrate from GMail2GDrive

Make sure, you've done the initial steps above (e.g. [use a library reference](#use-a-library-reference-recommended)) before migrating the old configuration to the new format.

If you have been using the predecessor GMail2GDrive before and want to migrate to GmailProcessor there's a convenient way to convert the old configuration to the new format by executing the function `convertConfig` in Google Apps Script and passing in the old config like this:

```javascript
var oldConfig = {
  // The old Gmail2GDrive config comes here ...
}

function convertConfig() {
  const config = GmailProcessorLib.convertV1Config(oldConfig)
  console.log(JSON.stringify(config, null, 2))
}
```

Note though, that the logging size is limited to about 8kB (or about 100kB if using StackDriver), so you may have split your rules into multiple runs to get all rules converted into individual thread configs.

If you want to manually convert your configuration have a look at [V1ToV2Converter.ts](src/lib/config/v1/V1ToV2Converter.ts) that implements the conversion logic.

## Configuration Reference

The following documentation is available:

- [Config Documentation](https://ahochsteger.github.io/gmail-processor/classes/Config.html): documents the schema of the configuration format
- [Reference Documentation](docs/reference-docs.md): documents the actions, used enum types and substitution placeholder that can be used in strings to be replaced with dynamic values (e.g. for folder paths or filenames).
  - See [all available actions](docs/reference-docs.md#actions) like `attachment.store` to store an attachment at a certain Google Drive location.
  - See [all available enum values](docs/reference-docs.md#enum-types) like `ConflictStrategy` to specify how to deal with existing files at a Google Drive location.
  - See [all available substitution placeholder](docs/reference-docs.md#substitution-placeholder) like `${message.date:format:yyyy-MM-dd}` to use the message date as the folder name of the Google Drive location.

Have a look at the [examples](src/gas/examples) to see different usage scenarios.

## Contributing

Contributions to Gmail Processor are welcome! Whether you want to add new features, fix bugs, or improve documentation, check out the [contribution guidelines](CONTRIBUTING.md) to get started.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/ahochsteger/gmail-processor.git

# Navigate to the project folder
cd gmail-processor

# Install dependencies
npm install

# Perform changes
code .

# Pre-commit updates + tests
npm run pre-commit
```

The recommended IDE for this project is [Visual Studio Code](https://code.visualstudio.com/), but any other IDEs with support for TypeScript and NPM will do.

Please add/update the tests for any change to keep the codebase in a well-tested state. For every source file `*.ts` the corresponding test file is named `*.spec.ts` and they are implemented using [Jest](https://jestjs.io/) as the testing framework.
Remote services are mocked (see [MockFactory.ts](src/test/mocks/MockFactory.ts)) to simplify local testing in isolation.

After the changes and tests are done run the `pre-commit` script that validates the changes and updates all generated artifacts (like documentation, examples, JSON schema files, ...) and include all updated files in your commit.

### Development Resources

A list of tools, libraries and frameworks that are used for development:

- [NPM - Node Package Manager](https://docs.npmjs.com/about-npm): For package management and building
- [Clasp](https://github.com/google/clasp): For deploying the library and examples to Google Apps Script
- [TypeScript](https://www.typescriptlang.org/): The language used for developing the library
- [Jest](https://jestjs.io/): For test automation
- [webpack](https://webpack.js.org/): For packaging the library
- [semantic-release](https://github.com/semantic-release/semantic-release): For release automation and publishing
- For a complete list have a look at the dependencies in [`package.json`](package.json)

Helpful resources about development for Google Apps Script:

- [https://github.com/labnol/apps-script-starter](https://github.com/labnol/apps-script-starter)
- [https://github.com/labnol/google-apps-script-awesome-list](https://github.com/labnol/google-apps-script-awesome-list)
- [https://blog.gsmart.in/es6-and-npm-modules-in-google-apps-script/](https://blog.gsmart.in/es6-and-npm-modules-in-google-apps-script/)
- [https://github.com/gsmart-in/AppsCurryStep1](https://github.com/gsmart-in/AppsCurryStep1)
- [https://developers.google.com/apps-script/guides/typescript](https://developers.google.com/apps-script/guides/typescript)
- [https://github.com/google/clasp/blob/master/docs/typescript.md](https://github.com/google/clasp/blob/master/docs/typescript.md)
- [https://github.com/grant/ts2gas](https://github.com/grant/ts2gas)
- [https://blog.filippo.io/gmail-bot-with-apps-script-and-typescript/](https://blog.filippo.io/gmail-bot-with-apps-script-and-typescript/)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ahochsteger"><img src="https://avatars.githubusercontent.com/u/207989?v=4?s=100" width="100px;" alt="Andreas Hochsteger"/><br /><sub><b>Andreas Hochsteger</b></sub></a><br /><a href="https://github.com/ahochsteger/gmail-processor/commits?author=ahochsteger" title="Code">💻</a> <a href="https://github.com/ahochsteger/gmail-processor/commits?author=ahochsteger" title="Documentation">📖</a> <a href="#example-ahochsteger" title="Examples">💡</a> <a href="#infra-ahochsteger" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-ahochsteger" title="Maintenance">🚧</a> <a href="https://github.com/ahochsteger/gmail-processor/pulls?q=is%3Apr+reviewed-by%3Aahochsteger" title="Reviewed Pull Requests">👀</a> <a href="#tool-ahochsteger" title="Tools">🔧</a> <a href="https://github.com/ahochsteger/gmail-processor/commits?author=ahochsteger" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/piraveen"><img src="https://avatars.githubusercontent.com/u/7525600?v=4?s=100" width="100px;" alt="Piraveen Kamalathas"/><br /><sub><b>Piraveen Kamalathas</b></sub></a><br /><a href="https://github.com/ahochsteger/gmail-processor/commits?author=piraveen" title="Code">💻</a> <a href="https://github.com/ahochsteger/gmail-processor/commits?author=piraveen" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/cciprian5"><img src="https://avatars.githubusercontent.com/u/24846146?v=4?s=100" width="100px;" alt="Ciprian Constantinescu"/><br /><sub><b>Ciprian Constantinescu</b></sub></a><br /><a href="https://github.com/ahochsteger/gmail-processor/commits?author=cciprian5" title="Code">💻</a> <a href="#example-cciprian5" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/marcusschweizer"><img src="https://avatars.githubusercontent.com/u/25128893?v=4?s=100" width="100px;" alt="marcusschweizer"/><br /><sub><b>marcusschweizer</b></sub></a><br /><a href="https://github.com/ahochsteger/gmail-processor/commits?author=marcusschweizer" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.kurzmann.io/"><img src="https://avatars.githubusercontent.com/u/48987577?v=4?s=100" width="100px;" alt="Markus Kurzmann"/><br /><sub><b>Markus Kurzmann</b></sub></a><br /><a href="https://github.com/ahochsteger/gmail-processor/commits?author=maks-io" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Claude123"><img src="https://avatars.githubusercontent.com/u/28677693?v=4?s=100" width="100px;" alt="NadavClaudeCohen"/><br /><sub><b>NadavClaudeCohen</b></sub></a><br /><a href="https://github.com/ahochsteger/gmail-processor/commits?author=Claude123" title="Code">💻</a> <a href="https://github.com/ahochsteger/gmail-processor/commits?author=Claude123" title="Documentation">📖</a> <a href="#example-Claude123" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tomlux"><img src="https://avatars.githubusercontent.com/u/992753?v=4?s=100" width="100px;" alt="Schuller Tom"/><br /><sub><b>Schuller Tom</b></sub></a><br /><a href="https://github.com/ahochsteger/gmail-processor/commits?author=tomlux" title="Code">💻</a> <a href="#example-tomlux" title="Examples">💡</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.tomjudge.com/"><img src="https://avatars.githubusercontent.com/u/971788?v=4?s=100" width="100px;" alt="Tom Judge"/><br /><sub><b>Tom Judge</b></sub></a><br /><a href="https://github.com/ahochsteger/gmail-processor/commits?author=amishHammer" title="Code">💻</a> <a href="#example-amishHammer" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://davidlemayian.com/"><img src="https://avatars.githubusercontent.com/u/877919?v=4?s=100" width="100px;" alt="David Lemayian ✨"/><br /><sub><b>David Lemayian ✨</b></sub></a><br /><a href="https://github.com/ahochsteger/gmail-processor/commits?author=DavidLemayian" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://denny.me/"><img src="https://avatars.githubusercontent.com/u/86243?v=4?s=100" width="100px;" alt="Denny de la Haye"/><br /><sub><b>Denny de la Haye</b></sub></a><br /><a href="https://github.com/ahochsteger/gmail-processor/commits?author=denny" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/steve192"><img src="https://avatars.githubusercontent.com/u/6454983?v=4?s=100" width="100px;" alt="steve192"/><br /><sub><b>steve192</b></sub></a><br /><a href="https://github.com/ahochsteger/gmail-processor/commits?author=steve192" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://gregorynicholas.com/"><img src="https://avatars.githubusercontent.com/u/407650?v=4?s=100" width="100px;" alt="gregory nicholas"/><br /><sub><b>gregory nicholas</b></sub></a><br /><a href="#example-gregorynicholas" title="Examples">💡</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

GmailProcessor is released under the [Apache 2.0 License](LICENSE).

## Support

For any questions, issues, or feedback, please open an [issue](https://github.com/ahochsteger/gmail2gdrive/issues) on GitHub.
