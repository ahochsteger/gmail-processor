/* global DriveApp, GMail2GDrive, MailApp, Session, UrlFetchApp */

declare class GMail2GDrive {
  Lib: {
    E2E: {
      ConflictStrategy: any,
      defaultContext: any,
      DriveUtils: any,
      FileContent: any,
      RunMode: any,
    }
  }
}

type FileConfig = {
  name: string
  type: string
  filename: string
  ref: string
  destFolder: string
}

type E2EConfig = {
  globals: {
    repoBaseUrl: string
    subjectPrefix: string
    to: string
  }
  folders: {
    name: string
    location: string
  }[]
  files: FileConfig[]
  mails: {
    name: string
    subject: string
    htmlBody: string
    files: string[]
  }[]
}

const e2eConfig: E2EConfig = {
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

function E2EInit() {
  initDrive(e2eConfig)
  initMails(e2eConfig)
}

function getBlobFromFileEntry(config: E2EConfig, file: FileConfig): GoogleAppsScript.Base.Blob {
  var blob
  switch (file.type) {
    case "repo":
      const url = `${config.globals.repoBaseUrl}/${file.ref}`
      console.log(`Fetching repo file from ${url} ...`)
      blob = UrlFetchApp.fetch(url).getBlob()
      break
    case "url":
      console.log(`Fetching URL file from ${file.ref} ...`)
      blob = UrlFetchApp.fetch(file.ref).getBlob()
      break
    case "gdrive":
      console.log(`Fetching GDrive file from ${file.ref} ...`)
      blob = DriveApp.getFileById(file.ref).getBlob()
      break
  }
  return blob
}

function initMails(config: E2EConfig) {
  config.mails.forEach((mail) => {
    const files: string[] = mail.files ?? []
    const attachments: GoogleAppsScript.Base.Blob[] = files.map((name) => {
      const file = config.files.reduce((prev, curr) =>
        name === curr.name ? curr : prev,
      )
      return getBlobFromFileEntry(e2eConfig, file)
    }) as GoogleAppsScript.Base.Blob[]
    MailApp.sendEmail({
      to: config.globals.to,
      subject: `${config.globals.subjectPrefix}${mail.subject}`,
      htmlBody: mail.htmlBody,
      attachments: attachments,
    })
  })
}

function initDrive(config: E2EConfig) {
  config.files
    .filter((file) => file.destFolder !== undefined)
    .forEach((file) => {
      const blob = getBlobFromFileEntry(e2eConfig, file)
      const folderLocation = config.folders.reduce((prev, current) =>
        current.name === file.destFolder ? current : prev,
      )
      GMail2GDrive.Lib.E2E.DriveUtils.createFile(
        GMail2GDrive.Lib.E2E.defaultContext(
          GMail2GDrive.Lib.E2E.RunMode.DANGEROUS,
        ),
        `${folderLocation.location}/${file.filename}`,
        new GMail2GDrive.Lib.E2E.FileContent(blob),
        GMail2GDrive.Lib.E2E.ConflictStrategy.REPLACE,
      )
    })
}
