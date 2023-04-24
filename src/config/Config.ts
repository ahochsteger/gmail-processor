import {
  Expose,
  Type,
  instanceToPlain,
  plainToInstance,
} from "class-transformer"
import "reflect-metadata"
import { AttachmentConfig } from "./AttachmentConfig"
import { GlobalConfig } from "./GlobalConfig"
import { MessageConfig } from "./MessageConfig"
import { SettingsConfig } from "./SettingsConfig"
import { ThreadConfig } from "./ThreadConfig"

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
  global = new GlobalConfig()
  /**
   * The list of handler that define the way nested threads, messages or attachments are processed
   */
  @Expose()
  @Type(() => ThreadConfig)
  threads: ThreadConfig[] = []
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
  settings = new SettingsConfig()
}

export function normalizeConfig(cfg: Config): Config {
  // Normalize top-level messages config:
  while (cfg.messages && cfg.messages.length) {
    const mcfg = cfg.messages.shift()
    if (!mcfg) break
    const tcfg = new ThreadConfig()
    tcfg.messages.push(mcfg)
    cfg.threads.push(tcfg)
  }
  // Normalize top-level attachments config:
  while (cfg.attachments && cfg.attachments.length) {
    const acfg = cfg.attachments.shift()
    if (!acfg) break
    const mcfg = new MessageConfig()
    mcfg.attachments.push(acfg)
    const tcfg = new ThreadConfig()
    tcfg.messages.push(mcfg)
    cfg.threads.push(tcfg)
  }
  return cfg
}

export function jsonToConfig(json: Record<string, unknown>): Config {
  return plainToInstance(Config, json, {
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  })
}

export function configToJson<T = Config>(
  config: T,
  withDefaults = false,
): Record<string, unknown> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}
