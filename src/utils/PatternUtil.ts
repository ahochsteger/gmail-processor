import dateFormat from "dateformat"
import { MessageRule } from "../config/MessageRule"
import { ProcessingContext } from "../context/ProcessingContext"

export class PatternUtil {
  public static escapeRegExp(s: string) {
    // tslint:disable-next-line: max-line-length
    // See https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
  }

  public static substituteStrings(pattern: string, data: Map<string, any>) {
    let s = pattern
    data.forEach((value: any, key: string) => {
      const rex = new RegExp("\\$\\{" + this.escapeRegExp(key) + "\\}")
      s = s.replace(rex, value)
    })
    return s
  }

  public static substituteDates(
    pattern: string,
    data: Map<string, any>,
    formatType = "dateformat",
  ) {
    let s = pattern
    const regex = new RegExp("\\$\\{([^:{]+):" + formatType + ":([^}]+)\\}")
    let result
    // tslint:disable-next-line: no-conditional-assignment
    while ((result = regex.exec(s)) !== null) {
      const date = data.get(result[1])
      const format =
        formatType === "olddateformat"
          ? PatternUtil.convertDateFormat(result[2])
          : result[2]
      const v = dateFormat(date, format)
      s = s.replace(new RegExp(this.escapeRegExp(result[0])), v)
    }
    return s
  }

  public static convertDateFormat(format: string): string {
    // old format (from Utilities): yyyy-MM-dd_HH-mm-ss
    // See https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
    // new format (from dateformat): yyyy-mm-dd_HH-MM-ss
    const convertedFormat = format
      .replace(/M/g, "§1")
      .replace(/m/g, "M")
      .replace(/§1/g, "m")
    return convertedFormat
  }

