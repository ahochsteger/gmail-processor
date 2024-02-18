---
id: enum-types
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
| `date` | Date/time type. For substitution a format string can be given using `${<placeholder>:date:<expression>:<format>}`. |
| `number` | A numeric data type. |
| `string` | A string data type. |
| `variable` | A custom configuration variable. |

## PlaceholderModifierType

The modifiers for placeholder expressions.

| Value | Description |
|-------|-------------|
| `date` | The `date` placeholder modifier converts the value of the given placeholder to a `Date` and allows date/time calculations on it.<br /><br />Syntax: `${<placeholder>:date:[[<date-expression>][:<format>]]}`<br />* `<date-expression> = [<date-fns-function>][<+/-><parse-duration>]`: If no expression is given, the date of the placeholder is used unmodified.<br />* `<date-fns-function>`: a supported [`date-fns` function](https://date-fns.org/docs/format) as defined by the constant [`DATE_FNS_FUNCTIONS` in DateUtils.ts](https://github.com/ahochsteger/gmail-processor/blob/main/src/lib/utils/DateUtils.ts)<br />* `<parse-duration>`: a relative duration in the form of a [parse-duration format string](https://github.com/jkroso/parse-duration#api)<br />* `<format>`: Format the resulting date/time using a [date-fns format string](https://date-fns.org/docs/format). If no format is given the setting `defaultTimestampFormat` is used.<br /><br />Examples:<br />* `${message.date:date:lastDayOfMonth-1d:yyyy-MM-DD}`: evaluates to the 2nd last day of the month in which the message has been sent.<br />* `${message.body.match.invoiceDate:date:startOfMonth+4d+1month:yyyy-MM-DD}`: evaluates to the 5th day of the month following the invoice date (extracted using a regex from the message body) |
| `format` | Use `${<placeholder>:format:<format>}` to format the date/time using a [date-fns format string](https://date-fns.org/docs/format).<br />**DEPRECATED**: Use `${<placeholder>:date::<format>}` instead. Note the double colon if no date modification expression is required. |
| `join` | Use `${<placeholder>:join[:<separator>]}` to join the values of an array into a string (default: `,`). |
| `` | No modifier |
| `offset-format` | Use `${<placeholder>:offset-format:<offset>[:<format>]}` to calculate the date/time offset using a [parse-duration format string](https://github.com/jkroso/parse-duration#parsestr-formatms) and then format the resulting date/time using a [date-fns format strings](https://date-fns.org/docs/format).<br />**DEPRECATED**: Use `${<placeholder>:date:<offset>[:<format>]}` instead. |
| `unsupported` | Unsupported placeholder modifier type given. |

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
