import { Expose, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { AttachmentActionNames } from "../actions/AttachmentActions"
import { GlobalActionNames } from "../actions/GlobalActions"
import { MessageActionNames } from "../actions/MessageActions"
import { ThreadActionNames } from "../actions/ThreadActions"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"

/**
 * The stage of processing
 */
export enum ProcessingStage {
  /** The stage before processing the main object (thread, message, attachment) */
  PRE_MAIN = "pre-main",
  /** The stage during processing the main object (thread, message, attachment) */
  MAIN = "main",
  /** The stage after processing the main object (thread, message, attachment) */
  POST_MAIN = "post-main",
}

export abstract class ActionConfig {
  /**
   * The arguments for a certain action
   */
  @Expose()
  args?: { [k: string]: unknown } = {}

  /**
   * The description for the action
   */
  @Expose()
  description? = ""

  /**
   * The name of the action to be executed
   */
  @Expose()
  name = ""

  /**
   * The processing stage in which the action should run (during main processing stage or pre-main/post-main)
   */
  @Expose()
  processingStage? = ProcessingStage.POST_MAIN
}

/**
 * Represents a config to perform a actions for a GMail thread.
 */
export class ThreadActionConfig extends ActionConfig {
  name: GlobalActionNames | ThreadActionNames = ""
}

/**
 * Represents a config to perform a actions for a GMail message.
 */
export class MessageActionConfig extends ActionConfig {
  name: GlobalActionNames | ThreadActionNames | MessageActionNames = ""
}

/**
 * Represents a config to perform a actions for a GMail attachment.
 */
export class AttachmentActionConfig extends ActionConfig {
  name:
    | GlobalActionNames
    | ThreadActionNames
    | MessageActionNames
    | AttachmentActionNames = ""
}

export function newThreadActionConfig(
  json: PartialDeep<ThreadActionConfig> = {},
): RequiredDeep<ThreadActionConfig> {
  return plainToInstance(ThreadActionConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredDeep<ThreadActionConfig>
}

export function newMessageActionConfig(
  json: PartialDeep<MessageActionConfig> = {},
): RequiredDeep<MessageActionConfig> {
  return plainToInstance(MessageActionConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredDeep<MessageActionConfig>
}

export function newAttachmentActionConfig(
  json: PartialDeep<AttachmentActionConfig> = {},
): RequiredDeep<AttachmentActionConfig> {
  return plainToInstance(AttachmentActionConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredDeep<AttachmentActionConfig>
}

export function essentialActionConfig(
  config: PartialDeep<ActionConfig>,
): PartialDeep<ActionConfig> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config = essentialObject(config as any, newThreadActionConfig() as any)
  return config
}
