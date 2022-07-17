import { ConfigBase, Model } from "../ConfigBase"

@Model
export class V1Rule extends ConfigBase<V1Rule> {
    /** Archive thread after processing */
    archive = false
    /** Rename matching attachments from the given filename */
    filenameFrom = ""
    /** Rename matching attachments from the given filename regex */
    filenameFromRegexp = ""
    /** Rename matching attachments to the given filename */
    filenameTo = ""
    /** Search filter for threads */
    filter = ""
    /** GDrive folder to store attachments to */
    folder = ""
    /** Restrict to threads containing messages newer than the given relative date/time */
    newerThan = ""
    /** Add the given label to the processed thread */
    ruleLabel = ""
    /** Save the thread to PDF */
    saveThreadPDF = false
}

/*
    { // Store all attachments sent to my.name+scans@gmail.com to the folder "Scans"
      "filter": "to:my.name+scans@gmail.com",
      "folder": "'Scans'-yyyy-MM-dd"
    },
    { // Store all attachments from example1@example.com to the folder "Examples/example1"
      "filter": "from:example1@example.com",
      "folder": "'Examples/example1'"
    },
    { // Store all attachments sent to my.name+scans@gmail.com to the folder "Scans" with extend received dates
      "filter": "to:my.name+scans@gmail.com",
      "folder": "'Scans'-yyyy-MM-dd",
      "newerThan": "3m" // received in the last 3 months (applied for this rule only)
    },
    { // Store all pdf attachments from example2@example.com to the folder "Examples/example2"
      "filter": "from:example2@example.com",
      "folder": "'Examples/example2'",
      "filenameFromRegexp": ".*\.pdf$"
    },
    { // Store all attachments from example3a@example.com OR from:example3b@example.com
      // to the folder "Examples/example3ab" while renaming all attachments to the pattern
      // defined in 'filenameTo' and archive the thread.
      // filenameTo supports the following printf style substitutions:
      // %s - The subject of the message/thread
      // %o - The original filename of the attachement
      "filter": "has:attachment (from:example3a@example.com OR from:example3b@example.com)",
      "folder": "'Examples/example3ab'",
      "filenameTo": "'file-'yyyy-MM-dd-'%s.txt'",
      "archive": true
    },
    {
      // Store threads marked with label "PDF" in the folder "PDF Emails" als PDF document.
      "filter": "label:PDF",
      "saveThreadPDF": true,
      "folder": "PDF Emails"
    },
    {
      // Store threads marked with label "PDF" in the folder "PDF Emails" als PDF document.
      // while renaming the PDFs to the pattern defined in 'filenameTo'.
      // filenameTo supports the following printf style substitutions:
      // %s - The subject of the message/thread
      // NOTE: .pdf will automatically be added to the file name
      "filter": "label:PDF",
      "saveThreadPDF": true,
      "folder": "PDF Emails",
      "filenameTo": "'file-'yyyy-MM-dd-'%s'"
    },
    { // Store all attachments named "file.txt" from example4@example.com to the
      // folder "Examples/example4" and rename the attachment to the pattern
      // defined in 'filenameTo' and archive the thread.
      // filenameTo supports the following printf style substitutions:
      // %s - The subject of the message/thread
      // %o - The original filename of the attachement
      // %d - A running counter from 1 for each match of this rule.
      "filter": "has:attachment from:example4@example.com",
      "folder": "'Examples/example4'",
      "filenameFrom": "file.txt",
      "filenameTo": "'file-'yyyy-MM-dd-'%s.txt'"
    },
       // Sotre all of the emails with the text "receipt" from billing@zoom.us
       // into the folder "Examples/example5" and rename the filenames to be zoom-1.pdf, zoom-2.pdf...
      "filter": "receipt from:billing@zoom.us",
      "folder": "'Examples/example5'",
      "filenameFrom": "*.pdf",
      "filenameTo": "'zoom-%d.pdf'"
    }, 
    {
      // Store threads marked with label "PDF" in the folder "PDF Emails" als PDF document and add "addPDFlabel" to the processed thread.
      "filter": "label:PDF",
      "ruleLabel": "addPDFlabel",
      "folder": "PDF Emails"
    },
*/