// Gmail2GDrive
// https://github.com/ahochsteger/gmail2gdrive

/**
 * Returns the label with the given name or creates it if not existing.
 */
function getOrCreateLabel(labelName) {
  var label = GmailApp.getUserLabelByName(labelName);
  if (label == null) {
    label = GmailApp.createLabel(labelName);
  }
  return label;
}

/**
 * Recursive function to create and return a complete folder path.
 */
function getOrCreateSubFolder(baseFolder,folderArray) {
  if (folderArray.length == 0) {
    return baseFolder;
  }
  var nextFolderName = folderArray.shift();
  var nextFolder = null;
  var folders = baseFolder.getFolders();
  while (folders.hasNext()) {
    var folder = folders.next();
    if (folder.getName() == nextFolderName) {
      nextFolder = folder;
      break;
    }
  }
  if (nextFolder == null) {
    // Folder does not exist - create it.
    nextFolder = baseFolder.createFolder(nextFolderName);
  }
  return getOrCreateSubFolder(nextFolder,folderArray);
}

/**
 * Returns the GDrive folder with the given path.
 */
function getFolderByPath(path) {
  var parts = path.split("/");

  if (parts[0] == '') parts.shift(); // Did path start at root, '/'?

  var folder = DriveApp.getRootFolder();
  for (var i = 0; i < parts.length; i++) {
    var result = folder.getFoldersByName(parts[i]);
    if (result.hasNext()) {
      folder = result.next();
    } else {
      throw new Error( "folder not found." );
    }
  }
  return folder;
}

/**
 * Returns the GDrive folder with the given name or creates it if not existing.
 */
function getOrCreateFolder(folderName) {
  var folder;
  try {
    folder = getFolderByPath(folderName);
  } catch(e) {
    var folderArray = folderName.split("/");
    folder = getOrCreateSubFolder(DriveApp.getRootFolder(), folderArray);
  }
  return folder;
}

/**
 * Processes a message
 */
function processMessage(message, rule, config) {
  Logger.log("INFO:       Processing message: "+message.getSubject() + " (" + message.getId() + ")");
  var messageDate = message.getDate();
  var attachments = message.getAttachments();
  for (var attIdx=0; attIdx<attachments.length; attIdx++) {
    var attachment = attachments[attIdx];
    Logger.log("INFO:         Processing attachment: "+attachment.getName());
    var match = true;
    if (rule.filenameFromRegexp) {
    var re = new RegExp(rule.filenameFromRegexp);
      match = (attachment.getName()).match(re);
    }
    if (!match) {
      Logger.log("INFO:           Rejecting file '" + attachment.getName() + " not matching" + rule.filenameFromRegexp);
      f_addaline_log_file_SpreadsheetApp(message.getSubject(),message.getDate(),message.getId(),"https://mail.google.com/mail/u/0/#inbox/" + message.getId(),"Attachment",attachment.getName(),"Rejected: not matching" + rule.filenameFromRegexp);
      continue;
    }
    try {
      var folder = getOrCreateFolder(Utilities.formatDate(messageDate, config.timezone, rule.folder));
      var file = folder.createFile(attachment);
      var filename = file.getName();
      if (rule.filenameFrom && rule.filenameTo && rule.filenameFrom == file.getName()) {
        filename = Utilities.formatDate(messageDate, config.timezone, rule.filenameTo.replace('%s',message.getSubject()));
        Logger.log("INFO:           Renaming matched file '" + file.getName() + "' -> '" + filename + "'");
        file.setName(filename);
      }
      else if (rule.filenameTo) {
        filename = Utilities.formatDate(messageDate, config.timezone, rule.filenameTo.replace('%s',message.getSubject()));
        Logger.log("INFO:           Renaming '" + file.getName() + "' -> '" + filename + "'");
        file.setName(filename);
      }
      file.setDescription("Mail title: " + message.getSubject() + "\nMail date: " + message.getDate() + "\nMail link: https://mail.google.com/mail/u/0/#inbox/" + message.getId());
      f_addaline_log_file_SpreadsheetApp(message.getSubject(),message.getDate(),message.getId(),"https://mail.google.com/mail/u/0/#inbox/" + message.getId(),"Attachment",file.getName(),file.getUrl());
      Utilities.sleep(config.sleepTime);
    } catch (e) {
      Logger.log(e);
    }
  }
}

