// Quick performance optimizations that run immediately
(function() {
  // Check if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth < 768;
  
  // Create utility CSS variables for consistent spacing
  document.documentElement.style.setProperty('--mobile-section-spacing-y', '16px');
  document.documentElement.style.setProperty('--mobile-transition-height', '40px');
  document.documentElement.style.setProperty('--mobile-component-spacing', '8px');
  document.documentElement.style.setProperty('--mobile-element-spacing', '4px');
  
  // Set custom CSS variable for viewport height (fixes iOS issues)
  function setVhVariable() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Prevent horizontal scroll on mobile
    document.documentElement.style.width = '100%';
    document.documentElement.style.maxWidth = '100vw';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100vw';
    document.body.style.overflowX = 'hidden';
  }
  
  // Fix touchevents to improve responsiveness
  function fixTouchDelay() {
    if (isMobile) {
      // Add empty touchstart listener to fix 300ms delay
      document.addEventListener('touchstart', function() {}, {passive: true});
      
      // Add better touch action
      document.documentElement.style.touchAction = 'manipulation';
    }
  }
  
  // Add classes to help with conditional CSS
  function addDeviceClasses() {
    document.documentElement.classList.add(isMobile ? 'is-mobile' : 'is-desktop');
    
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      document.documentElement.classList.add('is-ios');
    } else if (/Android/.test(navigator.userAgent)) {
      document.documentElement.classList.add('is-android');
    }
  }
  
  // Fix section transitions and spacing
  function fixMobileLayout() {
    if (!isMobile) return;
    
    // Create a stylesheet for mobile-specific fixes
    const styleEl = document.createElement('style');
    styleEl.id = 'mobile-layout-fixes';
    styleEl.innerHTML = `
      /* Mobile layout fixes */
      @media (max-width: 767px) {
        /* Standardize section transitions */
        .section-transition, 
        [id*="transition"],
        [class*="scroll-target"] {
          height: var(--mobile-transition-height) !important;
          min-height: var(--mobile-transition-height) !important;
          max-height: var(--mobile-transition-height) !important;
          margin: 0 !important;
          padding: 0 !important;
          z-index: 10 !important;
          overflow: hidden !important;
        }
        
        /* Make carousel navigation easier to tap */
        [role="button"] {
          min-width: 60px;
          min-height: 60px;
          touch-action: manipulation;
        }
        
        /* Standardize section content spacing */
        section {
          padding-top: var(--mobile-section-spacing-y) !important;
          padding-bottom: var(--mobile-section-spacing-y) !important;
        }
        
        /* Carousel specific fixes */
        .embla {
          touch-action: pan-y !important;
          overflow-x: auto !important;
          overscroll-behavior-x: contain !important;
        }
        
        /* Fix z-index layering */
        section {
          z-index: auto !important;
          position: relative !important;
        }
        
        /* Override margin-top on mobile sections */
        section[class*="mt-"], 
        [class*="section"][class*="mt-"] {
          margin-top: 0 !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }
  
  // Run initial optimizations
  setVhVariable();
  fixTouchDelay();
  addDeviceClasses();
  fixMobileLayout();
  
  // Rerun on resize and orientation change
  window.addEventListener('resize', setVhVariable, {passive: true});
  window.addEventListener('orientationchange', setVhVariable, {passive: true});
  
  // Fix for carousel scrolling issues
  if (isMobile) {
    document.addEventListener('DOMContentLoaded', function() {
      // Find carousel elements and apply fixes
      const carouselElements = document.querySelectorAll('[class*="carousel"],[class*="embla"]');
      carouselElements.forEach(el => {
        el.classList.add('mobile-optimized-carousel');
        el.style.touchAction = 'pan-y';
        el.style.overscrollBehaviorX = 'contain';
        
        // Ensure nav buttons are big enough
        const navButtons = el.querySelectorAll('[role="button"]');
        navButtons.forEach(btn => {
          btn.classList.add('carousel-controls');
          btn.style.minWidth = '60px';
          btn.style.minHeight = '60px';
          btn.style.touchAction = 'manipulation';
        });
      });
    });
  }
})();