import {
  AttachmentContext,
  MetaInfoType as MIT,
  MessageContext,
  MetaInfo,
  ProcessingContext,
  ProcessingError,
  ProcessingResult,
  ProcessingStatus,
  ThreadContext,
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
      const stringValue = PatternUtil.stringValue(ctx, keyName, m)
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
    const matchedKey = `${keyPrefix}.matched`
    ctx.log.debug(`... result for ${matchedKey}: ${matchesAll}`)
    m[matchedKey] = mi(
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
            result.executedActions.push(action)
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

  protected static matchTimestamp(
    matchTimestamp: string,
    compareDate: GoogleAppsScript.Base.Date,
    isNewer = true,
  ) {
    if (matchTimestamp) {
      const matchTime = new Date(matchTimestamp).getTime()
      const compareTime = compareDate.getTime()
      return isNewer ? matchTime < compareTime : matchTime >= compareTime
    }
    return true
  }

  protected static matchError(ctx: ProcessingContext, message: string): boolean {
    ctx.log.warn(`MATCH ERROR: ${message}`)
    return false
  }

  protected static noMatch(ctx: ProcessingContext, message: string): boolean {
    ctx.log.debug(`NO MATCH: ${message}`)
    return false
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

  protected static effectiveCSV(
    global: string | undefined,
    local: string,
  ): string {
    return [
      ...new Set(
        [...(global ?? "").split(","), ...(local ?? "").split(",")].map((v) =>
          v.trim(),
        ),
      ),
    ].join(",")
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

  protected static effectiveMaxNumber(
    global: number | undefined,
    local: number,
    unsetValue: number,
  ): number {
    global = global ?? unsetValue
    if (global === unsetValue) return local
    if (local === unsetValue) return global
    return Math.max(global, local)
  }

  protected static effectiveMinNumber(
    global: number | undefined,
    local: number,
    unsetValue: number,
  ): number {
    global = global ?? unsetValue
    if (global === unsetValue) return local
    if (local === unsetValue) return global
    return Math.min(global, local)
  }

  protected static effectiveNumber(
    global: number | undefined,
    local: number,
    unsetValue: number,
  ): number {
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

  protected static getConfigName(
    // TODO: Remove, is obsolete now.
    ctx: ThreadContext | MessageContext | AttachmentContext,
    namePrefix = "",
  ) {
    let threadName = ""
    let messageName = ""
    let attachmentName = ""
    if ((ctx as ThreadContext).thread) {
      const threadCtx = ctx as ThreadContext
      threadName =
        threadCtx.thread.config.name ??
        `${threadCtx.thread.config.name}-${threadCtx.thread.configIndex}`
    }
    if ((ctx as MessageContext).message) {
      const messageCtx = ctx as MessageContext
      messageName =
        messageCtx.message.config.name ??
        `-${messageCtx.message.config.name}-${messageCtx.message.configIndex}`
    }
    if ((ctx as AttachmentContext).message) {
      const attachmentCtx = ctx as AttachmentContext
      attachmentName =
        attachmentCtx.attachment.config.name ??
        `-${attachmentCtx.attachment.config.name}-${attachmentCtx.attachment.configIndex}`
    }
    return `${namePrefix}${threadName}${messageName}${attachmentName}`
  }
}
