#!/bin/bash

# Function to generate PDF from HTML using wkhtmltopdf
generate_pdf() {
  wkhtmltopdf - -
}

# Function to encrypt PDF using qpdf
encrypt_pdf() {
  local password="${1}"
  local input_pdf="${2}"
  local output_pdf="${3}"

  qpdf --encrypt "${password}" "${password}" 256 -- --linearize "${input_pdf}" "${output_pdf}"
}

# Temporary files
temp_pdf=$(mktemp)
encrypted_pdf=$(mktemp)

# Trap for cleanup on exit (important!)
trap 'rm -f "${temp_pdf}" "${encrypted_pdf}"; exit' INT TERM EXIT

# Check for password argument
password=""
if [[ "${1}" == "-p" ]]; then
  password="${2}"
  shift 2 # Remove -p and password from arguments
fi

# Generate PDF from stdin
generate_pdf < /dev/stdin > "${temp_pdf}"

# Encrypt if password is provided
if [[ -n "${password}" ]]; then
  encrypt_pdf "${password}" "${temp_pdf}" "${encrypted_pdf}"
  cat "${encrypted_pdf}"  # Output the encrypted PDF
else
  cat "${temp_pdf}" # Output the unencrypted PDF
fi

# Cleanup is handled by the trap
