function actionThreadRemoveLabelRun() {
  const config = {
    description:
      "The action `thread.removeLabel` removes a label from a thread.",
    global: {
      thread: {
        match: {
          query:
            "from:${user.email} to:${user.email} after:${date.now:date::yyyy-MM-dd} subject:'[GmailProcessor-Test] actionThreadRemoveLabel'",
        },
      },
    },
    settings: {
      markProcessedMethod: "custom",
    },
    threads: [
      {
        match: {
          query: "subject:([GmailProcessor-Test] actionThreadRemoveLabel)",
        },
        actions: [
          {
            name: "thread.addLabel",
            processingStage: "pre-main",
            args: {
              name: "accounting-process",
            },
          },
          {
            name: "thread.markRead",
            processingStage: "post-main",
          },
          {
            name: "thread.removeLabel",
            processingStage: "post-main",
            args: {
              name: "accounting-process",
            },
          },
          {
            name: "thread.addLabel",
            processingStage: "post-main",
            args: {
              name: "accounting-autoinvoice",
            },
          },
        ],
      },
    ],
  }

  return GmailProcessorLib.run(config, "dry-run")
}
