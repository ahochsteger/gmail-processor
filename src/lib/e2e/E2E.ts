import { Example, ExampleInfo, V1Example } from "../../examples/Example"
import {
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

type E2EAssertFn = (
  testConfig: E2ETestConfig,
  procResult: ProcessingResult,
  ctx: EnvContext,
  expect: (
    ctx: EnvContext,
    actual: unknown,
    expected: unknown,
    message?: string,
  ) => boolean,
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
  error?: unknown
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
): E2EGlobalConfig {
  return {
    driveBasePath: E2EDefaults.DRIVE_TESTS_BASE_PATH,
    repoBasePath: E2EDefaults.GIT_REPO_TEST_FILES_PATH,
    repoBaseUrl: E2EDefaults.GIT_REPO_BASE_URL,
    repoBranch: branch ?? E2EDefaults.GIT_REPO_BRANCH,
    sleepTimeMs: E2EDefaults.EMAIL_SLEEP_TIME_MS,
    subjectPrefix: E2EDefaults.EMAIL_SUBJECT_PREFIX,
    to: ctx.env.session.getActiveUser().getEmail(),
    ...testGlobals,
  }
}
export class E2E {
  public static expect(
    ctx: EnvContext,
    actual: unknown,
    expected: unknown,
    message = "Actual value does not match expected value",
  ): boolean {
    const expectedValue = JSON.stringify(expected)
    const actualValue = JSON.stringify(actual)
    let result = true
    if (actualValue !== expectedValue) {
      ctx.log.error(
        `${message}\nExpected: ${expectedValue}\nActual: ${actualValue}`,
      )
      result = false
    }
    return result
  }
  public static assert(
    testConfig: E2ETestConfig,
    procResult: ProcessingResult,
    assertion: E2EAssertion,
    ctx: EnvContext = EnvProvider.defaultContext(),
  ): E2EResult {
    let error: unknown
    let status: E2EStatus
    if (assertion.skip) {
      status = E2EStatus.SKIPPED
    } else {
      try {
        const assertResult = assertion.assertFn(
          testConfig,
          procResult,
          ctx,
          this.expect,
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
    return result
  }

  private static _getBlobSourceFromFilePath(
    ctx: EnvContext,
    globals: E2EGlobalConfig,
    path: string,
  ): GoogleAppsScript.Base.BlobSource {
    const url = `${globals.repoBaseUrl}/${globals.repoBranch}/${globals.repoBasePath}/${path}`
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
    runMode = RunMode.DANGEROUS,
    ctx: EnvContext = EnvProvider.defaultContext(runMode),
  ) {
    ctx.log.info(
      `E2E.runTests(): [${testConfig.info.category}/${testConfig.info.name}] Initializing test ...`,
    )
    const globals = newE2EGlobalConfig(ctx, branch, testConfig.globals)
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
    runMode = RunMode.DANGEROUS,
    ctx: EnvContext = EnvProvider.defaultContext(runMode),
  ) {
    // Wait for emails to become available
    ctx.log.debug(
      `E2E.runTests(): Waiting ${globals.sleepTimeMs}ms for emails to be sent ...`,
    )
    ctx.env.utilities.sleep(globals.sleepTimeMs)
    ctx.log.debug(`E2E.runTests(): Finished waiting.`)
  }

  public static runTests(
    testConfig: E2ETestConfig,
    skipInit = false,
    branch = "main",
    runMode = RunMode.DANGEROUS,
    ctx: EnvContext = EnvProvider.defaultContext(runMode),
  ): E2EResult {
    // Send test mails
    if (!skipInit) {
      this.initTests(testConfig, branch, runMode, ctx)
      const globals = newE2EGlobalConfig(ctx, branch, testConfig.globals)
      this.initWait(globals, runMode, ctx)
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
        processingResult = GmailProcessor.runWithJson(
          testConfig.runConfig,
          (testConfig.example as Example).customActions ?? [],
          ctx,
        )
      } else {
        throw new Error("No processing configuration given!")
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
    runMode = RunMode.DANGEROUS,
    ctx: EnvContext = EnvProvider.defaultContext(runMode),
  ) {
    ctx.log.info(`E2E.initAllTests(): Started.`)
    testConfigs.forEach((testConfig) => {
      this.initTests(testConfig, branch, runMode, ctx)
    })
    const globals = newE2EGlobalConfig(ctx, branch)
    this.initWait(globals, runMode, ctx)
    ctx.log.info(`E2E.initAllTests(): Finished.`)
  }

  public static runAllTests(
    testConfigs: E2ETestConfig[],
    skipInit = false,
    branch = "main",
    runMode = RunMode.DANGEROUS,
    ctx: EnvContext = EnvProvider.defaultContext(runMode),
  ): E2EResult {
    ctx.log.info(`E2E.runAllTests(): Started.`)
    const results = testConfigs.map((testConfig) =>
      this.runTests(testConfig, skipInit, branch, runMode, ctx),
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
