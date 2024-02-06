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
      name: "00-no-attachments",
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
