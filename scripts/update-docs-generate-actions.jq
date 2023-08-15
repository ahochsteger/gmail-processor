$enumList[0] as $enums
| .[]
| ("action." + .actionName) as $actionAnchor
| [
  "<a id=\"" + $actionAnchor + "\">`" + .actionName + "`</a>",
  .description,
  ( if .args then
      (
      "<ul>" + ([
        .args[]
        | ($actionAnchor + "." + .name) as $actionArgAnchor
        | .type as $type
        | [
          "<li><a id=\"" + $actionArgAnchor + "\">`",
          .name,
          "`</a> (`",
          .type,
          "`): ",
          .description,
          (
            if ($enums[]|select(.name==$type)) then
              " For valid values see enum docs for type " + .type + "."
            else "" end
          ),
          "</li>"
        ]
        | join("")
      ] | join("")) + "</ul>")
    else "" end
  )
]
| join(" | ")
| gsub("\n";"<br>")
| "| " + . + " |"
