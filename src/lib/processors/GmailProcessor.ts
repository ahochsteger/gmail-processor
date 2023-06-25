import { PartialDeep } from "type-fest"
import {
  EnvContext,
  MetaInfo,
  ProcessingContext,
  ProcessingInfo,
  ProcessingResult,
  newProcessingResult,
} from "../Context"
import { ActionProvider, ActionRegistry } from "../actions/ActionRegistry"
import { AttachmentActions } from "../actions/AttachmentActions"
import { MessageActions } from "../actions/MessageActions"
import { ThreadActions } from "../actions/ThreadActions"
import { GDriveAdapter } from "../adapter/GDriveAdapter"
import { GmailAdapter } from "../adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../adapter/SpreadsheetAdapter"
import { Config, RequiredConfig, newConfig } from "../config/Config"
import { Timer } from "../utils/Timer"
import { ThreadProcessor } from "./ThreadProcessor"

export class GmailProcessor {
  public static buildContext(
    ctx: EnvContext,
    info: ProcessingInfo,
  ): ProcessingContext {
    const processingContext: ProcessingContext = {
      ...ctx,
      proc: info,
      procMeta: new MetaInfo(),
    }
    processingContext.procMeta = this.buildMetaInfo(
      processingContext,
      processingContext.procMeta,
    )
    processingContext.meta = new MetaInfo([...processingContext.procMeta])
    return processingContext
  }

  public static buildMetaInfo(ctx: ProcessingContext, m = new MetaInfo()) {
    m.set("date.now", new Date())
    m.set("env.runMode", ctx.env.runMode)
    m.set("env.timezone", ctx.env.timezone)
    m.set("timer.startTime", ctx.proc.timer.getStartTime())
    m.set("user.email", ctx.env.session.getActiveUser().getEmail())
    ctx.proc.config.global.variables.forEach((entry) =>
      m.set(`variables.${entry.key}`, entry.value),
    )
    return m
  }

  public run(config: RequiredConfig, ctx: EnvContext) {
    ctx.log.info("Processing of GMail2GDrive config started ...")
    const actionRegistry = new ActionRegistry()
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
    const processingContext = GmailProcessor.buildContext(ctx, {
      actionRegistry: actionRegistry,
      config: config,
      gdriveAdapter: new GDriveAdapter(ctx),
      gmailAdapter: new GmailAdapter(ctx),
      spreadsheetAdapter: new SpreadsheetAdapter(ctx),
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
}
