#!/bin/bash

set -euo pipefail

# Run eslint with custom reporting:
npx eslint -f scripts/eslint-json-relative.js . >build/eslint.json
npx ts-node scripts/lint-code.ts build/eslint.json

# Run madge to find circular dependencies:
echo "Checking for circular dependencies..."
if ! npx madge --circular --extensions ts src; then
  echo "❌ ERROR: Circular dependencies detected in the workspace! These must be resolved before proceeding."
  exit 1
fi
