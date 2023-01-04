import { ProcessingContext } from "../context/ProcessingContext"

export interface ActionProvider {
  logger: Console
}
export abstract class AbstractActions implements ActionProvider {
  public logger: Console
  constructor(protected processingContext: ProcessingContext) {
    this.logger = processingContext.gasContext.logger ? processingContext.gasContext.logger : console
  }
}
