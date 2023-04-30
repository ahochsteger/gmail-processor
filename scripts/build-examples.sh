#!/bin/bash

set -eufo pipefail

srcdir="${1:-gas/examples}"
outdir="${2:-build/gas/examples}"

rm -rf "${outdir}"
mkdir -p "${outdir}"

while read -r path; do
  bn=$(echo "${path}" \
  | sed -re 's#.*config-(.+)\.json#\1#g')
  outfile="${outdir}/Example-${bn}.js"
  cat \
    <(echo -n "var config = ") \
    "${srcdir}/config-${bn}.json" \
    "${srcdir}/Example-${bn}.js" \
    >>"${outfile}"
done < <(
  find "${srcdir}" -path "${srcdir}/config-*.json" || true
)
cp \
  "${srcdir}/.clasp.json" \
  "${srcdir}/appsscript.json" \
  "${outdir}/"
