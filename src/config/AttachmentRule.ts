import { Command } from "./Command"
import "reflect-metadata"
import { Type } from "class-transformer"

/**
 * {
 *     match: { name: "Image-([0-9]+)\.jpg" }, // Responsible: AttachmentProcessor.matches
 *     commands: [ ... ],
 * },
 */
export class AttachmentRule {
  @Type(() => Map<string, string>)
  public match: Map<string, string> = new Map<string, string>()
  @Type(() => Command)
  public commands: Command[] = []
}
