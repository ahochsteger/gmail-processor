---
sidebar_position: 33
---
# Actions

## Overview

The actions can be only be triggered in valid processing scopes:

* [`global.*`](#global-actions): Globally available, can be placed anywhere in the configuration.
* [`thread.*`](#thread-actions): Run in the context of a thread (includes `message` and `attachment` context).
* [`message.*`](#message-actions): Run in the context of a message (includes `attachment` context).
* [`attachment.*`](#attachment-actions): Run in the context of an attachment.

## Attachment Actions

### `attachment.store`

Store an attachment to a Google Drive location.

| Arguments | Type | Description |
|-----------|------|-------------|
| `conflictStrategy` | `ConflictStrategy` | The strategy to be used in case a file already exists at the desired location. See [Enum Type `ConflictStrategy`](enum-types.md#conflictstrategy) for valid values. |
| `description` | `string` | The description to be attached to the Google Drive file.<br />Supports [placeholder](/placeholder) substitution. |
| `location` | `string` | The location (path + filename) of the Google Drive file.<br />For shared folders or Team Drives prepend the location with the folder ID like `{id:<folderId>}/...`.<br />Supports [placeholder](/placeholder) substitution. |

## Global Actions

### `global.log`

Create a log entry.

| Arguments | Type | Description |
|-----------|------|-------------|
| `level` | `LogLevel` | The level of the log message (default: `info`). See [Enum Type `LogLevel`](enum-types.md#loglevel) for valid values. |
| `message` | `string` | The message to be logged. |

### `global.panic`

Terminate processing due to an error.

| Arguments | Type | Description |
|-----------|------|-------------|
| `message` | `string` | The message to be logged before termination. |

### `global.sheetLog`

Create a log entry in the log spreadsheet.

| Arguments | Type | Description |
|-----------|------|-------------|
| `level` | `LogLevel` | The level of the log message (default: info). See [Enum Type `LogLevel`](enum-types.md#loglevel) for valid values. |
| `message` | `string` | The message to be logged. |

## Message Actions

### `message.forward`

Forwards this message.

| Arguments | Type | Description |
|-----------|------|-------------|
| `to` | `string` | The recipient of the forwarded message. |

### `message.markRead`

Marks the message as read.

This acton takes no arguments.

### `message.markUnread`

Marks the message as unread.

This acton takes no arguments.

### `message.moveToTrash`

Moves the message to the trash.

This acton takes no arguments.

### `message.star`

Adds a star to a message.

This acton takes no arguments.

### `message.storeFromURL`

Store a document referenced by a URL contained in the message body to GDrive.

| Arguments | Type | Description |
|-----------|------|-------------|
| `conflictStrategy` | `ConflictStrategy` | The strategy to be used in case a file already exists at the desired location. See [Enum Type `ConflictStrategy`](enum-types.md#conflictstrategy) for valid values. |
| `description` | `string` | The description to be attached to the Google Drive file.<br />Supports [placeholder](/placeholder) substitution. |
| `headers` | `` | The header to pass to the URL. May be used to pass an authentication token.<br />Supports [placeholder](/placeholder) substitution. |
| `location` | `string` | The location (path + filename) of the Google Drive file.<br />For shared folders or Team Drives prepend the location with `{id:<folderId>}`.<br />Supports [placeholder](/placeholder) substitution. |
| `url` | `string` | The URL of the document to be stored.<br />To extract the URL from the message body use a message body matcher like `"(?<url>https://...)"` and `"${message.body.match.url}"` as the URL value.<br />NOTE: Take care to narrow down the regex as good as possible to extract valid URLs.<br />Use tools like [regex101.com](https://regex101.com) for testing on example messages. |

### `message.storePDF`

Generate a PDF document from the message and store it to GDrive.

| Arguments | Type | Description |
|-----------|------|-------------|
| `conflictStrategy` | `ConflictStrategy` | The strategy to be used in case a file already exists at the desired location. See [Enum Type `ConflictStrategy`](enum-types.md#conflictstrategy) for valid values. |
| `description` | `string` | The description to be attached to the Google Drive file.<br />Supports [placeholder](/placeholder) substitution. |
| `location` | `string` | The location (path + filename) of the Google Drive file.<br />For shared folders or Team Drives prepend the location with `{id:<folderId>}`.<br />Supports [placeholder](/placeholder) substitution. |
| `skipHeader` | `boolean` | Skip the header if `true`. |

### `message.unstar`

Removes the star from a message.

This acton takes no arguments.

## Thread Actions

### `thread.addLabel`

Add a label to the thread.

| Arguments | Type | Description |
|-----------|------|-------------|
| `name` | `string` | The name of the label. |

### `thread.markImportant`

Mark the thread as important.

This acton takes no arguments.

### `thread.markRead`

Mark the thread as read.

This acton takes no arguments.

### `thread.markUnimportant`

Mark the thread as unimportant.

This acton takes no arguments.

### `thread.markUnread`

Mark the thread as unread.

This acton takes no arguments.

### `thread.moveToArchive`

Move the thread to the archive.

This acton takes no arguments.

### `thread.moveToInbox`

Move the thread to the inbox.

This acton takes no arguments.

### `thread.moveToSpam`

Move the thread to spam.

This acton takes no arguments.

### `thread.moveToTrash`

Move the thread to trash.

This acton takes no arguments.

### `thread.removeLabel`

Remove a label from the thread.

| Arguments | Type | Description |
|-----------|------|-------------|
| `name` | `string` | The name of the label. |

### `thread.storePDF`

Generate a PDF document for the whole thread and store it to GDrive.

| Arguments | Type | Description |
|-----------|------|-------------|
| `conflictStrategy` | `ConflictStrategy` | The strategy to be used in case a file already exists at the desired location. See [Enum Type `ConflictStrategy`](enum-types.md#conflictstrategy) for valid values. |
| `description` | `string` | The description to be attached to the Google Drive file.<br />Supports [placeholder](/placeholder) substitution. |
| `location` | `string` | The location (path + filename) of the Google Drive file.<br />For shared folders or Team Drives prepend the location with `{id:<folderId>}`.<br />Supports [placeholder](/placeholder) substitution. |
| `skipHeader` | `boolean` | Skip the header if `true`. |
