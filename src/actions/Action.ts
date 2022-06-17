export abstract class Action {
  constructor(public actionFunction: (gmailObject: any, args: any) => void) {}
  public run(gmailObject: any, args: any): void {
    this.actionFunction(gmailObject, args)
  }
}
