import { ProcessingContext } from "../context/ProcessingContext"

export abstract class AbstractActions {
  constructor(protected processingContext: ProcessingContext) {}
}
