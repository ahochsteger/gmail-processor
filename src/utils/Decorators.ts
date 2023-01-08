import { Adapter } from "../adapter/BaseAdapter"

export function deprecated(message: string) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.warn(`${target && descriptor ? propertyKey : propertyKey} is deprecated: ${message}`)
  }
}

export function skipOnDryRun() {
  return function <T extends Adapter>(
    target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value
    descriptor.value = function (this: T, ...args: unknown[]) {
      if (this.processingContext.dryRun) {
        this.logger.info(`Skipped calling method '${propertyKey}'`)
        return
      } else {
        this.logger.info(`Calling method '${propertyKey}' ...`)
        return originalMethod.apply(this, args)
      }
    }
  }
}
