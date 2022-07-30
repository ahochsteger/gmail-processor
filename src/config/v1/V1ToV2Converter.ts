import { Config } from "../Config"
import { ActionConfig } from "../ActionConfig"
import { AttachmentConfig } from "../AttachmentConfig"
import { MessageConfig } from "../MessageConfig"
import { ThreadConfig } from "../ThreadConfig"
import { V1Rule } from "./V1Rule"
import { V1Config } from "./V1Config"
import { plainToClass } from "class-transformer"

export class V1ToV2Converter {
  static v1RuleToV2ThreadConfig(rule: V1Rule): ThreadConfig {
    const threadConfig = new ThreadConfig()
    if (rule.archive) {
      threadConfig.actions.push(
        plainToClass(ActionConfig, {
          name: "thread.archive",
        }),
      )
    }
    if (rule.filenameFrom || rule.filenameFromRegexp) {
      const messageConfig = new MessageConfig()
      const attachmentConfig = new AttachmentConfig()
      attachmentConfig.match.name =
        rule.filenameFrom != "" ? rule.filenameFrom : rule.filenameFromRegexp
      attachmentConfig.actions.push(
        plainToClass(ActionConfig, {
          name: "attachment.storeToGDrive",
          args: {
            name: "file.storeToGDrive",
            args: {
              folderType: "path",
              folder: rule.folder,
              filename: rule.filenameTo,
            },
          },
        }),
      )
      messageConfig.handler.push(attachmentConfig)
      threadConfig.handler.push(messageConfig)
    }
    if (rule.newerThan != "") {
      threadConfig.match.newerThan = rule.newerThan
    }
    if (rule.ruleLabel != "") {
      threadConfig.actions.push(
        plainToClass(ActionConfig, {
          name: "thread.addLabel",
          args: {
            label: rule.ruleLabel,
          },
        }),
      )
    }
    if (rule.saveThreadPDF) {
      threadConfig.actions.push(
        plainToClass(ActionConfig, {
          name: "thread.exportAsPdfToGDrive",
          args: {
            location: rule.filenameTo,
          },
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
      config.handler.push(this.v1RuleToV2ThreadConfig(rule))
    }
    return config
  }
}
