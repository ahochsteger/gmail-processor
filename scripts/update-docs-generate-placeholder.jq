[
  .[]
  | [
    "",
    "## `" + .contextType + "` Placeholder",
    "",
    "| Key | Description | Example |",
    "|-----|-------------|---------|",
    (
      .placeholder
    | sort_by(.key)
    | .[]
    | ("placeholder." + .key) as $placeholderAnchor
    | [
      "<a id=\"" + $placeholderAnchor + "\">`" + .key + "`</a>",
      .description,
      "`" + .example + "`"
    ]
    | join(" | ")
    | gsub("\n";"<br>")
    | "| " + . + " |"
    )
  ]
  | join("\n")
]
| join("\n")
