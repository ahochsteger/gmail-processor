import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"
import {
  ThreadActionConfig,
  ThreadContextActionConfigType,
  essentialThreadActionConfig,
} from "./ActionConfig"
import { AttachmentConfig, essentialAttachmentConfig } from "./AttachmentConfig"
import { OrderDirection } from "./CommonConfig"
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
 * Represents a thread field to be ordered by for processing.
 */
export enum ThreadOrderField {
  /**
   * Order by the date of the last message in the thread.
   */
  LAST_MESSAGE_DATE = "lastMessageDate",
  /**
   * Order by the ID of the thread.
   */
  ID = "id",
  /**
   * Order by the subject of the first message in the thread.
   */
  FIRST_MESSAGE_SUBJECT = "firstMessageSubject",
}

/**
 * Represents a config handle a certain GMail thread
 */
export class ThreadConfig {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  @Expose()
  @Type(() => ThreadActionConfig)
  actions?: ThreadContextActionConfigType[] = []
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
  /**
   * The field to order threads by for processing.
   */
  @Expose()
  orderBy?: ThreadOrderField = undefined
  /**
   * The direction to order threads for processing.
   */
  @Expose()
  orderDirection?: OrderDirection = undefined
}

export type RequiredThreadConfig = RequiredDeep<ThreadConfig>

export function newThreadConfig(json: ThreadConfig = {}): RequiredThreadConfig {
  return plainToInstance(ThreadConfig, normalizeThreadConfig(json), {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredThreadConfig
}

export function normalizeThreadConfig(config: ThreadConfig): ThreadConfig {
  config.messages = config.messages ?? []

  // Normalize top-level attachments config:
  if (config.attachments !== undefined && config.attachments.length > 0) {
    config.messages.push({ attachments: config.attachments })
    delete config.attachments
  }

  config.messages = normalizeMessageConfigs(config.messages)
  config.match = config.match ?? newThreadMatchConfig()
  return config
}

export function normalizeThreadConfigs(
  configs: ThreadConfig[],
): ThreadConfig[] {
  for (const config of configs) {
    normalizeThreadConfig(config)
  }
  return configs
}

export function essentialThreadConfig(config: ThreadConfig): ThreadConfig {
  config = essentialObject(config, newThreadConfig(), {
    actions: essentialThreadActionConfig,
    messages: essentialMessageConfig,
    attachments: essentialAttachmentConfig,
    match: essentialThreadMatchConfig,
  })
  return config
}
