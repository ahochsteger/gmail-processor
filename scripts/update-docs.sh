#!/bin/bash

set -euo pipefail

export LC_ALL=C
outfile="docs/reference-docs.md"
allDataFile="build/typedoc/all.json"
actionDataFile="build/typedoc/actions.json"
enumDataFile="build/typedoc/enums.json"

function extractAllDocs() {
  local jsonfile="${1}"
  npx typedoc \
    --json "${jsonfile}" \
    'src/lib/**/*.ts'
}

function extractAllEnums() {
  gojq '[
    .children?[]?.children?[]?
    | select(.kind==8)
    | {
      "enum": .name,
      "description": ([.comment.summary[].text]|join("")),
      "values": (
        [
          .children[]
          | {
            "value": .type.value,
            "description": ([.comment.summary[].text]|join(""))
          }
        ]
        | sort_by(.name)
      )
    }
  ]
  | sort_by(.enum)
  .[]'
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
    <"${inputFile}" '[
      .children?[]?.children?[]?
      | select($typeMap[.name])
      | $typeMap[.name] as $prefix
      | .children?[]?
      | select(.flags.isStatic)
      | .name as $shortName
      | ($prefix+"."+$shortName) as $actionName
      | .signatures[0]
      | {
        "actionName": $actionName,
        "prefix": $prefix,
        "shortName": .name,
        "description": .comment.summary[0].text,
        "args": [
          .typeParameter?[0]?.type?.declaration?.children?[]?
          | {
            name,
            description: ([
              .comment?.summary?[]?.text
            ] | join("")),
            "type": .type?.name
          }
        ]
      }
    ]'
}

function generateActionDocs() {
  echo ""
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
  --slurpfile enums "${enumDataFile}" \
  <"${actionDataFile}" \
  '.[]
  | [
      "`" + .actionName + "`",
      .description,
      ( if .args then
          (
          "<ul>" + (
            .args[]
            | .type as $type
            | [
              "<li>`",
              .name,
              " (",
              .type,
              ")`: ",
              .description,
              (
                if ($enums[]|select(.enum==$type)) then
                  " For valid values see enum docs for type " + .type + "."
                else "" end
              ),
              "</li>"
            ]
            | join("")
          ) + "</ul>")
        else "" end
      )
    ]
    | join(" | ")
    | gsub("\n";"<br>")
    | "| " + . + " |"
  '
}

function generatePlaceholderDocs() {
  echo "## Context Substitution"
  echo ""
  echo "The following context data is available for substitution in strings, depending on the context."
  npx jest --silent --useStderr --no-coverage --reporters default --watchAll=false --testPathPattern 'docs/update-docs\.spec\.ts'
}

function generateEnumDocs() {
  echo "## Enum Types"
  echo ""
  echo "The following table lists all enum types and their values referenced in the configuration above."
  echo ""
  echo "| Enum Type | Description | Values |"
  echo "|-----------|-------------|--------|"
  gojq -r -s <"${enumDataFile}" '
    .[]
    | [
      "`" + .enum + "`",
      .description,
      "<ul>" + ([
        .values[]
        | "<li>`" + (.value | tostring) + "`: " + .description + "</li>"
      ] | join("")) + "</ul>"
    ]
    | join(" | ")
    | gsub("\n";"<br>")
    | "| " + . + " |"
  '
}

function generateExampleDocs() {
  echo "## Examples"
}

extractAllDocs "${allDataFile}"
extractAllActions "${allDataFile}" >"${actionDataFile}"
extractAllEnums <"${allDataFile}" >"${enumDataFile}"

{
  echo "# GMail Processor Reference Documentation"
  generateActionDocs
  generateEnumDocs
  generatePlaceholderDocs
} >"${outfile}"
#npx prettier -w "${outfile}"
