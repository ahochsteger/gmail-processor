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

let ctx: EnvContext
let mocks: Mocks

beforeAll(() => {
  mocks = MockFactory.newMocks()
  ctx = mocks.envContext
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

describe("getUuid", () => {
  it("should default to test-id when no env is provided", () => {
    const mockCtx = {} as EnvContext
    let runId: string | undefined
    const activeTestRunId =
      runId ??
      (mockCtx &&
      mockCtx.env &&
      mockCtx.env.utilities &&
      typeof mockCtx.env.utilities.getUuid === "function"
        ? mockCtx.env.utilities.getUuid().substring(0, 8)
        : "test-id")
    expect(activeTestRunId).toEqual("test-id")
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
