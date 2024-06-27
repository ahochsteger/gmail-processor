// NOTE: Do not edit this auto-generated file!

function getTestConfigs() {
  // TODO: Add option to parameterize which ones to execute.
  return [
    actionAttachmentExtractTextTestConfig(),
    actionExportTestConfig(),
    actionThreadRemoveLabelTestConfig(),
    convertToGoogleTestConfig(),
    customActionsTestConfig(),
    issue301TestConfig(),
    logSheetLoggingTestConfig(),
    migrationAdvancedTestConfig(),
    migrationMinTestConfig(),
    regularExpressionsTestConfig(),
    simpleTestConfig(),
  ]
}

function initAllTests() {
  GmailProcessorLib.E2E.initAllTests(
    getTestConfigs(),
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}

function runAllTests(skipInit=true) {
  GmailProcessorLib.E2E.runAllTests(
    getTestConfigs(),
    skipInit,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
