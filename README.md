Gmail2GDrive
============

Gmail2GDrive is a Google Apps Script which automatically stores and sorts Gmail attachments into Google Drive folders, and can also save the thread as a PDF file.

It does so by defining a list of rules which consist of Gmail search filters and Google Drive destination folders.
This way the attachments of periodic emails can be automatically organized in folders without the need to install and run anything on the client.


Features
--------

* Automatically sorts your attachments in the background
* Filter for relevant emails
* Specify the destination folder
* Rename attachments (using date format strings and email subject as filenames)
* Save the thread as a PDF File


Setup
-----

1. Open [Google Apps Script](https://script.google.com/).
2. Create an empty project.
3. Give the project a name (e.g. MyGmail2GDrive)
4. Replace the content of the created file Code.gs with the provided [Code.gs](https://github.com/ahochsteger/gmail2gdrive/blob/master/Code.gs) and save the changes.
5. Create a new script file with the name 'Config' and replace its content with the provided [Config.gs](https://github.com/ahochsteger/gmail2gdrive/blob/master/Config.gs) and save the changes.
6. Adjust the configuration to your needs. It is recommended to restrict the timeframe using 'newerThan' to prevent running into API quotas by Google.
7. Test the script by manually executing the function performGmail2GDrive.
8. Create a time based trigger which periodically executes 'Gmail2GDrive' (e.g. once per day) to automatically organize your Gmail attachments within Google Drive.


Feedback and contributions
--------------------------

Direct any feedback and contributions directly to [Github](https://github.com/marklr/gmail2gdrive).


Thanks
------
Originally forked from https://github.com/ahochsteger/gmail2gdrive
