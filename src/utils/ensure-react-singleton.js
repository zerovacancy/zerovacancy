/**
 * Force React Singleton Usage
 * Injects these lines at the top of the app to ensure React hooks work properly
 */

import React from 'react';
import ReactDOM from 'react-dom';

// Explicitly set these on window to enforce singleton
window.__REACT_SINGLETON__ = window.__REACT_SINGLETON__ || React;
window.__REACT_DOM_SINGLETON__ = window.__REACT_DOM_SINGLETON__ || ReactDOM;

// Override global React with our singleton instance
const originalCreateElement = React.createElement;
React.createElement = function() {
  // Ensure we're using the singleton instance
  if (this !== window.__REACT_SINGLETON__) {
    return originalCreateElement.apply(window.__REACT_SINGLETON__, arguments);
  }
  return originalCreateElement.apply(this, arguments);
};

// Export singletons
export { React, ReactDOM };
export default React;
