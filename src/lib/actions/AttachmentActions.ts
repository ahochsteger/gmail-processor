import { PDFDocument } from "@cantoo/pdf-lib"
import {
  ActionBaseConfig,
  AttachmentExtractTextArgs,
  StoreActionBaseArgs,
  StoreDecryptedPdfActionArgs,
} from "../config/ActionConfig"
import {
  AttachmentContext,
  MetaInfo,
  MetaInfoType,
  newMetaInfo,
} from "../Context"
import { BaseProcessor } from "../processors/BaseProcessor"
import { writingAction } from "../utils/Decorators"
import { PatternUtil } from "../utils/PatternUtil"
import {
  ActionFunction,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

export class AttachmentActions implements ActionProvider<AttachmentContext> {
  [key: string]: ActionFunction<AttachmentContext>

  /** Do nothing (no operation). Used for testing. */
  public static noop(context: AttachmentContext) {
    context.log.info("NOOP: Do nothing.")
  }

  /**
   * Extract text from an attachment into a Google Docs file or for further processing.
   * Supported file types: GIF, JPEG, PDF, PNG
   */
  @writingAction<AttachmentContext>()
  public static extractText(
    context: AttachmentContext,
    args: AttachmentExtractTextArgs,
  ): ActionReturnType & { file?: GoogleAppsScript.Drive.File } {
    context.log.debug(
      `AttachmentActions.extractText(): args={${JSON.stringify(args)}}`,
    )
    const docsFileLocation = PatternUtil.substitute(
      context,
      args.docsFileLocation ?? "",
    )
    const result = context.proc.gdriveAdapter.extractAttachmentText(
      context.attachment.object,
      {
        ...args,
        docsFileLocation,
      },
    )
    let actionMeta: MetaInfo = {}
    if (result.text) {
      const keyPrefix = "attachment"
      actionMeta["attachment.extracted"] = newMetaInfo(
        MetaInfoType.STRING,
        result.text,
        "Extracted Text",
        "The extracted text from the attachment (using action `attachment.extractText`)",
      )
      if (args.extract) {
        const regexMap: Map<string, string> = new Map()
        regexMap.set("extracted", args.extract)
        BaseProcessor.buildRegExpSubstitutionMap(
          context,
          actionMeta,
          keyPrefix,
          regexMap,
          false,
        )
      }
      if (result.file) {
        actionMeta = context.proc.gdriveAdapter.getActionMeta(
          result.file,
          docsFileLocation,
          "OCR docs file",
          "attachment.docsFile",
          "attachment.extractText",
          actionMeta,
        )
      }
    }
    return {
      actionMeta,
      ...result,
    }
  }

  /** Store an attachment to a Google Drive location. */
  @writingAction<AttachmentContext>()
  public static store(
    context: AttachmentContext,
    args: StoreActionBaseArgs,
  ): ActionReturnType & { file?: GoogleAppsScript.Drive.File } {
    const location = PatternUtil.substitute(context, args.location)
    const file = context.proc.gdriveAdapter.storeAttachment(
      context.attachment.object,
      {
        ...args,
        location: location,
        description: PatternUtil.substitute(context, args.description ?? ""),
      },
    )
    const actionMeta = context.proc.gdriveAdapter.getActionMeta(
      file,
      location,
      "attachment",
      "attachment",
      "attachment.store",
    )
    return {
      ok: true,
      file,
      actionMeta,
    }
  }

  /**
   * Decrypt a PDF attachment and store it to a Google Drive location.
   * NOTE: PDF decryption is done in an asynchronous process which causes
   * some limitations (failure detection, logs will appear later mixed with
   * other actions).
   */
  @writingAction<AttachmentContext>()
  public static async storeDecryptedPdf(
    ctx: AttachmentContext,
    args: StoreDecryptedPdfActionArgs,
  ): Promise<ActionReturnType> {
    const location = args.location // evaluate(ctx, args.location)
    try {
      ctx.log.debug(
        `AttachmentActions.storeDecryptedPdf(): location=${location}`,
      )
      const attachment = ctx.attachment.object
      const base64Content = ctx.env.utilities.base64Encode(
        attachment.getBytes(),
      )
      ctx.log.debug(
        `AttachmentActions.storeDecryptedPdf(): Loading PDF document ...`,
      )
      const pdfDoc = await PDFDocument.load(base64Content, {
        password: args.password,
        ignoreEncryption: true,
      })
      ctx.log.debug(
        `AttachmentActions.storeDecryptedPdf(): Decrypting PDF content ...`,
      )
      const decryptedContent: Uint8Array = await pdfDoc.save()
      ctx.log.debug(
        `AttachmentActions.storeDecryptedPdf(): Creating a new PDF document ...`,
      )
      const decryptedPdf = ctx.env.utilities.newBlob(
        decryptedContent as unknown as GoogleAppsScript.Byte[],
        attachment.getContentType(),
        attachment.getName(),
      )
      ctx.log.info(
        `decryptAndStorePdf(): Storing decrypted PDF file '${attachment.getName()}' to '${location}' ...`,
      )
      return ctx.proc.gdriveAdapter.createFileFromAction(
        ctx,
        args.location,
        decryptedPdf,
        args.conflictStrategy,
        args.description,
        "decrypted PDF",
        "attachment",
        "attachment.decryptAndStorePdf",
      )
    } catch (e) {
      ctx.log.error(
        // `Error while saving decrypted pdf to ${evaluate(ctx, args.location)}: ${String(e)}`,
        `Error while saving decrypted pdf to ${location}: ${String(e)}`,
      )
      throw e
    }
  }
}

export type AttachmentActionConfigType =
  | ActionBaseConfig<"attachment.noop">
  | ActionBaseConfig<"attachment.extractText", AttachmentExtractTextArgs>
  | ActionBaseConfig<"attachment.store", StoreActionBaseArgs>
  | ActionBaseConfig<
      "attachment.storeDecryptedPdf",
      StoreDecryptedPdfActionArgs
    >
