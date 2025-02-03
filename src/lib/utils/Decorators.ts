import { ProcessingContext, RunMode } from "../Context"
import { ActionProvider } from "../actions/ActionRegistry"

function runModeAwareAction<T extends ProcessingContext>(
  _target: ActionProvider<T>,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  allowedRunModes: RunMode[],
) {
  const originalMethod = descriptor.value
  descriptor.value = function (this: ActionProvider<T>, ...args: unknown[]) {
    const ctx = args[0] as ProcessingContext
    const runMode = ctx.env.runMode
    const doCall = allowedRunModes.reduce(
      (acc, curr) => acc || curr === runMode,
      false,
    )
    if (doCall) {
      ctx.log.debug(`Calling method '${propertyKey}' ...`)
      return originalMethod.apply(this, args)
    } else {
      ctx.log.log(
        `Skipped calling method '${propertyKey}' (runMode:${runMode})`,
      )
      // TODO: Return skipped: true
    }
  }
  return descriptor
}

export function readingAction<TContext extends ProcessingContext>() {
  return function <TActionProvider extends ActionProvider<TContext>>(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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
