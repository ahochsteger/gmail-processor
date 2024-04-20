import { V1Config } from "../../lib"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { Example, ExampleInfo } from "../Example"

export const info: ExampleInfo = {
  name: "migrationMin",
  title: "Minimal Migration",
  description:
    "This is a minimal Gmail2GDrive v1.x configuration example to demonstrate the conversion to the Gmail Processor v2.x config format.",
  category: "migrations",
  generate: ["docs", "test-e2e", "test-spec"],
  schemaVersion: "v1",
}

export const initConfig: E2EInitConfig = {
  mails: [{ subject: info.name }],
}

export const migrationConfig: V1Config = {
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

export const migrationMinExample: Example = {
  info,
  config: migrationConfig,
}

export const tests: E2ETest[] = []

export const testConfig: E2ETestConfig = {
  info,
  initConfig,
  migrationConfig,
  tests,
}
