import {
  ContextType,
  MetaInfoType as MIT,
  Message,
  MessageContext,
  MessageInfo,
  MetaInfo,
  ProcessingResult,
  ThreadContext,
  newMetaInfo as mi,
  newProcessingResult,
} from "../Context"
import { ProcessingStage } from "../config/ActionConfig"
import { OrderDirection, OrderableEntityConfig } from "../config/CommonConfig"
import {
  MessageOrderField,
  RequiredMessageConfig,
} from "../config/MessageConfig"
import {
  MessageMatchConfig,
  RequiredMessageMatchConfig,
} from "../config/MessageMatchConfig"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import { AttachmentProcessor } from "../processors/AttachmentProcessor"
import { PatternUtil } from "../utils/PatternUtil"
import { BaseProcessor, MatchRule } from "./BaseProcessor"

export class MessageProcessor extends BaseProcessor {
  public static buildContext(
    ctx: ThreadContext,
    info: MessageInfo,
  ): MessageContext {
    const messageContext: MessageContext = {
      ...ctx,
      type: ContextType.MESSAGE,
      message: info,
      messageMeta: {},
    }
    messageContext.messageMeta = this.buildMetaInfo(messageContext)
    this.updateContextMeta(messageContext)
    return messageContext
  }

  private static extractHeaders(rawContent?: string): string {
    if (!rawContent) {
      return ""
    }
    const headerEndPos = rawContent.indexOf("\r\n\r\n")
    if (headerEndPos !== -1) {
      return rawContent.substring(0, headerEndPos)
    }
    const headerEndPosLf = rawContent.indexOf("\n\n")
    if (headerEndPosLf !== -1) {
      return rawContent.substring(0, headerEndPosLf)
    }
    // If no double newline is found, assume the entire content might be headers
    // (e.g., empty body or unusual format)
    return rawContent
  }

  public static matches(
    ctx: ThreadContext,
    matchConfig: RequiredMessageMatchConfig,
    message: GoogleAppsScript.Gmail.GmailMessage,
  ): boolean {
    const matchRules: MatchRule[] = [
      {
        name: "body",
        type: "regex",
        value: message.getBody(),
        config: matchConfig.body,
      },
      {
        name: "from",
        type: "regex",
        value: message.getFrom(),
        config: matchConfig.from,
      },
      {
        name: "plainBody",
        type: "regex",
        value: message.getPlainBody(),
        config: matchConfig.plainBody,
      },
      {
        name: "rawHeaders",
        type: "regex",
        value: this.extractHeaders(message.getRawContent()),
        config: matchConfig.rawHeaders,
      },
      {
        name: "to",
        type: "regex",
        value: message.getTo(),
        config: matchConfig.to,
      },
      {
        name: "subject",
        type: "regex",
        value: message.getSubject(),
        config: matchConfig.subject,
      },
      {
        name: "newerThan",
        type: "dateNewer",
        value: message.getDate().toISOString(),
        config: matchConfig.newerThan,
      },
      {
        name: "oderThan",
        type: "dateOlder",
        value: message.getDate().toISOString(),
        config: matchConfig.olderThan,
      },
      {
        name: "is",
        type: "labels",
        value: [
          { name: "read", value: !message.isUnread() },
          { name: "unread", value: message.isUnread() },
          { name: "starred", value: message.isStarred() },
          { name: "unstarred", value: !message.isStarred() },
        ]
          .filter((f) => f.value === true)
          .map((f) => f.name)
          .join(","),
        config: matchConfig.is.map((m) => `^${m}$`).join(","),
      },
    ]
    return this.matchesRules(ctx, matchRules)
  }

