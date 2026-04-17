#!/bin/bash

set -eufo pipefail

function genSchema() {
  local typeName="${1:?}"
  local schemaName="${2:?}"

  case "${schemaName}" in
    v1)
      schemaPath="src/lib/config/v1"
    ;;
    v2)
      schemaPath="src/lib/config"
    ;;
    *)
    ;;
  esac

  npx typescript-json-schema tsconfig.schema.json \
    "${typeName}" \
    --ignoreErrors \
    --noExtraProps \
    --required \
    --titles \
    --validationKeywords \
    2> >(grep -vE "initializer is expression|unknown initializer" >&2) \
  >"${schemaPath}/config-schema-${schemaName}.json"
}

genSchema V1Config v1 "GMail2GDrive Config (v1)"
genSchema Config v2 "Gmail Processor Config (v2)"
