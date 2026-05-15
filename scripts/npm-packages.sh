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

BEFORE=$(date -d "-$DAYS days" -Iseconds)
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
    
    UPDATE_LEVEL=${NPM_UPDATE_LEVEL:-minor}
    echo "Step 2: Identifying and bumping direct dependencies in package.json (Level: $UPDATE_LEVEL)..."
    
    OUTDATED_JSON=$(npm outdated --json --before "$BEFORE" 2>/dev/null || echo "{}")
    gojq --argjson outdated "$OUTDATED_JSON" --arg level "$UPDATE_LEVEL" '
      def pin(v): v | sub("^[^0-9]*"; "");
      def get_major(v): (pin(v) | split(".") | .[0]) // "0";
      def get_minor(v): (pin(v) | split(".") | .[1]) // "0";
      
      def is_allowed($old_ver; $latest_ver; $level):
        get_major($old_ver) as $old_major |
        get_major($latest_ver) as $latest_major |
        get_minor($old_ver) as $old_minor |
        get_minor($latest_ver) as $latest_minor |
        if $level == "major" then true
        elif $level == "minor" then $old_major == $latest_major
        elif $level == "patch" then ($old_major == $latest_major and $old_minor == $latest_minor)
        else false end;

      def bump_all(deps):
        if deps == null then {logs: [], deps: null} else
          deps | to_entries | reduce .[] as $entry ({logs: [], deps: {}};
            $entry.key as $pkg |
            $entry.value as $old_val |
            pin($old_val) as $old_ver |
            
            if $outdated[$pkg] then
              $outdated[$pkg].latest as $latest_ver |
              if is_allowed($old_ver; $latest_ver; $level) then
                if $old_val != $latest_ver then
                  .logs += [" -> Bumping \($pkg): \($old_val) -> \($latest_ver)"] |
                  .deps += {($pkg): $latest_ver}
                else .deps += {($pkg): $old_val} end
              else
                .logs += [" -> Skipping \($level) update \($pkg): \($old_val) -> \($latest_ver)"] |
                .deps += {($pkg): $old_ver}
              end
            else
              if $old_val != $old_ver then
                .logs += [" -> Pinning \($pkg): \($old_val) -> \($old_ver)"] |
                .deps += {($pkg): $old_ver}
              else .deps += {($pkg): $old_val} end
            end
          )
        end;
      
      bump_all(.dependencies) as $d |
      bump_all(.devDependencies) as $dv |
      {
        package: (.dependencies = $d.deps | .devDependencies = $dv.deps),
        logs: ($d.logs + $dv.logs)
      }
    ' "$PACKAGE_JSON" > result.json
    
    gojq -r '.logs[]' result.json
    gojq '.package' result.json > "$PACKAGE_JSON"
    rm result.json
    
    echo "Step 3: Performing natural update and synchronizing lockfile..."
    if ! npm install "${ARGS[@]}" --quiet --before "$BEFORE" --no-fund --legacy-peer-deps > install.log 2>&1; then
        echo "--------------------------------------------------------------------------------"
        echo "ERROR: npm install failed! The dependency tree is broken without overrides."
        echo "See details below:"
        echo "--------------------------------------------------------------------------------"
        tail -n 15 install.log
        restore_backup
        exit 1
    fi
    
    echo "Step 4: Auditing natural dependency tree..."
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
                OVERRIDES_JSON=$(echo "$OVERRIDES_JSON" | gojq ". + {\"$PKG\": \"$LATEST\"}")
            fi
        done
    
        echo "Step 5: Injecting new overrides and validating..."
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
