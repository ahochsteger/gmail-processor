import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { RequiredDeep } from "../utils/UtilityTypes"
import { AttachmentConfig, normalizeAttachmentConfig } from "./AttachmentConfig"
import { MessageConfig, normalizeMessageConfig } from "./MessageConfig"
import { ThreadConfig, normalizeThreadConfig } from "./ThreadConfig"

/**
 * A variable entry available for substitution (using ${variables.<varName>})
 */
class VariableEntry {
  constructor(public key: string, public value: string) {}
}

/**
 * The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.
 */
export class GlobalConfig {
  /**
   * The global attachment config affecting each attachment
   */
  @Expose()
  @Type(() => AttachmentConfig)
  attachment?: AttachmentConfig = new AttachmentConfig()
  /**
   * The global message config affecting each message
   */
  @Expose()
  @Type(() => MessageConfig)
  message?: Exclude<MessageConfig, "attachments"> = new MessageConfig()
  /**
   * The list of global thread affecting each thread
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

export function newGlobalConfig(
  json: PartialDeep<GlobalConfig> = {},
): RequiredDeep<GlobalConfig> {
  return plainToInstance(GlobalConfig, normalizeGlobalConfig(json), {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredDeep<GlobalConfig>
}

function normalizeGlobalConfig(
  config: PartialDeep<GlobalConfig>,
): PartialDeep<GlobalConfig> {
  config.thread = normalizeThreadConfig(
    (config.thread ?? {}) as PartialDeep<ThreadConfig>,
    "global-",
  )
  config.message = normalizeMessageConfig(
    (config.message ?? {}) as PartialDeep<MessageConfig>,
    "global-",
  )
  config.attachment = normalizeAttachmentConfig(
    (config.attachment ?? {}) as PartialDeep<AttachmentConfig>,
    "global-",
  )
  return config
}
