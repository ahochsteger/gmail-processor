declare const GmailProcessorLib: {
  E2E: any
}

const e2eConfig = {
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
      name: "01-multiple",
      subject: "Test with no attachments",
      htmlBody: "Test email with no attachments.",
      files: [],
    },
  ],
}

function e2eInit() {
  GmailProcessorLib.E2E.initAll(e2eConfig)
}
