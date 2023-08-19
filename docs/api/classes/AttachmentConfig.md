[gmail-processor](../README.md) / [Exports](../modules.md) / AttachmentConfig

# Class: AttachmentConfig

Represents a config to handle a certain GMail attachment

## Table of contents

### Constructors

- [constructor](AttachmentConfig.md#constructor)

### Properties

- [actions](AttachmentConfig.md#actions)
- [description](AttachmentConfig.md#description)
- [match](AttachmentConfig.md#match)
- [name](AttachmentConfig.md#name)

## Constructors

### constructor

• **new AttachmentConfig**()

## Properties

### actions

• `Optional` **actions**: [`AttachmentActionConfig`](AttachmentActionConfig.md)[] = `[]`

The list actions to be executed for their respective handler scopes

#### Defined in

[lib/config/AttachmentConfig.ts:22](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/AttachmentConfig.ts#L22)

___

### description

• `Optional` **description**: `string` = `""`

The description of the attachment handler config

#### Defined in

[lib/config/AttachmentConfig.ts:27](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/AttachmentConfig.ts#L27)

___

### match

• `Optional` **match**: [`AttachmentMatchConfig`](AttachmentMatchConfig.md)

Specifies which attachments match for further processing

#### Defined in

[lib/config/AttachmentConfig.ts:33](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/AttachmentConfig.ts#L33)

___

### name

• `Optional` **name**: `string` = `""`

The unique name of the attachment config (will be generated if not set)

#### Defined in

[lib/config/AttachmentConfig.ts:38](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/AttachmentConfig.ts#L38)
