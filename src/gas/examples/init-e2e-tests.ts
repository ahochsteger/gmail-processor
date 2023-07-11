/* global DriveApp, MailApp, Session, UrlFetchApp */

const e2eConfig = {
  globals: {
    subjectPrefix: "[GmailProcessor-Test] ",
    to: Session.getActiveUser().getEmail(),
  },
  files: [
    {
      name: "gmailLogo",
      type: "url",
      filename: "gmail-logo.png",
      mimeType: "image/png",
      ref: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/320px-Gmail_icon_%282020%29.svg.png",
    },
    {
      name: "plaintext",
      type: "gdrive",
      filename: "plain-text-attachment.txt",
      mimeType: "text/plain",
      ref: "1Jspl_MHY7LXb71z5tzk0yvVPvOfM6nd9",
    },
  ],
  mails: [
    {
      name: "01-multiple",
      subject: "Test Mail with attachments",
      htmlBody: "Test email with multiple attachments from different sources.",
      files: ["gmailLogo", "plaintext"],
    },
  ],
}

export function initE2eTests() {
  e2eConfig.mails.forEach((mail) => {
    const files: string[] = mail.files ?? []
    const attachments: GoogleAppsScript.Base.Blob[] = files.map((name) => {
      const file = e2eConfig.files.reduce((prev, curr) =>
        name === curr.name ? curr : prev,
      )
      if (file.type === "url") {
        const resp = UrlFetchApp.fetch(file.ref)
        return resp.getBlob()
      } else if (file.type === "gdrive") {
        const gdriveFile = DriveApp.getFileById(file.ref)
        return gdriveFile.getBlob()
      }
    }) as GoogleAppsScript.Base.Blob[]
    MailApp.sendEmail({
      to: e2eConfig.globals.to,
      subject: `${e2eConfig.globals.subjectPrefix}${mail.subject}`,
      htmlBody: mail.htmlBody,
      attachments: attachments,
    })
  })
}
