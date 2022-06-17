import { Config } from "../config/Config"
import { AttachmentContext } from "./AttachmentContext"
import { GoogleAppsScriptContext } from "./GoogleAppsScriptContext"
import { MessageContext } from "./MessageContext"
import { ThreadContext } from "./ThreadContext"

export class ProcessingContext {
  constructor(
    public gasContext: GoogleAppsScriptContext,
    public config: Config,
    public threadContext: ThreadContext | null = null,
    public messageContext: MessageContext | null = null,
    public attachmentContext: AttachmentContext | null = null,
  ) {}
}
