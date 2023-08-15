import { MockFactory } from "../../test/mocks/MockFactory"
import {
  ProcessingContext,
  ProcessingResult,
  newProcessingResult,
} from "../Context"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionRegistry,
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
          args: {},
          processingStage: ProcessingStage.MAIN,
        },
      ],
    )
  }).toThrowError()
})
