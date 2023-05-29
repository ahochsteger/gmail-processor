import { ProcessingStage } from "../config/ActionConfig"
import { RequiredAttachmentConfig } from "../config/AttachmentConfig"
import {
  AttachmentMatchConfig,
  newAttachmentMatchConfig,
  RequiredAttachmentMatchConfig,
} from "../config/AttachmentMatchConfig"
import {
  AttachmentContext,
  MessageContext,
  newProcessingResult,
  ProcessingResult,
} from "../Context"
import { BaseProcessor } from "./BaseProcessor"

export class AttachmentProcessor extends BaseProcessor {
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

  public static buildMatchConfig(
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

  public static processConfigs(
    ctx: MessageContext,
    configs: RequiredAttachmentConfig[],
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    for (let configIndex = 0; configIndex < configs.length; configIndex++) {
      const config = configs[configIndex]
      config.name =
        config.name !== "" ? config.name : `attachment-cfg-${configIndex}`
      ctx.log.info(
        `Processing of attachment config '${config.name}' started ...`,
      )
      const opts: GoogleAppsScript.Gmail.GmailAttachmentOptions = {}
      if (config.match.includeAttachments !== undefined) {
        opts.includeAttachments = config.match.includeAttachments
      }
      if (config.match.includeInlineImages !== undefined) {
        opts.includeInlineImages = config.match.includeInlineImages
      }
      const attachments = ctx.message.object.getAttachments(opts)
      const matchConfig = this.buildMatchConfig(
        ctx.proc.config.global.attachment.match,
        config.match,
      )
      for (let index = 0; index < attachments.length; index++) {
        const attachment = attachments[index]
        if (!this.matches(matchConfig, attachment)) {
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
        result = this.processEntity(attachmentContext, result)
      }
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
      `Processing of attachment '${attachment.getName()}' started ...`,
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
    ctx.log.info(`Processing of attachment '${attachment.getName()}' finished.`)
    return result
  }
}
