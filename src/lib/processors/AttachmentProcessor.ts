import { ProcessingStage } from "../config/ActionConfig"
import { RequiredAttachmentConfig } from "../config/AttachmentConfig"
import {
  AttachmentMatchConfig,
  RequiredAttachmentMatchConfig,
} from "../config/AttachmentMatchConfig"
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
import { RegexUtils } from "../utils/RegexUtils"
import { BaseProcessor } from "./BaseProcessor"

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
    try {
      if (
        !RegexUtils.matchRegExp(
          matchConfig.contentType,
          attachment.getContentType(),
        )
      )
        return RegexUtils.noMatch(
          ctx,
          `contentType '${attachment.getContentType()}' does not match '${
            matchConfig.contentType
          }'`,
        )
      if (!RegexUtils.matchRegExp(matchConfig.name, attachment.getName()))
        return RegexUtils.noMatch(
          ctx,
          `name '${attachment.getName()}' does not match '${matchConfig.name}'`,
        )
      if (
        matchConfig.largerThan != -1 &&
        attachment.getSize() <= matchConfig.largerThan
      )
        return RegexUtils.noMatch(
          ctx,
          `size ${attachment.getSize()} not larger than ${
            matchConfig.largerThan
          }`,
        )
      if (
        matchConfig.smallerThan != -1 &&
        attachment.getSize() >= matchConfig.smallerThan
      )
        return RegexUtils.noMatch(
          ctx,
          `size ${attachment.getSize()} not smaller than ${
            matchConfig.smallerThan
          }`,
        )
    } catch (e) {
      return RegexUtils.matchError(
        ctx,
        `Skipping attachment (name:${attachment.getName()}, hash:${attachment.getHash()}) due to error during match check: ${e} (matchConfig: ${JSON.stringify(
          matchConfig,
        )})`,
      )
    }
    return true
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
        this.getRefDocs(
          keyPrefix,
          "getContentType",
          "The content type of the attachment.",
        ),
      ),
      [`${keyPrefix}.hash`]: mi(
        MIT.STRING,
        (att: Attachment) => att.getHash(),
        this.getRefDocs(
          keyPrefix,
          "getHash",
          "The SHA1 content hash for the attachment.",
        ),
      ),
      [`${keyPrefix}.isGoogleType`]: mi(
        MIT.STRING,
        (att: Attachment) => att.isGoogleType(),
        this.getRefDocs(
          keyPrefix,
          "isGoogleType",
          "`true` if this attachment is a Google Workspace file (Sheets, Docs, etc.).",
        ),
      ),
      [`${keyPrefix}.name`]: mi(
        MIT.STRING,
        (att: Attachment) => att.getName(),
        this.getRefDocs(keyPrefix, "getName", "The name of the attachment."),
      ),
      [`${keyPrefix}.size`]: mi(
        MIT.STRING,
        (att: Attachment) => att.getSize(),
        this.getRefDocs(keyPrefix, "getSize", "The size of the attachment."),
      ),
      [`${keyPrefix}.index`]: mi(
        MIT.STRING,
        ctx.attachment.index,
        "The index number (0-based) of the attachment.",
      ),
      "attachmentConfig.index": mi(
        MIT.STRING,
        ctx.attachment.configIndex,
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
    for (let configIndex = 0; configIndex < configs.length; configIndex++) {
      const config = configs[configIndex]
      ctx.log.info(
        `Processing of attachment config '${config.name}' started ...`,
      )
      const matchConfig = this.buildMatchConfig(
        ctx,
        ctx.proc.config.global.attachment.match,
        config.match,
      )
      const opts: GoogleAppsScript.Gmail.GmailAttachmentOptions = {
        includeAttachments: matchConfig.includeAttachments,
        includeInlineImages: matchConfig.includeInlineImages,
      }
      const attachments = ctx.message.object.getAttachments(opts)
      for (let index = 0; index < attachments.length; index++) {
        const attachment = attachments[index]
        if (!this.matches(ctx, matchConfig, attachment)) {
          ctx.log.debug(
            `Skipping non-matching attachment hash '${attachment.getHash()}' (name:'${attachment.getName()}', type:${attachment.getContentType()}, size:${attachment.getSize()}) started ...`,
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
      ctx.log.info(`Processing of attachment config '${config.name}' finished.`)
    }
    return result
  }

  public static processEntity(
    ctx: AttachmentContext,
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    const attachment = ctx.attachment.object
    ctx.log.info(
      `Processing of attachment hash '${attachment.getHash()}' (name:'${attachment.getName()}', type:${attachment.getContentType()}, size:${attachment.getSize()}) started ...`,
    )
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
    ctx.log.info(
      `Processing of attachment hash '${attachment.getHash()}' finished.`,
    )
    return result
  }
}
