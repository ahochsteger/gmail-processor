import { EnvContext, RunMode } from "../Context"
import { EnvProvider } from "../EnvProvider"
import {
  ConflictStrategy,
  DriveUtils,
  FileContent,
} from "../adapter/GDriveAdapter"

export type FileConfig = {
  name: string
  type: string
  filename: string
  ref: string
  destFolder: string
}

export class E2EConfig {
  public globals: {
    repoBaseUrl: string
    subjectPrefix: string
    to: string
  } = {
    repoBaseUrl: "",
    subjectPrefix: "",
    to: "",
  }
  public folders: {
    name: string
    location: string
  }[] = []
  public files: FileConfig[] = []
  public mails: {
    name: string
    subject: string
    htmlBody: string
    files: string[]
  }[] = []
}

export class E2E {
  public static getBlobFromFileEntry(
    config: E2EConfig,
    file: FileConfig,
  ): GoogleAppsScript.Base.Blob | undefined {
    let blob
    switch (file.type) {
      case "repo": {
        const url = `${config.globals.repoBaseUrl}/${file.ref}`
        console.log(`Fetching repo file from ${url} ...`)
        blob = UrlFetchApp.fetch(url).getBlob()
        break
      }
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

  public static initMails(ctx: EnvContext, config: E2EConfig) {
    ctx.log.info("GMail initialization started.")
    config.mails.forEach((mail) => {
      const files: string[] = mail.files ?? []
      const attachments: GoogleAppsScript.Base.Blob[] = files.map((name) => {
        const file = config.files.reduce((prev, curr) =>
          name === curr.name ? curr : prev,
        )
        return this.getBlobFromFileEntry(config, file)
      }) as GoogleAppsScript.Base.Blob[]
      ctx.env.mailApp.sendEmail({
        to: config.globals.to,
        subject: `${config.globals.subjectPrefix}${mail.subject}`,
        htmlBody: mail.htmlBody,
        attachments: attachments,
      })
    })
    ctx.log.info("GMail initialization finished.")
  }

  public static initDrive(ctx: EnvContext, config: E2EConfig) {
    ctx.log.info("GDrive initialization started.")
    config.files
      .filter((file) => file.destFolder !== undefined)
      .forEach((file) => {
        const blob = this.getBlobFromFileEntry(config, file)
        if (!blob) return
        const folderLocation = config.folders.reduce((prev, current) =>
          current.name === file.destFolder ? current : prev,
        )
        DriveUtils.createFile(
          ctx,
          `${folderLocation.location}/${file.filename}`,
          new FileContent(blob),
          ConflictStrategy.REPLACE,
        )
      })
    ctx.log.info("GDrive initialization finished.")
  }

  public static initAll(
    config: E2EConfig,
    ctx: EnvContext = EnvProvider.defaultContext(RunMode.DANGEROUS),
  ) {
    ctx.log.info("E2E initialization started.")
    this.initDrive(ctx, config)
    this.initMails(ctx, config)
    ctx.log.info("E2E initialization finished.")
  }
}
