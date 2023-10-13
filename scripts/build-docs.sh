#!/bin/bash
# shellcheck disable=SC2016

set -euo pipefail
changelog_outfile=docs/docs/community/CHANGELOG.md
echo -e "---
id: changelog
sidebar_position: 73
toc_min_heading_level: 1
toc_max_heading_level: 2
---" \
  >"${changelog_outfile}"
sed -re 's/^# \[/## [/g' \
  <CHANGELOG.md \
| sed -re '/^$/N;/^\n$/D' \
  >>"${changelog_outfile}"
cd docs
npm run build
