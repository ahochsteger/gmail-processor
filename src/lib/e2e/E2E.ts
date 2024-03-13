import {
  EnvContext,
  ProcessingResult,
  ProcessingStatus,
  RunMode,
} from "../Context"
import { EnvProvider } from "../EnvProvider"
import {
  ConflictStrategy,
  DriveUtils,
  FileContent,
} from "../adapter/GDriveAdapter"
import { Config } from "../config/Config"
import { GmailProcessor } from "../processors/GmailProcessor"

type FileConfig = {
  name: string
  type: string
  filename: string
  ref: string
  destFolder: string
}

export type E2EGlobalConfig = {
  repoBaseUrl: string
  repoBranch: string
  repoBasePath: string
  subjectPrefix: string
  to: string
  waitTime: number
}

export class E2EConfig {
  public globals: E2EGlobalConfig = {
    repoBaseUrl: "",
    repoBranch: "main",
    repoBasePath: "",
    subjectPrefix: "",
    to: "",
    waitTime: 1,
  }
  public folders: {
    name: string
    location: string
  }[] = []
  public files: FileConfig[] = []
  public mails: {
    name: string
    subject: string
    htmlBody: string
    files: string[]
  }[] = []
}

export type E2EInitConfig = {
  name: string
  branch?: string
  mails: [
    {
      subject?: string
      body?: string
      attachments?: string[]
    },
  ]
}

