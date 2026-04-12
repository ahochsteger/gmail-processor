import { mock } from "jest-mock-extended"
import { ExampleCategory, ExampleInfo } from "../../examples/Example"
import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import {
  ContextType,
  EnvContext,
  ProcessingResult,
  ProcessingStatus,
} from "../Context"
import { Config } from "../config/Config"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import { GmailProcessor } from "../processors/GmailProcessor"
import {
  E2E,
  E2EAssertion,
  E2EAssertionHelper,
  E2EGlobalConfig,
  E2EInitConfig,
  E2EResult,
  E2EStatus,
  E2ETest,
  E2ETestConfig,
  newE2EGlobalConfig,
} from "./E2E"
import { E2EDefaults } from "./E2EDefaults"

let ctx: EnvContext
let mocks: Mocks

beforeAll(() => {
  mocks = MockFactory.newMocks()
  ctx = mocks.envContext
  ;(ctx.env.session.getActiveUser as jest.Mock).mockReturnValue({
    getEmail: () => "test@example.com",
  } as any)
})

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe("newE2EGlobalConfig", () => {
  it("should generate a valid config without testRunId", () => {
    const config = newE2EGlobalConfig(ctx)
    expect(config.subjectPrefix).toEqual("[GmailProcessor-Test] ")
  })

  it("should generate a valid config with testRunId", () => {
    const config = newE2EGlobalConfig(ctx, undefined, undefined, "abc-123")
    expect(config.subjectPrefix).toEqual("[GmailProcessor-Test] [abc-123] ")
  })
})

describe("E2EDefaults.driveTestBasePath", () => {
  const info: ExampleInfo = {
    category: ExampleCategory.BASICS,
    name: "myExample",
    title: "My Example",
    description: "desc",
  }

  it("should return a path without testRunId (date only)", () => {
    const result = E2EDefaults.driveTestBasePath(info)
    expect(result).toContain("/GmailProcessor-Tests/e2e/")
    expect(result).toContain("/basics/myExample")
    // When no testRunId is given, result must not contain a dash-separated run segment
    expect(result).not.toContain("-run-")
  })

  it("should return a path with testRunId appended to the date", () => {
    const result = E2EDefaults.driveTestBasePath(info, "run-42")
    expect(result).toContain("/GmailProcessor-Tests/e2e/")
    expect(result).toContain("-run-42/")
    expect(result).toContain("/basics/myExample")
  })
})

describe("getTestRunId", () => {
  it("should return an 8-character UUID prefix from context utilities", () => {
    const result = E2E.getTestRunId(ctx)
    expect(result).toHaveLength(8)
    expect(ctx.env.utilities.getUuid).toHaveBeenCalled()
  })
})

