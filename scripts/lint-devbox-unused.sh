#!/usr/bin/env bash

# Script to detect potentially unused devbox packages.
# It cross-references binaries in the devbox nix profile with declared packages in devbox.json
# and searches for their usage in the codebase.

set -euo pipefail

DEVBOX_BIN_DIR=".devbox/nix/profile/default/bin"
DEVBOX_JSON="devbox.json"

if [[ ! -d "${DEVBOX_BIN_DIR}" ]]; then
    echo "Error: Devbox bin directory not found at ${DEVBOX_BIN_DIR}."
    echo "Please ensure devbox is initialized and the environment is active."
    exit 1
fi

if [[ ! -f "${DEVBOX_JSON}" ]]; then
    echo "Error: ${DEVBOX_JSON} not found."
    exit 1
fi

echo "Scanning for unused devbox packages..."
echo "--------------------------------------"

# Get declared packages from devbox.json
DECLARED_PACKAGES=$(gojq -r '.packages[]' "${DEVBOX_JSON}" | sed -E 's/@[^@]+$//')

# Create a temporary mapping of package -> binaries
TMP_MAP=$(mktemp)
ls -l "${DEVBOX_BIN_DIR}" | grep "\->" | while read -r line; do
    binary=$(echo "${line}" | awk '{print $(NF-2)}')
    target=$(echo "${line}" | awk '{print $NF}')
    # Extract package name from target path: /nix/store/hash-package-version/bin/binary
    # We want the 'package' part. 
    # Example: /nix/store/9z1v3wyrxp6fpyzw21lcakd5w7aknzyc-nodejs-24.12.0/bin/node
    pkg_full=$(echo "${target}" | cut -d'/' -f4 | sed -E 's/^[a-z0-9]{32}-//')
    # pkg_full is nodejs-24.12.0
    # Strip version
    pkg_name=$(echo "${pkg_full}" | sed -E 's/-[0-9].*$//')
    echo "${pkg_name} ${binary}" >> "${TMP_MAP}"
done

UNUSED_COUNT=0
for pkg in ${DECLARED_PACKAGES}; do
    # Skip nodejs as it's the core runtime
    if [[ "${pkg}" == "nodejs" ]]; then
        continue
    fi

    # Find binaries provided by this package
    binaries=$(grep "^${pkg}" "${TMP_MAP}" | awk '{print $2}' || true)
    
    if [[ -z "${binaries}" ]]; then
        echo "WARN: No binaries found for declared package '${pkg}' (mapping might be incorrect)."
        continue
    fi

    FOUND_USAGE=false
    for bin in ${binaries}; do
        # Search for binary usage (excluding obvious noise)
        # We search in scripts, package.json, and source code.
        if grep -rE "\b${bin}\b" . \
            --exclude-dir={.git,node_modules,build,docs,bak,.devbox} \
            --exclude="devbox.json" \
            --exclude="package-lock.json" \
            --exclude=".knip.jsonc" \
            --exclude="*.md" \
            --exclude="*.lock" \
            >/dev/null 2>&1; then
            FOUND_USAGE=true
            break
        fi
    done

    if [[ "${FOUND_USAGE}" == "false" ]]; then
        echo "POTENTIALLY UNUSED: ${pkg} (Provides: ${binaries//$'\n'/, })"
        UNUSED_COUNT=$((UNUSED_COUNT + 1))
    fi
done

rm "${TMP_MAP}"

echo "--------------------------------------"
if [[ "${UNUSED_COUNT}" -eq 0 ]]; then
    echo "All declared devbox packages seem to be in use."
else
    echo "Found ${UNUSED_COUNT} potentially unused devbox packages."
fi
