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


Example Configuration
---------------------

```javascript
  * rule.filter =              "from:example@gmail.com has:attachment subject:logs"
  * rule.folder =              "MY Google Drive Folder/GM2GD"
  * rule.saveThreadPDF =       true
  * rule.archive =             true
  * rule.filenameFrom =        ""
  * rule.filenameFromRegexp =  ""
  * rule.filenameTo =          "yyyyMMdd-'%id'-'%t'-'%s'"
  * rule.filenameReplaceFrom = "Automatic";
  * rule.filenameReplaceTo =   "Manual";
```
