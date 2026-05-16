import { z } from "zod"
import { essentialObject } from "../utils/ConfigUtils"
import {
  ThreadActionConfigSchema,
  essentialThreadActionConfig,
} from "./ActionConfig"
import {
  AttachmentConfigSchema,
  essentialAttachmentConfig,
} from "./AttachmentConfig"
import { OrderDirection } from "./CommonConfig"
import { MessageConfigSchema, essentialMessageConfig } from "./MessageConfig"
import {
  ThreadMatchConfigSchema,
  essentialThreadMatchConfig,
} from "./ThreadMatchConfig"

/**
 * Represents a thread field to be ordered by for processing.
 */
export enum ThreadOrderField {
  /**
   * Order by the date of the last message in the thread.
   */
  LAST_MESSAGE_DATE = "lastMessageDate",
  /**
   * Order by the ID of the thread.
   */
  ID = "id",
  /**
   * Order by the subject of the first message in the thread.
   */
  FIRST_MESSAGE_SUBJECT = "firstMessageSubject",
}

/**
 * Represents a config handle a certain GMail thread
 */
export const ThreadConfigSchema = z.object({
  /**
   * The list actions to be executed for their respective handler scopes
   */
  actions: z
    .array(ThreadActionConfigSchema)
    .default([])
    .describe(
      "The list actions to be executed for their respective handler scopes",
    ),
  /**
   * The description of the thread handler config
   */
  description: z
    .string()
    .default("")
    .describe("The description of the thread handler config"),
  /**
   * The list of handler that define the way nested messages or attachments are processed
   */
  messages: z
    .array(MessageConfigSchema)
    .default([])
    .describe(
      "The list of handler that define the way nested messages or attachments are processed",
    ),
  /**
   * The list of handler that define the way attachments are processed
   * @deprecated Use `messages.attachments` instead.
   */
  attachments: z
    .array(AttachmentConfigSchema)
    .optional()
    .describe(
      "The list of handler that define the way attachments are processed",
    ),
  /**
   * Specifies which threads match for further processing
   */
  match: ThreadMatchConfigSchema.default(() =>
    ThreadMatchConfigSchema.parse({}),
  ).describe("Specifies which threads match for further processing"),
  /**
   * The unique name of the thread config (will be generated if not set)
   */
  name: z
    .string()
    .default("")
    .describe(
      "The unique name of the thread config (will be generated if not set)",
    ),
  /**
   * The field to order threads by for processing.
   */
  orderBy: z
    .nativeEnum(ThreadOrderField)
    .optional()
    .describe("The field to order threads by for processing."),
  /**
   * The direction to order threads for processing.
   */
  orderDirection: z
    .nativeEnum(OrderDirection)
    .optional()
    .describe("The direction to order threads for processing."),
})

export type ThreadConfig = z.input<typeof ThreadConfigSchema>
export type RequiredThreadConfig = z.output<typeof ThreadConfigSchema>

export function newThreadConfig(json: ThreadConfig = {}): RequiredThreadConfig {
  return ThreadConfigSchema.parse(normalizeThreadConfig(json))
}

export function normalizeThreadConfig(config: ThreadConfig): ThreadConfig {
  config.messages = config.messages ?? []

  // Normalize top-level attachments config:
  if (config.attachments !== undefined && config.attachments.length > 0) {
    config.messages.push({ attachments: config.attachments })
    delete config.attachments
  }

  return config
}

export function essentialThreadConfig(config: ThreadConfig): ThreadConfig {
  config = essentialObject(config, newThreadConfig(), {
    actions: essentialThreadActionConfig,
    messages: essentialMessageConfig,
    attachments: essentialAttachmentConfig,
    match: essentialThreadMatchConfig,
  })
  return config
}
