/**
 * Configuration for Gmail2GDrive
 * See https://github.com/ahochsteger/gmail2gdrive/blob/master/README.md for a config reference
 */
function getGmail2GDriveConfig() {
  return {
    // Global filter
    "globalFilter": "-in:trash -in:drafts -in:spam has:attachment",
    // Gmail label for processed threads (will be created, if not existing):
    "processedLabel": "to-gdrive/processed",
    // Sleep time in milli seconds between processed messages:
    "sleepTime": 100,
    // Maximum script runtime in seconds (google scripts will be killed after 5 minutes):
    "maxRuntime": 280,
    // Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year):
    "newerThan": "2m",
    // Timezone for date/time operations:
    "timezone": "GMT",
    // Processing rules:
    "rules": [
      { 
        "filter": "receipt from:Noreply@car2go.co.il",
        "folder": "'Expenses/Current'",
        "filenameFrom": "*.pdf",
        "filenameTo": "'car2go-%d.pdf'"
      }, 
      { 
        "filter": "receipt from:billing@zoom.us",
        "folder": "'Expenses/Current'",
        "filenameFrom": "*.pdf",
        "filenameTo": "'zoom-%d.pdf'"
      }, 
      { 
        "filter": "receipt",
        "folder": "'Expenses/Current'",
        "filenameFrom": "*.pdf",
        "filenameTo": "'other-%d-%s.pdf'"
      }, 
      { 
        "filter": "receipt",
        "folder": "'Expenses/Current'",
        "filenameFrom": "*.jpg",
        "filenameTo": "'other-%d-%s.jpg'"
      }, 
    ]
  };
}
