#!/bin/bash

set -euo pipefail

# Run eslint with custom reporting:
npx eslint -f scripts/eslint-json-relative.js . >build/eslint.json
npx ts-node scripts/lint-code.ts build/eslint.json

# Run madge to find circular dependencies:
npx madge --circular --extensions ts --exclude \.\./test src/lib || true # --extensions js,jsx,ts,tsx src docs/src
