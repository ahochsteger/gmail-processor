import { ProcessingStage } from "../config/ActionConfig"
import {
  AttachmentOrderField,
  RequiredAttachmentConfig,
} from "../config/AttachmentConfig"
import {
  AttachmentMatchConfig,
  RequiredAttachmentMatchConfig,
} from "../config/AttachmentMatchConfig"
import { OrderableEntityConfig, OrderDirection } from "../config/CommonConfig"
import {
  Attachment,
  AttachmentContext,
  AttachmentInfo,
  ContextType,
  MessageContext,
  MetaInfo,
  newMetaInfo as mi,
  MetaInfoType as MIT,
  newProcessingResult,
  ProcessingResult,
} from "../Context"
import { PatternUtil } from "../utils/PatternUtil"
import { BaseProcessor, MatchRule } from "./BaseProcessor"

export class AttachmentProcessor extends BaseProcessor {
  public static buildContext(
    ctx: MessageContext,
    info: AttachmentInfo,
  ): AttachmentContext {
    const attachmentContext: AttachmentContext = {
      ...ctx,
      type: ContextType.ATTACHMENT,
      attachment: info,
      attachmentMeta: {},
    }
    attachmentContext.attachmentMeta = this.buildMetaInfo(attachmentContext)
    this.updateContextMeta(attachmentContext)
    return attachmentContext
  }

  public static matches(
    ctx: MessageContext,
    matchConfig: RequiredAttachmentMatchConfig,
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
  ) {
    const matchRules: MatchRule[] = [
      {
        name: "contentType",
        type: "regex",
        config: matchConfig.contentType,
        value: attachment.getContentType(),
      },
      {
        name: "largerThan",
        type: "min",
        config: matchConfig.largerThan,
        value: attachment.getSize() - 1, //
      },
      {
        name: "name",
        type: "regex",
        config: matchConfig.name,
        value: attachment.getName(),
      },
      {
        name: "smallerThan",
        type: "max",
        config: matchConfig.smallerThan,
        value: attachment.getSize() + 1,
      },
    ]
    return this.matchesRules(ctx, matchRules)
  }

