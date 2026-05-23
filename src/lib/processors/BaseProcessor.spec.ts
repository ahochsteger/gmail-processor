import { MockFactory } from "../../test/mocks/MockFactory"
import {
  MetaInfo,
  MetaInfoType,
  ProcessingContext,
  ProcessingResult,
  ProcessingStatus,
  newMetaInfo,
  newProcessingResult,
  updateContextMeta,
} from "../Context"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionRegistry,
  ActionReturnType,
} from "../actions/ActionRegistry"
import { ActionBaseConfig, ProcessingStage } from "../config/ActionConfig"
import { PatternUtil } from "../utils/PatternUtil"
import { BaseProcessor } from "./BaseProcessor"

class TestProcessor extends BaseProcessor {
  public static execute(
    ctx: ProcessingContext,
    stage: ProcessingStage,
    result: ProcessingResult,
    actionSets: ActionBaseConfig[],
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

class TestStringErrorActionProvider implements ActionProvider {
  [key: string]: ActionFunction
  public stringErrorThrowingMethod(
    _ctx: ProcessingContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args: ActionArgsType = {},
  ) {
    throw "string-error-message"
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
    updateContextMeta(mocks.processingContext, {
      "proc.key": newMetaInfo(MetaInfoType.STRING, "proc-val", "", ""),
    })
    expect(mocks.processingContext.meta["proc.key"]?.value).toBe("proc-val")

    // Test ThreadContext
    updateContextMeta(mocks.threadContext, {
      "thread.key": newMetaInfo(MetaInfoType.STRING, "thread-val", "", ""),
    })
    expect(mocks.threadContext.meta["thread.key"]?.value).toBe("thread-val")

    // Test MessageContext
    updateContextMeta(mocks.messageContext, {
      "message.key": newMetaInfo(MetaInfoType.STRING, "message-val", "", ""),
    })
    expect(mocks.messageContext.meta["message.key"]?.value).toBe("message-val")

    // Test AttachmentContext
    updateContextMeta(mocks.attachmentContext, {
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
    updateContextMeta(mocks.envContext, {
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

  it("should handle regex match groups without named groups", () => {
    const mocks = MockFactory.newMocks()
    const m: MetaInfo = {
      "message.subject": newMetaInfo(
        MetaInfoType.STRING,
        "Order #12345",
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
    expect(result["message.subject.match.1"]?.value).toBe("12345")
    expect(result["message.matched"]?.value).toBe(true)
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

  it("should handle effectiveCSV with undefined global", () => {
    const res = TestProcessor["effectiveCSV"](undefined, "a,b")
    expect(res).toBe(",a,b")
  })

  it("should handle effectiveMaxNumber with undefined global or local", () => {
    const res1 = TestProcessor["effectiveMaxNumber"](undefined, 10, -1)
    expect(res1).toBe(10)
    const res2 = TestProcessor["effectiveMaxNumber"](5, -1, -1)
    expect(res2).toBe(5)
    const res3 = TestProcessor["effectiveMaxNumber"](5, 10, -1)
    expect(res3).toBe(10)
  })

  it("should handle effectiveMinNumber with undefined global or local", () => {
    const res1 = TestProcessor["effectiveMinNumber"](undefined, 10, -1)
    expect(res1).toBe(10)
    const res2 = TestProcessor["effectiveMinNumber"](5, -1, -1)
    expect(res2).toBe(5)
    const res3 = TestProcessor["effectiveMinNumber"](5, 10, -1)
    expect(res3).toBe(5)
  })

  it("should handle getRefDocs with non-empty description", () => {
    const res = TestProcessor["getRefDocs"](
      "thread",
      "moveToArchive",
      "Some description.",
    )
    expect(res).toContain("Some description. See [GmailThread.moveToArchive()]")
  })

  it("should handle string throwing actions", () => {
    const mocks = MockFactory.newMocks()
    const actionRegistry = new ActionRegistry()
    actionRegistry.registerActionProvider(
      "test",
      new TestStringErrorActionProvider(),
    )
    let result = newProcessingResult()
    expect(() => {
      result = TestProcessor.execute(
        mocks.processingContext,
        ProcessingStage.MAIN,
        result,
        [
          {
            name: "test.stringErrorThrowingMethod",
            processingStage: ProcessingStage.MAIN,
          },
        ],
      )
    }).toThrow()
  })

  it("should handle matchesRules regex undefined value branch", () => {
    const mocks = MockFactory.newMocks()
    const res = BaseProcessor["matchesRules"](mocks.processingContext, [
      { name: "test", type: "regex", config: "abc", value: undefined },
    ])
    expect(res).toBe(false)
  })

  it("should handle getStr default fallback", () => {
    const res = BaseProcessor["getStr"](undefined as any, "default")
    expect(res).toBe("default")
  })

  it("should handle getRefDocs empty description", () => {
    const res = TestProcessor["getRefDocs"]("thread", "moveToArchive", "")
    expect(res).toBe(
      "See [GmailThread.moveToArchive()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#moveToArchive\\(\\)) reference docs.",
    )
  })
})
