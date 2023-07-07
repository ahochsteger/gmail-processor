# GMail Processor Reference Documentation

## Actions

The following actions can be triggered depending on the valid context which is prefixed in the action name:

* `global`: Globally available, can be placed anywhere in the configuration.
* `thread`: Run in the context of a thread (includes `message` and `attachment` context).
* `message`: Run in the context of a message (includes `attachment` context).
* `attachment`: Run in the context of an attachment.

| Action Name | Description | Arguments |
|-------------|-------------|-----------|
| `attachment.store` | Store an attachment at a Google Drive location. | <ul><li>`conflictStrategy (ConflictStrategy)`: The strategy to be used in case a file already exists at the desired location. For valid values see enum docs for type ConflictStrategy.</li></ul> | <ul><li>`description (string)`: The description to be attached to the Google Drive file.<br>Supports context substitution placeholder.</li></ul> | <ul><li>`location (string)`: The location (path + filename) of the Google Drive file.<br>For shared folders or Team Drives prepend the location with `{id:<folderId>}`.<br>Supports context substitution placeholder.</li></ul> |
| `global.log` | Create a log entry. | <ul><li>`level (LogLevel)`: The level of the log message (default: `info`): For valid values see enum docs for type LogLevel.</li></ul> | <ul><li>`message (string)`: The message to be logged</li></ul> |
| `global.sheetLog` | Create a log entry in the log spreadsheet. | <ul><li>`level (LogLevel)`: The level of the log message (default: info) For valid values see enum docs for type LogLevel.</li></ul> | <ul><li>`message (string)`: The message to be logged</li></ul> |
| `message.forward` | Forwards this message. | <ul><li>`to (string)`: The recipient of the forwarded message.</li></ul> |
| `message.markRead` | Marks the message as read. |
| `message.markUnread` | Marks the message as unread. |
| `message.moveToTrash` | Moves the message to the trash. |
| `message.star` | Stars the message. |
| `message.storePDF` | Generate a PDF document from the message and store it to GDrive. | <ul><li>`conflictStrategy (ConflictStrategy)`: The strategy to be used in case a file already exists at the desired location. For valid values see enum docs for type ConflictStrategy.</li></ul> | <ul><li>`description (string)`: The description to be attached to the Google Drive file.<br>Supports context substitution placeholder.</li></ul> | <ul><li>`location (string)`: The location (path + filename) of the Google Drive file.<br>For shared folders or Team Drives prepend the location with `{id:<folderId>}`.<br>Supports context substitution placeholder.</li></ul> | <ul><li>`skipHeader (boolean)`: Skip the header if `true`.</li></ul> |
| `message.unstar` | Unstars the message. |
| `thread.addLabel` | Add a label to the thread. | <ul><li>`name (string)`: The name of the label.</li></ul> |
| `thread.markImportant` | Mark the thread as important. |
| `thread.markRead` | Mark the thread as read. |
| `thread.markUnimportant` | Mark the thread as unimportant. |
| `thread.markUnread` | Mark the thread as unread. |
| `thread.moveToArchive` | Move the thread to the archive. |
| `thread.moveToInbox` | Move the thread to the inbox. |
| `thread.moveToSpam` | Move the thread to spam. |
| `thread.moveToTrash` | Move the thread to trash. |
| `thread.removeLabel` | Remove a label from the thread. | <ul><li>`name (string)`: The name of the label.</li></ul> |
| `thread.storePDF` | Generate a PDF document for the whole thread and store it to GDrive. | <ul><li>`conflictStrategy (ConflictStrategy)`: The strategy to be used in case a file already exists at the desired location. For valid values see enum docs for type ConflictStrategy.</li></ul> | <ul><li>`description (string)`: The description to be attached to the Google Drive file.<br>Supports context substitution placeholder.</li></ul> | <ul><li>`location (string)`: The location (path + filename) of the Google Drive file.<br>For shared folders or Team Drives prepend the location with `{id:<folderId>}`.<br>Supports context substitution placeholder.</li></ul> | <ul><li>`skipHeader (boolean)`: Skip the header if `true`.</li></ul> |
## Enum Types

The following table lists all enum types and their values referenced in the configuration above.

