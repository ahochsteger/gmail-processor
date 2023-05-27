import { ProcessingStage } from "../config/ActionConfig"
import { RequiredAttachmentConfig } from "../config/AttachmentConfig"
import { AttachmentContext, MessageContext } from "../Context"
import { BaseProcessor } from "./BaseProcessor"

export class AttachmentProcessor extends BaseProcessor {
  public static processAttachmentConfigs(
    ctx: MessageContext,
    attachmentConfigs: RequiredAttachmentConfig[],
  ) {
    for (let i = 0; i < attachmentConfigs.length; i++) {
      const attachmentConfig = attachmentConfigs[i]
      attachmentConfig.name =
        attachmentConfig.name !== ""
          ? attachmentConfig.name
          : `attachment-cfg-${i + 1}`
      this.processAttachmentConfig(ctx, attachmentConfig, i)
    }
  }

  public static processAttachmentConfig(
    ctx: MessageContext,
    attachmentConfig: RequiredAttachmentConfig,
    attachmentConfigIndex: number,
  ) {
    ctx.log.info(
      `Processing of attachment config '${attachmentConfig.name}' started ...`,
    )
    const attachments = ctx.message.object.getAttachments()
    for (
      let attachmentIndex = 0;
      attachmentIndex < attachments.length;
      attachmentIndex++
    ) {
      const attachment = attachments[attachmentIndex]
      const attachmentContext: AttachmentContext = {
        ...ctx,
        attachment: {
          config: attachmentConfig,
          object: attachment,
          configIndex: attachmentConfigIndex,
          index: attachmentIndex,
        },
      }
      this.processAttachment(attachmentContext)
    }
    ctx.log.info(
      `Processing of attachment config '${attachmentConfig.name}' finished.`,
    )
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
