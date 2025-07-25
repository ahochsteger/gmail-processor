// NOTE: Do not edit this auto-generated file!
import { Example, V1Example } from "./Example"
import { example as actionAttachmentExtractTextExample } from "./actions/actionAttachmentExtractText"
import { example as actionExportExample } from "./actions/actionExport"
import { example as actionThreadRemoveLabelExample } from "./actions/actionThreadRemoveLabel"
import { example as customActionsExample } from "./advanced/customActions"
import { example as dateExpressionsExample } from "./advanced/dateExpressions"
import { example as decryptPdfExample } from "./advanced/decryptPdf"
import { example as headerMatchingExample } from "./advanced/headerMatching"
import { example as logSheetLoggingExample } from "./advanced/logSheetLogging"
import { example as regularExpressionsExample } from "./advanced/regularExpressions"
import { example as stringFnExpressionsExample } from "./advanced/stringFnExpressions"
import { example as simpleExample } from "./basics/simple"
import { example as convertToGoogleExample } from "./features/convertToGoogle"
import { example as migrationAdvancedExample } from "./migrations/migrationAdvanced"
import { example as migrationMinExample } from "./migrations/migrationMin"
import { example as issue301Example } from "./regressions/issue301"
import { example as legacyExpressionsExample } from "./regressions/legacyExpressions"

export const defaultExample = simpleExample
export const allExamples: (Example | V1Example)[] = [
  actionAttachmentExtractTextExample,
  actionExportExample,
  actionThreadRemoveLabelExample,
  convertToGoogleExample,
  customActionsExample,
  dateExpressionsExample,
  decryptPdfExample,
  headerMatchingExample,
  issue301Example,
  legacyExpressionsExample,
  logSheetLoggingExample,
  migrationAdvancedExample,
  migrationMinExample,
  regularExpressionsExample,
  simpleExample,
  stringFnExpressionsExample,
]
