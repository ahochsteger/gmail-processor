import { Adapter } from "../adapter/BaseAdapter"

export function deprecated(message: string) {
  return function (_target: unknown, propertyKey: string) {
    console.warn(`${propertyKey} is deprecated: ${message}`)
  }
}

export function skipOnDryRun() {
  return function <T extends Adapter>(
    _target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value
    descriptor.value = function (this: T, ...args: unknown[]) {
      if (this.envContext.dryRun) {
        console.log(`Skipped calling method '${propertyKey}'`)
        return
      } else {
        console.log(`Calling method '${propertyKey}' ...`)
        return originalMethod.apply(this, args)
      }
    }
  }
}
