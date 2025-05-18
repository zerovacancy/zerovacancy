#!/usr/bin/env node

// Custom build script for Vercel deployment
const fs = require('fs');
const path = require('path');

console.log('Running vercel-build.js preparation script...');

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pozblfzhjqlsxkakhowp.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM';

console.log(`Using SUPABASE_URL: ${supabaseUrl.substring(0, 20)}...`);
console.log('SUPABASE_ANON_KEY: [HIDDEN]');

// Content for env-config.js
const envConfigContent = `
// Runtime environment variables for ZeroVacancy
window.env = window.env || {};
window.env.VITE_SUPABASE_URL = "${supabaseUrl}";
window.env.VITE_SUPABASE_ANON_KEY = "${supabaseKey}";
`;

// Ensure public directory exists
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  console.log('Creating public directory...');
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write env-config.js
const envConfigPath = path.join(publicDir, 'env-config.js');
fs.writeFileSync(envConfigPath, envConfigContent);
console.log(`Created ${envConfigPath} with runtime environment variables`);

// Also save a copy to the root directory just in case
fs.writeFileSync(path.join(process.cwd(), 'env-config.js'), envConfigContent);
console.log('Created root env-config.js as backup');

// Create a simple status file to verify the build script ran
fs.writeFileSync(path.join(publicDir, 'build-status.txt'), `Build preparation completed at ${new Date().toISOString()}`);

console.log('Vercel build preparation completed successfully!');