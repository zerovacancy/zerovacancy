// Simple script to verify FOUC prevention is working correctly
// Add this to your browser console to check if the implementation is effective

(function() {
  console.group('📝 FOUC Prevention Verification');
  
  // 1. Check if FOUCPrevention component is active
  const hasLoadingClass = document.documentElement.classList.contains('loading');
  console.log('🔍 Html has loading class:', hasLoadingClass ? '✅ Yes' : '❌ No');
  
  // 2. Check for the critical styles
  const foucStylesAdded = document.getElementById('fouc-prevention-styles');
  console.log('🔍 FOUC prevention styles added:', foucStylesAdded ? '✅ Yes' : '❌ No');
  
  // 3. Check for any heroparallax images
  const heroparallaxImages = document.querySelectorAll('[src*="heroparallax"]');
  console.log('🔍 Heroparallax images found:', heroparallaxImages.length === 0 ? '✅ None (good)' : `❌ ${heroparallaxImages.length} images (bad)`);
  
  // 4. Check for elements with heroparallax in style
  const heroparallaxStyles = document.querySelectorAll('[style*="heroparallax"]');
  console.log('🔍 Elements with heroparallax in style:', heroparallaxStyles.length === 0 ? '✅ None (good)' : `❌ ${heroparallaxStyles.length} elements (bad)`);
  
  // 5. Try to inject a test heroparallax image to verify blocking
  console.log('🧪 Testing heroparallax image blocking...');
  const testImage = document.createElement('img');
  testImage.src = '/heroparallax/heroparallax1.jpg';
  testImage.id = 'test-heroparallax-image';
  testImage.style.position = 'absolute';
  testImage.style.opacity = 1;
  testImage.style.zIndex = 9999;
  document.body.appendChild(testImage);
  
  // 6. Check if our test image was properly blocked
  setTimeout(() => {
    const testImageElement = document.getElementById('test-heroparallax-image');
    const isBlocked = !testImageElement || 
                      testImageElement.style.display === 'none' || 
                      testImageElement.style.visibility === 'hidden' ||
                      testImageElement.style.opacity === '0';
    
    console.log('🔍 Test heroparallax image blocked:', isBlocked ? '✅ Yes (good)' : '❌ No (bad)');
    
    // Cleanup test
    if (testImageElement && testImageElement.parentNode) {
      testImageElement.parentNode.removeChild(testImageElement);
    }
    
    // Overall verdict
    const allPassed = hasLoadingClass && foucStylesAdded && 
                      heroparallaxImages.length === 0 && 
                      heroparallaxStyles.length === 0 && 
                      isBlocked;
    
    console.log('📊 Overall FOUC prevention status:', allPassed ? 
      '✅ Working correctly!' : 
      '⚠️ Some issues detected, check details above');
    
    console.groupEnd();
  }, 500);
})();