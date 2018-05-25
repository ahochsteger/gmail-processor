/**
 * Configuration for Gmail2GDrive
 * See https://github.com/ahochsteger/gmail2gdrive/blob/master/README.md for a config reference
 */
function getGmail2GDriveConfig() {
  return {
    // Global filter
    "globalFilter": "has:attachment -in:trash -in:drafts -in:spam",
    // Gmail label for processed threads (will be created, if not existing):
    "processedLabel": "to-gdrive/processed",
    // Sleep time in milli seconds between processed messages:
    "sleepTime": 100,
    // Maximum script runtime in seconds (google scripts will be killed after 5 minutes):
    "maxRuntime": 280,
    // Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year):
    "newerThan": "1m",
    // Timezone for date/time operations:
    "timezone": "GMT",
    // Processing rules:
    "rules": [
      { // Store all attachments sent to my.name+scans@gmail.com to the folder "Scans"
        "filter": "to:my.name+scans@gmail.com",
        "folder": "Scans"
      },
      { // Store all attachments from example1@example.com to the folder "Examples/example1"
        "filter": "from:example1@example.com",
        "folder": "Examples/example1"
      },
      { // Store all pdf attachments from example2@example.com to the folder "Examples/example2"
        "filter": "from:example2@example.com",
        "folder": "Examples/example2",
        "filenameFromRegexp": ".*\.pdf$"
      },
      { // Store all attachments from example3a@example.com OR from:example3b@example.com
        // to the folder "Examples/example3ab" while renaming all attachments to the pattern
        // defined in 'filenameTo' and archive the thread.
        "filter": "(from:example3a@example.com OR from:example3b@example.com)",
        "folder": "Examples/example3ab",
        "filenameTo": "'file-'yyyy-MM-dd-'%s.txt'",
        "archive": true
      },
      { // Store all attachments named "file.txt" from example4@example.com to the
        // folder "Examples/example4" and rename the attachment to the pattern
        // defined in 'filenameTo' and archive the thread.
        "filter": "from:example4@example.com",
        "folder": "Examples/example4",
        "filenameFrom": "file.txt",
        "filenameTo": "'file-'yyyy-MM-dd-'%s.txt'"
      }
    ]
  };
}
