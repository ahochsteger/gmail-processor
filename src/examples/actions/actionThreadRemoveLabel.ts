import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { E2EDefaults } from "../../lib/e2e/E2EDefaults"
import { Example, ExampleInfo } from "../Example"
import { ProcessingStatus } from "./../../lib/Context"
import { ProcessingStage } from "./../../lib/config/ActionConfig"
import { Config } from "./../../lib/config/Config"
import { MarkProcessedMethod } from "./../../lib/config/SettingsConfig"

export const info: ExampleInfo = {
  name: "actionThreadRemoveLabel",
  title: "thread.removeLabel",
  description:
    "Demonstrates the usage of the action `thread.removeLabel` and is used to test a possible behavioral change for label names (e.g. `-` vs. `/`).",
  category: "actions",
  generate: ["docs", "test-e2e", "test-spec"],
  issues: [303],
  schemaVersion: "v2",
}

export const initConfig: E2EInitConfig = {
  mails: [{}],
}

export const runConfig: Config = {
  description: info.description,
  global: {
    thread: {
      match: {
        query: `from:\${user.email} to:\${user.email} after:\${date.now:date::yyyy-MM-dd} subject:'${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}'`,
      },
    },
  },
  settings: {
    markProcessedMethod: MarkProcessedMethod.CUSTOM,
  },
  threads: [
    {
      match: {
        query: `subject:([GmailProcessor-Test] ${info.name})`,
      },
      actions: [
        {
          name: "thread.addLabel",
          processingStage: ProcessingStage.PRE_MAIN,
          args: {
            name: "accounting-process",
          },
        },
        {
          name: "thread.markRead",
          processingStage: ProcessingStage.POST_MAIN,
        },
        {
          name: "thread.removeLabel",
          processingStage: ProcessingStage.POST_MAIN,
          args: {
            name: "accounting-process",
          },
        },
        {
          name: "thread.addLabel",
          processingStage: ProcessingStage.POST_MAIN,
          args: {
            name: "accounting-autoinvoice",
          },
        },
      ],
    },
  ],
}

export const actionThreadRemoveLabelExample: Example = {
  info,
  config: runConfig,
}

export const tests: E2ETest[] = [
  {
    message: "No failures",
    assertions: [
      {
        message: "Processing status should be OK",
        assertFn: (_testConfig, procResult) =>
          procResult.status === ProcessingStatus.OK,
      },
      {
        message: "At least one thread should have been processed",
        assertFn: (_testConfig, procResult) => procResult.processedThreads >= 1,
      },
      {
        message: "Expected number of actions should have been executed",
        assertFn: (_testConfig, procResult) =>
          procResult.executedActions.length === procResult.processedThreads * 4,
      },
    ],
  },
]

export const testConfig: E2ETestConfig = {
  info,
  initConfig,
  runConfig,
  tests,
}