  public static buildMatchConfig(
    ctx: ThreadContext,
    global: MessageMatchConfig,
    local: RequiredMessageMatchConfig,
  ): RequiredMessageMatchConfig {
    const matchConfig: RequiredMessageMatchConfig = {
      body: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.body, local.body, ""),
      ),
      from: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.from, local.from, ""),
      ),
      is: (global.is ?? []).concat(local.is),
      newerThan: this.effectiveValue(global.newerThan, local.newerThan, ""),
      olderThan: this.effectiveValue(global.olderThan, local.olderThan, ""),
      plainBody: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.plainBody, local.plainBody, ""),
      ),
      rawHeaders: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.rawHeaders, local.rawHeaders, ""),
      ),
      subject: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.subject, local.subject, ""),
      ),
      to: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.to, local.to, ""),
      ),
    }
    return matchConfig
  }

  public static getRegexMapFromMessageMatchConfig(
    mmc: MessageMatchConfig | undefined,
  ): Map<string, string> {
    const m = new Map<string, string>()
    if (mmc === undefined) {
      return m
    }
    if (mmc.body) m.set("body", mmc.body)
    if (mmc.from) m.set("from", mmc.from)
    if (mmc.plainBody) m.set("plainBody", mmc.plainBody)
    if (mmc.rawHeaders) m.set("rawHeaders", mmc.rawHeaders)
    if (mmc.subject) m.set("subject", mmc.subject)
    if (mmc.to) m.set("to", mmc.to)
    return m
  }

  public static buildMetaInfo(ctx: MessageContext): MetaInfo {
    const keyPrefix = "message"
    let m: MetaInfo = {
      [`${keyPrefix}.bcc`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getBcc(),
        "Message BCC",
        this.getRefDocs(
          keyPrefix,
          "getBcc",
          "The comma-separated recipients bcc'd on the message.",
        ),
      ),
      [`${keyPrefix}.body`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getBody(),
        "Message Body",
        this.getRefDocs(keyPrefix, "getBody", "The body of the message."),
      ),
      [`${keyPrefix}.cc`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getCc(),
        "Message CC",
        this.getRefDocs(
          keyPrefix,
          "getCc",
          "The comma-separated recipients cc'd on the message.",
        ),
      ),
      [`${keyPrefix}.date`]: mi(
        MIT.DATE,
        (msg: Message) => msg.getDate(),
        "Message Date",
        this.getRefDocs(
          keyPrefix,
          "getDate",
          "The date and time of the message.",
        ),
      ),
      [`${keyPrefix}.from`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getFrom(),
        "Sender",
        this.getRefDocs(keyPrefix, "getFrom", "The sender of the message."),
      ),
      "message.from.domain": mi(
        MIT.STRING,
        (msg: Message) => msg.getFrom().split("@")[1],
        "Sender Domain",
        this.getRefDocs(
          keyPrefix,
          "getFrom",
          "The sender domain of the message.",
        ),
      ),
      [`${keyPrefix}.id`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getId(),
        "Message ID",
        this.getRefDocs(keyPrefix, "getId", "The ID of the message."),
      ),
      [`${keyPrefix}.isDraft`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isDraft(),
        "Draft Message",
        this.getRefDocs(
          keyPrefix,
          "isDraft",
          "`true` if the message is a draft.",
        ),
      ),
      [`${keyPrefix}.isInChats`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isInChats(),
        "Chat Message",
        this.getRefDocs(
          keyPrefix,
          "isInChats",
          "`true` if the message is a chat.",
        ),
      ),
      [`${keyPrefix}.isInInbox`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isInInbox(),
        "Inbox Message",
        this.getRefDocs(
          keyPrefix,
          "isInInbox",
          "`true` if the message is in the inbox.",
        ),
      ),
      [`${keyPrefix}.isInPriorityInbox`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isInPriorityInbox(),
        "Priority Inbox Message",
        this.getRefDocs(
          keyPrefix,
          "isInPriorityInbox",
          "`true` if if the message is in the priority inbox.",
        ),
      ),
      [`${keyPrefix}.isInTrash`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isInTrash(),
        "Trash Message",
        this.getRefDocs(
          keyPrefix,
          "isInTrash",
          "`true` if the message is in the trash.",
        ),
      ),
      [`${keyPrefix}.isStarred`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isStarred(),
        "Starred Message",
        this.getRefDocs(
          keyPrefix,
          "isStarred",
          "`true` if the message is starred.",
        ),
      ),
      [`${keyPrefix}.isUnread`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isUnread(),
        "Unread Message",
        this.getRefDocs(
          keyPrefix,
          "isUnread",
          "`true` if the message is unread.",
        ),
      ),
      [`${keyPrefix}.plainBody`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getPlainBody(),
        "Message Plain Body",
        this.getRefDocs(
          keyPrefix,
          "getPlainBody",
          "The plain body of the message.",
        ),
      ),
      [`${keyPrefix}.rawHeaders`]: mi(
        MIT.STRING,
        (msg: Message) => this.extractHeaders(msg.getRawContent()),
        "Message Raw Headers",
        this.getRefDocs(
          keyPrefix,
          "getRawContent",
          "The raw headers of the message.",
        ),
      ),
      [`${keyPrefix}.replyTo`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getReplyTo(),
        "Message Reply To",
        this.getRefDocs(
          keyPrefix,
          "getReplyTo",
          "The reply-to address of the message (usually the sender).",
        ),
      ),
      [`${keyPrefix}.subject`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getSubject(),
        "Message Subject",
        this.getRefDocs(keyPrefix, "getSubject", "The subject of the message."),
      ),
      [`${keyPrefix}.to`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getTo(),
        "Message To",
        this.getRefDocs(
          keyPrefix,
          "getTo",
          "The comma-separated recipients of the message.",
        ),
      ),
      [`${keyPrefix}.url`]: mi(
        MIT.STRING,
        (msg: Message) =>
          `https://mail.google.com/mail/u/0/#inbox/${msg.getId()}`,
        "Message URL",
        "The URL of the message.",
      ),
      [`${keyPrefix}.index`]: mi(
        MIT.NUMBER,
        ctx.message.index,
        "Message Index",
        "The index number (0-based) of the message.",
      ),
      "messageConfig.index": mi(
        MIT.NUMBER,
        ctx.message.configIndex,
        "Message Config Index",
        "The index number (0-based) of the message config.",
      ),
    }
    const messageConfig = ctx.message.config
    m = this.buildRegExpSubstitutionMap(
      ctx,
      m,
      keyPrefix,
      this.getRegexMapFromMessageMatchConfig(messageConfig.match),
    )
    return m
  }

  public static orderRules(
    a: GoogleAppsScript.Gmail.GmailMessage,
    b: GoogleAppsScript.Gmail.GmailMessage,
    config: OrderableEntityConfig<MessageOrderField>,
  ): number {
    return (
      {
        [MessageOrderField.DATE]: a.getDate().getTime() - b.getDate().getTime(),
        [MessageOrderField.FROM]: a.getFrom().localeCompare(b.getFrom()),
        [MessageOrderField.ID]: a.getId().localeCompare(b.getId()),
        [MessageOrderField.SUBJECT]: a
          .getSubject()
          .localeCompare(b.getSubject()),
      }[config.orderBy] *
      (config.orderDirection === OrderDirection.ASC ? 1 : -1)
    )
  }

  public static processConfig(
    ctx: ThreadContext,
    config: RequiredMessageConfig,
    configIndex: number,
    result: ProcessingResult,
  ): ProcessingResult {
    ctx.log.trace(ctx, {
      location: "MessageProcessor.processConfig()",
      message: `Processing message config '${configIndex}' started ...`,
    })
    const messages = this.ordered(
      ctx.thread.object.getMessages(),
      config,
      this.orderRules,
    )
    const matchConfig = this.buildMatchConfig(
      ctx,
      ctx.proc.config.global.message.match,
      config.match,
    )
    for (let index = 0; index < messages.length; index++) {
      if (
        ctx.proc.config.settings.markProcessedMethod ===
        MarkProcessedMethod.MARK_MESSAGE_READ
      ) {
        ctx.proc.timer.checkMaxRuntimeReached()
      }
      // TODO: Move everything from here on into processEntity()
      const message = messages[index]
      if (!this.matches(ctx, matchConfig, message)) {
        ctx.log.info(
          `Skipping non-matching message id '${ctx.log.redact(ctx, message.getId())}' (date:'${message
            .getDate()
            .toISOString()}',  subject:'${ctx.log.redact(ctx, message.getSubject())}', from:${ctx.log.redact(ctx, message.getFrom())}).`,
        )
        continue
      }
      const messageContext = this.buildContext(ctx, {
        object: message,
        config: config,
        configIndex: configIndex,
        index: index,
      })
      result = this.processEntity(messageContext, result)
    }
    result.processedMessageConfigs += 1
    ctx.log.trace(ctx, {
      location: "MessageProcessor.processConfig()",
      message: `Processing message config '${configIndex}' finished.`,
    })
    return result
  }

  public static processConfigs(
    ctx: ThreadContext,
    configs: RequiredMessageConfig[],
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    ctx.log.trace(ctx, {
      location: "MessageProcessor.processConfigs()",
      message: "Processing message configs started ...",
    })
    for (let configIndex = 0; configIndex < configs.length; configIndex++) {
      result = this.processConfig(
        ctx,
        configs[configIndex],
        configIndex,
        result,
      )
    }
    ctx.log.trace(ctx, {
      location: "MessageProcessor.processConfigs()",
      message: "Processing message configs finished.",
    })
    return result
  }

  /**
   * Processes a message.
   * @param ctx - The message context
   * @param result - The processing result up to now
   * @returns The result after processing
   */
  public static processEntity(
    ctx: MessageContext,
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    const config = ctx.message.config
    const message = ctx.message.object
    ctx.log.trace(ctx, {
      location: "MessageProcessor.processEntity()",
      message: `Processing message id '${ctx.log.redact(ctx, message.getId())}' (date:'${message
        .getDate()
        .toISOString()}',  subject:'${ctx.log.redact(ctx, message.getSubject())}', from:${ctx.log.redact(ctx, message.getFrom())}) started ...`,
    })
    // Execute pre-main actions:
    result = this.executeActions(
      ctx,
      ProcessingStage.PRE_MAIN,
      result,
      ctx.proc.config.global.message.actions,
      ctx.message.config.actions,
    )

    // Process attachment configs:
    if (config.attachments.length > 0) {
      // New rule configuration format
      result = AttachmentProcessor.processConfigs(
        ctx,
        config.attachments,
        result,
      )
    }

    // Execute post-main actions:
    result = this.executeActions(
      ctx,
      ProcessingStage.POST_MAIN,
      result,
      ctx.message.config.actions,
      ctx.proc.config.global.message.actions,
    )
    result.processedMessages += 1
    ctx.log.trace(ctx, {
      location: "MessageProcessor.processEntity()",
      message: `Processing message id '${ctx.log.redact(ctx, message.getId())}' finished.`,
    })
    return result
  }
}
