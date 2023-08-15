/* global GMail2GDrive */

var exampleMinConfigV1 = {
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

function exampleMinEffectiveConfig() {
  const effectiveConfig =
    GMail2GDrive.Lib.getEffectiveConfigV1(exampleMinConfigV1)
  console.log(JSON.stringify(effectiveConfig, null, 2))
}

function exampleMinRun() {
  GMail2GDrive.Lib.runWithV1Config(exampleMinConfigV1, "dry-run")
}

function exampleMinConvertConfig() {
  const config = GMail2GDrive.Lib.convertV1ConfigToV2Config(exampleMinConfigV1)
  console.log(JSON.stringify(config, null, 2))
}
