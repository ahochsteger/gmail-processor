import { z } from "zod"
import { essentialObject } from "../utils/ConfigUtils"
import {
  MessageActionConfigSchema,
  essentialMessageActionConfig,
} from "./ActionConfig"
import {
  AttachmentConfigSchema,
  essentialAttachmentConfig,
} from "./AttachmentConfig"
import { OrderDirection } from "./CommonConfig"
import {
  MessageMatchConfigSchema,
  essentialMessageMatchConfig,
} from "./MessageMatchConfig"

/**
 * Represents a message field to be ordered by for processing.
 */
export enum MessageOrderField {
  /**
   * Order by the date of the message.
   */
  DATE = "date",
  /**
   * Order by the sender of the message.
   */
  FROM = "from",
  /**
   * Order by the ID of the message.
   */
  ID = "id",
  /**
   * Order by the subject of the message.
   */
  SUBJECT = "subject",
}

/**
 * Represents a config to handle a certain GMail message
 */
export const MessageConfigSchema = z.object({
  /**
   * The list actions to be executed for their respective handler scopes
   */
  actions: z
    .array(MessageActionConfigSchema)
    .default([])
    .describe(
      "The list actions to be executed for their respective handler scopes",
    ),
  /**
   * The description of the message handler config
   */
  description: z
    .string()
    .default("")
    .describe("The description of the message handler config"),
  /**
   * The list of handler that define the way attachments are processed
   */
  attachments: z
    .array(AttachmentConfigSchema)
    .default([])
    .describe(
      "The list of handler that define the way attachments are processed",
    ),
  /**
   * Specifies which attachments match for further processing
   */
  match: MessageMatchConfigSchema.default(() =>
    MessageMatchConfigSchema.parse({}),
  ).describe("Specifies which attachments match for further processing"),
  /**
   * The unique name of the message config (will be generated if not set)
   */
  name: z
    .string()
    .default("")
    .describe(
      "The unique name of the message config (will be generated if not set)",
    ),
  /**
   * The field to order messages by for processing.
   */
  orderBy: z
    .nativeEnum(MessageOrderField)
    .optional()
    .describe("The field to order messages by for processing."),
  /**
   * The direction to order messages for processing.
   */
  orderDirection: z
    .nativeEnum(OrderDirection)
    .optional()
    .describe("The direction to order messages for processing."),
})

export type MessageConfig = z.input<typeof MessageConfigSchema>
export type RequiredMessageConfig = z.output<typeof MessageConfigSchema>

export function newMessageConfig(
  json: MessageConfig = {},
): RequiredMessageConfig {
  return MessageConfigSchema.parse(json)
}

export function essentialMessageConfig(config: MessageConfig): MessageConfig {
  config = essentialObject(config, newMessageConfig(), {
    actions: essentialMessageActionConfig,
    attachments: essentialAttachmentConfig,
    match: essentialMessageMatchConfig,
  })
  return config
}
