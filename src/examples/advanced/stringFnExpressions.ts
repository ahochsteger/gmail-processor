import { Config } from "../../lib/config/Config"
import {
  LogRedactionMode,
  MarkProcessedMethod,
} from "../../lib/config/SettingsConfig"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { E2EDefaults } from "../../lib/e2e/E2EDefaults"
import { Example, ExampleCategory, ExampleInfo } from "../Example"

/**
 * This example shows how to use string functions within expressions.
 *
 * The following string functions are supported:
 * - replace(searchRegexp, replacement)
 * - replaceAll(searchRegexp, replacement)
 * - slice(start, end)
 * - substring(start, end)
 * - trimStart()
 * - trimEnd()
 * - trim()
 * - toUpperCase()
 * - toLowerCase()
 */
export const info: ExampleInfo = {
  name: "stringFnExpressions",
  title: "String Function Expressions",
  description:
    "This example demonstrates how to use string function expressions in the configuration.",
  category: ExampleCategory.ADVANCED,
  discussions: [549],
  skipGenerate: [],
}
export const initConfig: E2EInitConfig = {
  mails: [
    {}, // just an empty default email
  ],
}

export const runConfig: Config = {
  description: info.description,
  global: {
    thread: {
      match: {
        query: `-in:trash -in:drafts -in:spam from:{{user.email}} to:{{user.email}} after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
      },
    },
  },
  settings: {
    markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
    logSensitiveRedactionMode: LogRedactionMode.NONE,
  },
  threads: [
    {
      match: {
        query: "", // TODO: Analyze why this is required - maybe has:attatchments is added automatically here (which is unexpected)!
      },
      messages: [
        {
          actions: [
            {
              name: "global.log",
              args: {
                message:
                  "Removing '[]' from subject: {{message.subject|replaceAll('[\\[\\]]', '')}}",
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
}

export const tests: E2ETest[] = [
  {
    message: "Successful execution",
    assertions: [
      {
        message: "One thread config should have been processed",
        assertFn: (_testConfig, procResult) =>
          procResult.processedThreadConfigs === 1,
      },
      {
        message: "At least one thread should have been processed",
        assertFn: (_testConfig, procResult) => procResult.processedThreads >= 1,
      },
      {
        message: "At least one message should have been processed",
        assertFn: (_testConfig, procResult) =>
          procResult.processedMessages >= 1,
      },
      {
        message: "Correct number of actions should have been executed",
        assertFn: (_testConfig, procResult) =>
          procResult.executedActions.length == 2 * procResult.processedMessages,
      },
      {
        message: "The correct message should have been logged",
        assertFn: (_testConfig, procResult, ctx, expect) =>
          expect(
            ctx,
            procResult.executedActions[0]?.result?.logMessage,
            `Removing '[]' from subject: GmailProcessor-Test ${info.name}`,
            "Actual log message does not match the expected one",
          ),
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
