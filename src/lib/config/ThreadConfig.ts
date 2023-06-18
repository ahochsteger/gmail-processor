import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { RequiredDeep } from "../utils/UtilityTypes"
import { ThreadActionConfig } from "./ActionConfig"
import { AttachmentConfig } from "./AttachmentConfig"
import { MessageConfig, normalizeMessageConfigs } from "./MessageConfig"
import { ThreadMatchConfig } from "./ThreadMatchConfig"

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
  namePrefix = "",
): RequiredThreadConfig {
  return plainToInstance(
    ThreadConfig,
    normalizeThreadConfig(json, namePrefix),
    {
      exposeDefaultValues: true,
      exposeUnsetFields: false,
    },
  ) as RequiredThreadConfig
}

export function normalizeThreadConfig(
  config: PartialDeep<ThreadConfig>,
  namePrefix = "",
  index?: number,
): PartialDeep<ThreadConfig> {
  config.name =
    config.name || `${namePrefix}thread-cfg${index ? "-" + index : ""}`
  config.messages = config.messages ?? []

  // Normalize top-level attachments config:
  if (config.attachments !== undefined) {
    config.messages.push({ attachments: config.attachments })
    delete config.attachments
  }

  config.messages = normalizeMessageConfigs(config.messages, namePrefix)
  return config
}

export function normalizeThreadConfigs(
  configs: PartialDeep<ThreadConfig>[],
  namePrefix = "",
): PartialDeep<ThreadConfig>[] {
  for (let index = 0; index < configs.length; index++) {
    normalizeThreadConfig(configs[index], namePrefix, index + 1)
  }
  return configs
}
