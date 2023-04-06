#!/bin/bash

set -eufo pipefail

typeName="${1:?}"
schemaName="${2:?}"
rootTitle="${3:?}"

npx typescript-json-schema tsconfig.json "${typeName}" --required --titles -o "schema-${schemaName}-gen.json"
node_modules/node-jq/bin/jq ". + {\"title\": \"${rootTitle}\"}" <"schema-${schemaName}-gen.json" >"schema-${schemaName}.json"
npx prettier -w "schema-${schemaName}.json"
npx wetzel "schema-${schemaName}.json" >"schema-${schemaName}.md"
rm -f "schema-${schemaName}-gen.json"
