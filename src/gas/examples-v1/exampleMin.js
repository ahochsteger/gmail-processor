/* global GmailProcessor */

const exampleMinConfigV1 = {
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

function exampleMinConvertConfig() {
  const config = GmailProcessorLib.convertV1Config(exampleMinConfigV1)
  console.log(JSON.stringify(config, null, 2))
}
