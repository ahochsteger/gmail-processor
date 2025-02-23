// NOTE: Do not edit this auto-generated file!

function getTestConfigs() {
  // TODO: Add option to parameterize which ones to execute.
  return [
    actionAttachmentExtractTextTestConfig(),
    actionExportTestConfig(),
    actionThreadRemoveLabelTestConfig(),
    convertToGoogleTestConfig(),
    customActionsTestConfig(),
    dateExpressionsTestConfig(),
    decryptPdfTestConfig(),
    issue301TestConfig(),
    legacyExpressionsTestConfig(),
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

function runAllTests(skipInit = true) {
  return GmailProcessorLib.E2E.runAllTests(
    getTestConfigs(),
    skipInit,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}

function initAndRunAllTests() {
  initAllTests()
  Utilities.sleep(5000)
  return JSON.stringify(runAllTests())
}
