import "reflect-metadata"
import { ProcessingContext } from "../context/ProcessingContext"
import { AbstractActions } from "./AbstractActions"

export type ActionArgType = boolean | number | string
export type ActionArgsType = { [k: string]: ActionArgType }

export type ActionType = typeof AbstractActions & {
  new (...args: any[]): AbstractActions
}

export class ActionRegistry {
  constructor(
    protected context: ProcessingContext,
    protected logger: Console = console,
  ) {
    // TODO: This introduces a circular dependency!
    // const providerMap = new Map<string,AbstractActions>()
    // providerMap.set("thread", new ThreadActions(context, logger))
    // providerMap.set("message", new MessageActions(context, logger))
    // providerMap.set("attachment", new AttachmentActions(context, logger))
  }

  private static getMeta(key: string, defaultValue: any): any {
    return (
      Reflect.getMetadata(
        `gmail2gdrive:${key}`,
        ActionRegistry,
        `gmail2gdrive:${key}`,
      ) || defaultValue
    )
  }

  private static setMeta(key: string, value: any) {
    Reflect.defineMetadata(
      `gmail2gdrive:${key}`,
      value,
      ActionRegistry,
      `gmail2gdrive:${key}`,
    )
  }

  public static addProvider(
    providerName: string,
    constructor: (context: ProcessingContext, logger: Console) => ActionType,
  ) {
    const map = ActionRegistry.getProviderMap()
    map[providerName] = constructor
    ActionRegistry.setMeta("actionProviderMap", map)
  }

  public static addAction(
    actionName: string,
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const map = ActionRegistry.getActionMap()
    if (map[actionName] === undefined) {
      // TODO: Cleanup map contents (most entries were just for debugging)
      map[actionName] = {
        designType: Reflect.getMetadata("design:type", ActionRegistry),
        designParamTypes: Reflect.getMetadata(
          "design:paramtypes",
          ActionRegistry,
        ),
        designReturnType: Reflect.getMetadata(
          "design:returntype",
          ActionRegistry,
        ),
        target: target,
        propertyKey: propertyKey,
        descriptor: descriptor,
      }
      ActionRegistry.setMeta("actionMap", map)
    } else {
      throw new Error(`Duplicate actionName decorator '${actionName}'!`)
    }
  }

  public static getActionMap(): any {
    return ActionRegistry.getMeta("actionMap", {})
  }

  public static getProviderMap(): {
    [k: string]: (context: ProcessingContext, logger: Console) => ActionType
  } {
    return ActionRegistry.getMeta("actionProviderMap", {})
  }
}

export function action(value = ""): any {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ActionRegistry.addAction(
      value !== "" ? value : propertyKey,
      target,
      propertyKey,
      descriptor,
    )
  }
}

export function actionProvider(value = ""): any {
  return function (
    constructor: (context: ProcessingContext, logger: Console) => ActionType,
  ) {
    ActionRegistry.addProvider(value, constructor)
  }
}
