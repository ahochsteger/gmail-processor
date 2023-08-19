[gmail-processor](../README.md) / [Exports](../modules.md) / MessageActionConfig

# Class: MessageActionConfig

Represents a config to perform a actions for a GMail message.

## Hierarchy

- [`ActionConfig`](ActionConfig.md)

  ↳ **`MessageActionConfig`**

## Table of contents

### Constructors

- [constructor](MessageActionConfig.md#constructor)

### Properties

- [args](MessageActionConfig.md#args)
- [description](MessageActionConfig.md#description)
- [name](MessageActionConfig.md#name)
- [processingStage](MessageActionConfig.md#processingstage)

## Constructors

### constructor

• **new MessageActionConfig**()

#### Inherited from

[ActionConfig](ActionConfig.md).[constructor](ActionConfig.md#constructor)

## Properties

### args

• `Optional` **args**: `Object` = `{}`

The arguments for a certain action

#### Index signature

▪ [k: `string`]: `unknown`

#### Inherited from

[ActionConfig](ActionConfig.md).[args](ActionConfig.md#args)

#### Defined in

[lib/config/ActionConfig.ts:28](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ActionConfig.ts#L28)

___

### description

• `Optional` **description**: `string` = `""`

The description for the action

#### Inherited from

[ActionConfig](ActionConfig.md).[description](ActionConfig.md#description)

#### Defined in

[lib/config/ActionConfig.ts:34](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ActionConfig.ts#L34)

___

### name

• **name**: ``""`` \| ``"global.log"`` \| ``"global.sheetLog"`` \| ``"message.forward"`` \| ``"message.markRead"`` \| ``"message.markUnread"`` \| ``"message.moveToTrash"`` \| ``"message.star"`` \| ``"message.unstar"`` \| ``"message.storePDF"`` \| ``"thread.markRead"`` \| ``"thread.markUnread"`` \| ``"thread.moveToTrash"`` \| ``"thread.storePDF"`` \| ``"thread.markImportant"`` \| ``"thread.markUnimportant"`` \| ``"thread.moveToArchive"`` \| ``"thread.moveToInbox"`` \| ``"thread.moveToSpam"`` \| ``"thread.addLabel"`` \| ``"thread.removeLabel"`` = `""`

The name of the action to be executed

#### Overrides

[ActionConfig](ActionConfig.md).[name](ActionConfig.md#name)

#### Defined in

[lib/config/ActionConfig.ts:60](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ActionConfig.ts#L60)

___

### processingStage

• `Optional` **processingStage**: [`ProcessingStage`](../enums/ProcessingStage.md) = `ProcessingStage.POST_MAIN`

The processing stage in which the action should run (during main processing stage or pre-main/post-main)

#### Inherited from

[ActionConfig](ActionConfig.md).[processingStage](ActionConfig.md#processingstage)

#### Defined in

[lib/config/ActionConfig.ts:46](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ActionConfig.ts#L46)
