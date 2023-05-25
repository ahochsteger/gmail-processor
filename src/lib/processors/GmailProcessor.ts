import { PartialDeep } from "type-fest"
import { EnvContext, ProcessingContext, ProcessingResult } from "../Context"
import { ActionProvider, ActionRegistry } from "../actions/ActionRegistry"
import { AttachmentActions } from "../actions/AttachmentActions"
import { MessageActions } from "../actions/MessageActions"
import { ThreadActions } from "../actions/ThreadActions"
import { GDriveAdapter } from "../adapter/GDriveAdapter"
import { GmailAdapter } from "../adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../adapter/SpreadsheetAdapter"
import { Config, RequiredConfig, jsonToConfig } from "../config/Config"
import { Timer } from "../utils/Timer"
import { ThreadProcessor } from "./ThreadProcessor"

export class GmailProcessor {
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
    const processingContext: ProcessingContext = {
      ...ctx,
      proc: {
        actionRegistry: actionRegistry,
        gdriveAdapter: new GDriveAdapter(ctx),
        gmailAdapter: new GmailAdapter(ctx),
        spreadsheetAdapter: new SpreadsheetAdapter(ctx),
        config: config,
        timer: new Timer(config.settings.maxRuntime),
      },
    }
    ctx.log.logProcessingContext(processingContext)
    const result = ThreadProcessor.processThreadConfigs(
      processingContext,
      config.threads,
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
    return jsonToConfig(configJson)
  }
}
