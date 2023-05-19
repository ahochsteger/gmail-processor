#!/bin/bash

set -euo pipefail

function lintConfigs() {
  npx ts-node "$(dirname "${0}")/lint-config.ts" "${@}"
}

lintConfigs v1 src/config-examples/config-v1*.json
lintConfigs v2 src/config-examples/config-v2*.json
