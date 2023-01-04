import { Adapter } from "../adapter/BaseAdapter"

export function deprecated(message: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(`${propertyKey} is deprecated: ${message}`) // TODO: Change to warn!
  }
}

export function skipOnDryRun() {
  return function<T extends Adapter>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(this: T, ...args: any[]) {
      if (this.dryRun) {
        this.logger.info(`Skipped calling method '${propertyKey}'`);
        return;
      } else {
        this.logger.info(`Calling method '${propertyKey}' ...`);
        return originalMethod.apply(this, args);
      }
    }
  }
}
