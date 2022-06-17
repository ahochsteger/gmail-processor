export interface CommandExecutor {
  execute(command: string, gmailObject: any, args: any): void
}
