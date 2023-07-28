[
  .children?[]?.children?[]?
  | select(.kind==8)
  | {
    "name": .name,
    "description": ([.comment.summary[].text]|join("")),
    "values": (
      [
        .children[]
        | {
          "value": .type.value,
          "description": ([.comment.summary[].text]|join(""))
        }
      ]
      | sort_by(.name)
    )
  }
]
| sort_by(.name)
