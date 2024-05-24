function convertToGoogleRun() {
  const config = {
    description: "Convert MS Office attachments into Google formats.",
    settings: {
      logSheetLocation:
        "/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",
      markProcessedMethod: "mark-read",
    },
    global: {
      thread: {
        match: {
          query:
            "has:attachment -in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd}  subject:'[GmailProcessor-Test] convertToGoogle'",
          maxMessageCount: -1,
          minMessageCount: 1,
        },
      },
    },
    threads: [
      {
        match: {
          query:
            "from:${user.email} to:${user.email} subject:'Test with office attachments'",
        },
        attachments: [
          {
            description: "Process *.docx attachment files",
            match: {
              name: "(?<basename>.+)\\.docx$",
            },
            actions: [
              {
                description: "Store original docx file",
                name: "attachment.store",
                args: {
                  conflictStrategy: "replace",
                  location: "/GmailProcessor-Tests/e2e/${attachment.name}",
                },
              },
              {
                description: "Store docx file converted to Google Docs format",
                name: "attachment.store",
                args: {
                  conflictStrategy: "replace",
                  location:
                    "/GmailProcessor-Tests/e2e/${attachment.name.match.basename}",
                  toMimeType: "application/vnd.google-apps.document",
                },
              },
            ],
          },
          {
            description: "Process *.pptx attachment files",
            match: {
              name: "(?<basename>.+)\\.pptx$",
            },
            actions: [
              {
                description: "Store original pptx file",
                name: "attachment.store",
                args: {
                  conflictStrategy: "replace",
                  location: "/GmailProcessor-Tests/e2e/${attachment.name}",
                },
              },
              {
                description:
                  "Store pptx file converted to Google Presentations format",
                name: "attachment.store",
                args: {
                  conflictStrategy: "replace",
                  location:
                    "/GmailProcessor-Tests/e2e/${attachment.name.match.basename}",
                  toMimeType: "application/vnd.google-apps.presentation",
                },
              },
            ],
          },
          {
            description: "Process *.xlsx attachment files",
            match: {
              name: "(?<basename>.+)\\.xlsx$",
            },
            actions: [
              {
                description: "Store original xlsx file",
                name: "attachment.store",
                args: {
                  conflictStrategy: "replace",
                  location: "/GmailProcessor-Tests/e2e/${attachment.name}",
                },
              },
              {
                description:
                  "Store xlsx file converted to Google Spreadsheet format",
                name: "attachment.store",
                args: {
                  conflictStrategy: "replace",
                  location:
                    "/GmailProcessor-Tests/e2e/${attachment.name.match.basename}",
                  toMimeType: "application/vnd.google-apps.spreadsheet",
                },
              },
            ],
          },
        ],
      },
    ],
  }

  GmailProcessorLib.run(config, "dry-run")
}
