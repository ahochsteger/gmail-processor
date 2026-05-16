import { z } from "zod"
import { essentialObject } from "../utils/ConfigUtils"
import {
  AttachmentActionConfigSchema,
  essentialAttachmentActionConfig,
} from "./ActionConfig"
import {
  AttachmentMatchConfigSchema,
  essentialAttachmentMatchConfig,
} from "./AttachmentMatchConfig"
import { OrderDirection } from "./CommonConfig"

/**
 * Represents an attachment field to be ordered by for processing.
 */
export enum AttachmentOrderField {
  /**
   * Order by the content type of the attachment.
   */
  CONTENT_TYPE = "contentType",
  /**
   * Order by the hash of the attachment.
   */
  HASH = "hash",
  /**
   * Order by the name of the attachment.
   */
  NAME = "name",
}

/**
 * Represents a config to handle a certain GMail attachment
 */
export const AttachmentConfigSchema = z.object({
  /**
   * The list actions to be executed for their respective handler scopes
   */
  actions: z
    .array(AttachmentActionConfigSchema)
    .default([])
    .describe(
      "The list actions to be executed for their respective handler scopes",
    ),
  /**
   * The description of the attachment handler config
   */
  description: z
    .string()
    .default("")
    .describe("The description of the attachment handler config"),
  /**
   * Specifies which attachments match for further processing
   */
  match: AttachmentMatchConfigSchema.default(() =>
    AttachmentMatchConfigSchema.parse({}),
  ).describe("Specifies which attachments match for further processing"),
  /**
   * The unique name of the attachment config (will be generated if not set)
   */
  name: z
    .string()
    .default("")
    .describe(
      "The unique name of the attachment config (will be generated if not set)",
    ),
  /**
   * The field to order attachments by for processing.
   */
  orderBy: z
    .nativeEnum(AttachmentOrderField)
    .optional()
    .describe("The field to order attachments by for processing."),
  /**
   * The direction to order attachments for processing.
   */
  orderDirection: z
    .nativeEnum(OrderDirection)
    .optional()
    .describe("The direction to order attachments for processing."),
})

export type AttachmentConfig = z.input<typeof AttachmentConfigSchema>
export type RequiredAttachmentConfig = z.output<typeof AttachmentConfigSchema>

export function newAttachmentConfig(
  json: AttachmentConfig = {},
): RequiredAttachmentConfig {
  return AttachmentConfigSchema.parse(json)
}

export function essentialAttachmentConfig(
  config: AttachmentConfig,
): AttachmentConfig {
  config = essentialObject(config, newAttachmentConfig(), {
    actions: essentialAttachmentActionConfig,
    match: essentialAttachmentMatchConfig,
  })
  return config
}
