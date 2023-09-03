#!/bin/bash

set -euo pipefail
trap "cleanup" 0

CLASP_SRC_BASEDIR="${CLASP_SRC_BASEDIR:-src/gas}"
CLASP_BASEDIR="${CLASP_BASEDIR:-build/gas}"
GCLOUD_PROJECT_ID="${GCLOUD_PROJECT_ID:?}"
CLASP_ACCESS_TOKEN="${CLASP_ACCESS_TOKEN:?}"
CLASP_REFRESH_TOKEN="${CLASP_REFRESH_TOKEN:?}"
CLASP_ID_TOKEN="${CLASP_ID_TOKEN:?}"
CLASP_CLIENT_ID="${CLASP_CLIENT_ID:?}"
CLASP_CLIENT_SECRET="${CLASP_CLIENT_SECRET:?}"
CLASP_DEPLOYMENT_NAME="${CLASP_DEPLOYMENT_NAME:-}"
CLASP_LOG_TIME_SECONDS=600
CLASP_LOG_WAIT_SECONDS=5

REF_TYPE="${REF_TYPE:-${GITHUB_REF_TYPE:-branch}}"
REF_NAME="${REF_NAME:-${GITHUB_REF_NAME:-beta}}"

function buildClaspAuthFile() 
{
  cat "${CLASP_SRC_DIR}/.clasprc.json" | envsubst >"${CLASP_DIR}/.clasprc.json"
  # NOTE: The auth file is automatically cleaned up after script termination using 'trap 0'
}

function buildClaspManifestFile() 
{
  cat "${CLASP_SRC_DIR}/appsscript.json" | envsubst >"${CLASP_DIR}/appsscript.json"
}

function buildClaspProjectFile() {
  cat "${CLASP_SRC_DIR}/.clasp.json" | envsubst >"${CLASP_DIR}/.clasp.json"
}

function runClasp() {
  buildClaspAuthFile
  (
    cd "${CLASP_DIR}"
    npx clasp --auth .clasprc.json --project .clasp.json "${@}"
  )
}

function cleanup() {
  rm -f "${CLASP_DIR}/.clasprc.json"
}

function getLastVersion() {
  runClasp versions \
  | tail -n 1 \
  | awk '{print $1}' \
  >"${CLASP_BASEDIR}/${CLASP_PROFILE}-version.txt"
  echo -n "Last version: "
  cat "${CLASP_BASEDIR}/${CLASP_PROFILE}-version.txt"
}

function buildExamples() {
  rm -rf "${CLASP_DIR}"
  mkdir -p "${CLASP_DIR}"

  cp -pr "${CLASP_SRC_DIR}"/*.{js,json} package.json "${CLASP_DIR}/"
}

function buildLib() {
  rm -rf "${CLASP_DIR}"
  mkdir -p "${CLASP_DIR}"
  cp \
    "${CLASP_SRC_DIR}"/*.json package.json \
    "${CLASP_DIR}/"
  npx tsc
  npx webpack
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
  buildClaspManifestFile
  buildClaspProjectFile
}

CLASP_PROFILE="${1:?Missing profile name!}"
cmd="${2:?}"
shift 2

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

CLASP_DIR="${CLASP_BASEDIR}/${CLASP_PROFILE}"
CLASP_SRC_DIR="${CLASP_SRC_BASEDIR}/${CLASP_PROFILE}"

case "${cmd}" in
  build)
    build
  ;;
  clasp) # Run generic clasp command
    runClasp "${@}"
  ;;
  clean)
    rm -rf "${CLASP_DIR}"
  ;;
  cleanup)
    cleanup
  ;;
  logs)
    functionName="${1:?}"
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
    runClasp run "${functionName}"
  ;;
  run-with-logs)
    functionName="${1:?}"
    logTimeSeconds="${2:-${CLASP_LOG_TIME_SECONDS}}"
    runClasp run "${functionName}"
    sleep "${CLASP_LOG_WAIT_SECONDS}"
    runClasp logs "${functionName}" "${logTimeSeconds}"
  ;;
  push)
    runClasp push --force
    getLastVersion
  ;;
  deploy)
    CLASP_DEPLOYMENT_NAME="${CLASP_DEPLOYMENT_NAME:-$(git describe --tags)}"
    runClasp deploy -i "${CLASP_DEPLOYMENT_ID}" -d "${CLASP_DEPLOYMENT_NAME}"
    getLastVersion
  ;;
  *)
    echo "Unknown command: ${cmd}"
    exit 1
  ;;
esac
