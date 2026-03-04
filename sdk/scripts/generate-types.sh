#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SDK_DIR="$(dirname "$SCRIPT_DIR")"
SPEC_FILE="$SDK_DIR/../openapi.yaml"
OUTPUT="$SDK_DIR/src/types/generated.d.ts"

echo "Generating types from $SPEC_FILE..."
npx openapi-typescript "$SPEC_FILE" -o "$OUTPUT"
echo "Types written to $OUTPUT"
