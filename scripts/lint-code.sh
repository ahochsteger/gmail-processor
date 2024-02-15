#!/bin/bash

npx eslint -f scripts/eslint-json-relative.js . >build/eslint.json
npx ts-node scripts/lint-code.ts build/eslint.json
