import { Expose, Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"
import { AttachmentActionConfig, essentialActionConfig } from "./ActionConfig"
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
  actions?: AttachmentActionConfig[] = []
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
  json: PartialDeep<AttachmentConfig> = {},
): RequiredAttachmentConfig {
  return plainToInstance(AttachmentConfig, normalizeAttachmentConfig(json), {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredAttachmentConfig
}

export function normalizeAttachmentConfig(
  config: PartialDeep<AttachmentConfig>,
): PartialDeep<AttachmentConfig> {
  config.match = config.match || newAttachmentMatchConfig()
  return config
}

export function normalizeAttachmentConfigs(
  configs: PartialDeep<AttachmentConfig>[],
): PartialDeep<AttachmentConfig>[] {
  for (let index = 0; index < configs.length; index++) {
    normalizeAttachmentConfig(configs[index])
  }
  return configs
}

export function essentialAttachmentConfig(
  config: PartialDeep<AttachmentConfig>,
): PartialDeep<AttachmentConfig> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config = essentialObject(config as any, newAttachmentConfig() as any, {
    actions: essentialActionConfig,
    match: essentialAttachmentMatchConfig,
  })
  return config
}
