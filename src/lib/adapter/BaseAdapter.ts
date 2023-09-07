import { EnvContext } from "../Context"
import { SettingsConfig } from "../config/SettingsConfig"

export interface Adapter {
  ctx: EnvContext
  settings: SettingsConfig
}

export class BaseAdapter implements Adapter {
  constructor(
    public ctx: EnvContext,
    public settings: SettingsConfig,
  ) {}
}
