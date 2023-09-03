/** @type {V1Config} */
const migrationExampleMinConfig = {
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

function migrationExampleMinConvertConfig() {
  const config = GmailProcessorLib.convertV1Config(migrationExampleMinConfig)
  console.log(JSON.stringify(config, null, 2))
  return config
}
