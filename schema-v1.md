# Objects
* [`Config (v1)`](#reference-config-(v1)) (root object)


---------------------------------------
<a name="reference-config-(v1)"></a>
## Config (v1)

**`Config (v1)` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**globalFilter**|`string`|Global filter| &#10003; Yes|
|**maxRuntime**|`number`|Maximum script runtime in seconds (google scripts will be killed after 5 minutes)| &#10003; Yes|
|**newerThan**|`string`|Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year)| &#10003; Yes|
|**processedLabel**|`string`|Gmail label for processed threads (will be created, if not existing)| &#10003; Yes|
|**rules**|`V1Rule` `[]`|Processing rules| &#10003; Yes|
|**sleepTime**|`number`|Sleep time in milliseconds between processed messages| &#10003; Yes|
|**timezone**|`string`|Timezone for date/time operations| &#10003; Yes|

Additional properties are allowed.

### Config (v1).globalFilter

Global filter

* **Type**: `string`
* **Required**:  &#10003; Yes

### Config (v1).maxRuntime

Maximum script runtime in seconds (google scripts will be killed after 5 minutes)

* **Type**: `number`
* **Required**:  &#10003; Yes

### Config (v1).newerThan

Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year)

* **Type**: `string`
* **Required**:  &#10003; Yes

### Config (v1).processedLabel

Gmail label for processed threads (will be created, if not existing)

* **Type**: `string`
* **Required**:  &#10003; Yes

### Config (v1).rules

Processing rules

* **Type**: `V1Rule` `[]`
* **Required**:  &#10003; Yes

### Config (v1).sleepTime

Sleep time in milliseconds between processed messages

* **Type**: `number`
* **Required**:  &#10003; Yes

### Config (v1).timezone

Timezone for date/time operations

* **Type**: `string`
* **Required**:  &#10003; Yes






---------------------------------------
<a name="reference-v1rule"></a>
## V1Rule

**`V1Rule` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**archive**|`boolean`|Archive thread after processing| &#10003; Yes|
|**filenameFrom**|`string`|Rename matching attachments from the given filename| &#10003; Yes|
|**filenameFromRegexp**|`string`|Rename matching attachments from the given filename regex| &#10003; Yes|
|**filenameTo**|`string`|Rename matching attachments to the given filename| &#10003; Yes|
|**filter**|`string`|Search filter for threads| &#10003; Yes|
|**folder**|`string`|GDrive folder to store attachments to| &#10003; Yes|
|**newerThan**|`string`|Restrict to threads containing messages newer than the given relative date/time| &#10003; Yes|
|**parentFolderId**|`string`|Parent folder ID to be used (for shared drives)| &#10003; Yes|
|**ruleLabel**|`string`|Add the given label to the processed thread| &#10003; Yes|
|**saveMessagePDF**|`boolean`|Save the message to PDF| &#10003; Yes|
|**saveThreadPDF**|`boolean`|Save the thread to PDF| &#10003; Yes|
|**skipPDFHeader**|`boolean`|Skip header for PDF| &#10003; Yes|

Additional properties are allowed.

### V1Rule.archive

Archive thread after processing

* **Type**: `boolean`
* **Required**:  &#10003; Yes

### V1Rule.filenameFrom

Rename matching attachments from the given filename

* **Type**: `string`
* **Required**:  &#10003; Yes

### V1Rule.filenameFromRegexp

Rename matching attachments from the given filename regex

* **Type**: `string`
* **Required**:  &#10003; Yes

### V1Rule.filenameTo

Rename matching attachments to the given filename

* **Type**: `string`
* **Required**:  &#10003; Yes

### V1Rule.filter

Search filter for threads

* **Type**: `string`
* **Required**:  &#10003; Yes

### V1Rule.folder

GDrive folder to store attachments to

* **Type**: `string`
* **Required**:  &#10003; Yes

### V1Rule.newerThan

Restrict to threads containing messages newer than the given relative date/time

* **Type**: `string`
* **Required**:  &#10003; Yes

### V1Rule.parentFolderId

Parent folder ID to be used (for shared drives)

* **Type**: `string`
* **Required**:  &#10003; Yes

### V1Rule.ruleLabel

Add the given label to the processed thread

* **Type**: `string`
* **Required**:  &#10003; Yes

### V1Rule.saveMessagePDF

Save the message to PDF

* **Type**: `boolean`
* **Required**:  &#10003; Yes

### V1Rule.saveThreadPDF

Save the thread to PDF

* **Type**: `boolean`
* **Required**:  &#10003; Yes

### V1Rule.skipPDFHeader

Skip header for PDF

* **Type**: `boolean`
* **Required**:  &#10003; Yes


