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
    m["someKey"] = newMetaInfo(
      MetaInfoType.STRING,
      "someValue",
      "Some description",
    )
    return {
      ok: true,
      actionMeta: m,
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
  }).toThrowError()
})

it("should update meta context if actions return actionMeta", () => {
  const mocks = MockFactory.newMocks()
  const actionRegistry = new ActionRegistry()
  actionRegistry.registerActionProvider("test", new TestActionProvider())
  mocks.processingContext.proc.actionRegistry = actionRegistry
  let result = newProcessingResult()
  result = TestProcessor.execute(
    mocks.processingContext,
    ProcessingStage.MAIN,
    result,
    [
      {
        name: "test.metaContextModifyingMethod",
        processingStage: ProcessingStage.MAIN,
      },
    ],
  )
  expect(result.status).toEqual(ProcessingStatus.OK)
  expect(mocks.processingContext.meta["someKey"].value).toEqual("someValue")
})
