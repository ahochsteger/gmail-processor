import {
  Expose,
  Type,
  instanceToPlain,
  plainToInstance,
} from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { RequiredDeep } from "../utils/UtilityTypes"
import { AttachmentActionConfig } from "./ActionConfig"
import { AttachmentMatchConfig } from "./AttachmentMatchConfig"

/**
 * Represents a config to handle a certain GMail attachment
 */
export class AttachmentConfig {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  @Expose()
  @Type(() => AttachmentActionConfig)
  actions?: AttachmentActionConfig[] = []
  /**
   * The description of the attachment handler config
   */
  @Expose()
  description? = ""
  /**
   * Specifies which attachments match for further processing
   */
  @Expose()
  @Type(() => AttachmentMatchConfig)
  match? = new AttachmentMatchConfig()
  /**
   * The unique name of the attachment config (will be generated if not set)
   */
  @Expose()
  name? = ""
}

export type RequiredAttachmentConfig = RequiredDeep<AttachmentConfig>

export function newAttachmentConfig(
  json: PartialDeep<AttachmentConfig> = {},
): RequiredAttachmentConfig {
  return plainToInstance(AttachmentConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredAttachmentConfig
}

export function attachmentConfigToJson<T = AttachmentConfig>(
  config: T,
  withDefaults = false,
): PartialDeep<AttachmentConfig> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}
