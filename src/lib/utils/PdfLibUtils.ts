import { PDFDocument } from "@cantoo/pdf-lib"
import { AttachmentContext } from "lib/Context"

export async function getDecryptedPdf(processedFileObject: GoogleAppsScript.Gmail.GmailAttachment, password: string, context: AttachmentContext) {
  const bytes = processedFileObject.getBytes();
  const fileBase64 = context.env.utilities.base64Encode(bytes);
  const pdfDoc = await PDFDocument.load(fileBase64, { password, ignoreEncryption: true});
  const unencrypted = await pdfDoc.save() as unknown as GoogleAppsScript.Byte[];
  // the file that is stored is renamed later by the storeAttachment method
  return context.env.utilities.newBlob(unencrypted, 'application/pdf', 'temp_decrypted_name.pdf') as unknown as GoogleAppsScript.Gmail.GmailAttachment;
}
