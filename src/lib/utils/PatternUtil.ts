import moment from "moment-timezone"
import {
  AttachmentContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../Context"
import { AttachmentMatchConfig } from "../config/AttachmentMatchConfig"
import { MessageMatchConfig } from "../config/MessageMatchConfig"

export class SubstMap extends Map<string, unknown> {}

export class PatternUtil {
  public static escapeRegExp(s: string) {
    // tslint:disable-next-line: max-line-length
    // See https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
  }

  public static substituteStrings(pattern: string, data: SubstMap) {
    let s = pattern
    data.forEach((value: unknown, key: string) => {
      const rex = new RegExp("\\$\\{" + this.escapeRegExp(key) + "\\}")
      s = s.replace(rex, value as string)
    })
    return s
  }

  public static formatDate(date: Date, format: string, timezone = "UTC") {
    // See https://stackoverflow.com/questions/43525786/momentjs-convert-from-utc-to-desired-timezone-not-just-local
    const v = moment(date).tz(timezone).format(format)
    return v
  }

  public static substituteDates(
    pattern: string,
    data: SubstMap,
    timezone = "UTC",
    formatType = "dateformat",
  ) {
    let s = pattern
    const regex = new RegExp("\\$\\{([^:{]+):" + formatType + ":([^}]+)\\}")
    let result
    while ((result = regex.exec(s)) !== null) {
      const date = data.get(result[1]) as Date
      const format =
        formatType === "olddateformat"
          ? PatternUtil.convertDateFormat(result[2])
          : result[2]
      const v = this.formatDate(date, format, timezone)
      s = s.replace(new RegExp(this.escapeRegExp(result[0])), v)
    }
    return s
  }

  public static convertDateFormat(format: string): string {
    // old format (from Utilities): yyyy-MM-dd_HH-mm-ss
    // See https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
    // new format (from moment): YYYY-MM-DD_HH-mm-ss
    // See https://momentjs.com/docs/#/displaying/
    const convertedFormat = format.replace(/d/g, "D").replace(/y/g, "Y")
    return convertedFormat
  }

  public static substitutePatternFromMap(
    pattern: string,
    data: SubstMap,
    timezone = "UTC",
  ) {
    let s = pattern
    s = this.substituteDates(s, data, timezone, "olddateformat")
    s = this.substituteDates(s, data, timezone, "dateformat")
    s = this.substituteStrings(s, data)
    return s
  }

  /**
   * Extends the given dataMap with additional data resulting from specified regex matches to perform.
   * @param dataMap Map with data as key/value pairs (e.g. {"message.subject": "Message 01", ...})
   * @param keyPrefix Key name prefix for the new map data (e.g. "message")
   * @param regexMap Map with attribute names and regex to do matches on (e.g. {"subject": "Message ([0-9]+)"})
   */
  public static buildRegExpSubustitutionMap(
    dataMap: SubstMap,
    keyPrefix: string,
    regexMap: Map<string, string>,
  ): Map<string, string> {
    const m: Map<string, string> = new Map<string, string>()

    regexMap.forEach((value, k) => {
      const regex = new RegExp(value, "g")
      let result
      const keyName = keyPrefix + "." + k
      let hasAtLeastOneMatch = false
      const data: string = dataMap.get(keyName) as string
      if ((result = regex.exec(data)) !== null) {
        hasAtLeastOneMatch = true
        console.log("Matches: " + result.length)
        for (let i = 1; i < result.length; i++) {
          m.set(keyName + ".match." + i, result[i])
        }
      }
      if (!hasAtLeastOneMatch) {
        return null
      }
    })
    return m
  }

  public static getSubstitutionMapFromThread(
    thread: GoogleAppsScript.Gmail.GmailThread,
    m: SubstMap = new SubstMap(),
  ): SubstMap {
    m.set("thread.firstMessageSubject", thread.getFirstMessageSubject())
    m.set("thread.hasStarredMessages", thread.hasStarredMessages())
    m.set("thread.id", thread.getId())
    m.set("thread.isImportant", thread.isImportant())
    m.set("thread.isInChats", thread.isInChats())
    m.set("thread.isInInbox", thread.isInInbox())
    m.set("thread.isInPriorityInbox", thread.isInPriorityInbox())
    m.set("thread.isInSpam", thread.isInSpam())
    m.set("thread.isInTrash", thread.isInTrash())
    m.set("thread.isUnread", thread.isUnread())
    const labels: GoogleAppsScript.Gmail.GmailLabel[] = thread.getLabels()
      ? thread.getLabels()
      : []
    const labelNames: string[] = []
    labels.forEach((l) => labelNames.push(l.getName()))
    m.set("thread.labels", labelNames.join(","))
    m.set("thread.lastMessageDate", thread.getLastMessageDate())
    m.set("thread.messageCount", thread.getMessageCount())
    m.set("thread.permalink", thread.getPermalink())
    return m
  }

  public static getSubstitutionMapFromMessage(
    message: GoogleAppsScript.Gmail.GmailMessage,
    m: SubstMap = new SubstMap(),
  ): SubstMap {
    m.set("message.bcc", message.getBcc())
    m.set("message.cc", message.getCc())
    m.set("message.date", message.getDate())
    m.set("message.from", message.getFrom())
    m.set("message.from.domain", message.getFrom().split("@")[1])
    m.set("message.id", message.getId())
    m.set("message.isDraft", message.isDraft())
    m.set("message.isInChats", message.isInChats())
    m.set("message.isInInbox", message.isInInbox())
    m.set("message.isInPriorityInbox", message.isInPriorityInbox())
    m.set("message.isInTrash", message.isInTrash())
    m.set("message.isStarred", message.isStarred())
    m.set("message.isUnread", message.isUnread())
    m.set("message.replyTo", message.getReplyTo())
    m.set("message.subject", message.getSubject())
    m.set("message.to", message.getTo())
    return m
  }

  public static getSubstitutionMapFromAttachment(
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
    m: SubstMap = new SubstMap(),
  ): SubstMap {
    m.set("attachment.contentType", attachment.getContentType())
    m.set("attachment.hash", attachment.getHash())
    m.set("attachment.isGoogleType", attachment.isGoogleType())
    m.set("attachment.name", attachment.getName())
    m.set("attachment.size", attachment.getSize())
    return m
  }

  public static buildSubstitutionMapFromProcessingContext(
    ctx: ProcessingContext,
    m = new SubstMap(),
  ) {
    m.set("env.runMode", ctx.env.runMode)
    m.set("env.timezone", ctx.env.timezone)
    m.set("timer.now", new Date())
    m.set("timer.runTime", ctx.proc.timer.getRunTime())
    m.set("timer.startTime", ctx.proc.timer.getStartTime())
    return m
  }

  public static buildSubstitutionMapFromThreadContext(
    ctx: ThreadContext,
    m = new SubstMap(),
  ) {
    m = this.buildSubstitutionMapFromProcessingContext(ctx, m)
    ;(m = this.getSubstitutionMapFromThread(ctx.thread.object, m)),
      m.set("thread.index", ctx.thread.index)
    m.set("threadConfig.index", ctx.thread.configIndex)
    return m
  }

  public static buildSubstitutionMapFromMessageContext(
    ctx: MessageContext,
    m = new SubstMap(),
  ) {
    m = this.buildSubstitutionMapFromThreadContext(ctx, m)
    // Message data
    const message = ctx.message.object
    m = this.getSubstitutionMapFromMessage(message, m)
    m.set("message.index", ctx.message.index)
    m.set("messageConfig.index", ctx.message.configIndex)
    const messageConfig = ctx.message.config
    if (messageConfig.match) {
      // Test for message rules
      const messgageMatch = this.buildRegExpSubustitutionMap(
        m,
        "message",
        this.getRegexMapFromMessageMatchConfig(messageConfig.match),
      )
      if (messgageMatch == null) {
        m.set("message.matched", false)
        ctx.log.info(
          "  Skipped message with id " +
            message.getId() +
            " because it did not match the regex rules ...",
        )
      }
      // If not yet defined: true, false otherwise:
      m.set("message.matched", m.get("message.matched") === undefined)
      m = PatternUtil.mergeMaps(m, messgageMatch)
    }
    return m
  }

  public static buildSubstitutionMapFromAttachmentContext(
    ctx: AttachmentContext,
    substMap = new SubstMap(),
  ): SubstMap {
    let m = this.buildSubstitutionMapFromMessageContext(ctx, substMap)
    // Attachment data
    // Substitute values for a specific attachment, if provided
    const attachment = ctx.attachment.object
    m = PatternUtil.mergeMaps(
      m,
      this.getSubstitutionMapFromAttachment(attachment),
    )
    m.set("attachment.index", ctx.attachment.index)
    m.set("attachmentConfig.index", ctx.attachment.configIndex)
    const attachmentConfig = ctx.attachment.config
    const attachmentMatch = this.buildRegExpSubustitutionMap(
      m,
      "attachment",
      this.getRegexMapFromAttachmentMatchConfig(attachmentConfig.match),
    )
    if (attachmentMatch == null) {
      m.set("attachment.matched", false)
      ctx.log.info(
        "  Skipped attachment with name '" +
          attachment.getName() +
          "' because it did not match the regex rules ...",
      )
    }
    // If not yet defined: true, false otherwise
    m.set("attachment.matched", m.get("attachment.matched") === undefined)
    m = PatternUtil.mergeMaps(m, attachmentMatch)
    return m
  }

  public static getRegexMapFromAttachmentMatchConfig(
    amc: AttachmentMatchConfig | undefined,
  ): Map<string, string> {
    const m = new Map<string, string>()
    if (amc === undefined) {
      return m
    }
    if (amc.name) m.set("name", amc.name)
    if (amc.contentTypeRegex) m.set("contentTypeRegex", amc.contentTypeRegex)
    return m
  }

  public static getRegexMapFromMessageMatchConfig(
    mmc: MessageMatchConfig | undefined,
  ): Map<string, string> {
    const m = new Map<string, string>()
    if (mmc === undefined) {
      return m
    }
    if (mmc.from) m.set("from", mmc.from)
    if (mmc.subject) m.set("subject", mmc.subject)
    if (mmc.to) m.set("to", mmc.to)
    return m
  }

  public static substitute(
    ctx: ProcessingContext | ThreadContext | MessageContext | AttachmentContext,
    pattern: string,
    m = new SubstMap(),
  ) {
    if ((ctx as AttachmentContext).attachment) {
      m = this.buildSubstitutionMapFromAttachmentContext(
        ctx as AttachmentContext,
        m,
      )
    } else if ((ctx as MessageContext).message) {
      m = this.buildSubstitutionMapFromMessageContext(ctx as MessageContext, m)
    } else if ((ctx as ThreadContext).thread) {
      m = this.buildSubstitutionMapFromThreadContext(ctx as ThreadContext, m)
    } else {
      m = this.buildSubstitutionMapFromProcessingContext(
        ctx as ProcessingContext,
        m,
      )
    }
    return this.substitutePatternFromMap(pattern, m)
  }

  public static convertFromV1Pattern(s: string, dateKey = "message.date") {
    if (s.replace(/'([^'\n]+)'/g, "") !== "") {
      // Support original date format
      s = s.replace(
        /('([^']+)')?([^']+)('([^']+)')?/g,
        "$2${" + dateKey + ":olddateformat:$3}$5",
      )
      const regexp = /:olddateformat:([^}]+)}/g
      const matches = s.matchAll(regexp)
      for (const match of matches) {
        if (match.length > 1) {
          const convertedFormat = this.convertDateFormat(match[1])
          s = s.replace(
            /:olddateformat:[^}]+}/g,
            `:dateformat:${convertedFormat}}`,
          )
        }
      }
    } else {
      s = s.replace(/'/g, "")
    }
    return s
      .replace(/%s/g, "${message.subject}") // Original subject syntax
      .replace(/%o/g, "${attachment.name}") // Alternative syntax (from PR #61)
      .replace(/%filename/g, "${attachment.name}") // Alternative syntax from issue #50
      .replace(/#SUBJECT#/g, "${message.subject}") // Alternative syntax (from PR #22)
      .replace(/#FILE#/g, "${attachment.name}") // Alternative syntax (from PR #22)
      .replace(/%d/g, "${threadConfig.index}") // Original subject syntax
  }

  private static mergeMaps(map1: SubstMap, map2: SubstMap): SubstMap {
    return new Map([
      ...Array.from(map1.entries()),
      ...Array.from(map2.entries()),
    ])
  }
}
