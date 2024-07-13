function customActionsRun() {
  const config = {
    description:
      "Define custom logic as actions that can be executed during processing.",
    settings: {
      markProcessedMethod: "mark-read",
    },
    global: {
      thread: {
        match: {
          query:
            'has:attachment -in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd} is:unread subject:"[GmailProcessor-Test] customActions"',
        },
      },
    },
    threads: [
      {
        match: {
          query: "from:${user.email}",
        },
        messages: [
          {
            actions: [
              {
                name: "custom.mylog",
                args: {
                  arg1: "value1",
                  arg2: "value2",
                },
              },
            ],
          },
        ],
      },
    ],
  }

  const customActions = [
    {
      name: "mylog",
      action: (ctx, args) =>
        ctx.log.info(`Called with args '${JSON.stringify(args)}' ...`),
    },
  ]
  return GmailProcessorLib.run(config, "dry-run", customActions)
}
