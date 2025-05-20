#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to the .env file
const envFilePath = path.join(__dirname, '.env');

// Check if the file exists
if (!fs.existsSync(envFilePath)) {
  console.error('Error: .env file not found. Creating from .env.example...');
  
  // Try to copy from .env.example if it exists
  const exampleEnvPath = path.join(__dirname, '.env.example');
  if (fs.existsSync(exampleEnvPath)) {
    fs.copyFileSync(exampleEnvPath, envFilePath);
    console.log('Created .env file from .env.example');
  } else {
    console.error('Error: .env.example file not found. Creating a minimal .env file...');
    
    // Create a minimal .env file with required Supabase variables
    const minimalEnvContent = `# Supabase Configuration
VITE_SUPABASE_URL=https://pozblfzhjqlsxkakhowp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM

# Base URLs for different environments
VITE_PRODUCTION_URL=https://zerovacancy.app

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_VITALS=false
VITE_VITALS_SAMPLING_RATE=0.1
`;
    fs.writeFileSync(envFilePath, minimalEnvContent);
    console.log('Created minimal .env file with required variables');
  }
} else {
  console.log('.env file found');
}

// Read the .env file
const envContent = fs.readFileSync(envFilePath, 'utf8');
const envLines = envContent.split('\n');

// Check for Supabase variables
let hasSupabaseUrl = false;
let hasSupabaseKey = false;

for (const line of envLines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    hasSupabaseUrl = true;
  }
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    hasSupabaseKey = true;
  }
}

// Add missing variables if needed
let modified = false;
let newContent = envContent;

if (!hasSupabaseUrl) {
  console.log('Adding missing VITE_SUPABASE_URL to .env');
  newContent += '\nVITE_SUPABASE_URL=https://pozblfzhjqlsxkakhowp.supabase.co';
  modified = true;
}

if (!hasSupabaseKey) {
  console.log('Adding missing VITE_SUPABASE_ANON_KEY to .env');
  newContent += '\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM';
  modified = true;
}

// Save the modified .env file if changes were made
if (modified) {
  fs.writeFileSync(envFilePath, newContent);
  console.log('.env file updated with required variables');
}

// Display the current .env file content (excluding sensitive values)
console.log('\nCurrent .env file content:');
for (const line of newContent.split('\n')) {
  // Hide sensitive values
  if (line.includes('KEY=')) {
    const parts = line.split('=');
    console.log(`${parts[0]}=[HIDDEN]`);
  } else {
    console.log(line);
  }
}

// Now exit with a success code so it doesn't block the Vite start script
process.exit(0);