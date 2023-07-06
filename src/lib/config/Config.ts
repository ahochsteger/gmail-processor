import {
  Expose,
  Type,
  instanceToPlain,
  plainToInstance,
} from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { RequiredDeep } from "../utils/UtilityTypes"
import { ProcessingStage } from "./ActionConfig"
import { AttachmentConfig } from "./AttachmentConfig"
import { GlobalConfig, normalizeGlobalConfig } from "./GlobalConfig"
import { MessageConfig } from "./MessageConfig"
import { MarkProcessedMethod, SettingsConfig } from "./SettingsConfig"
import { ThreadConfig, normalizeThreadConfigs } from "./ThreadConfig"

/**
 * Represents a configuration for GMail2GDrive in normalized form for processing
 */
export class ProcessingConfig {
  /**
   * The description of the GMail2GDrive config
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
   * Represents a settings config that affect the way GMail2GDrive works.
   */
  @Expose()
  @Type(() => SettingsConfig)
  settings? = new SettingsConfig()
}

/**
 * Represents a configuration for GMail2GDrive
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

export function newConfig(json: PartialDeep<Config> = {}): RequiredConfig {
  return plainToInstance(ProcessingConfig, normalizeConfig(json), {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredConfig
}

export function normalizeConfig(
  config: PartialDeep<Config>,
): PartialDeep<Config> {
  config.threads = config.threads ?? []

  // Normalize top-level attachments config:
  if (config.attachments !== undefined) {
    config.messages = config.messages ?? []
    config.messages.push({ attachments: config.attachments })
    delete config.attachments
  }

  // Normalize top-level messages config:
  if (config.messages !== undefined) {
    config.threads.push({ messages: config.messages })
    delete config.messages
  }

  // Inject mark processed actions
  config.settings = config.settings ?? {}
  config.global = normalizeGlobalConfig(config.global || {})
  config.global.thread = config.global.thread ?? {}
  config.global.thread.actions = config.global.thread.actions ?? []
  config.global.message = config.global.message ?? {}
  config.global.message.actions = config.global.message.actions ?? []
  if (
    config.settings.markProcessedMethod == MarkProcessedMethod.ADD_THREAD_LABEL
  ) {
    config.global.thread.actions.push({
      name: "thread.addLabel",
      args: {
        label: config.settings.markProcessedLabel,
      },
      processingStage: ProcessingStage.POST_MAIN,
    })
  } else {
    config.global.message.actions.push({
      name: "message.markRead",
      processingStage: ProcessingStage.POST_MAIN,
    })
  }

  config.threads = normalizeThreadConfigs(config.threads)

  return config
}
