#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Linting openapi.yaml ==="
npx @redocly/cli lint "$ROOT_DIR/openapi.yaml" --format stylish

echo ""
echo "=== Generating openapi.json ==="
npx js-yaml "$ROOT_DIR/openapi.yaml" > "$ROOT_DIR/openapi.json"
echo "Generated openapi.json ($(wc -c < "$ROOT_DIR/openapi.json" | tr -d ' ') bytes)"

echo ""
echo "=== Done ==="
