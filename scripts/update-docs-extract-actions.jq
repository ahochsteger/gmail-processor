include "update-docs-extract-common";

{
    Project: 1, # 0x1
    Module: 2, # 0x2
    Namespace: 4, # 0x4
    Enum: 8, # 0x8
    EnumMember: 16, # 0x10
    Variable: 32, # 0x20
    Function: 64, # 0x40
    Class: 128, # 0x80
    Interface: 256, # 0x100
    Constructor: 512, # 0x200
    Property: 1024, # 0x400
    Method: 2048, # 0x800
    CallSignature: 4096, # 0x1000
    IndexSignature: 8192, # 0x2000
    ConstructorSignature: 16384, # 0x4000
    Parameter: 32768, # 0x8000
    TypeLiteral: 65536, # 0x10000
    TypeParameter: 131072, # 0x20000
    Accessor: 262144, # 0x40000
    GetSignature: 524288, # 0x80000
    SetSignature: 1048576, # 0x100000
    TypeAlias: 2097152, # 0x200000
    Reference: 4194304, # 0x400000
} as $kinds

| {
  GlobalActions: "global",
  MessageActions: "message",
  ThreadActions: "thread",
  AttachmentActions: "attachment"
} as $typeMap

| [
  ..
  | select(type=="object" and .id)
  | del(.symbolIdMap,.sources,.groups)
 ] as $list

# Iterate over action classes:
| [
  $typeMap
  | to_entries[]
  | .key as $className
  | .value as $prefix
  | $list[]
  | select(.kind==$kinds["Class"] and .name==$className)
  | .id as $id

  # Get methods, args, properties, types
  | .children?[]
  | select(.flags.isStatic)
  | .signatures?[]
  | . as $signature
  | .name as $shortActionName
  | ($prefix + "." + .name) as $fullActionName
  | extractDescription * {
    class: $className,
    actionName: $fullActionName,
    shortName: $shortActionName,
    prefix: $prefix,
    args: [
      .parameters[]
      | select(.name=="args")
      | propertiesFromType($list;$kinds)
    ]
    | sort_by(.name)
  }
]
| sort_by(.actionName)
| group_by(.prefix)
| [
  .[]
  | {
    "prefix": .[0].prefix,
    "actions": .
  }
]
