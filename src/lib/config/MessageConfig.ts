import {
  Expose,
  Type,
  instanceToPlain,
  plainToInstance,
} from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { RequiredDeep } from "../utils/UtilityTypes"
import { MessageActionConfig } from "./ActionConfig"
import {
  AttachmentConfig,
  normalizeAttachmentConfigs,
} from "./AttachmentConfig"
import { MessageMatchConfig } from "./MessageMatchConfig"

/**
 * Represents a config to handle a certain GMail message
 */
export class MessageConfig {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  @Expose()
  @Type(() => MessageActionConfig)
  actions?: MessageActionConfig[] = []
  /**
   * The description of the message handler config
   */
  @Expose()
  description? = ""
  /**
   * The list of handler that define the way attachments are processed
   */
  @Expose()
  @Type(() => AttachmentConfig)
  attachments?: AttachmentConfig[] = []
  /**
   * Specifies which attachments match for further processing
   */
  @Expose()
  @Type(() => MessageMatchConfig)
  match? = new MessageMatchConfig()
  /**
   * The unique name of the message config (will be generated if not set)
   */
  @Expose()
  name? = ""
}

export type RequiredMessageConfig = RequiredDeep<MessageConfig>

export function messageConfigToJson<T = MessageConfig>(
  config: T,
  withDefaults = false,
): PartialDeep<MessageConfig> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}

export function newMessageConfig(
  json: PartialDeep<MessageConfig> = {},
  namePrefix = "",
): RequiredMessageConfig {
  return plainToInstance(
    MessageConfig,
    normalizeMessageConfig(json, namePrefix),
    {
      exposeDefaultValues: true,
      exposeUnsetFields: false,
    },
  ) as RequiredMessageConfig
}

export function normalizeMessageConfig(
  config: PartialDeep<MessageConfig>,
  namePrefix = "",
  index?: number,
): PartialDeep<MessageConfig> {
  config.name = config.name
    ? config.name
    : `${namePrefix}message-cfg-${index ? "-" + index : ""}`
  if (!config.attachments) {
    config.attachments = []
  }
  normalizeAttachmentConfigs(config.attachments, namePrefix)
  return config
}
export function normalizeMessageConfigs(
  configs: PartialDeep<MessageConfig>[],
  namePrefix = "",
): PartialDeep<MessageConfig>[] {
  for (let index = 0; index < configs.length; index++) {
    normalizeMessageConfig(configs[index], namePrefix, index)
  }
  return configs
}
