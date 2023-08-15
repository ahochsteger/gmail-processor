import { plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
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
   * Only include attachments larger than the given size in bytes
   */
  largerThan? = -1
  /**
   * A RegEx matching the name of the attachment
   */
  name? = "(.*)"
  /**
   * Only include attachments smaller than the given size in bytes
   */
  smallerThan? = Number.MAX_SAFE_INTEGER
}

export type RequiredAttachmentMatchConfig = RequiredDeep<AttachmentMatchConfig>

export function newAttachmentMatchConfig(
  json: PartialDeep<AttachmentMatchConfig> = {},
): RequiredAttachmentMatchConfig {
  return plainToInstance(AttachmentMatchConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredAttachmentMatchConfig
}

export function essentialAttachmentMatchConfig(
  config: PartialDeep<AttachmentMatchConfig>,
): PartialDeep<AttachmentMatchConfig> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config = essentialObject(config as any, newAttachmentMatchConfig() as any)
  return config
}
