include "update-docs-generate-common";

$enumList[0] as $enums
| [
  .[]
  | .prefix as $prefix
  | (($prefix[0]|ascii_upcase)+$prefix[1:]) as $title
  | (
    "",
    "## " + $title + " Actions",
    (
      .actions[]
      | [
        "",
        "### `" + .actionName + "`",
        "",
        generateDescription,
        "",
        ( if (.args and (.args|length>0)) then
            (
            "| Arguments | Type | Description |",
            "|-----------|------|-------------|",
            ([
              .args[]
              | . as $arg
              | [
                "`" + $arg.name + "`",
                "`" + $arg.type.name + "`",
                (.description | gsub("\n";"<br />") | gsub("placeholder";"[placeholder](placeholder.md)")) +
                (
                    if ([$enums[]|select(.name==$arg.type.ref)]|length>0) then
                      (" See [Enum Type `" + $arg.type.ref + "`](enum-types.md#" + ($arg.type.ref|ascii_downcase) + ") for valid values.")
                    else "" end
                )
              ]
              | join(" | ")
              | "| " + . + " |"
            ] | join("\n")))
          else "This action takes no arguments." end
        )
      ]
      | join("\n")
    )
  )
]
| join("\n")
