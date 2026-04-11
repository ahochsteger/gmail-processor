// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/advanced/stringFnExpressions.ts

function stringFnExpressionsTestConfig() {
  /**
   * This example shows how to use string functions within expressions.
   *
   * The following string functions are supported:
   * - `replace(searchRegexp, replacement)`: Replaces the first occurrence of a pattern matching the regular expression with a replacement string. See [`String.prototype.replace()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace).
   * - `replaceAll(searchRegexp, replacement)`: Replaces all occurrences of a pattern matching the regular expression with a replacement string. See [`String.prototype.replaceAll()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll).
   * - `slice(start, end)`: Extracts a section of a string and returns it as a new string, without modifying the original string. See [`String.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice).
   * - `substring(start, end)`: Returns the part of the string between the start and end indexes, or to the end of the string. See [`String.prototype.substring()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring).
   * - `trimStart()`: Removes whitespace from the beginning of a string. See [`String.prototype.trimStart()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart).
   * - `trimEnd()`: Removes whitespace from the end of a string. See [`String.prototype.trimEnd()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd).
   * - `trim()`: Removes whitespace from both ends of a string. See [`String.prototype.trim()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim).
   * - `toUpperCase()`: Converts a string to uppercase letters. See [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase).
   * - `toLowerCase()`: Converts a string to lowercase letters. See [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase).
   */
  const info = {
    name: "stringFnExpressions",
    title: "String Function Expressions",
    description:
      "This example demonstrates how to use string function expressions in the configuration.",
    category: "advanced",
    discussions: [549],
    pullRequests: [556],
    skipGenerate: [],
  }
  const initConfig = {
    mails: [
      {
        body: "This is the full email body.",
      },
    ],
  }

  const runConfig = {
    description: info.description,
    global: {
      thread: {
        match: {
          query: `-in:trash -in:drafts -in:spam from:{{user.email}} to:{{user.email}} after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
        },
      },
    },
    settings: {
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
      logSensitiveRedactionMode: GmailProcessorLib.LogRedactionMode.NONE,
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
                    "Removing 'full' from body: {{message.body|replaceAll('full ', '')}}",
                },
              },
            ],
          },
        ],
      },
    ],
  }

  const example = {
    info,
    config: runConfig,
  }

  const tests = [
    {
      message: "Execution should be successful",
      assertions: [
        {
          message: "The correct message should have been logged",
          assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
            const a = h.findNextAction("global.log")
            return (
              h.expectStatus() &&
              h.expectActionExecuted(a, "global.log") &&
              h.expect(
                _ctx,
                a?.result?.logMessage,
                "Removing 'full' from body: This is the email body.",
                "Actual log message does not match the expected one",
              )
            )
          },
        },
      ],
    },
  ]

  const testConfig = {
    example,
    info,
    initConfig,
    runConfig,
    tests,
  }
  return testConfig
}

async function stringFnExpressionsTest() {
  const testConfig = stringFnExpressionsTestConfig()
  return await GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.EnvProvider.defaultContext({
      runMode: GmailProcessorLib.RunMode.DANGEROUS,
      cacheService: CacheService,
      propertiesService: PropertiesService,
    }),
  )
}
