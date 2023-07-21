import { ProcessingContext } from "../Context"
import { LogLevel } from "../utils/Logger"
import { PatternUtil } from "../utils/PatternUtil"
import {
  ActionFunction,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

export class GlobalActions implements ActionProvider<ProcessingContext> {
  [key: string]: ActionFunction<ProcessingContext>

  /** Create a log entry. */
  public static log<
    TArgs extends {
      /** The message to be logged */
      message: string
      /**
       * The level of the log message (default: `info`):
       *
       */
      level?: LogLevel
    },
  >(context: ProcessingContext, args: TArgs): ActionReturnType {
    context.log.log(PatternUtil.substitute(context, args.message), args.level)
    return {
      ok: true,
    }
  }

  /** Create a log entry in the log spreadsheet. */
  public static sheetLog<
    TArgs extends {
      /** The message to be logged */
      message: string
      /** The level of the log message (default: info) */
      level?: LogLevel
    },
  >(context: ProcessingContext, args: TArgs): ActionReturnType {
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

type MethodNames<T> = keyof T
type GlobalActionMethodNames = Exclude<
  MethodNames<typeof GlobalActions>,
  "prototype"
>
export type GlobalActionNames = `global.${GlobalActionMethodNames}` | ""
