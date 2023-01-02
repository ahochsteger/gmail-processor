import { ProcessingContext } from "../context/ProcessingContext"
import { deprecated } from "../utils/Decorators"
import { ThreadActions } from "./ThreadActions"

export function dryRunAware<T extends ThreadActions, K extends keyof T, R=void>() {
  return (
    target: T,
    propertyKey: K,
    descriptor: PropertyDescriptor,
  ): R | void => {
    const originalMethod = descriptor.value
    descriptor.value = function(this: T, ...args: K[]): R | void {
      if (this.dryRun) {
        this.logger.info(`Skipped calling method '${String(propertyKey)}'`)
        return
      } else {
        this.logger.info(`Calling method '${String(propertyKey)}' ...`)
        return originalMethod.apply(this, args)
      }
    }
  }
}

export abstract class AbstractActions {
  public logger: Console
  public dryRun: boolean
  constructor(protected processingContext: ProcessingContext) {
    this.logger = processingContext.gasContext.logger ? processingContext.gasContext.logger : console
    this.dryRun = processingContext.config.settings.dryRun
  }

  @deprecated("Use @dryRunAware instead!")
  checkDryRun(message: string): boolean {
    if (this.dryRun) {
      this.logger.info(`Skipped (dryRun): ${message}'`)
      return true
    }
    this.logger.info(message)
    return false
  }
}
