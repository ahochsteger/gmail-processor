import {
  ProcessingContext,
  ProcessingError,
  ProcessingResult,
  ProcessingStatus,
} from "../Context"
import { ActionArgsType } from "../actions/ActionRegistry"
import { ActionConfig, ProcessingStage } from "../config/ActionConfig"

export abstract class BaseProcessor {
  protected static executeActions(
    ctx: ProcessingContext,
    processingStage: ProcessingStage,
    result: ProcessingResult,
    ...actionSets: ActionConfig[][]
  ): ProcessingResult {
    actionSets.forEach((actions) => {
      actions
        .filter((action) => action.processingStage === processingStage)
        .forEach((action) => {
          try {
            ctx.proc.actionRegistry.executeAction(
              ctx,
              action.name,
              action.args as ActionArgsType,
            )
            result.performedActions.push(action)
          } catch (err) {
            result.failedAction = action
            result.status = ProcessingStatus.ERROR
            if (err instanceof Error) {
              result.error = err
            } else {
              result.error = new Error(String(err))
            }
            throw new ProcessingError(
              `Error "${result.error.message}" during execution of action ${
                action.name
              } using args ${JSON.stringify(action.args)}!`,
              result,
            )
          }
        })
    })
    return result
  }

  protected static isSet(
    value: boolean | number | string | undefined,
    unsetValue?: unknown,
  ) {
    return value !== undefined && value != null && value != unsetValue
  }
  protected static getStr(value: string, defaultVal = "") {
    return this.isSet(value) ? value : defaultVal
  }

  protected static effectiveValue<T extends boolean | string | number>(
    global: T | undefined,
    local: T,
    unsetValue: T,
  ): T {
    return this.isSet(global, unsetValue) && !this.isSet(local, unsetValue)
      ? (global as T)
      : this.isSet(local, unsetValue)
      ? local
      : unsetValue
  }

  protected static effectiveNumber(
    global: number | undefined,
    local: number,
    unsetValue: number,
  ): typeof unsetValue {
    return this.effectiveValue(global, local, unsetValue) as number
  }
}
