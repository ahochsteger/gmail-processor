import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import {
  AttachmentContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../Context"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionRegistry,
  typedArgs,
} from "./ActionRegistry"

class TestProcessingActionProvider implements ActionProvider {
  [key: string]: ActionFunction
  public staticProcessingMethodNoArgs(
    ctx: ProcessingContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args: ActionArgsType = {},
  ) {
    ctx.log.info(`runMode:${ctx.env.runMode}`)
    return { ok: true }
  }
}

class TestThreadActionProvider implements ActionProvider {
  [key: string]: ActionFunction
  public instanceThreadMethodWithArgs<
    TArgs extends {
      threadBoolArg: boolean
      threadStringArg: string
    },
  >(ctx: ProcessingContext, args: ActionArgsType) {
    // NOTE: Instance methods currently require ActionArgsType + typedArgs to work!
    const a = typedArgs<TArgs>(args)
    ctx.log.info(
      `Subject:${(
        ctx as ThreadContext
      ).thread.object.getFirstMessageSubject()}, threadBoolArg:${
        a.threadBoolArg
      }, threadStringArg:${a.threadStringArg}`,
    )
    return { ok: true }
  }
  public static staticThreadMethodWithArgs<
    TArgs extends { num: number; str: string },
  >(ctx: ProcessingContext, args: TArgs) {
    ctx.log.info(
      `Subject:${(ctx as MessageContext).message.object.getSubject()}, num:${
        args.num
      }, str:${args.str}`,
    )
    return { ok: true }
  }
  public errorThrowingMethod(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ctx: ProcessingContext,
  ) {
    throw new Error("Error from staticErrorThrowingMethod")
  }
}

class TestMessageActionProvider implements ActionProvider {
  [key: string]: ActionFunction
  public static staticMessageMethodWithArgs<
    TArgs extends { num: number; str: string },
  >(ctx: ProcessingContext, args: TArgs) {
    ctx.log.info(
      `Name:${(ctx as AttachmentContext).attachment.object.getName()}, num:${
        args.num
      }, str:${args.str}`,
    )
    return { ok: true }
  }
}

class TestAttachmentActionProvider implements ActionProvider {
  [key: string]: ActionFunction
  public instanceAttachmentMethodWithArgs<
    TArgs extends { num: number; str: string },
  >(ctx: ProcessingContext, args: ActionArgsType) {
    // NOTE: Instance methods currently require ActionArgsType + typedArgs to work!
    const a = typedArgs<TArgs>(args)
    ctx.log.info(
      `Subject:${(ctx as AttachmentContext).message.object.getSubject}, num:${
        a.num
      }, str:${a.str}`,
    )
    return { ok: true }
  }
}

let mocks: Mocks
let myThreadActionProvider: TestThreadActionProvider
let actionRegistry: ActionRegistry

beforeEach(() => {
  mocks = MockFactory.newMocks()
  actionRegistry = new ActionRegistry()
  myThreadActionProvider = new TestThreadActionProvider()
  actionRegistry.registerActionProvider(
    "testProcessing",
    new TestProcessingActionProvider(),
  )
  actionRegistry.registerActionProvider("testThread", myThreadActionProvider)
  actionRegistry.registerActionProvider(
    "testMessage",
    new TestMessageActionProvider(),
  )
  actionRegistry.registerActionProvider(
    "testAttachment",
    new TestAttachmentActionProvider(),
  )
})

describe("ActionRegistry.registerActionProvider()", () => {
  it("should register thread action provider with instance methods", () => {
    const actionNames = Array.from(actionRegistry.getActions().keys()).filter(
      (v) => v.startsWith("testThread.instance"),
    )
    expect(actionNames).toEqual(["testThread.instanceThreadMethodWithArgs"])
  })
  it("should register thread action provider with static methods", () => {
    const actionNames = Array.from(actionRegistry.getActions().keys()).filter(
      (v) => v.startsWith("testThread.static"),
    )
    expect(actionNames).toEqual(["testThread.staticThreadMethodWithArgs"])
  })
  it("should register action provider with thread context", () => {
    const actionNames = Array.from(actionRegistry.getActions().keys()).filter(
      (v) => v.startsWith("testThread."),
    )
    expect(actionNames).toEqual([
      "testThread.errorThrowingMethod",
      "testThread.instanceThreadMethodWithArgs",
      "testThread.staticThreadMethodWithArgs",
    ])
  })
  it("should register action provider with message context", () => {
    const actionNames = Array.from(actionRegistry.getActions().keys()).filter(
      (v) => v.startsWith("testMessage."),
    )
    expect(actionNames).toEqual(["testMessage.staticMessageMethodWithArgs"])
  })
  it("should register action provider with attachment context", () => {
    const actionNames = Array.from(actionRegistry.getActions().keys()).filter(
      (v) => v.startsWith("testAttachment."),
    )
    expect(actionNames).toEqual([
      "testAttachment.instanceAttachmentMethodWithArgs",
    ])
  })
})

