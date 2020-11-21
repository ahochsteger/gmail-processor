// Gmail2GDrive
// https://github.com/ahochsteger/gmail2gdrive

// Modified by 
// Max Prat-Carrabin
// Novembre 2020. V0.2
// https://github.com/maxsnet

// Naming conventions of functions and variables:
// -- First part in lowercase is a human understandable name.
// -- Second part with caps locks for first letters are the Class, seperated by a '_', to which they belong to.
// -- Functions start witf 'f_'
// Example: 
// -- Variable: folder_id_String designates a folder id, and is a String
// -- Function: f_folder_DriveApp_Folder returns a folder as a DriveApp.Folder 

// -----------------------------------------------------------------------------
// Function to run.
function main(){
  
 Logger.log("Main: // --------------------------");
 Logger.log("Main: STARTING");
 
 if ( f_Gmail2GDrive_Int() === 1 ) {
  Logger.log("Main: SUCCESS");
 }
 else {
   Logger.log("Main: FAILED");
 }
 
 Logger.log("Main: // --------------------------");
 Logger.log("Main: ENDING");

 return 1;
  
}

// -----------------------------------------------------------------------------
// Main function that processes Gmail attachments and stores them in Google Drive.
// Return 1 if success, 0 if not.
function f_Gmail2GDrive_Int() {
 
  // Start timer
  var end_Date, start_Date, runTime_Int;
  var start_Date = new Date();
 
  // Check if the required apps are available
  if(f_check_apps_Int() === 0){
     Logger.log("Gmail2GDrive: Google Apps not ready, try again later.");
     return 0;    
  }
  else {
     Logger.log("Gmail2GDrive: Google Apps are ready.");
  }
  
  // Check the config
  if(f_check_config_Int() === 0){
    Logger.log("Gmail2GDrive: Failed to check config.");
    return 0;    
  }
     else {
     Logger.log("Gmail2GDrive: Sucessfully checked config.");
  }
  
  var config_globalFilter_String       = config.globalFilter;
  var config_sleepTime_Int             = config.sleepTime;
  var config_maxRuntime_Int            = config.maxRuntime;
  var config_maxNameLength_String      = config.maxNameLength;
  var config_timezone_String           = config.timezone;
  var config_processedLabel_String     = config.processedLabel;
  var config_newerThan_String          = config.newerThan;
  var config_logfilecreate_Bolean      = config.logfilecreate;
  var config_logfilefolderpath_String  = config.logfilefolderpath;
  var config_logfilefixedname_Bolean   = config.logfilefixedname;
  var config_fnameComputerReady_Bolean = config.fnameComputerReady;
  
  var label_GmailApp_GmailLabel = f_getOrCreateLabel(config_processedLabel_String);
  
  // Prepare the Google SpreadSheet log file
  if(f_prepare_log_file_Int(config.logfilefolderpath, config_logfilecreate_Bolean ) === 0){
    Logger.log("Gmail2GDrive: Google Spreadsheet log file not created.");
    //return 0;
  }
  else {
    Logger.log("Gmail2GDrive: Created Google Spreadsheet log file.");
  }
    
  Logger.log("Gmail2GDrive: Starting mail attachment processing.");

  // Iterate over all rules
  for (var rule_id_Int=0; rule_id_Int < config.rules.length; rule_id_Int++) {
    
    var rule_Obj = config.rules[rule_id_Int];
    rule_Obj = f_check_rule_Obj(rule_Obj);

    var rule_active_Bolean              = rule_Obj.active;
    var rule_filter_String              = rule_Obj.filter;
    var rule_folder_String              = rule_Obj.folder;
    var rule_saveThreadPDF_Bolean       = rule_Obj.saveThreadPDF;
    var rule_archive_Bolean             = rule_Obj.archive;
    var rule_filenameFrom_String        = rule_Obj.filenameFrom;
    var rule_filenameFromRegexp_String  = rule_Obj.filenameFromRegexp;
    var rule_filenameTo_String          = rule_Obj.filenameTo;
    var rule_filenameReplaceFrom_String = rule_Obj.filenameReplaceFrom;
    var rule_filenameReplaceTo_String   = rule_Obj.filenameReplaceTo;

    var search_exp_String = config_globalFilter_String + " " + rule_filter_String +  " -label:" + config_processedLabel_String;
    if (config_newerThan_String != "") { search_exp_String += " newer_than:" + config_newerThan_String; }
   
     if(rule_active_Bolean === false){
        Logger.log("Gmail2GDrive: Skipping rule: "+ search_exp_String);    
        continue;
     }
   
    // Get the array of threads corresponding to the search
    var threads_GmailApp_GmailThread_Array = GmailApp.search(search_exp_String);

    Logger.log("Gmail2GDrive: Processing rule: " + search_exp_String);
    Logger.log("https://mail.google.com/mail/u/0/#search/" + encodeURIComponent(search_exp_String));
    Logger.log("Gmail2GDrive: Found " + threads_GmailApp_GmailThread_Array.length + " thread(s) of mail for this rule.");
        
    // Process the threads   
    for (var thread_id_Int=0; thread_id_Int < threads_GmailApp_GmailThread_Array.length; thread_id_Int++) {
      
      var thread_GmailApp_GmailThread = threads_GmailApp_GmailThread_Array[thread_id_Int];
      
      // Inform about runtime and stops if too long
      end_Date = new Date();
      runTime_Int = (end_Date.getTime() - start_Date.getTime())/1000;
      Logger.log("Gmail2GDrive: Processing thread: "+thread_GmailApp_GmailThread.getFirstMessageSubject() + " (runtime: " + runTime_Int + "s/" + config_maxRuntime_Int + "s)");
      if (runTime_Int >= config_maxRuntime_Int) {
        Logger.log("Gmail2GDrive: WARNING: Self terminating script after " + runTime_Int + "s");
        return 0;
      }

      var messages_GmailApp_GmailMessage_Array = thread_GmailApp_GmailThread.getMessages();
      
      // Process all messages of a thread
      for (var msg_id_Int=0; msg_id_Int < messages_GmailApp_GmailMessage_Array.length; msg_id_Int++) {
        
        var message_GmailApp_GmailMessage = messages_GmailApp_GmailMessage_Array[msg_id_Int];
        var message_isintrash_Bolean = message_GmailApp_GmailMessage.isInTrash();

        // Process the message if it is not in Trash
        if (  message_isintrash_Bolean !== true ) { f_processMessage(message_GmailApp_GmailMessage, rule_Obj, config_logfilecreate_Bolean ); }    
        
      }
      
      if (rule_saveThreadPDF_Bolean) { f_processThreadToPdf(thread_GmailApp_GmailThread, rule_Obj); }

      thread_GmailApp_GmailThread.addLabel(label_GmailApp_GmailLabel);

      if (rule_archive_Bolean) { 
        Logger.log("Gmail2GDrive: Archiving thread '" + thread_GmailApp_GmailThread.getFirstMessageSubject() + "' ...");
        thread_GmailApp_GmailThread.moveToArchive();
      }
      
    }
    
  }
  
  end_Date = new Date();
  runTime_Int = (end_Date.getTime() - start_Date.getTime())/1000;
  Logger.log("Gmail2GDrive: Finished mail attachment processing after " + runTime_Int + "s");
  
  return 1;
  
}



