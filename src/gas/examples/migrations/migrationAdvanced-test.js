// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/migrations/migrationAdvanced.ts

function migrationAdvancedTestConfig() {
  /**
   * This Gmail2GDrive v1.x configuration example demonstrates the conversion to the Gmail Processor v2.x config format.
   */
  const info = {
    name: "migrationAdvanced",
    title: "Advanced Migration",
    description:
      "Migrate a complex Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format.",
    category: "migrations",
    variant: "migration-v1",
  }

  const initConfig = {
    mails: [{}],
  }

  const migrationConfig = {
    globalFilter: "has:attachment -in:trash -in:drafts -in:spam",
    processedLabel: "gmail2gdrive/client-test",
    sleepTime: 100,
    maxRuntime: 280,
    newerThan: "1d",
    timezone: "GMT",
    rules: [
      {
        filter: "to:my.name+scans@gmail.com",
        folder: "'Scans'-yyyy-MM-dd",
      },
      {
        filter: "from:example1@example.com",
        folder: "'Examples/example1'",
      },
      {
        filter: "from:example2@example.com",
        folder: "'Examples/example2'",
        filenameFromRegexp: ".*.pdf$",
      },
      {
        filter: "(from:example3a@example.com OR from:example3b@example.com)",
        folder: "'Examples/example3ab'",
        filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
        archive: true,
      },
      {
        filter: "label:PDF",
        saveThreadPDF: true,
        folder: "'PDF Emails'",
      },
      {
        filter: "from:example4@example.com",
        folder: "'Examples/example4'",
        filenameFrom: "file.txt",
        filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
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

function migrationAdvancedTest() {
  const testConfig = migrationAdvancedTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
