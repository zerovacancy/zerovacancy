/**
 * React Deduplication Script
 * 
 * This script ensures that only one copy of React is used in the application
 * by updating package.json with consistent React resolutions.
 * 
 * Usage:
 * 1. Run this script with: node fix-react-deps.js
 * 2. Reinstall dependencies: npm install
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target package.json path
const packageJsonPath = path.join(__dirname, 'package.json');
let packageJson;

try {
  // Read existing package.json
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  packageJson = JSON.parse(packageJsonContent);
  
  // Ensure we have overrides section
  packageJson.overrides = packageJson.overrides || {};
  
  console.log('Current React version in dependencies:', packageJson.dependencies.react);
  console.log('Current React DOM version in dependencies:', packageJson.dependencies['react-dom']);
  
  // Update React overrides to ensure consistent versions
  packageJson.overrides = {
    ...packageJson.overrides,
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@react-email/components": {
      "react": "^18.3.1"
    },
    "@react-email/render": {
      "react": "^18.3.1"
    },
    // Add any other packages that might bundle their own React
    "@tiptap/react": {
      "react": "^18.3.1"
    },
    "@number-flow/react": {
      "react": "^18.3.1"
    },
    "@tsparticles/react": {
      "react": "^18.3.1"
    }
  };
  
  // Write the updated package.json
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf8'
  );
  
  console.log('✅ Successfully updated React overrides in package.json');
  console.log('');
  console.log('Next Steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run dev');
  console.log('');
  console.log('This should resolve React hook errors related to multiple React instances.');
} catch (error) {
  console.error('❌ Error updating package.json:', error);
}