// -----------------------------------------------------------------------------
// Original https://github.com/ahochsteger/gmail2gdrive/
// Updated May 2020, by Max Prat-Carrabin https://maxsnet.github.io/gmail2gdrive/
// Updated April 2021, by Max Prat-Carrabin https://maxsnet.github.io/gmail2gdrive/

// -----------------------------------------------------------------------------
// Explanations of rules:

//   active             skip the rule if false
//   filter             gmail filter
//   maxmailsinThread   Only the threads of messages with less or even messages as maxmailsinThread will be treated 
//                      Enter 1 to filter out all threads with at least one reply or a forward. Enter 0 for no limit
//   folder             is the folder name in the Google Drive where the files will be saved. Surrounded by single quotes
//   saveThreadPDF      save the thread email as a pdf (google drive), but you can decide to save attahments only
//   archive            archive the mail (gmail)

//   filenameFrom       only stores attachements of those name
//   filenameFromRegexp filters the files using RegEx
  
//   filenameTo         rename the file saved:
//     '%s'     is replaced by the name fo the file / the subject of the mail
//     '%t'     is replaced by the file source: 'mail' or 'file'
//     '%id'    is replaced by the 3 last caracters of the id of the mail
//     '%from'  is replaced by the sender email
//     '%to'    is replaced by the email recipient
//   the simple quotes are required

//   filenameReplaceFrom: if this text is found in the filename, then it will be replaced by filenameReplaceTo
//   filenameReplaceTo:   look for filenameReplaceFrom in the filename and replaces by this

// -----------------------------------------------------------------------------
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
// Timezone
config.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// -----------------------------------------------------------------------------
// Global setup to update
// Gmail label for processed threads (will be created if not existing):
config.processedLabel =      "to-gdrive/processed";
// Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year):
config.newerThan =           "1m";
// Should a log file be created ?
config.logfilecreate =        false;
// Path of the log gile folder.
config.logfilefolderpath =    "MY FOLDER/Documents/GM2GD/LogFile";
// Make filename computer filesystem accepted (not required if the file will always stay on Google Drive)
config.fnameComputerReady =   true

// -----------------------------------------------------------------------------
// Rules Setup to update
// To define rules, duplicate below from "START SETUP" to "END SETUP" as many times as you want.


// START SETUP: Rule
rule.active =              true;
rule.filter =              "from:me to:me";
rule.maxmailsinThread =    1;
//rule.folder must be surroudned by single quotes
rule.folder =              "'MY FOLDER/Documents/GM2GD/ToDo'";
rule.saveThreadPDF =       true;
rule.archive =             true;
rule.filenameFrom =        "";
rule.filenameFromRegexp =  "";
rule.filenameTo =          "yyyyMMdd-'%id'-'%t'-'%s'";
rule.filenameReplaceFrom = "";
rule.filenameReplaceTo =   "";

// Do not touch (but keep it at the end of each rule setup)
config.rules.push(rule);
var rule = {};

// END SETUP: Rule 


// START SETUP: Rule
rule.active =              true;
rule.filter =              "has:attachment";
rule.maxmailsinThread =    0;
//rule.folder must be surroudned by single quotes
rule.folder =              "'MY FOLDER/Documents/GM2GD/Files'";
rule.saveThreadPDF =       false;
rule.archive =             true;
rule.filenameFrom =        "";
rule.filenameFromRegexp =  "";
rule.filenameTo =          "yyyyMMdd-'%id'-'%t'-'%s'";
rule.filenameReplaceFrom = "";
rule.filenameReplaceTo =   "";

// Do not touch (but keep it at the end of each rule setup)
config.rules.push(rule);
var rule = {};
                   
// END SETUP: Rule  



// START SETUP: Rule
rule.active =              true;
rule.filter =              "raspberry";
rule.maxmailsinThread =    0;
//rule.folder must be surroudned by single quotes
rule.folder =              "RasF";
rule.saveThreadPDF =       true;
rule.archive =             true;
//rule.filenameFrom =        "";
rule.filenameFromRegexp =  ".*\.doc$";
rule.filenameTo =          "'%id'-'%s'-'%from'";
rule.filenameReplaceFrom = "raspberry";
rule.filenameReplaceTo =   "blueberry";

// Do not touch (but keep it at the end of each rule setup)
config.rules.push(rule);
var rule = {};

// END SETUP: Rule 


// START SETUP: Rule
rule.active =              true;
rule.filter =              "from:amazon.com";
rule.maxmailsinThread =    0;
//rule.folder must be surroudned by single quotes
rule.folder =              "'MY FOLDER/Documents/GM2GD/AmazonMails'";
rule.saveThreadPDF =       true;
rule.archive =             true;
rule.filenameFrom =        "";
rule.filenameFromRegexp =  "";
rule.filenameTo =          "MMdd-'%id'-'%s'";
rule.filenameReplaceFrom = "";
rule.filenameReplaceTo =   "";

// Do not touch (but keep it at the end of each rule setup)
config.rules.push(rule);
var rule = {};

// END SETUP: Rule 

