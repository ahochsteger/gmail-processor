import { ExampleInfo } from "../../examples/Example"
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
) => boolean

export type E2EAssertion = {
  assertFn: E2EAssertFn
  message: string
  skip?: boolean
}

export type E2ETest = {
  message?: string
  assertions: E2EAssertion[]
  skip?: boolean
}

export type E2ETestConfig = {
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
  status: E2EStatus
  results?: E2EResult[]
}

export function newE2EGlobalConfig(
  ctx: EnvContext,
  testGlobals?: E2EGlobalConfig,
  branch?: string,
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
        const assertResult = assertion.skip
          ? E2EStatus.SKIPPED
          : assertion.assertFn(testConfig, procResult, ctx)
        status = assertResult ? E2EStatus.SUCCESS : E2EStatus.FAILED
      } catch (e) {
        status = E2EStatus.ERROR
        error = e
      }
    }
    const result: E2EResult = {
      status,
      error,
      message: assertion.message,
    }
    switch (
      status // TODO: Move logging out of there - do at the end of all tests!
    ) {
      case E2EStatus.ERROR:
        ctx.log.error(`❌ Error: ${assertion.message} (${error})`)
        break
      case E2EStatus.FAILED:
        ctx.log.error(`👎 Failed: ${assertion.message}`)
        break
      case E2EStatus.SKIPPED:
        ctx.log.info(`⏩ Skipped: ${assertion.message}`)
        break
      case E2EStatus.SUCCESS:
        ctx.log.info(`✅ Success: ${assertion.message}`)
        break
    }
    return result
  }

  private static _getBlobSourceFromFilePath(
    ctx: EnvContext,
    globals: E2EGlobalConfig,
    path: string,
  ): GoogleAppsScript.Base.BlobSource {
    const url = `${globals.repoBaseUrl ?? "https://raw.githubusercontent.com/ahochsteger/gmail-processor"}/${globals.repoBranch ?? "main"}/${globals.repoBasePath ?? "src/e2e-test/files"}/${path}`
    ctx.log.debug(`Fetching '${url}' ...`)
    const blob = UrlFetchApp.fetch(url)
    ctx.log.debug(`Fetching '${url}' done.`)
    return blob
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
        results.push(assertionResult)
        statusMap[assertionResult.status]++
      })
    }
    const status = this._overallStatus(statusMap)
    const result: E2EResult = {
      message: test.message,
      status,
      results,
    }

    ctx.log.info(`E2E.runTest(): Finished.`)
    return result
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
      ctx.log.info(`E2E.runTests(): Initializing test data ...`)
      const globals = newE2EGlobalConfig(ctx, testConfig.globals, branch)
      testConfig.initConfig?.mails.forEach((mail) => {
        ctx.env.mailApp.sendEmail({
          to: globals.to,
          subject: `${globals.subjectPrefix}${mail.subject ?? testConfig.info.name}`,
          htmlBody: mail.body ?? testConfig.info.description,
          attachments: mail.attachments?.map((path) =>
            this._getBlobSourceFromFilePath(ctx, globals, path),
          ),
        })
      })
      // Wait for emails to become available
      ctx.log.debug(
        `E2E.runTests(): Waiting ${globals.sleepTimeMs}ms for emails to be sent ...`,
      )
      ctx.env.utilities.sleep(globals.sleepTimeMs)
      ctx.log.debug(`E2E.runTests(): Finished waiting.`)
    } else {
      ctx.log.info(`E2E.runTests(): SKIPPED: Initializing test data ...`)
    }

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
        const convertedConfig = GmailProcessor.getEssentialConfig(
          V1ToV2Converter.v1ConfigToV2ConfigJson(testConfig.migrationConfig),
        )
        processingResult = newProcessingResult()
        if (!convertedConfig) {
          processingResult.status = ProcessingStatus.ERROR
          processingResult.error = new Error(
            "Converted v1 config with no result!",
          )
        }
      } else if (testConfig.runConfig) {
        ctx.log.info(`E2E.runTests(): Executing GmailProcessor.runWithJson ...`)
        processingResult = GmailProcessor.runWithJson(testConfig.runConfig, ctx)
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
      error,
      status,
      results,
    }
    ctx.log.info(`E2E.runTests(): Finished.`)
    return result
  }
}
