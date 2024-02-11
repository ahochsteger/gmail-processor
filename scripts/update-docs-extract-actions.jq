include "update-docs-extract-common";

def flattenTypes: (
  ..
  | select(.id)
  | walk(if type=="object" and .children then (.|del(.children)) else . end)
);
def resolveArgsType($list): (
    . as $type
    | if $type.type == "reference" then (
      $list[]
      | select(.id==$type.target)
      | .type
      | resolveArgsType($list)
    ) elif $type.type == "intersection" then (
      $type.types[]
      | resolveArgsType($list)
    ) else $type end
);
def propertiesFromType($list;$kinds): (
  .declaration?.children?[]?
  | select(.kind==$kinds["Property"])
  | {
    name,
    type: (.type?.name // .), #(.type | resolveArgsType($list)),
    description: ([.comment?.summary?[]?.text]|join("")),
  }
);
. as $tree
| {
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
| $tree
| [
  ..
  | select(type=="object" and .id)
  #| del(.symbolIdMap,.sources,.groups)
 ] as $list

# Iterate over action classes:
| [
  $typeMap
  | to_entries[]
  | .key as $className
  | .value as $prefix
  | $list[]
  | select($kinds["Class"] and .name==$className)
  | .id as $id

  # Get methods, args + types
  | .children?[]
  | select(.flags.isStatic)
  | .signatures?[]
  | . as $signature
  | extractDescription + {
  #  class: $className,
    actionName: ($prefix + "." + .name),
    shortName: .name,
    prefix: $prefix,
    args: [
      select(.parameters?[]?.name=="args")
      | .parameters?[]?
      | select(.name=="args")
      | .type
      | resolveArgsType($list)
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
