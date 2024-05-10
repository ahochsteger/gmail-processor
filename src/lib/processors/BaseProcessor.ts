import {
  AttachmentContext,
  AttachmentInfo,
  Context,
  ContextType,
  EnvContext,
  MetaInfoType as MIT,
  MessageContext,
  MessageInfo,
  MetaInfo,
  ProcessingContext,
  ProcessingError,
  ProcessingResult,
  ProcessingStatus,
  ThreadContext,
  ThreadInfo,
  newMetaInfo as mi,
  newMetaInfo,
} from "../Context"
import { ActionArgsType, ActionReturnType } from "../actions/ActionRegistry"
import { ActionConfig, ProcessingStage } from "../config/ActionConfig"
import { AttachmentMatchConfig } from "../config/AttachmentMatchConfig"
import { OrderableEntityConfig } from "../config/CommonConfig"
import { MessageMatchConfig } from "../config/MessageMatchConfig"
import { ThreadMatchConfig } from "../config/ThreadMatchConfig"
import { PatternUtil } from "../utils/PatternUtil"
import { RegexUtils } from "../utils/RegexUtils"

type TraceEntry = {
  configIndex: number
  index: number
  match: ThreadMatchConfig | MessageMatchConfig | AttachmentMatchConfig
  object: unknown
}

type ProcessingTrace = {
  action: ActionConfig
  traces: {
    thread?: TraceEntry
    message?: TraceEntry
    attachment?: TraceEntry
  }
  data: { [k: string]: unknown }
  error: {
    message?: string
    stack?: string
  }
}

