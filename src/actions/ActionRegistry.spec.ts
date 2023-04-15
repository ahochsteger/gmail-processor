import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingContext, ThreadContext } from "../Context"
import { Config } from "../config/Config"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionRegistry,
} from "./ActionRegistry"

class MyThreadActionProvider implements ActionProvider {
  [key: string]: ActionFunction
  public myThreadFunction(
    context: ProcessingContext,
    args: ActionArgsType,
    // { threadBoolArg: boolean, threadStringArg: string },
  ) {
    console.log(
      `Subject:${
        (context as ThreadContext).thread.getFirstMessageSubject
      }, threadBoolArg:${args.threadBoolArg}, threadStringArg:${
        args.threadStringArg
      }`,
    )
    return { ok: true }
  }
}

let mocks: Mocks
let myThreadActionProvider: MyThreadActionProvider
let actionRegistry: ActionRegistry

beforeEach(() => {
  mocks = MockFactory.newMocks(new Config(), false)
  actionRegistry = new ActionRegistry()
  myThreadActionProvider = new MyThreadActionProvider()
  actionRegistry.registerActionProvider("test", myThreadActionProvider)
})

describe("ActionRegistry.getAction()", () => {
  it("should return undefined for action with other prefix", () => {
    const actual = actionRegistry.getAction("someprefix.myAction")
    expect(actual).toBeUndefined()
  })
  it("should return undefined for action with matching prefix but unavailable function name", () => {
    const actual = actionRegistry.getAction("test.someUnavailableAction")
    expect(actual).toBeUndefined()
  })
  it("should return a function for an available action", () => {
    const actual = actionRegistry.getAction("test.myThreadFunction")
    expect(actual).toBe(myThreadActionProvider.myThreadFunction)
  })
})

describe("ActionRegistry.hasAction()", () => {
  it("should return false for action with other prefix", () => {
    const actual = actionRegistry.hasAction("someprefix.myAction")
    expect(actual).toBe(false)
  })
  it("should return false for action with matching prefix but unavailable function name", () => {
    const actual = actionRegistry.hasAction("test.someUnavailableAction")
    expect(actual).toBe(false)
  })
  it("should return true for an available action", () => {
    const actual = actionRegistry.hasAction("test.myThreadFunction")
    expect(actual).toBe(true)
  })
})

describe("ActionRegistry.invokeAction()", () => {
  it("should throw an error for an undefined action provider name", () => {
    expect(() => {
      actionRegistry.executeAction(
        mocks.processingContext,
        "someprefix.myAction",
        { someArg: "some value" },
      )
    }).toThrow()
  })
  it("should throw an error for an undefined action name of a registered provider", () => {
    expect(() => {
      actionRegistry.executeAction(
        mocks.processingContext,
        "test.someUnavailableAction",
        { someArg: "some value" },
      )
    }).toThrow()
  })
  it("should return a function for an available action", () => {
    const actual = actionRegistry.executeAction(
      mocks.threadContext,
      "test.myThreadFunction",
      { threadBoolArg: true, threadStringArg: "my string" },
    )
    expect(actual).toBeTruthy()
  })
})
