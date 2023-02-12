import { AttachmentConfig } from "../config/AttachmentConfig"
import { AttachmentContext } from "../context/AttachmentContext"
import { MessageContext } from "../context/MessageContext"
import { PatternUtil } from "../utils/PatternUtil"
import { BaseProcessor } from "./BaseProcessor"

export class AttachmentProcessor extends BaseProcessor {
  constructor(public messageContext: MessageContext) {
    super()
  }

  public processAttachmentConfigs(attachmentConfigs: AttachmentConfig[]) {
    for (let i = 0; i < attachmentConfigs.length; i++) {
      const attachmentConfig = attachmentConfigs[i]
      attachmentConfig.name =
        attachmentConfig.name !== ""
          ? attachmentConfig.name
          : `attachment-cfg-${i + 1}`
      this.processAttachmentConfig(attachmentConfig)
    }
  }

  public processAttachmentConfig(attachmentConfig: AttachmentConfig) {
    console.info(
      `          Processing of attachment config '${attachmentConfig.name}' started ...`,
    )
    for (const attachment of this.messageContext.message.getAttachments()) {
      const attachmentContext = new AttachmentContext(
        this.messageContext,
        attachmentConfig,
        attachment,
      )
      this.processAttachment(attachmentContext)
    }
    console.info(
      `          Processing of attachment config '${attachmentConfig.name}' finished.`,
    )
  }

  public processAttachment(attachmentContext: AttachmentContext) {
    const attachment = attachmentContext.attachment
    console.info(
      `            Processing of attachment '${attachment.getName()}' started ...`,
    )
    // TODO: Check, if this.processingContext would be better here!
    // var match = true;
    // if (rule.filenameFromRegexp) {
    // var re = new RegExp(rule.filenameFromRegexp);
    //   match = (attachment.getName()).match(re);
    // }
    // if (!match) {
    //   Logger.log("INFO:           Rejecting file '" + attachment.getName() + " not matching" + rule.filenameFromRegexp);
    //   continue;
    // }

    const dataMap =
      PatternUtil.buildSubstitutionMapFromAttachmentContext(attachmentContext)
    // TODO: Implement attachment handling including dry-run
    console.log("Dumping dataMap:")
    console.log(dataMap)
    console.info(
      `            Processing of attachment '${attachment.getName()}' finished.`,
    )
  }

  // public processAttachmentRule_old(
  //     attachmentContext: AttachmentContext,
  // ) {
  //     const thread: GoogleAppsScript.Gmail.GmailThread,
  //     const msgIdx: number: messageC.index
  //     const message = thread.getMessages()[msgIdx]
  //     console.info("        Processing attachment rule: "
  //         + attachmentRule.getSubject() + " (" + message.getId() + ")")
  //     for (let attIdx = 0; attIdx < message.getAttachments().length; attIdx++) {
  //         // TODO: Add support for attachment rules
  //         const dataMap = PatternUtil.buildSubstitutionMap(thread, msgIdx, attIdx, attachmentRule)
  //         // buildSubstitutionMap(
  //         //     thread: GoogleAppsScript.Gmail.GmailThread, msgIdx: number, attIdx: number,
  //         //     rule: any, attRuleIdx: number)
  //         if (dataMap != null) {
  //             const location = PatternUtil.evaluatePattern(attachmentRule.location, dataMap, this.config.timezone)
  //             const conflictStrategy = attachmentRule.conflictStrategy ? attachmentRule.conflictStrategy : "create"
  //             const description = evaluatePattern(
  //                 "Mail title: ${message.subject}\n" +
  //                 "Mail date: ${message.date:dateformat:yyyy-mm-dd HH:MM:ss}\n" +
  //                 "Mail link: ${thread.permalink}", data, this.config.timezone)
  //             // TODO: Replace with GDriveActions.storeAttachment()
  //             storeAttachment(message.attachments[attIdx], description, location, conflictStrategy)
  //         }
  //     }
  // }
}
