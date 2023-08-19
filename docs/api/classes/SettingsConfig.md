[gmail-processor](../README.md) / [Exports](../modules.md) / SettingsConfig

# Class: SettingsConfig

Represents a settings config that affect the way GmailProcessor works.

## Table of contents

### Constructors

- [constructor](SettingsConfig.md#constructor)

### Properties

- [logSheetLocation](SettingsConfig.md#logsheetlocation)
- [markProcessedLabel](SettingsConfig.md#markprocessedlabel)
- [markProcessedMethod](SettingsConfig.md#markprocessedmethod)
- [maxBatchSize](SettingsConfig.md#maxbatchsize)
- [maxRuntime](SettingsConfig.md#maxruntime)
- [sleepTimeAttachments](SettingsConfig.md#sleeptimeattachments)
- [sleepTimeMessages](SettingsConfig.md#sleeptimemessages)
- [sleepTimeThreads](SettingsConfig.md#sleeptimethreads)
- [timezone](SettingsConfig.md#timezone)

## Constructors

### constructor

• **new SettingsConfig**()

## Properties

### logSheetLocation

• `Optional` **logSheetLocation**: `string` = `""`

Path of the spreadsheet log file. Enables logging to a spreadsheet if not empty.
Example: `GmailProcessor/logsheet-${date.now:format:yyyy-MM}`

#### Defined in

[lib/config/SettingsConfig.ts:39](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/SettingsConfig.ts#L39)

___

### markProcessedLabel

• `Optional` **markProcessedLabel**: `string` = `""`

The label to be added to processed GMail threads (only for markProcessedMode="label", deprecated - only for compatibility to v1)

#### Defined in

[lib/config/SettingsConfig.ts:54](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/SettingsConfig.ts#L54)

___

### markProcessedMethod

• `Optional` **markProcessedMethod**: [`MarkProcessedMethod`](../enums/MarkProcessedMethod.md) = `MarkProcessedMethod.MARK_MESSAGE_READ`

The method to mark processed threads/messages.

#### Defined in

[lib/config/SettingsConfig.ts:59](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/SettingsConfig.ts#L59)

___

### maxBatchSize

• `Optional` **maxBatchSize**: `number` = `10`

The maximum batch size of threads to process in a single run to respect Google processing limits

#### Defined in

[lib/config/SettingsConfig.ts:44](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/SettingsConfig.ts#L44)

___

### maxRuntime

• `Optional` **maxRuntime**: `number` = `280`

The maximum runtime in seconds for a single run to respect Google processing limits

#### Defined in

[lib/config/SettingsConfig.ts:49](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/SettingsConfig.ts#L49)

___

### sleepTimeAttachments

• `Optional` **sleepTimeAttachments**: `number` = `0`

The sleep time in milliseconds between processing each attachment

#### Defined in

[lib/config/SettingsConfig.ts:75](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/SettingsConfig.ts#L75)

___

### sleepTimeMessages

• `Optional` **sleepTimeMessages**: `number` = `0`

The sleep time in milliseconds between processing each message

#### Defined in

[lib/config/SettingsConfig.ts:70](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/SettingsConfig.ts#L70)

___

### sleepTimeThreads

• `Optional` **sleepTimeThreads**: `number` = `100`

The sleep time in milliseconds between processing each thread

#### Defined in

[lib/config/SettingsConfig.ts:65](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/SettingsConfig.ts#L65)

___

### timezone

• `Optional` **timezone**: `string`

Overrides the <a href="https://developers.google.com/apps-script/reference/base/session#getscripttimezone">script timezone</a>, which is used by default.

#### Defined in

[lib/config/SettingsConfig.ts:80](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/SettingsConfig.ts#L80)
