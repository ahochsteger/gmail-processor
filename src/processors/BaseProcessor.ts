export class BaseProcessor {
  protected isSet(value: string) {
    return value !== undefined && value != null && value != ""
  }
  protected getStr(value: string, defaultVal = "") {
    return this.isSet(value) ? value : defaultVal
  }
}
