import { ProcessingContext } from "../Context"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionReturnType,
  typedArgs,
} from "./ActionRegistry"

export class GlobalActions implements ActionProvider<ProcessingContext> {
  [key: string]: ActionFunction<ProcessingContext>
  public static logsheetLog<
    T extends {
      logMessage: string
    },
  >(context: ProcessingContext, args: ActionArgsType): ActionReturnType {
    const a = typedArgs<T>(args)
    context.proc.spreadsheetAdapter.log(a.logMessage as string)
    return {
      ok: true,
    }
  }
}

type MethodNames<T> = keyof T
export type GlobalActionMethodNames = Exclude<
  MethodNames<typeof GlobalActions>,
  "prototype"
>
export type GlobalActionNames = `global.${GlobalActionMethodNames}` | ""
