import * as GmailProcessorLib from "../../lib/index"

/** @type {GmailProcessorLib.V1Config} */
export const migrationExampleMinConfig = {
  processedLabel: "gmail2gdrive/client-test",
  sleepTime: 100,
  maxRuntime: 280,
  newerThan: "2m",
  timezone: "GMT",
  rules: [
    {
      filter: "to:my.name+scans@gmail.com",
      folder: "'Scans'-yyyy-MM-dd",
    },
  ],
}

export function migrationExampleMinConvertConfig() {
  const config = GmailProcessorLib.convertV1Config(migrationExampleMinConfig)
  console.log(JSON.stringify(config, null, 2))
  return config
}
