#!/bin/bash

set -euo pipefail

export GITHUB_COM_TOKEN="${GITHUB_TOKEN:-}"

cmd="${1:?No command given!}"
shift 1

case "${cmd}" in
  test)
    LOG_LEVEL=debug renovate --platform=local --repository-cache=reset 2>&1 \
    | awk '
      # BEGIN {
      #   print "{";
      # }
      # END {
      #   print "}"
      # }
      /^[ ]*(DEBUG|INFO|WARN): / {
        if (p==1) print "}}";
        p=0;
      }
      {
        if(p==1) print $0;
      }
      /^DEBUG: File config/ {
        print "{\"fileConfig\":{";
        p=1;
      }
      /^DEBUG: CLI config/ {
        print "{\"cliConfig\":{";
        p=1;
      }
      /^DEBUG: Env config/ {
        print "{\"envConfig\":{";
        p=1;
      }
      /^DEBUG: Combined config/ {
        print "{\"combinedConfig\":{";
        p=1;
      }
      /^ INFO: Repository started/ {
        print "{\"versionInfo\":{";
        p=1;
      }
      /^DEBUG: Repository config/ {
        print "{\"repoConfig\":{";
        p=1;
      }
      /^DEBUG: Post-massage config/ {
        print "{\"postMassageConfig\":{";
        p=1;
      }
      /^DEBUG: Found repo ignorePaths/ {
        print "{\"ignoreConfig\":{";
        p=1;
      }
      /^DEBUG: manager extract durations/ {
        print "{\"managerExtractDurations\":{";
        p=1;
      }
      /^ INFO: Dependency extraction complete/ {
        print "{\"dependencyExtractionStats\":{";
        p=1;
      }
      /^WARN: GitHub token is required for some dependencies/ {
        print "{\"githubDependencyWarning\":{";
        p=1;
      }
      /^DEBUG: packageFiles with updates/ {
        print "{\"dependencyUpdates\":{";
        p=1; 
      }
      /^DEBUG: repository problems/ {
        print "{\"repoProblems\":{";
        p=1;
      }
      /^DEBUG: Repository timing splits (milliseconds)/ {
        print "{\"repoTimingSplits\":{";
        p=1;
      }
      /^DEBUG: Package cache statistics/ {
        print "{\"pkgCacheStats\":{";
        p=1;
      }
      /^DEBUG: HTTP statistics/ {
        print "{\"httpStats\":{";
        p=1;
      }
      /^DEBUG: HTTP cache statistics/ {
        print "{\"httpCacheStats\":{";
        p=1;
      }
      /^DEBUG: Lookup statistics/ {
        print "{\"lookupStats\":{";
        p=1;
      }
      /^DEBUG: dns cache/ {
        print "{\"dnsCache\":{";
        p=1;
      }
      /^ INFO: Repository finished/ {
        print "{\"repoFinishedResults\":{";
        p=1;
      }
      ' \
      | sed -re 's/"cloned": undefined,/"cloned": null,/g' \
      | gojq -s 'add'
    ;;
  *)
    ;;
esac