export abstract class BaseProcessor {
  /**
   * Extends the given dataMap with additional data resulting from specified regex matches to perform.
   * @param ctx - Processing context
   * @param m - Map with meta infos as key/value pairs
   * @param keyPrefix - Key name prefix for the new map data (e.g. `message`)
   * @param regexMap - Map with attribute names and regex to do matches on (e.g. `{"subject": "Message ([0-9]+)"}`)
   * @returns Meta info map enhanced with regex substitution values
   */
  public static buildRegExpSubstitutionMap(
    ctx: ProcessingContext,
    m: MetaInfo,
    keyPrefix: string,
    regexMap: Map<string, string>,
    overallMatch: boolean = true,
  ): MetaInfo {
    ctx.log.debug(`Testing regex matches for key prefix ${keyPrefix} ...`)
    let matchesAll = true
    regexMap.forEach((value, k) => {
      ctx.log.debug(`Testing regex match for ${k} ...`)
      let result
      const keyName = `${keyPrefix}.${k}`
      let hasAtLeastOneMatch = false
      const stringValue = PatternUtil.stringValue(ctx, keyName, m)
      if ((result = RegexUtils.matchRegExp(value, stringValue)) !== null) {
        ctx.log.debug(`... matches`)
        hasAtLeastOneMatch = true
        for (let i = 1; i < result.length; i++) {
          m[`${keyName}.match.${i}`] = mi(
            MIT.STRING,
            result[i],
            `${keyName} Regex Match Group ${i}`,
            `The matching regex group number as defined in the match config (e.g.: \`${JSON.stringify(value)}\`).`,
          )
        }
        if (result.groups) {
          Object.entries(result.groups).forEach(([group, groupValue]) => {
            m[`${keyName}.match.${group}`] = mi(
              MIT.STRING,
              groupValue,
              `${keyName} Regex Match Group ${group}`,
              `The matching named regex group name as defined in the match config (e.g.: \`${JSON.stringify(value)}\`).`,
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
    if (overallMatch) {
      const matchedKey = `${keyPrefix}.matched`
      ctx.log.debug(`... result for ${matchedKey}: ${matchesAll}`)
      m[matchedKey] = mi(
        MIT.BOOLEAN,
        matchesAll,
        `${keyPrefix} Regex Matches`,
        "The overall matching result for all conditions in the match config.",
      )
    }
    return m
  }

  private static updateEnvContextMeta(
    ctx: EnvContext,
    addMeta: MetaInfo = {},
  ): MetaInfo {
    ctx.envMeta = { ...ctx.envMeta, ...addMeta }
    return ctx.envMeta
  }

  private static updateProcessingContextMeta(
    ctx: ProcessingContext,
    addMeta: MetaInfo = {},
  ): MetaInfo {
    ctx.procMeta = { ...ctx.procMeta, ...addMeta }
    return {
      ...ctx.envMeta,
      ...ctx.procMeta,
    }
  }

  private static updateThreadContextMeta(
    ctx: ThreadContext,
    addMeta: MetaInfo = {},
  ): MetaInfo {
    ctx.threadMeta = { ...ctx.threadMeta, ...addMeta }
    return {
      ...ctx.envMeta,
      ...ctx.procMeta,
      ...ctx.threadMeta,
    }
  }

  private static updateMessageContextMeta(
    ctx: MessageContext,
    addMeta: MetaInfo = {},
  ): MetaInfo {
    ctx.messageMeta = { ...ctx.messageMeta, ...addMeta }
    return {
      ...ctx.envMeta,
      ...ctx.procMeta,
      ...ctx.threadMeta,
      ...ctx.messageMeta,
    }
  }

  private static updateAttachmentContextMeta(
    ctx: AttachmentContext,
    addMeta: MetaInfo = {},
  ): MetaInfo {
    ctx.attachmentMeta = { ...ctx.attachmentMeta, ...addMeta }
    return {
      ...ctx.envMeta,
      ...ctx.procMeta,
      ...ctx.threadMeta,
      ...ctx.messageMeta,
      ...ctx.attachmentMeta,
    }
  }

  public static updateContextMeta(ctx: Context, addMeta: MetaInfo = {}) {
    switch (ctx.type) {
      case ContextType.ENV:
        ctx.meta = this.updateEnvContextMeta(ctx as EnvContext, addMeta)
        break
      case ContextType.PROCESSING:
        ctx.meta = this.updateProcessingContextMeta(
          ctx as ProcessingContext,
          addMeta,
        )
        break
      case ContextType.THREAD:
        ctx.meta = this.updateThreadContextMeta(ctx as ThreadContext, addMeta)
        break
      case ContextType.MESSAGE:
        ctx.meta = this.updateMessageContextMeta(ctx as MessageContext, addMeta)
        break
      case ContextType.ATTACHMENT:
        ctx.meta = this.updateAttachmentContextMeta(
          ctx as AttachmentContext,
          addMeta,
        )
        break
    }
    ctx.meta = {
      ...ctx.meta,
      "context.type": newMetaInfo(
        MIT.STRING,
        ctx.type,
        "Context Type",
        "The type of context.",
      ),
    }
  }

  protected static describeThread(thread: GoogleAppsScript.Gmail.GmailThread): {
    [k: string]: unknown
  } {
    return {
      id: thread.getId(),
      firstMessageSubject: thread.getFirstMessageSubject(),
      lastMessageDate: thread.getLastMessageDate(),
      messageCount: thread.getMessages().length,
      permalink: thread.getPermalink(),
    }
  }

  protected static describeMessage(
    message: GoogleAppsScript.Gmail.GmailMessage,
  ): { [k: string]: unknown } {
    return {
      id: message.getId(),
      subject: message.getSubject(),
      date: message.getDate(),
      from: message.getFrom(),
      to: message.getTo(),
      attachmentCount: message.getAttachments().length,
    }
  }

  protected static describeAttachment(
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
  ): { [k: string]: unknown } {
    return {
      hash: attachment.getHash(),
      name: attachment.getName(),
      isGoogleType: attachment.isGoogleType(),
      contentType: attachment.getContentType(),
    }
  }

  protected static getTraceEntry<
    T extends ThreadInfo | MessageInfo | AttachmentInfo,
  >(info: T, obj: unknown): TraceEntry {
    return {
      configIndex: info.configIndex,
      index: info.index,
      match: info.config.match,
      object: obj,
    }
  }

  protected static getSubstitutionData(ctx: ProcessingContext): {
    [k: string]: unknown
  } {
    const d: { [k: string]: unknown } = {}
    Object.keys(ctx.meta).forEach((key) => (d[key] = ctx.meta[key].value))
    return d
  }

  protected static getProcessingTrace(
    ctx: ProcessingContext,
    action: ActionConfig,
    actionResult: ActionReturnType,
  ): ProcessingTrace {
    const procTrace: ProcessingTrace = {
      traces: {},
      action: action,
      data: this.getSubstitutionData(ctx),
      error: {
        message: actionResult.error?.message,
        stack: actionResult.error?.stack,
      },
    }
    if ((ContextType.THREAD in ctx) as unknown) {
      const info = (ctx as ThreadContext).thread
      procTrace.traces.thread = this.getTraceEntry<ThreadInfo>(
        info,
        this.describeThread(info.object),
      )
    }
    if ((ContextType.MESSAGE in ctx) as unknown) {
      const info = (ctx as MessageContext).message
      procTrace.traces.message = this.getTraceEntry<MessageInfo>(
        info,
        this.describeMessage(info.object),
      )
    }
    if ((ContextType.ATTACHMENT in ctx) as unknown) {
      const info = (ctx as AttachmentContext).attachment
      procTrace.traces.attachment = this.getTraceEntry<AttachmentInfo>(
        info,
        this.describeAttachment(info.object),
      )
    }
    return procTrace
  }

  protected static handleActionResult(
    ctx: ProcessingContext,
    result: ProcessingResult,
    action: ActionConfig,
    actionResult: ActionReturnType,
  ): ProcessingResult {
    // result.executedActions.push({config:action, result:actionResult}) // TODO: Include action result here!
    result.executedActions.push(action)
    if (!actionResult.ok) {
      result.status = ProcessingStatus.ERROR
      result.failedAction = action
      result.error = actionResult.error
      const trace = this.getProcessingTrace(ctx, action, actionResult)
      throw new ProcessingError(
        `Error in action '${action.name}': ${String(
          actionResult.error,
        )}\nProcessing Trace:\n${JSON.stringify(trace, null, 2)}`,
        result,
      )
    }
    return result
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
          let actionResult: ActionReturnType
          try {
            actionResult = ctx.proc.actionRegistry.executeAction(
              ctx,
              action.name,
              action.args as unknown as ActionArgsType,
            )
            if (actionResult.actionMeta) {
              this.updateContextMeta(ctx, actionResult.actionMeta)
            }
          } catch (err) {
            actionResult = {
              ok: false,
              error: err instanceof Error ? err : new Error(String(err)),
            }
          }
          result = this.handleActionResult(ctx, result, action, actionResult)
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
    return this.effectiveValue(global, local, unsetValue)
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

  public static ordered<T, C extends string>(
    entities: T[],
    config: OrderableEntityConfig<C>,
    orderRulesFn: (a: T, b: T, config: OrderableEntityConfig<C>) => number,
  ): T[] {
    if (config.orderBy && config.orderDirection) {
      entities = entities.sort((a: T, b: T) => orderRulesFn(a, b, config))
    }
    return entities
  }
}
