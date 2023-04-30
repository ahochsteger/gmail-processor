#!/bin/bash

set -eufo pipefail

dest_dir="bak/_v1"
files="
  Code.gs
  Config.gs
"

mkdir -p "${dest_dir}"
for f in ${files}; do
  curl -sfL "https://github.com/ahochsteger/gmail2gdrive/raw/master/${f}" \
  >"${dest_dir}/${f}"
done
