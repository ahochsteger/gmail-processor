import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"
import { ThreadActionConfig, essentialActionConfig } from "./ActionConfig"
import { AttachmentConfig, essentialAttachmentConfig } from "./AttachmentConfig"
import {
  MessageConfig,
  essentialMessageConfig,
  normalizeMessageConfigs,
} from "./MessageConfig"
import {
  ThreadMatchConfig,
  essentialThreadMatchConfig,
  newThreadMatchConfig,
} from "./ThreadMatchConfig"

/**
 * Represents a config handle a certain GMail thread
 */
export class ThreadConfig {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  @Expose()
  @Type(() => ThreadActionConfig)
  actions?: ThreadActionConfig[] = []
  /**
   * The description of the thread handler config
   */
  @Expose()
  description? = ""
  /**
   * The list of handler that define the way nested messages or attachments are processed
   */
  @Expose()
  @Type(() => MessageConfig)
  messages?: MessageConfig[] = []
  /**
   * The list of handler that define the way attachments are processed
   */
  @Expose()
  @Type(() => AttachmentConfig)
  attachments?: AttachmentConfig[] = []
  /**
   * Specifies which threads match for further processing
   */
  @Expose()
  @Type(() => ThreadMatchConfig)
  match? = new ThreadMatchConfig()
  /**
   * The unique name of the thread config (will be generated if not set)
   */
  @Expose()
  name? = ""
}

export type RequiredThreadConfig = RequiredDeep<ThreadConfig>

export function newThreadConfig(
  json: PartialDeep<ThreadConfig> = {},
): RequiredThreadConfig {
  return plainToInstance(ThreadConfig, normalizeThreadConfig(json), {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredThreadConfig
}

export function normalizeThreadConfig(
  config: PartialDeep<ThreadConfig>,
): PartialDeep<ThreadConfig> {
  config.messages = config.messages ?? []

  // Normalize top-level attachments config:
  if (config.attachments !== undefined && config.attachments?.length > 0) {
    config.messages.push({ attachments: config.attachments })
    delete config.attachments
  }

  config.messages = normalizeMessageConfigs(config.messages)
  config.match = config.match || newThreadMatchConfig()
  return config
}

export function normalizeThreadConfigs(
  configs: PartialDeep<ThreadConfig>[],
): PartialDeep<ThreadConfig>[] {
  for (let index = 0; index < configs.length; index++) {
    normalizeThreadConfig(configs[index])
  }
  return configs
}

export function essentialThreadConfig(
  config: PartialDeep<ThreadConfig>,
): PartialDeep<ThreadConfig> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config = essentialObject(config as any, newThreadConfig() as any, {
    actions: essentialActionConfig,
    messages: essentialMessageConfig,
    attachments: essentialAttachmentConfig,
    match: essentialThreadMatchConfig,
  })
  return config
}