function f_check_config_Int(){
  
  if (config.globalFilter===undefined || config.globalFilter==="") {
    config.globalFilter = "has:attachment -in:trash -in:drafts -in:spam";
  }

  if (config.sleepTime===undefined || config.sleepTimer==="") {
    config.sleepTime = 100;
  }
  
  if (config.maxRuntime===undefined || config.maxRuntime==="") {
    config.maxRuntime = 280;
  }
  
   if (config.maxNameLength===undefined || config.maxNameLength==="") {
    config.maxNameLength = 150;
  }
  
  if (config.timezone===undefined || config.timezone==="") {
    config.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  if (config.processedLabel===undefined || config.processedLabele==="") {
    config.processedLabel = "to-gdrive/processed";
  }

  if (config.newerThan===undefined) {
    config.newerThan = "1m";
  }
  
  if (config.logfilecreate===undefined) {
    config.logfilecreate = true;
  }

  if (config.logfilefolderpath===undefined) {
    config.logfilefolderpath = "GM2GD";
  }

  if (config.logfilefixedname===undefined) {
    config.logfilefixednameh = true;
  }

  if (config.fnameComputerReady===undefined) {
    config.fnameComputerReady = true;
  }
  
  return 1;
  
}


function f_check_apps_Int(){

  // Skip script execution if apps is currently not available 
  if (!GmailApp) return 0;
  if (!DriveApp) return 0; 
  if (!SpreadsheetApp) return 0;

  return 1;
  
}


function f_check_rule_Obj(rule_Obj){

  if (rule_Obj.archive===undefined || rule_Obj.archive==="") {
    rule_Obj.archive = true;
  }
  
  if (rule_Obj.saveThreadPDF===undefined || rule_Obj.saveThreadPDF==="") {
    rule_Obj.saveThreadPDF = true;
  }  
  
  
  if (rule_Obj.folder===undefined || rule_Obj.folder==="") {
    rule_Obj.folder = "GM2GD";
  }  
  
  return rule_Obj;
  
}


/**
 * Returns the label with the given name or creates it if not existing.
 */
function f_getOrCreateLabel(labelName) {
  var label = GmailApp.getUserLabelByName(labelName);
  if (label == null) {
    label = GmailApp.createLabel(labelName);
  }
  return label;
}

/**
 * Recursive function to create and return a complete folder path.
 */
function f_getOrCreateSubFolder(baseFolder,folderArray) {
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
  return f_getOrCreateSubFolder(nextFolder,folderArray);
}

/**
 * Returns the GDrive folder with the given path.
 */
function f_getFolderByPath(path) {
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
function f_getOrCreateFolder(folderName) {
  var folder;
  try {
    folder = f_getFolderByPath(folderName);
  } catch(e) {
    var folderArray = folderName.split("/");
    folder = f_getOrCreateSubFolder(DriveApp.getRootFolder(), folderArray);
  }
  return folder;
}

/**
 * Processes a message
 */
// Process a message: extract attachement one by one,  upload it, rename it and add a description
function f_processMessage(message, rule) {
  
  Logger.log("processMessage: Processing message: "+message.getSubject() + " (" + message.getId() + ")");
  var timezone = config.timezone;
  var messageDate = message.getDate();
  var attachments = message.getAttachments();
  for (var attIdx=0; attIdx<attachments.length; attIdx++) {
    var attachment = attachments[attIdx];
    Logger.log("processMessage: Processing attachment: "+attachment.getName());
    
    var match = true;
    if (rule.filenameFromRegexp) {
    var re = new RegExp(rule.filenameFromRegexp);
      match = (attachment.getName()).match(re);
    }
    if (!match) {
      Logger.log("processMessage: Rejecting file '" + attachment.getName() + " not matching" + rule.filenameFromRegexp);
      f_addaline_log_file_SpreadsheetApp(message.getSubject(),message.getDate(),message.getId(),"https://mail.google.com/mail/u/0/#inbox/" + message.getId(),"Attachment",attachment.getName(),"Rejected: not matching" + rule.filenameFromRegexp);
      continue;
    }
    try {
     var folder = f_getOrCreateFolder(Utilities.formatDate(messageDate, timezone, rule.folder));
     var file = folder.createFile(attachment);
     var filename = file.getName();
      
     filename = f_NewFileName(filename, rule, message, "file");
     file.setName(filename);
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
function f_processThreadToHtml(thread) {
  Logger.log("processThreadToHtml: Generating HTML code of thread '" + thread.getFirstMessageSubject() + "'");
  var messages = thread.getMessages();
  var html = "";
  
  for (var msg_id_Int=0; msg_id_Int<messages.length; msg_id_Int++) {
    var message = messages[msg_id_Int];
    var message_isintrash = message.isInTrash();
        if ( message_isintrash !== true ) {
          Logger.log("processThreadToHtml: Message not in trash: processing." );

          html += "From: " + message.getFrom() + "<br />\n";
          html += "To: " + message.getTo() + "<br />\n";
          html += "Date: " + message.getDate() + "<br />\n";
          html += "Subject: " + message.getSubject() + "<br />\n";
          html += "<hr />\n";
          html += message.getBody() + "\n";
          html += "<hr />\n";
         }        
      }

  return html;
}

/**
* Generate a PDF document for the whole thread using HTML from .
 */
function f_processThreadToPdf(thread,rule) {
  Logger.log("processThreadToPdf: Saving PDF copy of thread '" + thread.getFirstMessageSubject() + "'");
  
  var messages = thread.getMessages();
  var message = messages[0];
  var filename = f_NewFileName(message.getSubject(), rule, message,"mail") + ".pdf";
    
  var cleanrulefolder = rule.folder.replace(/\'/g,'');
  var folder = f_getOrCreateFolder(cleanrulefolder);
  
  var html = f_processThreadToHtml(thread);
  var blob = Utilities.newBlob(html, 'text/html');
  var pdf = folder.createFile(blob.getAs('application/pdf')).setName(filename);
  
  f_addaline_log_file_SpreadsheetApp(thread.getFirstMessageSubject(),thread.getLastMessageDate(),thread.getId(),"https://mail.google.com/mail/u/0/#inbox/" + thread.getId(),"Thread",pdf.getName(),pdf.getUrl());
  
  return 1;
}


// -----------------------------------------------------------------------------
// START: Google SpreadSheet log gile functions.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prepare the SpreadsheetApp_Spreadsheet logfile from the String fodler id.
// Return 1
function f_prepare_log_file_Int(folder_path_String, islogfile_Bolean){

  // -----------------------------------------------------------------------------
  // Documentation:
  // Class CacheService https://developers.google.com/apps-script/reference/cache/cache-service
  // Class Cache https://developers.google.com/apps-script/reference/cache/cache
  
  // -----------------------------------------------------------------------------
  // getScriptCache(): Gets the cache instance scoped to the script. Script caches are common to all users of the script. Use these to store information that is not specific to the current user.
  // getScriptCache(): Gets a cache that is common to all users of the script.
  // Returns Cache — a script cache instance
  
  // -----------------------------------------------------------------------------
  // CacheService.getScriptCache().put(key, value): Adds a key/value pair to the cache.
  // The maximum length of a key is 250 characters. The maximum amount of data that can be stored per key is 100KB. The value will expire from the cache after 600 seconds (10 minutes).
  //
  // Exemple: Puts the value 'bar' into the cache using the key 'foo': cache.put('foo', 'bar');
  // key and value are String
    
   
  // islogfile indicates if the log file chould be created. This value is kept in cach to be used by other functions.
  CacheService.getScriptCache().put("islogfile_String", islogfile_Bolean.toString());
  var islogfile_String = CacheService.getScriptCache().get("islogfile_String");
  if( islogfile_String === 'false'){
    Logger.log("prepare_log_file: Config says not to create a log file.");
    return 0;
  }  
 
  var folder_id_String = f_getfolder_id_from_path_String(folder_path_String);
  var folder_DriveApp_Folder = f_folder_DriveApp_Folder(folder_id_String);
  var logfile_SpreadsheetApp_Spreadsheet = f_create_logfile_SpreadsheetApp_Spreadsheet(folder_DriveApp_Folder);
  var logfileId_String = logfile_SpreadsheetApp_Spreadsheet.getId()
  Logger.log("prepare_log_file: logfile created - spreadsheet Id:" + logfileId_String);
  
  // Put the log file Spreasheet Id in Cache. After that, f_logfile_SpreadsheetApp_Spreadsheet can be called to retrieve the Spreadheet log file.
  CacheService.getScriptCache().put("logfileId_String", logfileId_String);
  
  // Logger.log("logfile spreadsheet Id cached:   " + CacheService.getScriptCache().get("logfileId_String"));
  // Logger.log("logfile spreadsheet Id cached_f: " + f_logfile_SpreadsheetApp_Spreadsheet().getId());
  
  f_add_headers_log_file_Int();
     
  return 1;  

}


// -----------------------------------------------------------------------------
// Return folder id String from the folder path String.
function f_getfolder_id_from_path_String(folder_path_String){
  
   return f_getOrCreateFolder(folder_path_String).getId(); 

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

  var timezone = config.timezone;

  // -----------------------------------------------------------------------------
  // Prepare Log File Name ( log + date )
  var logfname_String   = "log" + Utilities.formatDate(new Date(), timezone, "yyyyMMdd HH:mm:ss");
  
  // -----------------------------------------------------------------------------
  // Create temporary Spreadsheet at the root of the Google Drive folder
  // returns SpreadsheetApp.Spreadsheet
  // https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet
  var logfiletemp_SpreadsheetApp_Spreadsheet = SpreadsheetApp.create(logfname_String);
  
  // Logger.log("temp logfile created -        Id:" + logfiletemp_SpreadsheetApp_Spreadsheet.getId());

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
    
  Logger.log("create_logfile: logfile created: " + logfile_DriveApp_File.getUrl());

  // -----------------------------------------------------------------------------
  // Delete the temporary log file
  // DriveApp.removeFile(child) 
  // child is a file
  // returns Folder
  DriveApp.removeFile(logfiletemp_DriveApp_File);
  // Logger.log("temp logfile deleted.");

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
  
  var islogfile_String = CacheService.getScriptCache().get("islogfile_String");
  if( islogfile_String === 'false'){
    // not adding a line because the log file has not (and should not, as per the config) been created.
    return 0;
  }  
  
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

// -----------------------------------------------------------------------------
// END: Google SpreadSheet log gile functions.
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// START: function to improve filename.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Returns a new filename using 'rule.filenameTo' from config.gs
function f_NewFileName(name, rule, message, type) {
  
  var filenameTo  = rule.filenameTo;
  var replaceFrom = rule.filenameReplaceFrom;
  var replaceTo   = rule.filenameReplaceTo;
  var date        = message.getDate();
  var id          = message.getId();
  var from        = message.getFrom();
  var to          = message.getTo();

  name        = name        || ""; 
  replaceFrom = replaceFrom || ""; 
  replaceTo   = replaceTo   || ""; 

  var timezone = config.timezone;

  // Replace date
  filename = Utilities.formatDate(date, timezone, filenameTo);
  
  // Replace email id
  id = id.substr(id.length-3, 3);
  filename = filename.replace('%id',id);  
  
  // Replace To
  filename = filename.replace('%to',to);
  
  // Add type
  filename = filename.replace('%t',type);
  
  // Replace from
  filename = filename.replace('%from',from);
  
  // Replace word chosen by user
   if ( replaceFrom != "" && replaceTo != "" ) { 
    filename = filename.replace(rule.filenameReplaceFrom,rule.filenameReplaceTo);
  }

  // Replace mail topic
  filename = filename.replace('%s',name); //email topic

  // Make computer ready
  if ( config.fnameComputerReady === true ) { 
    filename = f_removeDiacritics(filename);
    config.maxNameLength = Math.min(config.maxNameLength,"250");
  }
  
  // Final setup
  filename = filename.substr(0, config.maxNameLength);
  filename = filename.trim();
    
  Logger.log("NewFileName: Created a new  filename: " + filename);
  
  return filename;
}


// -----------------------------------------------------------------------------
// Source: https://stackoverflow.com/questions/30576304/parsing-special-characters-in-google-apps-script
// usage : var userName = f_removeDiacritics(userNameWithIllegalCharacters);
var defaultDiacriticsRemovalap = [
    {'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
    {'base':'AA','letters':'\uA732'},
    {'base':'AE','letters':'\u00C6\u01FC\u01E2'},
    {'base':'AO','letters':'\uA734'},
    {'base':'AU','letters':'\uA736'},
    {'base':'AV','letters':'\uA738\uA73A'},
    {'base':'AY','letters':'\uA73C'},
    {'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
    {'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
    {'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'},
    {'base':'DZ','letters':'\u01F1\u01C4'},
    {'base':'Dz','letters':'\u01F2\u01C5'},
    {'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'},
    {'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
    {'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'},
    {'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'},
    {'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'},
    {'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'},
    {'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'},
    {'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'},
    {'base':'LJ','letters':'\u01C7'},
    {'base':'Lj','letters':'\u01C8'},
    {'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
    {'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'},
    {'base':'NJ','letters':'\u01CA'},
    {'base':'Nj','letters':'\u01CB'},
    {'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'},
    {'base':'OI','letters':'\u01A2'},
    {'base':'OO','letters':'\uA74E'},
    {'base':'OU','letters':'\u0222'},
    {'base':'OE','letters':'\u008C\u0152'},
    {'base':'oe','letters':'\u009C\u0153'},
    {'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
    {'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'},
    {'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'},
    {'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'},
    {'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'},
    {'base':'TZ','letters':'\uA728'},
    {'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'},
    {'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
    {'base':'VY','letters':'\uA760'},
    {'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
    {'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'},
    {'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'},
    {'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'},
    {'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'},
    {'base':'aa','letters':'\uA733'},
    {'base':'ae','letters':'\u00E6\u01FD\u01E3'},
    {'base':'ao','letters':'\uA735'},
    {'base':'au','letters':'\uA737'},
    {'base':'av','letters':'\uA739\uA73B'},
    {'base':'ay','letters':'\uA73D'},
    {'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
    {'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
    {'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'},
    {'base':'dz','letters':'\u01F3\u01C6'},
    {'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'},
    {'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
    {'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'},
    {'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'},
    {'base':'hv','letters':'\u0195'},
    {'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'},
    {'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
    {'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'},
    {'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'},
    {'base':'lj','letters':'\u01C9'},
    {'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
    {'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'},
    {'base':'nj','letters':'\u01CC'},
    {'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'},
    {'base':'oi','letters':'\u01A3'},
    {'base':'ou','letters':'\u0223'},
    {'base':'oo','letters':'\uA74F'},
    {'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
    {'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'},
    {'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'},
    {'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'},
    {'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'},
    {'base':'tz','letters':'\uA729'},
    {'base':'u','letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'},
    {'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
    {'base':'vy','letters':'\uA761'},
    {'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
    {'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'},
    {'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'},
    {'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}
];

var diacriticsMap = {};
for (var i=0; i < defaultDiacriticsRemovalap.length; i++){
    var letters = defaultDiacriticsRemovalap[i].letters;
    for (var j=0; j < letters.length ; j++){
        diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
    }
}

// "what?" version ... http://jsperf.com/diacritics/12
function f_removeDiacritics(str) {
    return str.replace(/[^\u0000-\u007E]/g, function(a){ 
       return diacriticsMap[a] || a; 
    });
}


// -----------------------------------------------------------------------------
// END: functions to improve filename.
// -----------------------------------------------------------------------------

