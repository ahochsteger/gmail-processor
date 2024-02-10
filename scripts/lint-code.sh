#!/bin/bash

npx eslint -f scripts/eslint-json-relative.js . \
| gojq -r '
  .[]
  | select(.errorCount>0)
  | . as $f
  | .messages[]
  | (
    $f.filePath + ":" + (.line|tostring) + ":" + (.column|tostring) + " " + .message
  )
'
