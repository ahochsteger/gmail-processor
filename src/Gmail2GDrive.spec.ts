describe("Features", () => {
  describe("Store email thread as PDF", () => {
    test.todo("should be able to store the thread as PDF (PR #2)")
    test.todo(
      "should be able to store attachments and email PDF in the same folder (issue #36, PR #40)",
    )
    test.todo(
      "should be able to customize thread PDF contents (title, links, attachments) (PR #40)",
    )
    test.todo("should allow to merge thread PDF with attached PDF (issue #56)")
    test.todo("should be able to customize the thread PDF filename (PR #61)")
  })
  describe("Customize attachment filenames", () => {
    test.todo("should be able to rename attachments (PR #5)")
    test.todo(
      "should be able to use the subject regex match for attachment file name (issue #6)",
    )
    test.todo("should support date format patterns for folders (issue #8,#64,#69)")
    test.todo(
      "should be able to use the subject as folder name (issue #18,#28)",
    )
    test.todo(
      "should be able to place the original filename in the resulting file path (PR #22,#61, issue #50)",
    )
    test.todo("should provide flexible substitution parameters (issue #28)")
    test.todo(
      "should be able to store certain attachments of the same message/thread in different folders (issue #43,#52)",
    )
    test.todo(
      "should handle special characters in the resulting filenames (issue #47, PR #40)",
    )
    test.todo("should allow to enumerate the attachments (issue #58)")
  })
  describe("Filtering", () => {
    test.todo("should be able to exclude inline attachments (issue #13,#26)")
    test.todo(
      "should be able to match/exclude filenames using regex (issue #17,#24,#57)",
    )
    test.todo(
      "should be able to store attachments from emails with specific labels (issue #20)",
    )
    test.todo("should be able to use date formats in folder names (PR #10)")
    test.todo(
      "should make sure that messages of multi-message threads are processed only once using markMessageRead (issue #11,#44)",
    )
    test.todo("should process messages with CC correctly (issue #12)")
    test.todo(
      "should prevent identical attachments to be stored multiple times (issue #31)",
    )
    test.todo(
      "should make sure that emails from trash are properly excluded (issue #38, PR #39,#40)",
    )
    test.todo(
      "should be able to skip threads containing more than maxMailsInThread messages (PR #40)",
    )
    test.todo(
      "should be able to specify regex options (e.g. case-insensitive match) (issue #51)",
    )
    test.todo(
      "should be able to filter by date at the thread handler level (PR #60)",
    )
    test.todo("should be able to disable handler")
    test.todo("should be able to filter read/unread messages")
    test.todo("should be able to filter starred/unstarred messages")
  })
  describe("Google Drive support", () => {
    test.todo("should create missing parent folders (issue #7)")
    test.todo("should support shared drives/team drives (issue #15,#34,#53,#72)")
    test.todo(
      "should support different conflict resolution strategies on duplicate filenames (issue #19,#29)",
    )
    test.todo(
      "should be able to convert MS Office formats to Google Drive formats (issue #23)",
    )
    test.todo(
      "should support large attachments that are sent with Google Drive links (issue #45)",
    )
  })
  describe("Actions", () => {
    test.todo(
      "should be able to archive a message after processing (issue #33)",
    )
    test.todo(
      "should be able to write logs of created folders and files to a Google Sheet (issue #37, PR #40)",
    )
    test.todo("should be able to set a custom thread label (PR #63)")
  })
  describe("Usability", () => {
    test.todo(
      "should be able to automatically create a time-based trigger (issue #32)",
    )
    test.todo("should provide a simple configuration syntax (PR #40)")
    test.todo("may support devcontainers (PR #42)")
  })
  describe("Error Handling", () => {
    test.todo(
      "should skip execution if essential dependencies are not available (PR #40)",
    )
    test.todo(
      "should try to respect quota limits as good as possible (issue #59)",
    )
    test.todo("should be able to report quota-related issues")
  })
  describe("Performance", () => {
    test.todo(
      "should consider caching for repeated time-consuming tasks (PR #40)",
    )
  })
})
