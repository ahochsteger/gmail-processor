---
sidebar_position: 20
---
# Getting Started

There are different ways to get started with GmailProcessor in your Google Apps Script project:

1. [**Use** a library reference (recommended)](#use-a-library-reference-recommended): Use this, if you just want to use the library, get easy updates and don't want to fiddle with the library code at all.
2. [**Copy** the library code (advanced)](#copy-the-library-code-advanced): Use this if you want full control over what's being executed or use your own modified library.

## Use a Library Reference (recommended)

To use the Gmail Processor library directly within Google Apps Script, you can choose from three available release channels with the associated script IDs - depending on your needs:

Follow these steps:

1. Open [Google Apps Script](https://script.google.com/home?hl=en).
2. Create an empty project and give it a name (e.g. `MyGmailProcessor`) or select an existing one.
3. Add the library in the Libraries section using the ＋ icon and insert this Script ID:
  ```text
  1Qvk0v7ggfW-TJ84dlYPlDzJG8y-Dif-j9kdA1aWv4wzxE_IOkeV2juLB
  ```
4. Press "Look up" and select the desired release number as **version** (recommended for stability) or "HEAD (Development Mode)" (recommended for automatically staying up-to-date with the potential risk of broken updates).
   - See the [Gmail Processor Release Notes](https://github.com/ahochsteger/gmail-processor/releases) for their corresponding Google Apps Script library version.
   - Or use this URL to verify the release version of a Google Apps Script Library: <https://script.google.com/macros/library/d/1Qvk0v7ggfW-TJ84dlYPlDzJG8y-Dif-j9kdA1aWv4wzxE_IOkeV2juLB/{libVersion}> (replace `{libVersion}` with the number from the drop-down in Google Apps Script).
5. Set the **identifier** to `GmailProcessorLib` (any name will do, but we will use this identifier as a reference in all [examples](examples/index.md) and documentation)
6. Replace the contents of the initially created file `Code.gs` with the code from the [Getting Started Example](examples/gettingStarted.mdx) and save the changes.
7. Perform an initial execution of the function `run` to grant all required permissions (see [Required API Permissions](#required-api-permissions) for more details):
   1. Select your account you want to grant access for
   2. When the message "Google did not verify the app" click on "Advanced" and "Go to ..." to proceed
   3. Grant access to all listed apps by clicking "Allow"

Now you can start using the Gmail Processor Library in your script file (e.g. `Code.gs`) of your Google Apps Script project as follows:

```javascript
var config = {
  settings: {
    // Decide the mark processed method to be used:
    markProcessedMethod: GmailProcessorLib.MarkProcessedMethod.MY_CHOSEN_METHOD,
  },
  threads: [{}],
  // Define your configuration JSON
}

function run() {
  // NOTE: Switch to "safe-mode" after testing the config
  GmailProcessorLib.run(config, "dry-run")
}
```

Adjust the configuration (see section [Configuration Reference](reference/index.md)) to your needs. It's always recommended to test config changes using a _dry-run_ by passing `dry-run` as the 2nd parameter to the `run` function. That doesn't touch anything (neither in GMail nor GDrive) but produces a log that shows what would have been done. This way any change in your configuration or an upgrade to a newer version of the library can be tested without any risk of data-loss.

If you're satisfied with the results change the run mode from `dry-run` to `safe-mode` to actually do the processing and execute the `run` function again.
For automatic triggering you can create a [time-based trigger](https://developers.google.com/apps-script/guides/triggers/installable#manage_triggers_manually) that runs at certain intervals (e.g. once per day or every hour).

## Copy the Library Code (advanced)

To use a copy of the library code in your project simply replace steps 3-5 from above with the following steps:

1. Create a new file using the + icon at "Files" and selecting "Script"
2. Give it a name (e.g. `GmailProcessorLib` resulting in the file `GmailProcessorLib.gs` to be created)
3. Replace the contents of the file with the library code of the release asset [`GmailProcessorLib.js`](https://github.com/ahochsteger/gmail-processor/releases/latest/download/GmailProcessorLib.js) from the latest release or your own built version from `build/gas/lib/GmailProcessorLib.js`.

Follow the remaining steps from step 6 onwards from above.

## Required API Permissions

To enable full processing of the emails the following [OAuth Scopes for Google APIs](https://developers.google.com/identity/protocols/oauth2/scopes#script) are requested and need to be granted:

- `https://mail.google.com/`: Access Gmail API to process emails
- `https://www.googleapis.com/auth/drive`: Access Google Drive API to store files
- `https://www.googleapis.com/auth/script.external_request`: Used for end-to-end tests to fetch example attachments via HTTP
- `https://www.googleapis.com/auth/script.send_mail`: Used for end-to-end tests to send example emails
- `https://www.googleapis.com/auth/spreadsheets`: Access Google Spreadsheets API to store logs of processed emails
- `https://www.googleapis.com/auth/userinfo.email`: Get the user's email address to be used in the configuration
