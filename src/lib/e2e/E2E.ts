import { Example, ExampleInfo, V1Example } from "../../examples/Example"
import {
  ActionExecution,
  EnvContext,
  ProcessingResult,
  ProcessingStatus,
  RunMode,
  newProcessingResult,
} from "../Context"
import { EnvProvider } from "../EnvProvider"
import { Config } from "../config/Config"
import { V1Config } from "../config/v1/V1Config"
import { V1ToV2Converter } from "../config/v1/V1ToV2Converter"
import { GmailProcessor } from "../processors/GmailProcessor"
import { BaseProcessor } from "../processors/BaseProcessor"
import { PatternUtil } from "../utils/PatternUtil"
import { E2EDefaults } from "./E2EDefaults"

export type E2EGlobalConfig = {
  driveBasePath: string
  repoBaseUrl: string
  repoBranch: string
  repoBasePath: string
  subjectPrefix: string
  to: string
  sleepTimeMs: number
  maxPollTimeMs: number
  pollIntervalMs: number
}

type E2EMail = {
  subject?: string
  body?: string
  attachments?: string[]
}

export type E2EInitConfig = {
  branch?: string
  mails: E2EMail[]
}

export type E2EExpectFn = (
  ctx: EnvContext,
  actual: unknown,
  expected: unknown,
  message?: string,
) => boolean

export class E2EAssertionHelper {
  private lastActionIndex = -1
  constructor(
    public testConfig: E2ETestConfig,
    public procResult: ProcessingResult,
    public ctx: EnvContext,
    public expect: E2EExpectFn,
  ) {}

  public expectStatus(expected = ProcessingStatus.OK): boolean {
    return this.expect(this.ctx, this.procResult.status, expected, "status")
  }

  private getMetaValue(
    action: ActionExecution | undefined,
    key: string,
  ): unknown {
    const searchKey = key.startsWith("meta.") ? key.substring(5) : key
    const metaEntry =
      action?.result?.actionMeta?.[searchKey] ?? (this.ctx as any).meta?.[searchKey]
    return metaEntry && typeof metaEntry === "object" && "value" in metaEntry
      ? metaEntry.value
      : metaEntry
  }

  public matches(
    actual: unknown,
    expected: unknown,
  ): boolean {
    return E2E.isRegExp(expected)
      ? expected.test(String(actual))
      : actual === expected
  }

  public findAction(
    name: string,
    args?: Record<string, unknown>,
    fromIndex = 0,
  ): ActionExecution | undefined {
    const action = this.procResult.executedActions
      .slice(fromIndex)
      .find((a) => {
        if (a.config.name !== name) return false
        if (args) {
          for (const [key, expectedValue] of Object.entries(args)) {
            let actualValue: unknown
            if (key.startsWith("arg.")) {
              const argKey = key.substring(4)
              actualValue = Reflect.get(a.config.args ?? {}, argKey)
            } else if (key.startsWith("meta.")) {
              actualValue = this.getMetaValue(a, key.substring(5))
            } else {
              throw new Error(
                `Ambiguous key '${key}' in findAction(). Use 'arg.' or 'meta.' prefix.`,
              )
            }
            if (!this.matches(actualValue, expectedValue)) return false
          }
        }
        return true
      })
    if (action) {
      this.lastActionIndex = this.procResult.executedActions.indexOf(action)
    }
    return action
  }

  public findNextAction(
    name: string,
    args?: Record<string, unknown>,
  ): ActionExecution | undefined {
    return this.findAction(name, args, this.lastActionIndex + 1)
  }

  public expectActionExecuted(
    action: ActionExecution | undefined,
    message: string,
  ): boolean {
    return this.expect(this.ctx, !!action, true, `${message} exists`)
  }

  public expectActionMeta(
    action: ActionExecution | undefined,
    key: string,
    expected: unknown,
    message?: string,
  ): boolean {
    const actual = this.getMetaValue(action, key)
    return this.expect(this.ctx, actual, expected, message ?? key)
  }

