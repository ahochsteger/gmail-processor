// NOTE: Do not edit this auto-generated file!

function getTestConfigs() {
  // TODO: Add option to parameterize which ones to execute.
  return [
    actionAttachmentExtractTextTestConfig(),
    actionExportTestConfig(),
    actionThreadRemoveLabelTestConfig(),
    conflictStrategyTestConfig(),
    convertToGoogleTestConfig(),
    customActionsTestConfig(),
    customActionsAdvancedTestConfig(),
    dateExpressionsTestConfig(),
    decryptPdfTestConfig(),
    headerMatchingTestConfig(),
    issue301TestConfig(),
    legacyExpressionsTestConfig(),
    logSheetLoggingTestConfig(),
    migrationAdvancedTestConfig(),
    migrationMinTestConfig(),
    regularExpressionsTestConfig(),
    simpleTestConfig(),
    stringFnExpressionsTestConfig(),
  ]
}

function initAllTests() {
  return GmailProcessorLib.E2E.initAllTests(
    getTestConfigs(),
    E2E_REPO_BRANCH,
    GmailProcessorLib.EnvProvider.defaultContext({
      runMode: GmailProcessorLib.RunMode.DANGEROUS,
      cacheService: CacheService,
      propertiesService: PropertiesService,
    }),
  )
}

function runAllTests(skipInit = true, testRunId = undefined) {
  return GmailProcessorLib.E2E.runAllTests(
    getTestConfigs(),
    skipInit,
    E2E_REPO_BRANCH,
    GmailProcessorLib.EnvProvider.defaultContext({
      runMode: GmailProcessorLib.RunMode.DANGEROUS,
      cacheService: CacheService,
      propertiesService: PropertiesService,
    }),
    testRunId,
  )
}

function initAndRunAllTests() {
  const testRunId = initAllTests()
  Utilities.sleep(5000)
  return JSON.stringify(runAllTests(true, testRunId))
}
