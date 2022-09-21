import "reflect-metadata"

export class ActionRegistry {
  constructor() {
    this.setMeta("actionNames", [])
    this.setMeta("actionContexts", [])
    this.setMeta("actionMap", {})
  }

  private getMeta(key: string, defaultValue: any): any {
    return Reflect.getMetadata(`gmail2gdrive:${key}`, this, `gmail2gdrive:${key}`) || defaultValue
  } 

  private setMeta(key: string, value: any) {
    Reflect.defineMetadata(`gmail2gdrive:${key}`, value, ActionRegistry.prototype, `gmail2gdrive:${key}`);
  }

  public addAction(actionName: string, target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const map = this.getActionMap()
    if (map[actionName]===undefined) {
      // TODO: Cleanup map contents (most entries were just for debugging)
      map[actionName] = {
        designType: Reflect.getMetadata("design:type",this),
        designParamTypes: Reflect.getMetadata("design:paramtypes",this),
        designReturnType: Reflect.getMetadata("design:returntype",this),
        target: target,
        propertyKey: propertyKey,
        descriptor: descriptor,
      }
      this.setMeta("actionMap", map);
    } else {
      throw new Error(`Duplicate actionName decorator '${actionName}'!`)
    }
  }

  public getActionMap(): any {
    return this.getMeta("actionMap", {})
  }
}

export const actionRegistry = new ActionRegistry()

export function action(value = ""): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    actionRegistry.addAction(value!=="" ? value : propertyKey, target, propertyKey, descriptor)
  }
}