  public expectActionOrder(
    actions: (ActionExecution | undefined)[],
    message = "Action order is incorrect",
  ): boolean {
    const indices = actions.map((a) =>
      a ? this.procResult.executedActions.indexOf(a) : -1,
    )
    for (let i = 0; i < indices.length - 1; i++) {
      if (
        indices[i] === -1 ||
        indices[i + 1] === -1 ||
        indices[i] >= indices[i + 1]
      ) {
        return this.expect(this.ctx, false, true, message)
      }
    }
    return true
  }
}

type E2EAssertFn = (
  testConfig: E2ETestConfig,
  procResult: ProcessingResult,
  ctx: EnvContext,
  expect: E2EExpectFn,
  h: E2EAssertionHelper,
) => boolean

export type E2EAssertion = {
  name?: string
  assertFn: E2EAssertFn
  message: string
  skip?: boolean
}

export type E2ETest = {
  name?: string
  message?: string
  assertions: E2EAssertion[]
  skip?: boolean
}

export type E2ETestConfig = {
  example: Example | V1Example
  info: ExampleInfo
  globals?: E2EGlobalConfig
  initConfig?: E2EInitConfig
  migrationConfig?: V1Config
  runConfig?: Config
  tests?: E2ETest[]
}

/**
 * Status of end-to-end tests
 */
export enum E2EStatus {
  /** An end-to-end test produced an error while executing. */
  ERROR = "error",
  /** The end-to-end test failed. */
  FAILED = "failed",
  /** The end-to-end test has been skipped. */
  SKIPPED = "skipped",
  /** The end-to-end test was successful. */
  SUCCESS = "success",
}

export type E2EResult = {
  actual?: unknown
  error?: unknown
  expected?: unknown
  message?: string
  name?: string
  level: "assertion" | "test" | "suite" | "summary"
  status: E2EStatus
  results?: E2EResult[]
}

export function newE2EGlobalConfig(
  ctx: EnvContext,
  branch?: string,
  testGlobals?: E2EGlobalConfig,
  testRunId?: string,
): E2EGlobalConfig {
  return {
    driveBasePath: E2EDefaults.DRIVE_TESTS_BASE_PATH,
    repoBasePath: E2EDefaults.GIT_REPO_TEST_FILES_PATH,
    repoBaseUrl: E2EDefaults.GIT_REPO_BASE_URL,
    repoBranch: branch ?? E2EDefaults.GIT_REPO_BRANCH,
    sleepTimeMs: E2EDefaults.EMAIL_SLEEP_TIME_MS,
    maxPollTimeMs: E2EDefaults.EMAIL_MAX_POLL_TIME_MS,
    pollIntervalMs: E2EDefaults.EMAIL_POLL_INTERVAL_MS,
    subjectPrefix: testRunId
      ? `${E2EDefaults.EMAIL_SUBJECT_PREFIX}[${testRunId}] `
      : E2EDefaults.EMAIL_SUBJECT_PREFIX,
    to: ctx.env.session.getActiveUser().getEmail(),
    ...testGlobals,
  }
}

export class E2E {
  public static isRegExp(val: unknown): val is RegExp {
    return (
      val instanceof RegExp ||
      Object.prototype.toString.call(val) === "[object RegExp]"
    )
  }



  public static expect(
    ctx: EnvContext,
    actual: unknown,
    expected: unknown,
    message = "Actual value does not match expected value",
  ): boolean {
    // Standard E2E.expect uses JSON.stringify equality, but we add Regex support for findAction
    let match = false
    if (this.isRegExp(expected)) {
      match = expected.test(String(actual))
    } else {
      match = JSON.stringify(actual) === JSON.stringify(expected)
    }

    if (!match) {
      if (typeof actual === "function") {
        actual = (actual as any)()
      }
      const expStr = this.isRegExp(expected)
        ? expected.toString()
        : JSON.stringify(expected)
      const actStr =
        typeof actual === "string" ? actual : JSON.stringify(actual, null, 2)
      ctx.log.error(`${message}\nExpected: ${expStr}\nActual: ${actStr}`)
    }
    return match
  }

