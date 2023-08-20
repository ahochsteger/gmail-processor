#!/bin/bash

set -eufo pipefail

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

declare -A -g CLASP_SCRIPT_ID
declare -A -g CLASP_DEPLOYMENT_ID
# global CLASP_SCRIPT_ID
# global CLASP_DEPLOYMENT_ID

function setupConfig() {
  local CFG_TYPE
  if [[ "${REF_NAME}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then # Regular Release
    CFG_TYPE="MAIN"
    CLASP_DEPLOYMENT_NAME="Release ${REF_NAME}"
  elif [[ "${REF_NAME}" =~ ^[0-9]+\.[0-9]+\.[0-9]+-(alpha|beta|rc)\.[0-9]+$ ]]; then # Pre-Release
    CFG_TYPE="BETA"
    CLASP_DEPLOYMENT_NAME="Pre-Release ${REF_NAME}"
  elif [[ "${REF_NAME}" == "main" ]]; then # Main Branch
    CFG_TYPE="MAIN"
    CLASP_DEPLOYMENT_NAME="Branch ${REF_NAME}"
  else # Other Branch/Tag
    CLASP_DEPLOYMENT_NAME="${REF_TYPE^} ${REF_NAME}"
    CFG_TYPE="BETA"
  fi

  # TODO: Use github enviroments instead: https://github.com/ahochsteger/gmail-processor/settings/environments
  CLASP_SCRIPT_ID[lib]=$(eval "echo \${CLASP_LIB_SCRIPT_ID_${CFG_TYPE}:?}")
  CLASP_SCRIPT_ID[examples]=$(eval "echo \${CLASP_EXAMPLES_SCRIPT_ID_${CFG_TYPE}:?}")
  CLASP_DEPLOYMENT_ID[lib]=$(eval "echo \${CLASP_LIB_DEPLOYMENT_ID_${CFG_TYPE}:?}")
  CLASP_DEPLOYMENT_ID[examples]=$(eval "echo \${CLASP_EXAMPLES_DEPLOYMENT_ID_${CFG_TYPE}:?}")
}

function getClaspAuthFile() 
{
cat <<-END
{
  "token": {
    "access_token": "${CLASP_ACCESS_TOKEN}",
    "refresh_token": "${CLASP_REFRESH_TOKEN}",
    "scope": "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/service.management https://www.googleapis.com/auth/script.deployments https://www.googleapis.com/auth/logging.read https://www.googleapis.com/auth/script.webapp.deploy https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/drive.metadata.readonly",
    "token_type": "Bearer",
    "id_token": "${CLASP_ID_TOKEN}"
  },
  "oauth2ClientSettings": {
    "clientId": "${CLASP_CLIENT_ID}",
    "clientSecret": "${CLASP_CLIENT_SECRET}",
    "redirectUri": "http://localhost"
  },
  "isLocalCreds": false
}
END
}

function getClaspProjectFile() {
cat <<-END
{
  "scriptId": "${CLASP_SCRIPT_ID[${CLASP_PROFILE}]}",
  "projectId": "${GCLOUD_PROJECT_ID}"
}
END
}

function runClasp() {
  getClaspAuthFile >.clasprc.json
  getClaspProjectFile >.clasp.json
  # Insert script ID of the lib:
  sed -ri "s/\\\$\{CLASP_LIB_SCRIPT_ID\}/${CLASP_SCRIPT_ID[lib]}/g" appsscript.json
  npx clasp --auth .clasprc.json --project .clasp.json "${@}"
  rm -f .clasprc.json .clasp.json
}

setupConfig

CLASP_PROFILE="${1:?Missing profile name!}"
cmd="${2:?}"
shift 2

cd "${CLASP_BASEDIR}/${CLASP_PROFILE}"
case "${cmd}" in
  clasp) # Run generic clasp command
    runClasp "${@}"
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
  ;;
  deploy)
    runClasp deploy -i "${CLASP_DEPLOYMENT_ID[${CLASP_PROFILE}]}" -d "${CLASP_DEPLOYMENT_NAME}"
  ;;
  *)
    echo "Unknown command: ${cmd}"
    exit 1
  ;;
esac
