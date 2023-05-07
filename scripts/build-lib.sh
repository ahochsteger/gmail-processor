#!/bin/bash

set -eufo pipefail

srcdir="${1:-gas/lib}"
outdir="${2:-build/gas/lib}"

rm -rf "${outdir}"
mkdir -p "${outdir}"

npx tsc
npx webpack
cp \
  "${srcdir}/appsscript.json" \
  "${outdir}/"
