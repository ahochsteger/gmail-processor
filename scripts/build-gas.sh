#!/bin/bash

set -euo pipefail

subdir="${1:-lib}"
srcdir="${2:-src/gas/${subdir}}"
outdir="${3:-build/gas/${subdir}}"

rm -rf "${outdir}"
mkdir -p "${outdir}"

npx tsc
npx webpack
cp \
  "${srcdir}"/* \
  "${outdir}/"
