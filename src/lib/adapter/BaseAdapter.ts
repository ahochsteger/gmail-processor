import { EnvContext } from "../Context"

export interface Adapter {
  ctx: EnvContext
}

export class BaseAdapter implements Adapter {
  constructor(public ctx: EnvContext) {}
}
