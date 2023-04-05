import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { Config } from "../config/Config"
import { MessageContext } from "../context/MessageContext"
import { ThreadContext } from "../context/ThreadContext"
import {
  ActionArgsType,
  ActionContextType,
  ActionFunction,
  ActionProvider,
  ActionRegistry,
} from "./ActionRegistry"

class MyActionProvider extends ActionProvider {
  public myThreadFunction(context: ActionContextType, args: ActionArgsType) {
    console.log(
      `Subject:${
        (context as ThreadContext).thread.getFirstMessageSubject
      }, threadBoolArg:${args.threadBoolArg}, threadStringArg:${
        args.threadStringArg
      }`,
    )
  }
  public myMessageFunction: ActionFunction<
    MessageContext,
    { msgBoolArg: boolean; msgStringArg: string }
  > = (context, args) => {
    console.log(`${context}, ${args}`)
  }
}

let mocks: Mocks
let myActionProvider: MyActionProvider
let actionRegistry: ActionRegistry

beforeEach(() => {
  mocks = MockFactory.newMocks(new Config(), false)
  actionRegistry = new ActionRegistry()
  myActionProvider = new MyActionProvider()
  actionRegistry.registerActionProvider("test", myActionProvider)
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
    expect(actual).toBe(myActionProvider.myThreadFunction)
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
      actionRegistry.invokeAction(
        "someprefix.myAction",
        mocks.processingContext,
        { someArg: "some value" },
      )
    }).toThrow()
  })
  it("should throw an error for an undefined action name of a registered provider", () => {
    expect(() => {
      actionRegistry.invokeAction(
        "test.someUnavailableAction",
        mocks.processingContext,
        { someArg: "some value" },
      )
    }).toThrow()
  })
  it("should return a function for an available action", () => {
    const actual = actionRegistry.invokeAction(
      "test.myThreadFunction",
      mocks.threadContext,
      { threadBoolArg: true, threadStringArg: "my string" },
    )
    expect(actual).toBeTruthy()
  })
})
