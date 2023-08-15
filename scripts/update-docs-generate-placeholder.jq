[
  [.[].placeholder[]]
  | sort_by(.key)
  | .[]
  | ("placeholder." + .key) as $placeholderAnchor
  | [
    "<a id=\"" + $placeholderAnchor + "\">`" + .key + "`</a>",
    "`" + .type + "`",
    "`" + .scope + "`",
    "`" + .example + "`",
    .description
  ]
  | join(" | ")
  | gsub("\n";"<br>")
  | "| " + . + " |"
]
| join("\n")
