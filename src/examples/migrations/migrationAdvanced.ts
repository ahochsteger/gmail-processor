import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import * as GmailProcessorLib from "../../lib/index"
import {
  ExampleCategory,
  ExampleInfo,
  ExampleVariant,
  V1Example,
} from "../Example"

/**
 * This Gmail2GDrive v1.x configuration example demonstrates the conversion to the Gmail Processor v2.x config format.
 */
export const info: ExampleInfo = {
  name: "migrationAdvanced",
  title: "Advanced Migration",
  description:
    "Migrate a complex Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format.",
  category: ExampleCategory.MIGRATIONS,
  variant: ExampleVariant.MIGRATION_V1,
}

export const initConfig: E2EInitConfig = {
  mails: [{}],
}

export const migrationConfig: GmailProcessorLib.V1Config = {
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

export const example: V1Example = {
  info,
  migrationConfig,
}

export const tests: E2ETest[] = []

export const testConfig: E2ETestConfig = {
  example,
  info,
  initConfig,
  migrationConfig,
  tests,
}
