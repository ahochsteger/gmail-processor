import { ProcessingContext } from "../Context"
import { ActionBaseConfig } from "../config/ActionConfig"
import { LogLevel } from "../config/SettingsConfig"
import { writingAction } from "../utils/Decorators"
import { PatternUtil } from "../utils/PatternUtil"
import {
  ActionFunction,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

export type GlobalActionLoggingBase = {
  /**
   * The level of the log message (default: `info`).
   */
  level?: LogLevel
  /**
   * The location of the log message
   */
  location?: string
  /**
   * The message to be logged.
   */
  message: string
}

export class GlobalActions implements ActionProvider<ProcessingContext> {
  [key: string]: ActionFunction<ProcessingContext>

  /** Do nothing (no operation). Used for testing. */
  public static noop(ctx: ProcessingContext) {
    ctx.log.info("NOOP: Do nothing.")
  }

  /** Terminate processing due to an error. */
  public static panic(
    ctx: ProcessingContext,
    args: GlobalActionLoggingBase,
  ): ActionReturnType {
    const msg = PatternUtil.substitute(ctx, args.message)
    ctx.log.error(msg)
    throw new Error(msg)
  }

  /** Create a log entry. */
  public static log(
    ctx: ProcessingContext,
    args: GlobalActionLoggingBase,
  ): ActionReturnType {
    ctx.log.log(PatternUtil.substitute(ctx, args.message), args.level)
    return {
      ok: true,
    }
  }

  /** Create a log entry in the log spreadsheet. */
  @writingAction<ProcessingContext>()
  public static sheetLog(
    ctx: ProcessingContext,
    args: GlobalActionLoggingBase,
  ): ActionReturnType {
    ctx.proc.spreadsheetAdapter.log(ctx, {
      ...args,
      message: PatternUtil.substitute(ctx, args.message),
    })
    return {
      ok: true,
    }
  }
}

export type GlobalActionConfigType =
  | ActionBaseConfig<"global.noop">
  | ActionBaseConfig<"global.log", GlobalActionLoggingBase>
  | ActionBaseConfig<"global.panic", GlobalActionLoggingBase>
  | ActionBaseConfig<"global.sheetLog", GlobalActionLoggingBase>
