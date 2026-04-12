import { MockFactory } from "../../test/mocks/MockFactory"
import {
  MetaInfo,
  MetaInfoType,
  ProcessingContext,
  ProcessingResult,
  ProcessingStatus,
  newMetaInfo,
  newProcessingResult,
} from "../Context"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionRegistry,
  ActionReturnType,
} from "../actions/ActionRegistry"
import { ActionConfig, ProcessingStage } from "../config/ActionConfig"
import { PatternUtil } from "../utils/PatternUtil"
import { BaseProcessor } from "./BaseProcessor"

class TestProcessor extends BaseProcessor {
  public static execute(
    ctx: ProcessingContext,
    stage: ProcessingStage,
    result: ProcessingResult,
    actionSets: ActionConfig[],
  ): ProcessingResult {
    return this.executeActions(ctx, stage, result, actionSets)
  }
}

const TEST_CONTEXT_KEY = "some.key"
const TEST_CONTEXT_VALUE = "some value"

class TestActionProvider implements ActionProvider {
  [key: string]: ActionFunction
  public errorThrowingMethod(
    _ctx: ProcessingContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args: ActionArgsType = {},
  ) {
    throw new Error("Error from staticErrorThrowingMethod")
  }

  public static metaContextModifyingMethod(
    _ctx: ProcessingContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args: ActionArgsType = {},
  ): ActionReturnType {
    const m: MetaInfo = {}
    m[TEST_CONTEXT_KEY] = newMetaInfo(
      MetaInfoType.STRING,
      TEST_CONTEXT_VALUE,
      "Some Title",
      "Some description",
    )
    return {
      actionMeta: m,
    }
  }

  public static metaContextVerifyingMethod(
    ctx: ProcessingContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args: ActionArgsType = {},
  ): ActionReturnType {
    const data = []
    if (ctx.procMeta[TEST_CONTEXT_KEY]?.value !== TEST_CONTEXT_VALUE) {
      data.push(`ctx.procMeta: ${ctx.procMeta[TEST_CONTEXT_KEY]?.value}`)
    }
    if (ctx.meta[TEST_CONTEXT_KEY]?.value !== TEST_CONTEXT_VALUE) {
      data.push(`ctx.meta: ${ctx.meta[TEST_CONTEXT_KEY]?.value}`)
    }
    return {
      data,
    }
  }
}

it("should handle error throwing actions", () => {
  const mocks = MockFactory.newMocks()
  const actionRegistry = new ActionRegistry()
  actionRegistry.registerActionProvider("test", new TestActionProvider())
  let result = newProcessingResult()
  expect(() => {
    result = TestProcessor.execute(
      mocks.processingContext,
      ProcessingStage.MAIN,
      result,
      [
        {
          name: "test.errorThrowingMethod",
          processingStage: ProcessingStage.MAIN,
        },
      ],
    )
  }).toThrow()
})

