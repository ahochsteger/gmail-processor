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
  echo "## Overview"
  echo ""
  echo "The placeholder in the following table are available for substitution in strings, depending on the scope which are defined as follows:"
  echo ""
  echo "* [\`env.*\`](#scope-env): This scope is valid globally and can also be used for internal purposes before processing starts (e.g. during adapter initialization)."
  echo "* [\`proc.*\`](#scope-proc): This scope is valid globally during any processing phase."
  echo "* [\`thread.*\`](#scope-thread): This scope is valid during processing a GMail thread and matching messages + attachments."
  echo "* [\`message.*\`](#scope-message): This scope is valid during processing a GMail message and matching attachments."
  echo "* [\`attachment.*\`](#scope-attachment): This scope is valid during processing a GMail attachment."
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

function saveWithSidebarPos() {
  local sidebarPos="${1}"
  local destFile="${2}"
  local destDir="${destFile%/*}"
  mkdir -p "${destDir}"
  {
    echo "---"
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

generateEnumDocs | saveWithSidebarPos 32 "${refdocs_outpath}/enum-types.md"
generateActionDocs | saveWithSidebarPos 33 "${refdocs_outpath}/actions.md"
generatePlaceholderDocs | saveWithSidebarPos 34 "${refdocs_outpath}/placeholder.md"

cat CONTRIBUTING.md | saveWithSidebarPos 50 "${docs_outpath}/CONTRIBUTING.md"
cat CODE_OF_CONDUCT.md | saveWithSidebarPos 60 "${docs_outpath}/CODE_OF_CONDUCT.md"
cat CHANGELOG.md | saveWithSidebarPos 70 "${docs_outpath}/CHANGELOG.md"
