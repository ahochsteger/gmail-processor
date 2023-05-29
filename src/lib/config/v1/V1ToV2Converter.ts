import { PartialDeep } from "type-fest"
import { ConflictStrategy } from "../../adapter/GDriveAdapter"
import { PatternUtil } from "../../utils/PatternUtil"
import {
  newAttachmentActionConfig,
  newMessageActionConfig,
  newThreadActionConfig,
} from "../ActionConfig"
import { newAttachmentConfig } from "../AttachmentConfig"
import { RequiredConfig, newConfig } from "../Config"
import { newMessageConfig } from "../MessageConfig"
import { RequiredThreadConfig, newThreadConfig } from "../ThreadConfig"
import { V1Config, newV1Config } from "./V1Config"
import { V1Rule } from "./V1Rule"

export class V1ToV2Converter {
  static getLocationFromRule(rule: V1Rule, defaultFilename: string): string {
    let filename
    if (rule.filenameFromRegexp) {
      filename = "${attachment.name.match.1}"
    } else if (rule.filenameTo) {
      filename = PatternUtil.convertFromV1Pattern(rule.filenameTo)
    } else {
      filename = defaultFilename
    }
    let folder = ""
    if (rule.parentFolderId) {
      folder = `\${folderId:${rule.parentFolderId}}/`
    }
    folder += PatternUtil.convertFromV1Pattern(rule.folder)
    return `${folder}/${filename}`
  }

