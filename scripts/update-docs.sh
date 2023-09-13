#!/bin/bash
# shellcheck disable=SC2016

set -euo pipefail

export LC_ALL=C
export GENERATING_DOCS=true

scriptdir=$(dirname "$0")
outfile="docs/reference-docs.md"
allDataFile="build/typedoc/all.json"
actionDataFile="build/typedoc/actions.json"
enumDataFile="build/typedoc/enums.json"
placeholderDataFile="build/typedoc/placeholder.json"

function extractAllDocs() {
  local jsonfile="${1}"
  npx typedoc \
    --json "${jsonfile}" \
    'src/lib/**/*.ts'
}

function extractAllEnums() {
  gojq -f "${scriptdir}/update-docs-extract-enums.jq"
}

function extractAllActions() {
  local inputFile="${1}"
  local typeMap='{
    "GlobalActions": "global",
    "AttachmentActions": "attachment",
    "MessageActions": "message",
    "ThreadActions": "thread"
  }'

  gojq -r \
    --argjson typeMap "${typeMap}" \
    -f "${scriptdir}/update-docs-extract-actions.jq" \
    <"${inputFile}"
}

function extractAllPlaceholder() {
  npx jest \
    --silent --useStderr --no-coverage \
    --reporters default --watchAll=false \
    --testPathPattern 'docs/update-docs\.spec\.ts' \
    2>/dev/null \
  | gojq .
}

function generateActionDocs() {
  echo "## Actions"
  echo ""
  echo "The following actions can be triggered depending on the valid context which is prefixed in the action name:"
  echo ""
  echo "* \`global\`: Globally available, can be placed anywhere in the configuration."
  echo "* \`thread\`: Run in the context of a thread (includes \`message\` and \`attachment\` context)."
  echo "* \`message\`: Run in the context of a message (includes \`attachment\` context)."
  echo "* \`attachment\`: Run in the context of an attachment."
  echo ""
  echo "| Action Name | Description | Arguments |"
  echo "|-------------|-------------|-----------|"
  gojq -r \
    --slurpfile enumList "${enumDataFile}" \
    -f "${scriptdir}/update-docs-generate-actions.jq" \
    <"${actionDataFile}"
}

function generatePlaceholderDocs {
  echo "## Substitution Placeholder"
  echo ""
  echo "The placeholder in the following table are available for substitution in strings, depending on the scope which are defined as follows:"
  echo ""
  echo "* \`env\`: This scope is valid globally and can also be used for internal purposes before processing starts (e.g. during adapter initialization)."
  echo "* \`proc\`: This scope is valid globally during any processing phase."
  echo "* \`thread\`: This scope is valid during processing a GMail thread and matching messages + attachments."
  echo "* \`message\`: This scope is valid during processing a GMail message and matching attachments."
  echo "* \`attachment\`: This scope is valid during processing a GMail attachment."
  echo ""
  echo "| Key | Type | Scope | Example | Description |"
  echo "|-----|------|-------|---------|-------------|"
  gojq -r \
    -f "${scriptdir}/update-docs-generate-placeholder.jq" \
    <"${placeholderDataFile}"
}

function generateEnumDocs() {
  echo "## Enum Types"
  echo ""
  echo "The following table lists all enum types and their values referenced in the configuration above."
  echo ""
  echo "| Enum Type | Description | Values |"
  echo "|-----------|-------------|--------|"
  gojq -r \
    -f "${scriptdir}/update-docs-generate-enums.jq" \
    <"${enumDataFile}"
}

function generateExampleDocs() {
  echo "## Examples"
}

extractAllDocs "${allDataFile}"
extractAllActions "${allDataFile}" >"${actionDataFile}"
extractAllEnums <"${allDataFile}" >"${enumDataFile}"
extractAllPlaceholder >"${placeholderDataFile}"

{
  echo "# GMail Processor Reference Documentation"
  echo ""
  generateActionDocs
  echo ""
  generateEnumDocs
  echo ""
  generatePlaceholderDocs
} >"${outfile}"
#npx prettier -w "${outfile}"

