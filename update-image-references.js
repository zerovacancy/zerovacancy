import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const componentsDir = path.join(__dirname, 'src', 'components');
const publicDir = path.join(__dirname, 'public');

// Helper function to walk directories recursively
function getAllFiles(dir, extension = '.tsx') {
  const files = [];
  
  function traverseDir(currentPath) {
    const allItems = fs.readdirSync(currentPath);
    
    for (const item of allItems) {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        traverseDir(itemPath);
      } else if (itemPath.endsWith(extension)) {
        files.push(itemPath);
      }
    }
  }
  
  traverseDir(dir);
  return files;
}

// Check if a WebP version exists for a given image path
function webpVersionExists(imagePath) {
  // Convert to absolute path in public dir
  let publicPath = imagePath;
  if (imagePath.startsWith('/')) {
    publicPath = path.join(publicDir, imagePath.substring(1));
  } else {
    publicPath = path.join(publicDir, imagePath);
  }
  
  // Generate WebP path
  const ext = path.extname(publicPath);
  const webpPath = publicPath.replace(ext, '.webp');
  
  return fs.existsSync(webpPath);
}

// Function to add WebP support to an image component
function addWebPSupport(fileContent) {
  // Pattern to match img tags with src attributes (simplified for this script)
  const imgRegex = /<img[^>]+src=["']([^"']+\.(jpe?g|png))["'][^>]*>/g;
  
  // Replace each img tag with a version that includes srcSet and type for WebP
  let match;
  let modifiedContent = fileContent;
  let replacements = [];
  
  while ((match = imgRegex.exec(fileContent)) !== null) {
    const fullMatch = match[0];
    const imagePath = match[1];
    
    // Skip if the image path is dynamic (contains variables)
    if (imagePath.includes('{') || imagePath.includes('$')) {
      continue;
    }
    
    // Check if WebP version exists
    if (webpVersionExists(imagePath)) {
      // Create WebP version of the path
      const ext = path.extname(imagePath);
      const webpPath = imagePath.replace(ext, '.webp');
      
      // Prepare the updated img tag with srcSet and fallback
      const hasExistingSrcSet = fullMatch.includes('srcSet');
      if (hasExistingSrcSet) {
        // If it already has srcSet, make sure WebP is included
        continue; // Skip for now as this requires more complex parsing
      } else {
        // Add WebP support with srcSet
        const updatedImgTag = fullMatch.replace(
          `src="${imagePath}"`,
          `src="${imagePath}" srcSet="${webpPath}" type="image/webp"`
        );
        
        replacements.push({
          original: fullMatch,
          updated: updatedImgTag,
          imagePath,
          webpPath
        });
      }
    }
  }
  
  // Apply all replacements
  for (const replacement of replacements) {
    modifiedContent = modifiedContent.replace(
      replacement.original,
      replacement.updated
    );
  }
  
  return {
    content: modifiedContent,
    count: replacements.length,
    replacements
  };
}

// Main function to update all component files
async function updateImageReferences() {
  console.log('Starting to update image references in components...');
  
  // Get all component files
  const componentFiles = getAllFiles(componentsDir);
  console.log(`Found ${componentFiles.length} component files to check.`);
  
  let totalReplacements = 0;
  let updatedFiles = 0;
  
  // Process each file
  for (const filePath of componentFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { content: updatedContent, count, replacements } = addWebPSupport(content);
      
      if (count > 0) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✓ Updated ${filePath} with ${count} WebP references`);
        
        // Log the details of replacements
        for (const replacement of replacements) {
          console.log(`  - Added WebP for: ${replacement.imagePath} → ${replacement.webpPath}`);
        }
        
        totalReplacements += count;
        updatedFiles++;
      }
    } catch (error) {
      console.error(`✗ Error processing ${filePath}:`, error);
    }
  }
  
  console.log('\nUpdate summary:');
  console.log(`Updated ${updatedFiles} files with ${totalReplacements} WebP image references.`);
}

// Run the update
updateImageReferences().catch(console.error);