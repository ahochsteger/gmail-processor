import { PartialDeep } from "type-fest"
import {
  ContextType,
  EnvContext,
  MetaInfoType as MIT,
  MetaInfo,
  ProcessingResult,
  RunMode,
  newMetaInfo as mi,
} from "./Context"
import {
  ConflictStrategy,
  DriveUtils,
  FileContent,
} from "./adapter/GDriveAdapter"
import { Config, RequiredConfig, configToJson } from "./config/Config"
import { V1Config, newV1Config } from "./config/v1/V1Config"
import { V1ToV2Converter } from "./config/v1/V1ToV2Converter"
import { GmailProcessor } from "./processors/GmailProcessor"
import { Logger } from "./utils/Logger"

const gmailProcessor = new GmailProcessor()

export function buildMetaInfo(ctx: EnvContext) {
  const m: MetaInfo = {
    "date.now": mi(MIT.DATE, () => new Date(), "The current timestamp."),
    "env.runMode": mi(
      MIT.STRING,
      () => ctx.env.runMode,
      "The runmode used for processing.",
    ),
    "env.timezone": mi(
      MIT.STRING,
      () => ctx.env.timezone,
      "The timezone used for processing.",
    ),
    "user.email": mi(
      MIT.STRING,
      () => ctx.env.session.getActiveUser().getEmail(),
      "The email address of the active user.",
    ),
  }
  return m
}

export function defaultContext(runMode = RunMode.SAFE_MODE) {
  const logger = new Logger()
  const ctx: EnvContext = {
    type: ContextType.ENV,
    env: {
      cacheService: CacheService,
      gdriveApp: DriveApp,
      gmailApp: GmailApp,
      spreadsheetApp: SpreadsheetApp,
      utilities: Utilities,
      runMode: runMode,
      session: Session,
      timezone: Session?.getScriptTimeZone() || "UTC",
    },
    envMeta: {},
    log: logger,
    meta: {},
  }
  ctx.envMeta = buildMetaInfo(ctx)
  ctx.meta = { ...ctx.envMeta }
  return ctx
}

/**
 * @param configJson GmailProcessor configuration JSON
 * @param runMode Just show what would have been done but don't write anything to GMail or GDrive.
 */
export function run(
  configJson: PartialDeep<Config>,
  runMode: string = RunMode.SAFE_MODE,
  ctx: EnvContext = defaultContext(runMode as RunMode),
): ProcessingResult {
  return gmailProcessor.runWithJson(configJson, ctx)
}

/**
 * @param v1configJson GMail2GDrive v1 configuration JSON
 * @param runMode The runtime mode controls the behavior of actions
 */
export function runWithV1Config(
  v1configJson: PartialDeep<V1Config>,
  runMode: string = RunMode.SAFE_MODE,
  ctx: EnvContext = defaultContext(runMode as RunMode),
): ProcessingResult {
  ctx.log.info("Processing v1 legacy config: ", v1configJson)
  ctx.env.runMode = runMode as RunMode
  const v1config = newV1Config(v1configJson)
  const config = V1ToV2Converter.v1ConfigToV2Config(v1config)
  ctx.log.warn(
    "Using deprecated v1 config format - switching to the new v2 config format is strongly recommended:\n",
    configToJson(config),
  )
  return gmailProcessor.run(config, ctx)
}

/**
 * Add defaults to a JSON configuration
 * @param configJson JSON representation of the configuration without defaults
 * @returns JSON representation of the configuration with defaults added
 */
export function getEffectiveConfig(
  configJson: PartialDeep<Config>,
): RequiredConfig {
  return gmailProcessor.getEffectiveConfig(configJson)
}

/**
 * Removes defaults from a JSON configuration
 * @param configJson JSON representation of the configuration possibly including defaults
 * @returns JSON representation of the configuration with defaults removed
 */
export function getEssentialConfig(
  configJson: PartialDeep<Config>,
): PartialDeep<Config> {
  return gmailProcessor.getEssentialConfig(configJson)
}

/**
 * Add defaults to a JSON v1 configuration
 * @param v1configJson JSON representation of the v1 configuration without defaults
 * @returns JSON representation of the configuration with defaults added
 */
export function getEffectiveConfigV1(
  v1configJson: PartialDeep<V1Config>,
): RequiredConfig {
  const v1config = newV1Config(v1configJson)
  return V1ToV2Converter.v1ConfigToV2Config(v1config)
}

/**
 * Convert v1 configuration JSON to v2 configuration
 * @param v1configJson JSON representation of the v1 configuration without defaults
 * @returns Converted JSON representation of the configuration, omitting default values
 */
export function convertV1ConfigToV2Config(
  v1configJson: PartialDeep<V1Config>,
): PartialDeep<Config> {
  return V1ToV2Converter.v1ConfigToV2ConfigJson(v1configJson)
}

// E2E Functionality (TODO: Move to E2ETests.ts)

type FileConfig = {
  name: string
  type: string
  filename: string
  ref: string
  destFolder: string
}

export type E2EConfig = {
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

function getBlobFromFileEntry(
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

function initMails(config: E2EConfig) {
  config.mails.forEach((mail) => {
    const files: string[] = mail.files ?? []
    const attachments: GoogleAppsScript.Base.Blob[] = files.map((name) => {
      const file = config.files.reduce((prev, curr) =>
        name === curr.name ? curr : prev,
      )
      return getBlobFromFileEntry(config, file)
    }) as GoogleAppsScript.Base.Blob[]
    MailApp.sendEmail({
      to: config.globals.to,
      subject: `${config.globals.subjectPrefix}${mail.subject}`,
      htmlBody: mail.htmlBody,
      attachments: attachments,
    })
  })
}

export function initDrive(config: E2EConfig) {
  config.files
    .filter((file) => file.destFolder !== undefined)
    .forEach((file) => {
      const blob = getBlobFromFileEntry(config, file)
      if (!blob) return
      const folderLocation = config.folders.reduce((prev, current) =>
        current.name === file.destFolder ? current : prev,
      )
      DriveUtils.createFile(
        defaultContext(RunMode.DANGEROUS),
        `${folderLocation.location}/${file.filename}`,
        new FileContent(blob),
        ConflictStrategy.REPLACE,
      )
    })
}

export function E2EInit(config: E2EConfig) {
  initDrive(config)
  initMails(config)
}