  public static buildMatchConfig(
    ctx: MessageContext,
    global: RequiredAttachmentMatchConfig,
    local: RequiredAttachmentMatchConfig,
  ): RequiredAttachmentMatchConfig {
    const matchConfig: RequiredAttachmentMatchConfig = {
      contentType: PatternUtil.substitute(
        ctx,
        `${global.contentType}|${local.contentType}`.replace(".*|", ""),
      ).replace("|.*", ""),
      includeAttachments: global.includeAttachments && local.includeAttachments,
      includeInlineImages:
        global.includeInlineImages && local.includeInlineImages,
      largerThan: this.effectiveMaxNumber(
        global.largerThan,
        local.largerThan,
        -1,
      ),
      name: PatternUtil.substitute(
        ctx,
        `${global.name}|${local.name}`
          .replace("(.*)|", "")
          .replace("|(.*)", ""),
      ),
      smallerThan: this.effectiveMinNumber(
        global.smallerThan,
        local.smallerThan,
        -1,
      ),
    }
    return matchConfig
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

  public static buildMetaInfo(ctx: AttachmentContext): MetaInfo {
    const keyPrefix = "attachment"
    let m: MetaInfo = {
      [`${keyPrefix}.contentType`]: mi(
        MIT.STRING,
        (att: Attachment) => att.getContentType(),
        "Attachment Content Type",
        this.getRefDocs(
          keyPrefix,
          "getContentType",
          "The content type of the attachment.",
        ),
      ),
      [`${keyPrefix}.hash`]: mi(
        MIT.STRING,
        (att: Attachment) => att.getHash(),
        "Attachment Hash",
        this.getRefDocs(
          keyPrefix,
          "getHash",
          "The SHA1 content hash for the attachment.",
        ),
      ),
      [`${keyPrefix}.isGoogleType`]: mi(
        MIT.STRING,
        (att: Attachment) => att.isGoogleType(),
        "Google Type Attachment",
        this.getRefDocs(
          keyPrefix,
          "isGoogleType",
          "`true` if this attachment is a Google Workspace file (Sheets, Docs, etc.).",
        ),
      ),
      [`${keyPrefix}.name`]: mi(
        MIT.STRING,
        (att: Attachment) => att.getName(),
        "Attachment Name",
        this.getRefDocs(keyPrefix, "getName", "The name of the attachment."),
      ),
      [`${keyPrefix}.size`]: mi(
        MIT.STRING,
        (att: Attachment) => att.getSize(),
        "Attachment Size",
        this.getRefDocs(keyPrefix, "getSize", "The size of the attachment."),
      ),
      [`${keyPrefix}.index`]: mi(
        MIT.STRING,
        ctx.attachment.index,
        "Attachment Index",
        "The index number (0-based) of the attachment.",
      ),
      "attachmentConfig.index": mi(
        MIT.STRING,
        ctx.attachment.configIndex,
        "Attachment Config Index",
        "The index number (0-based) of the attachment config.",
      ),
    }
    const attachmentConfig = ctx.attachment.config
    m = this.buildRegExpSubstitutionMap(
      ctx,
      m,
      keyPrefix,
      this.getRegexMapFromAttachmentMatchConfig(attachmentConfig.match),
    )
    return m
  }

  public static processConfigs(
    ctx: MessageContext,
    configs: RequiredAttachmentConfig[],
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    ctx.log.trace(ctx, {
      location: "AttachmentProcessor.processConfigs()",
      message: "Processing attachment configs started ...",
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
      location: "AttachmentProcessor.processConfigs()",
      message: "Processing attachment configs finished.",
    })
    return result
  }

  public static orderRules(
    a: GoogleAppsScript.Gmail.GmailAttachment,
    b: GoogleAppsScript.Gmail.GmailAttachment,
    config: OrderableEntityConfig<AttachmentOrderField>,
  ): number {
    return (
      {
        [AttachmentOrderField.CONTENT_TYPE]: a
          .getContentType()
          .localeCompare(b.getContentType()),
        [AttachmentOrderField.HASH]: a.getHash().localeCompare(b.getHash()),
        [AttachmentOrderField.NAME]: a.getName().localeCompare(b.getName()),
      }[config.orderBy] *
      (config.orderDirection === OrderDirection.ASC ? 1 : -1)
    )
  }

  public static processConfig(
    ctx: MessageContext,
    config: RequiredAttachmentConfig,
    configIndex: number,
    result: ProcessingResult,
  ): ProcessingResult {
    ctx.log.trace(ctx, {
      location: "AttachmentProcessor.processConfig()",
      message: `Processing attachment config '${configIndex}' started ...`,
    })
    const matchConfig = this.buildMatchConfig(
      ctx,
      ctx.proc.config.global.attachment.match,
      config.match,
    )
    const opts: GoogleAppsScript.Gmail.GmailAttachmentOptions = {
      includeAttachments: matchConfig.includeAttachments,
      includeInlineImages: matchConfig.includeInlineImages,
    }
    const attachments = this.ordered(
      ctx.message.object.getAttachments(opts),
      config,
      this.orderRules,
    )
    for (let index = 0; index < attachments.length; index++) {
      const attachment = attachments[index]
      if (!this.matches(ctx, matchConfig, attachment)) {
        ctx.log.info(
          `Skipping non-matching attachment hash '${ctx.log.redact(ctx, attachment.getHash())}' (name:'${ctx.log.redact(ctx, attachment.getName())}', type:${attachment.getContentType()}, size:${attachment.getSize()}) started ...`,
        )
        continue
      }
      const attachmentContext = this.buildContext(ctx, {
        config: config,
        configIndex: configIndex,
        index: index,
        object: attachment,
      })
      result = this.processEntity(attachmentContext, result)
    }
    result.processedAttachmentConfigs += 1
    ctx.log.trace(ctx, {
      location: "AttachmentProcessor.processConfig()",
      message: `Processing attachment config '${configIndex}' finished.`,
    })
    return result
  }

  public static processEntity(
    ctx: AttachmentContext,
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    const attachment = ctx.attachment.object
    ctx.log.trace(ctx, {
      location: "AttachmentProcessor.processEntity()",
      message: `Processing attachment hash '${ctx.log.redact(ctx, attachment.getHash())}' (name:'${ctx.log.redact(ctx, attachment.getName())}', type:${attachment.getContentType()}, size:${attachment.getSize()}) started ...`,
    })
    // Execute pre-main actions:
    result = this.executeActions(
      ctx,
      ProcessingStage.PRE_MAIN,
      result,
      ctx.proc.config.global.attachment.actions,
      ctx.attachment.config.actions,
    )

    // Execute main actions:
    result = this.executeActions(
      ctx,
      ProcessingStage.MAIN,
      result,
      ctx.proc.config.global.attachment.actions,
      ctx.attachment.config.actions,
    )

    // Execute post-main actions:
    result = this.executeActions(
      ctx,
      ProcessingStage.POST_MAIN,
      result,
      ctx.attachment.config.actions,
      ctx.proc.config.global.attachment.actions,
    )
    result.processedAttachments += 1
    ctx.log.trace(ctx, {
      location: "AttachmentProcessor.processEntity()",
      message: `Processing attachment hash '${ctx.log.redact(ctx, attachment.getHash())}' finished.`,
    })
    return result
  }
}
