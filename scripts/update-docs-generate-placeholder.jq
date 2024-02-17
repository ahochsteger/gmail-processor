include "update-docs-generate-common";

.[0] as $placeholderList
| .[1] as $dateExprList

# Generate Placeholder Docs
|{
  "env": {
    "title": "Environment",
    "description": "These placeholder are valid globally and can also be used for internal purposes before processing starts (e.g. during adapter initialization)."
  },
  "proc": {
    "title": "Processing",
    "description": "These placeholder are valid globally during any processing phase."
  },
  "thread": {
    "title": "Thread",
    "description": "These placeholder are valid during processing a GMail thread and matching messages + attachments."
  },
  "message": {
    "title": "Message",
    "description": "These placeholder are valid during processing a GMail message and matching attachments."
  },
  "attachment": {
    "title": "Attachment",
    "description": "These placeholder are valid during processing a GMail attachment."
  }
} as $map
| [
  # Generate Date Expression Docs
  $placeholderList[]
  | [
    "",
    "## " + $map[.contextType].title + " Placeholder",
    "",
    $map[.contextType].description,
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
        generateDescription,
        (if (.example|length==0) then "" else "`" + (if (.example|length>32) then (.example[0:32]+"...") else .example end) + "`" end)
      ]
      | join(" | ")
      | gsub("\n";"<br>")
      | "| " + . + " |"
    )
  ]
  | join("\n")
] + [
  # Generate Date Expression Docs
  $dateExprList
  | sort_by(.key)
  | [
    "",
    "## Date Expressions",
    "",
    "These are the supported date expressions that can be used in `date` substitutions like `${message.date:date:lastDayOfMonth-2d:yyyy-MM-dd HH:mm:ss}`.",
    "",
    "| Expression | Description |",
    "|------------|-------------|",
    (
      .[]
      | ("dateExpr." + .key) as $anchor
      | [
        "<a id=\"" + $anchor + "\">`" + .key + "`</a>",
        .description
      ]
      | join(" | ")
      | gsub("\n";"<br>")
      | "| " + . + " |"
    )
  ]
  | join("\n")
]
| join("\n")
