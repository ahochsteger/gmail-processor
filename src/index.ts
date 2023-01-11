import { Config } from "./config/Config"
import { GmailProcessor } from "./processors/GmailProcessor"
import { V1Config } from "./config/v1/V1Config"
import { V1ToV2Converter } from "./config/v1/V1ToV2Converter"
import { plainToClass } from "class-transformer"

/**
 * @param config GMail2GDrive configuration
 * @param dryRun Just show what would have been done but don't write anything to GMail or GDrive.
 */
export function run(configJson: Config, dryRun = false) {
  const config = plainToClass(Config, configJson)
  const gmailProcessor = new GmailProcessor()
  gmailProcessor.run(config, dryRun)
}

export function runWithV1Config(v1configJson: object, dryRun = false) {
  const configV1 = plainToClass(V1Config, v1configJson)
  const config = V1ToV2Converter.v1ConfigToV2Config(configV1)
  console.warn(
    "Using deprecated v1 config format - switching to the new v2 config format is strongly recommended!",
  )
  run(config, dryRun)
}
