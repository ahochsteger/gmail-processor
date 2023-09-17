import {
  Expose,
  Type,
  instanceToPlain,
  plainToInstance,
} from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"
import { ProcessingStage } from "./ActionConfig"
import { AttachmentConfig, essentialAttachmentConfig } from "./AttachmentConfig"
import {
  GlobalConfig,
  essentialGlobalConfig,
  normalizeGlobalConfig,
} from "./GlobalConfig"
import { MessageConfig, essentialMessageConfig } from "./MessageConfig"
import { MessageFlag } from "./MessageFlag"
import {
  MarkProcessedMethod,
  SettingsConfig,
  essentialSettingsConfig,
} from "./SettingsConfig"
import {
  ThreadConfig,
  essentialThreadConfig,
  normalizeThreadConfigs,
} from "./ThreadConfig"

/**
 * Represents a configuration for GmailProcessor in normalized form for processing
 */
export class ProcessingConfig {
  /**
   * The description of the GmailProcessor config
   */
  @Expose()
  description? = ""
  /**
   * The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.
   */
  @Expose()
  @Type(() => GlobalConfig)
  global? = new GlobalConfig()
  /**
   * The list of handler that define the way nested threads, messages or attachments are processed
   */
  @Expose()
  @Type(() => ThreadConfig)
  threads?: ThreadConfig[] = []
  /**
   * Represents a settings config that affect the way GmailProcessor works.
   */
  @Expose()
  @Type(() => SettingsConfig)
  settings? = new SettingsConfig()
}

/**
 * Represents the configuration root for GmailProcessor
 */
export class Config extends ProcessingConfig {
  /**
   * The list of handler that define the way nested messages or attachments are processed
   */
  @Expose()
  @Type(() => MessageConfig)
  messages?: MessageConfig[] = []
  /**
   * The list of handler that define the way attachments are processed
   */
  @Expose()
  @Type(() => AttachmentConfig)
  attachments?: AttachmentConfig[] = []
}

export type RequiredConfig = RequiredDeep<ProcessingConfig>

export function configToJson<T = ProcessingConfig>(
  config: T,
  withDefaults = false,
): PartialDeep<Config> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}

export function newConfig(json: PartialDeep<Config>): RequiredConfig {
  // Validate required settings:
  if (!json.settings?.markProcessedMethod) {
    throw new Error(
      "No markProcessedMethod not set in settings! Make sure to choose from one of the available methods.",
    )
  }
  const config = plainToInstance(ProcessingConfig, normalizeConfig(json), {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredConfig

  // Validate resulting config:
  if (config.threads.length < 1) {
    throw new Error(
      "No thread configuration found! Make sure there is at least one thread configuration present!",
    )
  }

  return config
}

export function normalizeConfig(
  config: PartialDeep<Config>,
): PartialDeep<Config> {
  config.threads = config.threads ?? []

  // Normalize top-level attachments config:
  if (config.attachments !== undefined && config.attachments?.length > 0) {
    config.messages = config.messages ?? []
    config.messages.push({ attachments: config.attachments })
    delete config.attachments
  }

  // Normalize top-level messages config:
  if (config.messages !== undefined && config.messages?.length > 0) {
    config.threads.push({ messages: config.messages })
    delete config.messages
  }

  // Inject mark processed actions
  config.settings = config.settings ?? {}
  config.global = normalizeGlobalConfig(config.global ?? {})
  config.global.thread = config.global.thread ?? {}
  config.global.thread.actions = config.global.thread.actions ?? []
  config.global.thread.match = config.global.thread.match ?? {}
  config.global.message = config.global.message ?? {}
  config.global.message.actions = config.global.message.actions ?? []
  config.global.message.match = config.global.message.match ?? {}
  config.global.attachment = config.global.attachment ?? {}
  config.global.attachment.actions = config.global.attachment.actions ?? []
  switch (config.settings.markProcessedMethod) {
    case MarkProcessedMethod.ADD_THREAD_LABEL:
      config.global.thread.match.query += ` -label:${config.settings.markProcessedLabel}`
      config.global.thread.actions.push({
        name: "thread.addLabel",
        args: {
          label: config.settings.markProcessedLabel,
        },
        processingStage: ProcessingStage.POST_MAIN,
      })
      break
    case MarkProcessedMethod.CUSTOM:
      // Do nothing!
      break
    case MarkProcessedMethod.MARK_MESSAGE_READ:
      config.global.message.match.is = (
        config.global.message.match.is ?? []
      ).concat([MessageFlag.UNREAD])
      config.global.message.actions.push({
        name: "message.markRead",
        processingStage: ProcessingStage.POST_MAIN,
      })
      break
  }
  config.threads = normalizeThreadConfigs(config.threads)
  return config
}

export function essentialConfig(
  config: PartialDeep<Config>,
): PartialDeep<Config> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
