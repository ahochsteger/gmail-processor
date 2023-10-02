---
sidebar_position: 32
---
# Enum Types

These are the supported enum types and the possible values that can be used in the configuration.

## ConflictStrategy

Strategy that defines how to deal in case of conflicts with already existing files at the desired location in Google Drive.

| Value | Description |
|-------|-------------|
| `backup` | Create a backup of the existing file by renaming it. |
| `error` | Terminate processing with an error. |
| `keep` | Keep the existing file and create the new one with the same name. |
| `replace` | Replace the existing file with the new one. |
| `skip` | Skip creating the new file and keep the existing one. |
| `update` | Update the existing file with the contents of the new one (keep it's file ID). |

## ContextType

A type of context.

| Value | Description |
|-------|-------------|
| `attachment` | A context holding the attachment configuration and information about the currently processed attachment. |
| `env` | A context holding all environment information and references to environment objects. |
| `message` | A context holding the message configuration and information about the currently processed message. |
| `proc` | A context holding all processing information like the configuration, integration adapters, action registry and timer. |
| `thread` | A context holding the thread configuration and information about the currently processed thread. |

## LogLevel

Levels of log messages used for marking and filtering.

| Value | Description |
|-------|-------------|
| `debug` | Log level for debugging messages. |
| `error` | Log level for error messages. |
| `info` | Log level for info messages. |
| `warn` | Log level for warning messages. |

## MarkProcessedMethod

The method to mark processed threads/messages/attachments.

| Value | Description |
|-------|-------------|
| `add-label` | Adds the label defined in the setting `markProcessedLabel` to each processed thread.<br /><br />**NOTE:**<br />- Automatically appends the action `thread.addLabel` to the list of global thread actions<br />- Automatically appends `-label:<markProcessedLabel>` to the global thread match query config<br /><br />**Limitations:**<br />- It cannot handle multiple messages per thread properly. |
| `custom` | Doesn't do anything to mark threads, messages or attachments as processed and leaves this task to the user.<br /><br />**NOTE:**<br />- Use actions on the desired level (threads, messages or attachments) to mark them as processed.<br />- Take care to exclude them from queries in the thread match config, to prevent re-processing over and over again.<br /><br />**Limitations:**<br />- Is more complex since you have to take care to |
| `mark-read` | Marks processed messages as read, which is more flexible than adding a thread label.<br />But it comes at the cost of marking messages as read, which may not be expected.<br /><br />**NOTE:**<br />- Automatically appends the action `message.markRead` to the list of global message actions<br />- Automatically appends `-is:read` to the global thread match query config<br />- Automatically adds `is: ["unread"]` to the global message match config<br /><br />**Limitations:**<br />- Since it marks messages as read it may not be applicable in all cases. |

## MessageFlag

A flag to match messages with certain properties.

| Value | Description |
|-------|-------------|
| `read` | Matches read messages. |
| `starred` | Matches starred messages. |
| `unread` | Matches unread messages. |
| `unstarred` | Matches un-starred messages. |

## MetaInfoType

The type of meta information used for context substitution placeholders.

| Value | Description |
|-------|-------------|
| `boolean` | Boolean type substituted to `true` or `false`. |
| `date` | Date/time type. For substitution a format string can be given using `${<placeholder>:format:<pattern>}`. |
| `number` | A numeric data type. |
| `string` | A string data type. |
| `variable` | A custom configuration variable. |

## PlaceholderType

The type of a placeholder.

| Value | Description |
|-------|-------------|
| `attachment` | An attachment placeholder type. |
| `message` | A message placeholder type. |
| `thread` | A thread placeholder type. |

## ProcessingStage

The stage of action processing

| Value | Description |
|-------|-------------|
| `main` | The stage during processing the main object (thread, message, attachment) |
| `post-main` | The stage after processing the main object (thread, message, attachment) |
| `pre-main` | The stage before processing the main object (thread, message, attachment) |

## ProcessingStatus

The result status of processing a config or an action.

| Value | Description |
|-------|-------------|
| `error` | An error has occurred. |
| `ok` | The processing was successful. |

## RunMode

The runtime mode in which processing takes place.

| Value | Description |
|-------|-------------|
| `dangerous` | This run-mode will execute all configured actions including possibly destructive actions like overwriting files or removing threads or messages.<br />ATTENTION: Use this only if you know exactly what you're doing and won't complain if something goes wrong! |
| `dry-run` | This run-mode skips execution of writing actions. Use this for testing config changes or library upgrades. |
| `safe-mode` | This run-mode can be used for normal operation but will skip possibly destructive actions like overwriting files or removing threads or messages. |
