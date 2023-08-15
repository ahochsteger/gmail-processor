.definitions |= ([
  to_entries[]
  | .key as $typeName
  | .value as $typeDef
  | .value |= 
    if .properties then
      .properties |= ([
        to_entries[]
        | .key as $propName
        | .value |= (
          if $typeDef.required and ($typeDef.required|index($propName)) then
            .title = (.title + " (required)")
          else
            .title = (.title + " (optional)")
          end
          | if .default then
            .description = (.description + (if .description then "\n" else "" end) + "Default value: `" + (.default|tostring) + "`")
          end
        )
      ]
      | from_entries)
    end
  ]
  | from_entries
)
