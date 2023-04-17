import { ProcessingContext } from "../Context"

export type JsonPrimitive = number | string | boolean | null
export type JsonObject = { [key in string]?: JsonValue }
export type JsonArray = Array<JsonValue>
export type JsonValue = JsonObject | JsonArray | JsonPrimitive
export type ActionArgsType = Record<string, JsonValue>
export type ActionReturnType = {
  ok?: boolean
  error?: unknown
  [k: string]: unknown
}

// Define a type for the function that takes context and args as arguments
export type ActionFunction<
  TContext extends ProcessingContext = ProcessingContext,
  TArgs extends ActionArgsType = ActionArgsType,
  TReturn extends ActionReturnType = ActionReturnType,
> = (context: TContext, args: TArgs) => TReturn | void

export interface ActionProvider<
  TContext extends ProcessingContext = ProcessingContext,
> {
  [key: string]: ActionFunction<TContext>
}

export function typedArgs<T>(args: ActionArgsType): T {
  // TODO: Add runtime type checking and throw Error on invalid types.
  return args as T
}

export class ActionRegistry {
  private actionProviders = new Map<string, ActionProvider>()
  private actions = new Map<string, ActionFunction>()

  private getActionNamesFromProvider(provider: ActionProvider): string[] {
    return Object.getOwnPropertyNames(provider.constructor.prototype)
  }

  public registerActionProvider(
    providerName: string,
    provider: ActionProvider,
  ) {
    if (this.actionProviders.get(providerName))
      throw new Error(
        `An action provider with name ${providerName} is already registered!`,
      )
    this.actionProviders.set(providerName, provider)
    this.getActionNamesFromProvider(provider.constructor.prototype).forEach(
      (actionName) => {
        const fullActionName = `${providerName}.${String(actionName)}`
        const action = provider[actionName as keyof typeof provider]
        if (action && actionName !== "constructor") {
          this.actions.set(fullActionName, action)
        }
      },
    )
  }

  public getActionProviders(): Map<string, ActionProvider> {
    return this.actionProviders
  }

  public getActions(): Map<string, ActionFunction> {
    return this.actions
  }

  public getAction(fullActionName: string): ActionFunction | undefined {
    const fn = this.actions.get(fullActionName)
    if (typeof fn !== "function") return undefined
    return fn
  }

  public hasAction(fullActionName: string): boolean {
    return this.getAction(fullActionName) !== undefined
  }

  private unknownActionError(fullActionName: string) {
    return new Error(
      `Action provider '${typeof this}' does not provide action '${fullActionName}'!`,
    )
  }

  public executeAction(
    context: ProcessingContext,
    name: string,
    args: ActionArgsType,
  ): ActionReturnType {
    const fn = this.getAction(name)
    if (!fn) throw this.unknownActionError(name)
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
