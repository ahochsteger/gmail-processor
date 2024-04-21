import { plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { RequiredDeep } from "../../utils/UtilityTypes"

export class V1Rule {
  /** Archive thread after processing */
  archive? = false
  /** Rename matching attachments from the given filename */
  filenameFrom? = ""
  /** Rename matching attachments from the given filename regex */
  filenameFromRegexp? = ""
  /** Rename matching attachments to the given filename */
  filenameTo? = ""
  /** Search filter for threads */
  filter = ""
  /** GDrive folder to store attachments to */
  folder = ""
  /** Restrict to threads containing messages newer than the given relative date/time */
  newerThan? = ""
  /** Parent folder ID to be used (for shared drives) */
  parentFolderId? = ""
  /** Add the given label to the processed thread */
  ruleLabel? = ""
  /** Save the message to PDF */
  saveMessagePDF? = false
  /** Save the thread to PDF */
  saveThreadPDF? = false
  /** Skip header for PDF */
  skipPDFHeader? = false
}

export type RequiredV1Rule = RequiredDeep<V1Rule>
export function newV1Rule(json: PartialDeep<V1Rule> = {}): RequiredV1Rule {
  return plainToInstance(V1Rule, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredV1Rule
}
