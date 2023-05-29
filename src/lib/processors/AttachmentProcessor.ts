import { ProcessingStage } from "../config/ActionConfig"
import { RequiredAttachmentConfig } from "../config/AttachmentConfig"
import {
  AttachmentMatchConfig,
  newAttachmentMatchConfig,
  RequiredAttachmentMatchConfig,
} from "../config/AttachmentMatchConfig"
import { AttachmentContext, MessageContext } from "../Context"
import { BaseProcessor } from "./BaseProcessor"

export class AttachmentProcessor extends BaseProcessor {
  public static processConfigs(
    ctx: MessageContext,
    configs: RequiredAttachmentConfig[],
  ) {
    for (let i = 0; i < configs.length; i++) {
      const config = configs[i]
      config.name = config.name !== "" ? config.name : `attachment-cfg-${i + 1}`
      this.processConfig(ctx, config, i)
    }
  }

  public static matches(
    matchConfig: RequiredAttachmentMatchConfig,
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
  ) {
    if (!attachment.getContentType().match(matchConfig.contentTypeRegex))
      return false
    if (!attachment.getName().match(matchConfig.name)) return false
    if (attachment.getSize() <= matchConfig.largerThan) return false
    if (attachment.getSize() >= matchConfig.smallerThan) return false
    return true
  }

  public static getEffectiveMatchConfig(
    global: AttachmentMatchConfig,
    local: RequiredAttachmentMatchConfig,
  ): RequiredAttachmentMatchConfig {
    return newAttachmentMatchConfig({
      contentTypeRegex: this.effectiveValue(
        global.contentTypeRegex,
        local.contentTypeRegex,
        "",
      ),
      includeAttachments: this.effectiveValue(
        global.includeAttachments,
        local.includeAttachments,
        true,
      ),
      includeInlineImages: this.effectiveValue(
        global.includeInlineImages,
        local.includeInlineImages,
        true,
      ),
      largerThan: this.effectiveValue(global.largerThan, local.largerThan, -1),
      name: this.effectiveValue(global.name, local.name, ""),
      smallerThan: this.effectiveValue(
        global.smallerThan,
        local.smallerThan,
        -1,
      ),
    })
  }

  public static processConfig(
    ctx: MessageContext,
    config: RequiredAttachmentConfig,
    configIndex: number,
  ) {
    ctx.log.info(`Processing of attachment config '${config.name}' started ...`)
    const opts: GoogleAppsScript.Gmail.GmailAttachmentOptions = {}
    if (config.match.includeAttachments !== undefined) {
      opts.includeAttachments = config.match.includeAttachments
    }
    if (config.match.includeInlineImages !== undefined) {
      opts.includeInlineImages = config.match.includeInlineImages
    }
    const attachments = ctx.message.object.getAttachments(opts)
    const effectiveMatchConfig = this.getEffectiveMatchConfig(
      ctx.proc.config.global.attachment.match,
      config.match,
    )
    for (let index = 0; index < attachments.length; index++) {
      const attachment = attachments[index]
      if (!this.matches(effectiveMatchConfig, attachment)) {
        ctx.log.info(
          `Skipping non-matching attachment '${attachment.getName()}'.`,
        )
        continue
      }
      const attachmentContext: AttachmentContext = {
        ...ctx,
        attachment: {
          config: config,
          object: attachment,
          configIndex: configIndex,
          index: index,
        },
      }
      this.processAttachment(attachmentContext)
    }
    ctx.log.info(`Processing of attachment config '${config.name}' finished.`)
  }

  public static processAttachment(ctx: AttachmentContext) {
    const attachment = ctx.attachment.object
    ctx.log.info(
      `Processing of attachment '${attachment.getName()}' started ...`,
    )
    // Execute pre-main actions:
    this.executeActions(
      ctx,
      ProcessingStage.PRE_MAIN,
      ctx.proc.config.global.attachment.actions,
      ctx.attachment.config.actions,
    )

    // Execute main actions:
    this.executeActions(
      ctx,
      ProcessingStage.MAIN,
      ctx.proc.config.global.attachment.actions,
      ctx.attachment.config.actions,
    )

    // Execute post-main actions:
    this.executeActions(
      ctx,
      ProcessingStage.POST_MAIN,
      ctx.attachment.config.actions,
      ctx.proc.config.global.attachment.actions,
    )
    ctx.log.info(`Processing of attachment '${attachment.getName()}' finished.`)
  }
}
