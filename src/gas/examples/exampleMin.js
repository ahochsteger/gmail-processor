/* global GmailProcessor */

const exampleMinConfigV2 = {
  threads: [{}],
}

function exampleMinEffectiveConfig() {
  const effectiveConfig =
    GmailProcessor.Lib.getEffectiveConfig(exampleMinConfigV2)
  console.log(JSON.stringify(effectiveConfig, null, 2))
}

function exampleMinRun() {
  GmailProcessor.Lib.run(exampleMinConfigV2, "dry-run")
}
