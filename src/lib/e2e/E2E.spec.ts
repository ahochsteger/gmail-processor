import { mock } from "jest-mock-extended"
import { ExampleInfo } from "../../examples/Example"
import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import {
  EnvContext,
  ProcessingResult,
  ProcessingStatus,
  RunMode,
} from "../Context"
import { Config } from "../config/Config"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import {
  E2E,
  E2EAssertion,
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
    expect(results[0].message).toEqual("Assertion message")
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
  const run = jest.fn()
  jest.mock("..", () => ({
    run: run,
  }))
  jest.mock("../adapter/GDriveAdapter", () => ({
    DriveUtils: {
      createFile: jest.fn(),
    },
  }))
  const mockTests: E2ETest[] = [
    {
      message: "Successful execution",
      assertions: [
        {
          message: "One thread config should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedThreadConfigs == 1,
        },
        {
          message: "One thread should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedThreads == 1,
        },
        {
          message: "One action should have been executed",
          assertFn: (_testConfig, procResult) =>
            procResult.executedActions.length == 1,
        },
      ],
    },
    {
      message: "No failures",
      assertions: [
        {
          message: "Processing status should not be ERROR",
          assertFn: (_testConfig, procResult) =>
            procResult.status !== ProcessingStatus.ERROR,
        },
        {
          message: "No error should have occurred",
          assertFn: (_testConfig, procResult) => procResult.error === undefined,
        },
        {
          message: "No action should have failed",
          assertFn: (_testConfig, procResult) =>
            procResult.failedAction === undefined,
        },
      ],
    },
  ]
  const info: ExampleInfo = {
    name: "test",
    title: "Test",
    description: "Test description",
    category: "basics",
    schemaVersion: "v2",
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
      info,
      globals,
      initConfig,
      runConfig,
      tests: mockTests,
    } as E2ETestConfig
  })

  beforeEach(() => {
    jest.clearAllMocks()
    // const runTest = jest.fn().mockReturnValue({ status: E2EStatus.SUCCESS })
    // E2E.runTest = runTest
  })

  it("should return aggregated results from individual tests", () => {
    // NOTE: For some unknown reason this test fails if moved to the last it() within describe()
    const result = E2E.runTests(
      mockTestConfig,
      true,
      "main",
      RunMode.DANGEROUS,
      ctx,
    )

    const results = result.results ?? []
    expect(results.length).toEqual(2)
    expect(results[0].message).toEqual(mockTests[0].message)
    expect(results[1].message).toEqual(mockTests[1].message)
  })

  it("should send test emails and run tests", () => {
    initConfig.mails = [{ subject: "Test mail" }]

    const result = E2E.runTests(
      mockTestConfig,
      false,
      "main",
      RunMode.DANGEROUS,
      ctx,
    )

    expect(ctx.env.mailApp.sendEmail).toHaveBeenCalledWith({
      to: globals.to,
      subject: `${globals.subjectPrefix}Test mail`,
      htmlBody: undefined,
      attachments: undefined,
    })
    expect(result.status).toEqual(E2EStatus.SUCCESS)
    expect(result.results?.length).toEqual(2)
  })

  it("should skip sending emails if skipInit is true", () => {
    E2E.runTests(mockTestConfig, true, undefined, RunMode.DANGEROUS, ctx)

    expect(ctx.env.mailApp.sendEmail).not.toHaveBeenCalled()
  })

  it("should handle errors during test execution", () => {
    mockTestConfig.runConfig = mockTestConfig.runConfig ?? {}
    mockTestConfig.runConfig.threads = [
      {
        actions: [
          {
            name: "global.panic",
            args: {
              message: "A forced exeption",
            },
          },
        ],
      },
    ]

    const result = E2E.runTests(
      mockTestConfig,
      true,
      "main",
      RunMode.DANGEROUS,
      ctx,
    )

    expect(result.status).toBe(E2EStatus.ERROR)
    expect((result.error as Error)?.message).toContain("A forced exeption")
  })
})

describe("runTests with migrationConfig", () => {
  let globals: E2EGlobalConfig
  let mockTestConfig: E2ETestConfig
  let migrationConfig
  beforeAll(() => {
    globals = newE2EGlobalConfig(ctx)
    const info: ExampleInfo = {
      name: "test-v1",
      title: "Test v1 config",
      description: "Test v1 config description",
      category: "basics",
      schemaVersion: "v1",
    }
    const initConfig: E2EInitConfig = {
      mails: [{}],
    }
    migrationConfig = ConfigMocks.newDefaultV1ConfigJson()
    const mockTests: E2ETest[] = []
    mockTestConfig = {
      info,
      globals,
      initConfig,
      migrationConfig,
      tests: mockTests,
    } as E2ETestConfig
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("should process migrationConfig", () => {
    E2E.runTests(mockTestConfig, true, undefined, RunMode.DANGEROUS, ctx)

    expect(ctx.env.mailApp.sendEmail).not.toHaveBeenCalled()
  })
})