| Enum Type | Description | Values |
|-----------|-------------|--------|
| `ConflictStrategy` | Strategy that defines how to deal in case of conflicts with already existing files at the desired location in Google Drive. | <ul><li>`backup`: Create a backup of the existing file by renaming it.</li><li>`error`: Terminate processing with an error.</li><li>`keep`: Keep the existing file and create the new one with the same name.</li><li>`replace`: Replace the existing file with the new one.</li><li>`skip`: Skip creating the new file and keep the existing one.</li><li>`update`: Update the existing file with the contents of the new one (keep it's file ID).</li></ul> |
| `ContextType` | A type of context. | <ul><li>`attachment`: A context holding the attachment configuration and information about the currently processed attachment.</li><li>`env`: A context holding all environment information and references to environment objects.</li><li>`message`: A context holding the message configuration and information about the currently processed message.</li><li>`proc`: A context holding all processing information like the configuration, integration adapters, action registry and timer.</li><li>`thread`: A context holding the thread configuration and information about the currently processed thread.</li></ul> |
| `LogLevel` | Levels of log messages used for marking and filtering. | <ul><li>`debug`: Log level for debugging messages.</li><li>`error`: Log level for error messages.</li><li>`info`: Log level for info messages.</li><li>`warn`: Log level for warning messages.</li></ul> |
| `MarkProcessedMethod` | The method to mark processed threads/messages. | <ul><li>`add-label`: (deprecated): Adds the label set using `markProcessedLabel` to the thread.<br>ATTENTION: This method is just for compatibility with v1 configs and does not support multiple messages per thread!</li><li>`mark-read`: Mark the message as read.<br>This is the new default since it provides more flexibility esp. when threads contain multiple messages.</li></ul> |
| `MessageFlag` | A flag to match messages with certain properties. | <ul><li>`read`: Matches read messages.</li><li>`starred`: Matches starred messages.</li><li>`unread`: Matches unread messages.</li><li>`unstarred`: Matches unstarred messages.</li></ul> |
| `MetaInfoType` | The type of meta information used for context substitution placerholders. | <ul><li>`boolean`: Boolean type substituted to `true` or `false`.</li><li>`date`: Date/time type. For substitution a format string can be given using `${<placeholder>:format:<formatstring>}`.</li><li>`number`: A numeric data type.</li><li>`string`: A string data type.</li><li>`variable`: A custom configuration variable.</li></ul> |
| `PlaceholderType` | The type of a placeholder. | <ul><li>`attachment`: An attachment placeholder type.</li><li>`message`: A message placeholder type.</li><li>`thread`: A thread placeholder type.</li></ul> |
| `ProcessingStage` | The stage of processing | <ul><li>`main`: The stage during processing the main object (thread, message, attachment)</li><li>`post-main`: The stage after processing the main object (thread, message, attachment)</li><li>`pre-main`: The stage before processing the main object (thread, message, attachment)</li></ul> |
| `ProcessingStatus` | The result status of processing a config or an action. | <ul><li>`error`: An error has occured.</li><li>`ok`: The processing was successful.</li></ul> |
| `RunMode` | The runtime mode in which processing takes place. | <ul><li>`dangerous`: Execute all actions including deletes.<br>ATTENTION: I know exactly what I'm doing when using this mode and won't complain if something goes wrong!</li><li>`dry-run`: Don't execute writing actions</li><li>`safe-mode`: Don't execute deleting actions</li></ul> |
## Context Substitution

The following context data is available for substitution in strings, depending on the context.

## Processing Placeholder

These context substitution placeholder are globally available.

| Key | Type | Example | Description |
|-----|------|---------|-------------|
| `date.now` | `date` | `2023-06-26 09:00:00` | The current timestamp. Use `"${<key>:format:<dateformat>}"` to format the date/time using a custom [Moment.js format strings](https://momentjs.com/docs/#/displaying/format/) (default: `"YYYY-MM-DD HH:mm:ss"`). |
| `env.runMode` | `string` | `safe-mode` | The runmode used for processing. |
| `env.timezone` | `string` | `UTC` | The timezone used for processing. |
| `timer.startTime` | `date` | `2023-06-26 09:00:00` | The start timestamp of the processing script. Use `"${<key>:format:<dateformat>}"` to format the date/time using a custom [Moment.js format strings](https://momentjs.com/docs/#/displaying/format/) (default: `"YYYY-MM-DD HH:mm:ss"`). |
| `user.email` | `string` | `my.email@gmail.com` | The email address of the active user. |
| `variables.customVar` | `variable` | `Custom value` | A custom defined variable. All custom variables configured at `global.variables` are available using `"${variables.<varName>}"`. |

## Thread Placeholder

These context substitution placeholder are defined for the currently GMail thread.

| Key | Type | Example | Description |
|-----|------|---------|-------------|
| `thread.firstMessageSubject` | `string` | `Message Subject 1` | The subject of the first message in the thread. See [GmailThread.getFirstMessageSubject()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getFirstMessageSubject\(\)) reference docs. |
| `thread.hasStarredMessages` | `boolean` | `false` | `true` if the thread has any starred messages. See [GmailThread.hasStarredMessages()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#hasStarredMessages\(\)) reference docs. |
| `thread.id` | `string` | `threadId123` | The ID of the thread. See [GmailThread.getId()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getId\(\)) reference docs. |
| `thread.index` | `number` | `0` | The index number (0-based) of the thread. |
| `thread.isImportant` | `string` | `false` | `true` if the thread is marked as important. See [GmailThread.isImportant()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isImportant\(\)) reference docs. |
| `thread.isInChats` | `string` | `false` | `true` if the thread is labeled a chat. See [GmailThread.isInChats()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInChats\(\)) reference docs. |
| `thread.isInInbox` | `string` | `true` | `true` if the thread is in the inbox. See [GmailThread.isInInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInInbox\(\)) reference docs. |
| `thread.isInPriorityInbox` | `string` | `false` | `true` if the thread is in the priority inbox. See [GmailThread.isInPriorityInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInPriorityInbox\(\)) reference docs. |
| `thread.isInSpam` | `string` | `false` | `true` if the thread is marked as spam. See [GmailThread.isInSpam()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInSpam\(\)) reference docs. |
| `thread.isInTrash` | `string` | `false` | `true` if the thread is marked as spam. See [GmailThread.isInTrash()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInTrash\(\)) reference docs. |
| `thread.isUnread` | `string` | `true` | `true` if the thread has any unread messages. See [GmailThread.isUnread()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isUnread\(\)) reference docs. |
| `thread.labels` | `string` | `` | The user-created labels on the thread. See [GmailThread.getLabels()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getLabels\(\)) reference docs. |
| `thread.lastMessageDate` | `date` | `2019-05-02 07:15:28` | The date of the thread's most recent message. See [GmailThread.getLastMessageDate()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getLastMessageDate\(\)) reference docs. Use `"${<key>:format:<dateformat>}"` to format the date/time using a custom [Moment.js format strings](https://momentjs.com/docs/#/displaying/format/) (default: `"YYYY-MM-DD HH:mm:ss"`). |
| `thread.matched` | `boolean` | `true` | The overall matching result for all conditions in the match config. |
| `thread.messageCount` | `number` | `2` | The number of messages in the thread. See [GmailThread.getMessageCount()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getMessageCount\(\)) reference docs. |
| `thread.permalink` | `string` | `some-permalink-url` | The permalink for the thread. See [GmailThread.getPermalink()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getPermalink\(\)) reference docs. |
| `threadConfig.index` | `number` | `0` | The index number (0-based) of the thead config. |

## Message Placeholder

These context substitution placeholder are defined for the currently processed GMail message.

| Key | Type | Example | Description |
|-----|------|---------|-------------|
| `message.bcc` | `string` | `message-bcc@example.com` | The comma-separated recipients bcc'd on the message. See [GmailMessage.getBcc()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getBcc\(\)) reference docs. |
| `message.cc` | `string` | `message-cc@example.com` | The comma-separated recipients cc'd on the message. See [GmailMessage.getCc()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getCc\(\)) reference docs. |
| `message.date` | `date` | `2019-05-02 07:15:28` | The date and time of the message. See [GmailMessage.getDate()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getDate\(\)) reference docs. Use `"${<key>:format:<dateformat>}"` to format the date/time using a custom [Moment.js format strings](https://momentjs.com/docs/#/displaying/format/) (default: `"YYYY-MM-DD HH:mm:ss"`). |
| `message.from` | `string` | `message-from@example.com` | The sender of the message. See [GmailMessage.getFrom()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getFrom\(\)) reference docs. |
| `message.from.domain` | `string` | `example.com` | The sender domain of the message. See [GmailMessage.getFrom()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getFrom\(\)) reference docs. |
| `message.from.match.1` | `string` | `message-from` | The matching regex group number as defined in the match config (e.g.: `"(.+)@example.com"`). |
| `message.id` | `string` | `message-id` | The ID of the message. See [GmailMessage.getId()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getId\(\)) reference docs. |
| `message.index` | `number` | `0` | The index number (0-based) of the message. |
| `message.isDraft` | `boolean` | `false` | `true` if the message is a draft. See [GmailMessage.isDraft()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isDraft\(\)) reference docs. |
| `message.isInChats` | `boolean` | `false` | `true` if the message is a chat. See [GmailMessage.isInChats()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInChats\(\)) reference docs. |
| `message.isInInbox` | `boolean` | `true` | `true` if the message is in the inbox. See [GmailMessage.isInInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInInbox\(\)) reference docs. |
| `message.isInPriorityInbox` | `boolean` | `false` | `true` if if the message is in the priority inbox. See [GmailMessage.isInPriorityInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInPriorityInbox\(\)) reference docs. |
| `message.isInTrash` | `boolean` | `false` | `true` if the message is in the trash. See [GmailMessage.isInTrash()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInTrash\(\)) reference docs. |
| `message.isStarred` | `boolean` | `false` | `true` if the message is starred. See [GmailMessage.isStarred()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isStarred\(\)) reference docs. |
| `message.isUnread` | `boolean` | `true` | `true` if the message is unread. See [GmailMessage.isUnread()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isUnread\(\)) reference docs. |
| `message.matched` | `boolean` | `false` | The overall matching result for all conditions in the match config. |
| `message.replyTo` | `string` | `message-reply-to@example.com` | The reply-to address of the message (usually the sender). See [GmailMessage.getReplyTo()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getReplyTo\(\)) reference docs. |
| `message.subject` | `string` | `Message Subject 1` | The subject of the message. See [GmailMessage.getSubject()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getSubject\(\)) reference docs. |
| `message.subject.match.1` | `string` | `Subject 1` | The matching regex group number as defined in the match config (e.g.: `"Message (?<myMatchGroup>.*)"`). |
| `message.subject.match.myMatchGroup` | `string` | `Subject 1` | The matching named regex group name as defined in the match config (e.g.: `"Message (?<myMatchGroup>.*)"`). |
| `message.to` | `string` | `message-to@example.com` | The comma-separated recipients of the message. See [GmailMessage.getTo()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getTo\(\)) reference docs. |
| `messageConfig.index` | `number` | `0` | The index number (0-based) of the message config. |

## Attachment Placeholder

These context substitution placeholder are defined for the currently processed GMail attachment.

| Key | Type | Example | Description |
|-----|------|---------|-------------|
| `attachment.contentType` | `string` | `application/pdf` | The content type of the attachment. See [GmailAttachment.getContentType()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getContentType\(\)) reference docs. |
| `attachment.contentType.match.1` | `string` | `pdf` | The matching regex group number as defined in the match config (e.g.: `"application/(?<appType>.*)"`). |
| `attachment.contentType.match.appType` | `string` | `pdf` | The matching named regex group name as defined in the match config (e.g.: `"application/(?<appType>.*)"`). |
| `attachment.hash` | `string` | `aa0b8cc192a5d8d5b5d8ecda24fd0961b10ae283` | The SHA1 content hash for the attachment. See [GmailAttachment.getHash()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getHash\(\)) reference docs. |
| `attachment.index` | `string` | `0` | The index number (0-based) of the attachment. |
| `attachment.isGoogleType` | `string` | `false` | `true` if this attachment is a Google Workspace file (Sheets, Docs, etc.). See [GmailAttachment.isGoogleType()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#isGoogleType\(\)) reference docs. |
| `attachment.matched` | `boolean` | `true` | The overall matching result for all conditions in the match config. |
| `attachment.name` | `string` | `attachment1.pdf` | The name of the attachment. See [GmailAttachment.getName()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getName\(\)) reference docs. |
| `attachment.name.match.1` | `string` | `1` | The matching regex group number as defined in the match config (e.g.: `"attachment(?<attNr>[0-9]+)\.pdf"`). |
| `attachment.name.match.attNr` | `string` | `1` | The matching named regex group name as defined in the match config (e.g.: `"attachment(?<attNr>[0-9]+)\.pdf"`). |
| `attachment.size` | `string` | `18` | The size of the attachment. See [GmailAttachment.getSize()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getSize\(\)) reference docs. |
| `attachmentConfig.index` | `string` | `0` | The index number (0-based) of the attachment config. |
