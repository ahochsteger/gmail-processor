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
import { OrderDirection } from "./CommonConfig"

/**
 * Represents an attachment field to be ordered by for processing.
 */
export enum AttachmentOrderField {
  /**
   * Order by the content type of the attachment.
   */
  CONTENT_TYPE = "contentType",
  /**
   * Order by the hash of the attachment.
   */
  HASH = "hash",
  /**
   * Order by the name of the attachment.
   */
  NAME = "name",
}

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
  /**
   * The field to order attachments by for processing.
   */
  @Expose()
  orderBy?: AttachmentOrderField = undefined
  /**
   * The direction to order attachments for processing.
   */
  @Expose()
  orderDirection?: OrderDirection = undefined
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
