#!/bin/bash

set -euo pipefail

PARSER_INDIR="${PARSER_INDIR:-src/lib/expr}"
PARSER_OUTDIR="${PARSER_OUTDIR:-src/lib/expr/generated}"

function generate() {
  local prefix="${1}"

  npx antlr-ng \
    --lib "${PARSER_INDIR}" \
    -Dlanguage=TypeScript \
    --output-directory "${PARSER_OUTDIR}" \
    --generate-listener \
    --exact-output-dir \
    -- \
    "${PARSER_INDIR}/${prefix}Lexer.g4" \
    "${PARSER_INDIR}/${prefix}Parser.g4"
}

# Generate code:
echo -n "Generating parser code ... "
rm -rf "${PARSER_OUTDIR:?}"
generate Expr
echo "done."

# Bypass TypeScript compiler checks for generated code:
echo "Injecting @ts-nocheck to bypass compiler errors:"
sed -i -e '1s;^;// @ts-nocheck\n;' "${PARSER_OUTDIR}"/*.ts

# Format generated parser:
npx eslint --fix --no-warn-ignored "${PARSER_OUTDIR}"/*.ts