  public static assert(
    testConfig: E2ETestConfig,
    procResult: ProcessingResult,
    assertion: E2EAssertion,
    ctx: EnvContext = EnvProvider.defaultContext(),
  ): E2EResult {
    let error: unknown
    let status: E2EStatus
    let lastExpectation:
      | { actual: unknown; expected: unknown; message?: string }
      | undefined
    const wrappedExpect = (
      ctx: EnvContext,
      actual: unknown,
      expected: unknown,
      message?: string,
    ): boolean => {
      const match = this.expect(ctx, actual, expected, message)
      if (!match) {
        lastExpectation = { actual, expected, message }
      }
      return match
    }
    if (assertion.skip) {
      status = E2EStatus.SKIPPED
    } else {
      try {
        const h = new E2EAssertionHelper(
          testConfig,
          procResult,
          ctx,
          wrappedExpect,
        )
        const assertResult = assertion.assertFn(
          testConfig,
          procResult,
          ctx,
          wrappedExpect,
          h,
        )
        status = assertResult ? E2EStatus.SUCCESS : E2EStatus.FAILED
      } catch (e) {
        status = E2EStatus.ERROR
        error = e
      }
    }
    const result: E2EResult = {
      name: assertion.name,
      level: "assertion",
      status,
      error,
      message: assertion.message,
    }
    if (lastExpectation) {
      result.actual = lastExpectation.actual
      result.expected = lastExpectation.expected
      const expStr = E2E.isRegExp(lastExpectation.expected)
        ? lastExpectation.expected.toString()
        : JSON.stringify(lastExpectation.expected, null, 2)
      const actStr =
        typeof lastExpectation.actual === "string"
          ? lastExpectation.actual
          : JSON.stringify(lastExpectation.actual, null, 2)
      result.message += `\nExpected: ${expStr}\nActual: ${actStr}`
    } else if (status === E2EStatus.FAILED) {
      result.message += "\n(No detailed expectation was reported via expect())"
    }
    return result
  }

  private static _getBlobSourceFromFilePath(
    ctx: EnvContext,
    globals: E2EGlobalConfig,
    path: string,
  ): GoogleAppsScript.Base.BlobSource {
    const url =
      path.startsWith("http:") || path.startsWith("https:")
        ? path
        : `${globals.repoBaseUrl}/${globals.repoBranch}/${globals.repoBasePath}/${path}`
    ctx.log.debug(`Fetching '${url}' ...`)
    const blob = UrlFetchApp.fetch(url)
    ctx.log.debug(`Fetching '${url}' done.`)
    return blob
  }

  public static statusMapFromResults(
    results: E2EResult[],
  ): Record<E2EStatus, number> {
    const statusMap: Record<E2EStatus, number> = {
      error: 0,
      failed: 0,
      skipped: 0,
      success: 0,
    }
    results.forEach((r) => {
      statusMap[r.status]++
    })
    return statusMap
  }

  public static _overallStatus(
    statusMap: Record<E2EStatus, number>,
  ): E2EStatus {
    if (statusMap.error > 0) {
      return E2EStatus.ERROR
    } else if (statusMap.failed > 0) {
      return E2EStatus.FAILED
    } else if (statusMap.success === 0 && statusMap.skipped > 0) {
      return E2EStatus.SKIPPED
    } else {
      return E2EStatus.SUCCESS
    }
  }

