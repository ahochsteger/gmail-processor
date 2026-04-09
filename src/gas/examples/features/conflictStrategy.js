function conflictStrategyRun() {
  const config = {
    description: "Test different conflict strategies like increment.",
    settings: {
      logSheetLocation:
        "/GmailProcessor-Tests/logsheet-{{date.now|formatDate('yyyy-MM')}}",
      markProcessedMethod: "mark-read",
    },
    global: {
      thread: {
        match: {
          query:
            "has:attachment -in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:\"[GmailProcessor-Test] conflictStrategy\"",
          maxMessageCount: -1,
          minMessageCount: 1,
        },
      },
    },
    threads: [
      {
        match: {
          query: "from:{{user.email}} to:{{user.email}}",
        },
        attachments: [
          {
            description: "Process *.txt attachment files",
            match: {
              name: "(?<basename>.+)\\.txt$",
            },
            actions: [
              {
                description: "Store original txt file",
                name: "attachment.store",
                args: {
                  conflictStrategy: "replace",
                  location:
                    "/GmailProcessor-Tests/e2e/conflictStrategy/{{message.date|formatDate('yyyy-MM-dd')}}/{{attachment.name}}",
                },
              },
              {
                description:
                  "Store the same txt file again with increment strategy",
                name: "attachment.store",
                args: {
                  conflictStrategy: "increment",
                  incrementPrefix: "_",
                  incrementSuffix: "",
                  incrementStart: 2,
                  location:
                    "/GmailProcessor-Tests/e2e/conflictStrategy/{{message.date|formatDate('yyyy-MM-dd')}}/{{attachment.name}}",
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
