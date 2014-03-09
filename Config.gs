/**
 * Configuration for Gmail2GDrive
 */
function getGmail2GDriveConfig() {
  return {
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
      // Rule parameter documentation:
      //  * filter (String, mandatory): a typical gmail search expression (see http://support.google.com/mail/bin/answer.py?hl=en&answer=7190)
      //  * folder (String, mandatory): a path to an existing Google Drive folder (will be created, if not existing)
      //  * archive (boolean, optional): Should the gmail thread be archived after processing? (default: false)
      //  * filenameFrom (String, optional): The attachment filename that should be renamed when stored in Google Drive
      //  * filenameTo (String, optional): The pattern for the new filename of the attachment. You can use '%s' to insert the email subject and date format patterns like 'yyyy' for year, 'MM' for month and 'dd' for day as pattern in the filename.
      //    See https://developers.google.com/apps-script/reference/utilities/utilities#formatDate(Date,String,String) for more information on the possible date format strings.

      { 
        "filter": "to:my.name+scans@gmail.com",
        "folder": "Scans"
      },
      {
        "filter": "from:example1@example.com",
        "folder": "Examples/example1"
      },
      { 
        "filter": "from:example2@example.com",
        "folder": "Examples/example2"
      },
      { 
      },
      {
        "filter": "(from:example3a@example.com OR from:example3b@example.com)",
        "folder": "Examples/example3ab",
        "filenameFrom": "file.txt",
        "filenameTo": "'file-'yyyy-MM-dd-'%s.txt'",
        "archive": true
      }
    ]
  };
}