export type E2EAssertFn = (
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
  globals: E2EGlobalConfig
  initConfig: E2EInitConfig
  runConfig: Config
  tests: E2ETest[]
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
    switch (status) {
      case E2EStatus.ERROR:
        console.error(`❌ Error: ${assertion.message} (${error})`)
        break
      case E2EStatus.FAILED:
        console.error(`👎 Failed: ${assertion.message}`)
        break
      case E2EStatus.SKIPPED:
        console.warn(`⏩ Skipped: ${assertion.message}`)
        break
      case E2EStatus.SUCCESS:
        console.info(`✅ Success: ${assertion.message}`)
        break
    }
    return result
  }

  public static getBlobSourceFromFilePath(
    globals: E2EGlobalConfig,
    path: string,
  ): GoogleAppsScript.Base.BlobSource {
    const url = `${globals.repoBaseUrl ?? "https://raw.githubusercontent.com/ahochsteger/gmail-processor"}/${globals.repoBranch ?? "main"}/${globals.repoBasePath ?? "src/e2e-test/files"}/${path}`
    console.log(`Fetching '${url}' ...`)
    const blob = UrlFetchApp.fetch(url)
    console.log(`Fetching '${url}' done.`)
    return blob
  }
  public static getBlobFromFileEntry(
    config: E2EConfig,
    file: FileConfig,
  ): GoogleAppsScript.Base.Blob | undefined {
    let blob: GoogleAppsScript.Base.Blob | undefined
    switch (file.type) {
      case "repo": {
        blob = this.getBlobSourceFromFilePath(
          config.globals,
          file.ref,
        ).getBlob()
        break
      }
      case "url":
        console.log(`Fetching URL file from ${file.ref} ...`)
        blob = UrlFetchApp.fetch(file.ref).getBlob()
        break
      case "gdrive":
        console.log(`Fetching GDrive file from ${file.ref} ...`)
        blob = DriveApp.getFileById(file.ref).getBlob()
        break
    }
    return blob
  }

  public static initMails(ctx: EnvContext, config: E2EConfig) {
    ctx.log.info("GMail initialization started.")
    config.mails.forEach((mail) => {
      const files: string[] = mail.files ?? []
      const attachments: GoogleAppsScript.Base.Blob[] = files.map((name) => {
        const file = config.files.reduce((prev, curr) =>
          name === curr.name ? curr : prev,
        )
        return this.getBlobFromFileEntry(config, file)
      }) as GoogleAppsScript.Base.Blob[]
      ctx.log.info(`Sending email '${mail.name}' ...`)
      ctx.env.mailApp.sendEmail({
        to: config.globals.to,
        subject: `${config.globals.subjectPrefix}${mail.subject}`,
        htmlBody: mail.htmlBody,
        attachments: attachments,
      })
    })
    ctx.log.info("GMail initialization finished.")
  }

  public static initDrive(
    ctx: EnvContext,
    config: E2EConfig,
    conflictStrategy = ConflictStrategy.UPDATE,
  ) {
    ctx.log.info("GDrive initialization started.")
    config.files
      .filter((file) => file.destFolder !== undefined)
      .forEach((file) => {
        const blob = this.getBlobFromFileEntry(config, file)
        if (!blob) return
        const folderLocation = config.folders.reduce((prev, current) =>
          current.name === file.destFolder ? current : prev,
        )
        ctx.log.info(
          `Creating file '${folderLocation.location}/${file.filename}' ...`,
        )
        DriveUtils.createFile(
          ctx,
          `${folderLocation.location}/${file.filename}`,
          new FileContent(blob),
          conflictStrategy,
        )
      })
    ctx.log.info("GDrive initialization finished.")
  }

  public static initAll(
    config: E2EConfig,
    ctx: EnvContext = EnvProvider.defaultContext(RunMode.DANGEROUS),
  ) {
    ctx.log.info("E2E initialization started.")
    this.initDrive(ctx, config)
    this.initMails(ctx, config)
    ctx.log.info("E2E initialization finished.")
  }

  public static overallStatus(statusMap: Record<E2EStatus, number>): E2EStatus {
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

  public static runTest(
    test: E2ETest,
    testConfig: E2ETestConfig,
    processingResult: ProcessingResult,
    ctx: EnvContext = EnvProvider.defaultContext(),
  ) {
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
    const status = this.overallStatus(statusMap)
    const result: E2EResult = {
      message: test.message,
      status,
      results,
    }

    return result
  }

  public static runTests(
    testConfig: E2ETestConfig,
    skipInit = false,
    runMode = RunMode.DANGEROUS,
    ctx: EnvContext = EnvProvider.defaultContext(runMode),
  ): E2EResult {
    // Send test mails
    if (!skipInit) {
      testConfig.initConfig.mails.forEach((mail) => {
        ctx.env.mailApp.sendEmail({
          to: testConfig.globals.to,
          subject: `${testConfig.globals.subjectPrefix}${mail.subject ?? testConfig.initConfig.name}`,
          htmlBody: mail.body,
          attachments: mail.attachments?.map((path) =>
            this.getBlobSourceFromFilePath(testConfig.globals, path),
          ),
        })
      })
      // Wait for emails to become available
      ctx.env.utilities.sleep(testConfig.globals.waitTime ?? 1)
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
      const processingResult = GmailProcessor.runWithJson(
        testConfig.runConfig,
        ctx,
      )
      if (processingResult.status === ProcessingStatus.ERROR) {
        statusMap[E2EStatus.ERROR]++
        error = processingResult.error
      } else {
        testConfig.tests.forEach((test) => {
          const testResult = this.runTest(
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
    const status = this.overallStatus(statusMap)
    const result: E2EResult = {
      error,
      status,
      results,
    }
    return result
  }

  public static runTestSuite(
    suiteName: string,
    testConfigs: E2ETestConfig[],
    skipInit = false,
    runMode = RunMode.DANGEROUS,
    ctx: EnvContext = EnvProvider.defaultContext(runMode),
  ): E2EResult {
    console.info(`Test suite '${suiteName}' started ...`)
    const results: E2EResult[] = []
    const statusMap: Record<E2EStatus, number> = {
      error: 0,
      failed: 0,
      skipped: 0,
      success: 0,
    }
    testConfigs.forEach((t) => {
      const testResult = this.runTests(t, skipInit, runMode, ctx)
      results.push(testResult)
    })
    const status = this.overallStatus(statusMap)
    const result: E2EResult = {
      message: suiteName,
      status,
      results: results,
    }
    console.info(`Test suite '${suiteName}' finished.`)
    return result
  }
}
