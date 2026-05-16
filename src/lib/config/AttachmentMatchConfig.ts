import { z } from "zod"
import { essentialObject } from "../utils/ConfigUtils"

/**
 * Represents a config to match a certain GMail attachment
 */
export const AttachmentMatchConfigSchema = z.object({
  /**
   * A RegEx matching the content type of the attachment
   */
  contentType: z
    .string()
    .default(".*")
    .describe("A RegEx matching the content type of the attachment"),
  /**
   * Should regular attachments be included in attachment processing (default: true)
   */
  includeAttachments: z
    .boolean()
    .default(true)
    .describe(
      "Should regular attachments be included in attachment processing (default: true)",
    ),
  /**
   * Should inline images be included in attachment processing (default: true)
   */
  includeInlineImages: z
    .boolean()
    .default(true)
    .describe(
      "Should inline images be included in attachment processing (default: true)",
    ),
  /**
   * Only include attachments larger than the given size in bytes.
   * Set to `-1` to ignore it.
   */
  largerThan: z
    .number()
    .default(-1)
    .describe(
      "Only include attachments larger than the given size in bytes. Set to `-1` to ignore it.",
    ),
  /**
   * A RegEx matching the name of the attachment
   */
  name: z
    .string()
    .default("(.*)")
    .describe("A RegEx matching the name of the attachment"),
  /**
   * Only include attachments smaller than the given size in bytes.
   * Set to `-1` to ignore it.
   */
  smallerThan: z
    .number()
    .default(-1)
    .describe(
      "Only include attachments smaller than the given size in bytes. Set to `-1` to ignore it.",
    ),
})

export type AttachmentMatchConfig = z.input<typeof AttachmentMatchConfigSchema>
export type RequiredAttachmentMatchConfig = z.output<
  typeof AttachmentMatchConfigSchema
>

export function newAttachmentMatchConfig(
  json: AttachmentMatchConfig = {},
): RequiredAttachmentMatchConfig {
  return AttachmentMatchConfigSchema.parse(json)
}

export function essentialAttachmentMatchConfig(
  config: AttachmentMatchConfig,
): AttachmentMatchConfig {
  // NOTE: essentialObject works on plain objects as well
  config = essentialObject(config, newAttachmentMatchConfig())
  return config
}
