import { EnvContext, RunMode } from "./Context"
import { configToJson } from "./config/Config"
import { jsonToV1Config } from "./config/v1/V1Config"
import { V1ToV2Converter } from "./config/v1/V1ToV2Converter"
import { GmailProcessor } from "./processors/GmailProcessor"

const gmailProcessor = new GmailProcessor()

/**
 * @param configJson GMail2GDrive configuration JSON
 * @param runMode Just show what would have been done but don't write anything to GMail or GDrive.
 */
export function run(
  configJson: Record<string, unknown>,
  runMode = RunMode.SAFE_MODE,
  ctx: EnvContext = gmailProcessor.defaultContext(runMode),
) {
  gmailProcessor.runWithJson(configJson, runMode, ctx)
}

/**
 * @param v1configJson GMail2GDrive v1 configuration JSON
 * @param runMode The runtime mode controls the behavior of actions
 */
export function runWithV1Config(
  v1configJson: Record<string, unknown>,
  runMode = RunMode.SAFE_MODE,
  ctx: EnvContext = gmailProcessor.defaultContext(runMode),
) {
  ctx.log.info("Processing v1 legacy config: ", v1configJson)
  ctx.env.runMode = runMode
  const v1config = jsonToV1Config(v1configJson)
  const config = V1ToV2Converter.v1ConfigToV2Config(v1config)
  ctx.log.warn(
    "Using deprecated v1 config format - switching to the new v2 config format is strongly recommended:\n",
    configToJson(config),
  )
  gmailProcessor.run(config, ctx)
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
  const v1config = jsonToV1Config(v1configJson)
  return V1ToV2Converter.v1ConfigToV2Config(v1config)
}
