function simpleRun() {
  const config = {
    description:
      "Use this to get started with Gmail Processor. It stores an attachment to Google Drive.",
    settings: {
      markProcessedMethod: "mark-read",
    },
    global: {
      thread: {
        match: {
          query:
            'has:attachment -in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd} is:unread subject:"[GmailProcessor-Test] simple"',
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
            attachments: [
              {
                match: {
                  name: "^invoice\\.pdf$",
                },
                actions: [
                  {
                    name: "attachment.store",
                    args: {
                      location:
                        "/GmailProcessor-Tests/e2e/simple/${message.date:date::yyyy-MM-dd}/${message.subject}-${attachment.name}",
                      conflictStrategy: "keep",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  return GmailProcessorLib.run(config, "dry-run")
}
