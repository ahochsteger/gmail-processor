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
  public static log<
    TArgs extends {
      message: string
      level?: LogLevel
    },
  >(context: ProcessingContext, args: TArgs): ActionReturnType {
    context.log.log(PatternUtil.substitute(context, args.message), args.level)
    return {
      ok: true,
    }
  }
  public static sheetLog<
    TArgs extends {
      message: string
      level?: LogLevel
    },
  >(context: ProcessingContext, args: TArgs): ActionReturnType {
    context.proc.spreadsheetAdapter.log(
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
