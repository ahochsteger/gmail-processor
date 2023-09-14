#!/bin/bash

set -euo pipefail

examples_outfile="docs/examples.md"

function generateExampleDocs() {
  local gas_examples_base_dir="src/gas/examples"
  local test_examples_base_dir="src/test/examples"
  local example_files; example_files=$(
    find "${gas_examples_base_dir}" -type f -name '*.js' -printf "%P\n" \
    | grep -E -v '^e2e'
  )
  
  echo "# Examples"
  echo ""
  echo "* [Examples](#examples)"
  # Generate Table of Contents:
  while read -r f; do
    local slug="${f/./}"
    echo "  * [${f}](#${slug,,})"
  done < <(echo "${example_files}")

  # Embed examples:
  while read -r f; do
    echo ""
    echo "## ${f}"
    echo ""
    npx jsdoc -X "src/gas/examples/${f}" \
    | gojq -r ".[0].description // \"*NOTE:* This example misses a description - please add a [JSDoc](https://jsdoc.app/) comment in [${f}](../${test_examples_base_dir}/${f})!\""
    echo ""
    echo "\`\`\`javascript"
    cat "${gas_examples_base_dir}/${f}"
    echo "\`\`\`"
    echo ""
    echo "Source: [Testing version (maintained)](../${test_examples_base_dir}/${f}), [GAS version (generated)](../${gas_examples_base_dir}/${f})"
  done < <(echo "${example_files}")
}

# Generate example files:
rm -f src/gas/examples/*.js
for f in src/test/examples/*.js; do
  sed -z -r 's#(import [^\n]+\n\n?)*##g' \
    <"${f}" \
  | sed -r 's#^export (const|function) #\1 #g' \
    >"src/gas/examples/${f##*/}"
done

# Format example files:
npx prettier -w \
  src/gas/examples/*.js

# Generate example docs:
generateExampleDocs >"${examples_outfile}"
