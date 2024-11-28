import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { E2EDefaults } from "../../lib/e2e/E2EDefaults"
import { Example, ExampleCategory, ExampleInfo } from "../Example"
import { ProcessingStatus } from "./../../lib/Context"
import { ProcessingStage } from "./../../lib/config/ActionConfig"
import { Config } from "./../../lib/config/Config"
import { MarkProcessedMethod } from "./../../lib/config/SettingsConfig"

/**
 * This example demonstrates the usage of the action `thread.removeLabel`.
 * It is also used to test a possible behavioral change for certain characters in label names (e.g. `-` vs. `/`).
 */
export const info: ExampleInfo = {
  name: "actionThreadRemoveLabel",
  title: "Remove Thread Label",
  description: "The action `thread.removeLabel` removes a label from a thread.",
  category: ExampleCategory.ACTIONS,
  issues: [303],
}

export const initConfig: E2EInitConfig = {
  mails: [{}],
}

export const runConfig: Config = {
  description: info.description,
  global: {
    thread: {
      match: {
        query: `from:{{user.email}} to:{{user.email}} after:{{date.now|formatDate('yyyy-MM-dd')}} subject:'${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}'`,
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

export const example: Example = {
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
  example,
  info,
  initConfig,
  runConfig,
  tests,
}
