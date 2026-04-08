import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import {
  ExampleCategory,
  ExampleInfo,
  ExampleVariant,
  V1Example,
} from "../Example"
import { V1Config } from "./../../lib/config/v1/V1Config"

/**
 * This is a minimal Gmail2GDrive v1.x configuration example to demonstrate the conversion to the Gmail Processor v2.x config format.
 */
export const info: ExampleInfo = {
  name: "migrationMin",
  title: "Minimal Migration",
  description:
    "Migrate a minimal Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format.",
  category: ExampleCategory.MIGRATIONS,
  variant: ExampleVariant.MIGRATION_V1,
}

export const initConfig: E2EInitConfig = {
  mails: [{}],
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

export const example: V1Example = {
  info,
  migrationConfig,
}

import { ProcessingStatus } from "../../lib/Context"

export const tests: E2ETest[] = [
  {
    message: "No failures",
    assertions: [
      {
        message: "Processing status should not be ERROR",
        assertFn: (_testConfig, procResult) =>
          procResult.status !== ProcessingStatus.ERROR,
      },
      {
        message: "No error should have occurred",
        assertFn: (_testConfig, procResult) => procResult.error === undefined,
      },
    ],
  },
]

export const testConfig: E2ETestConfig = {
  example,
  info,
  initConfig,
  migrationConfig,
  tests,
}
