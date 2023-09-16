#!/bin/bash

set -euo pipefail

src_basedir="src/gas/examples"
dest_basedir="build/gas/examples"
docs_outfile="docs/examples.md"

function generateExamplesGas() {
  local src_dir="${1}"
  local dest_dir="${2}"
  rm -rf "${dest_dir}"
  mkdir -p "${dest_dir}"
  for f in "${src_dir}"/*.js; do
    sed -z -r 's#(import [^\n]+\n\n?)*##g' \
      <"${f}" \
    | sed -r 's#^export (const|function) #\1 #g' \
      >"${dest_dir}/${f##*/}"
  done

  # Format example files:
  npx prettier -w \
    "${dest_dir}"/*.js
}

function generateExamplesDoc() {
  local src_dir="${1}"
  local dest_dir="${2}"
  local filename_filter="${3}"

  local example_files; example_files=$(
    find "${dest_dir}" -type f -name "*.js" -printf "%P\n" \
    | grep -E "${filename_filter}"
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
    | gojq -r ".[0].description // \"*NOTE:* This example misses a description - please add a [JSDoc](https://jsdoc.app/) comment in [${f}](../${src_dir}/${f})!\""
    echo ""
    echo "\`\`\`javascript"
    cat "${dest_dir}/${f}"
    echo "\`\`\`"
    echo ""
    echo "Source file: [${f}](../${src_dir}/${f})"
  done < <(echo "${example_files}")
}

# Generate example files:
generateExamplesGas "${src_basedir}" "${dest_basedir}"

# Generate example docs:
generateExamplesDoc "${src_basedir}" "${dest_basedir}" "^(example|gettingStarted|migration).*\.js\$" >"${docs_outfile}"
npx prettier -w "${docs_outfile}"
