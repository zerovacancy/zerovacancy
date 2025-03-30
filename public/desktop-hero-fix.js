// Desktop-Only Hero Animation Height Fix
(function() {
  // Only run this fix on desktop screens
  function isDesktop() {
    return window.innerWidth >= 769;
  }
  
  // Function to remove problematic height styles on desktop
  function fixDesktopAnimationHeights() {
    // Skip if not desktop
    if (!isDesktop()) return;
    
    // Remove min-height from animation classes
    document.querySelectorAll('.hero-fade-in, .hero-delay-100, .hero-delay-200').forEach(el => {
      if (el.style.minHeight === '500px') {
        el.style.removeProperty('min-height');
        el.style.height = 'auto';
      }
    });
    
    // Check specific containers that might have problematic heights
    document.querySelectorAll('.hero-wrapper, .hero-content, .hero-title-container, h1#hero-title').forEach(el => {
      if (el.style.minHeight === '500px') {
        el.style.removeProperty('min-height');
        el.style.height = 'auto';
      }
    });
    
    // Ensure rotating text container has proper height on desktop
    const rotatingTextContainer = document.querySelector('#hero-title > div');
    if (rotatingTextContainer) {
      rotatingTextContainer.style.height = '64px';
      rotatingTextContainer.style.minHeight = '64px';
      rotatingTextContainer.classList.add('desktop-text-container');
    }
  }
  
  // Run immediately if on desktop
  if (isDesktop()) {
    fixDesktopAnimationHeights();
    
    // Run again after animations might have completed
    setTimeout(fixDesktopAnimationHeights, 100);
    setTimeout(fixDesktopAnimationHeights, 500);
    setTimeout(fixDesktopAnimationHeights, 1500);
  }
  
  // Also run on window load if on desktop
  window.addEventListener('load', function() {
    if (isDesktop()) {
      fixDesktopAnimationHeights();
    }
  });
  
  // Create MutationObserver to catch any inline style changes on desktop
  const observer = new MutationObserver(mutations => {
    if (!isDesktop()) return;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        // If a style attribute was changed, check if min-height was set
        if (mutation.target.style && mutation.target.style.minHeight === '500px') {
          fixDesktopAnimationHeights();
        }
      }
    });
  });
  
  // Start observing once DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    if (isDesktop()) {
      document.querySelectorAll('.hero-wrapper, .hero-content, .hero-title-container, h1#hero-title').forEach(el => {
        observer.observe(el, { attributes: true, attributeFilter: ['style'] });
      });
    }
  });
  
  // Update on resize (in case user switches between mobile and desktop)
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (isDesktop()) {
        fixDesktopAnimationHeights();
      }
    }, 250);
  });
})();