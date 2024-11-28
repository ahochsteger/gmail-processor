#!/bin/bash

set -euo pipefail
trap "cleanup" 0

export CLASP_SRC_BASEDIR="${CLASP_SRC_BASEDIR:-src/gas}"
export CLASP_BASEDIR="${CLASP_BASEDIR:-build/gas}"
export CLASP_LOG_TIME_SECONDS="${CLASP_LOG_TIME_SECONDS:-600}"
export CLASP_LOG_WAIT_SECONDS="${CLASP_LOG_WAIT_SECONDS:-5}"
export CLASP_RUN_AUTH_FILE="${CLASP_RUN_AUTH_FILE:-.clasprc.json}"
export CLASP_CLIENT_CREDS_FILE="${CLASP_CLIENT_CREDS_FILE:-.client_creds.json}"

function buildClaspAuthFile() 
{
  envsubst <"${CLASP_SRC_DIR}/.clasprc.json" >"${CLASP_DIR}/.clasprc.json"
  # NOTE: The auth file is automatically cleaned up after script termination using 'trap 0'
}

function buildClaspManifestFile() 
{
  envsubst <"${CLASP_SRC_DIR}/appsscript.json" >"${CLASP_DIR}/appsscript.json"
}

function buildClaspProjectFile() {
  envsubst <"${CLASP_SRC_DIR}/.clasp.json" >"${CLASP_DIR}/.clasp.json"
}

function buildClaspFiles() {
  buildClaspManifestFile
  buildClaspProjectFile
}

function runClasp() {
  setupClaspIDs
  buildClaspFiles
  buildClaspAuthFile
  (
    cd "${CLASP_DIR}"
    npx clasp "${@}" --auth .clasprc.json --project .clasp.json
  )
}

function runClaspWithRunAuth() {
  setupClaspIDs
  buildClaspFiles
  (
    cd "${CLASP_DIR}"
    npx clasp "${@}" --auth "${CLASP_RUN_AUTH_FILE}" --project .clasp.json
  )
}

function getReleaseInfo() {
  setupClaspIDs
  local lastGasVersion; lastGasVersion=$(getLastGASVersion)
  echo "Google Apps Script Version: [${lastGasVersion}](https://script.google.com/macros/library/d/${CLASP_SCRIPT_ID}/${lastGasVersion})"
}

function getGithubReleaseNotes() {
  local releaseId="${1:-latest}"
  gh api "/repos/ahochsteger/gmail-processor/releases/${releaseId}" \
  --jq .body
}

function getPatchedReleaseNotes() {
  local releaseId="${1:-latest}"
  local releaseInfo; releaseInfo=$(getReleaseInfo)
  gh api "/repos/ahochsteger/gmail-processor/releases/${releaseId}" \
  --jq .body | sed -re "s|^(##? .*)$|\1\n\n${releaseInfo}|g"
}

function updateGithubRelease() {
  local releaseId="${1:-latest}"
  local releaseNotes; releaseNotes=$(getPatchedReleaseNotes "${releaseId}")
  local releaseId; releaseId=$(gh api /repos/ahochsteger/gmail-processor/releases/latest --jq .id)
  gh api -X PATCH "/repos/ahochsteger/gmail-processor/releases/${releaseId}" \
    -f body="${releaseNotes}" \
    -F draft=false
}

function cleanup() {
  rm -f "${CLASP_DIR}/.clasprc.json"
}

function getLastGASVersion() {
  runClasp versions 2>/dev/null \
  | tail -n 1 \
  | awk '{print $1}' \
  >"${CLASP_BASEDIR}/${CLASP_PROFILE}-version.txt"
  cat "${CLASP_BASEDIR}/${CLASP_PROFILE}-version.txt"
}

function getGithubVersions() {
  gh api /repos/ahochsteger/gmail-processor/releases \
  --jq ".[]|select(.target_commitish==\"main\" and .prerelease==false)|[.tag_name,(.published_at[0:10])]|@tsv"
}

function getGASVersions() {
  runClasp versions 2>/dev/null \
  | sort -ruV \
  | awk '/^[0-9]+/ {print $3"\t"$1}'
}

