#!/bin/bash

set -euo pipefail

export EXAMPLE_SRC_BASEDIR="${EXAMPLE_SRC_BASEDIR:-src/examples}"
export EXAMPLE_GAS_BASEDIR="${EXAMPLE_GAS_BASEDIR:-src/gas/examples}"
export EXAMPLE_DOCS_BASEDIR="${EXAMPLE_DOCS_BASEDIR:-docs/docs/examples}"

function skipImports() {
  envsubst \
  | awk '
    BEGIN { inImport=0 }
    /^import / { inImport=1 }
    { if (inImport==0) print $0 }
    / from "/ && inImport==1 { inImport=0 }
  '
}

function extractJsonConstant() {
  local varName="${1}"
  envsubst \
  | awk -v varName="${varName}" '
    BEGIN { inVar=0 }
    { if (inVar==1) print $0 }
    /^export const / && $3==varName":" { if (inVar==0) inVar=1; print "{" }
    /^\}/ && inVar==1 { exit 0 }
  '
}

function getLibExports() {
  grep -E '^;\(globalThis as any\)\.' \
  <src/lib/index.ts \
  | sed -re 's/^;\(globalThis as any\)\.([^= ]+)\s*=.*/\1/gm'
}

function getLibExportsAsRegex() {
  getLibExports \
  | paste -sd "|" -
}

function getInfo() {
  local file="${1}"
  local filter="${2:-.}"
  extractJsonConstant "info" <"${file}" \
  | sed -re 's|//|#|g' \
  | gojq -r --yaml-input "${filter}"
}

function validateExample() {
  local file="${1}"

  # Check example name:
  local infoName; infoName=$(getInfo "${file}" ".name")
  if [[ "${infoName}" != "${baseName}" ]]; then
    echo -e "\nERROR: The example file '${file}' does not match with the info name '${infoName}'!"
    exit 1 
  fi
  # Check for existing example export:
  if ! grep -E -q "export const ${infoName}Example: Example" <"${file}"; then
    echo -e "\nERROR: The example file '${file}' does not export an example named '${infoName}Example'!"
    exit 1 
  fi
  # Check example category:
  local category; category=$(basename ${filedir})
  local infoCategory; infoCategory=$(getInfo "${EXAMPLE_SRC_BASEDIR}/${f}" ".category")
  if [[ "${infoCategory}" != "${category}" ]]; then
    echo -e "\nERROR: The path of the example file '${file}' does not match with the info category '${infoCategory}'!"
    exit 1 
  fi
  local categoryIndexFile="${EXAMPLE_DOCS_BASEDIR}/${category}/index.mdx"
  if [[ ! -f "${categoryIndexFile}" ]]; then
    echo -e "\nERROR: The category of the example file '${file}' misses an index file at '${categoryIndexFile}'!"
    exit 1 
  fi
  # Scan for full lib import (causes problems with Docusaurus site):
  if grep -E -q "from \"../../lib\"" <"${file}"; then
    echo -e "\nERROR: The example file '${file}' imports the full lib which causes problems with Docusaurus!"
    exit 1 
  fi
}

