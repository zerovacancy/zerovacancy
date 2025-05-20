#!/bin/bash

# React Hooks Error Fix Script
# This script helps resolve React hook errors by ensuring only one copy of React is used

echo "============================================"
echo "      React Hooks Error Fix Script"
echo "============================================"

# Check if the fix-react-deps.js exists
if [ ! -f "fix-react-deps.js" ]; then
  echo "❌ fix-react-deps.js not found. Cannot continue."
  exit 1
fi

# Run the fix-react-deps.js script to set up overrides in package.json
echo "📦 Running React dependency deduplication script..."
node fix-react-deps.js

if [ $? -ne 0 ]; then
  echo "❌ Error executing dependency script. Check for errors."
  exit 1
fi

# Remove node_modules to ensure clean installation
echo "🧹 Cleaning node_modules to ensure a fresh start..."
rm -rf node_modules

# Run npm install to reinstall all dependencies with the overrides
echo "🔄 Reinstalling dependencies with React overrides..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ npm install failed. Check for errors."
  exit 1
fi

echo "✅ React dependency installation completed successfully."
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Check the console for any React hook errors"
echo "3. If errors persist, try clearing your browser cache"
echo ""
echo "React hooks should now work correctly with a single React instance."
echo "============================================"