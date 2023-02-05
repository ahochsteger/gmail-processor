import { GmailProcessor } from "./processors/GmailProcessor"

const gmailProcessor = new GmailProcessor()

/**
 * @param configJson GMail2GDrive configuration JSON
 * @param dryRun Just show what would have been done but don't write anything to GMail or GDrive.
 */
export function run(configJson: object, dryRun = false) {
  gmailProcessor.runWithConfigJson(configJson, dryRun)
}

/**
 * @param v1configJson GMail2GDrive v1 configuration JSON
 * @param dryRun Just show what would have been done but don't write anything to GMail or GDrive.
 */
export function runWithV1Config(v1configJson: object, dryRun = false) {
  gmailProcessor.runWithV1ConfigJson(v1configJson, dryRun)
}
