import { PartialDeep } from "type-fest"
import {
  ContextType,
  EnvContext,
  MetaInfoType as MIT,
  MetaInfo,
  ProcessingContext,
  ProcessingInfo,
  ProcessingResult,
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

  public run(config: RequiredConfig, ctx: EnvContext) {
    ctx.log.info("Processing of GMail2GDrive config started ...")

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
    ctx.log.info("Processing of GMail2GDrive config finished.")
    return result
  }

  public runWithJson(
    configJson: PartialDeep<Config>,
    ctx: EnvContext,
  ): ProcessingResult {
    const config = this.getEffectiveConfig(configJson)
    return this.run(config, ctx)
  }

  public getEffectiveConfig(configJson: PartialDeep<Config>): RequiredConfig {
    return newConfig(configJson)
  }

  public getEssentialConfig(
    configJson: PartialDeep<Config>,
  ): PartialDeep<Config> {
    return essentialConfig(configJson)
  }
}
