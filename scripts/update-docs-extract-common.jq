def extractDescription: (
  {
    description: ([.comment.summary[].text]|join("")),
    deprecated: ([.comment?.blockTags?[]?|select(.tag=="@deprecated")]|length>0),
    deprecationInfo: ([.comment?.blockTags?[]?|select(.tag=="@deprecated")|.content?[]?.text]|join("")),
  }
);
