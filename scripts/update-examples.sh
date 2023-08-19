#!/bin/bash
# shellcheck disable=2312

set -euo pipefail

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
/* global GmailProcessor */

const ${cfgMap[cfgName]} = $(cat "${cfgMap[cfgFile]}")

function ${cfgMap[fnName]}ConvertConfig() {
  const config = GmailProcessorLib.convertV1Config(${cfgMap[cfgName]})
  console.log(JSON.stringify(config, null, 2))
}
EOF
  ;;
    2)
  cat <<EOF
/* global GmailProcessor */

const ${cfgMap[cfgName]} = $(cat "${cfgMap[cfgFile]}")

function ${cfgMap[fnName]}Run() {
  GmailProcessorLib.${cfgMap[runFn]}(${cfgMap[cfgName]}, "dry-run")
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
import { convertV1Config } from "../../lib"
import { V1Config } from "../../lib/config/v1/V1Config"
import { PartialDeep } from "type-fest"

const ${cfgMap[cfgName]}: PartialDeep<${cfgMap[cfgType]}> = $(cat "${cfgMap[cfgFile]}")

it("should convert a v1 config example", () => {
  const config = convertV1Config(${cfgMap[cfgName]})
  console.log(JSON.stringify(config, null, 2))
})
EOF
    ;;
    2)
  cat <<EOF
import { PartialDeep } from "type-fest"
import { RunMode } from "../../lib/Context"
import { Config } from "../../lib/config/Config"
import { GmailProcessorLib } from "../mocks/Examples"
import { MockFactory, Mocks } from "../mocks/MockFactory"

const ${cfgMap[cfgName]}: PartialDeep<${cfgMap[cfgType]}> = $(cat "${cfgMap[cfgFile]}")

let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks(${cfgMap[cfgName]}, RunMode.DANGEROUS)
})

it("should process a v${cfgMap[version]} config example", () => {
  const result = GmailProcessorLib.${cfgMap[runFn]}(${cfgMap[cfgName]}, "dry-run", mocks.envContext)
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

function generateExamplesFromConfig() {
  local version="${1}"
  local dirSuffix="${2}"
  shift 2
  local files="${*}"

  for file in ${files}; do
    local filename="${file##*/}"
    local fnName="${filename%.*}"

    buildCfgMap "${version}" "${fnName}" "${file}"

    # Generate GAS example:
    mkdir -p "src/gas/examples${dirSuffix}"
    generateGasExample \
    >"src/gas/examples${dirSuffix}/${fnName}.js"
    
    # Generate test example:
    mkdir -p "src/test/examples${dirSuffix}"
    generateTestExample \
    >"src/test/examples${dirSuffix}/${fnName}.spec.ts"
  done
}

rm -f src/gas/examples*/*.js src/test/examples*/*.spec.ts
generateExamplesFromConfig 1 "-v1" src/config-examples-v1/*.json
generateExamplesFromConfig 2 "" src/config-examples/*.json*

npx prettier -w \
  src/gas/examples* \
  src/test/examples*
