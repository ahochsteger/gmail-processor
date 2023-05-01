import { RunMode } from "../Context"
import { Adapter } from "../adapter/BaseAdapter"

export function deprecated(message: string) {
  return function (_target: unknown, propertyKey: string) {
    console.warn(`${propertyKey} is deprecated: ${message}`)
  }
}

function callRunModeAware<T extends Adapter>(
  _target: T,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  callOnRunmodes: RunMode[],
) {
  const originalMethod = descriptor.value
  descriptor.value = function (this: T, ...args: unknown[]) {
    const runMode = this.envContext.env.runMode
    const doCall = callOnRunmodes.reduce(
      (acc, curr) => acc || curr === runMode,
      false,
    )
    if (doCall) {
      console.log(`Calling method '${propertyKey}' ...`)
      return originalMethod.apply(this, args)
    } else {
      console.log(
        `Skipped calling method '${propertyKey}' (runMode:${runMode})`,
      )
      return
    }
  }
}

export function reading() {
  return function <T extends Adapter>(
    _target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    return callRunModeAware(_target, propertyKey, descriptor, [
      RunMode.DRY_RUN,
      RunMode.SAFE_MODE,
      RunMode.DANGEROUS,
    ])
  }
}

export function writing() {
  return function <T extends Adapter>(
    _target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    return callRunModeAware(_target, propertyKey, descriptor, [
      RunMode.SAFE_MODE,
      RunMode.DANGEROUS,
    ])
  }
}

export function destructive() {
  return function <T extends Adapter>(
    _target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    return callRunModeAware(_target, propertyKey, descriptor, [
      RunMode.DANGEROUS,
    ])
  }
}
