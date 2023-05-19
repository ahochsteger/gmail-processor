/* global GMail2GDrive */

var exampleMinConfigV2 = {}

function exampleMinEffectiveConfig() {
  const effectiveConfig =
    GMail2GDrive.Lib.getEffectiveConfig(exampleMinConfigV2)
  console.log(JSON.stringify(effectiveConfig), null, 2)
}

function exampleMinRun() {
  GMail2GDrive.Lib.runWithV1Config(exampleMinConfigV2, "dry-run")
}
