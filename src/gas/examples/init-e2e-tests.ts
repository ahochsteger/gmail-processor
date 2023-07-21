declare namespace GMail2GDrive {
  namespace Lib {
    type E2EConfig = any
  }
}

declare var GMail2GDrive: {
  Lib: {
    E2EInit(config: any)
  }
}

const e2eConfig: GMail2GDrive.Lib.E2EConfig = {
  globals: {
    repoBaseUrl:
      "https://raw.githubusercontent.com/ahochsteger/gmail2gdrive/v2/src/e2e-test/files",
    subjectPrefix: "[GmailProcessor-Test] ",
    to: Session.getActiveUser().getEmail(),
  },
  folders: [
    {
      name: "e2e",
      location: "{id:1yVPXknT_gIdB6-jJdGF2u3mQR6en4dGy}/e2e",
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
      name: "01-multiple",
      subject: "Test Mail with attachments",
      htmlBody: "Test email with multiple attachments from different sources.",
      files: ["gmail-logo", "plaintext-drive", "plaintext-repo"],
    },
  ],
}

function e2eInit() {
  GMail2GDrive.Lib.E2EInit(e2eConfig)
}
