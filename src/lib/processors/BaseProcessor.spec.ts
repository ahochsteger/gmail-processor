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
    PatternUtil.substitute(mocks.processingContext, `\${${TEST_CONTEXT_KEY}}`),
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
    PatternUtil.substitute(mocks.processingContext, `\${${TEST_CONTEXT_KEY}}`),
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
    PatternUtil.substitute(mocks.processingContext, `\${${TEST_CONTEXT_KEY}}`),
  ).toEqual(TEST_CONTEXT_VALUE)
})
