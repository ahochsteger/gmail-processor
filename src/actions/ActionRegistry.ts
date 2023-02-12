import "reflect-metadata"
import { ProcessingContext } from "../context/ProcessingContext"
import { AbstractActions } from "./AbstractActions"

export type ActionArgType = boolean | number | string
export type ActionArgsType = Record<string, ActionArgType>

export type ActionType = typeof AbstractActions & {
  new (...args: unknown[]): AbstractActions
}

export class ActionRegistry {
  private static getMeta<T>(key: string, defaultValue: T): T {
    return (Reflect.getMetadata(
      `gmail2gdrive:${key}`,
      ActionRegistry,
      `gmail2gdrive:${key}`,
    ) || defaultValue) as T
  }

  private static setMeta(key: string, value: unknown) {
    Reflect.defineMetadata(
      `gmail2gdrive:${key}`,
      value,
      ActionRegistry,
      `gmail2gdrive:${key}`,
    )
  }

  public static addProvider(
    providerName: string,
    constructor: (context: ProcessingContext) => ActionType,
  ) {
    const map = ActionRegistry.getProviderMap()
    map[providerName] = constructor
    ActionRegistry.setMeta("actionProviderMap", map)
  }

  public static addAction(
    actionName: string,
    target: unknown,
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

  public static getActionMap(): Record<string, unknown> {
    return ActionRegistry.getMeta("actionMap", {})
  }

  public static getProviderMap(): Record<
    string,
    (context: ProcessingContext) => ActionType
  > {
    return ActionRegistry.getMeta("actionProviderMap", {})
  }
}

export function action(value = "") {
  return function (
    target: unknown,
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
