import { z } from "zod"
import { essentialObject } from "../utils/ConfigUtils"
import {
  AttachmentConfigSchema,
  essentialAttachmentConfig,
} from "./AttachmentConfig"
import { MessageConfigSchema, essentialMessageConfig } from "./MessageConfig"
import {
  ThreadConfigSchema,
  essentialThreadConfig,
  normalizeThreadConfig,
} from "./ThreadConfig"

/**
 * A variable entry available for string substitution (using `${variables.<varName>}`)
 */
export const VariableEntrySchema = z.object({
  /**
   * The type of the variable.
   * 'const' for a static value (default).
   * 'property' for fetching from GAS script properties.
   */
  type: z
    .enum(["const", "property"])
    .default("const")
    .describe(
      "The type of the variable. 'const' for a static value (default). 'property' for fetching from GAS script properties.",
    ),

  /**
   * The name of the variable.
   */
  key: z.string().default("").describe("The name of the variable."),

  /**
   * The value of the variable. If type is 'property', this is the name of the script property to fetch.
   */
  value: z
    .string()
    .default("")
    .describe(
      "The value of the variable. If type is 'property', this is the name of the script property to fetch.",
    ),
})
export type VariableEntry = z.input<typeof VariableEntrySchema>

/**
 * The global configuration defines matching and actions for all threads, messages or attachments.
 */
export const GlobalConfigSchema = z.object({
  /**
   * The global attachment config affecting each attachment.
   */
  attachment: AttachmentConfigSchema.default(() =>
    AttachmentConfigSchema.parse({}),
  ).describe("The global attachment config affecting each attachment."),

  /**
   * The global message config affecting each message.
   */
  message: MessageConfigSchema.default(() =>
    MessageConfigSchema.parse({}),
  ).describe("The global message config affecting each message."),

  /**
   * The list of global thread affecting each thread.
   */
  thread: ThreadConfigSchema.default(() =>
    ThreadConfigSchema.parse({}),
  ).describe("The list of global thread affecting each thread."),

  /**
   * A list of variable entries to be used in substitutions to simplify configurations.
   */
  variables: z
    .array(VariableEntrySchema)
    .default([])
    .describe(
      "A list of variable entries to be used in substitutions to simplify configurations.",
    ),
})

export type GlobalConfig = z.input<typeof GlobalConfigSchema>
export type RequiredGlobalConfig = z.output<typeof GlobalConfigSchema>

export function newGlobalConfig(json: GlobalConfig = {}): RequiredGlobalConfig {
  return GlobalConfigSchema.parse(normalizeGlobalConfig(json))
}

export function normalizeGlobalConfig(config: GlobalConfig): GlobalConfig {
  config.thread = normalizeThreadConfig(config.thread ?? {})
  return config
}

export function essentialGlobalConfig(config: GlobalConfig): GlobalConfig {
  config = essentialObject(config, newGlobalConfig(), {
    attachment: essentialAttachmentConfig,
    message: essentialMessageConfig,
    thread: essentialThreadConfig,
  })
  return config
}
