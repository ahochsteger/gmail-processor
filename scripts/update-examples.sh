#!/bin/bash
# shellcheck disable=2312

set -eufo pipefail

function generateGasExample() {
  local version="${1}"
  local fnName="${2}"
  local configName="${3}"
  local runFn="${4}"
  local getCfgFn="${5}"
  local configJson="${6}"
  cat <<EOF
/* global GMail2GDrive */

var ${configName} = ${configJson}

function ${fnName}EffectiveConfig() {
  const effectiveConfig = GMail2GDrive.Lib.${getCfgFn}(${configName})
  console.log(JSON.stringify(effectiveConfig), null, 2)
}

function ${fnName}Run() {
  GMail2GDrive.Lib.${runFn}(${configName}, "dry-run")
}
EOF
}

function generateTestExample() {
  local version="${1}"
  local fnName="${2}"
  local configName="${3}"
  local runFn="${4}"
  local getCfgFn="${5}"
  local configJson="${6}"
  cat <<EOF
import { ProcessingConfig } from "../../lib/config/Config"
import { GMail2GDrive } from "../mocks/Examples"
import { MockFactory } from "../mocks/MockFactory"

const ${configName} = ${configJson}

it("should provide the effective config of v${version} example ${fnName}", () => {
  const effectiveConfig = GMail2GDrive.Lib.${getCfgFn}(${configName})
    expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v${version} config example", () => {
  const result = GMail2GDrive.Lib.${runFn}(${configName}, "dry-run", MockFactory.newEnvContextMock())
  expect(result.status).toEqual("ok")
})
EOF
}

srcdir="${1:-src/config-examples}"
outdir_gas="${2:-src/gas/examples}"
outdir_tests="${3:-src/test/examples}"

rm -f "${outdir_gas}"/v[12]-*.js "${outdir_tests}"/v[12]-*.spec.ts

while read -r version fnName; do
  case "${version}" in
    1)
      getCfgFn="getEffectiveConfigV1"
      runFn="run"
    ;;
    2)
      getCfgFn="getEffectiveConfig"
      runFn="runWithV1Config"
    ;;
    *)
      echo "ERROR: Wrong config type: ${version}!"
      exit 1
    ;;
  esac
  configName="${fnName}ConfigV${version}"
  
  # Generate GAS example:
  mkdir -p "${outdir_gas}"
  generateGasExample "${version}" "${fnName}" "${configName}" "${runFn}" "${getCfgFn}" "$(cat "${srcdir}/config-v${version}-${fnName}.json")" \
  >"${outdir_gas}/v${version}-${fnName}.js"
  
  # Generate test example:
  mkdir -p "${outdir_tests}"
  generateTestExample "${version}" "${fnName}" "${configName}" "${runFn}" "${getCfgFn}" "$(cat "${srcdir}/config-v${version}-${fnName}.json")" \
  >"${outdir_tests}/v${version}-${fnName}.spec.ts"
done < <(
  find "${srcdir}" -path "${srcdir}/config-v*-*.json" \
  | sed -re 's#.*/config-v([0-9])-([^\.]+)\.json$#\1\t\2#g' \
  || true
)
