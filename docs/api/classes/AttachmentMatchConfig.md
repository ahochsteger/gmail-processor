[gmail-processor](../README.md) / [Exports](../modules.md) / AttachmentMatchConfig

# Class: AttachmentMatchConfig

Represents a config to match a certain GMail attachment

## Table of contents

### Constructors

- [constructor](AttachmentMatchConfig.md#constructor)

### Properties

- [contentType](AttachmentMatchConfig.md#contenttype)
- [includeAttachments](AttachmentMatchConfig.md#includeattachments)
- [includeInlineImages](AttachmentMatchConfig.md#includeinlineimages)
- [largerThan](AttachmentMatchConfig.md#largerthan)
- [name](AttachmentMatchConfig.md#name)
- [smallerThan](AttachmentMatchConfig.md#smallerthan)

## Constructors

### constructor

• **new AttachmentMatchConfig**()

## Properties

### contentType

• `Optional` **contentType**: `string` = `".*"`

A RegEx matching the content type of the attachment

#### Defined in

[lib/config/AttachmentMatchConfig.ts:14](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/AttachmentMatchConfig.ts#L14)

___

### includeAttachments

• `Optional` **includeAttachments**: `boolean` = `true`

Should regular attachments be included in attachment processing (default: true)

#### Defined in

[lib/config/AttachmentMatchConfig.ts:18](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/AttachmentMatchConfig.ts#L18)

___

### includeInlineImages

• `Optional` **includeInlineImages**: `boolean` = `true`

Should inline images be included in attachment processing (default: true)

#### Defined in

[lib/config/AttachmentMatchConfig.ts:22](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/AttachmentMatchConfig.ts#L22)

___

### largerThan

• `Optional` **largerThan**: `number` = `-1`

Only include attachments larger than the given size in bytes

#### Defined in

[lib/config/AttachmentMatchConfig.ts:26](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/AttachmentMatchConfig.ts#L26)

___

### name

• `Optional` **name**: `string` = `"(.*)"`

A RegEx matching the name of the attachment

#### Defined in

[lib/config/AttachmentMatchConfig.ts:30](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/AttachmentMatchConfig.ts#L30)

___

### smallerThan

• `Optional` **smallerThan**: `number` = `Number.MAX_SAFE_INTEGER`

Only include attachments smaller than the given size in bytes

#### Defined in

[lib/config/AttachmentMatchConfig.ts:34](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/AttachmentMatchConfig.ts#L34)
