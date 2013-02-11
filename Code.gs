// Gmail2GDrive by Andreas Hochsteger
// https://github.com/ahochsteger/gmail2gdrive

/**
 * Configuration for Gmail2GDrive
 */
function getGmail2GDriveConfig() {
  return {
    // Gmail label for processed threads:
    "processedLabel": "gmail2gdrive/processed",
    // Sleep time in milli seconds between processed messages:
    "sleepTime": 100,
    // Maximum script runtime in seconds (google scripts will be killed after 5 minutes):
    "maxRuntime": 280,
    // Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year):
    "newerThan": "1m",
    // Processing rules:
    "rules": [
	  // Rule documentation:
	  //  * filter (String, mandatory): a typical gmail search expression (see http://support.google.com/mail/bin/answer.py?hl=en&answer=7190)
	  //  * folder (String, mandatory): a path to an existing Google Drive folder
	  //  * archive (boolean, optional): Should the gmail thread be archived after processing? (default: false)
	  //  * filenameFrom (String, optional): The attachment filename that should be renamed when stored in Google Drive
	  //  * filenameTo (String, optional): The new filename for the attachment. You can use the special characters 'YYYY' for year, 'MM' for month and 'DD' for day as pattern in the filename.
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
		"filter": "(from:example3a@example.com OR from:example3b@example.com)",
		"folder": "Examples/example3ab",
		"filenameFrom": "file.txt",
		"filenameTo": "file-YYYY-MM-DD.txt",
		"archive": true
	  }
    ]
  };
}

/**
 * Main function that processes Gmail attachments and stores them in Google Drive.
 * Use this as trigger function for periodic execution.
 */
function performGmail2GDrive() {
  var config = getGmail2GDriveConfig();
  var gProcessedLabel  = config.processedLabel;
  var gNewerThan  = config.newerThan;
  var label = GmailApp.getUserLabelByName(gProcessedLabel);
  var end, start;
  start = new Date();

  Logger.log("INFO: Starting mail attachment processing.");
  for (var i=0; i<config.rules.length; i++) {
    var rule = config.rules[i];
    var gSearchExp  = rule.filter + " -label:" + gProcessedLabel;
    if (gNewerThan != "") {
      gSearchExp += " newer_than:" + gNewerThan;
    }
    var gFolder = rule.folder;
    var doArchive = rule.archive == true;
    var threads = GmailApp.search(gSearchExp);
    var folder  = DocsList.getFolder(gFolder);
    
    Logger.log("INFO:   Processing rule: "+gSearchExp);
    for (var x=0; x<threads.length; x++) {
      var thread = threads[x];
      end = new Date();
      var runTime = (end.getTime() - start.getTime())/1000;
      Logger.log("INFO:     Processing thread: "+thread.getFirstMessageSubject() + " (runtime: " + runTime + "s/" + config.maxRuntime + "s)");
      if (runTime >= config.maxRuntime) {
        Logger.log("WARNING: Self terminating script after " + runTime + "s")
        return;
      }
      var messages = thread.getMessages();
      for (var y=0; y<messages.length; y++) {
        var message = messages[y];
        Logger.log("INFO:       Processing message: "+message.getSubject() + " (" + message.getId() + ")");
        var att = message.getAttachments();
        for (var z=0; z<att.length; z++) {
          Logger.log("INFO:         Processing attachment: "+att[z].getName());
          try {
            var file = folder.createFile(att[z]);
            if (rule.filenameFrom && rule.filenameTo && rule.filenameFrom == file.getName()) {
              var messageDate = message.getDate();
              var d = messageDate.getDate();
              var m = messageDate.getMonth()+1;
              var y = messageDate.getFullYear();
              file.rename(rule.filenameTo.replace('YYYY',y).replace('MM',(m<=9?'0'+m:m)).replace('DD',(d<=9?'0'+d:d)));
            }
            file.setDescription("Mail title: " + message.getSubject() + "\nMail link: https://mail.google.com/mail/u/0/#inbox/" + message.getId());
            Utilities.sleep(config.sleepTime);
          }
          catch (e) {
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
  Logger.log("INFO: Finished mail attachment processing after " + runTime + "s.");
}
