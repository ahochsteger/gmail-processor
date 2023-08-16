# 📧 Gmail Processor 🚀 - Automate Email Processing with Ease

![GitHub](https://img.shields.io/github/license/ahochsteger/gmail2gdrive) ![GitHub release (with filter)](https://img.shields.io/github/v/release/ahochsteger/gmail2gdrive) ![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/ahochsteger/gmail2gdrive/ci.yaml)
 ![GitHub Repo stars](https://img.shields.io/github/stars/ahochsteger/gmail2gdrive) ![GitHub forks](https://img.shields.io/github/forks/ahochsteger/gmail2gdrive) ![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/t/ahochsteger/gmail2gdrive/v2) ![GitHub contributors](https://img.shields.io/github/contributors/ahochsteger/gmail2gdrive) ![GitHub closed issues](https://img.shields.io/github/issues-closed/ahochsteger/gmail2gdrive) ![GitHub issues](https://img.shields.io/github/issues/ahochsteger/gmail2gdrive) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/ahochsteger/gmail2gdrive) ![GitHub pull requests](https://img.shields.io/github/issues-pr/ahochsteger/gmail2gdrive) ![GitHub repo size](https://img.shields.io/github/repo-size/ahochsteger/gmail2gdrive)

**[Gmail Processor](https://github.com/ahochsteger/gmail2gdrive)** is an open-source project that automates the processing of Gmail messages and attachments using [Google Apps Script](https://www.google.com/script/start/) and execute actions (e.g. store attachments in a GDrive folder, log information in a spreadsheet) depending on matching criteria.

Gmail Processor is the successor of [Gmail2GDrive](https://github.com/ahochsteger/gmail2gdrive) with vastly enhanced functionality, completely re-written in [TypeScript](https://www.typescriptlang.org/) with extensibility and stability in mind, using a modern development setup and automation all over the place (dependency updates, tests, documentation, releases, deployments). There's a convenient migration available to convert your old configuration to the new format (see [Getting Started: Migrating from GMail2GDrive v1](#getting-started-migrating-from-gmail2gdrive-v1)).

## Key Features

- 🤖 **Extensive Automation**: Automate email processing using the provided configuration to match threads, messages, and attachments, and trigger actions accordingly.
- 📁 **Google Drive Integration**: Store files such as attachments, PDFs of messages, or entire threads into any location within Google Drive, providing easy organization and accessibility.
- 📄 **Google Spreadsheet Logging**: Keep track of processed threads, messages, and attachments by logging valuable information to a Google Spreadsheet.
- 🔧 **Flexible Configuration**: Gmail Processor operates based on a JSON configuration that allows you to define matching rules and specify corresponding actions to be executed.
- 📐 **Extensible Architecture**: Designed with extensibility in mind, Gmail Processor enables seamless addition of new actions and integrations in the future to adapt to evolving requirements.

## Getting Started

There are two ways to use GmailProcessor in your Google Apps Script project:

1. **Referencing** the provided library (recommended): Use this, if you just want to use it, get easy upgrades and don't want to fiddle with the library code at all.
2. **Copying** the library code (advanced): Use this if you want full control over what's being executed or if you want to use your own modified library versions.

### Getting Started: Referencing the Provided Library

To use the Gmail Processor library directly within Google Apps Script, you can choose from three available channels - depending on your needs: `stable`, `testing`, and `dev`.

Follow these steps:

1. Open [Google Apps Script](https://script.google.com/home?hl=en).
2. Create an empty project and give it a name (e.g. `MyGmailProcessor`) or select an existing one.
3. Add the library in the Libraries section using the ＋ icon and insert the Script ID `1yhOQyl_xWtnGJn_bzlL7oA4d_q5KoMyZyWIqXDJX1SY7bi22_lpjMiQK` (stable release channel).
   - Alternatively you can use `TODO` for the testing release channel or `TODO` for development release channel.
   - Version: Last development snapshot or a certain stable version
4. Press "Look up" and select the desired release number or "HEAD (Development Mode)" if you always want to used the latest version of the release channel.
5. Set the identifier to: `GmailProcessor` (any name will do, but we will use that name as a reference later in all examples and documentation)
6. Replace the contents of the initially created file `Code.gs` with the example from [gettingStarted.js](src/gas/examples/gettingStarted.js) and save the changes.
7. Perform initial start of the function `run` to grant the permissions (see below for an explanation why these are required):
   1. Select the account you want to grant access for
   2. When the message "Google did not verify the app" click on "Advanced" and proceed to run your script
   3. Grant access to GMail and Google Drive

Now you can start using the Gmail Processor Library in your Google Apps Script project as follows:

```javascript
var config = {
  // Define your configuration JSON
}

GmailProcessor.Lib.run(config, "dry-run") // NOTE: Switch to "safe-mode" after testing the config
```

Adjust the configuration (see section [Configuration Reference](#configuration-reference)) to your needs. It's always recommended to test config changes using a _dry-run_ by passing `dry-run` as the 2nd parameter to the `run` function. That doesn't touch anything (neither in GMail nor GDrive) but produces a log that shows what would have been done. This way any change in your configuration or an upgrade to a newer version of the library can be tested without any risk of data-loss.

If you're satisfied with the results change the run mode from `dry-run` to `safe-mode` to actually do the processing and execute the `run` function again.
For automatic triggering you can create a time-based trigger that runs at certain intervalls (e.g. once per day or every hour).

### Getting Started: Copying the Library Code

To use a copy of the library code in your project simply replace steps 3-5 from above with the following steps and use `Lib.run` instead of `GmailProcessor.Lib.run`:

1. Create a new file using the + icon at "Files" and selecting "Script"
2. Give it a name (e.g. `Lib` resulting in the file `Lib.gs` to be created)
3. Replace the contents of the file with the library code of the release asset [`Lib.js`](https://github.com/ahochsteger/gmail2gdrive/releases/latest/download/Lib.js) from the latest release or your own built version from `build/lib/Lib.gs`.

Now use it in your script:

```javascript
Lib.run(config,...)
```

### Required API Permissions

To enable full processing of the emails the following permissions are requested during the initial run:

- `https://mail.google.com/`: Access Gmail to process emails
- `https://www.googleapis.com/auth/drive`: Access Google Drive to store files
- `https://www.googleapis.com/auth/script.container.ui`: TODO
- `https://www.googleapis.com/auth/spreadsheets`: Access Google Spreadsheets to store logs of processed emails
- `https://www.googleapis.com/auth/userinfo.email`: Get the user's email address to be used in the configuration

### Getting Started: Migrating from GMail2GDrive v1

If you have been using the predecsssor GMail2GDrive before and want to migrate to GmailProcessor there's a convenient way to convert the old configuration to the new format by executing the function `convertConfig` in Google Apps Script and passing in the old config like this:

```javascript
var oldConfig = {
  // The old Gmail2GDrive v1 config comes here ...
}

function convertConfig() {
  const config = GmailProcessor.Lib.convertV1ConfigToV2Config(oldConfig)
  console.log(JSON.stringify(config, null, 2))
}
```

Note though, that the logging size is limited to about 8kB (or about 100kB if using StackDriver), so you may have split your rules into multiple runs to get all rules converted into individual thread configs.

If you want to manually convert your configuration have a look at [V1ToV2Converter.ts](src/lib/config/v1/V1ToV2Converter.ts) that implements the conversion logic.

## Configuration Reference

The following documentation is available:

- [Config Schema Documentation](docs/config-schema-v2.md): documents the schema of the configuration format
- [Reference Documentation](docs/reference-docs.md): documents the actions, used enum types and substitution placeholder that can be used in strings to be replaced with dynamic values (e.g. for folder paths or filenames).
  - See [all available actions](docs/reference-docs.md#actions) like `attachment.store` to store an attachment at a certain Google Drive location.
  - See [all available enum values](docs/reference-docs.md#enum-types) like `ConflictStrategy` to specify how to deal with existing files at a Google Drive location.
  - See [all available substitution placeholder](docs/reference-docs.md#substitution-placeholder) like `${message.date:format:yyyy-MM-dd}` to use the message date as the folder name of the Google Drive location.

Have a look at the [examples](https://github.com/ahochsteger/gmail2gdrive/tree/v2/src/gas/examples) to see different usage scenarios.

## Contributing

Contributions to Gmail Processor are welcome! Whether you want to add new features, fix bugs, or improve documentation, check out the [contribution guidelines](CONTRIBUTING.md) to get started.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/ahochsteger/gmail2gdrive.git

# Navigate to the project folder
cd gmail2gdrive

# Install dependencies
npm install
```

The recommended IDE for this project is [Visual Studio Code](https://code.visualstudio.com/), but any other IDEs with support for TypeScript and NPM will do.

To validate any changes and update all generated artifacts (like doumentation, examples, JSON schema files, ...) use the `pre-commit` script and include them in the commit:

```bash
npm run pre-commit
```

Please add/update tests (using [Jest](https://jestjs.io/)) with your changes to keep the codebase in a well-tested state.

### Development Resources (TODO: Update)

- Google Apps Script Development
  - [https://github.com/google/clasp](https://github.com/google/clasp)
- Google Apps Script with Babel and WebPack
  - [https://github.com/labnol/apps-script-starter](https://github.com/labnol/apps-script-starter)
  - [https://github.com/labnol/google-apps-script-awesome-list](https://github.com/labnol/google-apps-script-awesome-list)
  - [https://blog.gsmart.in/es6-and-npm-modules-in-google-apps-script/](https://blog.gsmart.in/es6-and-npm-modules-in-google-apps-script/)
  - [https://github.com/gsmart-in/AppsCurryStep1](https://github.com/gsmart-in/AppsCurryStep1)
- Google Apps Script with TypeScript
  - [https://developers.google.com/apps-script/guides/typescript](https://developers.google.com/apps-script/guides/typescript)
  - [https://github.com/google/clasp/blob/master/docs/typescript.md](https://github.com/google/clasp/blob/master/docs/typescript.md)
  - [https://github.com/grant/ts2gas](https://github.com/grant/ts2gas)
  - [https://blog.filippo.io/gmail-bot-with-apps-script-and-typescript/](https://blog.filippo.io/gmail-bot-with-apps-script-and-typescript/)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

GmailProcessor is released under the [Apache 2.0 License](LICENSE).

## Support

For any questions, issues, or feedback, please open an [issue](https://github.com/ahochsteger/gmail2gdrive/issues) on GitHub.
