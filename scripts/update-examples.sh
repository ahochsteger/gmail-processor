#!/bin/bash

set -euo pipefail

rm -f src/gas/examples/*.js
for f in src/test/examples/*.js; do
  sed -z -r 's#(import [^\n]+\n\n?)*##g' \
    <"${f}" \
  | sed -r 's#^export (const|function) #\1 #g' \
    >"src/gas/examples/${f##*/}"
done

npx prettier -w \
  src/gas/examples/*.js
