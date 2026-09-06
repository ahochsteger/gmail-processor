#!/usr/bin/env bash
set -e

# Priority: 1. ENV var, 2. renovate.json, 3. Default (7 days)
DAYS=${RELEASE_COOLDOWN_DAYS}
if [[ -z "$DAYS" ]]; then
  ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
  DAYS=$(gojq -r '.minimumReleaseAge | sub(" days";"")' "$ROOT_DIR/renovate.json" 2>/dev/null)
fi
if [[ ! "$DAYS" =~ ^[0-9]+$ ]]; then
  DAYS=7
fi

COMMAND=${1:-outdated}
shift || true

LEVEL="minor"
TARGET="all"
EXTRA_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    minor|patch|latest|greatest)
      LEVEL="$1"
      shift
      ;;
    docs)
      TARGET="docs"
      shift
      ;;
    lib|.)
      TARGET="lib"
      shift
      ;;
    all)
      TARGET="all"
      shift
      ;;
    *)
      EXTRA_ARGS+=("$1")
      shift
      ;;
  esac
done

NCU_TARGET_FLAGS=()
case "$TARGET" in
  docs)
    NCU_TARGET_FLAGS=(--packageFile "docs/package.json")
    ;;
  lib)
    NCU_TARGET_FLAGS=(--packageFile "package.json")
    ;;
  all|*)
    NCU_TARGET_FLAGS=(--workspaces --root)
    ;;
esac

case "$COMMAND" in
  outdated)
    echo "INFO: Checking outdated dependencies (Target: $LEVEL, Scope: $TARGET, Cooldown: ${DAYS}d)..."
    npx npm-check-updates "${NCU_TARGET_FLAGS[@]}" --target "$LEVEL" --cooldown "${DAYS}d" --format group,cooldown "${EXTRA_ARGS[@]}"
    ;;
  update)
    echo "INFO: Updating dependencies (Target: $LEVEL, Scope: $TARGET, Cooldown: ${DAYS}d)..."
    npx npm-check-updates "${NCU_TARGET_FLAGS[@]}" --target "$LEVEL" --cooldown "${DAYS}d" -u "${EXTRA_ARGS[@]}"
    echo "INFO: Synchronizing workspace lockfile..."
    npm install
    ;;
  *)
    echo "Usage: $0 <outdated|update> [minor|latest|patch] [all|docs|lib] [extra-ncu-args...]"
    exit 1
    ;;
esac
