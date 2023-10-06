---
id: about
sidebar_position: 10
---
# About Gmail Processor

**[Gmail Processor](https://github.com/ahochsteger/gmail-processor)** is an open-source [Google Apps Script](https://www.google.com/script/start/) library that automates the processing of Gmail messages and attachments by executing actions (e.g. store attachments in a GDrive folder, log information into a spreadsheet) depending on powerful matching criteria.

![Dall-e generated image: A friendly smiling robot sitting on a table, sorting mails into three paper trays, colorful flat style, white background](../static/img/gmail-processor-robot-320.png)

It is the successor of [Gmail2GDrive](https://github.com/ahochsteger/gmail-processor/tree/1.x) with vastly enhanced functionality, completely re-written in [TypeScript](https://www.typescriptlang.org/) with extensibility and stability in mind, using a modern development setup and automation all over the place (dependency updates, tests, documentation, releases, deployments). There's a convenient migration available to convert your old configuration to the new format (see [Getting Started: Migrating from GMail2GDrive v1](#migrate-from-gmail2gdrive)).

## Key Features

- 🤖 **Extensive Automation**: Automate email processing using the provided configuration to match threads, messages, and attachments, and trigger actions accordingly.
- 📁 **Google Drive Integration**: Store files such as attachments, PDFs of messages, or entire threads into any location within Google Drive, providing easy organization and accessibility.
- 📄 **Google Spreadsheet Logging**: Keep track of processed threads, messages, and attachments by logging valuable information into a Google Spreadsheet.
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

## More Information

The following pages provide all required information to successfully use Gmail Processor:

* The **[Getting Started Guide](getting-started.md)** shows how to setup Gmail Processor in Google Apps Script and quickly get it up and running.
* The **[Config Reference](reference/index.md)** provides detailed information about the Gmail Processor configuration.
* The **[Examples](examples/index.md)** show different ways of using Gmail Processor.
* The **[Playground](/playground)** helps to create the configuration in a schema-aware online editor with a visual schema guide on the side.
