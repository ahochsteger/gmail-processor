# Objects

- [`V1Config`](#reference-v1config) (root object)

---

<a name="reference-"></a>

##

---

<a name="reference-v1config"></a>

## V1Config

**`V1Config` Properties**

|                    | Type          | Description                                                                                              | Required                                                      |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **globalFilter**   | `string`      | Global filter                                                                                            | No, default: `"has:attachment -in:trash -in:drafts -in:spam"` |
| **maxRuntime**     | `number`      | Maximum script runtime in seconds (google scripts will be killed after 5 minutes)                        | &#10003; Yes                                                  |
| **newerThan**      | `string`      | Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year) | &#10003; Yes                                                  |
| **processedLabel** | `string`      | Gmail label for processed threads (will be created, if not existing)                                     | &#10003; Yes                                                  |
| **rules**          | `V1Rule` `[]` | Processing rules                                                                                         | &#10003; Yes                                                  |
| **sleepTime**      | `number`      | Sleep time in milliseconds between processed messages                                                    | &#10003; Yes                                                  |
| **timezone**       | `string`      | Timezone for date/time operations                                                                        | &#10003; Yes                                                  |

Additional properties are not allowed.

### V1Config.globalFilter

Global filter

- **Type**: `string`
- **Required**: No, default: `"has:attachment -in:trash -in:drafts -in:spam"`

### V1Config.maxRuntime

Maximum script runtime in seconds (google scripts will be killed after 5 minutes)

- **Type**: `number`
- **Required**: &#10003; Yes

### V1Config.newerThan

Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year)

- **Type**: `string`
- **Required**: &#10003; Yes

### V1Config.processedLabel

Gmail label for processed threads (will be created, if not existing)

- **Type**: `string`
- **Required**: &#10003; Yes

### V1Config.rules

Processing rules

- **Type**: `V1Rule` `[]`
- **Required**: &#10003; Yes

### V1Config.sleepTime

Sleep time in milliseconds between processed messages

- **Type**: `number`
- **Required**: &#10003; Yes

### V1Config.timezone

Timezone for date/time operations

- **Type**: `string`
- **Required**: &#10003; Yes

---

<a name="reference-v1rule"></a>

## V1Rule

**`V1Rule` Properties**

|                        | Type      | Description                                                                     | Required             |
| ---------------------- | --------- | ------------------------------------------------------------------------------- | -------------------- |
| **archive**            | `boolean` | Archive thread after processing                                                 | No, default: `false` |
| **filenameFrom**       | `string`  | Rename matching attachments from the given filename                             | No, default:         |
| **filenameFromRegexp** | `string`  | Rename matching attachments from the given filename regex                       | No, default:         |
| **filenameTo**         | `string`  | Rename matching attachments to the given filename                               | No, default:         |
| **filter**             | `string`  | Search filter for threads                                                       | &#10003; Yes         |
| **folder**             | `string`  | GDrive folder to store attachments to                                           | &#10003; Yes         |
| **newerThan**          | `string`  | Restrict to threads containing messages newer than the given relative date/time | No, default:         |
| **parentFolderId**     | `string`  | Parent folder ID to be used (for shared drives)                                 | No, default:         |
| **ruleLabel**          | `string`  | Add the given label to the processed thread                                     | No, default:         |
| **saveMessagePDF**     | `boolean` | Save the message to PDF                                                         | No, default: `false` |
| **saveThreadPDF**      | `boolean` | Save the thread to PDF                                                          | No, default: `false` |
| **skipPDFHeader**      | `boolean` | Skip header for PDF                                                             | No, default: `false` |

Additional properties are not allowed.

### V1Rule.archive

Archive thread after processing

- **Type**: `boolean`
- **Required**: No, default: `false`

### V1Rule.filenameFrom

Rename matching attachments from the given filename

- **Type**: `string`
- **Required**: No, default:

### V1Rule.filenameFromRegexp

Rename matching attachments from the given filename regex

- **Type**: `string`
- **Required**: No, default:

### V1Rule.filenameTo

Rename matching attachments to the given filename

- **Type**: `string`
- **Required**: No, default:

### V1Rule.filter

Search filter for threads

- **Type**: `string`
- **Required**: &#10003; Yes

### V1Rule.folder

GDrive folder to store attachments to

- **Type**: `string`
- **Required**: &#10003; Yes

### V1Rule.newerThan

Restrict to threads containing messages newer than the given relative date/time

- **Type**: `string`
- **Required**: No, default:

### V1Rule.parentFolderId

Parent folder ID to be used (for shared drives)

- **Type**: `string`
- **Required**: No, default:

### V1Rule.ruleLabel

Add the given label to the processed thread

- **Type**: `string`
- **Required**: No, default:

### V1Rule.saveMessagePDF

Save the message to PDF

- **Type**: `boolean`
- **Required**: No, default: `false`

### V1Rule.saveThreadPDF

Save the thread to PDF

- **Type**: `boolean`
- **Required**: No, default: `false`

### V1Rule.skipPDFHeader

Skip header for PDF

- **Type**: `boolean`
- **Required**: No, default: `false`
