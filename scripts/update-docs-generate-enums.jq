.[]
| ("enum." + .name) as $enumAnchor
| [
  "<a id=\"" + $enumAnchor + "\">`" + .name + "`</a>",
  .description,
  "<ul>" + ([
    .values[]
    | ($enumAnchor + "." + .value) as $enumValueAnchor
    | "<li><a id=\"" + $enumValueAnchor + "\">`" + (.value | tostring) + "`</a>: " + .description + "</li>"
  ] | join("")) + "</ul>"
]
| join(" | ")
| gsub("\n";"<br>")
| "| " + . + " |"
