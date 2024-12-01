include "update-docs-generate-common";

.[]
| [
  "",
  # "<a id=\"" + $enumAnchor + "\">`" + .name + "`</a>",
  "## " + .name,
  "",
  generateDescription,
  "",
  "| Key | Value | Description |",
  "|-----|-------|-------------|",
  ([
    .values[]
    | [
      "`" + (.key | tostring) + "`",
      "`" + (.value | tostring) + "`",
      (
        generateDescription
        | gsub("\\|";"\\|")
      )
    ]
    | join(" | ")
    | "| " + . + " |"
  ] | join("\n"))
]
| join("\n")
