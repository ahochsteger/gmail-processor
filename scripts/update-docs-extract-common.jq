def getTypeMap: (
  {
    GlobalActions: "global",
    MessageActions: "message",
    ThreadActions: "thread",
    AttachmentActions: "attachment"
  }
);

def getKinds: (
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
  }
);

def getDeclarations: (
  [
    ..
    | select(type=="object" and .kind>4 and .variant=="declaration" and .id)
    | del(.symbolIdMap,.sources,.groups)
  ]
  | sort_by(.id)
);

def commentSummaryToDescription: (
  (.comment?.summary // [])
  | map(.text)
  | join("")
);

def extractDescription: (
  {
    description: commentSummaryToDescription,
    deprecated: ([.comment?.blockTags?[]?|select(.tag=="@deprecated")]|length>0),
    deprecationInfo: ([.comment?.blockTags?[]?|select(.tag=="@deprecated")|.content?[]?.text]|join("")),
  }
);

def flattenTypes: (
  ..
  | select(.id)
  | walk(if type=="object" and .children then (.|del(.children)) else . end)
);

def resolveType($declarations): (
  . as $type
  | $declarations
  | [
    .[] | select(.id == $type.target)
  ] | first
);

def resolveTypes($declarations): (
  walk(
    if type=="object" then
      if has("target") and (.target|type)=="number" then
        . * resolveType($declarations)
        | del(.target)
      elif has("type") and (.type=="intersection" or .type=="union") and has("types") then
        .types = [
          .types[]
          | resolveTypes($declarations)
        ]
      else
        map_values(resolveTypes($declarations))
      end
    else 
      .
    end
    | del(.sources?)
  )
);

def typeRefName($declarations): (
  . as $type
  # | if type == "string" then
  #   .
  | if type == "object" then
    if $type.type == "intrinsic"
      or $type.variant == "declaration"
      or $type.kind==getKinds.Enum then
      {name:$type.name}
    elif $type.type == "array" then
      $type.elementType
      | typeRefName($declarations)
      | {
        name: (.name + "[]"),
        ref: .name,
      }
    elif .type == "reference" then
      {
        name: $type.name
      }
      | if $type.typeArguments then
        .ref = .name
        | .name = .name + "<" + ([$type.typeArguments[].name] | join(",")) + ">"
      end
    elif $type.type == "reflection" then
      [
        $type.declaration.children[]
        | .name + ": " + (.type|typeRefName($declarations).name)
      ]
      | join(", ")
      | "{" + . + "}"
      | {name: .}
    elif $type.type == "union" and ($type|has("types")) then
      [
        $type.types[]
        | typeRefName($declarations).name
      ] | join(" | ")
      | {name: .}
    elif $type.type == "intersection" and ($type|has("types")) then
      [
        $type.types[]
        | typeRefName($declarations).name
      ] | join(" & ")
      | {name:.}
    elif ($type.type|type)=="object" and $type.type.name then
      {name:$type.type.name}
    elif .name then
      .
    else
      error("typeRefName: unexpected else object: \(.)")
    end
    | {
      name,
      ref: (.ref // .name),
    }
  else
    # error("typeRefName: unexpected else type: \($type)")
    {name:$type}
  end
);

def extractPropTypes($declarations): (
  resolveTypes($declarations)
  | if .declaration?.children then
    .declaration?.children?[]?
    | select(.kind==getKinds["Property"])
  elif (.type|type)=="object" then
    .type
    | extractPropTypes($declarations)
  elif .type=="intersection" or .type=="union" then
    .types[]
    | extractPropTypes($declarations)
  elif .type=="reference" and .variant=="declaration" and .children then
    .children[]
  else
    error("extractPropTypes: unexpected else object: \(.)")
  end
);

def propertiesFromType($declarations): (
  extractPropTypes($declarations)
  | {
    name,
    type: (.type | typeRefName($declarations)),
    description: commentSummaryToDescription,
  }
);
