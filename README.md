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
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

[![GitHub issues](https://img.shields.io/github/issues/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/issues?q=is%3Aissue+is%3Aclosed)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/pulls)
[![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/ahochsteger/gmail-processor)](https://github.com/ahochsteger/gmail-processor/pulls?q=is%3Apr+is%3Aclosed)
[![Known Vulnerabilities](https://snyk.io/test/github/ahochsteger/gmail-processor/badge.svg)](https://snyk.io/test/github/ahochsteger/gmail-processor)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=bugs)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ahochsteger_gmail-processor&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=ahochsteger_gmail-processor)

</details>

**[Gmail Processor](https://github.com/ahochsteger/gmail-processor)** is an open-source [Google Apps Script](https://www.google.com/script/start/) library that automates the processing of Gmail messages and attachments by executing actions (e.g. store attachments in a GDrive folder, log information into a spreadsheet) depending on powerful matching criteria.

![Dall-e generated image: A friendly smiling robot sitting on a table, sorting mails into three paper trays, colorful flat style, white background](./docs/static/img/gmail-processor-robot-320.png)

Gmail Processor is the successor of [Gmail2GDrive](https://github.com/ahochsteger/gmail-processor/tree/1.x) with vastly enhanced functionality, completely re-written in [TypeScript](https://www.typescriptlang.org/) with extensibility and stability in mind, using a modern development setup and automation all over the place (dependency updates, tests, documentation, releases, deployments). There's a convenient migration available to convert your old configuration to the new format (see [Migrating from GMail2GDrive](https://ahochsteger.github.io/gmail-processor/docs/migrating)).

## Key Features

- 🤖 **Extensive Automation**: Automate email processing using the provided configuration to match threads, messages, and attachments, and trigger actions accordingly.
- 📁 **Google Drive Integration**: Store files such as attachments, PDFs of messages, or entire threads into any location within Google Drive, providing easy organization and accessibility.
- 📄 **Google Spreadsheet Logging**: Keep track of processed threads, messages, and attachments by logging valuable information into a Google Spreadsheet.
- 🔧 **Flexible Configuration**: Gmail Processor operates based on a JSON configuration that allows you to define matching rules and specify corresponding actions to be executed.
- 📐 **Extensible Architecture**: Designed with extensibility in mind, Gmail Processor enables seamless addition of new actions and integrations in the future to adapt to evolving requirements.

## Getting Started

The **[Getting Started Guide](https://ahochsteger.github.io/gmail-processor/docs/getting-started)** shows how to setup Gmail Processor in Google Apps Script and quickly get it up and running.

## Config Reference

The **[Config Reference](https://ahochsteger.github.io/gmail-processor/docs/reference/)** provides detailed information about the Gmail Processor configuration.

## Examples

The **[Examples](https://ahochsteger.github.io/gmail-processor/docs/examples/)** show different ways of using Gmail Processor.

## Playground

The **[Playground](https://ahochsteger.github.io/gmail-processor/playground)** helps to create the configuration in a schema-aware online editor with a visual schema guide on the side.

## Contributing

Contributions to Gmail Processor are welcome! Whether you want to add new features, fix bugs, or improve documentation, check out the [contribution guidelines](https://ahochsteger.github.io/gmail-processor/docs/community/contributing) to get started.

## Development Guide

See the [Development Guide](https://ahochsteger.github.io/gmail-processor/docs/community/contributing#development-guide) for details.

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
