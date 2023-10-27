import { ProcessingContext } from "../Context"
import { ActionBaseConfig } from "../config/ActionConfig"
import { writingAction } from "../utils/Decorators"
import { LogLevel } from "../utils/Logger"
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
   * The message to be logged.
   */
  message: string
}

export class GlobalActions implements ActionProvider<ProcessingContext> {
  [key: string]: ActionFunction<ProcessingContext>

  /** Do nothing (no operation). Used for testing. */
  public static noop(context: ProcessingContext) {
    context.log.info("NOOP: Do nothing.")
  }

  /** Terminate processing due to an error. */
  public static panic(
    context: ProcessingContext,
    args: GlobalActionLoggingBase,
  ): ActionReturnType {
    const msg = PatternUtil.substitute(context, args.message)
    context.log.error(msg)
    throw new Error(msg)
  }

  /** Create a log entry. */
  public static log(
    context: ProcessingContext,
    args: GlobalActionLoggingBase,
  ): ActionReturnType {
    context.log.log(PatternUtil.substitute(context, args.message), args.level)
    return {
      ok: true,
    }
  }

  /** Create a log entry in the log spreadsheet. */
  @writingAction<ProcessingContext>()
  public static sheetLog(
    context: ProcessingContext,
    args: GlobalActionLoggingBase,
  ): ActionReturnType {
    context.proc.spreadsheetAdapter.log(
      context,
      PatternUtil.substitute(context, args.message),
      args.level,
    )
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
