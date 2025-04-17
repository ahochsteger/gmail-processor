include "update-docs-extract-common";

getKinds as $kinds
| getTypeMap as $typeMap
| getDeclarations as $list

# Iterate over action classes:
| [
  $typeMap
  | to_entries[]
  | .key as $className
  | .value as $prefix
  | $list[]
  | select(.kind==$kinds["Class"] and .variant=="declaration" and .name==$className)
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
      | propertiesFromType($list)
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
