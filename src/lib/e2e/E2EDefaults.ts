import { ExampleInfo } from "../../examples/Example"

export class E2EDefaults {
  public static DRIVE_TESTS_BASE_PATH = "/GmailProcessor-Tests/e2e"
  public static EMAIL_MAX_POLL_TIME_MS = 30000 // Maximum time to wait for emails to arrive.
  public static EMAIL_POLL_INTERVAL_MS = 2000 // Interval for polling emails.
  public static EMAIL_SLEEP_TIME_MS = 20000 // Ensure enough time for emails to arrive during full test suites.
  public static EMAIL_SUBJECT_PREFIX = "[GmailProcessor-Test] "
  public static GIT_REPO_BASE_URL =
    "https://raw.githubusercontent.com/ahochsteger/gmail-processor"
  public static GIT_REPO_BRANCH = "main"
  public static GIT_REPO_TEST_FILES_PATH = "src/e2e-test/files"

  /** Per-test base path encoding run date, category and name.
   *  The {{date.now}} placeholder resolves at processing time.
   *  Pass testRunId (e2e runtime only) to make parallel runs non-conflicting. */
  public static driveTestBasePath(
    info: ExampleInfo,
    testRunId?: string,
  ): string {
    const datePart = `{{date.now|formatDate('yyyy-MM-dd')}}`
    const runPart = testRunId ? `${datePart}-${testRunId}` : datePart
    return `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/${runPart}/${info.category}/${info.name}`
  }
}
