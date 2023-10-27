import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"
import {
  AttachmentConfig,
  essentialAttachmentConfig,
  normalizeAttachmentConfig,
} from "./AttachmentConfig"
import {
  MessageConfig,
  essentialMessageConfig,
  normalizeMessageConfig,
} from "./MessageConfig"
import {
  ThreadConfig,
  essentialThreadConfig,
  normalizeThreadConfig,
} from "./ThreadConfig"

export const DEFAULT_GLOBAL_QUERY_PREFIX =
  "has:attachment -in:trash -in:drafts -in:spam"
export const DEFAULT_GLOBAL_QUERY_NEWER_THAN = "1d"
export const DEFAULT_GLOBAL_QUERY = `${DEFAULT_GLOBAL_QUERY_PREFIX} newer_than:${DEFAULT_GLOBAL_QUERY_NEWER_THAN}`

/**
 * A variable entry available for string substitution (using `${variables.<varName>}`)
 */
export class VariableEntry {
  constructor(
    public key: string,
    public value: string,
  ) {}
}

/**
 * The global configuration defines matching and actions for all threads, messages or attachments.
 */
export class GlobalConfig {
  /**
   * The global attachment config affecting each attachment.
   */
  @Expose()
  @Type(() => AttachmentConfig)
  attachment?: AttachmentConfig = new AttachmentConfig()

  /**
   * The global message config affecting each message.
   */
  @Expose()
  @Type(() => MessageConfig)
  message?: Exclude<MessageConfig, "attachments"> = new MessageConfig()

  /**
   * The list of global thread affecting each thread.
   */
  @Expose()
  @Type(() => ThreadConfig)
  thread?: Exclude<ThreadConfig, "messages"> = new ThreadConfig()

  /**
   * A list of variable entries to be used in substitutions to simplify configurations.
   */
  @Expose()
  @Type(() => VariableEntry)
  variables?: VariableEntry[] = []
}

type RequiredGlobalConfig = RequiredDeep<GlobalConfig>

export function newGlobalConfig(json: GlobalConfig = {}): RequiredGlobalConfig {
  return plainToInstance(GlobalConfig, normalizeGlobalConfig(json), {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredGlobalConfig
}

export function normalizeGlobalConfig(config: GlobalConfig): GlobalConfig {
  config.thread = normalizeThreadConfig(config.thread ?? {})
  config.message = normalizeMessageConfig(config.message ?? {})
  config.attachment = normalizeAttachmentConfig(config.attachment ?? {})
  return config
}

export function essentialGlobalConfig(config: GlobalConfig): GlobalConfig {
  config = essentialObject(config, newGlobalConfig(), {
    attachment: essentialAttachmentConfig,
    message: essentialMessageConfig,
    thread: essentialThreadConfig,
  })
  return config
}
