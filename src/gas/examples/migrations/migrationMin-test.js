// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/migrations/migrationMin.ts

function migrationMinTestConfig() {
  /**
   * This is a minimal Gmail2GDrive v1.x configuration example to demonstrate the conversion to the Gmail Processor v2.x config format.
   */
  const info = {
    name: "migrationMin",
    title: "Minimal Migration",
    description:
      "Migrate a minimal Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format.",
    category: "migrations",
    variant: "migration-v1",
  }

  const initConfig = {
    mails: [{}],
  }

  const migrationConfig = {
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

  const example = {
    info,
    migrationConfig,
  }

  const tests = []

  const testConfig = {
    example,
    info,
    initConfig,
    migrationConfig,
    tests,
  }
  return testConfig
}

function migrationMinTest() {
  const testConfig = migrationMinTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
