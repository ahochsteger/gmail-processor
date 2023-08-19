[gmail-processor](../README.md) / [Exports](../modules.md) / ThreadConfig

# Class: ThreadConfig

Represents a config handle a certain GMail thread

## Table of contents

### Constructors

- [constructor](ThreadConfig.md#constructor)

### Properties

- [actions](ThreadConfig.md#actions)
- [attachments](ThreadConfig.md#attachments)
- [description](ThreadConfig.md#description)
- [match](ThreadConfig.md#match)
- [messages](ThreadConfig.md#messages)
- [name](ThreadConfig.md#name)

## Constructors

### constructor

• **new ThreadConfig**()

## Properties

### actions

• `Optional` **actions**: [`ThreadActionConfig`](ThreadActionConfig.md)[] = `[]`

The list actions to be executed for their respective handler scopes

#### Defined in

[lib/config/ThreadConfig.ts:28](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ThreadConfig.ts#L28)

___

### attachments

• `Optional` **attachments**: [`AttachmentConfig`](AttachmentConfig.md)[] = `[]`

The list of handler that define the way attachments are processed

#### Defined in

[lib/config/ThreadConfig.ts:45](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ThreadConfig.ts#L45)

___

### description

• `Optional` **description**: `string` = `""`

The description of the thread handler config

#### Defined in

[lib/config/ThreadConfig.ts:33](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ThreadConfig.ts#L33)

___

### match

• `Optional` **match**: [`ThreadMatchConfig`](ThreadMatchConfig.md)

Specifies which threads match for further processing

#### Defined in

[lib/config/ThreadConfig.ts:51](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ThreadConfig.ts#L51)

___

### messages

• `Optional` **messages**: [`MessageConfig`](MessageConfig.md)[] = `[]`

The list of handler that define the way nested messages or attachments are processed

#### Defined in

[lib/config/ThreadConfig.ts:39](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ThreadConfig.ts#L39)

___

### name

• `Optional` **name**: `string` = `""`

The unique name of the thread config (will be generated if not set)

#### Defined in

[lib/config/ThreadConfig.ts:56](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ThreadConfig.ts#L56)
