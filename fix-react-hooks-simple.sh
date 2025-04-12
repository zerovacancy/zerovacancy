#!/bin/bash

# Simplified React hooks fix script
echo "Starting simplified React hooks fix..."

# Step 1: Add React resolutions to package.json
echo "Adding resolutions to package.json..."
node -e '
  const fs = require("fs");
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  
  // Ensure resolutions object exists
  pkg.resolutions = pkg.resolutions || {};
  
  // Add React resolutions
  pkg.resolutions.react = "18.2.0";
  pkg.resolutions["react-dom"] = "18.2.0";
  
  // Ensure overrides exist
  pkg.overrides = pkg.overrides || {};
  pkg.overrides.react = "18.2.0";
  pkg.overrides["react-dom"] = "18.2.0";
  
  // Add specific package overrides for problematic packages
  pkg.overrides["@react-email/components"] = {
    "react": "18.2.0"
  };
  pkg.overrides["@react-email/render"] = {
    "react": "18.2.0"
  };
  pkg.overrides["@tiptap/react"] = {
    "react": "18.2.0"
  };
  
  // Write back to package.json
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  console.log("Updated package.json with React resolutions and overrides");
'

# Step 2: Update vite.config.ts to properly deduplicate React
echo "Updating vite.config.ts to ensure React deduplication..."
node -e '
  const fs = require("fs");
  const path = require("path");
  
  const viteConfigPath = "vite.config.ts";
  let viteConfig = fs.readFileSync(viteConfigPath, "utf8");
  
  // Add import for path if not already there
  if (!viteConfig.includes("import path from")) {
    viteConfig = viteConfig.replace(
      "import { defineConfig } from \"vite\";",
      "import { defineConfig } from \"vite\";\nimport path from \"path\";"
    );
  }
  
  // Check if resolve.dedupe exists, if not add it
  if (!viteConfig.includes("dedupe:")) {
    // Find resolve section
    const resolveMatch = viteConfig.match(/resolve:\s*{[^}]*}/s);
    if (resolveMatch) {
      // Add dedupe to existing resolve section
      const resolveSection = resolveMatch[0];
      const updatedResolve = resolveSection.replace(
        "}",
        ",\n    dedupe: [\"react\", \"react-dom\"],\n  }"
      );
      viteConfig = viteConfig.replace(resolveSection, updatedResolve);
    } else {
      // Add new resolve section with dedupe
      viteConfig = viteConfig.replace(
        /plugins:\s*\[[\s\S]*?\].filter\(Boolean\),/,
        "$&\n  resolve: {\n    alias: {\n      \"@\": path.resolve(__dirname, \"./src\"),\n    },\n    dedupe: [\"react\", \"react-dom\"],\n  },"
      );
    }
  }
  
  // Make sure optimizeDeps includes React
  if (!viteConfig.includes("optimizeDeps")) {
    viteConfig = viteConfig.replace(
      /},\s*}\);\s*$/,
      "},\n  optimizeDeps: {\n    force: true,\n    include: [\"react\", \"react-dom\", \"react/jsx-runtime\"],\n  },\n});"
    );
  } else if (!viteConfig.includes("include: [")) {
    viteConfig = viteConfig.replace(
      /optimizeDeps:\s*{/,
      "optimizeDeps: {\n    include: [\"react\", \"react-dom\", \"react/jsx-runtime\"],"
    );
  } else if (!viteConfig.includes("\"react\"") || !viteConfig.includes("\"react-dom\"")) {
    viteConfig = viteConfig.replace(
      /include:\s*\[([\s\S]*?)\]/,
      (match, includeContent) => {
        return `include: [${includeContent}${includeContent.trim() ? "," : ""}\n      "react", "react-dom", "react/jsx-runtime"\n    ]`;
      }
    );
  }
  
  fs.writeFileSync(viteConfigPath, viteConfig);
  console.log("Updated vite.config.ts to ensure React is properly deduplicated");
'

# Step 3: Clean npm cache and node_modules
echo "Cleaning npm cache and node_modules..."
npm cache clean --force
rm -rf node_modules

# Step 4: Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

# Step 5: Deduplicate React dependencies
echo "Deduplicating React dependencies..."
npm dedupe react react-dom

# Final check
echo "Checking for duplicate React instances..."
npm ls react
npm ls react-dom

echo "Fix complete! Please restart your development server."
echo "If you still experience issues, try running: npm cache verify"