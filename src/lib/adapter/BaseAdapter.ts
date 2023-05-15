import { EnvContext } from "../Context"

export interface Adapter {
  envContext: EnvContext
}

export class BaseAdapter implements Adapter {
  constructor(public envContext: EnvContext) {}
}