describe("ActionRegistry.getActions()", () => {
  it("should provide a list of all actions", () => {
    const actionNames = Array.from(actionRegistry.getActions().keys()).sort()
    expect(actionNames).toEqual([
      "testAttachment.instanceAttachmentMethodWithArgs",
      "testMessage.staticMessageMethodWithArgs",
      "testProcessing.staticProcessingMethodNoArgs",
      "testThread.errorThrowingMethod",
      "testThread.instanceThreadMethodWithArgs",
      "testThread.staticThreadMethodWithArgs",
    ])
  })
})

describe("ActionRegistry.getAction()", () => {
  it("should return undefined for action with other prefix", () => {
    const actual = actionRegistry.getAction("somePrefix.myAction")
    expect(actual).toBeUndefined()
  })
  it("should return undefined for action with matching prefix but unavailable function name", () => {
    const actual = actionRegistry.getAction("testThread.someUnavailableAction")
    expect(actual).toBeUndefined()
  })
  it("should return a function for a registered action", () => {
    const actual = actionRegistry.getAction(
      "testThread.instanceThreadMethodWithArgs",
    )
    expect(actual).toBe(myThreadActionProvider.instanceThreadMethodWithArgs)
  })
})

describe("ActionRegistry.hasAction()", () => {
  it("should return false for action with other prefix", () => {
    const actual = actionRegistry.hasAction("somePrefix.myAction")
    expect(actual).toBe(false)
  })
  it("should return false for action with matching prefix but unavailable function name", () => {
    const actual = actionRegistry.hasAction("testThread.someUnavailableAction")
    expect(actual).toBe(false)
  })
  it("should return true for a registered action", () => {
    const actual = actionRegistry.hasAction(
      "testThread.instanceThreadMethodWithArgs",
    )
    expect(actual).toBe(true)
  })
})

describe("ActionRegistry.invokeAction()", () => {
  it("should throw an error for an undefined action provider name", () => {
    expect(() => {
      actionRegistry.executeAction(
        mocks.processingContext,
        "somePrefix.myAction",
        { someArg: "some value" },
      )
    }).toThrow()
  })
  it("should throw an error for an undefined action name of a registered provider", () => {
    expect(() => {
      actionRegistry.executeAction(
        mocks.processingContext,
        "testThread.someUnavailableAction",
        { someArg: "some value" },
      )
    }).toThrow()
  })
  it("should return an instance function for an available action", () => {
    const actual = actionRegistry.executeAction(
      mocks.threadContext,
      "testThread.instanceThreadMethodWithArgs",
      { threadBoolArg: true, threadStringArg: "my string" },
    )
    expect(actual).toBeTruthy()
  })
  it("should return a static function for an available action", () => {
    const actual = actionRegistry.executeAction(
      mocks.threadContext,
      "testThread.staticThreadMethodWithArgs",
      { threadBoolArg: true, threadStringArg: "my string" },
    )
    expect(actual).toBeTruthy()
  })
  it("should handle an action that throws an error", () => {
    const actual = actionRegistry.executeAction(
      mocks.threadContext,
      "testThread.errorThrowingMethod",
      {},
    )
    expect(actual.ok).toBeFalsy()
    expect(actual.error?.message).toEqual(
      "Error from staticErrorThrowingMethod",
    )
  })
})

describe("ActionProvider", () => {
  it("should execute an action with correct arguments", () => {
    const result = myThreadActionProvider.instanceThreadMethodWithArgs(
      mocks.threadContext,
      { threadBoolArg: true, threadStringArg: "myString" },
    )
    expect(result.ok).toBeTruthy()
  })
})
