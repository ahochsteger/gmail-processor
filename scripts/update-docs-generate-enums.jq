.[]
| [
  "",
  # "<a id=\"" + $enumAnchor + "\">`" + .name + "`</a>",
  "## " + .name,
  "",
  .description,
  "",
  "| Value | Description |",
  "|-------|-------------|",
  ([
    .values[]
    | [
      "`" + (.value | tostring) + "`",
      (.description | gsub("\n";"<br />"))
    ] | join(" | ")
    | "| " + . + " |"
  ] | join("\n"))
]
| join("\n")
