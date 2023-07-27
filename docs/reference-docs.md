# GMail Processor Reference Documentation

## Actions

The following actions can be triggered depending on the valid context which is prefixed in the action name:

* `global`: Globally available, can be placed anywhere in the configuration.
* `thread`: Run in the context of a thread (includes `message` and `attachment` context).
* `message`: Run in the context of a message (includes `attachment` context).
* `attachment`: Run in the context of an attachment.

| Action Name | Description | Arguments |
|-------------|-------------|-----------|
| <a id="action-attachment.store">`attachment.store`</a> | Store an attachment at a Google Drive location. | <ul><li><a id="action-attachment.store-conflictStrategy">`conflictStrategy`</a> (`ConflictStrategy`): The strategy to be used in case a file already exists at the desired location. For valid values see enum docs for type ConflictStrategy.</li></ul> | <ul><li><a id="action-attachment.store-description">`description`</a> (`string`): The description to be attached to the Google Drive file.<br>Supports context substitution placeholder.</li></ul> | <ul><li><a id="action-attachment.store-location">`location`</a> (`string`): The location (path + filename) of the Google Drive file.<br>For shared folders or Team Drives prepend the location with `{id:<folderId>}`.<br>Supports context substitution placeholder.</li></ul> |
| <a id="action-global.log">`global.log`</a> | Create a log entry. | <ul><li><a id="action-global.log-level">`level`</a> (`LogLevel`): The level of the log message (default: `info`): For valid values see enum docs for type LogLevel.</li></ul> | <ul><li><a id="action-global.log-message">`message`</a> (`string`): The message to be logged</li></ul> |
| <a id="action-global.sheetLog">`global.sheetLog`</a> | Create a log entry in the log spreadsheet. | <ul><li><a id="action-global.sheetLog-level">`level`</a> (`LogLevel`): The level of the log message (default: info) For valid values see enum docs for type LogLevel.</li></ul> | <ul><li><a id="action-global.sheetLog-message">`message`</a> (`string`): The message to be logged</li></ul> |
| <a id="action-message.forward">`message.forward`</a> | Forwards this message. | <ul><li><a id="action-message.forward-to">`to`</a> (`string`): The recipient of the forwarded message.</li></ul> |
| <a id="action-message.markRead">`message.markRead`</a> | Marks the message as read. |
| <a id="action-message.markUnread">`message.markUnread`</a> | Marks the message as unread. |
| <a id="action-message.moveToTrash">`message.moveToTrash`</a> | Moves the message to the trash. |
| <a id="action-message.star">`message.star`</a> | Stars the message. |
| <a id="action-message.storePDF">`message.storePDF`</a> | Generate a PDF document from the message and store it to GDrive. | <ul><li><a id="action-message.storePDF-conflictStrategy">`conflictStrategy`</a> (`ConflictStrategy`): The strategy to be used in case a file already exists at the desired location. For valid values see enum docs for type ConflictStrategy.</li></ul> | <ul><li><a id="action-message.storePDF-description">`description`</a> (`string`): The description to be attached to the Google Drive file.<br>Supports context substitution placeholder.</li></ul> | <ul><li><a id="action-message.storePDF-location">`location`</a> (`string`): The location (path + filename) of the Google Drive file.<br>For shared folders or Team Drives prepend the location with `{id:<folderId>}`.<br>Supports context substitution placeholder.</li></ul> | <ul><li><a id="action-message.storePDF-skipHeader">`skipHeader`</a> (`boolean`): Skip the header if `true`.</li></ul> |
| <a id="action-message.unstar">`message.unstar`</a> | Unstars the message. |
| <a id="action-thread.addLabel">`thread.addLabel`</a> | Add a label to the thread. | <ul><li><a id="action-thread.addLabel-name">`name`</a> (`string`): The name of the label.</li></ul> |
| <a id="action-thread.markImportant">`thread.markImportant`</a> | Mark the thread as important. |
| <a id="action-thread.markRead">`thread.markRead`</a> | Mark the thread as read. |
| <a id="action-thread.markUnimportant">`thread.markUnimportant`</a> | Mark the thread as unimportant. |
| <a id="action-thread.markUnread">`thread.markUnread`</a> | Mark the thread as unread. |
| <a id="action-thread.moveToArchive">`thread.moveToArchive`</a> | Move the thread to the archive. |
| <a id="action-thread.moveToInbox">`thread.moveToInbox`</a> | Move the thread to the inbox. |
| <a id="action-thread.moveToSpam">`thread.moveToSpam`</a> | Move the thread to spam. |
| <a id="action-thread.moveToTrash">`thread.moveToTrash`</a> | Move the thread to trash. |
| <a id="action-thread.removeLabel">`thread.removeLabel`</a> | Remove a label from the thread. | <ul><li><a id="action-thread.removeLabel-name">`name`</a> (`string`): The name of the label.</li></ul> |
| <a id="action-thread.storePDF">`thread.storePDF`</a> | Generate a PDF document for the whole thread and store it to GDrive. | <ul><li><a id="action-thread.storePDF-conflictStrategy">`conflictStrategy`</a> (`ConflictStrategy`): The strategy to be used in case a file already exists at the desired location. For valid values see enum docs for type ConflictStrategy.</li></ul> | <ul><li><a id="action-thread.storePDF-description">`description`</a> (`string`): The description to be attached to the Google Drive file.<br>Supports context substitution placeholder.</li></ul> | <ul><li><a id="action-thread.storePDF-location">`location`</a> (`string`): The location (path + filename) of the Google Drive file.<br>For shared folders or Team Drives prepend the location with `{id:<folderId>}`.<br>Supports context substitution placeholder.</li></ul> | <ul><li><a id="action-thread.storePDF-skipHeader">`skipHeader`</a> (`boolean`): Skip the header if `true`.</li></ul> |
## Enum Types

