[gmail-processor](../README.md) / [Exports](../modules.md) / RunMode

# Enumeration: RunMode

The runtime mode in which processing takes place.

## Table of contents

### Enumeration Members

- [DANGEROUS](RunMode.md#dangerous)
- [DRY\_RUN](RunMode.md#dry_run)
- [SAFE\_MODE](RunMode.md#safe_mode)

## Enumeration Members

### DANGEROUS

• **DANGEROUS** = ``"dangerous"``

This run-mode will execute all configured actions including possibly destructive actions like overwriting files or removing threads or messages.
ATTENTION: Use this only if you know exactly what you're doing and won't complain if something goes wrong!

#### Defined in

[lib/Context.ts:29](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/Context.ts#L29)

___

### DRY\_RUN

• **DRY\_RUN** = ``"dry-run"``

This run-mode skips execution of writing actions. Use this for testing config changes or library upgrades.

#### Defined in

[lib/Context.ts:22](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/Context.ts#L22)

___

### SAFE\_MODE

• **SAFE\_MODE** = ``"safe-mode"``

This run-mode can be used for normal uperation but will skip possibly destructive actions like overwriting files or removing threads or messages.

#### Defined in

[lib/Context.ts:24](https://github.com/ahochsteger/gmail2gdrive/blob/a50f4aa/src/lib/Context.ts#L24)
