// This script runs after build in Vercel to inject env variables into env-config.js
// Uses ES module syntax
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Running update-env-config.mjs...');

// Get environment variables from process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

console.log(`Found VITE_SUPABASE_URL: ${supabaseUrl ? 'Yes' : 'No'}`);
console.log(`Found VITE_SUPABASE_ANON_KEY: ${supabaseKey ? 'Yes' : 'No'}`);

// Path to env-config.js in the build output
const envConfigPath = path.join(__dirname, 'dist', 'env-config.js');

// Content for the file
const content = `// Runtime environment variables
// Generated during build
window.RUNTIME_ENV = {
  VITE_SUPABASE_URL: "${supabaseUrl}",
  VITE_SUPABASE_ANON_KEY: "${supabaseKey}"
};
console.log('[ENV] Runtime environment variables loaded');`;

try {
  // Create the file
  fs.writeFileSync(envConfigPath, content);
  console.log(`Successfully wrote environment variables to ${envConfigPath}`);
} catch (error) {
  console.error('Error writing environment config:', error);
}