The following table lists all enum types and their values referenced in the configuration above.

| Enum Type | Description | Values |
|-----------|-------------|--------|
| <a id="enum-ConflictStrategy">`ConflictStrategy`</a> | Strategy that defines how to deal in case of conflicts with already existing files at the desired location in Google Drive. | <ul><li><a id="enum-ConflictStrategy-backup">`backup`</a>: Create a backup of the existing file by renaming it.</li><li><a id="enum-ConflictStrategy-error">`error`</a>: Terminate processing with an error.</li><li><a id="enum-ConflictStrategy-keep">`keep`</a>: Keep the existing file and create the new one with the same name.</li><li><a id="enum-ConflictStrategy-replace">`replace`</a>: Replace the existing file with the new one.</li><li><a id="enum-ConflictStrategy-skip">`skip`</a>: Skip creating the new file and keep the existing one.</li><li><a id="enum-ConflictStrategy-update">`update`</a>: Update the existing file with the contents of the new one (keep it's file ID).</li></ul> |
| <a id="enum-ContextType">`ContextType`</a> | A type of context. | <ul><li><a id="enum-ContextType-attachment">`attachment`</a>: A context holding the attachment configuration and information about the currently processed attachment.</li><li><a id="enum-ContextType-env">`env`</a>: A context holding all environment information and references to environment objects.</li><li><a id="enum-ContextType-message">`message`</a>: A context holding the message configuration and information about the currently processed message.</li><li><a id="enum-ContextType-proc">`proc`</a>: A context holding all processing information like the configuration, integration adapters, action registry and timer.</li><li><a id="enum-ContextType-thread">`thread`</a>: A context holding the thread configuration and information about the currently processed thread.</li></ul> |
| <a id="enum-LogLevel">`LogLevel`</a> | Levels of log messages used for marking and filtering. | <ul><li><a id="enum-LogLevel-debug">`debug`</a>: Log level for debugging messages.</li><li><a id="enum-LogLevel-error">`error`</a>: Log level for error messages.</li><li><a id="enum-LogLevel-info">`info`</a>: Log level for info messages.</li><li><a id="enum-LogLevel-warn">`warn`</a>: Log level for warning messages.</li></ul> |
| <a id="enum-MarkProcessedMethod">`MarkProcessedMethod`</a> | The method to mark processed threads/messages. | <ul><li><a id="enum-MarkProcessedMethod-add-label">`add-label`</a>: (deprecated): Adds the label set using `markProcessedLabel` to the thread.<br>ATTENTION: This method is just for compatibility with v1 configs and does not support multiple messages per thread!</li><li><a id="enum-MarkProcessedMethod-mark-read">`mark-read`</a>: Mark the message as read.<br>This is the new default since it provides more flexibility esp. when threads contain multiple messages.</li></ul> |
| <a id="enum-MessageFlag">`MessageFlag`</a> | A flag to match messages with certain properties. | <ul><li><a id="enum-MessageFlag-read">`read`</a>: Matches read messages.</li><li><a id="enum-MessageFlag-starred">`starred`</a>: Matches starred messages.</li><li><a id="enum-MessageFlag-unread">`unread`</a>: Matches unread messages.</li><li><a id="enum-MessageFlag-unstarred">`unstarred`</a>: Matches unstarred messages.</li></ul> |
| <a id="enum-MetaInfoType">`MetaInfoType`</a> | The type of meta information used for context substitution placerholders. | <ul><li><a id="enum-MetaInfoType-boolean">`boolean`</a>: Boolean type substituted to `true` or `false`.</li><li><a id="enum-MetaInfoType-date">`date`</a>: Date/time type. For substitution a format string can be given using `${<placeholder>:format:<formatstring>}`.</li><li><a id="enum-MetaInfoType-number">`number`</a>: A numeric data type.</li><li><a id="enum-MetaInfoType-string">`string`</a>: A string data type.</li><li><a id="enum-MetaInfoType-variable">`variable`</a>: A custom configuration variable.</li></ul> |
| <a id="enum-PlaceholderType">`PlaceholderType`</a> | The type of a placeholder. | <ul><li><a id="enum-PlaceholderType-attachment">`attachment`</a>: An attachment placeholder type.</li><li><a id="enum-PlaceholderType-message">`message`</a>: A message placeholder type.</li><li><a id="enum-PlaceholderType-thread">`thread`</a>: A thread placeholder type.</li></ul> |
| <a id="enum-ProcessingStage">`ProcessingStage`</a> | The stage of processing | <ul><li><a id="enum-ProcessingStage-main">`main`</a>: The stage during processing the main object (thread, message, attachment)</li><li><a id="enum-ProcessingStage-post-main">`post-main`</a>: The stage after processing the main object (thread, message, attachment)</li><li><a id="enum-ProcessingStage-pre-main">`pre-main`</a>: The stage before processing the main object (thread, message, attachment)</li></ul> |
| <a id="enum-ProcessingStatus">`ProcessingStatus`</a> | The result status of processing a config or an action. | <ul><li><a id="enum-ProcessingStatus-error">`error`</a>: An error has occured.</li><li><a id="enum-ProcessingStatus-ok">`ok`</a>: The processing was successful.</li></ul> |
| <a id="enum-RunMode">`RunMode`</a> | The runtime mode in which processing takes place. | <ul><li><a id="enum-RunMode-dangerous">`dangerous`</a>: Execute all actions including deletes.<br>ATTENTION: I know exactly what I'm doing when using this mode and won't complain if something goes wrong!</li><li><a id="enum-RunMode-dry-run">`dry-run`</a>: Don't execute writing actions</li><li><a id="enum-RunMode-safe-mode">`safe-mode`</a>: Don't execute deleting actions</li></ul> |
## Context Substitution

The following context data is available for substitution in strings, depending on the context.

## Environment Placeholder

These context substitution placeholder are globally available and can also be used before processing starts (e.g. during adapter initialization).

| Key | Type | Example | Description |
|-----|------|---------|-------------|
| <a id="placeholder-env-date.now">`date.now`</a> | `date` | `2023-06-26 09:00:00` | The current timestamp. Use `"${<key>:format:<dateformat>}"` to format the date/time using a custom [Moment.js format strings](https://momentjs.com/docs/#/displaying/format/) (default: `"YYYY-MM-DD HH:mm:ss"`). |
| <a id="placeholder-env-env.runMode">`env.runMode`</a> | `string` | `safe-mode` | The runmode used for processing. |
| <a id="placeholder-env-env.timezone">`env.timezone`</a> | `string` | `UTC` | The timezone used for processing. |
| <a id="placeholder-env-user.email">`user.email`</a> | `string` | `my.email@gmail.com` | The email address of the active user. |

## Processing Placeholder

These context substitution placeholder are globally available and can only be used during processing.

| Key | Type | Example | Description |
|-----|------|---------|-------------|
| <a id="placeholder-proc-timer.startTime">`timer.startTime`</a> | `date` | `2023-06-26 09:00:00` | The start timestamp of the processing script. Use `"${<key>:format:<dateformat>}"` to format the date/time using a custom [Moment.js format strings](https://momentjs.com/docs/#/displaying/format/) (default: `"YYYY-MM-DD HH:mm:ss"`). |
| <a id="placeholder-proc-variables.customVar">`variables.customVar`</a> | `variable` | `Custom value` | A custom defined variable. Custom variables defined at `global.variables` to better manage recurring substitution values. |

## Thread Placeholder

These context substitution placeholder are defined for the currently GMail thread.

| Key | Type | Example | Description |
|-----|------|---------|-------------|
| <a id="placeholder-thread-thread.firstMessageSubject">`thread.firstMessageSubject`</a> | `string` | `Message Subject 1` | The subject of the first message in the thread. See [GmailThread.getFirstMessageSubject()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getFirstMessageSubject\(\)) reference docs. |
| <a id="placeholder-thread-thread.hasStarredMessages">`thread.hasStarredMessages`</a> | `boolean` | `false` | `true` if the thread has any starred messages. See [GmailThread.hasStarredMessages()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#hasStarredMessages\(\)) reference docs. |
| <a id="placeholder-thread-thread.id">`thread.id`</a> | `string` | `threadId123` | The ID of the thread. See [GmailThread.getId()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getId\(\)) reference docs. |
| <a id="placeholder-thread-thread.index">`thread.index`</a> | `number` | `0` | The index number (0-based) of the thread. |
| <a id="placeholder-thread-thread.isImportant">`thread.isImportant`</a> | `string` | `false` | `true` if the thread is marked as important. See [GmailThread.isImportant()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isImportant\(\)) reference docs. |
| <a id="placeholder-thread-thread.isInChats">`thread.isInChats`</a> | `string` | `false` | `true` if the thread is labeled a chat. See [GmailThread.isInChats()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInChats\(\)) reference docs. |
| <a id="placeholder-thread-thread.isInInbox">`thread.isInInbox`</a> | `string` | `true` | `true` if the thread is in the inbox. See [GmailThread.isInInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInInbox\(\)) reference docs. |
| <a id="placeholder-thread-thread.isInPriorityInbox">`thread.isInPriorityInbox`</a> | `string` | `false` | `true` if the thread is in the priority inbox. See [GmailThread.isInPriorityInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInPriorityInbox\(\)) reference docs. |
| <a id="placeholder-thread-thread.isInSpam">`thread.isInSpam`</a> | `string` | `false` | `true` if the thread is marked as spam. See [GmailThread.isInSpam()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInSpam\(\)) reference docs. |
| <a id="placeholder-thread-thread.isInTrash">`thread.isInTrash`</a> | `string` | `false` | `true` if the thread is marked as spam. See [GmailThread.isInTrash()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInTrash\(\)) reference docs. |
| <a id="placeholder-thread-thread.isUnread">`thread.isUnread`</a> | `string` | `true` | `true` if the thread has any unread messages. See [GmailThread.isUnread()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isUnread\(\)) reference docs. |
| <a id="placeholder-thread-thread.labels">`thread.labels`</a> | `string` | `` | The user-created labels on the thread. See [GmailThread.getLabels()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getLabels\(\)) reference docs. |
| <a id="placeholder-thread-thread.lastMessageDate">`thread.lastMessageDate`</a> | `date` | `2019-05-02 07:15:28` | The date of the thread's most recent message. See [GmailThread.getLastMessageDate()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getLastMessageDate\(\)) reference docs. Use `"${<key>:format:<dateformat>}"` to format the date/time using a custom [Moment.js format strings](https://momentjs.com/docs/#/displaying/format/) (default: `"YYYY-MM-DD HH:mm:ss"`). |
| <a id="placeholder-thread-thread.matched">`thread.matched`</a> | `boolean` | `true` | The overall matching result for all conditions in the match config. |
| <a id="placeholder-thread-thread.messageCount">`thread.messageCount`</a> | `number` | `2` | The number of messages in the thread. See [GmailThread.getMessageCount()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getMessageCount\(\)) reference docs. |
| <a id="placeholder-thread-thread.permalink">`thread.permalink`</a> | `string` | `some-permalink-url` | The permalink for the thread. See [GmailThread.getPermalink()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getPermalink\(\)) reference docs. |
| <a id="placeholder-thread-thread.url">`thread.url`</a> | `string` | `https://mail.google.com/mail/u/0/#inbox/threadId123` | The URL of the thread. |
| <a id="placeholder-thread-threadConfig.index">`threadConfig.index`</a> | `number` | `0` | The index number (0-based) of the thead config. |

## Message Placeholder

These context substitution placeholder are defined for the currently processed GMail message.

| Key | Type | Example | Description |
|-----|------|---------|-------------|
| <a id="placeholder-message-message.bcc">`message.bcc`</a> | `string` | `message-bcc@example.com` | The comma-separated recipients bcc'd on the message. See [GmailMessage.getBcc()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getBcc\(\)) reference docs. |
| <a id="placeholder-message-message.cc">`message.cc`</a> | `string` | `message-cc@example.com` | The comma-separated recipients cc'd on the message. See [GmailMessage.getCc()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getCc\(\)) reference docs. |
| <a id="placeholder-message-message.date">`message.date`</a> | `date` | `2019-05-02 07:15:28` | The date and time of the message. See [GmailMessage.getDate()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getDate\(\)) reference docs. Use `"${<key>:format:<dateformat>}"` to format the date/time using a custom [Moment.js format strings](https://momentjs.com/docs/#/displaying/format/) (default: `"YYYY-MM-DD HH:mm:ss"`). |
| <a id="placeholder-message-message.from">`message.from`</a> | `string` | `message-from@example.com` | The sender of the message. See [GmailMessage.getFrom()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getFrom\(\)) reference docs. |
| <a id="placeholder-message-message.from.domain">`message.from.domain`</a> | `string` | `example.com` | The sender domain of the message. See [GmailMessage.getFrom()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getFrom\(\)) reference docs. |
| <a id="placeholder-message-message.from.match.1">`message.from.match.1`</a> | `string` | `message-from` | The matching regex group number as defined in the match config (e.g.: `"(.+)@example.com"`). |
| <a id="placeholder-message-message.id">`message.id`</a> | `string` | `message-id` | The ID of the message. See [GmailMessage.getId()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getId\(\)) reference docs. |
| <a id="placeholder-message-message.index">`message.index`</a> | `number` | `0` | The index number (0-based) of the message. |
| <a id="placeholder-message-message.isDraft">`message.isDraft`</a> | `boolean` | `false` | `true` if the message is a draft. See [GmailMessage.isDraft()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isDraft\(\)) reference docs. |
| <a id="placeholder-message-message.isInChats">`message.isInChats`</a> | `boolean` | `false` | `true` if the message is a chat. See [GmailMessage.isInChats()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInChats\(\)) reference docs. |
| <a id="placeholder-message-message.isInInbox">`message.isInInbox`</a> | `boolean` | `true` | `true` if the message is in the inbox. See [GmailMessage.isInInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInInbox\(\)) reference docs. |
| <a id="placeholder-message-message.isInPriorityInbox">`message.isInPriorityInbox`</a> | `boolean` | `false` | `true` if if the message is in the priority inbox. See [GmailMessage.isInPriorityInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInPriorityInbox\(\)) reference docs. |
| <a id="placeholder-message-message.isInTrash">`message.isInTrash`</a> | `boolean` | `false` | `true` if the message is in the trash. See [GmailMessage.isInTrash()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInTrash\(\)) reference docs. |
| <a id="placeholder-message-message.isStarred">`message.isStarred`</a> | `boolean` | `false` | `true` if the message is starred. See [GmailMessage.isStarred()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isStarred\(\)) reference docs. |
| <a id="placeholder-message-message.isUnread">`message.isUnread`</a> | `boolean` | `true` | `true` if the message is unread. See [GmailMessage.isUnread()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isUnread\(\)) reference docs. |
| <a id="placeholder-message-message.matched">`message.matched`</a> | `boolean` | `false` | The overall matching result for all conditions in the match config. |
| <a id="placeholder-message-message.replyTo">`message.replyTo`</a> | `string` | `message-reply-to@example.com` | The reply-to address of the message (usually the sender). See [GmailMessage.getReplyTo()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getReplyTo\(\)) reference docs. |
| <a id="placeholder-message-message.subject">`message.subject`</a> | `string` | `Message Subject 1` | The subject of the message. See [GmailMessage.getSubject()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getSubject\(\)) reference docs. |
| <a id="placeholder-message-message.subject.match.1">`message.subject.match.1`</a> | `string` | `Subject 1` | The matching regex group number as defined in the match config (e.g.: `"Message (?<myMatchGroup>.*)"`). |
| <a id="placeholder-message-message.subject.match.myMatchGroup">`message.subject.match.myMatchGroup`</a> | `string` | `Subject 1` | The matching named regex group name as defined in the match config (e.g.: `"Message (?<myMatchGroup>.*)"`). |
| <a id="placeholder-message-message.to">`message.to`</a> | `string` | `message-to@example.com` | The comma-separated recipients of the message. See [GmailMessage.getTo()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getTo\(\)) reference docs. |
| <a id="placeholder-message-message.url">`message.url`</a> | `string` | `https://mail.google.com/mail/u/0/#inbox/message-id` | The URL of the message. |
| <a id="placeholder-message-messageConfig.index">`messageConfig.index`</a> | `number` | `0` | The index number (0-based) of the message config. |

## Attachment Placeholder

These context substitution placeholder are defined for the currently processed GMail attachment.

| Key | Type | Example | Description |
|-----|------|---------|-------------|
| <a id="placeholder-attachment-attachment.contentType">`attachment.contentType`</a> | `string` | `application/pdf` | The content type of the attachment. See [GmailAttachment.getContentType()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getContentType\(\)) reference docs. |
| <a id="placeholder-attachment-attachment.contentType.match.1">`attachment.contentType.match.1`</a> | `string` | `pdf` | The matching regex group number as defined in the match config (e.g.: `"application/(?<appType>.*)"`). |
| <a id="placeholder-attachment-attachment.contentType.match.appType">`attachment.contentType.match.appType`</a> | `string` | `pdf` | The matching named regex group name as defined in the match config (e.g.: `"application/(?<appType>.*)"`). |
| <a id="placeholder-attachment-attachment.hash">`attachment.hash`</a> | `string` | `aa0b8cc192a5d8d5b5d8ecda24fd0961b10ae283` | The SHA1 content hash for the attachment. See [GmailAttachment.getHash()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getHash\(\)) reference docs. |
| <a id="placeholder-attachment-attachment.index">`attachment.index`</a> | `string` | `0` | The index number (0-based) of the attachment. |
| <a id="placeholder-attachment-attachment.isGoogleType">`attachment.isGoogleType`</a> | `string` | `false` | `true` if this attachment is a Google Workspace file (Sheets, Docs, etc.). See [GmailAttachment.isGoogleType()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#isGoogleType\(\)) reference docs. |
| <a id="placeholder-attachment-attachment.matched">`attachment.matched`</a> | `boolean` | `true` | The overall matching result for all conditions in the match config. |
| <a id="placeholder-attachment-attachment.name">`attachment.name`</a> | `string` | `attachment1.pdf` | The name of the attachment. See [GmailAttachment.getName()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getName\(\)) reference docs. |
| <a id="placeholder-attachment-attachment.name.match.1">`attachment.name.match.1`</a> | `string` | `1` | The matching regex group number as defined in the match config (e.g.: `"attachment(?<attNr>[0-9]+)\.pdf"`). |
| <a id="placeholder-attachment-attachment.name.match.attNr">`attachment.name.match.attNr`</a> | `string` | `1` | The matching named regex group name as defined in the match config (e.g.: `"attachment(?<attNr>[0-9]+)\.pdf"`). |
| <a id="placeholder-attachment-attachment.size">`attachment.size`</a> | `string` | `18` | The size of the attachment. See [GmailAttachment.getSize()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getSize\(\)) reference docs. |
| <a id="placeholder-attachment-attachmentConfig.index">`attachmentConfig.index`</a> | `string` | `0` | The index number (0-based) of the attachment config. |
