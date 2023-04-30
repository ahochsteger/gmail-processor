import { EnvContext, ProcessingContext } from "../Context"
import { ActionProvider, ActionRegistry } from "../actions/ActionRegistry"
import { AttachmentActions } from "../actions/AttachmentActions"
import { MessageActions } from "../actions/MessageActions"
import { ThreadActions } from "../actions/ThreadActions"
import { GDriveAdapter } from "../adapter/GDriveAdapter"
import { GmailAdapter } from "../adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../adapter/SpreadsheetAdapter"
import { Config, jsonToConfig, normalizeConfig } from "../config/Config"
import { V1Config, jsonToV1Config } from "../config/v1/V1Config"
import { V1ToV2Converter } from "../config/v1/V1ToV2Converter"
import { ThreadProcessor } from "./ThreadProcessor"

export class GmailProcessor {
  public run(envContext: EnvContext, config: Config, dryRun = false) {
    envContext.env.dryRun = dryRun
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
        config: normalizeConfig(config),
      },
    }
    ThreadProcessor.processThreadConfigs(processingContext, config.threads)
    console.info("Processing of GMail2GDrive config finished.")
  }

  public runWithConfigJson(
    envContext: EnvContext,
    configJson: Record<string, unknown>,
    dryRun = false,
  ) {
    const config = this.getEffectiveConfig(configJson)
    console.info("Effective configuration: " + JSON.stringify(config))
    this.run(envContext, config, dryRun)
  }

  public runWithV1Config(
    envContext: EnvContext,
    v1config: V1Config,
    dryRun = false,
  ) {
    const config = V1ToV2Converter.v1ConfigToV2Config(v1config)
    console.warn(
      "Using deprecated v1 config format - switching to the new v2 config format is strongly recommended!",
    )
    this.run(envContext, config, dryRun)
  }

  public runWithV1ConfigJson(
    envContext: EnvContext,
    v1configJson: Record<string, unknown>,
    dryRun = false,
  ) {
    const v1config = jsonToV1Config(v1configJson)
    console.log("v1config: ", v1config)
    this.runWithV1Config(envContext, v1config, dryRun)
  }

  public getEffectiveConfig(configJson: Record<string, unknown>) {
    return jsonToConfig(configJson)
  }
}
