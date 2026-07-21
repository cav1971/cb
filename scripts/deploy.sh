#!/usr/bin/env bash
set -euo pipefail

ARTIFACT_DIR="${1:-artifact}"
TARGET_DIR="${2:-deploy/staging}"

if [ ! -d "$ARTIFACT_DIR" ]; then
  echo "Artifact directory not found: $ARTIFACT_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"
cp -R "$ARTIFACT_DIR"/. "$TARGET_DIR"/
echo "deployed_at_utc=$(date -u +'%Y-%m-%dT%H:%M:%SZ')" > "$TARGET_DIR/deploy-meta.txt"

echo "Deployment finished: $TARGET_DIR"