  public static substitutePatternFromMap(
    pattern: string,
    data: Map<string, any>,
    timezone = "UTC",
  ) {
    let s = pattern
    s = this.substituteDates(s, data, "olddateformat")
    s = this.substituteDates(s, data, "dateformat")
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
    dataMap: Map<string, any>,
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
      // tslint:disable-next-line: no-conditional-assignment
      while ((result = regex.exec(data)) !== null) {
        hasAtLeastOneMatch = true
        // Logger.log("Matches: " + result.length);
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

  public static mapAdd(
    m: Map<string, any>,
    key: string,
    value: any,
  ): Map<string, any> {
    if (value !== undefined) {
      m.set(key, value)
    }
    return m
  }

  public static getSubstitutionMapFromThread(
    thread: GoogleAppsScript.Gmail.GmailThread,
  ): Map<string, any> {
    let m = new Map<string, any>()
    m = this.mapAdd(
      m,
      "thread.firstMessageSubject",
      thread.getFirstMessageSubject(),
    )
    m = this.mapAdd(m, "thread.hasStarredMessages", thread.hasStarredMessages())
    m = this.mapAdd(m, "thread.id", thread.getId())
    m = this.mapAdd(m, "thread.isImportant", thread.isImportant())
    m = this.mapAdd(m, "thread.isInPriorityInbox", thread.isInPriorityInbox())
    m = this.mapAdd(m, "thread.labels", thread.getLabels())
    m = this.mapAdd(m, "thread.lastMessageDate", thread.getLastMessageDate())
    m = this.mapAdd(m, "thread.messageCount", thread.getMessageCount())
    m = this.mapAdd(m, "thread.permalink", thread.getPermalink())
    return m
  }

  public static getSubstitutionMapFromMessage(
    message: GoogleAppsScript.Gmail.GmailMessage,
  ): Map<string, any> {
    let m = new Map<string, any>()
    m = this.mapAdd(m, "message.bcc", message.getBcc())
    m = this.mapAdd(m, "message.cc", message.getCc())
    m = this.mapAdd(m, "message.date", message.getDate())
    m = this.mapAdd(m, "message.from", message.getFrom())
    m = this.mapAdd(m, "message.id", message.getId())
    m = this.mapAdd(m, "message.replyTo", message.getReplyTo())
    m = this.mapAdd(m, "message.subject", message.getSubject())
    m = this.mapAdd(m, "message.to", message.getTo())
    return m
  }

  public static getSubstitutionMapFromAttachment(
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
  ): Map<string, any> {
    let m = new Map<string, any>()
    m = this.mapAdd(m, "attachment.contentType", attachment.getContentType())
    m = this.mapAdd(m, "attachment.hash", attachment.getHash())
    m = this.mapAdd(m, "attachment.isGoogleType", attachment.isGoogleType())
    m = this.mapAdd(m, "attachment.name", attachment.getName())
    m = this.mapAdd(m, "attachment.size", attachment.getSize())
    return m
  }

  /**
   *
   */
  public static buildSubstitutionMap(
    thread: GoogleAppsScript.Gmail.GmailThread,
    msgIdx: number,
    attIdx: number,
    rule: MessageRule,
    attRuleIdx: number,
  ): Map<string, any> {
    let m = new Map<string, any>()
    msgIdx = msgIdx !== undefined ? msgIdx : 0
    attIdx = attIdx !== undefined ? attIdx : 0
    rule = rule !== undefined ? rule : new MessageRule({})
    attRuleIdx = attRuleIdx !== undefined ? attRuleIdx : 0

    // Thread data
    m = PatternUtil.mergeMaps(m, this.getSubstitutionMapFromThread(thread))

    // Message data
    const messages = thread.getMessages()
    if (messages !== undefined && messages != null && messages.length > 0) {
      const message = thread.getMessages()[msgIdx]
      m = PatternUtil.mergeMaps(m, this.getSubstitutionMapFromMessage(message))
      if (rule.match) {
        // Test for message rules
        const messgageMatch = this.buildRegExpSubustitutionMap(
          m,
          "message",
          rule.match,
        )
        if (messgageMatch == null) {
          m.set("message.matched", false)
          Logger.log(
            "  Skipped message with id " +
              message.getId() +
              " because it did not match the regex rules ...",
          )
        }
        // If not yet defined: true, false otherwise:
        m.set("message.matched", m.get("message.matched") === undefined)
        m = PatternUtil.mergeMaps(m, messgageMatch)
      }
      // Attachment data
      if (attIdx >= 0 && attIdx < message.getAttachments().length) {
        // Substitute values for a specific attachment, if provided
        const attachment = message.getAttachments()[attIdx]
        m = PatternUtil.mergeMaps(
          m,
          this.getSubstitutionMapFromAttachment(attachment),
        )
        m.set("attachment.index", attIdx + 1)
        if (
          rule.attachmentRules !== undefined &&
          attRuleIdx >= 0 &&
          attRuleIdx < rule.attachmentRules.length
        ) {
          const attachmentRule = rule.attachmentRules[attRuleIdx]
          const attachmentMatch = this.buildRegExpSubustitutionMap(
            m,
            "attachment",
            attachmentRule.match,
          )
          if (attachmentMatch == null) {
            m.set("attachment.matched", false)
            Logger.log(
              "  Skipped attachment with name '" +
                attachment.getName() +
                "' because it did not match the regex rules ...",
            )
          }
          // If not yet defined: true, false otherwise
          m.set("attachment.matched", m.get("attachment.matched") === undefined)
          m = PatternUtil.mergeMaps(m, attachmentMatch)
        }
      }
    }
    return m
  }

  public static substitutePatternFromThread(
    pattern: string,
    thread: GoogleAppsScript.Gmail.GmailThread,
    msgIdx: number,
    attIdx: number,
    rule: MessageRule,
    attRuleIdx = 0,
  ) {
    const m = this.buildSubstitutionMap(
      thread,
      msgIdx,
      attIdx,
      rule,
      attRuleIdx,
    )
    return this.substitutePatternFromMap(pattern, m)
  }

  public static substitutePatternFromContext(
    pattern: string,
    context: ProcessingContext,
  ) {
    if (!context.threadContext || !context.threadContext.thread) {
      return pattern
    }
    const thread = context.threadContext.thread
    const msgIdx = context.messageContext ? context.messageContext.index : -1
    const attIdx = context.attachmentContext
      ? context.attachmentContext.index
      : -1
    const rule = context.messageContext
      ? context.messageContext.messageRule
      : new MessageRule({})
    const attRuleIdx = context.attachmentContext
      ? context.attachmentContext.ruleIndex
      : -1
    this.substitutePatternFromThread(
      pattern,
      thread,
      msgIdx,
      attIdx,
      rule,
      attRuleIdx,
    )
  }

  public static convertFromV1Pattern(s: string, dateKey: string) {
    if (s.replace(/'([^'\n]+)'/g, "") !== "") {
      // Support original date format
      s = s.replace(
        /('([^']+)')?([^']+)('([^']+)')?/g,
        "$2${" + dateKey + ":dateformat:$3}$5",
      )
    } else {
      s = s.replace(/'/g, "")
    }
    return s
      .replace(/%s/g, "${message.subject}") // Original subject syntax
      .replace(/%o/g, "${attachment.name}") // Alternative syntax (from PR #61)
      .replace(/#SUBJECT#/g, "${message.subject}") // Alternative syntax (from PR #22)
      .replace(/#FILE#/g, "${attachment.name}") // Alternative syntax (from PR #22)
  }

  private static mergeMaps(
    map1: Map<string, any>,
    map2: Map<string, any>,
  ): Map<string, any> {
    return new Map([
      ...Array.from(map1.entries()),
      ...Array.from(map2.entries()),
    ])
  }
}
