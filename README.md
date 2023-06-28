# GMail2GDrive

Gmail2GDrive is a Google Apps Script which automatically stores and sorts Gmail attachments into Google Drive folders, and can also save the thread as a PDF file.

It does so by defining a list of rules which consist of Gmail search filters and Google Drive destination folders.
This way the attachments of periodic emails can be automatically organized in folders without the need to install and run anything on the client.

## Features (TODO: Update)

- Automatically sorts your attachments in the background
- Filter for relevant emails
- Specify the destination folder
- Rename attachments (using date format strings and email subject as filenames)
- Save the thread as a PDF File

## Setup using Library

1. Open [Google Apps Script](https://script.google.com/).
2. Create an empty project.
3. Give the project a name (e.g. `MyGMail2GDrive`)
4. Add the GMail2GDrive library:
   1. Script ID: `1yhOQyl_xWtnGJn_bzlL7oA4d_q5KoMyZyWIqXDJX1SY7bi22_lpjMiQK`
   2. Version: Last development snapshot or a certain stable version
   3. Set the identifier to: `GMail2GDrive`
5. Replace the content of the initially created file `Code.gs` with the example [docs/Code.gs](docs/Code.gs) and save the changes.
6. Grant permissions
   1. Perform an initial run (using an empty configuration `{}` is ok)
   2. Select the account you want to grant access to
   3. When the message "Google did not verify the app" click on "Advanced" and proceed to run your script
   4. Grant access to GMail and Google Drive
7. Create a time based trigger which periodically executes `run` (e.g. once per day)

## Full Setup (TODO: Update)

1. Open [Google Apps Script](https://script.google.com/).
2. Create an empty project.
3. Give the project a name (e.g. MyGmail2GDrive)
4. Replace the content of the created file Code.gs with the provided [Code.gs](https://github.com/ahochsteger/gmail2gdrive/blob/master/Code.gs) and save the changes.
5. Create a new script file with the name 'Config' and replace its content with the provided [Config.gs](https://github.com/ahochsteger/gmail2gdrive/blob/master/Config.gs) and save the changes.
6. Adjust the configuration to your needs. It is recommended to restrict the timeframe using 'newerThan' to prevent running into API quotas by Google.
7. Test the script by manually executing the function 'Gmail2GDrive'.
8. Create a time based trigger which periodically executes 'Gmail2GDrive' (e.g. once per day) to automatically organize your Gmail attachments within Google Drive.

## Configuration

The documentation of the configuration schema can be found in [docs/config-schema-v2.md](docs/config-schema-v2.md).
To support the migration from the v1 configuration format the documentation can be found in [docs/config-schema-v1.md](docs/config-schema-v1.md).

Various configuration values (e.g. a GDrive location) can contain [meta info placeholder](docs/meta-infos.md) that get replaced with dynamic values.

## Global Configuration (TODO: Remove when all is in generated docs)

- globalFilter: Global filter expression (see [https://support.google.com/mail/answer/7190?hl=en](https://support.google.com/mail/answer/7190?hl=en) for avialable search operators)
  - Example: "globalFilter": "has:attachment -in:trash -in:drafts -in:spam"
- processedLabel: The GMail label to mark processed threads (will be created, if not existing)
  - Example: "processedLabel": "to-gdrive/processed"
- sleepTime: Sleep time in milliseconds between processed messages
  - Example: "sleepTime": 100
- maxRuntime: Maximum script runtime in seconds (Google Scripts will be killed after 5 minutes)
  - Example: "maxRuntime": 280
- newerThan: Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year)
  - Example: "newerThan": "1m"
- timezone: Timezone for date/time operations
  - Example: "timezone": "GMT"
- rules: List of rules to be processed
  - Example: "rules": [ {..rule1..}, {..rule2..}, ... ]

## Rule Configuration (Version 1) (TODO: Remove when all is in generated docs)

A rule supports the following parameters documentation:

- filter (String, mandatory): a typical gmail search expression (see [http://support.google.com/mail/bin/answer.py?hl=en&amp;answer=7190](http://support.google.com/mail/bin/answer.py?hl=en&answer=7190))
- folder (String, mandatory): a path to an existing Google Drive folder (will be created, if not existing)
- archive (boolean, optional): Should the gmail thread be archived after processing? (default: false)
- filenameFrom (String, optional): The attachment filename that should be renamed when stored in Google Drive
- filenameFromRegexp (String, optional): A regular expression to specify only relevant attachments
- filenameTo (String, optional): The pattern for the new filename of the attachment. If 'filenameFrom' is not given then this will be the new filename for all attachments.
  - You can use '%s' to insert the email subject and date format patterns like 'yyyy' for year, 'MM' for month and 'dd' for day as pattern in the filename.
  - See [https://developers.google.com/apps-script/reference/utilities/utilities#formatDate(Date,String,String)](<https://developers.google.com/apps-script/reference/utilities/utilities#formatDate(Date,String,String)>) for more information on the possible date format strings.
- saveThreadPDF (boolean, optional): Should the thread be saved as a PDF? (default: false)

## Processing Commands (TODO: Remove when all is in generated docs)

### Thread Commands

| V1 Config             | Command                    | Arguments                  | Notes |
| --------------------- | -------------------------- | -------------------------- | ----- |
| "archive": true       | thread.moveToArchive       | -                          |       |
| "saveThreadPDF": true | thread.exportAsPdfToGDrive | location, conflictStrategy |       |

## Example Configuration (TODO: Remove when all is in generated docs)

```javascript
/**
 * Configuration for Gmail2GDrive
 * See https://github.com/ahochsteger/gmail2gdrive/blob/master/README.md for a config reference
 */
function getGmail2GDriveConfig() {
  return {
    // Global filter
    globalFilter: "has:attachment -in:trash -in:drafts -in:spam",
    // Gmail label for processed threads (will be created, if not existing):
    processedLabel: "to-gdrive/processed",
    // Sleep time in milli seconds between processed messages:
    sleepTime: 100,
    // Maximum script runtime in seconds (google scripts will be killed after 5 minutes):
    maxRuntime: 280,
    // Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year):
    newerThan: "1m",
    // Timezone for date/time operations:
    timezone: "GMT",
    // Processing rules:
    rules: [
      {
        // Store all attachments sent to my.name+scans@gmail.com to the folder "Scans"
        filter: "to:my.name+scans@gmail.com",
        folder: "'Scans'-yyyy-MM-dd",
      },
      {
        // Store all attachments from example1@example.com to the folder "Examples/example1"
        filter: "from:example1@example.com",
        folder: "'Examples/example1'",
      },
      {
        // Store all pdf attachments from example2@example.com to the folder "Examples/example2"
        filter: "from:example2@example.com",
        folder: "'Examples/example2'",
        filenameFromRegexp: ".*.pdf$",
      },
      {
        // Store all attachments from example3a@example.com OR from:example3b@example.com
        // to the folder "Examples/example3ab" while renaming all attachments to the pattern
        // defined in 'filenameTo' and archive the thread.
        filter: "(from:example3a@example.com OR from:example3b@example.com)",
        folder: "'Examples/example3ab'",
        filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
        archive: true,
      },
      {
        // Store threads marked with label "PDF" in the folder "PDF Emails" als PDF document.
        filter: "label:PDF",
        saveThreadPDF: true,
        folder: "PDF Emails",
      },
      {
        // Store all attachments named "file.txt" from example4@example.com to the
        // folder "Examples/example4" and rename the attachment to the pattern
        // defined in 'filenameTo' and archive the thread.
        filter: "from:example4@example.com",
        folder: "'Examples/example4'",
        filenameFrom: "file.txt",
        filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
      },
    ],
  }
}
```

## Migrating from Gmail2GDrive 1.x

The configuration of version 1 just provided a single use-case: storing Gmail attachments to Google Drive which limited the extension to additional use-cases.

The config format of version 2 addresses this by providing a list of commands and multiple rules (for threads, messages and attachments) which should give enough flexibility for various use-cases.

### Version 1 Config

```json
{
  "folder": "'Scans'-yyyy-MM-dd",
  "filenameFrom": "file.txt",
  "filenameTo": "'file-'yyyy-MM-dd-'%s.txt'"
}
```

The supported date format provided by Google Apps Script Utilities is documented here:

- [https://developers.google.com/apps-script/reference/utilities/utilities#formatdatedate,-timezone,-format](https://developers.google.com/apps-script/reference/utilities/utilities#formatdatedate,-timezone,-format)
- [https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html)

### Version 2 Config (TODO: Update)

```json
{
  "commands": [
    {
      "name": "attachment.storeToGDrive",
      "args": {
        "location": "Scans-${message.date:dateformat:yyyy-mm-dd}/file-${message.date:dateformat:yyyy-mm-dd}-${message.subject}"
      }
    }
  ]
}
```

Note that the date format has changed in version 2 since it's based on the `dateformat` npm package.
Esp. take care that the casing has changed for month and minute!
It is documented here:

- [https://www.npmjs.com/package/dateformat](https://www.npmjs.com/package/dateformat)

As a fallback the old format is still supported and can be auto-detected if it finds a single quote in the format string.
It can also be configured in the settings, if auto-detection does not work as expected.
Make sure though, to migrate to the new format as it is much more flexible and easier to read as it uses meaningful names (e.g. `${message.subject}` instead of `%s`).

## Development (TODO: Update)

Since version 2 GMail2GDrive uses a modern development setup using [TypeScript](https://www.typescriptlang.org/), [NPM](https://www.npmjs.com/), [clasp](https://developers.google.com/apps-script/guides/clasp), [Jest](https://jestjs.io/) to improve productivity and quality.

Visual Studio Code is recommended as IDE.

This shows a typical development flow:

```bash
# Clean:
npm run clean

# Build the project:
npm run build

# Test project:
npm run test

# Push Library to Google Apps Script:
npm run push
```

## Resources

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

## Feedback and contributions

Feedback and contributions is well appreciated via [Github](https://github.com/ahochsteger/gmail2gdrive).

## Thanks

Thanks goes to [Amit Agarwal](http://www.labnol.org/about/) who provided similar functionality in his article [Send your Gmail Attachments to Google Drive](http://www.labnol.org/internet/send-gmail-to-google-drive/21236/) from which Gmail2GDrive evolved to provide more flexibility.
Also thanks to many [contributors](https://github.com/ahochsteger/gmail2gdrive/graphs/contributors) that helped fixing bugs and extending GMail2GDrive with new functionality.
