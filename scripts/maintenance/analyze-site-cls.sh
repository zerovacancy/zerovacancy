#!/bin/bash

# Site-Wide CLS Analysis Script
# This script runs the automated CLS testing across the entire site

echo "🔍 Starting site-wide CLS analysis..."

# Build the project if needed
if [ "$1" == "--build" ]; then
  echo "📦 Building project..."
  npm run build
fi

# Start the server in the background
echo "🚀 Starting server..."
npx serve dist -p 3000 & 
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Run the CLS testing
echo "🧪 Running CLS tests..."
node scripts/automated-cls-testing.js --url=http://localhost:3000 --debug

# Kill the server
echo "🛑 Stopping server..."
kill $SERVER_PID

# Open the latest report
LATEST_REPORT=$(ls -t cls-reports/cls-report-*.html | head -1)
if [ -f "$LATEST_REPORT" ]; then
  echo "📊 Opening CLS report: $LATEST_REPORT"
  open "$LATEST_REPORT"
else
  echo "❌ No report generated"
fi

echo "✅ CLS analysis complete"