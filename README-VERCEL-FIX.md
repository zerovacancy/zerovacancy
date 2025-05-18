# Vercel Environment Variable Fix

This fix addresses the blank page issue in production caused by missing Supabase environment variables.

## Changes Made

1. **Simplified Vite Configuration**: Removed complex environment variable handling in favor of standard Vite practices.

2. **Runtime Environment Variable Support**: Added a simple runtime fallback mechanism using `window.RUNTIME_ENV`.

3. **Post-Build Script**: Added a script that runs after build to inject environment variables into the client-side code.

4. **Simplified Supabase Client**: Created a more straightforward Supabase client implementation with clear fallback handling.

5. **Env Debug Component**: Added a component that helps diagnose environment variable issues without exposing sensitive values.

6. **Standard Vercel Configuration**: Updated vercel.json to use standard practices for Vite projects.

7. **Production Environment Placeholders**: Added .env.production with placeholder values.

## Testing This Fix

### Local Testing

1. Run the development server:
   ```
   npm run dev
   ```

2. Check that Supabase connections work properly.

3. Build the app locally and test with a local server:
   ```
   npm run build
   npx serve dist
   ```

### Vercel Testing

1. Deploy to Vercel and make sure to set the environment variables in the Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Ensure "Exposed to Browser" is checked for both variables.

3. After deployment, add `?debug=env` to the URL to see which environment variables are available.

## Troubleshooting

If you still encounter issues:

1. Check the browser console for detailed error messages.

2. Verify environment variables are correctly set in Vercel dashboard.

3. Try clearing the Vercel cache and rebuilding.

4. Review the VERCEL-DEPLOYMENT-GUIDE.md for more detailed information.