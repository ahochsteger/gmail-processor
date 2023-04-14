import { EnvContext } from "./Context"
import { GmailProcessor } from "./processors/GmailProcessor"

const envContext: EnvContext = {
  cacheService: CacheService,
  gdriveApp: DriveApp,
  gmailApp: GmailApp,
  spreadsheetApp: SpreadsheetApp,
  utilities: Utilities,
}
const gmailProcessor = new GmailProcessor(envContext)

/**
 * @param configJson GMail2GDrive configuration JSON
 * @param dryRun Just show what would have been done but don't write anything to GMail or GDrive.
 */
export function run(configJson: object, dryRun = false) {
  console.log("Processing started ...")
  gmailProcessor.runWithConfigJson(configJson, dryRun)
  console.log("Processing finished ...")
}

/**
 * @param configJson GMail2GDrive v1 configuration JSON
 * @param dryRun Just show what would have been done but don't write anything to GMail or GDrive.
 */
export function runWithV1Config(configJson: object, dryRun = false) {
  gmailProcessor.runWithV1ConfigJson(configJson, dryRun)
}

/**
 * Add defaults to a JSON configuration
 * @param configJson JSON representation of the configuration without defaults
 * @returns JSON representation of the configuration with defaults added
 */
export function getEffectiveConfig(configJson: object) {
  return gmailProcessor.getEffectiveConfig(configJson)
}
