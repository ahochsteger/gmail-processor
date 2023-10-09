{
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
  .[]
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
