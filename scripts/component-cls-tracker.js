// This file contains enhanced CLS tracking for component-specific shifts
// It's injected into the page via the automated-cls-testing.js script

// Function to track component-specific layout shifts
const trackComponentShifts = (entry) => {
  if (!entry.sources || !entry.sources.length) return;
  
  for (const source of entry.sources) {
    if (!source.node) continue;
    
    // Try to find the closest containing component
    let node = source.node;
    let foundComponent = false;
    
    // Walk up the tree looking for component identifiers
    while (node && node !== document.documentElement) {
      // Store node identifiers for pattern matching
      const nodeId = node.id || '';
      const nodeClasses = node.className && typeof node.className === 'string' ? node.className : '';
      const dataAttrs = Array.from(node.attributes || [])
        .filter(attr => attr.name.startsWith('data-'))
        .map(attr => attr.name);
      
      // Common component pattern checks
      
      // Hero section
      if (nodeId === 'hero' || 
          node.hasAttribute('data-hero-section') ||
          nodeClasses.includes('hero')) {
        trackShift('hero', entry.value);
        foundComponent = true;
        break;
      }
      
      // Rotating text container
      if (node.hasAttribute('data-rotating-text') ||
          nodeClasses.includes('rotating-text-container')) {
        trackShift('rotating-text', entry.value);
        foundComponent = true;
        break;
      }
      
      // Search component tracking
      if (nodeClasses.includes('search-') || 
          nodeId.includes('search') || 
          dataAttrs.some(attr => attr.includes('search'))) {
        trackShift('search', entry.value);
        foundComponent = true;
        break;
      }
      
      // Blog component tracking
      if (nodeClasses.includes('blog-') || 
          nodeId.includes('blog') || 
          dataAttrs.some(attr => attr.includes('blog'))) {
        trackShift('blog', entry.value);
        foundComponent = true;
        break;
      }
      
      // Pricing component tracking
      if (nodeClasses.includes('pricing-') || 
          nodeId.includes('pricing') || 
          dataAttrs.some(attr => attr.includes('pricing'))) {
        trackShift('pricing', entry.value);
        foundComponent = true;
        break;
      }
      
      // Features component tracking
      if (nodeClasses.includes('feature') || 
          nodeId.includes('feature') || 
          dataAttrs.some(attr => attr.includes('feature'))) {
        trackShift('features', entry.value);
        foundComponent = true;
        break;
      }
      
      // How It Works component tracking
      if (nodeClasses.includes('how-it-works') || 
          nodeId.includes('how-it-works') || 
          dataAttrs.some(attr => attr.includes('how-it-works'))) {
        trackShift('how-it-works', entry.value);
        foundComponent = true;
        break;
      }
      
      // Mobile-specific component tracking
      if (nodeClasses.includes('mobile-') || 
          nodeId.includes('mobile') || 
          dataAttrs.some(attr => attr.includes('mobile'))) {
        trackShift('mobile-components', entry.value);
        foundComponent = true;
        break;
      }
      
      // Image-related component tracking
      if (node.tagName === 'IMG' || 
          nodeClasses.includes('image') || 
          nodeClasses.includes('img-') || 
          dataAttrs.some(attr => attr.includes('image'))) {
        trackShift('images', entry.value);
        foundComponent = true;
        break;
      }
      
      // Form-related component tracking
      if (node.tagName === 'FORM' || 
          nodeClasses.includes('form') || 
          dataAttrs.some(attr => attr.includes('form'))) {
        trackShift('forms', entry.value);
        foundComponent = true;
        break;
      }
      
      // Animations and transitions tracking
      if (nodeClasses.includes('animate-') || 
          nodeClasses.includes('transition') || 
          dataAttrs.some(attr => attr.includes('animation'))) {
        trackShift('animations', entry.value);
        foundComponent = true;
        break;
      }
      
      // Footer component tracking
      if (nodeClasses.includes('footer') || 
          nodeId === 'footer' || 
          node.tagName === 'FOOTER') {
        trackShift('footer', entry.value);
        foundComponent = true;
        break;
      }
      
      // Header component tracking
      if (nodeClasses.includes('header') || 
          nodeId === 'header' || 
          node.tagName === 'HEADER') {
        trackShift('header', entry.value);
        foundComponent = true;
        break;
      }
      
      // Continue up the tree
      node = node.parentNode;
    }
    
    // If no specific component was found, count as "other"
    if (!foundComponent) {
      trackShift('other', entry.value);
    }
  }
};

// Helper function to track component shifts
function trackShift(componentName, value) {
  if (!window.componentSpecificShifts[componentName]) {
    window.componentSpecificShifts[componentName] = 0;
  }
  window.componentSpecificShifts[componentName] += value;
}

// Export the tracking function for use in the main script
export default trackComponentShifts;