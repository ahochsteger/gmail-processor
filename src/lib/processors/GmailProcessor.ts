import { EnvContext, ProcessingContext } from "../Context"
import { ActionProvider, ActionRegistry } from "../actions/ActionRegistry"
import { AttachmentActions } from "../actions/AttachmentActions"
import { MessageActions } from "../actions/MessageActions"
import { ThreadActions } from "../actions/ThreadActions"
import { GDriveAdapter } from "../adapter/GDriveAdapter"
import { GmailAdapter } from "../adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../adapter/SpreadsheetAdapter"
import { RequiredConfig, configToJson, jsonToConfig } from "../config/Config"
import { V1Config, jsonToV1Config } from "../config/v1/V1Config"
import { V1ToV2Converter } from "../config/v1/V1ToV2Converter"
import { Timer } from "../utils/Timer"
import { ThreadProcessor } from "./ThreadProcessor"

export class GmailProcessor {
  public run(ctx: EnvContext, config: RequiredConfig) {
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
    ThreadProcessor.processThreadConfigs(processingContext, config.threads)
    ctx.log.info("Processing of GMail2GDrive config finished.")
  }

  public runWithConfigJson(
    ctx: EnvContext,
    configJson: Record<string, unknown>,
  ) {
    const config = this.getEffectiveConfig(configJson)
    ctx.log.info("Effective configuration: " + JSON.stringify(config))
    this.run(ctx, config)
  }

  public runWithV1Config(ctx: EnvContext, v1config: V1Config) {
    const config = V1ToV2Converter.v1ConfigToV2Config(v1config)
    ctx.log.warn(
      "Using deprecated v1 config format - switching to the new v2 config format is strongly recommended: ",
      configToJson(config),
    )
    this.run(ctx, config)
  }

  public runWithV1ConfigJson(
    ctx: EnvContext,
    v1configJson: Record<string, unknown>,
  ) {
    const v1config = jsonToV1Config(v1configJson)
    ctx.log.info("v1 legacy config: ", v1config)
    this.runWithV1Config(ctx, v1config)
  }

  public getEffectiveConfig(
    configJson: Record<string, unknown>,
  ): RequiredConfig {
    return jsonToConfig(configJson)
  }

  public getEffectiveConfigV1(
    v1configJson: Record<string, unknown>,
  ): RequiredConfig {
    const v1config = jsonToV1Config(v1configJson)
    return V1ToV2Converter.v1ConfigToV2Config(v1config)
  }
}
