/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetaInfo, ProcessingContext } from "../Context"

type JsonPrimitive = number | string | boolean | null
type JsonObject = { [key in string]?: JsonValue }
type JsonArray = Array<JsonValue>
type JsonValue = JsonObject | JsonArray | JsonPrimitive
export type ActionArgsType = Record<string, JsonValue>
export type ActionReturnType = {
  ok?: boolean
  error?: Error
  actionMeta?: MetaInfo
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
  // Maybe possible with ts-runtime-checks or io-ts, but initial tests failed to reliably detect non-conformant args.
  return args as T
}

export class ActionRegistry {
  private actionProviders = new Map<string, ActionProvider>()
  private actions = new Map<string, ActionFunction>()

  private getActionNamesFromProvider(provider: ActionProvider): string[] {
    return Object.getOwnPropertyNames(provider.constructor)
      .filter(
        (propertyName) =>
          typeof (provider.constructor as any)[propertyName] === "function",
      )
      .concat(
        Object.getOwnPropertyNames(provider.constructor.prototype).filter(
          (actionName: string) =>
            provider[actionName as keyof typeof provider] &&
            actionName !== "constructor",
        ),
      )
      .sort()
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
    const actionNames = this.getActionNamesFromProvider(provider) || []
    actionNames.forEach((actionName) => {
      const fullActionName = `${providerName}.${String(actionName)}`
      const action =
        provider[actionName as keyof typeof provider] ||
        Object.getPrototypeOf(provider).constructor[
          actionName as keyof typeof provider
        ]
      this.actions.set(fullActionName, action)
    })
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
    let result: ActionReturnType
    try {
      context.log.info(
        `Executing action '${name}' with args: ${JSON.stringify(args)}`,
      )
      result = {
        ok: true,
        ...fn(context, args),
      } as ActionReturnType
    } catch (e: any) {
      result = {
        ok: false,
        error: e,
      }
      context.log.error(`Action ${name} caused an error: ${JSON.stringify(e)}`)
    }
    context.log.info(`Action result: ${JSON.stringify(result)}`)
    return result
  }
}
