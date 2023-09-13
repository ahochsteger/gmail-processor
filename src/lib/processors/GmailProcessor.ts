import { PartialDeep } from "type-fest"
import {
  ContextType,
  EnvContext,
  MetaInfoType as MIT,
  MetaInfo,
  ProcessingContext,
  ProcessingInfo,
  ProcessingResult,
  ProcessingStatus,
  newMetaInfo as mi,
  newProcessingResult,
} from "../Context"
import { ActionProvider, ActionRegistry } from "../actions/ActionRegistry"
import { AttachmentActions } from "../actions/AttachmentActions"
import { GlobalActions } from "../actions/GlobalActions"
import { MessageActions } from "../actions/MessageActions"
import { ThreadActions } from "../actions/ThreadActions"
import { GDriveAdapter } from "../adapter/GDriveAdapter"
import { GmailAdapter } from "../adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../adapter/SpreadsheetAdapter"
import {
  Config,
  RequiredConfig,
  essentialConfig,
  newConfig,
} from "../config/Config"
import { Timer } from "../utils/Timer"
import { ThreadProcessor } from "./ThreadProcessor"

export class GmailProcessor {
  public static buildContext(
    ctx: EnvContext,
    info: ProcessingInfo,
  ): ProcessingContext {
    const processingContext: ProcessingContext = {
      ...ctx,
      type: ContextType.PROCESSING,
      proc: info,
      procMeta: {},
    }
    processingContext.procMeta = this.buildMetaInfo(processingContext)
    processingContext.meta = {
      ...processingContext.envMeta,
      ...processingContext.procMeta,
    }
    return processingContext
  }

  public static buildMetaInfo(ctx: ProcessingContext) {
    const m: MetaInfo = {
      "timer.startTime": mi(
        MIT.DATE,
        ctx.proc.timer.getStartTime(),
        "The start timestamp of the processing script.",
      ),
    }
    ctx.proc.config.global.variables.forEach(
      (entry) =>
        (m[`variables.${entry.key}`] = mi(
          MIT.VARIABLE,
          entry.value,
          "A custom defined variable.",
        )),
    )
    return m
  }

  public static setupActionRegistry(
    ctx: EnvContext,
    actionRegistry: ActionRegistry = new ActionRegistry(),
  ): ActionRegistry {
    ctx.log.info("Setting up action registry ...")
    actionRegistry.registerActionProvider(
      "global",
      new GlobalActions() as ActionProvider<ProcessingContext>,
    )
    actionRegistry.registerActionProvider(
      "thread",
      new ThreadActions() as ActionProvider<ProcessingContext>,
    )
    actionRegistry.registerActionProvider(
      "message",
      new MessageActions() as ActionProvider<ProcessingContext>,
    )
    actionRegistry.registerActionProvider(
      "attachment",
      new AttachmentActions() as unknown as ActionProvider<ProcessingContext>,
    )
    return actionRegistry
  }

  public static run(config: RequiredConfig, ctx: EnvContext) {
    ctx.log.info("Processing of GmailProcessor config started ...")

    ctx.env.timezone =
      config.settings.timezone && config.settings.timezone != "default"
        ? config.settings.timezone
        : ctx.env.timezone
    const actionRegistry = GmailProcessor.setupActionRegistry(ctx)
    const processingContext = GmailProcessor.buildContext(ctx, {
      actionRegistry: actionRegistry,
      config: config,
      gdriveAdapter: new GDriveAdapter(ctx, config.settings),
      gmailAdapter: new GmailAdapter(ctx, config.settings),
      spreadsheetAdapter: new SpreadsheetAdapter(ctx, config.settings),
      timer: new Timer(config.settings.maxRuntime),
    })
    ctx.log.logProcessingContext(processingContext)
    const result = ThreadProcessor.processConfigs(
      processingContext,
      config.threads,
      newProcessingResult(),
    )
    if (result.status !== ProcessingStatus.OK) {
      ctx.log.error(`There have been errors during processing:`)
      ctx.log.error(
        ` - Failed action: ${JSON.stringify(result.failedAction ?? "-")}`,
      )
      ctx.log.error(` - Error: ${JSON.stringify(result.error ?? "-")}`)
    }
    ctx.log.info("Processing of GmailProcessor config finished.")
    ctx.log.info(`Processing summary:`)
    ctx.log.info(
      ` - Processed thread configs: ${result.processedThreadConfigs}`,
    )
    ctx.log.info(` - Processed threads: ${result.processedThreads}`)
    ctx.log.info(
      ` - Processed message configs: ${result.processedMessageConfigs}`,
    )
    ctx.log.info(` - Processed messages: ${result.processedMessages}`)
    ctx.log.info(
      ` - Processed attachment configs: ${result.processedAttachmentConfigs}`,
    )
    ctx.log.info(` - Processed attachments: ${result.processedAttachments}`)
    ctx.log.info(` - Executed actions: ${result.executedActions.length}`)
    ctx.log.info(` - Result status: ${result.status}`)
    return result
  }

  public static runWithJson(
    configJson: PartialDeep<Config>,
    ctx: EnvContext,
  ): ProcessingResult {
    const config = GmailProcessor.getEffectiveConfig(configJson)
    return this.run(config, ctx)
  }

  public static getEffectiveConfig(
    configJson: PartialDeep<Config>,
  ): RequiredConfig {
    return newConfig(configJson)
  }

  public static getEssentialConfig(
    configJson: PartialDeep<Config>,
  ): PartialDeep<Config> {
    return essentialConfig(configJson)
  }
}