/**
 * Generate HTML code for one message of a thread.
 */
function processThreadToHtml(thread) {
  Logger.log("INFO:   Generating HTML code of thread '" + thread.getFirstMessageSubject() + "'");
  var messages = thread.getMessages();
  var html = "";
  for (var msgIdx=0; msgIdx<messages.length; msgIdx++) {
    var message = messages[msgIdx];
    html += "From: " + message.getFrom() + "<br />\n";
    html += "To: " + message.getTo() + "<br />\n";
    html += "Date: " + message.getDate() + "<br />\n";
    html += "Subject: " + message.getSubject() + "<br />\n";
    html += "<hr />\n";
    html += message.getBody() + "\n";
    html += "<hr />\n";
  }
  return html;
}

/**
* Generate a PDF document for the whole thread using HTML from .
 */
function processThreadToPdf(thread, rule) {
  Logger.log("INFO: Saving PDF copy of thread '" + thread.getFirstMessageSubject() + "'");
  rule.folder = rule.folder.replace(/\'/g,'');
  var folder = getOrCreateFolder(rule.folder);
  var html = processThreadToHtml(thread);
  var blob = Utilities.newBlob(html, 'text/html');
  var pdf = folder.createFile(blob.getAs('application/pdf')).setName(thread.getFirstMessageSubject() + ".pdf");
  f_addaline_log_file_SpreadsheetApp(thread.getFirstMessageSubject(),thread.getLastMessageDate(),thread.getId(),"https://mail.google.com/mail/u/0/#inbox/" + thread.getId(),"Thread",pdf.getName(),pdf.getUrl());
  return pdf;
}

/**
 * Main function that processes Gmail attachments and stores them in Google Drive.
 * Use this as trigger function for periodic execution.
 */
function Gmail2GDrive() {
  if (!GmailApp) return; // Skip script execution if GMail is currently not available (yes this happens from time to time and triggers spam emails!)
  var config = getGmail2GDriveConfig();
  var label = getOrCreateLabel(config.processedLabel);
  var end, start, runTime;
  start = new Date(); // Start timer

  Logger.log("INFO: Starting mail attachment processing.");
  if (config.globalFilter===undefined) {
    config.globalFilter = "has:attachment -in:trash -in:drafts -in:spam";
  }

  // Prepare the Google SpreadSheet log file
  f_prepare_log_file_Int(config.logfilefolderpath);
  
  // Iterate over all rules:
  for (var ruleIdx=0; ruleIdx<config.rules.length; ruleIdx++) {
    var rule = config.rules[ruleIdx];
    var gSearchExp  = config.globalFilter + " " + rule.filter + " -label:" + config.processedLabel;
    if (config.newerThan != "") {
      gSearchExp += " newer_than:" + config.newerThan;
    }
    var doArchive = rule.archive == true;
    var doPDF = rule.saveThreadPDF == true;

    // Process all threads matching the search expression:
    var threads = GmailApp.search(gSearchExp);
    Logger.log("INFO:   Processing rule: "+gSearchExp);
    for (var threadIdx=0; threadIdx<threads.length; threadIdx++) {
      var thread = threads[threadIdx];
      end = new Date();
      runTime = (end.getTime() - start.getTime())/1000;
      Logger.log("INFO:     Processing thread: "+thread.getFirstMessageSubject() + " (runtime: " + runTime + "s/" + config.maxRuntime + "s)");
      if (runTime >= config.maxRuntime) {
        Logger.log("WARNING: Self terminating script after " + runTime + "s");
        return;
      }

      // Process all messages of a thread:
      var messages = thread.getMessages();
      for (var msgIdx=0; msgIdx<messages.length; msgIdx++) {
        var message = messages[msgIdx];
        processMessage(message, rule, config);
      }
      if (doPDF) { // Generate a PDF document of a thread:
        processThreadToPdf(thread, rule);
      }

      // Mark a thread as processed:
      thread.addLabel(label);

      if (doArchive) { // Archive a thread if required
        Logger.log("INFO:     Archiving thread '" + thread.getFirstMessageSubject() + "' ...");
        thread.moveToArchive();
      }
    }
  }
  end = new Date(); // Stop timer
  runTime = (end.getTime() - start.getTime())/1000;
  Logger.log("INFO: Finished mail attachment processing after " + runTime + "s");
}


// -----------------------------------------------------------------------------
// START: Google SpreadSheet log gile functions.
// -----------------------------------------------------------------------------
// Max Prat-Carrabin
// May 2020
// https://github.com/maxsnet

// Google Apps Script to add a Google Spreadsheet log file to the gmail2gdrive script (https://github.com/ahochsteger/gmail2gdrive),
// Following issue https://github.com/ahochsteger/gmail2gdrive/issues/37

// Naming conventions to functions and variables:
// -- First part in lowercase is a human understandable name.
// -- Second part with caps locks for first letters are the Class, seperated by a '_', to which they belong to.
// -- Functions start witf 'f_'
// Example: 
// -- Variable: folder_id_String designates a folder id, and is a String
// -- Function: f_folder_DriveApp_Folder returns a folder as a DriveApp.Folder 


// -----------------------------------------------------------------------------
// Prepare the SpreadsheetApp_Spreadsheet logfile from the String fodler path.
// Return 1
function f_prepare_log_file_Int(folder_path_String){
  
  var folder_id_String = f_getfolder_id_from_path_String(folder_path_String);
  var folder_DriveApp_Folder = f_folder_DriveApp_Folder(folder_id_String);
  var logfile_SpreadsheetApp_Spreadsheet = f_create_logfile_SpreadsheetApp_Spreadsheet(folder_DriveApp_Folder);
  var logfileId_String = logfile_SpreadsheetApp_Spreadsheet.getId()
  Logger.log("INFO: logfile created - spreadsheet Id:" + logfileId_String);
  
  // Put the log file Spreasheet Id in Cache. After that, f_logfile_SpreadsheetApp_Spreadsheet can be called to retriev the Spreadheet log file.
  CacheService.getScriptCache().put("logfileId_String", logfileId_String);
  
  // Logger.log("INFO: logfile spreadsheet Id cached:   " + CacheService.getScriptCache().get("logfileId_String"));
  // Logger.log("INFO: logfile spreadsheet Id cached_f: " + f_logfile_SpreadsheetApp_Spreadsheet().getId());
  
  f_add_headers_log_file_Int();

  return 1;  

}


// -----------------------------------------------------------------------------
// Return folder id String from the folder path String.
function f_getfolder_id_from_path_String(folder_path_String){
  
   return getOrCreateFolder(folder_path_String).getId(); 

}


// -----------------------------------------------------------------------------
// Returns the DriveApp_Folder folder from the String folder id.
function f_folder_DriveApp_Folder(folder_id_String){
  
  return DriveApp.getFolderById(folder_id_String);    

}


// -----------------------------------------------------------------------------
// Returns and opens SpreadsheetApp.Spreadsheet log file
function f_logfile_SpreadsheetApp_Spreadsheet(){
  
   return SpreadsheetApp.openById(CacheService.getScriptCache().get("logfileId_String"));
   
}


// -----------------------------------------------------------------------------
// Creates the log file on Goole Drive in the indicated DriveApp_Folder folder.
// Then returns it, as SpreadsheetApp_Spreadsheet, by opening it.
function f_create_logfile_SpreadsheetApp_Spreadsheet(folder_DriveApp_Folder) {

  // -----------------------------------------------------------------------------
  // Prepare Log File Name ( log + date )
  var logfname_String   = "log" + Utilities.formatDate(new Date(), "GMT", "yyyyMMdd HH:mm:ss");
  
  // -----------------------------------------------------------------------------
  // Create temporary Spreadsheet at the root of the Google Drive folder
  // returns SpreadsheetApp.Spreadsheet
  // https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet
  var logfiletemp_SpreadsheetApp_Spreadsheet = SpreadsheetApp.create(logfname_String);
  
  // Logger.log("INFO: temp logfile created -        Id:" + logfiletemp_SpreadsheetApp_Spreadsheet.getId());

  // -----------------------------------------------------------------------------  
  // Get the SpreadsheetApp.Spreadsheet temporary log file as a DriveApp.File
  var logfiletemp_DriveApp_File = DriveApp.getFileById(logfiletemp_SpreadsheetApp_Spreadsheet.getId());

  // -----------------------------------------------------------------------------
  // Copy the temporary log file into its final destination
  // DriveApp.File.makeCopy(name, Destinateion)
  // name	is String	
  // destination	is Folder	
  // returns  File
  // https://developers.google.com/apps-script/reference/drive/file#makecopydestination
  //var logfile_DriveApp_File = logfiletemp_DriveApp_File.makeCopy(logfname_String,DriveApp.getFolderById(folder_id_String));
  var logfile_DriveApp_File = logfiletemp_DriveApp_File.makeCopy(logfname_String,folder_DriveApp_Folder);
    
  Logger.log("INFO: logfile created: " + logfile_DriveApp_File.getUrl());

  // -----------------------------------------------------------------------------
  // Delete the temporary log file
  // DriveApp.removeFile(child) 
  // child is a file
  // returns Folder
  DriveApp.removeFile(logfiletemp_DriveApp_File);
  // Logger.log("INFO: temp logfile deleted.");

  return SpreadsheetApp.openById(logfile_DriveApp_File.getId());
  
}


// -----------------------------------------------------------------------------
// Adds the header (the first line) to the log file SpreadsheetApp_Spreadsheet
// Return 1
function f_add_headers_log_file_Int(){
    
  f_addaline_log_file_SpreadsheetApp("Mail title","Mail date","Mail id","Mail link","File Origine","File Name","File Link");
  return 1;
    
}


function f_addaline_log_file_SpreadsheetApp(A,B,C,D,E,F,G){
  
  // -----------------------------------------------------------------------------
  // Google comments:  
  // for most use cases
  // the built-in method SpreadsheetApp.getActiveSpreadsheet()
  // .getRange(range).setValues(values) is more appropriate.
  
  // -----------------------------------------------------------------------------
  // Documentation:
  // setvalues https://developers.google.com/apps-script/reference/spreadsheet/range#setvaluesvalues
  // range https://developers.google.com/apps-script/reference/spreadsheet/range
  // getrange https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet#getRange(String)
  // spreadsheet https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet
  // getactivespreadsheet https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#getactivespreadsheet
  // activespreadsheet https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#getActiveSpreadsheet()
  // spreadsheet app https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
  
  // -----------------------------------------------------------------------------
  // SpreadsheetApp.Spreadsheet.Range.setValues(values)
  // values is	Object[][],	A two-dimensional array of values. - The size of the two-dimensional array must match the size of the range.
  // Returns Range — This range, for chaining.
  //
  // Exemple:
  // var ss = SpreadsheetApp.getActiveSpreadsheet();
  // var sheet = ss.getSheets()[0];
  // 
  // var values = [
  //   [ "2.000", "1,000,000", "$2.99" ]
  // ];
  // 
  // var range = sheet.getRange("B2:D2");
  // range.setValues(values);
  
  // -----------------------------------------------------------------------------
  // SpreadsheetApp.Spreadsheet.getSheets() - Gets all the sheets in this spreadsheet.
  // returns Sheet[] — An array of all the sheets in the spreadsheet.
  //
  // Exemple:
  // The code below logs the name of the second sheet
  // var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  // if (sheets.length > 1) {
  //  Logger.log(sheets[1].getName());
  // }
  
  var values_Object2 = [[ A,B,C,D,E,F,G ]];
  var sheet_SpreadsheetApp_Spreadsheet_Sheet = f_logfile_SpreadsheetApp_Spreadsheet().getSheets()[0];
  
  // SpreadsheetApp.SpreadSheet.Sheet.getLastRow()
  // https://developers.google.com/apps-script/reference/spreadsheet/sheet#getLastRow()
  // Return Integer — the last row of the sheet that contains content
  var lastrow_Int = sheet_SpreadsheetApp_Spreadsheet_Sheet.getLastRow()+1;
  sheet_SpreadsheetApp_Spreadsheet_Sheet.getRange("A" + lastrow_Int + ":G" + lastrow_Int).setValues(values_Object2);
  
}

function main(){
 Gmail2GDrive();
 return 1;
}

// -----------------------------------------------------------------------------
// END: Google SpreadSheet log gile functions.
// -----------------------------------------------------------------------------
