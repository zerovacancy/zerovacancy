#!/bin/bash

# Emergency script to inject Supabase credentials directly into built files
# This is a last resort measure for immediate resolution of production issues

echo "🚨 EMERGENCY INJECTION SCRIPT 🚨"
echo "This script will inject hardcoded Supabase credentials into the built files"

# Make sure we're in the project directory
cd "$(dirname "$0")"

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy our emergency fix HTML to the dist directory
echo "Copying emergency fix HTML..."
cp emergency-fix.html dist/index.html

# Create a public/emergency folder for our scripts
mkdir -p dist/emergency

# Copy our hardcoded Supabase script
echo "Copying hardcoded Supabase script..."
cp src/hardcoded-supabase.js dist/emergency/

# Create a redirect file
echo "Creating _redirects file..."
cat > dist/_redirects << EOL
/* /index.html 200
EOL

echo "Creating public-env.js..."
cat > dist/public-env.js << EOL
// PUBLIC ENVIRONMENT VARIABLES
window.env = window.env || {};
window.env.VITE_SUPABASE_URL = "https://pozblfzhjqlsxkakhowp.supabase.co";
window.env.VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM";
console.log("[ENV] Loaded public environment variables");
EOL

echo "Emergency injection complete!"
echo "Upload the 'dist' directory to your hosting provider for immediate fix."