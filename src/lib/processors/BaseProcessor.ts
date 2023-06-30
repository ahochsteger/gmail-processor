import {
  MetaInfoType as MIT,
  MetaInfo,
  ProcessingContext,
  ProcessingError,
  ProcessingResult,
  ProcessingStatus,
  newMetaInfo as mi,
} from "../Context"
import { ActionArgsType } from "../actions/ActionRegistry"
import { ActionConfig, ProcessingStage } from "../config/ActionConfig"
import { PatternUtil } from "../utils/PatternUtil"

export abstract class BaseProcessor {
  /**
   * Extends the given dataMap with additional data resulting from specified regex matches to perform.
   * @param ctx Processing context
   * @param m Map with meta infos as key/value pairs
   * @param keyPrefix Key name prefix for the new map data (e.g. "message")
   * @param regexMap Map with attribute names and regex to do matches on (e.g. {"subject": "Message ([0-9]+)"})
   */
  public static buildRegExpSubustitutionMap(
    ctx: ProcessingContext,
    m: MetaInfo,
    keyPrefix: string,
    regexMap: Map<string, string>,
  ): MetaInfo {
    ctx.log.debug(`Testing regex matches for key prefix ${keyPrefix} ...`)
    let matchesAll = true
    regexMap.forEach((value, k) => {
      ctx.log.debug(`Testing regex match for ${k} ...`)
      const regex = new RegExp(value, "g")
      let result
      const keyName = `${keyPrefix}.${k}`
      let hasAtLeastOneMatch = false
      const stringValue = PatternUtil.stringValue(ctx, m, keyName)
      if ((result = regex.exec(stringValue)) !== null) {
        ctx.log.debug(`... matches`)
        hasAtLeastOneMatch = true
        for (let i = 1; i < result.length; i++) {
          m[`${keyName}.match.${i}`] = mi(
            MIT.STRING,
            result[i],
            'The matching regex group number as defined in the match config (e.g.: `"' +
              value +
              '"`).',
          )
        }
        if (result.groups) {
          Object.entries(result.groups).forEach(([group, groupValue]) => {
            m[`${keyName}.match.${group}`] = mi(
              MIT.STRING,
              groupValue,
              'The matching named regex group name as defined in the match config (e.g.: `"' +
                value +
                '"`).',
            )
          })
        }
      } else {
        ctx.log.debug(`... no match.`)
      }
      if (!hasAtLeastOneMatch) {
        matchesAll = false
      }
    })
    ctx.log.debug(`... result for key prefix ${keyPrefix}: ${matchesAll}`)
    m[`${keyPrefix}.matched`] = mi(
      MIT.BOOLEAN,
      matchesAll,
      "The overall matching result for all conditions in the match config.",
    )
    return m
  }

  protected static executeActions(
    ctx: ProcessingContext,
    processingStage: ProcessingStage,
    result: ProcessingResult,
    ...actionSets: ActionConfig[][]
  ): ProcessingResult {
    ;(actionSets || []).forEach((actions) => {
      ;(actions || [])
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

  protected static getRefDocs(
    type: "attachment" | "message" | "thread",
    method: string,
    description = "",
  ) {
    const typeTitle = type[0].toUpperCase() + type.substring(1)
    description += description !== "" ? " " : ""
    const title = `Gmail${typeTitle}.${method}()`
    return `${description}See [${title}](https://developers.google.com/apps-script/reference/gmail/gmail-${type}#${method}\\(\\)) reference docs.`
  }
}
