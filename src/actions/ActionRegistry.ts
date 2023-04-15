import {
  AttachmentContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../Context"

export type ActionArgType = boolean | number | string
export type ActionArgsType = Record<string, ActionArgType | never>
export type ActionContextType =
  | ProcessingContext
  | ThreadContext
  | MessageContext
  | AttachmentContext
export type ActionReturnType = {
  ok?: boolean
  error?: unknown
  [k: string]: unknown
}

// Define a type for the function that takes context and args as arguments
export type ActionFunction<
  TContext extends ActionContextType = ProcessingContext,
  TArgs extends ActionArgsType = ActionArgsType,
  TReturn extends ActionReturnType = ActionReturnType,
> = (context: TContext, args: TArgs) => TReturn | void

export class ActionProvider {
  // TODO: Make generic type to define default context type to simplify typing of each action function
  // [key: string | symbol]: ActionFunction<ActionContextType, ActionArgsType>
}

export class ActionRegistry {
  private actionProviders = new Map<string, ActionProvider>()
  private actions = new Map<string, ActionFunction>()

  getActionNamesFromProvider(provider: ActionProvider): string[] {
    return Object.getOwnPropertyNames(provider.constructor.prototype)
  }

  registerActionProvider(providerName: string, provider: ActionProvider) {
    if (this.actionProviders.get(providerName))
      throw new Error(
        `An action provider with name ${providerName} is already registered!`,
      )
    this.actionProviders.set(providerName, provider)
    Object.getOwnPropertyNames(provider.constructor.prototype).forEach(
      (actionName) => {
        const fullActionName = `${providerName}.${String(actionName)}`
        const action = provider[actionName as keyof typeof provider]
        if (action && actionName !== "constructor") {
          this.actions.set(fullActionName, action)
        }
      },
    )
  }

  getActionProviders(): Map<string, ActionProvider> {
    return this.actionProviders
  }

  getActions(): Map<string, ActionFunction> {
    return this.actions
  }

  getAction(fullActionName: string): ActionFunction | undefined {
    const fn = this.actions.get(fullActionName)
    if (typeof fn !== "function") return undefined
    return fn
  }

  hasAction(fullActionName: string): boolean {
    return this.getAction(fullActionName) !== undefined
  }

  unknownActionError(fullActionName: string) {
    return new Error(
      `Action provider '${typeof this}' does not provide action '${fullActionName}'!`,
    )
  }

  executeAction(
    context: ActionContextType,
    fullActionName: string,
    args: ActionArgsType,
  ): ActionReturnType {
    const fn = this.getAction(fullActionName)
    if (!fn) throw this.unknownActionError(fullActionName)
    let result: ActionReturnType = { ok: true }
    try {
      result = {
        ...fn(context, args),
      } as ActionReturnType
    } catch (e) {
      result = {
        ok: false,
        error: e,
      }
    }
    return result
  }
}
