import { ProcessingStatus } from "../../lib/Context"
import { Config } from "../../lib/config/Config"
import { MarkProcessedMethod } from "../../lib/config/SettingsConfig"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import {
  Example,
  ExampleCategory,
  ExampleInfo,
  ExampleVariant,
} from "../Example"
import { E2EDefaults } from "./../../lib/e2e/E2EDefaults"

/**
 * This is an example to demonstrate custom actions.
 */
export const info: ExampleInfo = {
  name: "customActions",
  title: "Custom Actions",
  description:
    "Define custom logic as actions that can be executed during processing.",
  category: ExampleCategory.ADVANCED,
  variant: ExampleVariant.CUSTOM_ACTIONS,
}

export const initConfig: E2EInitConfig = {
  mails: [
    {
      attachments: [`invoice.pdf`],
    },
  ],
}

export const runConfig: Config = {
  description: info.description,
  settings: {
    markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
  },
  global: {
    thread: {
      match: {
        query: `has:attachment -in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd} subject:'${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}'`,
      },
    },
  },
  threads: [
    {
      match: {
        query: "from:${user.email}",
      },
      messages: [
        {
          actions: [
            {
              name: "custom.mylog",
              args: {
                arg1: "value1",
                arg2: "value2",
              },
            },
          ],
        },
      ],
    },
  ],
}

export const example: Example = {
  info,
  config: runConfig,
  customActions: [
    {
      name: "mylog",
      action: (ctx, args) =>
        ctx.log.info(`Called with args '${JSON.stringify(args)}' ...`),
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
          procResult.status === ProcessingStatus.OK,
      },
      {
        message: "At least one thread should have been processed",
        assertFn: (_testConfig, procResult) => procResult.processedThreads >= 1,
      },
      {
        message: "Expected number of actions should have been executed",
        assertFn: (_testConfig, procResult) =>
          procResult.executedActions.length ===
          procResult.processedThreads + procResult.processedAttachments,
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
