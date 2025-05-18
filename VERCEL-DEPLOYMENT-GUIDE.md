# Vercel Deployment Guide for ZeroVacancy

This guide explains how to correctly set up environment variables for Vite + React + Supabase on Vercel deployments.

## Environment Variable Setup (CRITICAL)

### 1. Set Environment Variables in Vercel Dashboard

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add the following variables:**

| Name | Value | Environments | Exposed to Browser |
|------|-------|--------------|-------------------|
| `VITE_SUPABASE_URL` | `https://pozblfzhjqlsxkakhowp.supabase.co` | Production, Preview, Development | YES ✓ |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development | YES ✓ |

**IMPORTANT: Make sure "Exposed to Browser" is CHECKED for both variables!**

This is the most common mistake - the variables must be exposed to the browser for client-side code to access them.

### 2. Verify Project Configuration

Ensure your project has these key files correctly set up:

- **vite.config.js**: Simple configuration without complex environment variable manipulation
- **vercel.json**: Simple configuration with routes and build settings
- **public/env-config.js**: Runtime fallback for environment variables
- **.env.production**: Contains placeholder values (actual values come from Vercel)

### 3. Testing Your Deployment

After deploying, you can add `?debug=env` to the URL to display the environment debug panel. This will show which environment variables are available (but not their values).

## Troubleshooting

### Common Issues

1. **Blank page with "supabaseUrl is required" error**
   - Make sure environment variables are properly set in Vercel dashboard
   - Ensure "Exposed to Browser" is checked for all VITE_* variables
   - Check browser console for more specific errors

2. **Environment variables available during build but not runtime**
   - This means the variables are not being correctly embedded in the client bundle
   - Check that the update-env-config.js script runs after build
   - Verify public/env-config.js is being loaded before other scripts

3. **"Unexpected token '<'" errors in JavaScript**
   - This means a JavaScript file is receiving HTML content
   - Usually caused by incorrect routing in vercel.json
   - Make sure all routes correctly point to index.html

### Quick Fixes

1. **Force Rebuild with Clear Cache**
   - In Vercel dashboard, go to Deployments
   - Click "..." on the latest deployment and select "Rebuild"
   - Check "Clear Cache" before rebuilding

2. **Manually Set Variables in the Preview URL**
   - Add `?VITE_SUPABASE_URL=https://pozblfzhjqlsxkakhowp.supabase.co&VITE_SUPABASE_ANON_KEY=your_key` to the URL (for testing only)

3. **Check for Conflicting Environment Files**
   - Make sure no `.env` files are overriding your Vercel environment variables
   - Ensure no hardcoded values are taking precedence

## Best Practices

1. **Keep Environment Config Simple**
   - Don't overcomplicate environment variable handling
   - Use the simplest approach that works reliably

2. **Use Both Build-time and Runtime Approaches**
   - Variables should be available at build time via import.meta.env
   - Also provide a runtime fallback via window.RUNTIME_ENV

3. **Never Hardcode Credentials in Deployed Code**
   - Always use environment variables for credentials
   - Use placeholders in example files, never actual values

4. **Add Detailed Error Logging**
   - Make sure your app logs clear error messages
   - Add fallbacks so a missing variable doesn't result in a blank page