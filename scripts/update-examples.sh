#!/bin/bash

set -euo pipefail

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

function generateFromTemplate() {
  local src_base_dir="${1}"
  local file_filter="${2}"
  local type="${3}"
  local dest_base_dir="${4}"
  local dest_ext="${5}"

  echo -n "Generating files to '${dest_base_dir}': "
  local generated_files=()
  local allExamples=()
  while read -r f; do
    local baseName; baseName="$(basename "${f}" .ts)"
    local filedir; filedir="$(dirname "${f}")"
    local dest_file="${dest_base_dir}/${filedir}/${baseName}.${dest_ext}"

    local infoName; infoName=$(getInfo "${src_base_dir}/${f}" ".name")
    if [ "${infoName}" != "${baseName}" ]; then
      echo -e "\nERROR: The File basename (${baseName}) and info name (${infoName}) do not match in file ${f}!"
      exit 1 
    fi

    local category; category=$(basename ${filedir})
    local infoCategory; infoCategory=$(getInfo "${src_base_dir}/${f}" ".category")
    if [ "${infoCategory}" != "${category}" ]; then
      echo -e "\nERROR: The category directory (${category}) and info category (${infoCategory}) do not match in file ${f}!"
      exit 1 
    fi
    local generate; generate=$(getInfo "${src_base_dir}/${f}" "if (.generate|index(\"${type}\")) then \"true\" else \"false\" end")
    if [[ "${generate}" == "false" ]]; then
      if [[ -f "${dest_file}" ]]; then
        echo -e "\nWARNING: ${dest_file} exists but should not be generated!"
      fi
      continue
    fi
    echo -n "${baseName} "
    local lib_exports_regex; lib_exports_regex=$(getLibExportsAsRegex)
    local template_file_path="${src_base_dir}/_templates/${type}.tmpl"
    local schemaVersion; schemaVersion=$(getInfo "${src_base_dir}/${f}" ".schemaVersion")
    if [[ -f "${src_base_dir}/_templates/${type}-${schemaVersion}.tmpl" ]]; then
      template_file_path="${src_base_dir}/_templates/${type}-${schemaVersion}.tmpl"
    fi
    mkdir -p "${dest_base_dir}/${filedir}"
    {
      export __E2E_TEST_CODE__; __E2E_TEST_CODE__=$(
        skipImports <"${src_base_dir}/${f}" \
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
      export __E2E_TEST_FILE_PATH__="${src_basedir}/${f}"
      export __E2E_TEST_FILE_DIR__="${filedir}"
      export __E2E_TEST_FILE_BASENAME__="${baseName}"
      export __E2E_TEST_INFO__; __E2E_TEST_INFO__=$(getInfo "${src_base_dir}/${f}")
      export __E2E_TEST_TITLE__; __E2E_TEST_TITLE__=$(getInfo "${src_base_dir}/${f}" ".title")
      export __E2E_TEST_CONFIG__; __E2E_TEST_CONFIG__=$(extractJsonConstant "runConfig" <"${src_base_dir}/${f}")
      export __E2E_TEST_MIGRATION_CONFIG__; __E2E_TEST_MIGRATION_CONFIG__=$(extractJsonConstant "migrationConfig" <"${src_base_dir}/${f}")
      export __E2E_TEST_FILE_DIR_UP__; __E2E_TEST_FILE_DIR_UP__=$(echo "${filedir}" | sed -re 's#[^/]+#..#g')
      envsubst <"${template_file_path}"
    } >"${dest_file}"
    generated_files+=("${dest_file}")
    allExamples+=("${baseName}")
  done < <(
    find "${src_base_dir}" -type f -path "${file_filter}" -printf "%P\n" \
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

src_basedir="src/examples"
gas_basedir="src/gas/examples"
docs_basedir="docs/docs/examples"

# Generate example GAS files:
generateFromTemplate "${src_basedir}" "${src_basedir}/**/*.ts" "test-e2e" "${gas_basedir}" "js"

# Generate example test specs:
generateFromTemplate "${src_basedir}" "${src_basedir}/**/*.ts" "test-spec" "${src_basedir}" "spec.ts"

# Generate example docs:
generateFromTemplate "${src_basedir}" "${src_basedir}/**/*.ts" "docs" "${docs_basedir}" "mdx"

# Generate all examples file:
find src/examples -type f -name '*.ts' -printf "%P\n" \
| grep -E '^[a-z]+/[0-9A-Za-z]+\.ts$' \
| sed -re 's/^(([a-z]+)\/([0-9A-Za-z]+))\.ts$/{"path": "\1", "category": "\2", "name": "\3"}/g' \
| gojq -s 'sort_by(.name)' \
| gomplate \
  -c .=stdin: \
  -f "${src_basedir}/_templates/index.ts.gtpl" \
>"${src_basedir}/index.ts"
