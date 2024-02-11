def generateDescription: (
  .description + (
    if .deprecated then
      "\n**DEPRECATED**: " + .deprecationInfo
    else "" end
  )
  | gsub("\n";"<br />")
);
