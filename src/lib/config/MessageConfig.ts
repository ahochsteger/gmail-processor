import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"
import { MessageActionConfig, essentialActionConfig } from "./ActionConfig"
import {
  AttachmentConfig,
  essentialAttachmentConfig,
  normalizeAttachmentConfigs,
} from "./AttachmentConfig"
import {
  MessageMatchConfig,
  essentialMessageMatchConfig,
  newMessageMatchConfig,
} from "./MessageMatchConfig"

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

export function newMessageConfig(
  json: PartialDeep<MessageConfig> = {},
): RequiredMessageConfig {
  return plainToInstance(MessageConfig, normalizeMessageConfig(json), {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredMessageConfig
}

export function normalizeMessageConfig(
  config: PartialDeep<MessageConfig>,
): PartialDeep<MessageConfig> {
  config.attachments = normalizeAttachmentConfigs(config.attachments ?? [])
  config.match = config.match ?? newMessageMatchConfig()
  return config
}

export function normalizeMessageConfigs(
  configs: PartialDeep<MessageConfig>[],
): PartialDeep<MessageConfig>[] {
  for (const config of configs) {
    normalizeMessageConfig(config)
  }
  return configs
}

export function essentialMessageConfig(
  config: PartialDeep<MessageConfig>,
): PartialDeep<MessageConfig> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config = essentialObject(config as any, newMessageConfig() as any, {
    actions: essentialActionConfig,
    attachments: essentialAttachmentConfig,
    match: essentialMessageMatchConfig,
  })
  return config
}
