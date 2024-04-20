import { Example } from "./Example"
import { actionAttachmentExtractTextExample } from "./actions/actionAttachmentExtractText"
import { actionExportExample } from "./actions/actionExport"
import { actionThreadRemoveLabelExample } from "./actions/actionThreadRemoveLabel"
import { simpleExample } from "./basics/simple"
import { convertToGoogleExample } from "./features/convertToGoogle"
import { migrationAdvancedExample } from "./migrations/migrationAdvanced"
import { migrationMinExample } from "./migrations/migrationMin"
import { issue301Example } from "./regressions/issue301"

export const defaultExample = simpleExample
export const allExamples: Example[] = [
  actionAttachmentExtractTextExample,
  actionExportExample,
  actionThreadRemoveLabelExample,
  convertToGoogleExample,
  issue301Example,
  migrationAdvancedExample,
  migrationMinExample,
  simpleExample,
]
