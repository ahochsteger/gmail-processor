import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { ActionConfig } from "./ActionConfig"
import { AttachmentMatchConfig } from "./AttachmentMatchConfig"

/**
 * Represents a config to handle a certain GMail attachment
 */
export class AttachmentConfig {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  @Expose()
  @Type(() => ActionConfig)
  actions: ActionConfig[] = []
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
  match = new AttachmentMatchConfig()
  /**
   * The unique name of the attachment config (will be generated if not set)
   */
  @Expose()
  name? = ""
}

export function jsonToAttachmentConfig(
  json: Record<string, unknown>,
): AttachmentConfig {
  return plainToInstance(AttachmentConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  })
}
