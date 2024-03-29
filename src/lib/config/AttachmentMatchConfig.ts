import { plainToInstance } from "class-transformer"
import "reflect-metadata"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"
/**
 * Represents a config to match a certain GMail attachment
 */
export class AttachmentMatchConfig {
  /**
   * A RegEx matching the content type of the attachment
   */
  contentType? = ".*"
  /**
   * Should regular attachments be included in attachment processing (default: true)
   */
  includeAttachments? = true
  /**
   * Should inline images be included in attachment processing (default: true)
   */
  includeInlineImages? = true
  /**
   * Only include attachments larger than the given size in bytes.
   * Set to `-1` to ignore it.
   */
  largerThan? = -1
  /**
   * A RegEx matching the name of the attachment
   */
  name? = "(.*)"
  /**
   * Only include attachments smaller than the given size in bytes.
   * Set to `-1` to ignore it.
   */
  smallerThan? = -1
}

export type RequiredAttachmentMatchConfig = RequiredDeep<AttachmentMatchConfig>

export function newAttachmentMatchConfig(
  json: AttachmentMatchConfig = {},
): RequiredAttachmentMatchConfig {
  return plainToInstance(AttachmentMatchConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredAttachmentMatchConfig
}

export function essentialAttachmentMatchConfig(
  config: AttachmentMatchConfig,
): AttachmentMatchConfig {
  config = essentialObject(config, newAttachmentMatchConfig())
  return config
}
