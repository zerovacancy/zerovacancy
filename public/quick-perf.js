// Quick performance optimizations that run immediately
(function() {
  // Check if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth < 768;
  
  // Set custom CSS variable for viewport height (fixes iOS issues)
  function setVhVariable() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // Fix touchevents to improve responsiveness
  function fixTouchDelay() {
    if (isMobile) {
      // Add empty touchstart listener to fix 300ms delay
      document.addEventListener('touchstart', function() {}, {passive: true});
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
  
  // Run initial optimizations
  setVhVariable();
  fixTouchDelay();
  addDeviceClasses();
  
  // Rerun on resize and orientation change
  window.addEventListener('resize', setVhVariable, {passive: true});
  window.addEventListener('orientationchange', setVhVariable, {passive: true});
})();