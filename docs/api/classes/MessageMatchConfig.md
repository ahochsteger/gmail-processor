[gmail-processor](../README.md) / [Exports](../modules.md) / MessageMatchConfig

# Class: MessageMatchConfig

Represents a config to match a certain GMail message

## Table of contents

### Constructors

- [constructor](MessageMatchConfig.md#constructor)

### Properties

- [from](MessageMatchConfig.md#from)
- [is](MessageMatchConfig.md#is)
- [newerThan](MessageMatchConfig.md#newerthan)
- [olderThan](MessageMatchConfig.md#olderthan)
- [subject](MessageMatchConfig.md#subject)
- [to](MessageMatchConfig.md#to)

## Constructors

### constructor

• **new MessageMatchConfig**()

## Properties

### from

• `Optional` **from**: `string` = `".*"`

A RegEx matching the sender email address of messages

#### Defined in

[lib/config/MessageMatchConfig.ts:14](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/MessageMatchConfig.ts#L14)

___

### is

• `Optional` **is**: [`MessageFlag`](../enums/MessageFlag.md)[] = `[]`

A list of properties matching messages should have

#### Defined in

[lib/config/MessageMatchConfig.ts:18](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/MessageMatchConfig.ts#L18)

___

### newerThan

• `Optional` **newerThan**: `string` = `""`

An RFC 3339 date/time format matching messages older than the given date/time

#### Defined in

[lib/config/MessageMatchConfig.ts:22](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/MessageMatchConfig.ts#L22)

___

### olderThan

• `Optional` **olderThan**: `string` = `""`

An RFC 3339 date/time format matching messages older than the given date/time

#### Defined in

[lib/config/MessageMatchConfig.ts:26](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/MessageMatchConfig.ts#L26)

___

### subject

• `Optional` **subject**: `string` = `".*"`

A RegEx matching the subject of messages

#### Defined in

[lib/config/MessageMatchConfig.ts:30](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/MessageMatchConfig.ts#L30)

___

### to

• `Optional` **to**: `string` = `".*"`

A RegEx matching the recipient email address of messages

#### Defined in

[lib/config/MessageMatchConfig.ts:34](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/MessageMatchConfig.ts#L34)
