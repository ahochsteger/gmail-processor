import { Config } from "../config/Config"
import { GoogleAppsScriptContext } from "./GoogleAppsScriptContext"

export class ProcessingContext {
  constructor(
    public gasContext: GoogleAppsScriptContext,
    public config: Config,
  ) {}
}
