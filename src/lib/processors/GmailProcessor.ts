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
import { LogAdapter } from "../adapter/LogAdapter"
import { SpreadsheetAdapter } from "../adapter/SpreadsheetAdapter"
import {
  Config,
  RequiredConfig,
  essentialConfig,
  newConfig,
} from "../config/Config"
import { VariableEntry } from "../config/GlobalConfig"
import { Timer } from "../utils/Timer"
import { BaseProcessor } from "./BaseProcessor"
import { ThreadProcessor } from "./ThreadProcessor"

export class GmailProcessor extends BaseProcessor {
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
    this.updateContextMeta(processingContext)
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
    ;(ctx.proc.config.global.variables as VariableEntry[]).forEach(
      (entry: VariableEntry) =>
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

  public static run(config: RequiredConfig, ctx: EnvContext): ProcessingResult {
    ctx.log.info("Processing of GmailProcessor config started ...")

    if (
      config.settings.timezone &&
      config.settings.timezone != "default" &&
      ctx.env.session.getScriptTimeZone() &&
      config.settings.timezone &&
      ctx.env.session.getScriptTimeZone()
    ) {
      ctx.log.error(
        `Timezone of Gmail Processor config settings (${config.settings.timezone}) is inconsistent with Google Apps Script (${ctx.env.session.getScriptTimeZone()}). ` +
          `Setting it in the config settings is deprecated. Make sure to have it set correctly in the Google Apps Script project settings or in 'appsscript.json'!`,
      )
    }
    const actionRegistry = GmailProcessor.setupActionRegistry(ctx)
    const logAdapter = new LogAdapter(ctx, config.settings)
    const processingContext = GmailProcessor.buildContext(ctx, {
      actionRegistry: actionRegistry,
      config: config,
      gdriveAdapter: new GDriveAdapter(ctx, config.settings),
      gmailAdapter: new GmailAdapter(ctx, config.settings),
      logAdapter,
      spreadsheetAdapter: new SpreadsheetAdapter(
        ctx,
        config.settings,
        logAdapter,
      ),
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
    configJson: Config,
    ctx: EnvContext,
  ): ProcessingResult {
    const config = GmailProcessor.getEffectiveConfig(configJson)
    return this.run(config, ctx)
  }

  public static getEffectiveConfig(configJson: Config): RequiredConfig {
    return newConfig(configJson)
  }

  public static getEssentialConfig(configJson: Config): Config {
    return essentialConfig(configJson)
  }
}
