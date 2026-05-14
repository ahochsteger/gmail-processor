#!/usr/bin/env bash

# Priority: 1. ENV var, 2. renovate.json, 3. Default (7 days)
DAYS=${RELEASE_COOLDOWN_DAYS}
if [[ -z "$DAYS" ]]; then
  # Resolve path to renovate.json from the script directory
  ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
  DAYS=$(gojq -r '.minimumReleaseAge | sub(" days";"")' "$ROOT_DIR/renovate.json" 2>/dev/null)
fi

# Fallback to 7 if empty or not a number
if [[ ! "$DAYS" =~ ^[0-9]+$ ]]; then
  DAYS=7
fi

BEFORE=$(date -d "-$DAYS days" +%Y-%m-%d)
echo "INFO: Using $DAYS days release cool-down (Before: $BEFORE)"

COMMAND=$1
shift

if [[ $# -gt 0 && ! "$1" =~ ^- ]]; then
    TARGET_DIR="$1"
    shift
else
    TARGET_DIR="."
fi

ARGS=("$@")

cd "$TARGET_DIR" || exit 1

if [[ "$COMMAND" == "outdated" ]]; then
    echo "INFO: Running npm outdated in $TARGET_DIR..."
    npm outdated "${ARGS[@]}" --before "$BEFORE"
    exit $?

elif [[ "$COMMAND" == "update" ]]; then
    echo "--------------------------------------------------------------------------------"
    echo "INFO: Running npm update and resolving security overrides in $TARGET_DIR..."
    echo "--------------------------------------------------------------------------------"
    
    PACKAGE_JSON="package.json"
    PACKAGE_LOCK="package-lock.json"
    AUDIT_LEVEL=${NPM_AUDIT_LEVEL:-info}
    
    if [[ ! -f "$PACKAGE_JSON" ]]; then
        echo "Error: $PACKAGE_JSON not found in $TARGET_DIR."
        exit 1
    fi
    
    echo "Step 1: Backing up current state..."
    cp "$PACKAGE_JSON" "${PACKAGE_JSON}.bak"
    if [[ -f "$PACKAGE_LOCK" ]]; then
        cp "$PACKAGE_LOCK" "${PACKAGE_LOCK}.bak"
    fi
    
    # Function to restore backup on failure
    restore_backup() {
        echo "Restoring previous state from backup..."
        mv "${PACKAGE_JSON}.bak" "$PACKAGE_JSON"
        if [[ -f "${PACKAGE_LOCK}.bak" ]]; then
            mv "${PACKAGE_LOCK}.bak" "$PACKAGE_LOCK"
        fi
        npm ci --quiet --no-fund --legacy-peer-deps >/dev/null 2>&1 || npm install --quiet --no-fund --legacy-peer-deps >/dev/null 2>&1
    }
    
    # Strip existing overrides
    gojq 'del(.overrides)' "$PACKAGE_JSON" > temp.json && mv temp.json "$PACKAGE_JSON"
    
    echo "Step 2: Performing natural update in-place..."
    if ! npm update "${ARGS[@]}" --quiet --before "$BEFORE" --no-fund --legacy-peer-deps > install.log 2>&1; then
        echo "--------------------------------------------------------------------------------"
        echo "ERROR: npm update failed! The dependency tree is broken without overrides."
        echo "See details below:"
        echo "--------------------------------------------------------------------------------"
        tail -n 15 install.log
        restore_backup
        exit 1
    fi
    
    echo "Step 3: Auditing natural dependency tree..."
    npm audit --audit-level="$AUDIT_LEVEL" --json > audit.json 2>/dev/null
    
    AUDIT_ERROR=$(gojq -r 'if .error then .error.summary else empty end' audit.json)
    if [[ -n "$AUDIT_ERROR" ]]; then
        echo "ERROR: npm audit failed internally with message: $AUDIT_ERROR"
        restore_backup
        exit 1
    fi
    
    VULN_PKGS=$(gojq -r 'if .vulnerabilities != null then (.vulnerabilities | to_entries[] | select(.value.via[0] | type == "object") | .key) else empty end' audit.json)
    
    if [[ -z "$VULN_PKGS" ]]; then
        echo "Result: No high-level vulnerabilities found. Overrides are not required."
        rm -f "${PACKAGE_JSON}.bak" "${PACKAGE_LOCK}.bak" audit.json install.log
    else
        echo "Result: Vulnerabilities detected. Generating required overrides (respecting cool-down)..."
        
        OVERRIDES_JSON="{}"
        
        for PKG in $VULN_PKGS; do
            LATEST=$(npm view "$PKG" --json 2>/dev/null | gojq -r "(.versions | reverse) as \$v | .time as \$t | \$v | map(select(\$t[.] < \"$BEFORE\")) | .[0]")
            
            if [[ "$LATEST" == "null" || -z "$LATEST" ]]; then
                LATEST=$(npm view "$PKG" version 2>/dev/null)
            fi
            
            if [[ -n "$LATEST" ]]; then
                echo " -> Queuing override: $PKG @ ^$LATEST"
                OVERRIDES_JSON=$(echo "$OVERRIDES_JSON" | gojq ". + {\"$PKG\": \"^$LATEST\"}")
            fi
        done
    
        echo "Step 4: Injecting new overrides and validating..."
        gojq ".overrides = $OVERRIDES_JSON" "$PACKAGE_JSON" > temp.json && mv temp.json "$PACKAGE_JSON"
        
        if ! npm install --quiet --no-fund --legacy-peer-deps > install_validation.log 2>&1; then
            echo "ERROR: The newly generated overrides broke the installation!"
            tail -n 15 install_validation.log
            restore_backup
            exit 1
        fi
        
        if npm audit --audit-level="$AUDIT_LEVEL" > /dev/null 2>&1; then
            echo "--------------------------------------------------------------------------------"
            echo "SUCCESS: Validation passed. The following overrides resolved the audit issues:"
            echo "--------------------------------------------------------------------------------"
            gojq '.overrides' "$PACKAGE_JSON"
            
            rm -f "${PACKAGE_JSON}.bak" "${PACKAGE_LOCK}.bak" audit.json install.log install_validation.log
        else
            echo "--------------------------------------------------------------------------------"
            echo "WARNING: Validation failed. Forcing the latest versions did not resolve all issues."
            echo "Manual inspection required."
            echo "--------------------------------------------------------------------------------"
            restore_backup
            exit 1
        fi
    fi
    
    echo "--------------------------------------------------------------------------------"
    echo "Final npm audit report ($TARGET_DIR):"
    echo "--------------------------------------------------------------------------------"
    npm audit --audit-level="$AUDIT_LEVEL"
    echo "--------------------------------------------------------------------------------"

else
    echo "Unknown command: $COMMAND"
    echo "Usage: $0 <outdated|update> [--prefix <dir>] [args...]"
    exit 1
fi
