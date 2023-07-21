#!/bin/bash
# shellcheck disable=2312

set -eufo pipefail

declare -A cfgMap
export cfgMap

function buildCfgMap() {
  local version="${1}"
  local fnName="${2}"
  local cfgFile="${3}"

  case "${version}" in
    1)
      cfgMap=(
        [cfgType]="V1Config"
        [cfgImport]="import { V1Config } from \"../../lib/config/v1/V1Config\""
        [getCfgFn]="getEffectiveConfigV1"
        [runFn]="runWithV1Config"
      )
    ;;
    2)
      cfgMap=(
        [cfgType]="Config"
        [cfgImport]="import { Config } from \"../../lib/config/Config\""
        [getCfgFn]="getEffectiveConfig"
        [runFn]="run"
      )
    ;;
    *)
      echo "Unknown version: ${version}"
      exit 1
    ;;
  esac
  cfgMap[version]="${version}"
  cfgMap[fnName]="${fnName}"
  cfgMap[cfgFile]="${cfgFile}"
  cfgMap[cfgName]="${fnName}ConfigV${version}"
}

function generateGasExample() {
  case "${cfgMap[version]}" in
    1)
  cat <<EOF
/* global GMail2GDrive */

var ${cfgMap[cfgName]} = $(cat "${cfgMap[cfgFile]}")

function ${cfgMap[fnName]}EffectiveConfig() {
  const effectiveConfig = GMail2GDrive.Lib.${cfgMap[getCfgFn]}(${cfgMap[cfgName]})
  console.log(JSON.stringify(effectiveConfig, null, 2))
}

function ${cfgMap[fnName]}Run() {
  GMail2GDrive.Lib.${cfgMap[runFn]}(${cfgMap[cfgName]}, "dry-run")
}

function ${cfgMap[fnName]}ConvertConfig() {
  const config = GMail2GDrive.Lib.convertV1ConfigToV2Config(${cfgMap[cfgName]})
  console.log(JSON.stringify(config, null, 2))
}
EOF
  ;;
    2)
  cat <<EOF
/* global GMail2GDrive */

var ${cfgMap[cfgName]} = $(cat "${cfgMap[cfgFile]}")

function ${cfgMap[fnName]}EffectiveConfig() {
  const effectiveConfig = GMail2GDrive.Lib.${cfgMap[getCfgFn]}(${cfgMap[cfgName]})
  console.log(JSON.stringify(effectiveConfig, null, 2))
}

function ${cfgMap[fnName]}Run() {
  GMail2GDrive.Lib.${cfgMap[runFn]}(${cfgMap[cfgName]}, "dry-run")
}
EOF
    ;;
    *)
    ;;
  esac
}

function generateTestExample() {
  case "${cfgMap[version]}" in
    1)
  cat <<EOF
import { convertV1ConfigToV2Config } from "../../lib"
import { V1Config } from "../../lib/config/v1/V1Config"
import { PartialDeep } from "type-fest"
import { RunMode } from "../../lib/Context"
import { ProcessingConfig } from "../../lib/config/Config"
import { GMail2GDrive } from "../mocks/Examples"
import { MockFactory, Mocks } from "../mocks/MockFactory"

const ${cfgMap[cfgName]}: PartialDeep<${cfgMap[cfgType]}> = $(cat "${cfgMap[cfgFile]}")

let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks(GMail2GDrive.Lib.${cfgMap[getCfgFn]}(${cfgMap[cfgName]}), RunMode.DANGEROUS)
})

it("should provide the effective config of v${version} example ${cfgMap[fnName]}", () => {
  const effectiveConfig = GMail2GDrive.Lib.${cfgMap[getCfgFn]}(${cfgMap[cfgName]})
    expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v${cfgMap[version]} config example", () => {
  const result = GMail2GDrive.Lib.${cfgMap[runFn]}(${cfgMap[cfgName]}, "dry-run", mocks.envContext)
  expect(result.status).toEqual("ok")
})

it("should convert a v1 config example", () => {
  const config = convertV1ConfigToV2Config(${cfgMap[cfgName]})
  console.log(JSON.stringify(config, null, 2))
})
EOF
    ;;
    2)
  cat <<EOF
import { PartialDeep } from "type-fest"
import { RunMode } from "../../lib/Context"
import { Config, ProcessingConfig } from "../../lib/config/Config"
import { GMail2GDrive } from "../mocks/Examples"
import { MockFactory, Mocks } from "../mocks/MockFactory"

const ${cfgMap[cfgName]}: PartialDeep<${cfgMap[cfgType]}> = $(cat "${cfgMap[cfgFile]}")

let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks(GMail2GDrive.Lib.${cfgMap[getCfgFn]}(${cfgMap[cfgName]}), RunMode.DANGEROUS)
})

it("should provide the effective config of v${version} example ${cfgMap[fnName]}", () => {
  const effectiveConfig = GMail2GDrive.Lib.${cfgMap[getCfgFn]}(${cfgMap[cfgName]})
    expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v${cfgMap[version]} config example", () => {
  const result = GMail2GDrive.Lib.${cfgMap[runFn]}(${cfgMap[cfgName]}, "dry-run", mocks.envContext)
  expect(result.status).toEqual("ok")
})
EOF
    ;;
    *)
      echo "ERROR: Unsupported version: ${cfgMap[version]}"
      exit 1
    ;;
  esac
}

srcdir="${1:-src/config-examples}"
outdir_gas="${2:-src/gas/examples}"
outdir_tests="${3:-src/test/examples}"

rm -f "${outdir_gas}"/v[12]-*.js "${outdir_tests}"/v[12]-*.spec.ts

while read -r version fnName; do
  buildCfgMap "${version}" "${fnName}" "${srcdir}/config-v${version}-${fnName}.json"

  # Generate GAS example:
  mkdir -p "${outdir_gas}"
  generateGasExample \
  >"${outdir_gas}/v${version}-${fnName}.js"
  
  # Generate test example:
  mkdir -p "${outdir_tests}"
  generateTestExample \
  >"${outdir_tests}/v${version}-${fnName}.spec.ts"
done < <(
  find "${srcdir}" -path "${srcdir}/config-v*-*.json" \
  | sed -re 's#.*/config-v([0-9])-([^\.]+)\.json$#\1\t\2#g' \
  || true
)

npx prettier -w \
  "${outdir_gas}" \
  "${outdir_tests}"
