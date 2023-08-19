[gmail-processor](../README.md) / [Exports](../modules.md) / GlobalConfig

# Class: GlobalConfig

The global configuration defines matching and actions for all threads, messages or attachments.

## Table of contents

### Constructors

- [constructor](GlobalConfig.md#constructor)

### Properties

- [attachment](GlobalConfig.md#attachment)
- [message](GlobalConfig.md#message)
- [thread](GlobalConfig.md#thread)
- [variables](GlobalConfig.md#variables)

## Constructors

### constructor

• **new GlobalConfig**()

## Properties

### attachment

• `Optional` **attachment**: [`AttachmentConfig`](AttachmentConfig.md)

The global attachment config affecting each attachment.

#### Defined in

[lib/config/GlobalConfig.ts:43](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/GlobalConfig.ts#L43)

___

### message

• `Optional` **message**: [`MessageConfig`](MessageConfig.md)

The global message config affecting each message.

#### Defined in

[lib/config/GlobalConfig.ts:50](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/GlobalConfig.ts#L50)

___

### thread

• `Optional` **thread**: [`ThreadConfig`](ThreadConfig.md)

The list of global thread affecting each thread.

#### Defined in

[lib/config/GlobalConfig.ts:57](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/GlobalConfig.ts#L57)

___

### variables

• `Optional` **variables**: [`VariableEntry`](VariableEntry.md)[] = `[]`

A list of variable entries to be used in substitutions to simplify configurations.

#### Defined in

[lib/config/GlobalConfig.ts:64](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/GlobalConfig.ts#L64)
