/**
 * Critical CSS Extractor - Core Performance Improvement
 * 
 * Simple script to extract critical CSS for the ZeroVacancy website.
 * This improves First Contentful Paint by reducing render-blocking resources.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Critical CSS content based on common above-the-fold elements
const criticalCSS = `
/* Critical rendering styles */
html, body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

/* Pre-style root container to avoid layout shift */
#root {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Critical header & navigation styles */
header {
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Critical hero section styles */
.hero, section[class*="hero"] {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
}

/* Critical button styles */
button, .button, [class*="btn"] {
  background: linear-gradient(135deg, #6741d9 0%, #8a57de 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

/* Image placeholders to prevent layout shift */
img {
  width: 100%;
  height: auto;
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* Font loading optimizations */
@font-face {
  font-family: 'Plus Jakarta Sans Fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 96%;
  descent-override: 27%;
  line-gap-override: 0%;
}

@font-face {
  font-family: 'Inter Fallback';
  src: local('Helvetica');
  size-adjust: 100%;
  ascent-override: 93%;
  descent-override: 23%;
  line-gap-override: 0%;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Plus Jakarta Sans', 'Plus Jakarta Sans Fallback', system-ui, sans-serif !important;
}

p, span, a, button, li, input, textarea {
  font-family: 'Inter', 'Inter Fallback', system-ui, sans-serif !important;
}
`;

// Generate the critical CSS file
try {
  // Create directories if they don't exist
  const outputDir = path.join(__dirname, '../dist/assets/css');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write critical CSS to file
  const outputFile = path.join(outputDir, 'critical.css');
  fs.writeFileSync(outputFile, criticalCSS);
  console.log(`Critical CSS written to: ${outputFile}`);
  
  // Update the HTML to use the critical CSS
  const htmlPath = path.join(__dirname, '../dist/index.html');
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Check if critical CSS is already included
    if (!html.includes('critical.css')) {
      // Create the preload and stylesheet links
      const criticalCssLinks = `
    <!-- Critical CSS for performance -->
    <link rel="stylesheet" href="/assets/css/critical.css" />
    <link rel="preload" href="/assets/css/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript><link rel="stylesheet" href="/assets/css/styles.css" /></noscript>
`;
      
      // Add the links before the first </head> occurrence
      html = html.replace('</head>', `${criticalCssLinks}</head>`);
      
      // Write the updated HTML back to the file
      fs.writeFileSync(htmlPath, html);
      console.log('HTML updated with critical CSS references');
    } else {
      console.log('HTML already includes critical CSS');
    }
  } else {
    console.log('HTML file not found, skipping HTML update');
  }
} catch (error) {
  console.error('Error generating critical CSS:', error);
  process.exit(1);
}