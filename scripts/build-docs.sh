#!/bin/bash
# shellcheck disable=SC2016

set -euo pipefail

cat <(
  echo -e "---\nid: changelog\nsidebar_position: 73\n---"
) CHANGELOG.md >docs/docs/community/CHANGELOG.md
cd docs
npm run build
