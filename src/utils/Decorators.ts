import { ProcessingContext, RunMode } from "../Context"
import {
  ActionArgsType,
  ActionProvider,
  ActionReturnType,
} from "../actions/ActionRegistry"

export function deprecated(message: string) {
  return function (_target: unknown, propertyKey: string) {
    console.warn(`${propertyKey} is deprecated: ${message}`)
  }
}

// TODO: Switch to TypeScript 5.0 decorator implementation using ClassMethodDecoratorContext
// - https://blog.logrocket.com/using-modern-decorators-typescript/
// - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#writing-well-typed-decorators

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

function callRunModeAwareActionNew<
  This,
  TContext extends ProcessingContext,
  TArgs extends ActionArgsType,
  TReturn extends ActionReturnType,
>(
  target: (this: This, ctx: TContext, args: TArgs) => TReturn,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ctx: TContext, args: TArgs) => TReturn
  >,
  callOnRunmodes: RunMode[],
) {
  const originalMethod = target
  function decoratedMethod(this: This, ctx: TContext, args: TArgs): TReturn {
    const runMode = ctx.env.runMode
    const doCall = callOnRunmodes.reduce(
      (acc, curr) => acc || curr === runMode,
      false,
    )
    if (doCall) {
      console.log(`Executing action '${String(context.name)}' ...`)
      return originalMethod.apply(this, [ctx, args])
    } else {
      console.log(
        `Skipped execution of action '${String(
          context.name,
        )}' (runMode:${runMode})`,
      )
      return { ok: true } as TReturn
    }
  }
  return decoratedMethod
}

export function writingActionNew<
  This,
  TContext extends ProcessingContext,
  TArgs extends ActionArgsType,
  TReturn extends ActionReturnType,
>(
  target: (this: This, ctx: TContext, args: TArgs) => TReturn,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ctx: TContext, args: TArgs) => TReturn
  >,
) {
  return callRunModeAwareActionNew(target, context, [
    RunMode.SAFE_MODE,
    RunMode.DANGEROUS,
  ])
}
