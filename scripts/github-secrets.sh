#!/bin/bash

set -euo pipefail

function deleteSecret() {
  local env="${1}"
  local secret="${2}"
  echo -e "\nDeleting secret${env:+ for env ${env}} ${secret} ..."
  gh secret delete ${env:+-e ${env}} "${secret}"
}

function getSecrets() {
  local env="${1}"
  echo -e "\nListing ${env:-global} secrets ..."
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
  echo -e "\nMissing ${env:-global} github secrets:"
  getMissingGithubSecretNames "${env}"
  echo -e "\nObsolete ${env:-global} github secrets:"
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
  echo -e "\nMissing ${env:-global} secrets:"
  getMissingGithubSecretNames "${env}"
  echo -e "\nUpdating all ${env:-global} secrets:"
  updateSecrets "${env}"
  echo -e "\nRemoving obsolete ${env:-global} secrets:"
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
    echo "ERROR: Unsupported command '${cmd}'!"
    exit 1
  ;;
esac
