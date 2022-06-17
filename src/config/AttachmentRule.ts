import { Command } from "./Command"

/**
 * {
 *     match: { name: "Image-([0-9]+)\.jpg" }, // Responsible: AttachmentProcessor.matches
 *     commands: [ ... ],
 * },
 */
export class AttachmentRule {
  public match: Map<string, string>
  public commands: Command[] = []
  constructor(config: any) {
    this.match = config.match
    for (const c of config.commands instanceof Array ? config.commands : []) {
      this.commands.push(new Command(c))
    }
  }
}
