import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"
import {
  AttachmentActionConfig,
  AttachmentContextActionConfigType,
  essentialAttachmentActionConfig,
} from "./ActionConfig"
import {
  AttachmentMatchConfig,
  essentialAttachmentMatchConfig,
  newAttachmentMatchConfig,
} from "./AttachmentMatchConfig"

/**
 * Represents a config to handle a certain GMail attachment
 */
export class AttachmentConfig {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  @Expose()
  @Type(() => AttachmentActionConfig)
  actions?: AttachmentContextActionConfigType[] = []
  /**
   * The description of the attachment handler config
   */
  @Expose()
  description? = ""
  /**
   * Specifies which attachments match for further processing
   */
  @Expose()
  @Type(() => AttachmentMatchConfig)
  match? = new AttachmentMatchConfig()
  /**
   * The unique name of the attachment config (will be generated if not set)
   */
  @Expose()
  name? = ""
}

export type RequiredAttachmentConfig = RequiredDeep<AttachmentConfig>

export function newAttachmentConfig(
  json: AttachmentConfig = {},
): RequiredAttachmentConfig {
  return plainToInstance(AttachmentConfig, normalizeAttachmentConfig(json), {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredAttachmentConfig
}

export function normalizeAttachmentConfig(
  config: AttachmentConfig,
): AttachmentConfig {
  config.match = config.match ?? newAttachmentMatchConfig()
  return config
}

export function normalizeAttachmentConfigs(
  configs: AttachmentConfig[],
): AttachmentConfig[] {
  for (const config of configs) {
    normalizeAttachmentConfig(config)
  }
  return configs
}

export function essentialAttachmentConfig(
  config: AttachmentConfig,
): AttachmentConfig {
  config = essentialObject(config, newAttachmentConfig(), {
    actions: essentialAttachmentActionConfig,
    match: essentialAttachmentMatchConfig,
  })
  return config
}
