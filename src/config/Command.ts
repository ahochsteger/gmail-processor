import { CommandType } from "./CommandType"

export class Command {
  public type: CommandType
  public name: string
  public args: any

  constructor(public config: any) {
    this.type = config.name.substring(0, config.name.indexOf("."))
    this.name = config.name.substring(config.name.indexOf(".") + 1)
    this.args = config.args ? config.args : {}
  }
}