it("should update meta context if actions return actionMeta", () => {
  const mocks = MockFactory.newMocks()
  const actionRegistry = new ActionRegistry()
  actionRegistry.registerActionProvider("test", new TestActionProvider())
  mocks.processingContext.proc.actionRegistry = actionRegistry
  let result = newProcessingResult()
  const actionSet = [
    {
      name: "test.metaContextModifyingMethod",
      processingStage: ProcessingStage.PRE_MAIN,
    },
    {
      name: "test.metaContextVerifyingMethod",
      processingStage: ProcessingStage.PRE_MAIN,
    },
    {
      name: "test.metaContextVerifyingMethod",
      processingStage: ProcessingStage.MAIN,
    },
    {
      name: "test.metaContextVerifyingMethod",
      processingStage: ProcessingStage.POST_MAIN,
    },
  ]
  expect(mocks.processingContext.meta[TEST_CONTEXT_KEY]).toBeUndefined()
  expect(mocks.processingContext.procMeta[TEST_CONTEXT_KEY]).toBeUndefined()
  expect(
    PatternUtil.substitute(mocks.processingContext, `\${${TEST_CONTEXT_KEY}}`),
  ).toEqual("")
  result = TestProcessor.execute(
    mocks.processingContext,
    ProcessingStage.PRE_MAIN,
    result,
    actionSet,
  )
  expect(result.status).toEqual(ProcessingStatus.OK)
  expect(mocks.processingContext.meta[TEST_CONTEXT_KEY]).toMatchObject({
    value: TEST_CONTEXT_VALUE,
  })
  expect(mocks.processingContext.procMeta[TEST_CONTEXT_KEY]).toMatchObject({
    value: TEST_CONTEXT_VALUE,
  })
  expect(
    PatternUtil.substitute(mocks.processingContext, `{{${TEST_CONTEXT_KEY}}}`),
  ).toEqual(TEST_CONTEXT_VALUE)
  result = TestProcessor.execute(
    mocks.processingContext,
    ProcessingStage.MAIN,
    result,
    actionSet,
  )
  expect(result.status).toEqual(ProcessingStatus.OK)
  expect(mocks.processingContext.meta[TEST_CONTEXT_KEY]).toMatchObject({
    value: TEST_CONTEXT_VALUE,
  })
  expect(mocks.processingContext.procMeta[TEST_CONTEXT_KEY]).toMatchObject({
    value: TEST_CONTEXT_VALUE,
  })
  expect(
    PatternUtil.substitute(mocks.processingContext, `{{${TEST_CONTEXT_KEY}}}`),
  ).toEqual(TEST_CONTEXT_VALUE)
  result = TestProcessor.execute(
    mocks.processingContext,
    ProcessingStage.POST_MAIN,
    result,
    actionSet,
  )
  expect(result.status).toEqual(ProcessingStatus.OK)
  expect(mocks.processingContext.meta[TEST_CONTEXT_KEY]).toMatchObject({
    value: TEST_CONTEXT_VALUE,
  })
  expect(mocks.processingContext.procMeta[TEST_CONTEXT_KEY]).toMatchObject({
    value: TEST_CONTEXT_VALUE,
  })
  expect(
    PatternUtil.substitute(mocks.processingContext, `{{${TEST_CONTEXT_KEY}}}`),
  ).toEqual(TEST_CONTEXT_VALUE)
})

describe("matchLabels()", () => {
  it("should test the labels", () => {
    const examples = [
      { config: "label", value: "label", expected: true },
      { config: "label", value: "", expected: false },
      { config: "label1,label2", value: "label1", expected: false },
      { config: "label2", value: "label1,label2", expected: true },
      { config: "", value: "label1,label2", expected: true },
      { config: "label1", value: "", expected: false },
      { config: "label1", value: undefined, expected: false },
      { config: "^label[0-9]$", value: "label3", expected: true },
      { config: "^label[0-9]$", value: "xlabel3x", expected: false },
      { config: ".*", value: "", expected: true },
    ]
    let expected = ""
    let actual = ""
    for (let i = 0; i < examples.length; i++) {
      const e = examples[i]
      const cfg = JSON.stringify(e)
      const res = BaseProcessor.matchLabels(e.config, e.value)
      actual += `${i + 1}. ${cfg}: ${res}\n`
      expected += `${i + 1}. ${cfg}: ${e.expected}\n`
    }
    expect(actual).toEqual(expected)
  })
})

describe("Hierarchical Metadata Synchronization", () => {
  it("should update metadata for all context types", () => {
    const mocks = MockFactory.newMocks()

    // Test ProcessingContext
    BaseProcessor.updateContextMeta(mocks.processingContext, {
      "proc.key": newMetaInfo(MetaInfoType.STRING, "proc-val", "", ""),
    })
    expect(mocks.processingContext.meta["proc.key"]?.value).toBe("proc-val")

    // Test ThreadContext
    BaseProcessor.updateContextMeta(mocks.threadContext, {
      "thread.key": newMetaInfo(MetaInfoType.STRING, "thread-val", "", ""),
    })
    expect(mocks.threadContext.meta["thread.key"]?.value).toBe("thread-val")

    // Test MessageContext
    BaseProcessor.updateContextMeta(mocks.messageContext, {
      "message.key": newMetaInfo(MetaInfoType.STRING, "message-val", "", ""),
    })
    expect(mocks.messageContext.meta["message.key"]?.value).toBe("message-val")

    // Test AttachmentContext
    BaseProcessor.updateContextMeta(mocks.attachmentContext, {
      "attachment.key": newMetaInfo(
        MetaInfoType.STRING,
        "attachment-val",
        "",
        "",
      ),
    })
    expect(mocks.attachmentContext.meta["attachment.key"]?.value).toBe(
      "attachment-val",
    )
  })

  it("should update metadata for environment context", () => {
    const mocks = MockFactory.newMocks()
    BaseProcessor.updateContextMeta(mocks.envContext, {
      "env.key": newMetaInfo(MetaInfoType.STRING, "env-val", "", ""),
    })
    expect(mocks.envContext.meta["env.key"]?.value).toBe("env-val")
  })
})

