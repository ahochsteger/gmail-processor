import * as GmailProcessorLib from "../../lib"
import {
  E2EInfo,
  E2EInitConfig,
  E2ETest,
  E2ETestConfig,
} from "../../lib/e2e/E2E"

export const info: E2EInfo = {
  name: "__E2E_TEST_FILE_BASENAME__",
  title: "thread.removeLabel",
  description:
    "Demonstrates the usage of the action `thread.removeLabel` and is used to test a possible behavioral change for label names (e.g. `-` vs. `/`).",
  tags: ["docs", "features", "actions"],
  issues: ["303"],
}

export const initConfig: E2EInitConfig = {
  mails: [{ subject: info.name }],
}

export const runConfig: GmailProcessorLib.Config = {
  global: {
    thread: {
      match: {
        query:
          "from:${user.email} to:${user.email} after:${date.now:date::yyyy-MM-dd}",
      },
    },
  },
  settings: {
    markProcessedMethod: GmailProcessorLib.MarkProcessedMethod.CUSTOM,
  },
  threads: [
    {
      match: {
        query: `subject:([GmailProcessor-Test] ${info.name})`,
      },
      actions: [
        {
          name: "thread.addLabel",
          processingStage: GmailProcessorLib.ProcessingStage.PRE_MAIN,
          args: {
            name: "accounting-process",
          },
        },
        {
          name: "thread.markRead",
          processingStage: GmailProcessorLib.ProcessingStage.POST_MAIN,
        },
        {
          name: "thread.removeLabel",
          processingStage: GmailProcessorLib.ProcessingStage.POST_MAIN,
          args: {
            name: "accounting-process",
          },
        },
        {
          name: "thread.addLabel",
          processingStage: GmailProcessorLib.ProcessingStage.POST_MAIN,
          args: {
            name: "accounting-autoinvoice",
          },
        },
      ],
    },
  ],
}

export const tests: E2ETest[] = [
  {
    message: "No failures",
    assertions: [
      {
        message: "Processing status should be OK",
        assertFn: (_testConfig, procResult) =>
          procResult.status === GmailProcessorLib.ProcessingStatus.OK,
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
