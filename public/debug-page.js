// Simple script to diagnose blank page issues
console.log('Debug page script loaded');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded');
  console.log('Root element:', document.getElementById('root'));
  console.log('Loading class present:', document.documentElement.classList.contains('loading'));
  
  // Check if React is attaching to the DOM
  setTimeout(function() {
    console.log('After timeout - root content:', document.getElementById('root').innerHTML);
    
    if (document.getElementById('root').innerHTML === '') {
      console.log('Root is still empty - potential React mounting issue');
    } else {
      console.log('Content found in root - React appears to be working');
    }
  }, 3000);
});

// Watch for errors
window.addEventListener('error', function(event) {
  console.log('Caught error:', event.message);
});