#!/bin/bash

set -eufo pipefail

function genSchema() {
  local typeName="${1:?}"
  local schemaName="${2:?}"
  local rootTitle="${3:?}"

  case "${schemaName}" in
    v1)
      schemaPath="src/config/v1"
    ;;
    v2)
      schemaPath="src/config"
    ;;
    *)
    ;;
  esac

  npx typescript-json-schema tsconfig.json \
    "${typeName}" \
    --noExtraProps \
    --required \
    --titles \
    --topRef \
    --validationKeywords \
  >"${schemaPath}/config-schema-${schemaName}.json"
  npx wetzel -w \
    "${schemaPath}/config-schema-${schemaName}.json" \
    >"docs/config-schema-${schemaName}.md"
  npx prettier -w \
    "${schemaPath}/config-schema-${schemaName}.json" \
    "docs/config-schema-${schemaName}.md"
}

genSchema V1Config v1 "Config (v1)"
genSchema Config v2 "Config (v2)"
