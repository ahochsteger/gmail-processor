Gmail2GDrive
============

Gmail2GDrive is a Google Apps Script that you can use to store your Gmail attachements and Gmail Threads (in PDF) into the Google Drive folder of your choice.


Features
--------

* Save your Gmail attachements and emails into your Google Drive.
* Filter for relevant emails.
* Specify the destination folder.
* Rename attachments and PDF threads files:
   * add timestamp
   * replace a word
   * use RegEx
   * add source: 'mail' or 'file'
   * add mail id
   * add sender and recipient
   * make the filename computer filesystem accepted
* Save the thread as a PDF File.
* Log the activity into a Google Spreadsheet.
* Label and/or archive the emails already treated.

* Set it up to run preiodically.

Limitations
-----------

Gmail2GDrive currently has the following limitations:

* **Processing is done on a per-thread basis with a single email message per thread.** This is so because marking already processed emails is done using labels and GMail only alows to attach labels to a whole thread not to single email messages. For typical usage scenarios this is not really a problem but it may be if you want to process emails that are grouped by GMail into a thread (e.g. forum messages).
* **Google Apps Scripts limitations.** https://developers.google.com/apps-script/guides/services/quotas#current_limitations Script runtime, Custom function runtime, Triggers...


Setup
-----

1. Open [Google Apps Script](https://script.google.com/).
2. Create an empty project.
3. Give the project a name (e.g. MyGmail2GDrive)
4. Replace the content of the created file Code.gs with the provided [Code.gs](https://github.com/maxsnet/gmail2gdrive/blob/master/Code.gs) and save the changes.
5. Create a new script file with the name 'Config' and replace its content with the provided [Config.gs](https://github.com/maxsnet/gmail2gdrive/blob/master/Config.gs) and save the changes.
6. Adjust the configuration to your needs. It is recommended to restrict the timeframe using 'newerThan' to prevent running into API quotas by Google.
7. Test the script by manually executing the function main.
8. Create a time based trigger which periodically executes 'Gmail2GDrive' (e.g. once per day) to automatically organize your Gmail attachments within Google Drive.




Global Configuration
--------------------
Update the file Config.gs accordingly.

```javascript
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
```

Rule Configuration
------------------
Update the file Config.gs accordingly.

A rule supports the following parameters:

```javascript
//   active:        skip the rule if false
//   filter:        completes Global Filter (gmail filter)
//   folder:        is the folder name in the Google Drive where the files will be saved. Surrounded by single quotes.
//   saveThreadPDF: to save the thread email as a pdf.
//   archive:       archives the mail.

//   filenameFrom:       only stores attachements of those name
//   filenameFromRegexp: filters the files using RegEx.
  
//   filenameTo to rename the file saved:
//     '%s'     is replaced by the name fo the file / the subject of the mail
//     '%t'     is replaced by the file source: 'mail' or 'file'
//     '%id'    is replaced by the 3 last caracters of the id of the mail
//     '%from'  is replaced by the sender email
//     '%to'    is replaced by the email recipient
//   the simple quotes are required.
//
//   filenameReplaceFrom: if this texte is found in the filename, then it will be replaced by filenameReplaceTo
//   filenameReplaceTo:   look for filenameReplaceFrom in the filename and replaces by this.
```

Example Configuration
---------------------

```javascript
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
```

