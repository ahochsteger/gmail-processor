---
sidebar_position: 34
---
# Placeholder

## Overview

The placeholder in the following table are available for substitution in strings, depending on the scope which are defined as follows:

* [`env.*`](#scope-env): This scope is valid globally and can also be used for internal purposes before processing starts (e.g. during adapter initialization).
* [`proc.*`](#scope-proc): This scope is valid globally during any processing phase.
* [`thread.*`](#scope-thread): This scope is valid during processing a GMail thread and matching messages + attachments.
* [`message.*`](#scope-message): This scope is valid during processing a GMail message and matching attachments.
* [`attachment.*`](#scope-attachment): This scope is valid during processing a GMail attachment.

## `env` Placeholder

| Key | Description | Example |
|-----|-------------|---------|
| <a id="placeholder.date.now">`date.now`</a> | The current timestamp. Use `"${<key>:format:<format>}"` to format the date/time using a custom [date-fns format strings](https://date-fns.org/docs/format) (default: `"yyyy-MM-dd HH:mm:ss"`). | `2023-06-26 09:00:00` |
| <a id="placeholder.env.runMode">`env.runMode`</a> | The runMode used for processing. | `safe-mode` |
| <a id="placeholder.env.timezone">`env.timezone`</a> | The timezone used for processing. | `UTC` |
| <a id="placeholder.user.email">`user.email`</a> | The email address of the active user. | `my.email@gmail.com` |

## `proc` Placeholder

| Key | Description | Example |
|-----|-------------|---------|
| <a id="placeholder.timer.startTime">`timer.startTime`</a> | The start timestamp of the processing script. Use `"${<key>:format:<format>}"` to format the date/time using a custom [date-fns format strings](https://date-fns.org/docs/format) (default: `"yyyy-MM-dd HH:mm:ss"`). | `2023-06-26 09:00:00` |
| <a id="placeholder.variables.customVar">`variables.customVar`</a> | A custom defined variable. Custom variables defined at `global.variables` to better manage recurring substitution values. | `Custom value` |

## `thread` Placeholder

| Key | Description | Example |
|-----|-------------|---------|
| <a id="placeholder.thread.firstMessageSubject">`thread.firstMessageSubject`</a> | The subject of the first message in the thread. See [GmailThread.getFirstMessageSubject()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getFirstMessageSubject\(\)) reference docs. | `Message Subject 1` |
| <a id="placeholder.thread.hasStarredMessages">`thread.hasStarredMessages`</a> | `true` if the thread has any starred messages. See [GmailThread.hasStarredMessages()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#hasStarredMessages\(\)) reference docs. | `false` |
| <a id="placeholder.thread.id">`thread.id`</a> | The ID of the thread. See [GmailThread.getId()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getId\(\)) reference docs. | `threadId123` |
| <a id="placeholder.thread.index">`thread.index`</a> | The index number (0-based) of the thread. | `0` |
| <a id="placeholder.thread.isImportant">`thread.isImportant`</a> | `true` if the thread is marked as important. See [GmailThread.isImportant()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isImportant\(\)) reference docs. | `false` |
| <a id="placeholder.thread.isInChats">`thread.isInChats`</a> | `true` if the thread is labeled a chat. See [GmailThread.isInChats()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInChats\(\)) reference docs. | `false` |
| <a id="placeholder.thread.isInInbox">`thread.isInInbox`</a> | `true` if the thread is in the inbox. See [GmailThread.isInInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInInbox\(\)) reference docs. | `true` |
| <a id="placeholder.thread.isInPriorityInbox">`thread.isInPriorityInbox`</a> | `true` if the thread is in the priority inbox. See [GmailThread.isInPriorityInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInPriorityInbox\(\)) reference docs. | `false` |
| <a id="placeholder.thread.isInSpam">`thread.isInSpam`</a> | `true` if the thread is marked as spam. See [GmailThread.isInSpam()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInSpam\(\)) reference docs. | `false` |
| <a id="placeholder.thread.isInTrash">`thread.isInTrash`</a> | `true` if the thread is marked as spam. See [GmailThread.isInTrash()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isInTrash\(\)) reference docs. | `false` |
| <a id="placeholder.thread.isUnread">`thread.isUnread`</a> | `true` if the thread has any unread messages. See [GmailThread.isUnread()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#isUnread\(\)) reference docs. | `true` |
| <a id="placeholder.thread.labels">`thread.labels`</a> | The user-created labels on the thread. See [GmailThread.getLabels()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getLabels\(\)) reference docs. | `` |
| <a id="placeholder.thread.lastMessageDate">`thread.lastMessageDate`</a> | The date of the thread's most recent message. See [GmailThread.getLastMessageDate()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getLastMessageDate\(\)) reference docs. Use `"${<key>:format:<format>}"` to format the date/time using a custom [date-fns format strings](https://date-fns.org/docs/format) (default: `"yyyy-MM-dd HH:mm:ss"`). | `2019-05-02 07:15:28` |
| <a id="placeholder.thread.matched">`thread.matched`</a> | The overall matching result for all conditions in the match config. | `true` |
| <a id="placeholder.thread.messageCount">`thread.messageCount`</a> | The number of messages in the thread. See [GmailThread.getMessageCount()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getMessageCount\(\)) reference docs. | `2` |
| <a id="placeholder.thread.permalink">`thread.permalink`</a> | The permalink for the thread. See [GmailThread.getPermalink()](https://developers.google.com/apps-script/reference/gmail/gmail-thread#getPermalink\(\)) reference docs. | `some-permalink-url` |
| <a id="placeholder.thread.url">`thread.url`</a> | The URL of the thread. | `https://mail.google.com/mail/u/0/#inbox/threadId123` |
| <a id="placeholder.threadConfig.index">`threadConfig.index`</a> | The index number (0-based) of the thead config. | `0` |

## `message` Placeholder

| Key | Description | Example |
|-----|-------------|---------|
| <a id="placeholder.message.bcc">`message.bcc`</a> | The comma-separated recipients bcc'd on the message. See [GmailMessage.getBcc()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getBcc\(\)) reference docs. | `message-bcc@example.com` |
| <a id="placeholder.message.cc">`message.cc`</a> | The comma-separated recipients cc'd on the message. See [GmailMessage.getCc()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getCc\(\)) reference docs. | `message-cc@example.com` |
| <a id="placeholder.message.date">`message.date`</a> | The date and time of the message. See [GmailMessage.getDate()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getDate\(\)) reference docs. Use `"${<key>:format:<format>}"` to format the date/time using a custom [date-fns format strings](https://date-fns.org/docs/format) (default: `"yyyy-MM-dd HH:mm:ss"`). | `2019-05-02 07:15:28` |
| <a id="placeholder.message.from">`message.from`</a> | The sender of the message. See [GmailMessage.getFrom()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getFrom\(\)) reference docs. | `message-from@example.com` |
| <a id="placeholder.message.from.domain">`message.from.domain`</a> | The sender domain of the message. See [GmailMessage.getFrom()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getFrom\(\)) reference docs. | `example.com` |
| <a id="placeholder.message.from.match.1">`message.from.match.1`</a> | The matching regex group number as defined in the match config (e.g.: `"(.+)@example.com"`). | `message-from` |
| <a id="placeholder.message.id">`message.id`</a> | The ID of the message. See [GmailMessage.getId()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getId\(\)) reference docs. | `message-id` |
| <a id="placeholder.message.index">`message.index`</a> | The index number (0-based) of the message. | `0` |
| <a id="placeholder.message.isDraft">`message.isDraft`</a> | `true` if the message is a draft. See [GmailMessage.isDraft()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isDraft\(\)) reference docs. | `false` |
| <a id="placeholder.message.isInChats">`message.isInChats`</a> | `true` if the message is a chat. See [GmailMessage.isInChats()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInChats\(\)) reference docs. | `false` |
| <a id="placeholder.message.isInInbox">`message.isInInbox`</a> | `true` if the message is in the inbox. See [GmailMessage.isInInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInInbox\(\)) reference docs. | `true` |
| <a id="placeholder.message.isInPriorityInbox">`message.isInPriorityInbox`</a> | `true` if if the message is in the priority inbox. See [GmailMessage.isInPriorityInbox()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInPriorityInbox\(\)) reference docs. | `false` |
| <a id="placeholder.message.isInTrash">`message.isInTrash`</a> | `true` if the message is in the trash. See [GmailMessage.isInTrash()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isInTrash\(\)) reference docs. | `false` |
| <a id="placeholder.message.isStarred">`message.isStarred`</a> | `true` if the message is starred. See [GmailMessage.isStarred()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isStarred\(\)) reference docs. | `false` |
| <a id="placeholder.message.isUnread">`message.isUnread`</a> | `true` if the message is unread. See [GmailMessage.isUnread()](https://developers.google.com/apps-script/reference/gmail/gmail-message#isUnread\(\)) reference docs. | `true` |
| <a id="placeholder.message.matched">`message.matched`</a> | The overall matching result for all conditions in the match config. | `false` |
| <a id="placeholder.message.replyTo">`message.replyTo`</a> | The reply-to address of the message (usually the sender). See [GmailMessage.getReplyTo()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getReplyTo\(\)) reference docs. | `message-reply-to@example.com` |
| <a id="placeholder.message.subject">`message.subject`</a> | The subject of the message. See [GmailMessage.getSubject()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getSubject\(\)) reference docs. | `Message Subject 1` |
| <a id="placeholder.message.subject.match.1">`message.subject.match.1`</a> | The matching regex group number as defined in the match config (e.g.: `"Message (?<myMatchGroup>.*)"`). | `Subject 1` |
| <a id="placeholder.message.subject.match.myMatchGroup">`message.subject.match.myMatchGroup`</a> | The matching named regex group name as defined in the match config (e.g.: `"Message (?<myMatchGroup>.*)"`). | `Subject 1` |
| <a id="placeholder.message.to">`message.to`</a> | The comma-separated recipients of the message. See [GmailMessage.getTo()](https://developers.google.com/apps-script/reference/gmail/gmail-message#getTo\(\)) reference docs. | `message-to@example.com` |
| <a id="placeholder.message.url">`message.url`</a> | The URL of the message. | `https://mail.google.com/mail/u/0/#inbox/message-id` |
| <a id="placeholder.messageConfig.index">`messageConfig.index`</a> | The index number (0-based) of the message config. | `0` |

## `attachment` Placeholder

| Key | Description | Example |
|-----|-------------|---------|
| <a id="placeholder.attachment.contentType">`attachment.contentType`</a> | The content type of the attachment. See [GmailAttachment.getContentType()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getContentType\(\)) reference docs. | `application/pdf` |
| <a id="placeholder.attachment.contentType.match.1">`attachment.contentType.match.1`</a> | The matching regex group number as defined in the match config (e.g.: `"application/(?<appType>.*)"`). | `pdf` |
| <a id="placeholder.attachment.contentType.match.appType">`attachment.contentType.match.appType`</a> | The matching named regex group name as defined in the match config (e.g.: `"application/(?<appType>.*)"`). | `pdf` |
| <a id="placeholder.attachment.hash">`attachment.hash`</a> | The SHA1 content hash for the attachment. See [GmailAttachment.getHash()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getHash\(\)) reference docs. | `aa0b8cc192a5d8d5b5d8ecda24fd0961b10ae283` |
| <a id="placeholder.attachment.index">`attachment.index`</a> | The index number (0-based) of the attachment. | `0` |
| <a id="placeholder.attachment.isGoogleType">`attachment.isGoogleType`</a> | `true` if this attachment is a Google Workspace file (Sheets, Docs, etc.). See [GmailAttachment.isGoogleType()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#isGoogleType\(\)) reference docs. | `false` |
| <a id="placeholder.attachment.matched">`attachment.matched`</a> | The overall matching result for all conditions in the match config. | `true` |
| <a id="placeholder.attachment.name">`attachment.name`</a> | The name of the attachment. See [GmailAttachment.getName()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getName\(\)) reference docs. | `attachment1.pdf` |
| <a id="placeholder.attachment.name.match.1">`attachment.name.match.1`</a> | The matching regex group number as defined in the match config (e.g.: `"attachment(?<attNr>[0-9]+)\.pdf"`). | `1` |
| <a id="placeholder.attachment.name.match.attNr">`attachment.name.match.attNr`</a> | The matching named regex group name as defined in the match config (e.g.: `"attachment(?<attNr>[0-9]+)\.pdf"`). | `1` |
| <a id="placeholder.attachment.size">`attachment.size`</a> | The size of the attachment. See [GmailAttachment.getSize()](https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getSize\(\)) reference docs. | `18` |
| <a id="placeholder.attachmentConfig.index">`attachmentConfig.index`</a> | The index number (0-based) of the attachment config. | `0` |
