[
  .children?[]?.children?[]?
  | select($typeMap[.name])
  | $typeMap[.name] as $prefix
  | .children?[]?
  | select(.flags.isStatic)
  | .name as $shortName
  | ($prefix+"."+$shortName) as $actionName
  | .signatures[0]
  | {
    "actionName": $actionName,
    "prefix": $prefix,
    "shortName": .name,
    "description": .comment.summary[0].text,
    "args": [
      .typeParameter?[0]?.type?.declaration?.children?[]?
      | {
        name,
        description: ([
          .comment?.summary?[]?.text
        ] | join("")),
        "type": .type?.name
      }
    ]
  }
]
