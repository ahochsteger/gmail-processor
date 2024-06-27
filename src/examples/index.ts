// NOTE: Do not edit this auto-generated file!
import { Example, V1Example } from "./Example"
import { example as actionAttachmentExtractTextExample } from "./actions/actionAttachmentExtractText"
import { example as actionExportExample } from "./actions/actionExport"
import { example as actionThreadRemoveLabelExample } from "./actions/actionThreadRemoveLabel"
import { example as customActionsExample } from "./advanced/customActions"
import { example as logSheetLoggingExample } from "./advanced/logSheetLogging"
import { example as regularExpressionsExample } from "./advanced/regularExpressions"
import { example as simpleExample } from "./basics/simple"
import { example as convertToGoogleExample } from "./features/convertToGoogle"
import { example as migrationAdvancedExample } from "./migrations/migrationAdvanced"
import { example as migrationMinExample } from "./migrations/migrationMin"
import { example as issue301Example } from "./regressions/issue301"

export const defaultExample = simpleExample
export const allExamples: (Example | V1Example)[] = [
  actionAttachmentExtractTextExample,
  actionExportExample,
  actionThreadRemoveLabelExample,
  convertToGoogleExample,
  customActionsExample,
  issue301Example,
  logSheetLoggingExample,
  migrationAdvancedExample,
  migrationMinExample,
  regularExpressionsExample,
  simpleExample,
]
