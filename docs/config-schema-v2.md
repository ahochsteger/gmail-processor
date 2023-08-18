# Objects
* [`AttachmentConfig`](#reference-attachmentconfig)
    * [`AttachmentMatchConfig`](#reference-attachmentmatchconfig)
* [`Config`](#reference-config) (root object)
* [`GlobalConfig`](#reference-globalconfig)
* [`MessageConfig`](#reference-messageconfig)
    * [`MessageMatchConfig`](#reference-messagematchconfig)
* [`SettingsConfig`](#reference-settingsconfig)
* [`ThreadConfig`](#reference-threadconfig)
    * [`ThreadMatchConfig`](#reference-threadmatchconfig)




---------------------------------------
<a name="reference-attachmentactionconfig"></a>
## AttachmentActionConfig

Represents a config to perform a actions for a GMail attachment.

**`AttachmentActionConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**args**|`object`|The arguments for a certain action|No|
|**description**|`string`|The description for the action|No, default: |
|**name**|`string`|The name of the action to be executed| &#10003; Yes|
|**processingStage**|`string`|The processing stage in which the action should run (during main processing stage or pre-main/post-main)|No|

Additional properties are not allowed.

### AttachmentActionConfig.args

The arguments for a certain action

* **Type**: `object`
* **Required**: No

### AttachmentActionConfig.description

The description for the action

* **Type**: `string`
* **Required**: No, default: 

### AttachmentActionConfig.name

The name of the action to be executed

* **Type**: `string`
* **Required**:  &#10003; Yes
* **Allowed values**:
    * 
    * `"attachment.store"`
    * `"global.log"`
    * `"global.sheetLog"`
    * `"message.forward"`
    * `"message.markRead"`
    * `"message.markUnread"`
    * `"message.moveToTrash"`
    * `"message.star"`
    * `"message.storePDF"`
    * `"message.unstar"`
    * `"thread.addLabel"`
    * `"thread.markImportant"`
    * `"thread.markRead"`
    * `"thread.markUnimportant"`
    * `"thread.markUnread"`
    * `"thread.moveToArchive"`
    * `"thread.moveToInbox"`
    * `"thread.moveToSpam"`
    * `"thread.moveToTrash"`
    * `"thread.removeLabel"`
    * `"thread.storePDF"`

### AttachmentActionConfig.processingStage

The processing stage in which the action should run (during main processing stage or pre-main/post-main)

* **Type**: `string`
* **Required**: No
* **Allowed values**:
    * `"main"`
    * `"post-main"`
    * `"pre-main"`




---------------------------------------
<a name="reference-attachmentconfig"></a>
## AttachmentConfig

Represents a config to handle a certain GMail attachment

**`AttachmentConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**actions**|`AttachmentActionConfig` `[]`|The list actions to be executed for their respective handler scopes|No, default: `[]`|
|**description**|`string`|The description of the attachment handler config|No, default: |
|**match**|`AttachmentMatchConfig`|Represents a config to match a certain GMail attachment|No|
|**name**|`string`|The unique name of the attachment config (will be generated if not set)|No, default: |

Additional properties are not allowed.

### AttachmentConfig.actions

The list actions to be executed for their respective handler scopes

* **Type**: `AttachmentActionConfig` `[]`
* **Required**: No, default: `[]`

### AttachmentConfig.description

The description of the attachment handler config

* **Type**: `string`
* **Required**: No, default: 

### AttachmentConfig.match

Represents a config to match a certain GMail attachment

* **Type**: `AttachmentMatchConfig`
* **Required**: No

### AttachmentConfig.name

The unique name of the attachment config (will be generated if not set)

* **Type**: `string`
* **Required**: No, default: 




---------------------------------------
<a name="reference-attachmentmatchconfig"></a>
## AttachmentMatchConfig

Represents a config to match a certain GMail attachment

**`AttachmentMatchConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**contentType**|`string`|A RegEx matching the content type of the attachment|No, default: `".*"`|
|**includeAttachments**|`boolean`|Should regular attachments be included in attachment processing (default: true)|No, default: `true`|
|**includeInlineImages**|`boolean`|Should inline images be included in attachment processing (default: true)|No, default: `true`|
|**largerThan**|`number`|Only include attachments larger than the given size in bytes|No, default: `-1`|
|**name**|`string`|A RegEx matching the name of the attachment|No, default: `"(.*)"`|
|**smallerThan**|`number`|Only include attachments smaller than the given size in bytes|No|

Additional properties are not allowed.

### AttachmentMatchConfig.contentType

A RegEx matching the content type of the attachment

* **Type**: `string`
* **Required**: No, default: `".*"`

### AttachmentMatchConfig.includeAttachments

Should regular attachments be included in attachment processing (default: true)

* **Type**: `boolean`
* **Required**: No, default: `true`

### AttachmentMatchConfig.includeInlineImages

Should inline images be included in attachment processing (default: true)

* **Type**: `boolean`
* **Required**: No, default: `true`

### AttachmentMatchConfig.largerThan

Only include attachments larger than the given size in bytes

* **Type**: `number`
* **Required**: No, default: `-1`

### AttachmentMatchConfig.name

A RegEx matching the name of the attachment

* **Type**: `string`
* **Required**: No, default: `"(.*)"`

### AttachmentMatchConfig.smallerThan

Only include attachments smaller than the given size in bytes

* **Type**: `number`
* **Required**: No






---------------------------------------
<a name="reference-config"></a>
## Config

Represents the configuration root for GmailProcessor

**`Config` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**attachments**|`AttachmentConfig` `[]`|The list of handler that define the way attachments are processed|No, default: `[]`|
|**description**|`string`|The description of the GmailProcessor config|No, default: |
|**global**|`GlobalConfig`|The global configuration defines matching and actions for all threads, messages or attachments.|No|
|**messages**|`MessageConfig` `[]`|The list of handler that define the way nested messages or attachments are processed|No, default: `[]`|
|**settings**|`SettingsConfig`|Represents a settings config that affect the way GmailProcessor works.|No|
|**threads**|`ThreadConfig` `[]`|The list of handler that define the way nested threads, messages or attachments are processed|No, default: `[]`|

Additional properties are not allowed.

### Config.attachments

The list of handler that define the way attachments are processed

* **Type**: `AttachmentConfig` `[]`
* **Required**: No, default: `[]`

### Config.description

The description of the GmailProcessor config

* **Type**: `string`
* **Required**: No, default: 

### Config.global

The global configuration defines matching and actions for all threads, messages or attachments.

* **Type**: `GlobalConfig`
* **Required**: No

### Config.messages

The list of handler that define the way nested messages or attachments are processed

* **Type**: `MessageConfig` `[]`
* **Required**: No, default: `[]`

### Config.settings

Represents a settings config that affect the way GmailProcessor works.

* **Type**: `SettingsConfig`
* **Required**: No

### Config.threads

The list of handler that define the way nested threads, messages or attachments are processed

* **Type**: `ThreadConfig` `[]`
* **Required**: No, default: `[]`




---------------------------------------
<a name="reference-globalconfig"></a>
## GlobalConfig

The global configuration defines matching and actions for all threads, messages or attachments.

**`GlobalConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**attachment**|`AttachmentConfig`|Represents a config to handle a certain GMail attachment|No|
|**message**|`MessageConfig`|Represents a config to handle a certain GMail message|No|
|**thread**|`ThreadConfig`|Represents a config handle a certain GMail thread|No|
|**variables**|`VariableEntry` `[]`|A list of variable entries to be used in substitutions to simplify configurations.|No, default: `[]`|

Additional properties are not allowed.

### GlobalConfig.attachment

Represents a config to handle a certain GMail attachment

* **Type**: `AttachmentConfig`
* **Required**: No

### GlobalConfig.message

Represents a config to handle a certain GMail message

* **Type**: `MessageConfig`
* **Required**: No

### GlobalConfig.thread

Represents a config handle a certain GMail thread

* **Type**: `ThreadConfig`
* **Required**: No

### GlobalConfig.variables

A list of variable entries to be used in substitutions to simplify configurations.

* **Type**: `VariableEntry` `[]`
* **Required**: No, default: `[]`






---------------------------------------
<a name="reference-messageactionconfig"></a>
## MessageActionConfig

Represents a config to perform a actions for a GMail message.

**`MessageActionConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**args**|`object`|The arguments for a certain action|No|
|**description**|`string`|The description for the action|No, default: |
|**name**|`string`|The name of the action to be executed| &#10003; Yes|
|**processingStage**|`string`|The processing stage in which the action should run (during main processing stage or pre-main/post-main)|No|

Additional properties are not allowed.

### MessageActionConfig.args

The arguments for a certain action

* **Type**: `object`
* **Required**: No

### MessageActionConfig.description

The description for the action

* **Type**: `string`
* **Required**: No, default: 

### MessageActionConfig.name

The name of the action to be executed

* **Type**: `string`
* **Required**:  &#10003; Yes
* **Allowed values**:
    * 
    * `"global.log"`
    * `"global.sheetLog"`
    * `"message.forward"`
    * `"message.markRead"`
    * `"message.markUnread"`
    * `"message.moveToTrash"`
    * `"message.star"`
    * `"message.storePDF"`
    * `"message.unstar"`
    * `"thread.addLabel"`
    * `"thread.markImportant"`
    * `"thread.markRead"`
    * `"thread.markUnimportant"`
    * `"thread.markUnread"`
    * `"thread.moveToArchive"`
    * `"thread.moveToInbox"`
    * `"thread.moveToSpam"`
    * `"thread.moveToTrash"`
    * `"thread.removeLabel"`
    * `"thread.storePDF"`

### MessageActionConfig.processingStage

The processing stage in which the action should run (during main processing stage or pre-main/post-main)

* **Type**: `string`
* **Required**: No
* **Allowed values**:
    * `"main"`
    * `"post-main"`
    * `"pre-main"`




---------------------------------------
<a name="reference-messageconfig"></a>
## MessageConfig

Represents a config to handle a certain GMail message

**`MessageConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**actions**|`MessageActionConfig` `[]`|The list actions to be executed for their respective handler scopes|No, default: `[]`|
|**attachments**|`AttachmentConfig` `[]`|The list of handler that define the way attachments are processed|No, default: `[]`|
|**description**|`string`|The description of the message handler config|No, default: |
|**match**|`MessageMatchConfig`|Represents a config to match a certain GMail message|No|
|**name**|`string`|The unique name of the message config (will be generated if not set)|No, default: |

Additional properties are not allowed.

### MessageConfig.actions

The list actions to be executed for their respective handler scopes

* **Type**: `MessageActionConfig` `[]`
* **Required**: No, default: `[]`

### MessageConfig.attachments

The list of handler that define the way attachments are processed

* **Type**: `AttachmentConfig` `[]`
* **Required**: No, default: `[]`

### MessageConfig.description

The description of the message handler config

* **Type**: `string`
* **Required**: No, default: 

### MessageConfig.match

Represents a config to match a certain GMail message

* **Type**: `MessageMatchConfig`
* **Required**: No

### MessageConfig.name

The unique name of the message config (will be generated if not set)

* **Type**: `string`
* **Required**: No, default: 




---------------------------------------
<a name="reference-messageflag"></a>
## MessageFlag

A flag to match messages with certain properties.



---------------------------------------
<a name="reference-messagematchconfig"></a>
## MessageMatchConfig

Represents a config to match a certain GMail message

**`MessageMatchConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**from**|`string`|A RegEx matching the sender email address of messages|No, default: `".*"`|
|**is**|`string` `[]`|A list of properties matching messages should have|No, default: `[]`|
|**newerThan**|`string`|An RFC 3339 date/time format matching messages older than the given date/time|No, default: |
|**olderThan**|`string`|An RFC 3339 date/time format matching messages older than the given date/time|No, default: |
|**subject**|`string`|A RegEx matching the subject of messages|No, default: `".*"`|
|**to**|`string`|A RegEx matching the recipient email address of messages|No, default: `".*"`|

Additional properties are not allowed.

### MessageMatchConfig.from

A RegEx matching the sender email address of messages

* **Type**: `string`
* **Required**: No, default: `".*"`

### MessageMatchConfig.is

A list of properties matching messages should have

* **Type**: `string` `[]`
    * Each element in the array must be one of the following values:
        * `read`
        * `starred`
        * `unread`
        * `unstarred`
* **Required**: No, default: `[]`

### MessageMatchConfig.newerThan

An RFC 3339 date/time format matching messages older than the given date/time

* **Type**: `string`
* **Required**: No, default: 

### MessageMatchConfig.olderThan

An RFC 3339 date/time format matching messages older than the given date/time

* **Type**: `string`
* **Required**: No, default: 

### MessageMatchConfig.subject

A RegEx matching the subject of messages

* **Type**: `string`
* **Required**: No, default: `".*"`

### MessageMatchConfig.to

A RegEx matching the recipient email address of messages

* **Type**: `string`
* **Required**: No, default: `".*"`






---------------------------------------
<a name="reference-settingsconfig"></a>
## SettingsConfig

Represents a settings config that affect the way GmailProcessor works.

**`SettingsConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**logSheetLocation**|`string`|Path of the spreadsheet log file. Enables logging to a spreadsheet if not empty.
Example: `GmailProcessor/logsheet-${date.now:format:yyyy-MM}`|No, default: |
|**markProcessedLabel**|`string`|The label to be added to processed GMail threads (only for markProcessedMode="label", deprecated - only for compatibility to v1)|No, default: |
|**markProcessedMethod**|`string`|The method to mark processed threads/messages.|No|
|**maxBatchSize**|`number`|The maximum batch size of threads to process in a single run to respect Google processing limits|No, default: `10`|
|**maxRuntime**|`number`|The maximum runtime in seconds for a single run to respect Google processing limits|No, default: `280`|
|**sleepTimeAttachments**|`number`|The sleep time in milliseconds between processing each attachment|No, default: `0`|
|**sleepTimeMessages**|`number`|The sleep time in milliseconds between processing each message|No, default: `0`|
|**sleepTimeThreads**|`number`|The sleep time in milliseconds between processing each thread|No, default: `100`|
|**timezone**|`string`|Overrides the <a href="https://developers.google.com/apps-script/reference/base/session#getscripttimezone">script timezone</a>, which is used by default.|No|

Additional properties are not allowed.

### SettingsConfig.logSheetLocation

Path of the spreadsheet log file. Enables logging to a spreadsheet if not empty.
Example: `GmailProcessor/logsheet-${date.now:format:yyyy-MM}`

* **Type**: `string`
* **Required**: No, default: 

### SettingsConfig.markProcessedLabel

The label to be added to processed GMail threads (only for markProcessedMode="label", deprecated - only for compatibility to v1)

* **Type**: `string`
* **Required**: No, default: 

### SettingsConfig.markProcessedMethod

The method to mark processed threads/messages.

* **Type**: `string`
* **Required**: No
* **Allowed values**:
    * `"add-label"`
    * `"mark-read"`

### SettingsConfig.maxBatchSize

The maximum batch size of threads to process in a single run to respect Google processing limits

* **Type**: `number`
* **Required**: No, default: `10`

### SettingsConfig.maxRuntime

The maximum runtime in seconds for a single run to respect Google processing limits

* **Type**: `number`
* **Required**: No, default: `280`

### SettingsConfig.sleepTimeAttachments

The sleep time in milliseconds between processing each attachment

* **Type**: `number`
* **Required**: No, default: `0`

### SettingsConfig.sleepTimeMessages

The sleep time in milliseconds between processing each message

* **Type**: `number`
* **Required**: No, default: `0`

### SettingsConfig.sleepTimeThreads

The sleep time in milliseconds between processing each thread

* **Type**: `number`
* **Required**: No, default: `100`

### SettingsConfig.timezone

Overrides the <a href="https://developers.google.com/apps-script/reference/base/session#getscripttimezone">script timezone</a>, which is used by default.

* **Type**: `string`
* **Required**: No




---------------------------------------
<a name="reference-threadactionconfig"></a>
## ThreadActionConfig

Represents a config to perform a actions for a GMail thread.

**`ThreadActionConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**args**|`object`|The arguments for a certain action|No|
|**description**|`string`|The description for the action|No, default: |
|**name**|`string`|The name of the action to be executed| &#10003; Yes|
|**processingStage**|`string`|The processing stage in which the action should run (during main processing stage or pre-main/post-main)|No|

Additional properties are not allowed.

### ThreadActionConfig.args

The arguments for a certain action

* **Type**: `object`
* **Required**: No

### ThreadActionConfig.description

The description for the action

* **Type**: `string`
* **Required**: No, default: 

### ThreadActionConfig.name

The name of the action to be executed

* **Type**: `string`
* **Required**:  &#10003; Yes
* **Allowed values**:
    * 
    * `"global.log"`
    * `"global.sheetLog"`
    * `"thread.addLabel"`
    * `"thread.markImportant"`
    * `"thread.markRead"`
    * `"thread.markUnimportant"`
    * `"thread.markUnread"`
    * `"thread.moveToArchive"`
    * `"thread.moveToInbox"`
    * `"thread.moveToSpam"`
    * `"thread.moveToTrash"`
    * `"thread.removeLabel"`
    * `"thread.storePDF"`

### ThreadActionConfig.processingStage

The processing stage in which the action should run (during main processing stage or pre-main/post-main)

* **Type**: `string`
* **Required**: No
* **Allowed values**:
    * `"main"`
    * `"post-main"`
    * `"pre-main"`




---------------------------------------
<a name="reference-threadconfig"></a>
## ThreadConfig

Represents a config handle a certain GMail thread

**`ThreadConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**actions**|`ThreadActionConfig` `[]`|The list actions to be executed for their respective handler scopes|No, default: `[]`|
|**attachments**|`AttachmentConfig` `[]`|The list of handler that define the way attachments are processed|No, default: `[]`|
|**description**|`string`|The description of the thread handler config|No, default: |
|**match**|`ThreadMatchConfig`|Represents a config to match a certain GMail thread|No|
|**messages**|`MessageConfig` `[]`|The list of handler that define the way nested messages or attachments are processed|No, default: `[]`|
|**name**|`string`|The unique name of the thread config (will be generated if not set)|No, default: |

Additional properties are not allowed.

### ThreadConfig.actions

The list actions to be executed for their respective handler scopes

* **Type**: `ThreadActionConfig` `[]`
* **Required**: No, default: `[]`

### ThreadConfig.attachments

The list of handler that define the way attachments are processed

* **Type**: `AttachmentConfig` `[]`
* **Required**: No, default: `[]`

### ThreadConfig.description

The description of the thread handler config

* **Type**: `string`
* **Required**: No, default: 

### ThreadConfig.match

Represents a config to match a certain GMail thread

* **Type**: `ThreadMatchConfig`
* **Required**: No

### ThreadConfig.messages

The list of handler that define the way nested messages or attachments are processed

* **Type**: `MessageConfig` `[]`
* **Required**: No, default: `[]`

### ThreadConfig.name

The unique name of the thread config (will be generated if not set)

* **Type**: `string`
* **Required**: No, default: 




---------------------------------------
<a name="reference-threadmatchconfig"></a>
## ThreadMatchConfig

Represents a config to match a certain GMail thread

**`ThreadMatchConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**firstMessageSubject**|`string`|The regex to match `firstMessageSubject`|No, default: `".*"`|
|**labels**|`string`|The regex to match at least one label|No, default: `".*"`|
|**maxMessageCount**|`number`|The maximum number of messages a matching thread is allowed to have|No, default: `-1`|
|**minMessageCount**|`number`|The minimum number of messages a matching thread must have|No, default: `1`|
|**query**|`string`|The GMail search query additional to the global query to find threads to be processed.
See [Search operators you can use with Gmail](https://support.google.com/mail/answer/7190?hl=en) for more information.|No, default: |

Additional properties are not allowed.

### ThreadMatchConfig.firstMessageSubject

The regex to match `firstMessageSubject`

* **Type**: `string`
* **Required**: No, default: `".*"`

### ThreadMatchConfig.labels

The regex to match at least one label

* **Type**: `string`
* **Required**: No, default: `".*"`

### ThreadMatchConfig.maxMessageCount

The maximum number of messages a matching thread is allowed to have

* **Type**: `number`
* **Required**: No, default: `-1`

### ThreadMatchConfig.minMessageCount

The minimum number of messages a matching thread must have

* **Type**: `number`
* **Required**: No, default: `1`

### ThreadMatchConfig.query

The GMail search query additional to the global query to find threads to be processed.
See [Search operators you can use with Gmail](https://support.google.com/mail/answer/7190?hl=en) for more information.

* **Type**: `string`
* **Required**: No, default: 






---------------------------------------
<a name="reference-"></a>
## 



---------------------------------------
<a name="reference-variableentry"></a>
## VariableEntry

A variable entry available for string substitution (using `${variables.<varName>}`)

**`VariableEntry` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**key**|`string`|| &#10003; Yes|
|**value**|`string`|| &#10003; Yes|

Additional properties are not allowed.

### VariableEntry.key

* **Type**: `string`
* **Required**:  &#10003; Yes

### VariableEntry.value

* **Type**: `string`
* **Required**:  &#10003; Yes




