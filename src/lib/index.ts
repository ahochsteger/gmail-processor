/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EnvContext,
  ProcessingResult,
  ProcessingStatus,
  RunMode,
} from "./Context"
import { EnvProvider } from "./EnvProvider"
import { ConflictStrategy } from "./adapter/GDriveAdapter"
import {
  ActionConfig,
  AttachmentActionConfig,
  MessageActionConfig,
  ProcessingStage,
  ThreadActionConfig,
} from "./config/ActionConfig"
import { AttachmentConfig } from "./config/AttachmentConfig"
import { AttachmentMatchConfig } from "./config/AttachmentMatchConfig"
import { Config } from "./config/Config"
import { GlobalConfig, VariableEntry } from "./config/GlobalConfig"
import { MessageConfig } from "./config/MessageConfig"
import { MessageFlag } from "./config/MessageFlag"
import { MessageMatchConfig } from "./config/MessageMatchConfig"
import { MarkProcessedMethod, SettingsConfig } from "./config/SettingsConfig"
import { ThreadConfig } from "./config/ThreadConfig"
import { ThreadMatchConfig } from "./config/ThreadMatchConfig"
import { V1Config } from "./config/v1/V1Config"
import { V1Rule } from "./config/v1/V1Rule"
import { V1ToV2Converter } from "./config/v1/V1ToV2Converter"
import { E2E, E2EConfig, FileConfig } from "./e2e/E2E"
import { GmailProcessor } from "./processors/GmailProcessor"
import { LogLevel } from "./utils/Logger"

// Export everything that should be part of the generated typedoc documentation
export {
  ActionConfig,
  AttachmentActionConfig,
  AttachmentConfig,
  AttachmentMatchConfig,
  Config,
  E2E,
  E2EConfig,
  FileConfig,
  GlobalConfig,
  MarkProcessedMethod,
  MessageActionConfig,
  MessageConfig,
  MessageFlag,
  MessageMatchConfig,
  ProcessingResult,
  ProcessingStage,
  ProcessingStatus,
  RunMode,
  SettingsConfig,
  ThreadActionConfig,
  ThreadConfig,
  ThreadMatchConfig,
  V1Config,
  V1Rule,
  VariableEntry,
}

/**
 * Run Gmail Processor with the given config
 * @param config - GmailProcessor configuration JSON - @see Config
 * @param runMode - The processing mode - @see RunMode
 * @param ctx - The environment context to be used for processing - @see EnvContext
 * @returns Processing result - @see ProcessingResult
 */
export function run(
  config: Config,
  runMode: string = RunMode.SAFE_MODE,
  ctx: EnvContext = EnvProvider.defaultContext(runMode as RunMode),
): ProcessingResult {
  return GmailProcessor.runWithJson(config, ctx)
}

/**
 * Convert a GMail2GDrive v1.x config JSON into a Gmail Processor config
 * @param v1config - JSON of the v1 config - @see V1Config
 * @returns Converted JSON config - @see Config
 */
export function convertV1Config(v1config: V1Config): Config {
  return GmailProcessor.getEssentialConfig(
    V1ToV2Converter.v1ConfigToV2ConfigJson(v1config),
  )
}

// Re-export classes that should be accessible in Google Apps Script:
;(globalThis as any).Config = Config
;(globalThis as any).ConflictStrategy = ConflictStrategy
;(globalThis as any).E2EConfig = E2EConfig
;(globalThis as any).E2E = E2E
;(globalThis as any).EnvProvider = EnvProvider
;(globalThis as any).LogLevel = LogLevel
;(globalThis as any).MarkProcessedMethod = MarkProcessedMethod
;(globalThis as any).MessageFlag = MessageFlag
;(globalThis as any).ProcessingStage = ProcessingStage
;(globalThis as any).RunMode = RunMode
;(globalThis as any).V1Config = V1Config
;(globalThis as any).convertV1Config = convertV1Config
;(globalThis as any).run = run
