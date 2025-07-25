function stringFnExpressionsRun() {
  const config = {
    description:
      "This example demonstrates how to use string function expressions in the configuration.",
    global: {
      thread: {
        match: {
          query:
            "-in:trash -in:drafts -in:spam from:{{user.email}} to:{{user.email}} after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:\"[GmailProcessor-Test] stringFnExpressions\"",
        },
      },
    },
    settings: {
      markProcessedMethod: "mark-read",
      logSensitiveRedactionMode: "none",
    },
    threads: [
      {
        match: {
          query: "",
        },
        messages: [
          {
            actions: [
              {
                name: "global.log",
                args: {
                  message:
                    "Removing '[]' from subject: {{message.subject|replaceAll('[\\[\\]]', '')}}",
                },
              },
            ],
          },
        ],
      },
    ],
  }

  return GmailProcessorLib.run(config, "dry-run")
}
