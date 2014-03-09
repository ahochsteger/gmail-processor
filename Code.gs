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
  for (var i=0; i<folders.length; i++) {
    var folder = folders[i];
    if (folders[i].getName() == nextFolderName) {
      nextFolder = folders[i];
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
 * Returns the GDrive folder with the given name or creates it if not existing.
 */
function getOrCreateFolder(folderName) {
  var folder;
  try {
    folder = DocsList.getFolder(folderName);
  } catch(e) {
    var folderArray = folderName.split("/");
    folder = getOrCreateSubFolder(DocsList.getRootFolder(), folderArray);
  }
  return folder;
}

/**
 * Main function that processes Gmail attachments and stores them in Google Drive.
 * Use this as trigger function for periodic execution.
 */
function performGmail2GDrive() {
  var config = getGmail2GDriveConfig();
  var label = getOrCreateLabel(config.processedLabel);
  var end, start;
  start = new Date();

  Logger.log("INFO: Starting mail attachment processing.");
  for (var ruleIdx=0; ruleIdx<config.rules.length; ruleIdx++) {
    var rule = config.rules[ruleIdx];
    var gSearchExp  = rule.filter + " has:attachment -label:" + config.processedLabel;
    if (config.newerThan != "") {
      gSearchExp += " newer_than:" + config.newerThan;
    }
    var doArchive = rule.archive == true;
    var threads = GmailApp.search(gSearchExp);
    
    Logger.log("INFO:   Processing rule: "+gSearchExp);
    for (var threadIdx=0; threadIdx<threads.length; threadIdx++) {
      var thread = threads[threadIdx];
      end = new Date();
      var runTime = (end.getTime() - start.getTime())/1000;
      Logger.log("INFO:     Processing thread: "+thread.getFirstMessageSubject() + " (runtime: " + runTime + "s/" + config.maxRuntime + "s)");
      if (runTime >= config.maxRuntime) {
        Logger.log("WARNING: Self terminating script after " + runTime + "s")
        return;
      }
      var messages = thread.getMessages();
      for (var msgIdx=0; msgIdx<messages.length; msgIdx++) {
        var message = messages[msgIdx];
        Logger.log("INFO:       Processing message: "+message.getSubject() + " (" + message.getId() + ")");
        var messageDate = message.getDate();
        var attachments = message.getAttachments();
        for (var attIdx=0; attIdx<attachments.length; attIdx++) {
          var attachment = attachments[attIdx];
          Logger.log("INFO:         Processing attachment: "+attachment.getName());
          try {
            var folder = getOrCreateFolder(rule.folder);
            var file = folder.createFile(attachment);
            if (rule.filenameFrom && rule.filenameTo && rule.filenameFrom == file.getName()) {
              var newFilename = Utilities.formatDate(messageDate, config.timezone, rule.filenameTo.replace('%s',message.getSubject()));
              Logger.log("INFO:           Renaming '" + file.getName() + "' -> '" + newFilename + "'");
              file.rename(newFilename);
            }
            file.setDescription("Mail title: " + message.getSubject() + "\nMail date: " + message.getDate() + "\nMail link: https://mail.google.com/mail/u/0/#inbox/" + message.getId());
            Utilities.sleep(config.sleepTime);
          } catch (e) {
            Logger.log(e);
          }
        }       
      }
      thread.addLabel(label);
      if (doArchive) {
        Logger.log("INFO:     Archiving thread '" + thread.getFirstMessageSubject() + "' ...");
        thread.moveToArchive();
      }
    }
  }
  end = new Date();
  var runTime = (end.getTime() - start.getTime())/1000;
  Logger.log("INFO: Finished mail attachment processing after " + runTime + "s");
}
