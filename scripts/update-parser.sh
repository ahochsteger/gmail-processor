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

# Satisfy eslint errors:
echo "Fixing linter issues:"
sed -i -re '
  1s;^;\/\* eslint-disable @typescript-eslint/no-unnecessary-condition \*\/\n\/\* eslint-disable @typescript-eslint/no-unused-vars \*\/\n;
  s#^(type int = number;)$#// @ts-expect-error This is a generated file and cannot be suppressed\n\1#g;
' "${PARSER_OUTDIR}"/*Parser.ts
sed -i -re '
  1s;^;\/\* eslint-disable @typescript-eslint/no-unused-vars \*\/\n;
  s#\(node: #(_node: #g
' "${PARSER_OUTDIR}"/*ParserListener.ts
sed -i -re '
  1s;^;\/\* eslint-disable @typescript-eslint/no-unnecessary-condition \*\/\n;
' "${PARSER_OUTDIR}"/*Lexer.ts

# Format generated parser:
npx prettier \
  -w "${PARSER_OUTDIR}"/*.ts

# Lint generated parser:
npx eslint \
  --fix "${PARSER_OUTDIR}"/*.ts
