#!/usr/bin/env sh
set -eu
URL='https://api.safecast.org/measurements.json?latitude=35.68&longitude=139.76&distance=500&per_page=3'
echo "Checking Safecast public API..."
echo "GET $URL"
if command -v curl >/dev/null 2>&1; then
  curl -fLsS --max-time 25 -H 'Accept: application/json' "$URL" | head -c 5000
  printf '\n\nAPI request completed. Inspect the output above; this script does not assert data quality.\n'
else
  echo "curl is required." >&2
  exit 1
fi
