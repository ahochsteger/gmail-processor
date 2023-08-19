[gmail-processor](README.md) / Exports

# gmail-processor

## Table of contents

### Enumerations

- [MarkProcessedMethod](enums/MarkProcessedMethod.md)
- [MessageFlag](enums/MessageFlag.md)
- [ProcessingStage](enums/ProcessingStage.md)
- [ProcessingStatus](enums/ProcessingStatus.md)
- [RunMode](enums/RunMode.md)

### Classes

- [ActionConfig](classes/ActionConfig.md)
- [AttachmentActionConfig](classes/AttachmentActionConfig.md)
- [AttachmentConfig](classes/AttachmentConfig.md)
- [AttachmentMatchConfig](classes/AttachmentMatchConfig.md)
- [Config](classes/Config.md)
- [GlobalConfig](classes/GlobalConfig.md)
- [MessageActionConfig](classes/MessageActionConfig.md)
- [MessageConfig](classes/MessageConfig.md)
- [MessageMatchConfig](classes/MessageMatchConfig.md)
- [SettingsConfig](classes/SettingsConfig.md)
- [ThreadActionConfig](classes/ThreadActionConfig.md)
- [ThreadConfig](classes/ThreadConfig.md)
- [ThreadMatchConfig](classes/ThreadMatchConfig.md)
- [VariableEntry](classes/VariableEntry.md)

### Type Aliases

- [E2EConfig](modules.md#e2econfig)
- [FileConfig](modules.md#fileconfig)
- [ProcessingResult](modules.md#processingresult)

### Variables

- [gmailProcessor](modules.md#gmailprocessor)

### Functions

- [E2EInit](modules.md#e2einit)
- [buildMetaInfo](modules.md#buildmetainfo)
- [convertV1Config](modules.md#convertv1config)
- [defaultContext](modules.md#defaultcontext)
- [run](modules.md#run)

## Type Aliases

### E2EConfig

Ƭ **E2EConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `files` | [`FileConfig`](modules.md#fileconfig)[] |
| `folders` | { `location`: `string` ; `name`: `string`  }[] |
| `globals` | { `repoBaseUrl`: `string` ; `subjectPrefix`: `string` ; `to`: `string`  } |
| `globals.repoBaseUrl` | `string` |
| `globals.subjectPrefix` | `string` |
| `globals.to` | `string` |
| `mails` | { `files`: `string`[] ; `htmlBody`: `string` ; `name`: `string` ; `subject`: `string`  }[] |

#### Defined in

[lib/index.ts:144](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/index.ts#L144)

___

### FileConfig

Ƭ **FileConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `destFolder` | `string` |
| `filename` | `string` |
| `name` | `string` |
| `ref` | `string` |
| `type` | `string` |

#### Defined in

[lib/index.ts:136](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/index.ts#L136)

___

### ProcessingResult

Ƭ **ProcessingResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error?` | `Error` |
| `failedAction?` | [`ActionConfig`](classes/ActionConfig.md) |
| `performedActions` | [`ActionConfig`](classes/ActionConfig.md)[] |
| `status` | [`ProcessingStatus`](enums/ProcessingStatus.md) |

#### Defined in

[lib/Context.ts:165](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/Context.ts#L165)

## Variables

### gmailProcessor

• `Const` **gmailProcessor**: `GmailProcessor`

#### Defined in

[lib/index.ts:64](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/index.ts#L64)

## Functions

### E2EInit

▸ **E2EInit**(`config`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`E2EConfig`](modules.md#e2econfig) |

#### Returns

`void`

#### Defined in

[lib/index.ts:223](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/index.ts#L223)

___

### buildMetaInfo

▸ **buildMetaInfo**(`ctx`): `MetaInfo`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `EnvContext` |

#### Returns

`MetaInfo`

#### Defined in

[lib/index.ts:66](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/index.ts#L66)

___

### convertV1Config

▸ **convertV1Config**(`v1configJson`): `PartialDeep`<[`Config`](classes/Config.md)\>

Convert v1 configuration JSON to v2 configuration

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `v1configJson` | `PartialObjectDeep`<`V1Config`, {}\> | JSON representation of the v1 configuration without defaults |

#### Returns

`PartialDeep`<[`Config`](classes/Config.md)\>

Converted JSON representation of the configuration, omitting default values

#### Defined in

[lib/index.ts:128](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/index.ts#L128)

___

### defaultContext

▸ **defaultContext**(`runMode?`): `EnvContext`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `runMode` | [`RunMode`](enums/RunMode.md) | `RunMode.SAFE_MODE` |

#### Returns

`EnvContext`

#### Defined in

[lib/index.ts:88](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/index.ts#L88)

___

### run

▸ **run**(`configJson`, `runMode?`, `ctx?`): [`ProcessingResult`](modules.md#processingresult)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `configJson` | `PartialObjectDeep`<[`Config`](classes/Config.md), {}\> | `undefined` | GmailProcessor configuration JSON |
| `runMode` | `string` | `RunMode.SAFE_MODE` | Just show what would have been done but don't write anything to GMail or GDrive. |
| `ctx` | `EnvContext` | `undefined` | - |

#### Returns

[`ProcessingResult`](modules.md#processingresult)

#### Defined in

[lib/index.ts:115](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/index.ts#L115)
