import {
  ContextType,
  EnvContext,
  MetaInfoType as MIT,
  MetaInfo,
  RunMode,
  newMetaInfo as mi,
} from "./Context"
import { Logger as Log } from "./utils/Logger"

const packageInfo: {
  description: string
  name: string
  version: string
} =
  typeof __PACKAGE_JSON__ !== "undefined"
    ? __PACKAGE_JSON__
    : { version: "0.0.0", name: "gmail-processor", description: "" }

export class EnvProvider {
  public static buildMetaInfo(ctx: EnvContext) {
    const m: MetaInfo = {
      "date.now": mi(
        MIT.DATE,
        () => new Date(),
        "Current Timestamp",
        "The current timestamp.",
      ),
      "env.runMode": mi(
        MIT.STRING,
        () => ctx.env.runMode,
        "Runmode",
        "The runMode used for processing.",
      ),
      "env.timezone": mi(
        MIT.STRING,
        () => ctx.env.timezone,
        "Timezone",
        "The timezone used for processing.",
      ),
      "lib.description": mi(
        MIT.STRING,
        () => packageInfo.description,
        "Library Description",
        "The description of the Gmail Processor library.",
      ),
      "lib.name": mi(
        MIT.STRING,
        () => packageInfo?.name,
        "Library Name",
        "The name of the Gmail Processor library.",
      ),
      "lib.version": mi(
        MIT.STRING,
        () => packageInfo?.version,
        "Library Version",
        "The version of the Gmail Processor library.",
      ),
      "user.email": mi(
        MIT.STRING,
        () => ctx.env.session.getActiveUser().getEmail(),
        "User Email",
        "The email address of the active user.",
      ),
    }
    return m
  }

  public static defaultContext(runMode = RunMode.SAFE_MODE) {
    const logger = new Log()
    const ctx: EnvContext = {
      type: ContextType.ENV,
      env: {
        cacheService: CacheService,
        gdriveApp: DriveApp,
        documentApp: DocumentApp,
        driveApi: Drive,
        gmailApp: GmailApp,
        mailApp: MailApp,
        spreadsheetApp: SpreadsheetApp,
        utilities: Utilities,
        runMode: runMode,
        session: Session,
        timezone: Session?.getScriptTimeZone() || "UTC",
        urlFetchApp: UrlFetchApp,
      },
      envMeta: {},
      log: logger,
      meta: {},
    }
    ctx.envMeta = this.buildMetaInfo(ctx)
    ctx.meta = { ...ctx.envMeta }
    return ctx
  }
}
