import { z } from "zod"

export const V1RuleSchema = z.object({
  /** Archive thread after processing */
  archive: z
    .boolean()
    .default(false)
    .describe("Archive thread after processing"),
  /** Rename matching attachments from the given filename */
  filenameFrom: z
    .string()
    .default("")
    .describe("Rename matching attachments from the given filename"),
  /** Rename matching attachments from the given filename regex */
  filenameFromRegexp: z
    .string()
    .default("")
    .describe("Rename matching attachments from the given filename regex"),
  /** Rename matching attachments to the given filename */
  filenameTo: z
    .string()
    .default("")
    .describe("Rename matching attachments to the given filename"),
  /** Search filter for threads */
  filter: z.string().default("").describe("Search filter for threads"),
  /** GDrive folder to store attachments to */
  folder: z
    .string()
    .default("")
    .describe("GDrive folder to store attachments to"),
  /** Restrict to threads containing messages newer than the given relative date/time */
  newerThan: z
    .string()
    .default("")
    .describe(
      "Restrict to threads containing messages newer than the given relative date/time",
    ),
  /** Parent folder ID to be used (for shared drives) */
  parentFolderId: z
    .string()
    .default("")
    .describe("Parent folder ID to be used (for shared drives)"),
  /** Add the given label to the processed thread */
  ruleLabel: z
    .string()
    .default("")
    .describe("Add the given label to the processed thread"),
  /** Save the message to PDF */
  saveMessagePDF: z
    .boolean()
    .default(false)
    .describe("Save the message to PDF"),
  /** Save the thread to PDF */
  saveThreadPDF: z.boolean().default(false).describe("Save the thread to PDF"),
  /** Skip header for PDF */
  skipPDFHeader: z.boolean().default(false).describe("Skip header for PDF"),
})

export type V1Rule = z.input<typeof V1RuleSchema>
export type RequiredV1Rule = z.output<typeof V1RuleSchema>

export function newV1Rule(json: V1Rule = {}): RequiredV1Rule {
  return V1RuleSchema.parse(json)
}
