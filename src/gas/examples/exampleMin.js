/* global GMail2GDrive */

var exampleMinConfigV2 = {
  threads: [{}],
}

function exampleMinEffectiveConfig() {
  const effectiveConfig =
    GMail2GDrive.Lib.getEffectiveConfig(exampleMinConfigV2)
  console.log(JSON.stringify(effectiveConfig, null, 2))
}

function exampleMinRun() {
  GMail2GDrive.Lib.run(exampleMinConfigV2, "dry-run")
}