function generateFromTemplate() {
  local file_filter="${1}"
  local type="${2}"
  local dest_base_dir="${3}"
  local dest_ext="${4}"

  echo -n "Generating files to '${dest_base_dir}': "
  local generated_files=()
  local allExamples=()
  while read -r f; do
    local baseName; baseName="$(basename "${f}" .ts)"
    local filedir; filedir="$(dirname "${f}")"
    local dest_file="${dest_base_dir}/${filedir}/${baseName}.${dest_ext}"

    validateExample "${EXAMPLE_SRC_BASEDIR}/${f}"

    local generate; generate=$(getInfo "${EXAMPLE_SRC_BASEDIR}/${f}" "if (.generate|index(\"${type}\")) then \"true\" else \"false\" end")
    if [[ "${generate}" == "false" ]]; then
      if [[ -f "${dest_file}" ]]; then
        echo -e "\nWARNING: Removing ${dest_file} since it should not be generated!"
        rm -f "${dest_file}"
      fi
      continue
    fi
    echo -n "${baseName} "
    local lib_exports_regex; lib_exports_regex=$(getLibExportsAsRegex)
    local template_file_path="${EXAMPLE_SRC_BASEDIR}/_templates/${type}.tmpl"
    local schemaVersion; schemaVersion=$(getInfo "${EXAMPLE_SRC_BASEDIR}/${f}" ".schemaVersion")
    if [[ -f "${EXAMPLE_SRC_BASEDIR}/_templates/${type}-${schemaVersion}.tmpl" ]]; then
      template_file_path="${EXAMPLE_SRC_BASEDIR}/_templates/${type}-${schemaVersion}.tmpl"
    fi
    mkdir -p "${dest_base_dir}/${filedir}"
    {
      export __E2E_TEST_CODE__; __E2E_TEST_CODE__=$(
        skipImports <"${EXAMPLE_SRC_BASEDIR}/${f}" \
        | sed -re "
          s/^export const ([^:]+):.*=/const \\1 =/g;
          s/^/  /g;
          s/\\b(${lib_exports_regex})\\./GmailProcessorLib.\\1./g;
        "
      )
      # TODOs:
      # * Adjust naming: E2E_TEST -> EXAMPLE
      # * Merge MIGRATION_CONFIG + CONFIG and split by schema version
      # * Check if FILE_DIR_UP can be eliminated using @src imports
      export __E2E_TEMPLATE_FILE_PATH__; __E2E_TEMPLATE_FILE_PATH__="${template_file_path}"
      export __E2E_TEST_FILE_PATH__="${EXAMPLE_SRC_BASEDIR}/${f}"
      export __E2E_TEST_FILE_DIR__="${filedir}"
      export __E2E_TEST_FILE_BASENAME__="${baseName}"
      export __E2E_TEST_INFO__; __E2E_TEST_INFO__=$(getInfo "${EXAMPLE_SRC_BASEDIR}/${f}")
      export __E2E_TEST_TITLE__; __E2E_TEST_TITLE__=$(getInfo "${EXAMPLE_SRC_BASEDIR}/${f}" ".title")
      export __E2E_TEST_CONFIG__; __E2E_TEST_CONFIG__=$(extractJsonConstant "runConfig" <"${EXAMPLE_SRC_BASEDIR}/${f}")
      export __E2E_TEST_MIGRATION_CONFIG__; __E2E_TEST_MIGRATION_CONFIG__=$(extractJsonConstant "migrationConfig" <"${EXAMPLE_SRC_BASEDIR}/${f}")
      export __E2E_TEST_FILE_DIR_UP__; __E2E_TEST_FILE_DIR_UP__=$(echo "${filedir}" | sed -re 's#[^/]+#..#g')
      envsubst <"${template_file_path}"
    } >"${dest_file}"
    generated_files+=("${dest_file}")
    allExamples+=("${baseName}")
  done < <(
    find "${EXAMPLE_SRC_BASEDIR}" -type f -path "${file_filter}" -printf "%P\n" \
    | grep -v '\.spec.ts$' \
    || true
  )
  echo "."
  if [ "${generated_files[*]}" ]; then
    echo "All examples: ${allExamples[*]}"
    # Format generated file:
    echo "Formatting generated files ..."
    npx prettier -w "${generated_files[@]}"
  fi
}

# Generate example GAS files:
generateFromTemplate "${EXAMPLE_SRC_BASEDIR}/**/*.ts" "test-e2e" "${EXAMPLE_GAS_BASEDIR}" "js"

# Generate example test specs:
generateFromTemplate "${EXAMPLE_SRC_BASEDIR}/**/*.ts" "test-spec" "${EXAMPLE_SRC_BASEDIR}" "spec.ts"

# Generate example docs:
generateFromTemplate "${EXAMPLE_SRC_BASEDIR}/**/*.ts" "docs" "${EXAMPLE_DOCS_BASEDIR}" "mdx"

# Generate all examples file:
find src/examples -type f -name '*.ts' -printf "%P\n" \
| grep -E '^[a-z]+/[0-9A-Za-z]+\.ts$' \
| sed -re 's/^(([a-z]+)\/([0-9A-Za-z]+))\.ts$/{"path": "\1", "category": "\2", "name": "\3"}/g' \
| gojq -s \
| gomplate \
  -c .=stdin: \
  -f "${EXAMPLE_SRC_BASEDIR}/_templates/index.ts.gtpl" \
>"${EXAMPLE_SRC_BASEDIR}/index.ts"
