function legacyExpressionsRun() {
  const config = {
    description:
      "This example uses legacy expressions that are deprecated but still should work until support is finally removed.",
    settings: {
      markProcessedMethod: "mark-read",
    },
    global: {
      thread: {
        match: {
          query:
            'has:attachment -in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd\'} is:unread subject:"[GmailProcessor-Test] legacyExpressions"',
        },
      },
      variables: [
        {
          key: "date1",
          value: "date1: ${date.now:date:-1d}",
        },
        {
          key: "date2",
          value: "date2: ${date.now:date:-1d:yyyy-MM-dd}",
        },
        {
          key: "date3",
          value: "date3: ${date.now:date::yyyy-MM-dd}",
        },
        {
          key: "format1",
          value: "date1: ${date.now:format}",
        },
        {
          key: "format2",
          value: "date2: ${date.now:format:yyyy-MM-dd}",
        },
        {
          key: "join1",
          value: "join1: ${date.now:join}",
        },
        {
          key: "join2",
          value: "join2: ${date.now:join:-}",
        },
        {
          key: "offset-date1",
          value: "offset-date1: ${date.now:offset-format:-1d}",
        },
        {
          key: "offset-date2",
          value: "offset-date2: ${date.now:offset-format:-1d:yyyy-MM-dd}",
        },
        {
          key: "offset-date3",
          value: "offset-date3: ${date.now:offset-format::yyyy-MM-dd}",
        },
      ],
    },
    threads: [{}],
  }

  return GmailProcessorLib.run(config, "dry-run")
}
