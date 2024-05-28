#!/bin/bash

set -euo pipefail

export EXAMPLE_SRC_BASEDIR="${EXAMPLE_SRC_BASEDIR:-src/examples}"
export TEMPLATES_BASEDIR="${TEMPLATES_BASEDIR:-src/templates}"

# Remove generated files (otherwise typedoc may fail):
npx ts-node scripts/update-examples.ts clean

# Extract example description:
echo "Extracting documentation for examples ..."
npx typedoc \
  --logLevel Error \
  --tsconfig "tsconfig-examples.json" \
  --json "build/typedoc/all-examples.json" \
  --readme none \
  "src/examples/**/*.ts"
gojq -f scripts/update-examples-extract.jq \
  -L scripts \
  <"build/typedoc/all-examples.json" \
  >"build/typedoc/examples.json"
gojq -f scripts/update-docs-extract-enums.jq \
  -L scripts \
  <"build/typedoc/all-examples.json" \
  >"build/typedoc/example-enums.json"

categories=$(
  gojq -r <build/typedoc/example-enums.json \
  '[
    .[]
    | select(.name=="ExampleCategory").values[].value
  ]
  | join("|")'
)

# Generate all examples file:
echo "Generating index with all examples to ${EXAMPLE_SRC_BASEDIR}/index.ts ..."
find src/examples -type f -name '*.ts' -printf "%P\n" \
| grep -E "^(${categories})/[0-9A-Za-z]+\.ts\$" \
| sed -re 's/^(([a-z]+)\/([0-9A-Za-z]+))\.ts$/{"path": "\1", "category": "\2", "name": "\3"}/g' \
| gojq -s \
| gomplate \
  -c .=stdin: \
  -f "${TEMPLATES_BASEDIR}/index.gtpl" \
>"${EXAMPLE_SRC_BASEDIR}/index.ts"

# Generate all example files:
npx ts-node scripts/update-examples.ts generate
npx ts-node scripts/update-examples.ts ls-generated \
| xargs npx prettier -w 
