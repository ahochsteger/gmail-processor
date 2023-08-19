[gmail-processor](../README.md) / [Exports](../modules.md) / MessageConfig

# Class: MessageConfig

Represents a config to handle a certain GMail message

## Table of contents

### Constructors

- [constructor](MessageConfig.md#constructor)

### Properties

- [actions](MessageConfig.md#actions)
- [attachments](MessageConfig.md#attachments)
- [description](MessageConfig.md#description)
- [match](MessageConfig.md#match)
- [name](MessageConfig.md#name)

## Constructors

### constructor

• **new MessageConfig**()

## Properties

### actions

• `Optional` **actions**: [`MessageActionConfig`](MessageActionConfig.md)[] = `[]`

The list actions to be executed for their respective handler scopes

#### Defined in

[lib/config/MessageConfig.ts:27](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/MessageConfig.ts#L27)

___

### attachments

• `Optional` **attachments**: [`AttachmentConfig`](AttachmentConfig.md)[] = `[]`

The list of handler that define the way attachments are processed

#### Defined in

[lib/config/MessageConfig.ts:38](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/MessageConfig.ts#L38)

___

### description

• `Optional` **description**: `string` = `""`

The description of the message handler config

#### Defined in

[lib/config/MessageConfig.ts:32](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/MessageConfig.ts#L32)

___

### match

• `Optional` **match**: [`MessageMatchConfig`](MessageMatchConfig.md)

Specifies which attachments match for further processing

#### Defined in

[lib/config/MessageConfig.ts:44](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/MessageConfig.ts#L44)

___

### name

• `Optional` **name**: `string` = `""`

The unique name of the message config (will be generated if not set)

#### Defined in

[lib/config/MessageConfig.ts:49](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/MessageConfig.ts#L49)
