[
  .children[]
  | select(.children[]?.name=="info")
  | .name as $path
  | (.name|split("/")) as $pathParts
  | {
    path: $path,
    category: $pathParts[0],
    name: $pathParts[1],
    description: ([
      .children[]
      | select(.name=="info")
      | .comment?.summary[]?.text
    ] | join(""))
  }
]
