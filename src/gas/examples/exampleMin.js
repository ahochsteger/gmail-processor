const exampleMinConfigV2 = {
  threads: [{}],
}

function exampleMinRun() {
  GmailProcessorLib.run(exampleMinConfigV2, "dry-run")
}
