import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"
import {
  MessageActionConfig,
  MessageContextActionConfigType,
  essentialMessageActionConfig,
} from "./ActionConfig"
import {
  AttachmentConfig,
  essentialAttachmentConfig,
  normalizeAttachmentConfigs,
} from "./AttachmentConfig"
import { OrderDirection } from "./CommonConfig"
import {
  MessageMatchConfig,
  essentialMessageMatchConfig,
  newMessageMatchConfig,
} from "./MessageMatchConfig"

/**
 * Represents a message field to be ordered by for processing.
 */
export enum MessageOrderField {
  /**
   * Order by the date of the message.
   */
  DATE = "date",
  /**
   * Order by the sender of the message.
   */
  FROM = "from",
  /**
   * Order by the ID of the message.
   */
  ID = "id",
  /**
   * Order by the subject of the message.
   */
  SUBJECT = "subject",
}

/**
 * Represents a config to handle a certain GMail message
 */
export class MessageConfig {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  @Expose()
  @Type(() => MessageActionConfig)
  actions?: MessageContextActionConfigType[] = []
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
  /**
   * The field to order messages by for processing.
   */
  @Expose()
  orderBy?: MessageOrderField = undefined
  /**
   * The direction to order messages for processing.
   */
  @Expose()
  orderDirection?: OrderDirection = undefined
}

export type RequiredMessageConfig = RequiredDeep<MessageConfig>

export function newMessageConfig(
  json: MessageConfig = {},
): RequiredMessageConfig {
  return plainToInstance(MessageConfig, normalizeMessageConfig(json), {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredMessageConfig
}

export function normalizeMessageConfig(config: MessageConfig): MessageConfig {
  config.attachments = normalizeAttachmentConfigs(config.attachments ?? [])
  config.match = newMessageMatchConfig(config.match)
  return config
}

export function normalizeMessageConfigs(
  configs: MessageConfig[],
): MessageConfig[] {
  for (const config of configs) {
    normalizeMessageConfig(config)
  }
  return configs
}

export function essentialMessageConfig(config: MessageConfig): MessageConfig {
  config = essentialObject(config, newMessageConfig(), {
    actions: essentialMessageActionConfig,
    attachments: essentialAttachmentConfig,
    match: essentialMessageMatchConfig,
  })
  return config
}
