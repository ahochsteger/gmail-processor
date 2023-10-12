#!/bin/bash
# shellcheck disable=SC2016

set -euo pipefail

export LC_ALL=C
export GENERATING_DOCS=true

scriptdir=$(dirname "$0")
docs_outpath="docs/docs/"
refdocs_outpath="${docs_outpath}/reference/"
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
  echo "# Actions"
  echo ""
  echo "## Overview"
  echo ""
  echo "The actions can be only be triggered in valid processing scopes:"
  echo ""
  echo "* [\`global.*\`](#global-actions): Globally available, can be placed anywhere in the configuration."
  echo "* [\`thread.*\`](#thread-actions): Run in the context of a thread (includes \`message\` and \`attachment\` context)."
  echo "* [\`message.*\`](#message-actions): Run in the context of a message (includes \`attachment\` context)."
  echo "* [\`attachment.*\`](#attachment-actions): Run in the context of an attachment."
  gojq -r \
    --slurpfile enumList "${enumDataFile}" \
    -f "${scriptdir}/update-docs-generate-actions.jq" \
    <"${actionDataFile}"
}

function generatePlaceholderDocs {
  echo "# Placeholder"
  echo ""
  echo "The placeholder in the following table are available for substitution in strings, depending on the scope which are defined as follows:"
  echo ""
  gojq -r \
    -f "${scriptdir}/update-docs-generate-placeholder.jq" \
    <"${placeholderDataFile}"
}

function generateEnumDocs() {
  echo "# Enum Types"
  echo ""
  echo "These are the supported enum types and the possible values that can be used in the configuration."
  gojq -r \
    -f "${scriptdir}/update-docs-generate-enums.jq" \
    <"${enumDataFile}"
}

function saveToDocs() {
  local id="${1}"
  local sidebarPos="${2}"
  local destFile="${3}"
  local destDir="${destFile%/*}"
  mkdir -p "${destDir}"
  {
    echo "---"
    echo "id: ${id}"
    echo "sidebar_position: ${sidebarPos}"
    echo "---"
    cat
  } >"${destFile}"

}

# Extract Data
extractAllDocs "${allDataFile}"
extractAllActions "${allDataFile}" >"${actionDataFile}"
extractAllEnums <"${allDataFile}" >"${enumDataFile}"
extractAllPlaceholder >"${placeholderDataFile}"

generateEnumDocs | saveToDocs enum-types 32 "${refdocs_outpath}/enum-types.md"
generateActionDocs | saveToDocs actions 33 "${refdocs_outpath}/actions.md"
generatePlaceholderDocs | saveToDocs placeholder 34 "${refdocs_outpath}/placeholder.md"

# Copy community files:
cat CONTRIBUTING.md | saveToDocs contributing 71 "${docs_outpath}/community/CONTRIBUTING.md"
cat CODE_OF_CONDUCT.md | saveToDocs code-of-conduct 72 "${docs_outpath}/community/CODE_OF_CONDUCT.md"
#cat CHANGELOG.md | saveToDocs changelog 73 "${docs_outpath}/community/CHANGELOG.md"
