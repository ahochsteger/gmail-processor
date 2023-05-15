#!/bin/bash

set -euo pipefail

function lintConfigs() {
  npx ts-node "$(dirname "${0}")/lint-config.ts" "${@}"
}

lintConfigs v1 src/gas/examples/config-v1*.json
lintConfigs v2 src/gas/examples/config-v2*.json
