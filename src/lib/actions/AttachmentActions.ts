import {
  ActionBaseConfig,
  AttachmentExtractTextArgs,
  StoreActionBaseArgs,
  StoreAndDecryptActionBaseArgs,
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
import { getDecryptedPdf } from "lib/utils/PdfLibUtils"

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

  /** Store and decrypt an attachment to a Google Drive location. */
  @writingAction<AttachmentContext>()
  public static storeAndDecrypt(
    context: AttachmentContext,
    args: StoreAndDecryptActionBaseArgs,
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
    getDecryptedPdf(context.attachment.object, args.password, context).then((decryptedFile) => {
      context.proc.gdriveAdapter.storeAttachment(
        decryptedFile,
        {
          ...args,
          location: PatternUtil.substitute(context, args.decryptedPdfLocation),
          description: PatternUtil.substitute(context, args.decryptedPdfDescription ?? ""),
        },
      )
    });
    const actionMeta = context.proc.gdriveAdapter.getActionMeta(
      file,
      location,
      "attachment",
      "attachment",
      "attachment.storeAndDecrypt",
    )
    return {
      ok: true,
      file,
      actionMeta,
    }
  }
}

export type AttachmentActionConfigType =
  | ActionBaseConfig<"attachment.noop">
  | ActionBaseConfig<"attachment.extractText", AttachmentExtractTextArgs>
  | ActionBaseConfig<"attachment.store", StoreActionBaseArgs>
