#!/bin/bash

# Simplified React hooks fix script
echo "Starting simplified React hooks fix..."

# Step 1: Add React resolutions to package.json if not already present
if ! grep -q '"resolutions"' package.json; then
  echo "Adding resolutions to package.json..."
  node -e '
    const fs = require("fs");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    pkg.resolutions = pkg.resolutions || {};
    pkg.resolutions.react = "18.3.1";
    pkg.resolutions["react-dom"] = "18.3.1";
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  '
fi

# Step 2: Clean install dependencies
echo "Reinstalling dependencies..."
npm clean-install

# Step 3: Deduplicate React dependencies
echo "Deduplicating React dependencies..."
npm dedupe react react-dom

# Step 4: Check for duplicate React instances
echo "Checking for duplicate React instances..."
npm ls react

echo "Fix complete. Please restart your development server."
echo "If you still experience issues, try clearing your browser cache."