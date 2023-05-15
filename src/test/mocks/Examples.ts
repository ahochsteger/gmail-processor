import { RunMode } from "../../lib/Context"
import { newConfig } from "../../lib/config/Config"
import { GmailProcessor } from "../../lib/processors/GmailProcessor"
import { MockFactory } from "../mocks/MockFactory"

const gmailProcessor = new GmailProcessor()
const envContext = MockFactory.newMocks(
  newConfig(),
  RunMode.SAFE_MODE,
).envContext

function run(configJson: Record<string, unknown>) {
  console.log("Processing started ...")
  gmailProcessor.runWithConfigJson(envContext, configJson)
  console.log("Processing finished ...")
}

/**
 * @param configJson GMail2GDrive v1 configuration JSON
 * @param runMode The runtime mode controls the behavior of actions
 */
function runWithV1Config(configJson: Record<string, unknown>) {
  gmailProcessor.runWithV1ConfigJson(envContext, configJson)
}

/**
 * Add defaults to a JSON configuration
 * @param configJson JSON representation of the configuration without defaults
 * @returns JSON representation of the configuration with defaults added
 */
function getEffectiveConfig(configJson: Record<string, unknown>) {
  return gmailProcessor.getEffectiveConfig(configJson)
}

/**
 * Add defaults to a JSON v1 configuration
 * @param v1configJson JSON representation of the v1 configuration without defaults
 * @returns JSON representation of the configuration with defaults added
 */
function getEffectiveConfigV1(v1configJson: Record<string, unknown>) {
  return gmailProcessor.getEffectiveConfigV1(v1configJson)
}

export const GMail2GDrive = {
  Lib: {
    run,
    runWithV1Config,
    getEffectiveConfig,
    getEffectiveConfigV1,
  },
}