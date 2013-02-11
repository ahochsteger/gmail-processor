Gmail2GDrive
============

Gmail2GDrive is a Google Apps Script which stores and sorts Gmail attachments into Google Drive folders.

It does so by defining a list of rules which consist of Gmail search filters and Google Drive destination folders.
This way the attachments of periodic emails can be automatically organized in folders without the need to install and run anything on the client.


Usage
-----

1. Open [Google Apps Script](https://script.google.com/).
2. Create an empty project.
3. Give the project a name (e.g. MyGmail2GDrive)
4. Replace the content of the created file Code.gs with the provided content.
5. Adjust the configuration in the function getGmail2GDriveConfig() to your needs. It is recommended to restrict the timeframe using 'newerThan' to prevent running into API quotas by Google.
6. Save the changes.
7. Test the script by manually executing the function performGmail2GDrive.


Configuration
-------------

The configuration parameters are documented in the files Code.gs.


Feedback and contributions
--------------------------

Direct any feedback and contributions directly to [Github](https://github.com/ahochsteger/gmail2gdrive).


Thanks
------

I'd like to thank [Amit Agarwal](http://www.labnol.org/about/) who provides similar functionality in his article [Send your Gmail Attachments to Google Drive](http://www.labnol.org/internet/send-gmail-to-google-drive/21236/) from which this script evolved to provide more flexibility.
