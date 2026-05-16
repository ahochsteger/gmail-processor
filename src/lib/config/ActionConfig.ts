import { z } from "zod"
import { essentialObject } from "../utils/ConfigUtils"
import { ProcessingStage } from "./ActionConfigTypes"

export { ConflictStrategy, ProcessingStage } from "./ActionConfigTypes"
export type {
  ActionBaseConfig,
  AttachmentActionConfigType,
  AttachmentContextActionConfigType,
  AttachmentExtractTextArgs,
  GlobalActionConfigType,
  GlobalActionLoggingBase,
  MessageActionConfigType,
  MessageActionExportArgs,
  MessageActionForwardArgs,
  MessageActionStoreFromUrlArgs,
  MessageActionStorePDFArgs,
  MessageContextActionConfigType,
  StoreActionBaseArgs,
  StoreDecryptedPdfActionArgs,
  ThreadActionArgsStorePDF,
  ThreadActionConfigType,
  ThreadActionExportArgs,
  ThreadActionLabelArgs,
  ThreadContextActionConfigType,
} from "./ActionConfigTypes"

export const ActionConfigSchema = z.object({
  /**
   * The arguments for a certain action
   */
  args: z.any().default({}).describe("The arguments for a certain action"),

  /**
   * The description for the action
   */
  description: z
    .string()
    .default("")
    .describe("The description for the action"),

  /**
   * The name of the action to be executed
   */
  name: z.string().min(1).describe("The name of the action to be executed"),

  /**
   * The processing stage in which the action should run (during main processing stage or pre-main/post-main)
   */
  processingStage: z
    .nativeEnum(ProcessingStage)
    .default(ProcessingStage.POST_MAIN)
    .describe(
      "The processing stage in which the action should run (during main processing stage or pre-main/post-main)",
    ),
})

/**
 * Represents a config to perform a actions for a GMail thread.
 */
export const ThreadActionConfigSchema = ActionConfigSchema
export type ThreadActionConfig = z.input<typeof ThreadActionConfigSchema>
export type RequiredThreadActionConfig = z.output<
  typeof ThreadActionConfigSchema
>

/**
 * Represents a config to perform a actions for a GMail message.
 */
export const MessageActionConfigSchema = ActionConfigSchema
export type MessageActionConfig = z.input<typeof MessageActionConfigSchema>
export type RequiredMessageActionConfig = z.output<
  typeof MessageActionConfigSchema
>

/**
 * Represents a config to perform a actions for a GMail attachment.
 */
export const AttachmentActionConfigSchema = ActionConfigSchema
export type AttachmentActionConfig = z.input<
  typeof AttachmentActionConfigSchema
>
export type RequiredAttachmentActionConfig = z.output<
  typeof AttachmentActionConfigSchema
>

export type ActionConfigType =
  | ThreadActionConfig
  | MessageActionConfig
  | AttachmentActionConfig

export function newThreadActionConfig(
  json: ThreadActionConfig,
): RequiredThreadActionConfig {
  return ThreadActionConfigSchema.parse(json)
}

export function newMessageActionConfig(
  json: MessageActionConfig,
): RequiredMessageActionConfig {
  return MessageActionConfigSchema.parse(json)
}

export function newAttachmentActionConfig(
  json: AttachmentActionConfig,
): RequiredAttachmentActionConfig {
  return AttachmentActionConfigSchema.parse(json)
}

export function essentialThreadActionConfig(
  config: ThreadActionConfig,
): ThreadActionConfig {
  config = essentialObject<ThreadActionConfig>(
    config,
    newThreadActionConfig({
      name: "thread.noop",
    }),
  )
  return config
}

export function essentialMessageActionConfig(
  config: MessageActionConfig,
): MessageActionConfig {
  config = essentialObject<MessageActionConfig>(
    config,
    newMessageActionConfig({ name: "message.noop" }),
  )
  return config
}

export function essentialAttachmentActionConfig(
  config: AttachmentActionConfig,
): AttachmentActionConfig {
  config = essentialObject<AttachmentActionConfig>(
    config,
    newAttachmentActionConfig({ name: "attachment.noop" }),
  )
  return config
}
