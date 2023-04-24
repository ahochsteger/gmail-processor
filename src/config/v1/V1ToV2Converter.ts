import { PatternUtil } from "../../utils/PatternUtil"
import { jsonToActionConfig } from "../ActionConfig"
import { AttachmentConfig } from "../AttachmentConfig"
import { Config } from "../Config"
import { ThreadConfig } from "../ThreadConfig"
import { V1Config } from "./V1Config"
import { V1Rule } from "./V1Rule"

export class V1ToV2Converter {
  static v1RuleToV2ThreadConfig(rule: V1Rule): ThreadConfig {
    const threadConfig = new ThreadConfig()
    threadConfig.attachments = []
    const attachmentConfig = new AttachmentConfig()
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
    if (rule.newerThan != "") {
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
    if (rule.saveThreadPDF) {
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

  static v1ConfigToV2Config(v1config: V1Config): Config {
    const config = new Config()
    config.global.match.query = v1config.globalFilter
    config.settings.processedLabel = v1config.processedLabel
    config.settings.sleepTimeThreads = v1config.sleepTime
    config.settings.maxRuntime = v1config.maxRuntime
    config.global.match.newerThan = v1config.newerThan
    config.settings.timezone = v1config.timezone
    for (const rule of v1config.rules) {
      config.threads.push(this.v1RuleToV2ThreadConfig(rule))
    }
    return config
  }
}
