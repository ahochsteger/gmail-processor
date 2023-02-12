import { ProcessingContext } from "../context/ProcessingContext"

export interface Adapter {
  processingContext: ProcessingContext
}

export class BaseAdapter implements Adapter {
  constructor(public processingContext: ProcessingContext) {}
}
