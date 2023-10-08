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
      (if (.example|length==0) then "" else "`" + (if (.example|length>32) then (.example[0:32]+"...") else .example end) + "`" end)
    ]
    | join(" | ")
    | gsub("\n";"<br>")
    | "| " + . + " |"
    )
  ]
  | join("\n")
]
| join("\n")
