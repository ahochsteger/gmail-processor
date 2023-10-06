#!/bin/bash

set -euo pipefail

src_basedir="src/gas/examples"
dest_basedir="build/gas/examples"
docs_basedir="docs/docs/examples"

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

function generateExampleDocs() {
  local src_dir="${1}"
  local dest_dir="${2}"
  local filename_filter="${3}"

  mkdir -p "${docs_basedir}"
  while read -r f; do
    local exampleName="${f%*.json}"
    {
      echo "import ExampleConfig from \"../../src/components/ExampleConfig.tsx\""
      echo "import config from \"../../../src/gas/examples/${exampleName}.json\""
      echo ""
      echo "# \`${exampleName}\`"
      echo ""
      echo "<ExampleConfig name=\"${exampleName}\" config={config} />"
    } >"${docs_basedir}/${exampleName}.mdx"
    
  done < <(
    find "${src_dir}" -type f -name "*.json" -printf "%P\n" \
    | grep -E "${filename_filter}" \
    || true
  )
  # Format generated file:
  npx prettier -w "${docs_basedir}"/*.mdx
}

# Generate example files:
generateExamplesGas "${src_basedir}" "${dest_basedir}"

# Generate example docs:
generateExampleDocs "${src_basedir}" "${docs_basedir}" "^(example|gettingStarted|migration).*\.json\$"
