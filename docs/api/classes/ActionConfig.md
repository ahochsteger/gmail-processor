[gmail-processor](../README.md) / [Exports](../modules.md) / ActionConfig

# Class: ActionConfig

## Hierarchy

- **`ActionConfig`**

  ↳ [`AttachmentActionConfig`](AttachmentActionConfig.md)

  ↳ [`MessageActionConfig`](MessageActionConfig.md)

  ↳ [`ThreadActionConfig`](ThreadActionConfig.md)

## Table of contents

### Constructors

- [constructor](ActionConfig.md#constructor)

### Properties

- [args](ActionConfig.md#args)
- [description](ActionConfig.md#description)
- [name](ActionConfig.md#name)
- [processingStage](ActionConfig.md#processingstage)

## Constructors

### constructor

• **new ActionConfig**()

## Properties

### args

• `Optional` **args**: `Object` = `{}`

The arguments for a certain action

#### Index signature

▪ [k: `string`]: `unknown`

#### Defined in

[lib/config/ActionConfig.ts:28](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ActionConfig.ts#L28)

___

### description

• `Optional` **description**: `string` = `""`

The description for the action

#### Defined in

[lib/config/ActionConfig.ts:34](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ActionConfig.ts#L34)

___

### name

• **name**: `string` = `""`

The name of the action to be executed

#### Defined in

[lib/config/ActionConfig.ts:40](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ActionConfig.ts#L40)

___

### processingStage

• `Optional` **processingStage**: [`ProcessingStage`](../enums/ProcessingStage.md) = `ProcessingStage.POST_MAIN`

The processing stage in which the action should run (during main processing stage or pre-main/post-main)

#### Defined in

[lib/config/ActionConfig.ts:46](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ActionConfig.ts#L46)
