#!/bin/bash

set -eufo pipefail

dest_dir="bak/_v1"
files="
  Code.gs
  Config.gs
"

mkdir -p "${dest_dir}"
for f in ${files}; do
  echo "${f}"
  curl -sfL "https://github.com/ahochsteger/gmail-processor/raw/1.x/${f}" \
  >"${dest_dir}/${f}"
done
