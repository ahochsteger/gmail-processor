/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetaInfo, ProcessingContext } from "../Context"
import { BaseProcessor } from "../processors/BaseProcessor"

export type JsonPrimitive = number | string | boolean | null
export type JsonObject = { [key in string]?: JsonValue }
export type JsonArray = Array<JsonValue>
export type JsonValue = JsonObject | JsonArray | JsonPrimitive
export type ActionArgsType = Record<string, JsonValue>
export type ActionReturnType = {
  ok?: boolean
  error?: Error
  actionMeta?: MetaInfo
  [k: string]: unknown
}

// Define a type for the function that takes context and args as arguments
export type SyncActionFunction<
  TContext extends ProcessingContext = ProcessingContext,
  TArgs extends ActionArgsType = ActionArgsType,
  TReturn extends ActionReturnType = ActionReturnType,
> = (ctx: TContext, args: TArgs) => TReturn | void
export type AsyncActionFunction<
  TContext extends ProcessingContext = ProcessingContext,
  TArgs extends ActionArgsType = ActionArgsType,
  TReturn extends ActionReturnType = ActionReturnType,
> = (ctx: TContext, args: TArgs) => Promise<TReturn> | void
export type ActionFunction<
  TContext extends ProcessingContext = ProcessingContext,
  TArgs extends ActionArgsType = ActionArgsType,
  TReturn extends ActionReturnType = ActionReturnType,
> =
  | SyncActionFunction<TContext, TArgs, TReturn>
  | AsyncActionFunction<TContext, TArgs, TReturn>

export interface ActionProvider<
  TContext extends ProcessingContext = ProcessingContext,
> {
  [key: string]: ActionFunction<TContext>
}

export type ActionRegistration = {
  name: string
  action: ActionFunction | AsyncActionFunction
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
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            provider[actionName as keyof typeof provider] &&
            actionName !== "constructor",
        ),
      )
      .sort()
  }

  public registerAction(
    fullActionName: string,
    action: ActionFunction<ProcessingContext, ActionArgsType, ActionReturnType>,
  ) {
    this.actions.set(fullActionName, action)
  }

  public registerActionProvider(
    providerName: string,
    provider: ActionProvider,
  ) {
    if (this.actionProviders.has(providerName))
      throw new Error(
        `An action provider with name ${providerName} is already registered!`,
      )
    this.actionProviders.set(providerName, provider)
    const actionNames = this.getActionNamesFromProvider(provider)
    actionNames.forEach((actionName) => {
      const fullActionName = `${providerName}.${String(actionName)}`
      const action =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        provider[actionName as keyof typeof provider] ||
        Object.getPrototypeOf(provider).constructor[
          actionName as keyof typeof provider
        ]
      this.registerAction(fullActionName, action)
    })
  }

  public registerCustomActions(actions: ActionRegistration[]) {
    const nameRegex = "^[a-zA-Z0-9]+$"
    const regex = new RegExp(nameRegex)
    actions.forEach((customAction) => {
      if (regex.test(customAction.name)) {
        this.registerAction(`custom.${customAction.name}`, customAction.action)
      } else {
        throw new Error(
          `Custom action name does not match regex '${nameRegex}': ${customAction.name}`,
        )
      }
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
        `Executing action '${name}' with args: ${context.log.redactJsonSecrets(JSON.stringify(args))}`,
      )
      const fnResult = fn(context, args)
      if (fnResult instanceof Promise) {
        result = {
          ok: true,
        }
        const promise = fnResult
          .then((actualResult) => {
            Object.assign(result, actualResult)
            if (actualResult.actionMeta) {
              BaseProcessor.updateContextMeta(context, actualResult.actionMeta)
            }
            return actualResult
          })
          .catch((e) => {
            result.ok = false
            result.error = e
            throw e
          })
        context.proc.actionPromises.push(promise)
      } else {
        result = {
          ok: true,
          ...fnResult,
        }
      }
    } catch (e: any) {
      result = {
        ok: false,
        error: e,
      }
      context.log.error(`Action ${name} caused an error: ${e}`)
      if (typeof e === "object" && e.stack !== undefined) {
        context.log.error(`Stacktrace: ${e.stack}`)
      }
    }
    context.log.info(`Action result: ${JSON.stringify(result)}`)
    return result
  }
}