describe("initWait", () => {
  let globals: E2EGlobalConfig

  beforeEach(() => {
    globals = newE2EGlobalConfig(ctx)
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it("should sleep statically if expectedCount <= 0", () => {
    E2E.initWait(globals, ctx, -1)
    expect(ctx.env.utilities.sleep).toHaveBeenCalledWith(globals.sleepTimeMs)
    expect(ctx.env.gmailApp.search).not.toHaveBeenCalled()
  })

  it("should poll and return early if expected count is reached", () => {
    ;(ctx.env.gmailApp.search as jest.Mock).mockReturnValue([{}, {}]) // Returns 2 emails
    E2E.initWait(globals, ctx, 2)
    expect(ctx.env.gmailApp.search).toHaveBeenCalledWith(
      `subject:"${globals.subjectPrefix}"`,
    )
    expect(ctx.env.utilities.sleep).not.toHaveBeenCalled()
  })

  it("should poll and sleep interval if count is not reached immediately", () => {
    ;(ctx.env.gmailApp.search as jest.Mock)
      .mockReturnValueOnce([])
      .mockReturnValueOnce([{}])
    E2E.initWait(globals, ctx, 1)
    expect(ctx.env.gmailApp.search).toHaveBeenCalledTimes(2)
    expect(ctx.env.utilities.sleep).toHaveBeenCalledWith(globals.pollIntervalMs)
  })

  it("should poll until maxPollTimeMs is exhausted and then stop", () => {
    globals.maxPollTimeMs = 4000
    globals.pollIntervalMs = 2000
    ;(ctx.env.gmailApp.search as jest.Mock).mockReturnValue([])
    E2E.initWait(globals, ctx, 1)
    expect(ctx.env.gmailApp.search).toHaveBeenCalledTimes(3) // at 0, 2000, maxPollTime is evaluated before loop
    expect(ctx.env.utilities.sleep).toHaveBeenCalledWith(globals.pollIntervalMs)
    expect(ctx.env.utilities.sleep).toHaveBeenCalledTimes(2)
  })
})

describe("assert", () => {
  it("should handle successful assertions", () => {
    const assertion: E2EAssertion = {
      message: "A successful assertion",
      assertFn: () => true,
    }
    const result = E2E.assert(
      {} as E2ETestConfig,
      {} as ProcessingResult,
      assertion,
      ctx,
    )
    expect(result.status).toEqual(E2EStatus.SUCCESS)
  })
  it("should handle failed assertions", () => {
    const assertion: E2EAssertion = {
      message: "A failed assertion",
      assertFn: () => false,
    }
    const result = E2E.assert(
      {} as E2ETestConfig,
      {} as ProcessingResult,
      assertion,
      ctx,
    )
    expect(result.status).toEqual(E2EStatus.FAILED)
  })
  it("should handle errors in assertions", () => {
    const assertion: E2EAssertion = {
      message: "An assertion with an error",
      assertFn: () => {
        throw new Error("Some error")
      },
    }
    const result = E2E.assert(
      {} as E2ETestConfig,
      {} as ProcessingResult,
      assertion,
      ctx,
    )
    expect(result.status).toEqual(E2EStatus.ERROR)
  })
  it("should handle skipped assertions", () => {
    const assertion: E2EAssertion = {
      skip: true,
      message: "A skipped assertion",
      assertFn: () => false,
    }
    const result = E2E.assert(
      {} as E2ETestConfig,
      {} as ProcessingResult,
      assertion,
      ctx,
    )
    expect(result.status).toEqual(E2EStatus.SKIPPED)
  })
})

describe("expect()", () => {
  it("should return true on identical values", () => {
    expect(E2E.expect(mocks.envContext, "value", "value")).toBeTruthy()
  })
  it("should return false on non-identical values", () => {
    expect(
      E2E.expect(mocks.envContext, "value", "non-matching-value"),
    ).toBeFalsy()
  })
  it("should support RegExp expectations", () => {
    expect(E2E.expect(mocks.envContext, "value123", /value[0-9]+/)).toBeTruthy()
    expect(E2E.expect(mocks.envContext, "value", /other/)).toBeFalsy()
  })
})

describe("E2EAssertionHelper", () => {
  it("should handle hierarchical getMetaValue", () => {
    const mockCtx = {
      ...ctx,
      type: ContextType.ENV,
      meta: { "global.key": { value: "global-val" } },
    } as any
    const h = new E2EAssertionHelper(
      {} as any,
      { executedActions: [] } as any,
      mockCtx,
      E2E.expect.bind(E2E),
    )

    // Global lookup
    expect((h as any).getMetaValue(undefined, "global.key")).toBe("global-val")
    // Action-specific lookup
    const action = {
      result: { actionMeta: { "action.key": { value: "action-val" } } },
    } as any
    expect((h as any).getMetaValue(action, "action.key")).toBe("action-val")
  })

  it("should throw error on ambiguous keys in findAction", () => {
    const h = new E2EAssertionHelper(
      {} as any,
      { executedActions: [{ config: { name: "test" } }] } as any,
      ctx,
      E2E.expect.bind(E2E),
    )
    expect(() => h.findAction("test", { "ambiguous.key": "val" })).toThrow(
      "Ambiguous key 'ambiguous.key' in findAction()",
    )
  })

  it("should verify expectActionOrder", () => {
    const a1 = { config: { name: "action1" } } as any
    const a2 = { config: { name: "action2" } } as any
    const processingResult = {
      executedActions: [a1, a2],
    } as any
    const h = new E2EAssertionHelper(
      {} as any,
      processingResult,
      ctx,
      E2E.expect.bind(E2E),
    )
    expect(h.expectActionOrder([a1, a2])).toBe(true)
    expect(h.expectActionOrder([a2, a1])).toBe(false)
    expect(h.expectActionOrder([a1, undefined])).toBe(false)
  })
})

describe("logResults", () => {
  it("should log different statuses for coverage", () => {
    const spyInfo = jest.spyOn(ctx.log, "info")
    const spyError = jest.spyOn(ctx.log, "error")

    E2E.logResults(ctx, {
      status: E2EStatus.SUCCESS,
      message: "msg",
      level: "assertion",
    })
    expect(spyInfo).toHaveBeenCalledWith(
      expect.stringContaining("✅ Success: msg"),
    )

    E2E.logResults(ctx, {
      status: E2EStatus.SKIPPED,
      message: "msg",
      level: "assertion",
    })
    expect(spyInfo).toHaveBeenCalledWith(
      expect.stringContaining("⏩ Skipped: msg"),
    )

    E2E.logResults(ctx, {
      status: E2EStatus.FAILED,
      message: "msg",
      level: "assertion",
    })
    expect(spyError).toHaveBeenCalledWith(
      expect.stringContaining("👎 Failed: msg"),
    )

    E2E.logResults(ctx, {
      status: E2EStatus.ERROR,
      message: "msg",
      level: "assertion",
      error: new Error("err"),
    })
    expect(spyError).toHaveBeenCalledWith(
      expect.stringContaining("❌ Error: msg (Error: err)"),
    )
  })
})

describe("statusMapFromResults()", () => {
  it("should create a status map from results", () => {
    expect(
      E2E.statusMapFromResults([
        { level: "assertion", status: E2EStatus.ERROR },
        { level: "assertion", status: E2EStatus.FAILED },
        { level: "assertion", status: E2EStatus.SKIPPED },
        { level: "assertion", status: E2EStatus.SUCCESS },
        { level: "assertion", status: E2EStatus.SUCCESS },
      ]),
    ).toMatchObject({
      error: 1,
      failed: 1,
      skipped: 1,
      success: 2,
    })
  })
})

describe("overallStatus", () => {
  it("should decide to skipped", () => {
    expect(
      E2E._overallStatus({ error: 0, failed: 0, skipped: 1, success: 0 }),
    ).toEqual(E2EStatus.SKIPPED)
  })
  it("should decide to success", () => {
    expect(
      E2E._overallStatus({ error: 0, failed: 0, skipped: 0, success: 1 }),
    ).toEqual(E2EStatus.SUCCESS)
    expect(
      E2E._overallStatus({ error: 0, failed: 0, skipped: 1, success: 1 }),
    ).toEqual(E2EStatus.SUCCESS)
    expect(
      E2E._overallStatus({ error: 0, failed: 0, skipped: 0, success: 0 }),
    ).toEqual(E2EStatus.SUCCESS)
  })
  it("should decide to failed", () => {
    expect(
      E2E._overallStatus({ error: 0, failed: 1, skipped: 0, success: 1 }),
    ).toEqual(E2EStatus.FAILED)
    expect(
      E2E._overallStatus({ error: 0, failed: 1, skipped: 1, success: 1 }),
    ).toEqual(E2EStatus.FAILED)
    expect(
      E2E._overallStatus({ error: 0, failed: 1, skipped: 0, success: 0 }),
    ).toEqual(E2EStatus.FAILED)
    expect(
      E2E._overallStatus({ error: 0, failed: 1, skipped: 1, success: 0 }),
    ).toEqual(E2EStatus.FAILED)
  })
  it("should decide to error", () => {
    expect(
      E2E._overallStatus({ error: 1, failed: 1, skipped: 0, success: 1 }),
    ).toEqual(E2EStatus.ERROR)
    expect(
      E2E._overallStatus({ error: 1, failed: 1, skipped: 1, success: 1 }),
    ).toEqual(E2EStatus.ERROR)
    expect(
      E2E._overallStatus({ error: 1, failed: 1, skipped: 0, success: 0 }),
    ).toEqual(E2EStatus.ERROR)
    expect(
      E2E._overallStatus({ error: 1, failed: 1, skipped: 1, success: 0 }),
    ).toEqual(E2EStatus.ERROR)
  })
})

describe("runTest", () => {
  const mockAssertion = mock<E2EAssertion>()
  mockAssertion.message = "Assertion message"
  mockAssertion.skip = false
  const mockProcessingResult = {} as ProcessingResult
  const mockTestConfig = {} as E2ETestConfig

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it("should run all assertions and return results", () => {
    mockAssertion.assertFn.mockReturnValue(true)
    const mockTest: E2ETest = { assertions: [mockAssertion] }

    const result = E2E._runTest(
      mockTest,
      mockTestConfig,
      mockProcessingResult,
      ctx,
    )

    const results: E2EResult[] = result.results ?? []
    expect(result.status).toEqual(E2EStatus.SUCCESS)
    expect(results.length).toEqual(1)
    expect(results[0].message).toEqual("Assertion message")
    expect(results[0].status).toEqual(E2EStatus.SUCCESS)
  })

  it("should return failure on failed assertions", () => {
    mockAssertion.assertFn.mockReturnValue(false)
    const mockTest: E2ETest = { assertions: [mockAssertion] }

    const result = E2E._runTest(
      mockTest,
      mockTestConfig,
      mockProcessingResult,
      ctx,
    )

    const results: E2EResult[] = result.results ?? []
    expect(result.status).toEqual(E2EStatus.FAILED)
    expect(results.length).toEqual(1)
    expect(results[0].message).toEqual(
      "Assertion message\n(No detailed expectation was reported via expect())",
    )
    expect(results[0].status).toEqual(E2EStatus.FAILED)
    expect(mockAssertion.assertFn).toHaveBeenCalled()
  })

  it("should skip skipped tests", () => {
    const mockTest: E2ETest = {
      assertions: [mockAssertion],
      skip: true,
    }

    const result = E2E._runTest(
      mockTest,
      mockTestConfig,
      mockProcessingResult,
      ctx,
    )

    const results = result.results ?? []
    expect(result.status).toEqual(E2EStatus.SKIPPED)
    expect(results.length).toEqual(0)
    expect(mockAssertion.assertFn).not.toHaveBeenCalled()
  })

  it("should handle assertion errors", () => {
    mockAssertion.assertFn.mockImplementation(() => {
      throw new Error("Assertion error")
    })
    const mockTest: E2ETest = { assertions: [mockAssertion] }

    const result = E2E._runTest(
      mockTest,
      mockTestConfig,
      mockProcessingResult,
      ctx,
    )

    const results = result.results ?? []
    expect(result.status).toEqual(E2EStatus.ERROR)
    expect(results.length).toEqual(1)
    expect(results[0].message).toEqual("Assertion message")
    expect((results[0].error as Error).message).toEqual("Assertion error")
  })
})

describe("runTests", () => {
  const info: ExampleInfo = {
    name: "test",
    title: "Test",
    description: "Test description",
    category: ExampleCategory.BASICS,
  }
  const initConfig: E2EInitConfig = {
    mails: [{}],
  }
  const runConfig: Config = {
    settings: {
      markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
    },
    threads: [
      {
        match: {
          query: "some-query",
        },
        actions: [
          {
            name: "global.noop",
          },
        ],
      },
    ],
  }
  let globals: E2EGlobalConfig
  let mockTestConfig: E2ETestConfig
  beforeAll(() => {
    globals = newE2EGlobalConfig(ctx)
    mockTestConfig = {
      example: {
        config: runConfig,
        info,
      },
      info,
      globals,
      initConfig,
      runConfig,
      tests: [],
    } as E2ETestConfig
  })

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it("should return aggregated results from individual tests", async () => {
    const result = await E2E.runTests(mockTestConfig, true, "main", ctx)
    expect(result.level).toEqual("suite")
  })

  it("should send test emails and run tests", async () => {
    mockTestConfig.initConfig!.mails = [{ subject: "Test mail" }]
    jest.spyOn(E2E, "initWait").mockImplementation(() => {})

    await E2E.runTests(mockTestConfig, false, "main", ctx)

    expect(ctx.env.mailApp.sendEmail).toHaveBeenCalledWith({
      to: globals.to,
      subject: `${globals.subjectPrefix}Test mail`,
      htmlBody: info.description,
      attachments: undefined,
    })
  })

  it("should skip sending emails if skipInit is true", async () => {
    await E2E.runTests(mockTestConfig, true, undefined, ctx)
    expect(ctx.env.mailApp.sendEmail).not.toHaveBeenCalled()
  })

  it("should handle errors during test execution", async () => {
    const errorConfig = {
      ...mockTestConfig,
      runConfig: {
        threads: [
          {
            actions: [
              {
                name: "global.panic",
                args: {
                  message: "A forced exception",
                },
              },
            ],
          },
        ],
      },
    } as any

    const result = await E2E.runTests(errorConfig, true, "main", ctx)
    expect(result.status).toBe(E2EStatus.ERROR)
  })
})

describe("E2E static runners", () => {
  it("should runAllTests", async () => {
    const testConfigs = [
      {
        info: { category: "cat", name: "test1" },
        example: { config: ConfigMocks.newDefaultConfig() },
      },
    ] as any
    jest
      .spyOn(E2E, "runTests")
      .mockResolvedValue({ status: E2EStatus.SUCCESS } as any)
    const result = await E2E.runAllTests(
      testConfigs,
      true,
      "main",
      ctx,
      "run-id",
    )
    expect(result.status).toBe(E2EStatus.SUCCESS)
  })

  it("should initAllTests", () => {
    const testConfigs = [
      {
        info: { category: "cat", name: "test1" },
        example: { config: ConfigMocks.newDefaultConfig() },
      },
    ] as any
    jest.spyOn(E2E, "initTests").mockImplementation(() => {})
    jest.spyOn(E2E, "initWait").mockImplementation(() => {})
    const runId = E2E.initAllTests(testConfigs, "main", ctx, "run-id")
    expect(runId).toBe("run-id")
  })
})

describe("E2E action promises", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it("should await and update meta from action promises", async () => {
    const mockActionPromise = Promise.resolve({
      actionMeta: { "new.key": { value: "new-val" } },
    } as any)

    const runConfig = {
      settings: {
        markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
      },
      threads: [],
    } as any

    // Use a fresh context for this test
    const localCtx = MockFactory.newMocks().envContext as any

    const testConfig = {
      info: { category: "cats", name: "test-promises" },
      example: { config: runConfig },
      runConfig: runConfig,
    } as any

    const mockProcessingResult = {
      status: ProcessingStatus.OK,
      actionPromises: [mockActionPromise],
      executedActions: [],
      processedAttachmentConfigs: 0,
      processedAttachments: 0,
      processedMessageConfigs: 0,
      processedMessages: 0,
      processedThreadConfigs: 0,
      processedThreads: 0,
    } as any

    jest
      .spyOn(GmailProcessor, "runWithJson")
      .mockReturnValue(mockProcessingResult)

    await E2E.runTests(testConfig, true, "main", localCtx)

    // Access meta through bracket notation to avoid any strange JS object behavior
    expect(localCtx.meta["new.key"]).toBeDefined()
    expect((localCtx.meta as any)["new.key"].value).toBe("new-val")
  })
})

describe("E2E edge cases", () => {
  let globals: E2EGlobalConfig
  beforeEach(() => {
    globals = newE2EGlobalConfig(ctx)
  })

  it("should handle migrationConfig in runTests", async () => {
    const migrationConfig = {
      rules: [
        {
          filter: "to:me",
          folder: "Archive",
        },
      ],
      processedLabel: "gmail-processor/processed",
      sleepTime: 100,
      maxRuntime: 100,
      timezone: "UTC",
    } as any
    const testConfig = {
      info: { category: ExampleCategory.BASICS, name: "mig" },
      migrationConfig,
      globals,
    } as any
    const result = await E2E.runTests(testConfig, true, "main", ctx)
    expect(result.status).toBe(E2EStatus.SUCCESS)
  })

  it("should handle processing results with ERROR status", async () => {
    const errorResult = {
      status: ProcessingStatus.ERROR,
      error: new Error("Processing error"),
      executedActions: [],
      actionPromises: [],
    } as any
    jest.spyOn(GmailProcessor, "runWithJson").mockReturnValue(errorResult)

    const testConfig = {
      info: { category: ExampleCategory.BASICS, name: "err" },
      runConfig: {},
      globals,
    } as any
    const result = await E2E.runTests(testConfig, true, "main", ctx)
    expect(result.status).toBe(E2EStatus.ERROR)
    expect(result.error).toBeInstanceOf(Error)
  })

  it("should timeout in initWait if expected count is never reached", () => {
    globals.maxPollTimeMs = 100
    globals.pollIntervalMs = 50
    ;(ctx.env.gmailApp.search as jest.Mock).mockReturnValue([])
    E2E.initWait(globals, ctx, 1)
    expect(ctx.env.gmailApp.search).toHaveBeenCalled()
  })

  it("should run all tests in runAllTests and return summary", async () => {
    const testConfigs = [
      {
        info: { category: ExampleCategory.BASICS, name: "test1" },
        example: { config: {} },
        runConfig: {},
        globals,
      },
    ] as any
    jest
      .spyOn(E2E, "runTests")
      .mockResolvedValue({ status: E2EStatus.SUCCESS } as any)
    const result = await E2E.runAllTests(testConfigs, true, "main", ctx)
    expect(result.status).toBe(E2EStatus.SUCCESS)
  })

  it("should support regex and other types in isRegExp", () => {
    expect(E2E.isRegExp(/test/)).toBe(true)
    expect(E2E.isRegExp("test")).toBe(false)
    expect(E2E.isRegExp(null)).toBe(false)
  })

  it("should fetch blob source from file path", () => {
    const spyFetch = jest
      .spyOn(ctx.env.urlFetchApp, "fetch")
      .mockReturnValue({ getBlob: () => ({}) } as any)
    E2E["_getBlobSourceFromFilePath"](ctx, globals, "http://example.com/file")

    expect(spyFetch).toHaveBeenCalledWith("http://example.com/file")
  })

  it("should handle nested results in logResults", () => {
    const spyInfo = jest.spyOn(ctx.log, "info")
    E2E.logResults(
      ctx,
      {
        status: E2EStatus.SUCCESS,
        message: "parent",
        results: [{ status: E2EStatus.SUCCESS, message: "child" }],
      } as any,
      true,
    )
    expect(spyInfo).toHaveBeenCalledWith(expect.stringContaining("parent"))
    expect(spyInfo).toHaveBeenCalledWith(expect.stringContaining("child"))
  })

  it("should exercise E2EAssertionHelper missing methods", () => {
    const h = new E2EAssertionHelper(
      {} as any,
      { status: ProcessingStatus.ERROR, executedActions: [] } as any,
      ctx,
      E2E.expect.bind(E2E),
    )
    expect(h.expectStatus(ProcessingStatus.ERROR)).toBe(true)
    expect(h.matches("test", /test/)).toBe(true)
    expect(h.matches("test", "test")).toBe(true)
    expect(h.matches("test", "other")).toBe(false)
    expect(h.expectActionExecuted(undefined, "missing")).toBe(false)
    expect(h.expectActionMeta(undefined, "key", "val")).toBe(false)
  })

  it("should handle initTests with attachments", () => {
    const configWithAttachments = {
      info: {
        category: ExampleCategory.BASICS,
        name: "test",
        description: "description",
      },
      initConfig: {
        mails: [{ attachments: ["path/to/file.txt"] }],
      },
      globals,
    } as any
    const spyFetch = jest
      .spyOn(ctx.env.urlFetchApp, "fetch")
      .mockReturnValue({ getBlob: () => ({}) } as any)
    E2E.initTests(configWithAttachments, "main", ctx, "run-id")
    expect(spyFetch).toHaveBeenCalled()
  })

  it("should replace drive base path in runConfig", async () => {
    const basePath = E2EDefaults.driveTestBasePath(
      { category: ExampleCategory.BASICS, name: "test-replace" } as any,
      undefined,
    )
    const runConfig = {
      settings: {
        markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
        logSheetLocation: `${basePath}/log`,
      },
      threads: [],
    } as any
    const testConfig = {
      info: { category: ExampleCategory.BASICS, name: "test-replace" },
      example: { config: runConfig },
      runConfig,
    } as any

    const spyRun = jest.spyOn(GmailProcessor, "runWithJson").mockReturnValue({
      status: ProcessingStatus.OK,
      executedActions: [],
      actionPromises: [],
    } as any)

    await E2E.runTests(testConfig, true, "main", ctx, "run-id")

    expect(spyRun).toHaveBeenCalledWith(
      expect.objectContaining({
        settings: expect.objectContaining({
          logSheetLocation: expect.stringContaining("-run-id"),
        }),
      }),
      expect.any(Array),
      expect.any(Object),
    )
  })

  it("should throw error if no config is given in runTests", async () => {
    const testConfig = {
      info: {
        category: ExampleCategory.BASICS,
        name: "test",
        description: "desc",
      },
      example: {},
    } as any
    const result = await E2E.runTests(testConfig, true, "main", ctx)
    expect(result.status).toBe(E2EStatus.ERROR)
    expect((result.error as Error).message).toBe(
      "No processing configuration given!",
    )
  })

  it("should handle test execution loop", async () => {
    const runConfig = {
      settings: { markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ },
      threads: [],
    } as any
    const testConfig = {
      info: {
        category: ExampleCategory.BASICS,
        name: "test",
        description: "desc",
      },
      runConfig,
      example: {},
      tests: [
        {
          message: "Test 1",
          assertions: [{ message: "Assert 1", assertFn: () => true }],
        },
      ],
    } as any
    jest.spyOn(GmailProcessor, "runWithJson").mockReturnValue({
      status: ProcessingStatus.OK,
      executedActions: [],
      actionPromises: [],
    } as any)

    const result = await E2E.runTests(testConfig, true, "main", ctx)
    expect(result.results).toHaveLength(1)
    expect(result.results![0].status).toBe(E2EStatus.SUCCESS)
  })

  it("should cover findNextAction and detailed failure reporting", () => {
    const a1 = { config: { name: "action1" } } as any
    const a2 = { config: { name: "action2" } } as any
    const h = new E2EAssertionHelper(
      {} as any,
      { executedActions: [a1, a2] } as any,
      ctx,
      E2E.expect.bind(E2E),
    )
    expect(h.findNextAction("action2")).toBe(a2)

    // Trigger failure detail reporting in E2E.assert
    const assertion: E2EAssertion = {
      message: "Detail Fail",
      assertFn: (_tc, _pr, _ctx, expect) => {
        expect(ctx, "actual", "expected", "should fail")
        return false
      },
    }
    const result = E2E.assert({} as any, {} as any, assertion, ctx)
    expect(result.message).toContain('Expected: "expected"')
    expect(result.message).toContain("Actual: actual")

    // Trigger more detail branches in E2E.ts
    const assertion2: E2EAssertion = {
      message: "Detail Fail 2",
      assertFn: (_tc, _pr, _ctx, expect) => {
        expect(ctx, { x: 1 }, /regex/, "should fail")
        return false
      },
    }
    const res2 = E2E.assert({} as any, {} as any, assertion2, ctx)
    expect(res2.message).toContain("Expected: /regex/")
    expect(res2.message).toContain("Actual: {")
  })
})
