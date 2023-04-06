# Objects
* [`ActionConfig`](#reference-actionconfig)
* [`Config (v2)`](#reference-config-(v2)) (root object)
* [`GlobalConfig`](#reference-globalconfig)
* [`SettingsConfig`](#reference-settingsconfig)
* [`ThreadMatchConfig`](#reference-threadmatchconfig)


---------------------------------------
<a name="reference-actionconfig"></a>
## ActionConfig

Represents a config to perform a certain action for a GMail thread/message/attachment.

**`ActionConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**args**|`object`|The arguments for a certain action|No|
|**description**|`string`|The description for the action|No, default: |
|**name**|`string`|The name of the action to be executed|No|
|**scope**|`string`|The handler type to which this action is bound to (defaults to the handler type where the action is defined)|No|

Additional properties are allowed.

### ActionConfig.args

The arguments for a certain action

* **Type**: `object`
* **Required**: No

### ActionConfig.description

The description for the action

* **Type**: `string`
* **Required**: No, default: 

### ActionConfig.name

The name of the action to be executed

* **Type**: `string`
* **Required**: No

### ActionConfig.scope

The handler type to which this action is bound to (defaults to the handler type where the action is defined)

* **Type**: `string`
* **Required**: No
* **Allowed values**:
    * `"attachments"`
    * `"global"`
    * `"messages"`
    * `"threads"`






---------------------------------------
<a name="reference-attachmentconfig"></a>
## AttachmentConfig

Represents a config to handle a certain GMail attachment

**`AttachmentConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**actions**|`ActionConfig` `[]`|The list actions to be executed for their respective handler scopes| &#10003; Yes|
|**description**|`string`|The description of the attachment handler config|No, default: |
|**match**|`AttachmentMatchConfig`|Represents a config to match a certain GMail attachment| &#10003; Yes|
|**name**|`string`|The unique name of the attachment config (will be generated if not set)|No, default: |
|**type**|`string`|The type of handler| &#10003; Yes|

Additional properties are allowed.

### AttachmentConfig.actions

The list actions to be executed for their respective handler scopes

* **Type**: `ActionConfig` `[]`
* **Required**:  &#10003; Yes

### AttachmentConfig.description

The description of the attachment handler config

* **Type**: `string`
* **Required**: No, default: 

### AttachmentConfig.match

Represents a config to match a certain GMail attachment

* **Type**: `AttachmentMatchConfig`
* **Required**:  &#10003; Yes

### AttachmentConfig.name

The unique name of the attachment config (will be generated if not set)

* **Type**: `string`
* **Required**: No, default: 

### AttachmentConfig.type

The type of handler

* **Type**: `string`
* **Required**:  &#10003; Yes






---------------------------------------
<a name="reference-attachmentmatchconfig"></a>
## AttachmentMatchConfig

Represents a config to match a certain GMail attachment

**`AttachmentMatchConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**contentType**|`string`|A RegEx matching the content type of the attachment| &#10003; Yes|
|**includeAttachments**|`boolean`|Should regular attachments be included in attachment processing (default: true)| &#10003; Yes|
|**includeInlineImages**|`boolean`|Should inline images be included in attachment processing (default: true)| &#10003; Yes|
|**largerThan**|`number`|Only include attachments larger than the given size in bytes| &#10003; Yes|
|**name**|`string`|A RegEx matching the name of the attachment| &#10003; Yes|
|**smallerThan**|`number`|Only include attachments smaller than the given size in bytes| &#10003; Yes|

Additional properties are allowed.

### AttachmentMatchConfig.contentType

A RegEx matching the content type of the attachment

* **Type**: `string`
* **Required**:  &#10003; Yes

### AttachmentMatchConfig.includeAttachments

Should regular attachments be included in attachment processing (default: true)

* **Type**: `boolean`
* **Required**:  &#10003; Yes

### AttachmentMatchConfig.includeInlineImages

Should inline images be included in attachment processing (default: true)

* **Type**: `boolean`
* **Required**:  &#10003; Yes

### AttachmentMatchConfig.largerThan

Only include attachments larger than the given size in bytes

* **Type**: `number`
* **Required**:  &#10003; Yes

### AttachmentMatchConfig.name

A RegEx matching the name of the attachment

* **Type**: `string`
* **Required**:  &#10003; Yes

### AttachmentMatchConfig.smallerThan

Only include attachments smaller than the given size in bytes

* **Type**: `number`
* **Required**:  &#10003; Yes




---------------------------------------
<a name="reference-config-(v2)"></a>
## Config (v2)

Represents a configuration for GMail2GDrive

**`Config (v2)` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**description**|`string`|The description of the GMail2GDrive config|No, default: |
|**global**|`GlobalConfig`|The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.| &#10003; Yes|
|**settings**|`SettingsConfig`|Represents a settings config that affect the way GMail2GDrive works.| &#10003; Yes|
|**threadHandler**|`ThreadConfig` `[]`|The list of handler that define the way nested threads, messages or attachments are processed| &#10003; Yes|

Additional properties are allowed.

### Config (v2).description

The description of the GMail2GDrive config

* **Type**: `string`
* **Required**: No, default: 

### Config (v2).global

The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.

* **Type**: `GlobalConfig`
* **Required**:  &#10003; Yes

### Config (v2).settings

Represents a settings config that affect the way GMail2GDrive works.

* **Type**: `SettingsConfig`
* **Required**:  &#10003; Yes

### Config (v2).threadHandler

The list of handler that define the way nested threads, messages or attachments are processed

* **Type**: `ThreadConfig` `[]`
* **Required**:  &#10003; Yes




---------------------------------------
<a name="reference-globalconfig"></a>
## GlobalConfig

The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.

**`GlobalConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**actions**|`ActionConfig` `[]`|The list of global actions that are always executed for their respective handler scopes| &#10003; Yes|
|**match**|`ThreadMatchConfig`|Represents a config to match a certain GMail thread| &#10003; Yes|
|**type**|`string`|The type of handler| &#10003; Yes|

Additional properties are allowed.

### GlobalConfig.actions

The list of global actions that are always executed for their respective handler scopes

* **Type**: `ActionConfig` `[]`
* **Required**:  &#10003; Yes

### GlobalConfig.match

Represents a config to match a certain GMail thread

* **Type**: `ThreadMatchConfig`
* **Required**:  &#10003; Yes

### GlobalConfig.type

The type of handler

* **Type**: `string`
* **Required**:  &#10003; Yes






---------------------------------------
<a name="reference-messageconfig"></a>
## MessageConfig

Represents a config to handle a certain GMail message

**`MessageConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**actions**|`ActionConfig` `[]`|The list actions to be executed for their respective handler scopes| &#10003; Yes|
|**attachmentHandler**|`AttachmentConfig` `[]`|The list of handler that define the way attachments are processed| &#10003; Yes|
|**description**|`string`|The description of the message handler config|No, default: |
|**match**|`MessageMatchConfig`|Represents a config to match a certain GMail message| &#10003; Yes|
|**name**|`string`|The unique name of the message config (will be generated if not set)|No, default: |
|**type**|`string`|The type of handler| &#10003; Yes|

Additional properties are allowed.

### MessageConfig.actions

The list actions to be executed for their respective handler scopes

* **Type**: `ActionConfig` `[]`
* **Required**:  &#10003; Yes

### MessageConfig.attachmentHandler

The list of handler that define the way attachments are processed

* **Type**: `AttachmentConfig` `[]`
* **Required**:  &#10003; Yes

### MessageConfig.description

The description of the message handler config

* **Type**: `string`
* **Required**: No, default: 

### MessageConfig.match

Represents a config to match a certain GMail message

* **Type**: `MessageMatchConfig`
* **Required**:  &#10003; Yes

### MessageConfig.name

The unique name of the message config (will be generated if not set)

* **Type**: `string`
* **Required**: No, default: 

### MessageConfig.type

The type of handler

* **Type**: `string`
* **Required**:  &#10003; Yes




---------------------------------------
<a name="reference-messageflag"></a>
## MessageFlag





---------------------------------------
<a name="reference-messagematchconfig"></a>
## MessageMatchConfig

Represents a config to match a certain GMail message

**`MessageMatchConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**from**|`string`|| &#10003; Yes|
|**is**|`string` `[]`|A list of properties matching messages should have| &#10003; Yes|
|**newerThan**|`string`|A relative date/time according to https://github.com/cmaurer/relative.time.parser#readme or an RFC 3339 date/time format matching messages newer than the given date/time| &#10003; Yes|
|**olderThan**|`string`|An RFC 3339 date/time format matching messages older than the given date/time| &#10003; Yes|
|**subject**|`string`|A RegEx matching the subject of messages| &#10003; Yes|
|**to**|`string`|A RegEx matching the recipient email address of messages| &#10003; Yes|

Additional properties are allowed.

### MessageMatchConfig.from

* **Type**: `string`
* **Required**:  &#10003; Yes

### MessageMatchConfig.is

A list of properties matching messages should have

* **Type**: `string` `[]`
    * Each element in the array must be one of the following values:
        * `read`
        * `starred`
        * `unread`
        * `unstarred`
* **Required**:  &#10003; Yes

### MessageMatchConfig.newerThan

A relative date/time according to https://github.com/cmaurer/relative.time.parser#readme or an RFC 3339 date/time format matching messages newer than the given date/time

* **Type**: `string`
* **Required**:  &#10003; Yes

### MessageMatchConfig.olderThan

An RFC 3339 date/time format matching messages older than the given date/time

* **Type**: `string`
* **Required**:  &#10003; Yes

### MessageMatchConfig.subject

A RegEx matching the subject of messages

* **Type**: `string`
* **Required**:  &#10003; Yes

### MessageMatchConfig.to

A RegEx matching the recipient email address of messages

* **Type**: `string`
* **Required**:  &#10003; Yes




---------------------------------------
<a name="reference-settingsconfig"></a>
## SettingsConfig

Represents a settings config that affect the way GMail2GDrive works.

**`SettingsConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**logSheetFile**|`string`|Path of the spreadsheet log file| &#10003; Yes|
|**logSheetFolderId**|`string`|Folder ID in case of a shared drive| &#10003; Yes|
|**maxBatchSize**|`number`|The maximum batch size of threads to process in a single run to respect Google processing limits| &#10003; Yes|
|**maxRuntime**|`number`|The maximum runtime in seconds for a single run to respect Google processing limits| &#10003; Yes|
|**processedLabel**|`string`|The label to be added to processed GMail threads (only for markProcessedMode="label", deprecated - only for compatibility to v1)| &#10003; Yes|
|**processedMode**|`string`|The mode to mark processed threads/messages.
* `label`: Add the label from `processedLabel` to the thread. This is just for compatibility to v1 and is limited to one message per thread.
* `read`: Mark the message as read. This is the new default since it provides more flexibility esp. when threads contain multiple messages.| &#10003; Yes|
|**sleepTimeAttachments**|`number`|The sleep time in milliseconds between processing each attachment| &#10003; Yes|
|**sleepTimeMessages**|`number`|The sleep time in milliseconds between processing each message| &#10003; Yes|
|**sleepTimeThreads**|`number`|The sleep time in milliseconds between processing each thread| &#10003; Yes|
|**timezone**|`string`|The timezone used for formatting file and folder names| &#10003; Yes|

Additional properties are allowed.

### SettingsConfig.logSheetFile

Path of the spreadsheet log file

* **Type**: `string`
* **Required**:  &#10003; Yes

### SettingsConfig.logSheetFolderId

Folder ID in case of a shared drive

* **Type**: `string`
* **Required**:  &#10003; Yes

### SettingsConfig.maxBatchSize

The maximum batch size of threads to process in a single run to respect Google processing limits

* **Type**: `number`
* **Required**:  &#10003; Yes

### SettingsConfig.maxRuntime

The maximum runtime in seconds for a single run to respect Google processing limits

* **Type**: `number`
* **Required**:  &#10003; Yes

### SettingsConfig.processedLabel

The label to be added to processed GMail threads (only for markProcessedMode="label", deprecated - only for compatibility to v1)

* **Type**: `string`
* **Required**:  &#10003; Yes

### SettingsConfig.processedMode

The mode to mark processed threads/messages.
* `label`: Add the label from `processedLabel` to the thread. This is just for compatibility to v1 and is limited to one message per thread.
* `read`: Mark the message as read. This is the new default since it provides more flexibility esp. when threads contain multiple messages.

* **Type**: `string`
* **Required**:  &#10003; Yes
* **Allowed values**:
    * `"label"`
    * `"read"`

### SettingsConfig.sleepTimeAttachments

The sleep time in milliseconds between processing each attachment

* **Type**: `number`
* **Required**:  &#10003; Yes

### SettingsConfig.sleepTimeMessages

The sleep time in milliseconds between processing each message

* **Type**: `number`
* **Required**:  &#10003; Yes

### SettingsConfig.sleepTimeThreads

The sleep time in milliseconds between processing each thread

* **Type**: `number`
* **Required**:  &#10003; Yes

### SettingsConfig.timezone

The timezone used for formatting file and folder names

* **Type**: `string`
* **Required**:  &#10003; Yes




---------------------------------------
<a name="reference-threadconfig"></a>
## ThreadConfig

Represents a config handle a certain GMail thread

**`ThreadConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**actions**|`ActionConfig` `[]`|The list actions to be executed for their respective handler scopes| &#10003; Yes|
|**description**|`string`|The description of the thread handler config|No, default: |
|**match**|`ThreadMatchConfig`|Represents a config to match a certain GMail thread| &#10003; Yes|
|**messageHandler**|`MessageConfig` `[]`|The list of handler that define the way nested messages or attachments are processed| &#10003; Yes|
|**name**|`string`|The unique name of the thread config (will be generated if not set)|No, default: |
|**type**|`string`|The type of handler| &#10003; Yes|

Additional properties are allowed.

### ThreadConfig.actions

The list actions to be executed for their respective handler scopes

* **Type**: `ActionConfig` `[]`
* **Required**:  &#10003; Yes

### ThreadConfig.description

The description of the thread handler config

* **Type**: `string`
* **Required**: No, default: 

### ThreadConfig.match

Represents a config to match a certain GMail thread

* **Type**: `ThreadMatchConfig`
* **Required**:  &#10003; Yes

### ThreadConfig.messageHandler

The list of handler that define the way nested messages or attachments are processed

* **Type**: `MessageConfig` `[]`
* **Required**:  &#10003; Yes

### ThreadConfig.name

The unique name of the thread config (will be generated if not set)

* **Type**: `string`
* **Required**: No, default: 

### ThreadConfig.type

The type of handler

* **Type**: `string`
* **Required**:  &#10003; Yes






---------------------------------------
<a name="reference-threadmatchconfig"></a>
## ThreadMatchConfig

Represents a config to match a certain GMail thread

**`ThreadMatchConfig` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**maxMessageCount**|`number`|The maximum number of messages a matching thread is allowed to have| &#10003; Yes|
|**minMessageCount**|`number`|The minimum number of messages a matching thread must have| &#10003; Yes|
|**newerThan**|`string`|Only process threads with message newer than (leave empty for no restriction; use d, m and y for day, month and year)| &#10003; Yes|
|**query**|`string`|The GMail search query to find threads to be processed (see http://support.google.com/mail/bin/answer.py?hl=en&answer=7190 for details)| &#10003; Yes|

Additional properties are allowed.

### ThreadMatchConfig.maxMessageCount

The maximum number of messages a matching thread is allowed to have

* **Type**: `number`
* **Required**:  &#10003; Yes

### ThreadMatchConfig.minMessageCount

The minimum number of messages a matching thread must have

* **Type**: `number`
* **Required**:  &#10003; Yes

### ThreadMatchConfig.newerThan

Only process threads with message newer than (leave empty for no restriction; use d, m and y for day, month and year)

* **Type**: `string`
* **Required**:  &#10003; Yes

### ThreadMatchConfig.query

The GMail search query to find threads to be processed (see http://support.google.com/mail/bin/answer.py?hl=en&answer=7190 for details)

* **Type**: `string`
* **Required**:  &#10003; Yes


