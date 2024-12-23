#!/bin/bash
set -euxo pipefail

export NODE_ENV=production

TARGET_DIR="$VAULT_ROOT/.obsidian/plugins/file-tree-alternative"
mkdir -p "$TARGET_DIR"

npm run build
cp manifest.json styles.css "$TARGET_DIR"
cp dist/main.js "$TARGET_DIR"
