import { CommandType } from "./CommandType"

/**
 * {
 *   "name": "thread.addLabel",
 *   "args": {
 *     "label": "my-label"
 *   }
 * }
 */
export class Command {
  public type: CommandType | undefined
  public name = ""
  public args = {}

  setFromConfig(config: any) {
    this.type = config.name.substring(0, config.name.indexOf("."))
    this.name = config.name.substring(config.name.indexOf(".") + 1)
    this.args = config.args ? config.args : {}
  }
}
