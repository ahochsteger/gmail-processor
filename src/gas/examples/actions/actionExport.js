function actionExportRun() {
  const config = {
    description: "Export a thread or message as HTML or PDF.",
    settings: {
      logSheetLocation:
        "/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",
      markProcessedMethod: "mark-read",
    },
    global: {
      thread: {
        match: {
          query:
            '-in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd} is:unread subject:"[GmailProcessor-Test] actionExport"',
          maxMessageCount: -1,
          minMessageCount: 1,
        },
        actions: [
          {
            name: "thread.exportAsHtml",
            args: {
              location:
                "/GmailProcessor-Tests/actions/actionExport/thread-${thread.id}-${thread.firstMessageSubject}.html",
              conflictStrategy: "replace",
            },
          },
          {
            name: "thread.exportAsPdf",
            args: {
              location:
                "/GmailProcessor-Tests/pr-291/thread-${thread.id}-${thread.firstMessageSubject}.pdf",
              conflictStrategy: "replace",
            },
          },
        ],
      },
      message: {
        actions: [
          {
            name: "message.exportAsHtml",
            args: {
              location:
                "/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.html",
              conflictStrategy: "replace",
            },
          },
          {
            name: "message.exportAsPdf",
            args: {
              location:
                "/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.pdf",
              conflictStrategy: "replace",
            },
          },
        ],
      },
    },
    threads: [
      {
        match: {
          query:
            "from:${user.email} to:${user.email} subject:'GmailProcessor-Test'",
        },
      },
    ],
  }

  return GmailProcessorLib.run(config, "dry-run")
}