function getMergedVersions() {
  local gasVersions; gasVersions=$(getGASVersions)
  gh api /repos/ahochsteger/gmail-processor/releases \
  --jq "\"${gasVersions}\" as \$gasVersionsText|(\$gasVersionsText|split(\"\\n\")|[.[]|split(\"\\t\")|{(.[0]):.[1]}]|add) as \$versionMap | .[]|select(.target_commitish==\"main\" and .prerelease==false and \$versionMap[.tag_name])|[.tag_name,\$versionMap[.tag_name],(.published_at[0:10])]|@tsv"
}

function getMergedVersionsAsMarkdown() {
  echo "| Release Version | Apps Script Version | Release Date |"
  echo "|---------|-------------|--------------|"
  getMergedVersions \
  | awk '{print "| "$1" | "$2" | "$3" |"}'
}

function showLastGASVersion() {
  local lastGasVersion; lastGasVersion=$(getLastGASVersion)
  echo "Last GAS version: ${lastGasVersion}"
}

function buildExamples() {
  rm -rf "${CLASP_DIR}"
  mkdir -p "${CLASP_DIR}"
  cp -pr "${CLASP_SRC_DIR}"/* "${CLASP_DIR}/"

  # Create data file
  local currentBranch
  currentBranch=$(git branch --show-current)
  if ! git ls-remote origin "refs/heads/${currentBranch}" | grep -q "refs/heads/${currentBranch}"; then
    currentBranch="main"
  fi
  echo "const E2E_REPO_BRANCH = \"${currentBranch}\"" \
  >"${CLASP_DIR}/_data.js"

  # Format example files:
  npx prettier -w \
    "${CLASP_DIR}"/*.js

  cp -pr package.json "${CLASP_DIR}/"
}

function buildLib() {
  rm -rf "${CLASP_DIR}"
  mkdir -p "${CLASP_DIR}"
  cp \
    "${CLASP_SRC_DIR}"/*.json package.json \
    "${CLASP_DIR}/"
  npx tsc
  npx rollup -c
}

function build() {
  if [[ "${CLASP_PROFILE}" == "examples" ]]; then
    buildExamples
  elif [[ "${CLASP_PROFILE}" == "lib" ]]; then
    buildLib
  else
    echo "ERROR: Unknown clasp profile: ${CLASP_PROFILE}"
    exit 1
  fi
}

function setupClaspIDs() {
  export GCLOUD_PROJECT_ID="${GCLOUD_PROJECT_ID:?}"
  export CLASP_ACCESS_TOKEN="${CLASP_ACCESS_TOKEN:?}"
  export CLASP_REFRESH_TOKEN="${CLASP_REFRESH_TOKEN:?}"
  export CLASP_ID_TOKEN="${CLASP_ID_TOKEN:?}"
  export CLASP_CLIENT_ID="${CLASP_CLIENT_ID:?}"
  export CLASP_CLIENT_SECRET="${CLASP_CLIENT_SECRET:?}"
  export CLASP_DEPLOYMENT_NAME="${CLASP_DEPLOYMENT_NAME:-}"
  case "${CLASP_PROFILE}" in
    examples)
      export CLASP_SCRIPT_ID="${CLASP_EXAMPLES_SCRIPT_ID:?}"
      export CLASP_DEPLOYMENT_ID="${CLASP_EXAMPLES_DEPLOYMENT_ID:?}"
    ;;
    lib)
      export CLASP_SCRIPT_ID="${CLASP_LIB_SCRIPT_ID:?}"
      export CLASP_DEPLOYMENT_ID="${CLASP_LIB_DEPLOYMENT_ID:?}"
    ;;
    *)
      echo "ERROR: Unsupported profile '${CLASP_PROFILE}'!"
      exit 1
    ;;
  esac
}

function checkRunAuthFile() {
  if [[ ! -f "${CLASP_RUN_AUTH_FILE}" ]]; then
    echo "ERROR: Missing credentials file for running functions: ${CLASP_RUN_AUTH_FILE}"
    exit 1
  else
    CLASP_RUN_AUTH_FILE=$(realpath "${CLASP_RUN_AUTH_FILE}")
    export CLASP_RUN_AUTH_FILE
  fi
}

function checkClaspCredsFile() {
  if [[ ! -f "${CLASP_CLIENT_CREDS_FILE}" ]]; then
    echo "ERROR: Missing credentials file for running functions: ${CLASP_CLIENT_CREDS_FILE}"
    exit 1
  else
    CLASP_CLIENT_CREDS_FILE=$(realpath "${CLASP_CLIENT_CREDS_FILE}")
    export CLASP_CLIENT_CREDS_FILE
  fi
}

function checkGuardedAction() {
  local action="${1}"
  local guardedEnv="main"
  # Check if running on a valid environment
  if [[ "${GITHUB_ACTIONS:-}" != "true" ]] && [[ "${DEPLOYMENT_ENV:-}" == "${guardedEnv}" ]]; then
    echo "ATTENTION: You're going to perform the guarded action '${action}' on the environment '${guardedEnv}'!"
    read -r -p "Press CTRL+C to exit or ENTER to continue: "
  else
    echo "NOTE: Allowing guarded action '${action}' on the environment '${guardedEnv}'."
  fi
}

CLASP_PROFILE="${1:?Missing profile name!}"
cmd="${2:?}"
shift 2
export CLASP_DIR="${CLASP_BASEDIR}/${CLASP_PROFILE}"
export CLASP_SRC_DIR="${CLASP_SRC_BASEDIR}/${CLASP_PROFILE}"
mkdir -p "${CLASP_DIR}"

case "${cmd}" in
  build)
    build
  ;;
  clasp) # Run generic clasp command
    checkGuardedAction "${cmd}"
    runClasp "${@}"
  ;;
  clean)
    rm -rf "${CLASP_DIR}"
  ;;
  cleanup)
    cleanup
  ;;
  login)
    checkClaspCredsFile
    runClaspWithRunAuth login --creds ${CLASP_CLIENT_CREDS_FILE} || true # NOTE: Always exists with a false error but it's still creating the file correctly.
    cp -f "${CLASP_DIR}/.clasprc.json" "${CLASP_RUN_AUTH_FILE}"
  ;;
  logs)
    functionName="${1:-}"
    logTimeSeconds="${2:-${CLASP_LOG_TIME_SECONDS}}"
    runClasp logs --json \
    | sed -re 's#^([A-Z]+)\s+([0-9TZ:\.-]+)\s+([^\{]+)\{#\{#g' \
    | gojq -s \
      -f scripts/clasp-logs.jq \
      --arg functionName "${functionName}" \
      --argjson logTimeSeconds "${logTimeSeconds}"
  ;;
  run)
    functionName="${1:?}"
    checkGuardedAction "${cmd}"
    checkRunAuthFile
    runClaspWithRunAuth run "${functionName}"
  ;;
  run-with-logs)
    functionName="${1:?}"
    logTimeSeconds="${2:-${CLASP_LOG_TIME_SECONDS}}"
    checkGuardedAction "${cmd}"
    checkRunAuthFile
    runClaspWithRunAuth run "${functionName}"
    sleep "${CLASP_LOG_WAIT_SECONDS}"
    runClasp logs "${functionName}" "${logTimeSeconds}"
  ;;
  push)
    checkGuardedAction "${cmd}"
    runClasp push --force
    showLastGASVersion
  ;;
  deploy)
    setupClaspIDs
    CLASP_DEPLOYMENT_NAME="${CLASP_DEPLOYMENT_NAME:-$(git describe --tags)}"
    checkGuardedAction "${cmd}"
    runClasp deploy -i "${CLASP_DEPLOYMENT_ID}" -d "${CLASP_DEPLOYMENT_NAME}"
    showLastGASVersion
  ;;
  release-info)
    getReleaseInfo
  ;;
  release-notes)
    getPatchedReleaseNotes
  ;;
  release-notes-github)
    getGithubReleaseNotes "${1:-latest}"
  ;;
  update-github-release)
    checkGuardedAction "${cmd}"
    updateGithubRelease "${1:-latest}"
  ;;
  last-version)
    getLastGASVersion
  ;;
  versions)
    getMergedVersions
  ;;
  versions-gas)
    getGASVersions
  ;;
  versions-github)
    getGithubVersions
  ;;
  versions-markdown)
    getMergedVersionsAsMarkdown
  ;;
  *)
    echo "Unknown command: ${cmd}"
    exit 1
  ;;
esac
