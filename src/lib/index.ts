import { PartialDeep } from "type-fest"
import { EnvContext, ProcessingResult, RunMode } from "./Context"
import { Config, RequiredConfig, configToJson } from "./config/Config"
import { V1Config, newV1Config } from "./config/v1/V1Config"
import { V1ToV2Converter } from "./config/v1/V1ToV2Converter"
import { GmailProcessor } from "./processors/GmailProcessor"
import { Logger } from "./utils/Logger"

const gmailProcessor = new GmailProcessor()

function defaultContext(runMode = RunMode.SAFE_MODE) {
  const logger = new Logger()
  const ctx: EnvContext = {
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
    log: logger,
  }
  return ctx
}

/**
 * @param configJson GMail2GDrive configuration JSON
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
