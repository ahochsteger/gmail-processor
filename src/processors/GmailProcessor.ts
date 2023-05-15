import { EnvContext, ProcessingContext } from "../Context"
import { ActionProvider, ActionRegistry } from "../actions/ActionRegistry"
import { AttachmentActions } from "../actions/AttachmentActions"
import { MessageActions } from "../actions/MessageActions"
import { ThreadActions } from "../actions/ThreadActions"
import { GDriveAdapter } from "../adapter/GDriveAdapter"
import { GmailAdapter } from "../adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../adapter/SpreadsheetAdapter"
import { RequiredConfig, jsonToConfig, normalizeConfig } from "../config/Config"
import { V1Config, jsonToV1Config } from "../config/v1/V1Config"
import { V1ToV2Converter } from "../config/v1/V1ToV2Converter"
import { Timer } from "../utils/Timer"
import { ThreadProcessor } from "./ThreadProcessor"

export class GmailProcessor {
  public run(envContext: EnvContext, config: RequiredConfig) {
    console.info("Processing of GMail2GDrive config started ...")
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
      ...envContext,
      proc: {
        actionRegistry: actionRegistry,
        gdriveAdapter: new GDriveAdapter(envContext),
        gmailAdapter: new GmailAdapter(envContext),
        spreadsheetAdapter: new SpreadsheetAdapter(envContext),
        config: config,
        timer: new Timer(config.settings.maxRuntime),
      },
    }
    envContext.log.logProcessingContext(processingContext)
    ThreadProcessor.processThreadConfigs(processingContext, config.threads)
    console.info("Processing of GMail2GDrive config finished.")
  }

  public runWithConfigJson(
    envContext: EnvContext,
    configJson: Record<string, unknown>,
  ) {
    const config = this.getEffectiveConfig(configJson)
    console.info("Effective configuration: " + JSON.stringify(config))
    this.run(envContext, config)
  }

  public runWithV1Config(envContext: EnvContext, v1config: V1Config) {
    const config = V1ToV2Converter.v1ConfigToV2Config(v1config)
    console.warn(
      "Using deprecated v1 config format - switching to the new v2 config format is strongly recommended!",
    )
    this.run(envContext, normalizeConfig(config))
  }

  public runWithV1ConfigJson(
    envContext: EnvContext,
    v1configJson: Record<string, unknown>,
  ) {
    const v1config = jsonToV1Config(v1configJson)
    console.log("v1config: ", v1config)
    this.runWithV1Config(envContext, v1config)
  }

  public getEffectiveConfig(
    configJson: Record<string, unknown>,
  ): RequiredConfig {
    const config = jsonToConfig(configJson)
    return normalizeConfig(config)
  }

  public getEffectiveConfigV1(
    v1configJson: Record<string, unknown>,
  ): RequiredConfig {
    const v1config = jsonToV1Config(v1configJson)
    const config = V1ToV2Converter.v1ConfigToV2Config(v1config)
    return normalizeConfig(config)
  }
}
