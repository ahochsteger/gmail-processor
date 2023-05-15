import { PatternUtil } from "../../utils/PatternUtil"
import { jsonToActionConfig } from "../ActionConfig"
import { newAttachmentConfig } from "../AttachmentConfig"
import { Config, jsonToConfig } from "../Config"
import { RequiredThreadConfig, newThreadConfig } from "../ThreadConfig"
import { V1Config } from "./V1Config"
import { V1Rule } from "./V1Rule"

export class V1ToV2Converter {
  static v1RuleToV2ThreadConfig(rule: V1Rule): RequiredThreadConfig {
    const threadConfig = newThreadConfig()
    threadConfig.attachments = []
    const attachmentConfig = newAttachmentConfig()
    // Handle filename filtering:
    if (rule.filenameFrom) {
      attachmentConfig.match.name = String(rule.filenameFrom).replace(
        /[\\^$*+?.()|[\]{}]/g,
        "\\$&",
      )
    } else if (rule.filenameFromRegexp) {
      attachmentConfig.match.name = rule.filenameFromRegexp
    }
    attachmentConfig.actions.push(
      jsonToActionConfig({
        name: "file.storeToGDrive",
        args: {
          folderType: "path",
          folder: PatternUtil.convertFromV1Pattern(rule.folder),
          filename: rule.filenameTo
            ? rule.filenameTo
            : "${attachment.name.match.1}",
        },
      }),
    )
    threadConfig.attachments.push(attachmentConfig)
    if (rule.newerThan && rule.newerThan != "") {
      threadConfig.match.newerThan = rule.newerThan
    }
    if (rule.ruleLabel != "") {
      threadConfig.actions.push(
        jsonToActionConfig({
          name: "thread.addLabel",
          args: {
            label: rule.ruleLabel,
          },
        }),
      )
    }
    if (rule.saveThreadPDF && rule.filenameTo) {
      threadConfig.actions.push(
        jsonToActionConfig({
          name: "thread.exportAsPdfToGDrive",
          args: {
            location: PatternUtil.convertFromV1Pattern(rule.filenameTo),
          },
        }),
      )
    }
    if (rule.archive) {
      threadConfig.actions.push(
        jsonToActionConfig({
          name: "thread.archive",
        }),
      )
    }
    return threadConfig
  }

  static v1ConfigToV2Config(v1Config: V1Config): Config {
    const config = jsonToConfig({})
    config.global.match.query =
      v1Config.globalFilter || "has:attachment -in:trash -in:drafts -in:spam"
    config.settings.processedLabel = v1Config.processedLabel
    config.settings.sleepTimeThreads = v1Config.sleepTime
    config.settings.maxRuntime = v1Config.maxRuntime
    config.global.match.newerThan = v1Config.newerThan
    config.settings.timezone = v1Config.timezone
    v1Config.rules.forEach((rule) => {
      config.threads.push(this.v1RuleToV2ThreadConfig(rule))
    })
    return config
  }
}