  public static logResults(
    ctx: EnvContext,
    result: E2EResult,
    showNested = false,
    nestingLevel = 0,
  ) {
    // TODO: Move logging out of there - do at the end of all tests!
    const indent = "  ".repeat(nestingLevel)
    if (showNested && result.results) {
      result.results.forEach((nestedResult) => {
        this.logResults(ctx, nestedResult, showNested, nestingLevel + 1)
      })
    }
    switch (result.status) {
      case E2EStatus.ERROR:
        ctx.log.error(
          `${indent}❌ Error: ${result.message} (${String(result.error)})`,
        )
        break
      case E2EStatus.FAILED:
        ctx.log.error(`${indent}👎 Failed: ${result.message}`)
        break
      case E2EStatus.SKIPPED:
        ctx.log.info(`${indent}⏩ Skipped: ${result.message}`)
        break
      case E2EStatus.SUCCESS:
        ctx.log.info(`${indent}✅ Success: ${result.message}`)
        break
    }
  }

  public static _runTest(
    test: E2ETest,
    testConfig: E2ETestConfig,
    processingResult: ProcessingResult,
    ctx: EnvContext = EnvProvider.defaultContext(),
  ) {
    ctx.log.info(`E2E.runTest(): Running test '${test.message}' ...`)
    const results: E2EResult[] = []
    const statusMap: Record<E2EStatus, number> = {
      error: 0,
      failed: 0,
      skipped: 0,
      success: 0,
    }
    if (test.skip) {
      statusMap[E2EStatus.SKIPPED]++
    } else {
      test.assertions.forEach((assertion) => {
        const assertionResult = this.assert(
          testConfig,
          processingResult,
          assertion,
          ctx,
        )
        this.logResults(ctx, assertionResult)
        results.push(assertionResult)
        statusMap[assertionResult.status]++
      })
    }
    const status = this._overallStatus(statusMap)
    const result: E2EResult = {
      level: "test",
      name: test.name,
      message: test.message,
      status,
      results,
    }

    ctx.log.info(`E2E.runTest(): Finished.`)
    return result
  }

  public static initTests(
    testConfig: E2ETestConfig,
    branch = "main",
    ctx: EnvContext = EnvProvider.defaultContext({
      runMode: RunMode.DANGEROUS,
    }),
    testRunId?: string,
  ) {
    ctx.log.info(
      `E2E.runTests(): [${testConfig.info.category}/${testConfig.info.name}] Initializing test with test run id '${testRunId}' ...`,
    )
    const globals = newE2EGlobalConfig(
      ctx,
      branch,
      testConfig.globals,
      testRunId,
    )
    testConfig.initConfig?.mails.forEach((mail) => {
      ctx.env.mailApp.sendEmail({
        to: PatternUtil.substitute(ctx, globals.to),
        subject: PatternUtil.substitute(
          ctx,
          `${globals.subjectPrefix}${mail.subject ?? testConfig.info.name}`,
        ),
        htmlBody: PatternUtil.substitute(
          ctx,
          mail.body ?? testConfig.info.description,
        ),
        attachments: mail.attachments?.map((path) =>
          this._getBlobSourceFromFilePath(ctx, globals, path),
        ),
      })
    })
    ctx.log.info(
      `E2E.runTests(): [${testConfig.info.category}/${testConfig.info.name}] Finished initializing test.`,
    )
  }

  public static initWait(
    globals: E2EGlobalConfig,
    ctx: EnvContext = EnvProvider.defaultContext({
      runMode: RunMode.DANGEROUS,
    }),
    expectedCount = -1,
  ) {
    if (expectedCount > 0) {
      // Poll for emails to become available
      ctx.log.debug(
        `E2E.initWait(): Polling up to ${globals.maxPollTimeMs}ms for ${expectedCount} emails to be sent ...`,
      )
      const maxPolls = globals.maxPollTimeMs / globals.pollIntervalMs
      const query = `subject:"${globals.subjectPrefix}"`
      for (let i = 0; i < maxPolls; i++) {
        const foundCount = ctx.env.gmailApp.search(query).length
        if (foundCount >= expectedCount) {
          ctx.log.debug(
            `E2E.initWait(): Found ${foundCount} emails, finished waiting.`,
          )
          return
        }
        ctx.env.utilities.sleep(globals.pollIntervalMs)
      }
      ctx.log.debug(
        `E2E.initWait(): Poll time expired. Found emails matching query: ${ctx.env.gmailApp.search(query).length}`,
      )
    } else {
      // Wait for emails to become available statically
      ctx.log.debug(
        `E2E.initWait(): Waiting ${globals.sleepTimeMs}ms for emails to be sent ...`,
      )
      ctx.env.utilities.sleep(globals.sleepTimeMs)
      ctx.log.debug(`E2E.initWait(): Finished waiting.`)
    }
  }

