---
id: migrating
sidebar_position: 50
---
# Migrating from Gmail2GDrive

Make sure, you've done the initial [Getting Started](getting-started.md#use-a-library-reference-recommended) steps before migrating the old configuration to the new format.

The [Playground](/playground) provides a convenient way to migrate your old GMail2GDrive configuration to the new format of Gmail Processor by following these steps:

1. Copy the JSON configuration from GMail2GDrive (just the config, not the full code!) to the clipboard.
2. Use the paste action (📋) in the config toolbar to paste the config into the editor.
3. Convert the config using the convert action (🔄) to transform the configuration into the new Gmail Processor format.
4. Copy the full executable code (🚀) and paste it into `Code.gs` of Google Apps Script.

If you want to manually convert your configuration or need to understand how the transformation is done have a look at [V1ToV2Converter.ts](https://github.com/ahochsteger/gmail-processor/blob/main/src/lib/config/v1/V1ToV2Converter.ts) that implements the conversion logic.
