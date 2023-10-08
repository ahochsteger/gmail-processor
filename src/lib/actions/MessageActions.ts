import { ConflictStrategy, FileContent } from "../adapter/GDriveAdapter"
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

export class MessageActions implements ActionProvider<MessageContext> {
  [key: string]: ActionFunction<MessageContext>

  /** Forwards this message. */
  @writingAction()
  public static forward<
    TArgs extends {
      /** The recipient of the forwarded message. */
      to: string
    },
  >(context: MessageContext, args: TArgs): MessageReturnType {
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

  /** Generate a PDF document from the message and store it to GDrive. */
  @writingAction()
  public static storePDF<
    TArgs extends {
      /** The location (path + filename) of the Google Drive file.
       * For shared folders or Team Drives prepend the location with `{id:<folderId>}`.
       * Supports placeholder substitution.
       */
      location: string
      /**
       * The strategy to be used in case a file already exists at the desired location.
       */
      conflictStrategy: ConflictStrategy
      /**
       * The description to be attached to the Google Drive file.
       * Supports placeholder substitution.
       */
      description?: string
      /** Skip the header if `true`. */
      skipHeader: boolean
    },
  >(context: MessageContext, args: TArgs): FileReturnType {
    return {
      file: context.proc.gdriveAdapter.createFile(
        PatternUtil.substitute(context, args.location),
        new FileContent(
          context.proc.gmailAdapter.messageAsPdf(
            context.message.object,
            args.skipHeader,
          ),
          PatternUtil.substitute(context, args.description ?? ""),
        ),
        args.conflictStrategy,
      ),
    }
  }

  /** Store a document referenced by a URL contained in the message body to GDrive. */
  @writingAction()
  public static storeFromURL<
    TArgs extends {
      /**
       * The URL of the document to be stored.
       * To extract the URL from the message body use a message body matcher like `"(?<url>https://...)"` and `"${message.body.match.url}"` as the URL value.
       * NOTE: Take care to narrow down the regex as good as possible to extract valid URLs.
       * Use tools like [regex101.com](https://regex101.com) for testing on example messages.
       */
      url: string
      /**
       * The location (path + filename) of the Google Drive file.
       * For shared folders or Team Drives prepend the location with `{id:<folderId>}`.
       * Supports placeholder substitution.
       */
      location: string
      /**
       * The strategy to be used in case a file already exists at the desired location.
       */
      conflictStrategy: ConflictStrategy
      /**
       * The description to be attached to the Google Drive file.
       * Supports placeholder substitution.
       */
      description?: string
      /**
       * The header to pass to the URL. May be used to pass an authentication token.
       * Supports placeholder substitution.
       */
      headers?: { [k: string]: string }
    },
  >(context: MessageContext, args: TArgs): FileReturnType {
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
          PatternUtil.substitute(context, args.description ?? ""),
        ),
        args.conflictStrategy,
      ),
    }
  }
}

type MethodNames<T> = keyof T
type MessageActionMethodNames = Exclude<
  MethodNames<typeof MessageActions>,
  "prototype"
>
export type MessageActionNames = `message.${MessageActionMethodNames}` | ""