  static v1RuleToV2ThreadConfig(rule: V1Rule): RequiredThreadConfig {
    const threadConfig = newThreadConfig()
    threadConfig.attachments = []
    threadConfig.messages = []
    const attachmentConfig = newAttachmentConfig()
    const messageConfig = newMessageConfig()

    // Old processing logic:
    // var gSearchExp  = config.globalFilter + " " + rule.filter + " -label:" + config.processedLabel;
    if (rule.filter) {
      threadConfig.match.query = rule.filter
    }
    // Old processing logic:
    // if (newerThan != "") {
    //   gSearchExp += " newer_than:" + config.newerThan;
    // }
    if (rule.newerThan && rule.newerThan != "") {
      threadConfig.match.newerThan = rule.newerThan
    }
    // Old processing logic:
    // iterate threads:
    // if (rule.saveMessagePDF) {
    //   processMessageToPdf(message, rule, config);
    if (rule.saveMessagePDF) {
      messageConfig.actions.push(
        newMessageActionConfig({
          name: "message.storeAsPdfToGDrive",
          args: {
            location: this.getLocationFromRule(rule, "${message.subject}.pdf"),
            skipHeader: rule.skipPDFHeader === true,
          },
        }),
      )
      threadConfig.messages.push(messageConfig)
    } else {
      // Old processing logic:
      // } else {
      //   processMessage(message, rule, config);

      //     if (rule.filenameFromRegexp) {
      //       var re = new RegExp(rule.filenameFromRegexp);
      //       match = (attachment.getName()).match(re);
      //     }
      //     if (!match) {
      //       Logger.log("INFO:           Rejecting file '" + attachment.getName() + " not matching" + rule.filenameFromRegexp);
      //       continue;
      //     }
      // Handle filename filtering:
      if (rule.filenameFromRegexp) {
        attachmentConfig.match.name = rule.filenameFromRegexp
      }
      // Old processing logic:
      //     var folderName = Utilities.formatDate(messageDate, config.timezone, rule.folder.replace('%s', message.getSubject()));
      //     folderName = folderName.replace(':', '');
      //     Logger.log("Saving to folder" + folderName);
      //     var folder = getOrCreateFolder(folderName, rule.parentFolderId);
      //     var file = folder.createFile(attachment);
      //     var original_attachment_name = file.getName();
      //     var new_filename = rule.filenameTo.replace('%s',message.getSubject()).replace("%d", String(rule_counter++)).replace('%o', original_attachment_name)
      //     if (rule.filenameFrom && rule.filenameTo && rule.filenameFrom == file.getName()) {
      //       var final_attachment_name = Utilities.formatDate(messageDate, config.timezone, new_filename);
      //       Logger.log("INFO:           Renaming matched file '" + file.getName() + "' -> '" + final_attachment_name + "'");
      //       file.setName(final_attachment_name);
      //     }
      if (rule.filenameFrom && rule.filenameTo) {
        attachmentConfig.match.name = String(rule.filenameFrom).replace(
          /[\\^$*+?.()|[\]{}]/g,
          "\\$&",
        ) // TODO: Validate this regex!
        // Old processing logic:
        //     else if (rule.filenameTo) {
        //       var final_attachment_name = Utilities.formatDate(messageDate, config.timezone, new_filename);
        //       Logger.log("INFO:           Renaming '" + file.getName() + "' -> '" + final_attachment_name + "'");
        //       file.setName(final_attachment_name);
        //     }
      }
      // Old processing logic:
      //     file.setDescription("Mail title: " + message.getSubject() + "\nMail date: " + message.getDate() + "\nMail link: https://mail.google.com/mail/u/0/#inbox/" + message.getId());
      attachmentConfig.actions.push(
        newAttachmentActionConfig({
          name: "attachment.storeToGDrive",
          args: {
            conflictStrategy: ConflictStrategy.KEEP,
            description:
              "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
            location: this.getLocationFromRule(rule, "${attachment.name}"),
          },
        }),
      )
      threadConfig.attachments.push(attachmentConfig)
    }
    // Old processing logic:
    // }
    // if (doPDF) { // Generate a PDF document of a thread:
    //   processThreadToPdf(thread, rule, config);
    // }
    if (rule.saveThreadPDF) {
      threadConfig.actions.push(
        newThreadActionConfig({
          name: "thread.storeAsPdfToGDrive",
          args: {
            location: this.getLocationFromRule(
              rule,
              "${thread.firstMessageSubject}.pdf",
            ),
          },
        }),
      )
    }
    // Old processing logic:
    // if(rule.ruleLabel) {
    //   thread.addLabel(getOrCreateLabel(rule.ruleLabel));
    // }
    // thread.addLabel(label);
    if (rule.ruleLabel != "") {
      threadConfig.actions.push(
        newThreadActionConfig({
          name: "thread.addLabel",
          args: {
            label: rule.ruleLabel,
          },
        }),
      )
    }
    // Old processing logic:
    // if (doArchive) { // Archive a thread if required
    //   Logger.log("INFO:     Archiving thread '" + thread.getFirstMessageSubject() + "' ...");
    //   thread.moveToArchive();
    // }
    if (rule.archive) {
      threadConfig.actions.push(
        newThreadActionConfig({
          name: "thread.moveToArchive",
        }),
      )
    }
    return threadConfig
  }

  static v1ConfigToV2Config(
    partialV1Config: PartialDeep<V1Config>,
  ): RequiredConfig {
    const v1Config = newV1Config(partialV1Config)
    const config = newConfig()
    // Old processing logic:
    // if (config.globalFilter===undefined) {
    //   config.globalFilter = "has:attachment -in:trash -in:drafts -in:spam";
    // }
    config.global.thread.match.query =
      v1Config.globalFilter || "has:attachment -in:trash -in:drafts -in:spam"
    // Old processing logic:
    // var gSearchExp  = config.globalFilter + " " + rule.filter + " -label:" + config.processedLabel;
    config.settings.markProcessedLabel = v1Config.processedLabel
    config.settings.sleepTimeThreads = v1Config.sleepTime
    config.settings.maxRuntime = v1Config.maxRuntime
    config.global.thread.match.newerThan = v1Config.newerThan
    config.settings.timezone = v1Config.timezone
    v1Config.rules.forEach((rule) => {
      config.threads.push(this.v1RuleToV2ThreadConfig(rule))
    })
    return config
  }
}
