function dateExpressionsRun() {
  const config = {
    description:
      "This example demonstrates how to use date expressions in the configuration.",
    global: {
      thread: {
        match: {
          query:
            "-in:trash -in:drafts -in:spam from:{{user.email}} to:{{user.email}} after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:\"[GmailProcessor-Test] dateExpressions\"",
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
            match: {
              body: "US date: (?<usDate>[0-9\\/]+), German date: (?<germanDate>[0-9\\.]+), Short German date: (?<shortGermanDate>[0-9\\.]+), ISO date: (?<isoDate>[0-9-]+)",
            },
            actions: [
              {
                name: "global.log",
                args: {
                  message:
                    "Extracted dates US:{{message.body.match.usDate|parseDate('M/d/yyyy')|formatDate('yyyy-MM-dd')}}, DE:{{message.body.match.germanDate|parseDate('d.M.yyyy')|formatDate('yyyy-MM-dd')}}, DE (short):{{message.body.match.shortGermanDate|parseDate('d.M.yy')|formatDate('yyyy-MM-dd')}}, ISO:{{message.body.match.isoDate|parseDate('yyyy-MM-dd')|formatDate('yyyy-MM-dd')}}",
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
