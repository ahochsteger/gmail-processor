include "update-docs-extract-common";

[
  .children?[]?.children?[]?
  | select(.kind==8)
  | extractDescription + {
    name: .name,
    values: (
      [
        .children[]
        | extractDescription + {
          key: .name,
          value: .type.value,
        }
      ]
      | sort_by(.name)
    )
  }
]
| sort_by(.name)
