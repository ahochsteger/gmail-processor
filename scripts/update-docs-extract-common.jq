def extractDescription: (
  {
    description: ([.comment?.summary?[]?.text]|join("")),
    deprecated: ([.comment?.blockTags?[]?|select(.tag=="@deprecated")]|length>0),
    deprecationInfo: ([.comment?.blockTags?[]?|select(.tag=="@deprecated")|.content?[]?.text]|join("")),
  }
);

def flattenTypes: (
  ..
  | select(.id)
  | walk(if type=="object" and .children then (.|del(.children)) else . end)
);

def resolveType($list): (
  . as $type
  | $list
  | [
    .[] | select(.id == $type.target)
  ] | first
);

def resolveTypes($list): (
  walk(
    if type=="object" then
      if has("target") and (.target|type)=="number" then
        . * resolveType($list)
        | del(.target)
      elif has("type") and .type=="intersection" and has("types") then
        .types = [
          .types[]
          | resolveTypes($list)
        ]
      else
        map_values(resolveTypes($list))
      end
    else 
      .
    end
  )
);

def typeRefName($list;$kinds): (
  . as $type
  # | if type == "string" then
  #   .
  | if type == "object" then
    if $type.type == "intrinsic"
      or $type.variant == "declaration"
      or $type.kind==$kinds.Enum then
      {name:$type.name}
    elif $type.type == "array" then
      $type.elementType
      | typeRefName($list;$kinds)
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
      debug("typeRefName: reflection \(.)")
      [
        $type.declaration.children[]
        | .name + ": " + (.type|typeRefName($list;$kinds).name)
      ]
      | join(", ")
      | "{" + . + "}"
      | {name: .}
    elif $type.type == "union" and ($type|has("types")) then
      [
        $type.types[]
        | typeRefName($list;$kinds).name
      ] | join(" | ")
      | {name: .}
    elif $type.type == "intersection" and ($type|has("types")) then
      [
        $type.types[]
        | typeRefName($list;$kinds).name
      ] | join(" & ")
      | {name:.}
    elif ($type.type|type)=="object" and $type.type.name then
      {name:$type.type.name}
    else
      error("typeRefName: unexpected else object: \(.)")
    end
    | {
      name,
      ref: (.ref // .name),
    }
  else
    error("typeRefName: unexpected else type: \($type)")
  end
);

def extractPropertiesFromType($list;$kinds): (
  if type=="object" then
    if .declaration?.children then
      .declaration?.children?[]?
      | select(.kind==$kinds["Property"])
    elif .type=="intersection" then
      .types[]
      | extractPropertiesFromType($list;$kinds)
    elif (.type|type)=="object" then
      .type
      | extractPropertiesFromType($list;$kinds)
    end
  end
);

def propertiesFromType($list;$kinds): (
  resolveTypes($list)
  | extractPropertiesFromType($list;$kinds)
  | {
    name,
    type: (.type | typeRefName($list;$kinds)),
    description: ([.comment?.summary?[]?.text]|join("")),
  }
);
