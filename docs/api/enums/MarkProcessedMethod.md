[gmail-processor](../README.md) / [Exports](../modules.md) / MarkProcessedMethod

# Enumeration: MarkProcessedMethod

The method to mark processed threads/messages.

## Table of contents

### Enumeration Members

- [ADD\_THREAD\_LABEL](MarkProcessedMethod.md#add_thread_label)
- [MARK\_MESSAGE\_READ](MarkProcessedMethod.md#mark_message_read)

## Enumeration Members

### ADD\_THREAD\_LABEL

• **ADD\_THREAD\_LABEL** = ``"add-label"``

(deprecated): Adds the label set using `markProcessedLabel` to the thread.
ATTENTION: This method is just for compatibility with v1 configs and does not support multiple messages per thread!

#### Defined in

[lib/config/SettingsConfig.ts:22](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/SettingsConfig.ts#L22)

___

### MARK\_MESSAGE\_READ

• **MARK\_MESSAGE\_READ** = ``"mark-read"``

Mark the message as read.
This is the new default since it provides more flexibility esp. when threads contain multiple messages.

#### Defined in

[lib/config/SettingsConfig.ts:27](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/config/SettingsConfig.ts#L27)
