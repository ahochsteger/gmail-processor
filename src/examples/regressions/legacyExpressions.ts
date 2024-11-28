import { ProcessingStatus } from "../../lib/Context"
import { Config } from "../../lib/config/Config"
import { MarkProcessedMethod } from "../../lib/config/SettingsConfig"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { Example, ExampleCategory, ExampleInfo } from "../Example"
import { E2EDefaults } from "./../../lib/e2e/E2EDefaults"

/**
 * This example uses legacy expressions that are deprecated but still should work until support is finally removed.
 */
export const info: ExampleInfo = {
  name: "legacyExpressions",
  title: "Legacy Expressions",
  description:
    "This example uses legacy expressions that are deprecated but still should work until support is finally removed.",
  category: ExampleCategory.REGRESSIONS,
}

export const initConfig: E2EInitConfig = {
  mails: [{}],
}

export const runConfig: Config = {
  description: info.description,
  settings: {
    markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
  },
  global: {
    thread: {
      match: {
        query: `has:attachment -in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd'} is:unread subject:"${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
      },
    },
    variables: [
      { key: "date1", value: "date1: ${date.now:date:-1d}" },
      { key: "date2", value: "date2: ${date.now:date:-1d:yyyy-MM-dd}" },
      { key: "date3", value: "date3: ${date.now:date::yyyy-MM-dd}" },
      { key: "format1", value: "date1: ${date.now:format}" },
      { key: "format2", value: "date2: ${date.now:format:yyyy-MM-dd}" },
      { key: "join1", value: "join1: ${date.now:join}" },
      { key: "join2", value: "join2: ${date.now:join:-}" },
      {
        key: "offset-date1",
        value: "offset-date1: ${date.now:offset-format:-1d}",
      },
      {
        key: "offset-date2",
        value: "offset-date2: ${date.now:offset-format:-1d:yyyy-MM-dd}",
      },
      {
        key: "offset-date3",
        value: "offset-date3: ${date.now:offset-format::yyyy-MM-dd}",
      },
    ],
  },
  threads: [{}],
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
