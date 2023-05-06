import { ProcessingContext, RunMode } from "../Context"
import { ActionProvider } from "../actions/ActionRegistry"

export function deprecated(message: string) {
  return function (_target: unknown, propertyKey: string) {
    console.warn(`${propertyKey} is deprecated: ${message}`)
  }
}

function runModeAwareAction<T extends ProcessingContext>(
  _target: ActionProvider<T>,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  allowedRunModes: RunMode[],
) {
  const originalMethod = descriptor.value
  descriptor.value = function (this: ActionProvider<T>, ...args: unknown[]) {
    let runMode: RunMode | undefined
    if (args.length >= 1 && (args[0] as ProcessingContext)) {
      runMode = (args[0] as ProcessingContext).env.runMode
    } else {
      throw new Error(`Unsupported method decoration: ${propertyKey}`)
    }
    const doCall = allowedRunModes.reduce(
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
  return descriptor
}

export function readingAction<TContext extends ProcessingContext>() {
  return function <TActionProvider extends ActionProvider<TContext>>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Function, // change the type of target parameter to Function
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    return runModeAwareAction<TContext>(
      target.prototype as TActionProvider, // cast target.prototype to T2
      propertyKey,
      descriptor,
      [RunMode.DRY_RUN, RunMode.SAFE_MODE, RunMode.DANGEROUS],
    )
  }
}

export function writingAction<TContext extends ProcessingContext>() {
  return function <TActionProvider extends ActionProvider<TContext>>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Function, // change the type of target parameter to Function
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    return runModeAwareAction<TContext>(
      target.prototype as TActionProvider, // cast target.prototype to T2
      propertyKey,
      descriptor,
      [RunMode.SAFE_MODE, RunMode.DANGEROUS],
    )
  }
}

export function destructiveAction<TContext extends ProcessingContext>() {
  return function <TActionProvider extends ActionProvider<TContext>>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Function, // change the type of target parameter to Function
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    return runModeAwareAction<TContext>(
      target.prototype as TActionProvider, // cast target.prototype to T2
      propertyKey,
      descriptor,
      [RunMode.DANGEROUS],
    )
  }
}
