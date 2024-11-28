#!/bin/bash

set -euo pipefail

EXAMPLES_DIR="${EXAMPLES_DIR:-src/examples}"
VALID_EXPRESSION_EXAMPLES="${VALID_EXPRESSION_EXAMPLES:-${EXAMPLES_DIR}/expressions-valid.txt}"
INVALID_EXPRESSION_EXAMPLES="${INVALID_EXPRESSION_EXAMPLES:-${EXAMPLES_DIR}/expressions-invalid.txt}"
PARSER_INDIR="${PARSER_INDIR:-src/lib/expr}"
PARSER_OUTDIR="${PARSER_OUTDIR:-src/lib/expr/generated}"

function generate() {
  local prefix="${1}"

#  antlr4 \
  npx antlr4ng \
    -Dlanguage=TypeScript \
    -o "${PARSER_OUTDIR}" \
    -listener \
    -Xexact-output-dir \
    "${PARSER_INDIR}/${prefix}Lexer.g4" \
    "${PARSER_INDIR}/${prefix}Parser.g4"
}

function testParser() {
  local file="${1}"
  local type="${2}"
  local expr="${3}"
  local expr_error="0"
  local output
  output=$(
    echo -n "${expr}" \
    | antlr4-parse src/lib/expr/ExprParser.g4 src/lib/expr/ExprLexer.g4 template -tokens 2>&1 \
    | grep -E '^line '
  )
  [[ "${?}" == "0" ]] && expr_error="1"
  if [[ "${type}" == "valid" ]] && [[ "${expr_error}" == "1" ]]; then
    echo "ERROR: Parsing expression in file ${file}"
    echo "Expression: ${expr}"
    echo -e "Error details:\n${output}"
    false
  elif [[ "${type}" == "invalid" ]] && [[ "${expr_error}" == "0" ]]; then
    echo "ERROR: Expected parsing error did not occur in file ${file}"
    echo "Expression: ${expr}"
    false
  fi
  true
}

# Test expression parsing
has_errors="0"
echo "Testing parser with valid expressions:"
while read -r f; do
  echo "- ${f}"
  while read -r line; do
    testParser "${f}" "valid" "${line}" || has_errors="1"
  done < <(cat "${f}" | grep -E -v '^#')
done <<<"${VALID_EXPRESSION_EXAMPLES}"

echo "Testing parser with invalid expressions:"
while read -r f; do
  echo "- ${f}"
  while read -r line; do
    testParser "${f}" "invalid" "${line}" || has_errors="1"
  done < <(cat "${f}" | grep -E -v '^#')
done <<<"${INVALID_EXPRESSION_EXAMPLES}"

echo "Testing parser with expressions from examples:"
while read -r f; do
  echo "- ${f}"
  while read -r expr; do
    testParser "${f}" "valid" "${expr}" || has_errors="1"
    [[ "${has_errors}" == "1" ]] && echo "Error while ${f}"
  done < <(gojq -r '..|select(type=="string" and (index("${") or index("{{")))' <"${f}")
done < <(find "${EXAMPLES_DIR}" -type f -name '*.json')

if [[ "${has_errors}" == "1" ]]; then
  echo "There were errors parsing the test expressions!"
  exit 1
fi

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
