import { AttachmentMatchConfig } from "../config/AttachmentMatchConfig"
import { MessageMatchConfig } from "../config/MessageMatchConfig"
import { AttachmentContext, MessageContext, ThreadContext } from "../Context"
import moment from "moment-timezone"

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

  public static mapAdd(m: SubstMap, key: string, value: unknown): SubstMap {
    if (value !== undefined) {
      m.set(key, value)
    }
    return m
  }

  public static getSubstitutionMapFromThread(
    thread: GoogleAppsScript.Gmail.GmailThread,
  ): SubstMap {
    let m = new SubstMap()
    m = this.mapAdd(
      m,
      "thread.firstMessageSubject",
      thread.getFirstMessageSubject(),
    )
    m = this.mapAdd(m, "thread.hasStarredMessages", thread.hasStarredMessages())
    m = this.mapAdd(m, "thread.id", thread.getId())
    m = this.mapAdd(m, "thread.isImportant", thread.isImportant())
    m = this.mapAdd(m, "thread.isInChats", thread.isInChats())
    m = this.mapAdd(m, "thread.isInInbox", thread.isInInbox())
    m = this.mapAdd(m, "thread.isInPriorityInbox", thread.isInPriorityInbox())
    m = this.mapAdd(m, "thread.isInSpam", thread.isInSpam())
    m = this.mapAdd(m, "thread.isInTrash", thread.isInTrash())
    m = this.mapAdd(m, "thread.isUnread", thread.isUnread())
    const labels: GoogleAppsScript.Gmail.GmailLabel[] = thread.getLabels()
      ? thread.getLabels()
      : []
    const labelNames: string[] = []
    labels.forEach((l) => labelNames.push(l.getName()))
    m = this.mapAdd(m, "thread.labels", labelNames.join(","))
    m = this.mapAdd(m, "thread.lastMessageDate", thread.getLastMessageDate())
    m = this.mapAdd(m, "thread.messageCount", thread.getMessageCount())
    m = this.mapAdd(m, "thread.permalink", thread.getPermalink())
    return m
  }

  public static getSubstitutionMapFromMessage(
    message: GoogleAppsScript.Gmail.GmailMessage,
  ): SubstMap {
    let m = new SubstMap()
    m = this.mapAdd(m, "message.bcc", message.getBcc())
    m = this.mapAdd(m, "message.cc", message.getCc())
    m = this.mapAdd(m, "message.date", message.getDate())
    m = this.mapAdd(m, "message.from", message.getFrom())
    m = this.mapAdd(m, "message.from.domain", message.getFrom().split("@")[1])
    m = this.mapAdd(m, "message.id", message.getId())
    m = this.mapAdd(m, "message.isDraft", message.isDraft())
    m = this.mapAdd(m, "message.isInChats", message.isInChats())
    m = this.mapAdd(m, "message.isInInbox", message.isInInbox())
    m = this.mapAdd(m, "message.isInPriorityInbox", message.isInPriorityInbox())
    m = this.mapAdd(m, "message.isInTrash", message.isInTrash())
    m = this.mapAdd(m, "message.isStarred", message.isStarred())
    m = this.mapAdd(m, "message.isUnread", message.isUnread())
    m = this.mapAdd(m, "message.replyTo", message.getReplyTo())
    m = this.mapAdd(m, "message.subject", message.getSubject())
    m = this.mapAdd(m, "message.to", message.getTo())
    return m
  }

  public static getSubstitutionMapFromAttachment(
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
  ): SubstMap {
    let m = new SubstMap()
    m = this.mapAdd(m, "attachment.contentType", attachment.getContentType())
    m = this.mapAdd(m, "attachment.hash", attachment.getHash())
    m = this.mapAdd(m, "attachment.isGoogleType", attachment.isGoogleType())
    m = this.mapAdd(m, "attachment.name", attachment.getName())
    m = this.mapAdd(m, "attachment.size", attachment.getSize())
    return m
  }

  public static buildSubstitutionMapFromThreadContext(
    ctx: ThreadContext,
    substMap = new SubstMap(),
  ) {
    substMap = PatternUtil.mergeMaps(
      substMap,
      this.getSubstitutionMapFromThread(ctx.thread),
    )
    substMap.set("thread.index", ctx.threadIndex)
    substMap.set("threadConfig.index", ctx.threadConfigIndex)
    return substMap
  }

  public static buildSubstitutionMapFromMessageContext(
    ctx: MessageContext,
    substMap = new SubstMap(),
  ) {
    const threadContext: ThreadContext = {
      ...ctx,
    }
    let m = this.buildSubstitutionMapFromThreadContext(threadContext, substMap)
    // Message data
    const message = ctx.message
    m = PatternUtil.mergeMaps(m, this.getSubstitutionMapFromMessage(message))
    m.set("message.index", ctx.messageIndex)
    m.set("messageConfig.index", ctx.messageConfigIndex)
    const messageConfig = ctx.messageConfig
    if (messageConfig.match) {
      // Test for message rules
      const messgageMatch = this.buildRegExpSubustitutionMap(
        m,
        "message",
        this.getRegexMapFromMessageMatchConfig(messageConfig.match),
      )
      if (messgageMatch == null) {
        m.set("message.matched", false)
        console.log(
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
    const messageContext: MessageContext = {
      ...ctx,
    }
    let m = this.buildSubstitutionMapFromMessageContext(
      messageContext,
      substMap,
    )
    // Attachment data
    // Substitute values for a specific attachment, if provided
    const attachment = ctx.attachment
    m = PatternUtil.mergeMaps(
      m,
      this.getSubstitutionMapFromAttachment(attachment),
    )
    m.set("attachment.index", ctx.attachmentIndex)
    m.set("attachmentConfig.index", ctx.attachmentConfigIndex)
    const attachmentConfig = ctx.attachmentConfig
    const attachmentMatch = this.buildRegExpSubustitutionMap(
      m,
      "attachment",
      this.getRegexMapFromAttachmentMatchConfig(attachmentConfig.match),
    )
    if (attachmentMatch == null) {
      m.set("attachment.matched", false)
      console.log(
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
    if (amc.contentType) m.set("contentType", amc.contentType)
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

  public static substituteFromThreadContext(
    pattern: string,
    threadContext: ThreadContext,
  ) {
    const m = this.buildSubstitutionMapFromThreadContext(threadContext)
    return this.substitutePatternFromMap(pattern, m)
  }

  public static substituteFromMessageContext(
    pattern: string,
    messageContext: MessageContext,
  ) {
    const m = this.buildSubstitutionMapFromMessageContext(messageContext)
    return this.substitutePatternFromMap(pattern, m)
  }

  public static substituteFromAttachmentContext(
    pattern: string,
    attachmentContext: AttachmentContext,
    substMap = new SubstMap(),
  ) {
    const m = this.buildSubstitutionMapFromAttachmentContext(
      attachmentContext,
      substMap,
    )
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
  }

  private static mergeMaps(map1: SubstMap, map2: SubstMap): SubstMap {
    return new Map([
      ...Array.from(map1.entries()),
      ...Array.from(map2.entries()),
    ])
  }
}
