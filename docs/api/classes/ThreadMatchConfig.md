[gmail-processor](../README.md) / [Exports](../modules.md) / ThreadMatchConfig

# Class: ThreadMatchConfig

Represents a config to match a certain GMail thread

## Table of contents

### Constructors

- [constructor](ThreadMatchConfig.md#constructor)

### Properties

- [firstMessageSubject](ThreadMatchConfig.md#firstmessagesubject)
- [labels](ThreadMatchConfig.md#labels)
- [maxMessageCount](ThreadMatchConfig.md#maxmessagecount)
- [minMessageCount](ThreadMatchConfig.md#minmessagecount)
- [query](ThreadMatchConfig.md#query)

## Constructors

### constructor

• **new ThreadMatchConfig**()

## Properties

### firstMessageSubject

• `Optional` **firstMessageSubject**: `string` = `".*"`

The regex to match `firstMessageSubject`

#### Defined in

[lib/config/ThreadMatchConfig.ts:14](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ThreadMatchConfig.ts#L14)

___

### labels

• `Optional` **labels**: `string` = `".*"`

The regex to match at least one label

#### Defined in

[lib/config/ThreadMatchConfig.ts:18](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ThreadMatchConfig.ts#L18)

___

### maxMessageCount

• `Optional` **maxMessageCount**: `number` = `-1`

The maximum number of messages a matching thread is allowed to have

#### Defined in

[lib/config/ThreadMatchConfig.ts:24](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ThreadMatchConfig.ts#L24)

___

### minMessageCount

• `Optional` **minMessageCount**: `number` = `1`

The minimum number of messages a matching thread must have

#### Defined in

[lib/config/ThreadMatchConfig.ts:30](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ThreadMatchConfig.ts#L30)

___

### query

• `Optional` **query**: `string` = `""`

The GMail search query additional to the global query to find threads to be processed.
See [Search operators you can use with Gmail](https://support.google.com/mail/answer/7190?hl=en) for more information.

#### Defined in

[lib/config/ThreadMatchConfig.ts:37](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/ThreadMatchConfig.ts#L37)
