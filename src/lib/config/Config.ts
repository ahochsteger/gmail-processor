import {
  Expose,
  Type,
  instanceToPlain,
  plainToInstance,
} from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { RequiredDeep } from "../utils/UtilityTypes"
import {
  AttachmentConfig,
  attachmentConfigToJson,
  jsonToAttachmentConfig,
} from "./AttachmentConfig"
import { GlobalConfig } from "./GlobalConfig"
import {
  MessageConfig,
  jsonToMessageConfig,
  messageConfigToJson,
  newMessageConfig,
} from "./MessageConfig"
import { SettingsConfig } from "./SettingsConfig"
import { ThreadConfig, newThreadConfig } from "./ThreadConfig"

/**
 * Represents a configuration for GMail2GDrive in normalized form
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

export function jsonToConfig(json: PartialDeep<Config> = {}): RequiredConfig {
  return plainToInstance(ProcessingConfig, normalizeConfig(json), {
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredConfig
}

export function configToJson<T = ProcessingConfig>(
  config: T,
  withDefaults = false,
): PartialDeep<Config> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}

export function newConfig(json: PartialDeep<Config> = {}): RequiredConfig {
  return jsonToConfig(json)
}

export function normalizeConfig(cfg: PartialDeep<Config>): PartialDeep<Config> {
  const addThreads = []

  // Normalize top-level messages config:
  while (Array.isArray(cfg.messages) && cfg.messages.length) {
    const mcfg = cfg.messages.shift()
    if (!mcfg) break
    const tcfg = newThreadConfig()
    tcfg.messages.push(jsonToMessageConfig(messageConfigToJson(mcfg)))
    addThreads.push(tcfg)
  }
  delete cfg.messages

  // Normalize top-level attachments config:
  while (Array.isArray(cfg.attachments) && cfg.attachments.length) {
    const acfg = cfg.attachments.shift()
    if (!acfg) break
    const mcfg = newMessageConfig()
    mcfg.attachments.push(jsonToAttachmentConfig(attachmentConfigToJson(acfg)))
    const tcfg = newThreadConfig()
    tcfg.messages.push(mcfg)
    addThreads.push(tcfg)
  }
  delete cfg.attachments

  // Add additional thread config:
  cfg.threads = (Array.isArray(cfg.threads) ? cfg.threads : []).concat(
    addThreads,
  )
  return cfg
}
