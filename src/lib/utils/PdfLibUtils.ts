import { PDFDocument } from "@cantoo/pdf-lib"

export async function getDecryptedPdf(processedFileObject: GoogleAppsScript.Gmail.GmailAttachment, password: string) {
  const bytes = processedFileObject.getBytes();
  const fileBase64 = Utilities.base64Encode(bytes);
  const pdfDoc = await PDFDocument.load(fileBase64, { password, ignoreEncryption: true});
  const unencrypted = await pdfDoc.save() as unknown as GoogleAppsScript.Byte[];
  // the file that is stored is renamed later by the storeAttachment method
  return Utilities.newBlob(unencrypted, 'application/pdf', 'temp_decrypted_name.pdf') as unknown as GoogleAppsScript.Gmail.GmailAttachment;
}
