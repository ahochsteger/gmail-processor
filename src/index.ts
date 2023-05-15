import { EnvContext, RunMode } from "./Context"
import { GmailProcessor } from "./processors/GmailProcessor"
import { Logger } from "./utils/Logging"

const logger = new Logger()

const ctx: EnvContext = {
  env: {
    cacheService: CacheService,
    gdriveApp: DriveApp,
    gmailApp: GmailApp,
    spreadsheetApp: SpreadsheetApp,
    utilities: Utilities,
    runMode: RunMode.SAFE_MODE,
    timezone: Session?.getScriptTimeZone() || "UTC",
  },
  log: logger,
}
const gmailProcessor = new GmailProcessor()

/**
 * @param configJson GMail2GDrive configuration JSON
 * @param runMode Just show what would have been done but don't write anything to GMail or GDrive.
 */
export function run(
  configJson: Record<string, unknown>,
  runMode = RunMode.SAFE_MODE,
) {
  ctx.env.runMode = runMode
  gmailProcessor.runWithConfigJson(ctx, configJson)
}

/**
 * @param configJson GMail2GDrive v1 configuration JSON
 * @param runMode The runtime mode controls the behavior of actions
 */
export function runWithV1Config(
  configJson: Record<string, unknown>,
  runMode = RunMode.SAFE_MODE,
) {
  ctx.env.runMode = runMode
  gmailProcessor.runWithV1ConfigJson(ctx, configJson)
}

/**
 * Add defaults to a JSON configuration
 * @param configJson JSON representation of the configuration without defaults
 * @returns JSON representation of the configuration with defaults added
 */
export function getEffectiveConfig(configJson: Record<string, unknown>) {
  return gmailProcessor.getEffectiveConfig(configJson)
}

/**
 * Add defaults to a JSON v1 configuration
 * @param v1configJson JSON representation of the v1 configuration without defaults
 * @returns JSON representation of the configuration with defaults added
 */
export function getEffectiveConfigV1(v1configJson: Record<string, unknown>) {
  return gmailProcessor.getEffectiveConfigV1(v1configJson)
}