  public static getTestRunId(ctx: EnvContext) {
    return ctx.env.utilities.getUuid().substring(0, 8)
  }

  public static async runTests(
    testConfig: E2ETestConfig,
    skipInit = false,
    branch = "main",
    ctx: EnvContext = EnvProvider.defaultContext({
      runMode: RunMode.DANGEROUS,
    }),
    testRunId?: string,
  ): Promise<E2EResult> {
    const activeTestRunId = testRunId ?? this.getTestRunId(ctx)
    ctx.log.info(
      `E2E.runTests(): Started with test run id '${activeTestRunId}'.`,
    )
    // Send test mails
    if (!skipInit) {
      this.initTests(testConfig, branch, ctx, activeTestRunId)
      const globals = newE2EGlobalConfig(
        ctx,
        branch,
        testConfig.globals,
        activeTestRunId,
      )
      const expectedCount = testConfig.initConfig?.mails.length ?? -1
      this.initWait(globals, ctx, expectedCount)
    } else {
      ctx.log.info(
        `E2E.runTests(): [${testConfig.info.category}/${testConfig.info.name}] SKIPPED: Initializing test data ...`,
      )
    }

    ctx.log.info(
      `E2E.runTests(): [${testConfig.info.category}/${testConfig.info.name}] Running test ...`,
    )
    // Run tests
    let error: unknown
    const results: E2EResult[] = []
    const statusMap: Record<E2EStatus, number> = {
      error: 0,
      failed: 0,
      skipped: 0,
      success: 0,
    }
    try {
      let processingResult: ProcessingResult
      if (testConfig.migrationConfig) {
        ctx.log.info(`E2E.runTests(): Executing GmailProcessor ...`)
        GmailProcessor.getEssentialConfig(
          V1ToV2Converter.v1ConfigToV2ConfigJson(testConfig.migrationConfig),
        )
        processingResult = newProcessingResult()
      } else if (testConfig.runConfig) {
        ctx.log.info(`E2E.runTests(): Executing GmailProcessor.runWithJson ...`)
        // Replace the default subject prefix with the test-run specific one if available
        let testRunConfig = testConfig.runConfig
        if (activeTestRunId) {
          let runConfigStr = JSON.stringify(testConfig.runConfig)
          // Replace email subject prefix
          runConfigStr = runConfigStr.replace(
            new RegExp(
              E2EDefaults.EMAIL_SUBJECT_PREFIX.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&",
              ),
              "g",
            ),
            `${E2EDefaults.EMAIL_SUBJECT_PREFIX}[${activeTestRunId}] `,
          )
          // Replace drive base path produced by driveTestBasePath() so parallel
          // runs land in isolated folders without touching runConfig source.
          const basePath = E2EDefaults.driveTestBasePath(testConfig.info)
          if (runConfigStr.includes(basePath)) {
            runConfigStr = runConfigStr.replaceAll(
              basePath,
              E2EDefaults.driveTestBasePath(testConfig.info, activeTestRunId),
            )
          }
          testRunConfig = JSON.parse(runConfigStr) as Config
        }
        processingResult = GmailProcessor.runWithJson(
          testRunConfig,
          (testConfig.example as Example).customActions ?? [],
          ctx,
        )
      } else {
        throw new Error("No processing configuration given!")
      }

      // Await all actions that return a promise (e.g. storeDecryptedPdf)
      if (processingResult.actionPromises.length > 0) {
        ctx.log.info(
          `E2E.runTests(): Waiting for ${processingResult.actionPromises.length} action promises to finish ...`,
        )
        await Promise.all(processingResult.actionPromises.map((p) =>
          p.then((actualResult) => {
            if (actualResult.actionMeta) {
              BaseProcessor.updateContextMeta(ctx, actualResult.actionMeta)
            }
            return actualResult
          }),
        ))
        ctx.log.info(`E2E.runTests(): Action promises finished.`)

        // Diagnostic logging: Trace all metadata currently in context
        ctx.log.info(`E2E.runTests(): Current Context Meta Keys:`)
        const meta = (ctx as any).meta ?? {}
        Object.keys(meta).forEach((k) => {
          const entry = meta[k]
          const val = entry?.value
          const displayVal = typeof val === "function" ? "()=>..." : JSON.stringify(val)
          ctx.log.info(`  - ${k}: ${displayVal} (Raw: ${JSON.stringify(entry)})`)
        })
      }

      if (processingResult.status === ProcessingStatus.ERROR) {
        statusMap[E2EStatus.ERROR]++
        error = processingResult.error
      } else {
        ctx.log.info(`E2E.runTests(): Testing assertions ...`)
        testConfig.tests?.forEach((test) => {
          const testResult = this._runTest(
            test,
            testConfig,
            processingResult,
            ctx,
          )
          results.push(testResult)
          statusMap[testResult.status]++
        })
      }
    } catch (e) {
      statusMap[E2EStatus.ERROR]++
      error = e
    }
    const status = this._overallStatus(statusMap)
    const result: E2EResult = {
      level: "suite",
      name: `${testConfig.info.category}/${testConfig.info.name}`,
      error,
      message: `${testConfig.info.category}/${testConfig.info.name}`,
      status,
      results,
    }
    ctx.log.info(
      `E2E.runTests(): [${testConfig.info.category}/${testConfig.info.name}] Finished running test.`,
    )
    return result
  }

  public static initAllTests(
    testConfigs: E2ETestConfig[],
    branch = "main",
    ctx: EnvContext = EnvProvider.defaultContext({
      runMode: RunMode.DANGEROUS,
    }),
    testRunId?: string,
  ): string {
    const activeTestRunId = testRunId ?? this.getTestRunId(ctx)
    ctx.log.info(
      `E2E.initAllTests(): Started with test run id '${activeTestRunId}'.`,
    )
    testConfigs.forEach((testConfig) => {
      this.initTests(testConfig, branch, ctx, activeTestRunId)
    })
    const globals = newE2EGlobalConfig(ctx, branch, undefined, activeTestRunId)
    this.initWait(globals, ctx)
    ctx.log.info(`E2E.initAllTests(): Finished.`)
    return activeTestRunId
  }

  public static async runAllTests(
    testConfigs: E2ETestConfig[],
    skipInit = false,
    branch = "main",
    ctx: EnvContext = EnvProvider.defaultContext({
      runMode: RunMode.DANGEROUS,
    }),
    testRunId?: string,
  ): Promise<E2EResult> {
    const activeTestRunId = testRunId ?? this.getTestRunId(ctx)
    ctx.log.info(
      `E2E.runAllTests(): Started with test run id '${activeTestRunId}'.`,
    )
    const results = await Promise.all(
      testConfigs.map((testConfig) =>
        this.runTests(testConfig, skipInit, branch, ctx, activeTestRunId),
      ),
    )
    const statusMap = this.statusMapFromResults(results)
    const status = this._overallStatus(statusMap)
    const result: E2EResult = {
      level: "summary",
      name: "all-tests",
      message: "All Tests",
      status,
      results,
    }
    this.logResults(ctx, result, true)
    ctx.log.info(`E2E.runAllTests(): JSON Result: ${JSON.stringify(result)}`)
    ctx.log.info(`E2E.runAllTests(): Finished.`)
    return result
  }
}
