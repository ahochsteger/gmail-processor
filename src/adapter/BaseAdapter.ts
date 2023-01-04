import { ProcessingContext } from "../context/ProcessingContext"

export interface Adapter {
  processingContext: ProcessingContext
  logger: Console
}

export class BaseAdapter implements Adapter {
  public logger: Console
  constructor(public processingContext: ProcessingContext) {
    this.logger = processingContext.gasContext.logger
      ? processingContext.gasContext.logger
      : console
  }
}
