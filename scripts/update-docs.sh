#!/bin/bash

set -euo pipefail

outfile="docs/meta-infos.md"

function updateDocs() {
  # npx jest --verbose --testPathPattern "$(dirname "${0}")/update-docs.spec.ts" "${@}"
  # npx jest --reporters='default' --silent --testLocationInResults --useStderr --testNamePattern '.*' --no-coverage --watchAll=false --testPathPattern "$(dirname "${0}")/update-docs.spec.ts"
  npx jest --silent --useStderr --no-coverage --reporters default --watchAll=false --testPathPattern 'docs/update-docs\.spec\.ts'
}

LC_ALL=C updateDocs >"${outfile}"
prettier -w "${outfile}"
