import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/Utility.types"
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

/**
 * A variable entry available for string substitution (using `${variables.<varName>}`)
 */
export class VariableEntry {
  /**
   * The type of the variable.
   * 'const' for a static value (default).
   * 'property' for fetching from GAS script properties.
   */
  @Expose()
  type?: "const" | "property" = "const"

  /**
   * The name of the variable.
   */
  @Expose()
  key: string = ""

  /**
   * The value of the variable. If type is 'property', this is the name of the script property to fetch.
   */
  @Expose()
  value: string = ""
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
