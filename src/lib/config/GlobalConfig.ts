import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { RequiredDeep } from "../utils/UtilityTypes"
import { AttachmentConfig } from "./AttachmentConfig"
import { MessageConfig } from "./MessageConfig"
import { ThreadConfig } from "./ThreadConfig"

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
}

export function newGlobalConfig(
  json: PartialDeep<GlobalConfig> = {},
): RequiredDeep<GlobalConfig> {
  return plainToInstance(GlobalConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredDeep<GlobalConfig>
}
