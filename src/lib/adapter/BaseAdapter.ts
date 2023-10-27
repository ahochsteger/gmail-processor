import { EnvContext } from "../Context"
import { SettingsConfig } from "../config/SettingsConfig"

export class BaseAdapter {
  constructor(
    public ctx: EnvContext,
    public settings: SettingsConfig,
  ) {}
}
