#!/bin/bash

set -euo pipefail

function log() {
  echo -e "${1}" >&2
}

function deleteSecret() {
  local env="${1}"
  local secret="${2}"
  log "\nDeleting secret${env:+ for env ${env}} ${secret} ..."
  gh secret delete ${env:+-e ${env}} "${secret}"
}

function getSecrets() {
  local env="${1}"
  log "\nListing ${env:-global} secrets ..."
  gh secret list ${env:+-e ${env}}
}

function getGithubSecretNames() {
  local env="${1}"
  getSecrets "${env}" \
  | awk '{if (NR>1) {print $1}}' \
  | sort
}

function getLocalSecretNames() {
  local env="${1:-global}"
  grep -E -v '^(#.*)$' \
  <".env-${env}.env" \
  | awk -F= '{print $1}' \
  | grep -E -v '^GITHUB_' \
  | sort
}

function checkSecrets() {
  local env="${1:-}"
  log "\nMissing ${env:-global} github secrets:"
  getMissingGithubSecretNames "${env}"
  log "\nObsolete ${env:-global} github secrets:"
  getObsoleteGithubSecretNames "${env}"
}

function getMissingGithubSecretNames() {
  local env="${1:-}"
  comm -23 <(getLocalSecretNames "${env}") <(getGithubSecretNames "${env}")
}

function getObsoleteGithubSecretNames() {
  local env="${1:-}"
  comm -13 <(getLocalSecretNames "${env}") <(getGithubSecretNames "${env}")
}

function updateSecrets() {
  local env="${1}"
  local env_file=".env-${env:-global}.env"
  grep -E -v '^(#.*|GITHUB_.*)$' \
    <"${env_file}" \
  | gh secret set ${env:+-e ${env}} -f -
}

function syncSecrets() {
  local env="${1}"
  log "\nMissing ${env:-global} secrets:"
  getMissingGithubSecretNames "${env}"
  log "\nUpdating all ${env:-global} secrets:"
  updateSecrets "${env}"
  log "\nRemoving obsolete ${env:-global} secrets:"
  for secret in $(getObsoleteGithubSecretNames "${env}"); do
    deleteSecret "${env}" "${secret}"
  done
}

cmd="${1:?No command given!}"
shift 1
env="${1:-}"

# Process all environments:
if [[ "${env}" == "all" ]]; then
  "${0}" "${cmd}"
  "${0}" "${cmd}" "beta"
  "${0}" "${cmd}" "main"
  "${0}" "${cmd}" "pr"
  exit 0
fi

# Process a single environments:
case "${cmd}" in
  check)
    checkSecrets "${env}"
  ;;
  list)
    getSecrets "${env}"
  ;;
  sync)
    syncSecrets "${env}"
  ;;
  update)
    updateSecrets "${env}"
  ;;
  *)
    log "ERROR: Unsupported command '${cmd}'!"
    exit 1
  ;;
esac
