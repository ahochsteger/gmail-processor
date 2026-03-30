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
}