describe("matchTimestamp()", () => {
  it("should match timestamps correctly", () => {
    const past = "2023-01-01T00:00:00Z"
    const future = "2024-01-01T00:00:00Z"
    // isNewer=true: matchTime (past) < compareTime (future) -> true
    expect((BaseProcessor as any).matchTimestamp(past, future, true)).toBe(true)
    // isNewer=false: matchTime (past) >= compareTime (future) -> false
    expect((BaseProcessor as any).matchTimestamp(past, future, false)).toBe(
      false,
    )
    // compareDate undefined
    expect((BaseProcessor as any).matchTimestamp(past, undefined, true)).toBe(
      false,
    )
    // matchTimestamp undefined
    expect((BaseProcessor as any).matchTimestamp(undefined, future, true)).toBe(
      true,
    )
  })
})

describe("buildRegExpSubstitutionMap()", () => {
  it("should handle regex match groups and named groups", () => {
    const mocks = MockFactory.newMocks()
    const m: MetaInfo = {
      "message.subject": newMetaInfo(
        MetaInfoType.STRING,
        "Order #12345: Shipment",
        "",
        "",
      ),
    }
    const regexMap = new Map([
      ["subject", "Order #(?<orderId>[0-9]+): (?<type>.*)"],
    ])
    const result = BaseProcessor.buildRegExpSubstitutionMap(
      mocks.processingContext,
      m,
      "message",
      regexMap,
    )

    expect(result["message.subject.match.1"]?.value).toBe("12345")
    expect(result["message.subject.match.2"]?.value).toBe("Shipment")
    expect(result["message.subject.match.orderId"]?.value).toBe("12345")
    expect(result["message.subject.match.type"]?.value).toBe("Shipment")
    expect(result["message.matched"]?.value).toBe(true)
  })

  it("should handle non-matching regex", () => {
    const mocks = MockFactory.newMocks()
    const m: MetaInfo = {
      "message.subject": newMetaInfo(
        MetaInfoType.STRING,
        "No match here",
        "",
        "",
      ),
    }
    const regexMap = new Map([["subject", "Order #([0-9]+)"]])
    const result = BaseProcessor.buildRegExpSubstitutionMap(
      mocks.processingContext,
      m,
      "message",
      regexMap,
    )
    expect(result["message.matched"]?.value).toBe(false)
  })

  it("should handle effectiveValue with global set and local unset", () => {
    const res = TestProcessor["effectiveValue"](true, false, false)
    expect(res).toBe(true)
  })

  it("should handle effectiveNumber", () => {
    const res = TestProcessor["effectiveNumber"](10, -1, -1)
    expect(res).toBe(10)
  })

  it("should generate processing trace for different contexts", () => {
    const mocks = MockFactory.newMocks()
    const action = { name: "test-action" }
    const actionResult = { ok: true }

    const threadTrace = TestProcessor["getProcessingTrace"](
      mocks.threadContext,
      action,
      actionResult,
    )
    expect(threadTrace.traces.thread).toBeDefined()

    const messageTrace = TestProcessor["getProcessingTrace"](
      mocks.messageContext,
      action,
      actionResult,
    )
    expect(messageTrace.traces.message).toBeDefined()

    const attachmentTrace = TestProcessor["getProcessingTrace"](
      mocks.attachmentContext,
      action,
      actionResult,
    )
    expect(attachmentTrace.traces.attachment).toBeDefined()
  })
})
