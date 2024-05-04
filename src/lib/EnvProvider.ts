import {
  ContextType,
  EnvContext,
  MetaInfoType as MIT,
  MetaInfo,
  RunMode,
  newMetaInfo as mi,
} from "./Context"
import { Logger as Log } from "./utils/Logger"

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
