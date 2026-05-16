#!/bin/bash

set -eufo pipefail

npx ts-node scripts/generate-schema.ts
