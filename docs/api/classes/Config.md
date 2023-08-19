[gmail-processor](../README.md) / [Exports](../modules.md) / Config

# Class: Config

Represents the configuration root for GmailProcessor

## Hierarchy

- `ProcessingConfig`

  ↳ **`Config`**

## Table of contents

### Constructors

- [constructor](Config.md#constructor)

### Properties

- [attachments](Config.md#attachments)
- [description](Config.md#description)
- [global](Config.md#global)
- [messages](Config.md#messages)
- [settings](Config.md#settings)
- [threads](Config.md#threads)

## Constructors

### constructor

• **new Config**()

#### Inherited from

ProcessingConfig.constructor

## Properties

### attachments

• `Optional` **attachments**: [`AttachmentConfig`](AttachmentConfig.md)[] = `[]`

The list of handler that define the way attachments are processed

#### Defined in

[lib/config/Config.ts:74](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/Config.ts#L74)

___

### description

• `Optional` **description**: `string` = `""`

The description of the GmailProcessor config

#### Inherited from

ProcessingConfig.description

#### Defined in

[lib/config/Config.ts:38](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/Config.ts#L38)

___

### global

• `Optional` **global**: [`GlobalConfig`](GlobalConfig.md)

The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.

#### Inherited from

ProcessingConfig.global

#### Defined in

[lib/config/Config.ts:44](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/Config.ts#L44)

___

### messages

• `Optional` **messages**: [`MessageConfig`](MessageConfig.md)[] = `[]`

The list of handler that define the way nested messages or attachments are processed

#### Defined in

[lib/config/Config.ts:68](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/Config.ts#L68)

___

### settings

• `Optional` **settings**: [`SettingsConfig`](SettingsConfig.md)

Represents a settings config that affect the way GmailProcessor works.

#### Inherited from

ProcessingConfig.settings

#### Defined in

[lib/config/Config.ts:56](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/Config.ts#L56)

___

### threads

• `Optional` **threads**: [`ThreadConfig`](ThreadConfig.md)[] = `[]`

The list of handler that define the way nested threads, messages or attachments are processed

#### Inherited from

ProcessingConfig.threads

#### Defined in

[lib/config/Config.ts:50](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/Config.ts#L50)
