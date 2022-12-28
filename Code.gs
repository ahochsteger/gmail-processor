// Gmail2GDrive
// https://github.com/ahochsteger/gmail2gdrive

/**
 * Main function that processes Gmail attachments and stores them in Google Drive.
 * Use this as trigger function for periodic execution.
 */
var rule_counter = 1;
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

  // Iterate over all rules:
  for (var ruleIdx=0; ruleIdx<config.rules.length; ruleIdx++) {
    var rule = config.rules[ruleIdx];
    var gSearchExp  = config.globalFilter + " " + rule.filter + " -label:" + config.processedLabel;
    rule_counter = 1; // Counts attachments matching this rule for %d in renameTo patterns
    var newerThan = rule.newerThan || config.newerThan;
    if (newerThan != "") {
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
        processThreadToPdf(thread, rule, config);
      }

      if(rule.ruleLabel) {
        thread.addLabel(getOrCreateLabel(rule.ruleLabel));
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
 * "parentFolderId": is optional
 */
function getFolderByPath(path, parentFolderId) {
  var parts = path.split("/");

  if (parts[0] == '') parts.shift(); // Did path start at root, '/'?

  var folder = parentFolderId ? DriveApp.getFolderById(parentFolderId) : DriveApp.getRootFolder();

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
 * "parentFolderId": is optional
 */
function getOrCreateFolder(folderName, parentFolderId) {
  var folder;
  try {
    folder = getFolderByPath(folderName, parentFolderId);
  } catch(e) {
    var folderArray = folderName.split("/");
    var parentFolder = parentFolderId ? DriveApp.getFolderById(parentFolderId) : DriveApp.getRootFolder();

    if (parentFolder) {
      folder = getOrCreateSubFolder(parentFolder, folderArray);
    }
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
      continue;
    }
    try {
      var folderName = Utilities.formatDate(messageDate, config.timezone, rule.folder.replace('%s', message.getSubject()));
      folderName = folderName.replace(':', '');
      Logger.log("Saving to folder" + folderName);
      var folder = getOrCreateFolder(folderName, rule.parentFolderId);
      var file = folder.createFile(attachment);
      var original_attachment_name = file.getName();
      var new_filename = rule.filenameTo.replace('%s',message.getSubject()).replace("%d", String(rule_counter++)).replace('%o', original_attachment_name)
      if (rule.filenameFrom && rule.filenameTo && rule.filenameFrom == file.getName()) {
        var final_attachment_name = Utilities.formatDate(messageDate, config.timezone, new_filename);
        Logger.log("INFO:           Renaming matched file '" + file.getName() + "' -> '" + final_attachment_name + "'");
        file.setName(final_attachment_name);
      }
      else if (rule.filenameTo) {
        var final_attachment_name = Utilities.formatDate(messageDate, config.timezone, new_filename);
        Logger.log("INFO:           Renaming '" + file.getName() + "' -> '" + final_attachment_name + "'");
        file.setName(final_attachment_name);
      }
      file.setDescription("Mail title: " + message.getSubject() + "\nMail date: " + message.getDate() + "\nMail link: https://mail.google.com/mail/u/0/#inbox/" + message.getId());
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
function processThreadToPdf(thread, rule, config) {
  Logger.log("INFO: Saving PDF copy of thread '" + thread.getFirstMessageSubject() + "'");
  var threadDate = thread.getLastMessageDate();
  var cleanRuleFolder = rule.folder.replace(/\'/g,'');
  var html = processThreadToHtml(thread);
  var blob = Utilities.newBlob(html, 'text/html');
  var pdf;

  var folderName = Utilities.formatDate(threadDate, config.timezone, rule.folder.replace('%s', thread.getFirstMessageSubject()));
  folderName = folderName.replace(':', '');
  var folder = getOrCreateFolder(folderName, rule.parentFolderId);

  if (rule.filenameTo) {
    filename = Utilities.formatDate(thread.getMessages()[0].getDate(), config.timezone, rule.filenameTo.replace('%s',thread.getFirstMessageSubject()));
    Logger.log("INFO:           Renaming '" + thread.getFirstMessageSubject() + "' -> '" + filename + "'");
    pdf = folder.createFile(blob.getAs('application/pdf')).setName(filename + ".pdf");
  } else {
    pdf = folder.createFile(blob.getAs('application/pdf')).setName(thread.getFirstMessageSubject() + ".pdf");
  }

  return pdf;
}
