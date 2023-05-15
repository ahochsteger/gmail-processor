import {
  Expose,
  Type,
  instanceToPlain,
  plainToInstance,
} from "class-transformer"
import "reflect-metadata"
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
 * Represents a configuration for GMail2GDrive
 */
export class Config {
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
  /**
   * Represents a settings config that affect the way GMail2GDrive works.
   */
  @Expose()
  @Type(() => SettingsConfig)
  settings? = new SettingsConfig()
}

export type RequiredConfig = RequiredDeep<Config>

export function jsonToConfig(
  json: Record<string, unknown> = {},
): RequiredConfig {
  return plainToInstance(Config, json, {
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredConfig
}

export function configToJson<T = Config>(
  config: T,
  withDefaults = false,
): Record<string, unknown> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}

export function newConfig(json: Record<string, unknown> = {}): RequiredConfig {
  return jsonToConfig(json)
}

export function normalizeConfig(inputConfig: Config): RequiredConfig {
  const cfg = jsonToConfig(configToJson(inputConfig))
  // Normalize top-level messages config:
  while (cfg.messages && cfg.messages.length) {
    const mcfg = cfg.messages.shift()
    if (!mcfg) break
    const tcfg = newThreadConfig()
    tcfg.messages.push(jsonToMessageConfig(messageConfigToJson(mcfg)))
    cfg.threads.push(tcfg)
  }
  // Normalize top-level attachments config:
  while (cfg.attachments && cfg.attachments.length) {
    const acfg = cfg.attachments.shift()
    if (!acfg) break
    const mcfg = newMessageConfig()
    mcfg.attachments.push(jsonToAttachmentConfig(attachmentConfigToJson(acfg)))
    const tcfg = newThreadConfig()
    tcfg.messages.push(mcfg)
    cfg.threads.push(tcfg)
  }
  return cfg
}
