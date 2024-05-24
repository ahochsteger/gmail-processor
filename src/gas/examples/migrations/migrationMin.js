function migrationMinConvert() {
  const oldConfig = {
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

  const migratedConfig = GmailProcessorLib.convertV1Config(oldConfig)
  console.log(JSON.stringify(migratedConfig, null, 2))
}
