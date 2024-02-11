include "update-docs-generate-common";

.[]
| [
  "",
  # "<a id=\"" + $enumAnchor + "\">`" + .name + "`</a>",
  "## " + .name,
  "",
  generateDescription,
  "",
  "| Value | Description |",
  "|-------|-------------|",
  ([
    .values[]
    | [
      "`" + (.value | tostring) + "`",
      generateDescription
    ] | join(" | ")
    | "| " + . + " |"
  ] | join("\n"))
]
| join("\n")
