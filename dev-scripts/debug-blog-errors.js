#!/usr/bin/env node

/**
 * Debug Blog Errors - Development script to run the site with unminified React errors
 * 
 * This script:
 * 1. Sets environment variables to display full React error messages
 * 2. Runs the development server
 * 3. Opens the browser with dev tools automatically opened
 * 
 * Usage: ./dev-scripts/debug-blog-errors.js
 */

const { spawn } = require('child_process');
const { join } = require('path');
const fs = require('fs');
const open = require('open');

// Ensure we're in development mode
process.env.NODE_ENV = 'development';

// Set React error display environment variables
process.env.REACT_SHOW_ALL_COMPONENT_STACKS = 'true';
process.env.REACT_DEBUGGER = 'echo %s';

// Create a temporary HTML file to inject development debugging
const tempHtmlPath = join(__dirname, '../temp-debug.html');
const debugHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Debug Blog Errors</title>
  <style>
    body { font-family: sans-serif; line-height: 1.5; padding: 2em; max-width: 800px; margin: 0 auto; }
    pre { background: #f5f5f5; padding: 1em; overflow: auto; border-radius: 4px; }
    .debug-card { border: 1px solid #ddd; padding: 1em; margin-bottom: 1em; border-radius: 4px; }
    button { padding: 0.5em 1em; background: #4a5568; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #2d3748; }
    h1 { color: #2d3748; }
    h2 { color: #4a5568; margin-top: 1.5em; }
    .error { color: #e53e3e; }
    .success { color: #38a169; }
  </style>
</head>
<body>
  <h1>React Debug Assistance</h1>
  <p>This tool helps diagnose React errors with full stack traces.</p>

  <div class="debug-card">
    <h2>Blog Post URL</h2>
    <p>Enter the URL of the blog post that's showing errors:</p>
    <input type="text" id="blog-url" placeholder="e.g., /blog/your-post-slug" style="width: 100%; padding: 0.5em; margin-bottom: 1em;">
    <button id="open-with-debug">Open with Debug Tools</button>
  </div>

  <div class="debug-card">
    <h2>Manual Debugging Steps</h2>
    <ol>
      <li>Open the blog post that shows the error</li>
      <li>Open browser DevTools (F12 or right-click → Inspect)</li>
      <li>Go to the Console tab</li>
      <li>Look for React error messages like "Minified React error #310"</li>
      <li>Copy the full error message</li>
    </ol>
    <p>Paste the error message here for analysis:</p>
    <textarea id="error-message" rows="5" style="width: 100%; padding: 0.5em;"></textarea>
    <button id="analyze-error" style="margin-top: 1em;">Analyze Error</button>
    <div id="analysis-result" style="margin-top: 1em;"></div>
  </div>

  <script>
    document.getElementById('open-with-debug').addEventListener('click', function() {
      const blogUrl = document.getElementById('blog-url').value.trim();
      if (!blogUrl) {
        alert('Please enter a blog post URL');
        return;
      }

      // Ensure URL starts with /blog/
      const url = blogUrl.startsWith('/blog/') ? blogUrl : '/blog/' + blogUrl;
      
      // Create URL with debug parameters
      const debugUrl = 'http://localhost:8080' + url + '?debug=1&reactShowStacks=1';
      
      // Open in new tab
      window.open(debugUrl, '_blank');
    });

    document.getElementById('analyze-error').addEventListener('click', function() {
      const errorMessage = document.getElementById('error-message').value.trim();
      const resultDiv = document.getElementById('analysis-result');
      
      if (!errorMessage) {
        resultDiv.innerHTML = '<p class="error">Please paste an error message</p>';
        return;
      }

      // Simple analysis of common React errors
      let analysis = '';
      
      if (errorMessage.includes('Minified React error #310')) {
        analysis = \`
          <h3 class="error">Hydration Mismatch Error</h3>
          <p>This error occurs when the HTML generated on the server doesn't match what React expects to render on the client.</p>
          <p><strong>Common causes:</strong></p>
          <ul>
            <li>Conditional rendering that behaves differently on server vs client</li>
            <li>Missing data or undefined properties when rendering</li>
            <li>Different prop naming conventions (camelCase vs snake_case)</li>
            <li>Date formatting differences between server and client</li>
          </ul>
          <p><strong>Suggested fixes:</strong></p>
          <ul>
            <li>Check for any conditional rendering based on client-only data</li>
            <li>Ensure all required props have default values</li>
            <li>Make sure the API response format matches your component expectations</li>
            <li>Add defensive checks for objects and properties before using them</li>
          </ul>
        \`;
      } else if (errorMessage.includes('Objects are not valid as a React child')) {
        analysis = \`
          <h3 class="error">Invalid React Child Error</h3>
          <p>React can't directly render objects as children. This happens when you try to render an object directly in JSX.</p>
          <p><strong>Common causes:</strong></p>
          <ul>
            <li>Rendering an object instead of its string representation</li>
            <li>Missing .toString() or JSON.stringify() on object values</li>
            <li>Forgetting to access a specific property of an object</li>
          </ul>
          <p><strong>Suggested fixes:</strong></p>
          <ul>
            <li>Use object.property instead of rendering the entire object</li>
            <li>Convert objects to strings: JSON.stringify(obj)</li>
            <li>Add defensive checks: {obj && obj.property}</li>
          </ul>
        \`;
      } else if (errorMessage.includes('Cannot read property') || errorMessage.includes('Cannot read properties of undefined')) {
        analysis = \`
          <h3 class="error">Undefined Property Error</h3>
          <p>This error occurs when you try to access a property of undefined or null.</p>
          <p><strong>Common causes:</strong></p>
          <ul>
            <li>Data hasn't loaded yet but component tries to access it</li>
            <li>API response format changed but component wasn't updated</li>
            <li>Missing defensive checks for optional properties</li>
          </ul>
          <p><strong>Suggested fixes:</strong></p>
          <ul>
            <li>Add optional chaining: post?.author?.name</li>
            <li>Add default values: {post?.title || 'Untitled'}</li>
            <li>Add loading states to prevent rendering before data is available</li>
            <li>Use defensive data normalization in API response handlers</li>
          </ul>
        \`;
      } else {
        analysis = \`
          <h3>General React Error</h3>
          <p>This looks like a general React error. Here are some debugging steps:</p>
          <ul>
            <li>Check component props and state for unexpected values</li>
            <li>Verify API responses match expected formats</li>
            <li>Look for any conditional rendering that might cause issues</li>
            <li>Make sure all required dependencies are included in useEffect</li>
            <li>Try isolating the component that's causing the error</li>
          </ul>
        \`;
      }
      
      resultDiv.innerHTML = analysis;
    });
  </script>
</body>
</html>
`;

// Write the debug HTML file
fs.writeFileSync(tempHtmlPath, debugHtml);

console.log('Starting development server with React debugging enabled...');

// Run the development server
const devServer = spawn('npm', ['run', 'dev'], {
  env: {
    ...process.env,
    BROWSER: 'none', // Don't open browser automatically
    REACT_SHOW_ALL_COMPONENT_STACKS: 'true',
    REACT_DEBUGGER: 'echo %s',
  },
  stdio: 'inherit',
});

// Wait for server to start
setTimeout(() => {
  console.log('\n----------------------------------------');
  console.log('Opening debug helper in browser...');
  console.log('----------------------------------------\n');
  
  // Open the debug helper page
  open('http://localhost:8080/temp-debug.html');
  
  console.log('To debug a specific blog post:');
  console.log('1. Enter the post slug in the debug tool');
  console.log('2. Click "Open with Debug Tools"');
  console.log('3. Check browser console for detailed error messages');
  console.log('\nPress Ctrl+C to stop the development server');
}, 5000);

// Handle server exit
devServer.on('exit', (code) => {
  console.log(`Development server exited with code ${code}`);
  // Clean up temp file
  try {
    fs.unlinkSync(tempHtmlPath);
  } catch (err) {
    // Ignore errors removing temp file
  }
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping development server...');
  devServer.kill('SIGINT');
  // Clean up temp file
  try {
    fs.unlinkSync(tempHtmlPath);
  } catch (err) {
    // Ignore errors removing temp file
  }
});