export class E2EDefaults {
  public static DRIVE_TESTS_BASE_PATH = "/GmailProcessor-Tests/e2e"
  public static EMAIL_SLEEP_TIME_MS = 10000 // NOTE: In tests 2000 is too less, 3000 worked, but might not reliable enough.
  public static EMAIL_SUBJECT_PREFIX = "[GmailProcessor-Test] "
  public static GIT_REPO_BASE_URL =
    "https://raw.githubusercontent.com/ahochsteger/gmail-processor"
  public static GIT_REPO_BRANCH = "main"
  public static GIT_REPO_TEST_FILES_PATH = "src/e2e-test/files"
}
