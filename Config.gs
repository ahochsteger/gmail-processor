/**
 * Configuration for Gmail2GDrive
 * See https://github.com/ahochsteger/gmail2gdrive/blob/master/README.md for a config reference
 */

// -----------------------------------------------------------------------------
// Updated May 2020, by Max Prat-Carrabin https://github.com/maxsnet

// -----------------------------------------------------------------------------
// Explanations of rules:
//   filter completes Global Filter (gmail filter)
//   folder is the folder name in the Google Drive where the files will be saved. Surrounded by single quotes.
//   saveThreadPDF to save the thread email as a pdf.
//   archive archives the mail.
//
//   filenameFrom only stores attachements of those name
//   filenameFromRegexp renames the fil using regex.
//
//   filenameTo to rename the file saved:
//     '%s' is replaced by the name fo the file / the subject of the mail
//     '%t' is replaced by the file source: 'mail' or 'file'
//     '%id' is remplaced by the 3 last caracters of the id of the mail
//   the simple quotes are required.
//
//   filenameReplaceFrom: if this texte is found in the filename, then it will be replaced by filenameReplaceTo
//   filenameReplaceTo: look for filenameReplaceFrom in the filename and replaces by this.
 
// Do not touch
var config= {};
config.rules = [];
var rule = {};

// -----------------------------------------------------------------------------
// A priori do not touch:
// Global filter
config.globalFilter =        "-in:trash -in:drafts -in:spam";
// Sleep time in milli seconds between processed messages:
config.sleepTime =           100;
// Maximum script runtime in seconds (google scripts will be killed after 5 minutes):
config.maxRuntime =          280;
// Max length name of file
config.maxNameLength =       150;

// -----------------------------------------------------------------------------
// Global setup to update
// Gmail label for processed threads (will be created, if not existing):
config.processedLabel =      "to-gdrive/processed";
// Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year):
config.newerThan =           "1m";
// Path of the log gile folder.
config.logfilefolderpath =    "EmailThisBot";
// Make filename computer filesystem accepted (not required if the file will always stay on Google Drive)
config.fnameComputerReady =   true

// -----------------------------------------------------------------------------
// Rules Setup to update
// START SETUP: Rule
rule.filter =              "subject:'sujet 1'"
rule.folder =              "EmailThisBot"
rule.saveThreadPDF =       true
rule.archive =             true
rule.filenameFrom =        ""
rule.filenameFromRegexp =  ""
rule.filenameTo =          "yyyyMMdd-'%id'-'%t'-'%s'"
rule.filenameReplaceFrom = "Sujet";
rule.filenameReplaceTo =   "";

// Do not touch (but keep it at the end of each rule setup)
config.rules.push(rule);
var rule = {};
                   
// END SETUP: Rule 

// START SETUP: Rule
rule.filter =              "WILLOW"
rule.folder =              "EmailThisBot"
rule.saveThreadPDF =       true
rule.archive =             true
rule.filenameFrom =        ""
rule.filenameFromRegexp =  ""
rule.filenameTo =          "'%id'-'%s'"
rule.filenameReplaceFrom = "WILLOW";
rule.filenameReplaceTo =   "TOTO";

// Do not touch (but keep it at the end of each rule setup)
config.rules.push(rule);
var rule = {};

//Logger.log(config.rules[0].filter);
//Logger.log(config.rules[1].filter);
                   

// END SETUP: Rule 


//   Exemples of rule (in the previous form):
//      // Store all attachments sent to my.name+scans@gmail.com to the folder "Scans"       
//      {
//        "filter": "has:attachment to:my.name+scans@gmail.com",
//        "folder": "'Scans'-yyyy-MM-dd"
//      }

//      // Store all attachments from example1@example.com to the folder "Examples/example1"
//      { 
//        "filter": "has:attachment from:example1@example.com",
//        "folder": "'Examples/example1'"
//      }
//      // Store all pdf attachments from example2@example.com to the folder "Examples/example2"
//      {
//        "filter": "has:attachment from:example2@example.com",
//        "folder": "'Examples/example2'",
//        "filenameFromRegexp": ".*\.pdf$"
//      }

//      // Store all attachments from example3a@example.com OR from:example3b@example.com
//      // to the folder "Examples/example3ab" while renaming all attachments to the pattern
//      // defined in 'filenameTo' and archive the thread.
//      { 
//       "filter": "has:attachment (from:example3a@example.com OR from:example3b@example.com)",
//       "folder": "'Examples/example3ab'",
//        "filenameTo": "'file-'yyyy-MM-dd-'%s.txt'",
//        "archive": true
//      }

//      // Store threads marked with label "PDF" in the folder "PDF Emails" als PDF document.
//      {  
//        "filter": "label:PDF",
//        "saveThreadPDF": true,
//        "folder": "PDF Emails"
//      }

//      // Store all attachments named "file.txt" from example4@example.com to the
//      // folder "Examples/example4" and rename the attachment to the pattern
//      // defined in 'filenameTo' and archive the thread.
//      { 
//        "filter": "has:attachment from:example4@example.com",
//        "folder": "'Examples/example4'",
//        "filenameFrom": "file.txt",
//        "filenameTo": "'file-'yyyy-MM-dd-'%s.txt'"
//      }
