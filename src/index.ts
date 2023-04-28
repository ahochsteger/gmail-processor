import { EnvContext } from "./Context"
import { GmailProcessor } from "./processors/GmailProcessor"
import { Timer } from "./utils/Timer"

const envContext: EnvContext = {
  cacheService: CacheService,
  gdriveApp: DriveApp,
  gmailApp: GmailApp,
  spreadsheetApp: SpreadsheetApp,
  utilities: Utilities,
  dryRun: false,
  timer: new Timer(),
}
const gmailProcessor = new GmailProcessor()

/**
 * @param configJson GMail2GDrive configuration JSON
 * @param dryRun Just show what would have been done but don't write anything to GMail or GDrive.
 */
export function run(configJson: Record<string, unknown>, dryRun = false) {
  console.log("Processing started ...")
  gmailProcessor.runWithConfigJson(envContext, configJson, dryRun)
  console.log("Processing finished ...")
}

/**
 * @param configJson GMail2GDrive v1 configuration JSON
 * @param dryRun Just show what would have been done but don't write anything to GMail or GDrive.
 */
export function runWithV1Config(
  configJson: Record<string, unknown>,
  dryRun = false,
) {
  gmailProcessor.runWithV1ConfigJson(envContext, configJson, dryRun)
}

/**
 * Add defaults to a JSON configuration
 * @param configJson JSON representation of the configuration without defaults
 * @returns JSON representation of the configuration with defaults added
 */
export function getEffectiveConfig(configJson: Record<string, unknown>) {
  return gmailProcessor.getEffectiveConfig(configJson)
}
