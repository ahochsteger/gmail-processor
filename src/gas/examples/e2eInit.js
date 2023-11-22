import { Session } from "google-apps-script"
import EnvContext from "../../lib/Context"
import * as GmailProcessorLib from "../../lib/index"

/**
 * This is a special configuration used to initialize example emails for end-to-end testing.
 * @type {GmailProcessorLib.E2EConfig}
 */
export const e2eInitConfig = {
  globals: {
    repoBaseUrl:
      "https://raw.githubusercontent.com/ahochsteger/gmail-processor/main/src/e2e-test/files",
    subjectPrefix: "[GmailProcessor-Test] ",
    to: Session.getActiveUser().getEmail(),
  },
  folders: [
    {
      name: "e2e",
      location: "/GmailProcessor-Tests/e2e",
    },
  ],
  files: [
    {
      name: "gmail-logo",
      type: "url",
      filename: "gmail-logo.png",
      ref: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/320px-Gmail_icon_%282020%29.svg.png",
      destFolder: "e2e",
    },
    {
      name: "plaintext-repo",
      type: "repo",
      filename: "plain-text-from-repo.txt",
      ref: "plain-text-from-repo.txt",
      destFolder: "e2e",
    },
    {
      name: "plaintext-drive",
      type: "gdrive",
      filename: "plain-text-from-drive.txt",
      ref: "1Jspl_MHY7LXb71z5tzk0yvVPvOfM6nd9",
      destFolder: "e2e",
    },
    {
      name: "sample-doc",
      type: "url",
      filename: "sample.doc",
      ref: "https://github.com/ahochsteger/sample-files/raw/main/sample%20office%20files/sample.doc",
      destFolder: "e2e",
    },
    {
      name: "sample-docx",
      type: "url",
      filename: "sample.docx",
      ref: "https://github.com/ahochsteger/sample-files/raw/main/sample%20office%20files/sample.docx",
      destFolder: "e2e",
    },
    {
      name: "sample-ppt",
      type: "url",
      filename: "sample.ppt",
      ref: "https://github.com/ahochsteger/sample-files/raw/main/sample%20office%20files/sample.ppt",
      destFolder: "e2e",
    },
    {
      name: "sample-pptx",
      type: "url",
      filename: "sample.pptx",
      ref: "https://github.com/ahochsteger/sample-files/raw/main/sample%20office%20files/sample.pptx",
      destFolder: "e2e",
    },
    {
      name: "sample-xls",
      type: "url",
      filename: "sample.xls",
      ref: "https://github.com/ahochsteger/sample-files/raw/main/sample%20office%20files/sample.xls",
      destFolder: "e2e",
    },
    {
      name: "sample-xlsx",
      type: "url",
      filename: "sample.xlsx",
      ref: "https://github.com/ahochsteger/sample-files/raw/main/sample%20office%20files/sample.xlsx",
      destFolder: "e2e",
    },
  ],
  mails: [
    {
      name: "00-no-attachments",
      subject: "Test with no attachments",
      htmlBody: "Test email with no attachments.",
      files: [],
    },
    {
      name: "01-single-attachment",
      subject: "Test with a single attachments",
      htmlBody: "Test email with a single attachment from the github repo.",
      files: ["plaintext-repo"],
    },
    {
      name: "02-multiple-attachments",
      subject: "Test with multiple attachments",
      htmlBody: "Test email with multiple attachments from different sources.",
      files: ["gmail-logo", "plaintext-drive", "plaintext-repo"],
    },
    {
      name: "03-html-image-tag",
      subject: "Test HTML image tag",
      htmlBody:
        'Test with HTML image tag:\n<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/320px-Gmail_icon_%282020%29.svg.png">',
      files: [],
    },
  ],
}

/**
 * Initialize data for end-to-end tests.
 * @param {GoogleAppsScript.Events.TimeDriven} evt Event information
 * @param {EnvContext | undefined} ctx Environment context
 * @returns {GmailProcessorLib.ProcessingResult} Processing result
 */
export function e2eInit(_evt, ctx) {
  return GmailProcessorLib.E2E.initAll(e2eInitConfig, ctx)
}

function testDriveApiV2FilesInsert(_evt, ctx) {
  const fileId = "1GJl_CFhn8jcIbdNh5SPiCHMEzeJYlLPa"
  const originalFile = DriveApp.getFileById(fileId)
  const fileMetadata = {
    title: "sample from xlsx",
    description: "some description",
    mimeType: "application/vnd.google-apps.spreadsheet",
    parents: [{ id: "1dgZ3c4V8G3xzoUzAxOr4fsx8JMmrfUwm" }],
  }
  const file = Drive.Files.insert(fileMetadata, originalFile)
  console.log(file.id)
}

function testDriveApiV2FilesCopy(_evt, ctx) {
  const fileId = "1GJl_CFhn8jcIbdNh5SPiCHMEzeJYlLPa"
  const originalFile = DriveApp.getFileById(fileId)
  const fileMetadata = {
    title: "sample from xlsx",
    description: "some description",
    mimeType: "application/vnd.google-apps.spreadsheet",
    parents: [{ id: "1dgZ3c4V8G3xzoUzAxOr4fsx8JMmrfUwm" }],
  }
  //const file = Drive.Files.copy(fileMetadata, fileId, {convert: true, ocr: true});
  const file = Drive.Files.copy(fileMetadata, fileId, {
    convert: true,
    ocr: true,
  })
  console.log(file.id)
}
