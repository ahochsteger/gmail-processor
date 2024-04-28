// NOTE: Do not edit this auto-generated file!
// Template: src/examples/_templates/test-e2e.tmpl
// Source: src/examples/migrations/migrationMin.ts

function migrationMinTest() {
  const info = {
    name: "migrationMin",
    title: "Minimal Migration",
    description:
      "This is a minimal Gmail2GDrive v1.x configuration example to demonstrate the conversion to the Gmail Processor v2.x config format.",
    category: "migrations",
    generate: ["docs", "test-e2e", "test-spec"],
    schemaVersion: "v1",
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

  const migrationMinExample = {
    info,
    config: migrationConfig,
  }

  const tests = []

  const testConfig = {
    info,
    initConfig,
    migrationConfig,
    tests,
  }
  GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
