import { FileContent } from "../adapter/GDriveAdapter"
import { ExportOptionsType } from "../adapter/GmailExportAdapter"
import { ActionBaseConfig, StoreActionBaseArgs } from "../config/ActionConfig"
import { MessageContext } from "../Context"
import { destructiveAction, writingAction } from "../utils/Decorators"
import { PatternUtil } from "../utils/PatternUtil"
import {
  ActionFunction,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

type MessageReturnType = ActionReturnType & {
  message?: GoogleAppsScript.Gmail.GmailMessage
}
type FileReturnType = ActionReturnType & { file?: GoogleAppsScript.Drive.File }

export type MessageActionForwardArgs = {
  /** The recipient of the forwarded message. */
  to: string
}
type MessageActionConfigForward<TName extends string = string> =
  ActionBaseConfig<TName, MessageActionForwardArgs>
export type MessageActionStorePDFArgs = StoreActionBaseArgs & {
  /**
   * Skip the header if `true`.
   */
  skipHeader?: boolean
}
type MessageActionConfigStorePDF<TName extends string = string> =
  ActionBaseConfig<TName, MessageActionStorePDFArgs>
export type MessageActionExportArgs = StoreActionBaseArgs & ExportOptionsType
type MessageActionConfigExport<TName extends string = string> =
  ActionBaseConfig<TName, MessageActionExportArgs>
export type MessageActionStoreFromUrlArgs = StoreActionBaseArgs & {
  /**
   * The URL of the document to be stored.
   * To extract the URL from the message body use a message body matcher like `"(?<url>https://...)"` and `"${message.body.match.url}"` as the URL value.
   * NOTE: Take care to narrow down the regex as good as possible to extract valid URLs.
   * Use tools like [regex101.com](https://regex101.com) for testing on example messages.
   */
  url: string
  /**
   * The header to pass to the URL. May be used to pass an authentication token.
   * Supports placeholder substitution.
   */
  headers?: Record<string, string>
}
type MessageActionConfigStoreFromURL<TName extends string = string> =
  ActionBaseConfig<TName, MessageActionStoreFromUrlArgs>

export class MessageActions implements ActionProvider<MessageContext> {
  [key: string]: ActionFunction<MessageContext>

  /** Do nothing (no operation). Used for testing. */
  public static noop(context: MessageContext) {
    context.log.info("NOOP: Do nothing.")
  }

  /** Forwards this message. */
  @writingAction()
  public static forward(
    context: MessageContext,
    args: MessageActionForwardArgs,
  ): MessageReturnType {
    return {
      message: context.proc.gmailAdapter.messageForward(
        context.message.object,
        args.to,
      ),
    }
  }

  /** Marks the message as read. */
  @writingAction()
  public static markRead(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageMarkRead(
        context.message.object,
      ),
    }
  }

  /** Marks the message as unread. */
  @writingAction()
  public static markUnread(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageMarkUnread(
        context.message.object,
      ),
    }
  }

  /** Moves the message to the trash. */
  @destructiveAction()
  public static moveToTrash(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageMoveToTrash(
        context.message.object,
      ),
    }
  }

  /** Adds a star to a message. */
  @writingAction()
  public static star(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageStar(context.message.object),
    }
  }

  /** Removes the star from a message. */
  @writingAction()
  public static unstar(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageUnstar(context.message.object),
    }
  }

  /** Export a message as HTML document and store it to a GDrive location. */
  @writingAction()
  public static exportAsHtml(
    context: MessageContext,
    args: MessageActionExportArgs,
  ): FileReturnType {
    const name = `${context.message.object.getSubject()}.html`
    return {
      file: context.proc.gdriveAdapter.createFile(
        PatternUtil.substitute(context, args.location),
        new FileContent(
          context.env.utilities
            .newBlob(
              context.proc.gmailAdapter.messageAsHtml(
                context.message.object,
                args,
              ),
              "text/html",
            )
            .setName(name),
          name,
          PatternUtil.substitute(context, args.description ?? ""),
        ),
        args.conflictStrategy,
      ),
    }
  }

  /** Export a message as PDF document and store it to a GDrive location. */
  @writingAction()
  public static exportAsPdf(
    context: MessageContext,
    args: MessageActionExportArgs,
  ): FileReturnType {
    return {
      file: context.proc.gdriveAdapter.createFile(
        PatternUtil.substitute(context, args.location),
        new FileContent(
          context.proc.gmailAdapter.messageAsPdf(context.message.object, args),
          `${context.message.object.getSubject()}.pdf`,
          PatternUtil.substitute(context, args.description ?? ""),
        ),
        args.conflictStrategy,
      ),
    }
  }

  /**
   * Generate a PDF document from the message and store it to GDrive.
   * @deprecated Use `message.exportAsPdf` instead.
   */
  @writingAction()
  public static storePDF(
    context: MessageContext,
    args: MessageActionStorePDFArgs,
  ): FileReturnType {
    return {
      file: context.proc.gdriveAdapter.createFile(
        PatternUtil.substitute(context, args.location),
        new FileContent(
          context.proc.gmailAdapter.messageAsPdf(context.message.object, {
            includeHeader: !args?.skipHeader ?? true,
          }),
          `${context.message.object.getSubject()}.pdf`,
          PatternUtil.substitute(context, args.description ?? ""),
        ),
        args.conflictStrategy,
      ),
    }
  }

  /** Store a document referenced by a URL contained in the message body to GDrive. */
  @writingAction()
  public static storeFromURL(
    context: MessageContext,
    args: MessageActionStoreFromUrlArgs,
  ): FileReturnType {
    const message = context.message.object
    const url = PatternUtil.substitute(context, args.url)
    if (!url) {
      const msg = `Invalid URL '${url}' from '${
        args.url
      }' for message ID '${message.getId()}'!`
      context.log.warn(msg)
      return {
        ok: false,
        error: new Error(msg),
      }
    }
    const blob = context.env.urlFetchApp.fetch(url, {
      headers: args.headers ?? {},
    })
    return {
      ok: true,
      file: context.proc.gdriveAdapter.createFile(
        PatternUtil.substitute(context, args.location),
        new FileContent(
          blob,
          url.slice(url.lastIndexOf("/") + 1),
          PatternUtil.substitute(context, args.description ?? ""),
        ),
        args.conflictStrategy,
      ),
    }
  }
}

export type MessageActionConfigType =
  | ActionBaseConfig<"message.noop">
  | MessageActionConfigForward<"message.forward">
  | MessageActionConfigStoreFromURL<"message.storeFromURL">
  | MessageActionConfigExport<"message.exportAsHtml">
  | MessageActionConfigExport<"message.exportAsPdf">
  | MessageActionConfigStorePDF<"message.storePDF">
  | ActionBaseConfig<"message.markRead">
  | ActionBaseConfig<"message.markUnread">
  | ActionBaseConfig<"message.moveToTrash">
  | ActionBaseConfig<"message.star">
  | ActionBaseConfig<"message.unstar">
