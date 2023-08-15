#!/bin/bash

set -euo pipefail

subdir="${1:-lib}"
srcdir="${2:-src/gas/${subdir}}"
outdir="${3:-build/gas/${subdir}}"

rm -rf "${outdir}"
mkdir -p "${outdir}"

case "${subdir}" in
  examples)
    cp -pr package.json "${outdir}/"
  ;;
  lib)
    npx tsc
    npx webpack
  ;;
  *)
    echo "ERROR: Unsupported subdir ${subdir}!"
    exit 1
  ;;
esac

cp \
  "${srcdir}"/* \
  "${outdir}/"
