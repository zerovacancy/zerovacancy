# ZeroVacancy - React Hook Errors Fix Guide

This document explains how to fix the React hook errors that occur in the ZeroVacancy application.

## The Problem

The application is experiencing React hook errors, specifically:

```
Warning: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

And:

```
Cannot read properties of null (reading 'useState')
```

This typically occurs due to one of these issues:

1. **Multiple React Instances**: The application is loading multiple copies of React, causing hooks to fail.
2. **Invalid Hook Calls**: Hooks are being called outside of React function components.
3. **Component Initialization Issues**: The React component is being initialized incorrectly.
4. **Mixing ESM and CommonJS**: Different module formats can cause React duplication.
5. **Incompatible React Versions**: Mismatched React and React DOM versions can cause hooks to fail.

## The Solution

We've implemented several fixes:

1. **React Deduplication**: The `fix-react-hooks.sh` script ensures all dependencies use a consistent React version (18.3.1).
2. **React Singleton Pattern**: We've implemented a singleton pattern with these components:
   - `src/utils/react-singleton.js`: Exports singleton instances of React and ReactDOM
   - `src/utils/ensure-react-singleton.js`: Forces usage of singleton React
   - `src/plugins/vite-react-singleton.js`: Vite plugin to alias React imports
3. **Function-based Manual Chunks**: The Vite configuration ensures consistent React bundling.
4. **Package Resolutions**: The package.json now includes resolutions to force a single React version.
5. **Module Format Consistency**: Ensures all React modules use the same module format (ESM).

## How to Apply the Fix

### Complex Fix (React Singleton)

Run the original fix script to implement the React singleton pattern:

```bash
./fix-react-hooks.sh
```

This script will:
1. Create React singleton files and Vite plugin
2. Apply React dependency overrides to package.json
3. Clean node_modules and reinstall dependencies
4. Configure main.tsx to use the React singleton

### Simplified Fix (Recommended)

Run the simplified fix script which focuses on dependency management:

```bash
./fix-react-hooks-simple.sh
```

This script will:
1. Add React resolutions to package.json
2. Perform a clean installation of dependencies
3. Deduplicate React dependencies
4. Verify a single React instance is used

### Manual Fix

If you prefer to fix the issue manually:

1. Update your package.json to include React resolutions:
   ```json
   "resolutions": {
     "react": "18.3.1",
     "react-dom": "18.3.1"
   }
   ```

2. Clean your node_modules:
   ```bash
   rm -rf node_modules
   ```

3. Reinstall dependencies:
   ```bash
   npm install
   ```

4. Deduplicate React dependencies:
   ```bash
   npm dedupe react react-dom
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Verification

To verify the fix:

1. Check the browser console for React hook errors
2. Verify the mobile loading works correctly
3. Test the application on mobile devices

## Troubleshooting

If issues persist:

1. Clear your browser cache completely
2. Check for any browser extensions that might interfere with React
3. Try a different browser to isolate the issue
4. Run `npm ls react` to check for duplicate React packages

## Technical Details

The main fixes include:

1. **Package.json Overrides**: Ensuring all packages use the same React version
2. **Vite Configuration**: Using a function-based manual chunks configuration that properly handles React
3. **React Singleton Plugin**: A custom Vite plugin that ensures React is properly externalized
4. **Loading Indicator**: Simplified loading indicator that doesn't interfere with React initialization

These changes together ensure that only one copy of React is loaded, preventing hook errors.