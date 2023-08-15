import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { MessageContext, ProcessingContext, RunMode } from "../Context"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionReturnType,
} from "../actions/ActionRegistry"
import { destructiveAction, readingAction, writingAction } from "./Decorators"

let dangerousMocks: Mocks
let safeModeMocks: Mocks
let dryRunMocks: Mocks
let spy: jest.SpyInstance

beforeEach(() => {
  dangerousMocks = MockFactory.newMocks()
  safeModeMocks = MockFactory.newMocks(
    ConfigMocks.newDefaultConfig(),
    RunMode.SAFE_MODE,
  )
  dryRunMocks = MockFactory.newMocks(
    ConfigMocks.newDefaultConfig(),
    RunMode.DRY_RUN,
  )
  spy = jest.spyOn(MyMessageActions, "testFunc")
})

class MyMessageActions implements ActionProvider<MessageContext> {
  [key: string]: ActionFunction<MessageContext>
  public static testFunc(ctx: ProcessingContext, args: ActionArgsType) {
    ctx.log.info(`args.val: ${args}`)
  }
  @destructiveAction()
  public static destruct<TArgs extends ActionArgsType>(
    context: ProcessingContext,
    args: TArgs,
  ): ActionReturnType {
    this.testFunc(context, args)
    return {}
  }
  @readingAction()
  public static read<TArgs extends ActionArgsType>(
    context: ProcessingContext,
    args: TArgs,
  ): ActionReturnType {
    this.testFunc(context, args)
    return {}
  }
  @writingAction()
  public static write<TArgs extends ActionArgsType>(
    context: ProcessingContext,
    args: TArgs,
  ): ActionReturnType {
    this.testFunc(context, args)
    return {}
  }
}

it("should execute destructive actions in dangerous run mode", () => {
  MyMessageActions.destruct(dangerousMocks.processingContext, {})
  expect(spy).toBeCalled()
})

it("should not execute destructive actions in dry-run mode", () => {
  MyMessageActions.destruct(dryRunMocks.processingContext, {})
  expect(spy).not.toBeCalled()
})

it("should not execute destructive actions in safe mode", () => {
  MyMessageActions.destruct(safeModeMocks.processingContext, {})
  expect(spy).not.toBeCalled()
})

it("should execute reading actions in dangerous mode", () => {
  MyMessageActions.read(dangerousMocks.processingContext, {})
  expect(spy).toBeCalled()
})

it("should execute reading actions in dry-run mode", () => {
  MyMessageActions.read(dryRunMocks.processingContext, {})
  expect(spy).toBeCalled()
})

it("should execute reading actions in safe mode", () => {
  MyMessageActions.read(safeModeMocks.processingContext, {})
  expect(spy).toBeCalled()
})

it("should execute writing actions in dangerous mode", () => {
  MyMessageActions.write(dangerousMocks.processingContext, {})
  expect(spy).toBeCalled()
})

it("should execute writing actions in dry-run mode", () => {
  MyMessageActions.write(dryRunMocks.processingContext, {})
  expect(spy).not.toBeCalled()
})

it("should execute writing actions in safe mode", () => {
  MyMessageActions.write(safeModeMocks.processingContext, {})
  expect(spy).toBeCalled()
})
