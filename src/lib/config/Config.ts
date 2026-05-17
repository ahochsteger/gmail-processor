import { z } from "zod"
import { essentialObject, stripDefaults } from "../utils/ConfigUtils"
import { ProcessingStage } from "./ActionConfig"
import {
  AttachmentConfigSchema,
  essentialAttachmentConfig,
} from "./AttachmentConfig"
import {
  GlobalConfigSchema,
  essentialGlobalConfig,
  normalizeGlobalConfig,
} from "./GlobalConfig"
import { MessageConfigSchema, essentialMessageConfig } from "./MessageConfig"
import { MessageFlag } from "./MessageFlag"
import {
  MarkProcessedMethod,
  SettingsConfigSchema,
  essentialSettingsConfig,
} from "./SettingsConfig"
import {
  ThreadConfigSchema,
  essentialThreadConfig,
  normalizeThreadConfig,
} from "./ThreadConfig"

/**
 * Represents a configuration for GmailProcessor in normalized form for processing
 */
export const ProcessingConfigSchema = z.object({
  /**
   * The description of the GmailProcessor config
   */
  description: z
    .string()
    .default("")
    .describe("The description of the GmailProcessor config"),
  /**
   * The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.
   */
  global: GlobalConfigSchema.default(() =>
    GlobalConfigSchema.parse({}),
  ).describe(
    "The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.",
  ),
  /**
   * The list of handler that define the way nested threads, messages or attachments are processed
   */
  threads: z
    .array(ThreadConfigSchema)
    .default([])
    .describe(
      "The list of handler that define the way nested threads, messages or attachments are processed",
    ),
  /**
   * Represents a settings config that affect the way GmailProcessor works.
   */
  settings: SettingsConfigSchema.default(() =>
    SettingsConfigSchema.parse({}),
  ).describe(
    "Represents a settings config that affect the way GmailProcessor works.",
  ),
})

/**
 * The input configuration for Gmail Processor.
 */
export const ConfigSchema = ProcessingConfigSchema.extend({
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
   */
  attachments: z
    .array(AttachmentConfigSchema)
    .default([])
    .describe(
      "The list of handler that define the way attachments are processed",
    ),
})

export type Config = z.input<typeof ConfigSchema>
export type ProcessingConfig = z.input<typeof ProcessingConfigSchema>
export type RequiredConfig = z.output<typeof ProcessingConfigSchema>

export function configToJson<T = ProcessingConfig>(
  config: T,
  withDefaults = false,
): Config {
  let json = JSON.parse(JSON.stringify(config)) as Config
  if (!withDefaults) {
    const defaultConfig = ProcessingConfigSchema.parse({})
    json = stripDefaults(json, defaultConfig as Config)
  }
  return json
}

export function newConfig(json: Config): RequiredConfig {
  // Validate required settings:
  if (!json.settings?.markProcessedMethod) {
    throw new Error(
      "No markProcessedMethod not set in settings! Make sure to choose from one of the available methods.",
    )
  }
  const config = ProcessingConfigSchema.parse(normalizeConfig(json))

  // Validate resulting config:
  if (config.threads.length < 1) {
    throw new Error(
      "No thread configuration found! Make sure there is at least one thread configuration present!",
    )
  }

  return config
}

export function normalizeConfig(config: Config): Config {
  // Normalize top-level attachments config:
  if (config.attachments !== undefined && config.attachments.length > 0) {
    config.messages = config.messages ?? []
    config.messages.push({ attachments: config.attachments })
    delete config.attachments
  }

  // Normalize top-level messages config:
  if (config.messages !== undefined && config.messages.length > 0) {
    config.threads = config.threads ?? []
    config.threads.push({ messages: config.messages })
    delete config.messages
  }

  // Inject mark processed actions
  config.settings = config.settings ?? {}
  config.global = normalizeGlobalConfig(config.global ?? {})
  const g = config.global
  g.thread = g.thread ?? {}
  g.message = g.message ?? {}
  g.attachment = g.attachment ?? {}
  const gt = g.thread
  const gm = g.message
  const ga = g.attachment
  gt.actions = gt.actions ?? []
  gm.actions = gm.actions ?? []
  ga.actions = ga.actions ?? []
  switch (config.settings.markProcessedMethod) {
    case MarkProcessedMethod.ADD_THREAD_LABEL:
      if (config.settings.markProcessedLabel) {
        gt.match = gt.match ?? {}
        gt.match.query =
          (gt.match.query ?? "") +
          ` -label:${config.settings.markProcessedLabel}`
        gt.actions.push({
          name: "thread.addLabel",
          args: {
            name: config.settings.markProcessedLabel,
          },
          processingStage: ProcessingStage.POST_MAIN,
        })
      }
      break
    case MarkProcessedMethod.CUSTOM:
      // Do nothing!
      break
    case MarkProcessedMethod.MARK_MESSAGE_READ:
      gm.match = gm.match ?? {}
      gm.match.is = (gm.match.is ?? []).concat([MessageFlag.UNREAD])
      gm.actions.push({
        name: "message.markRead",
        processingStage: ProcessingStage.POST_MAIN,
      })
      break
  }

  // Normalize all thread configs:
  config.threads = (config.threads ?? []).map((t) => normalizeThreadConfig(t))

  return config
}

export function essentialConfig(config: Config): Config {
  config = essentialObject(
    config,
    newConfig({
      settings: { markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ },
      threads: [{}],
    }),
    {
      attachments: essentialAttachmentConfig,
      global: essentialGlobalConfig,
      messages: essentialMessageConfig,
      settings: essentialSettingsConfig,
      threads: essentialThreadConfig,
    },
  )
  return config
}
