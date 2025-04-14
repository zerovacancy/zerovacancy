// vite-react-singleton.js
// This plugin ensures only one copy of React is used

import path from 'path';

export default function reactSingleton() {
  return {
    name: 'vite-plugin-react-singleton',
    
    // Configure React modules
    config(config) {
      const projectRoot = process.cwd();
      const singletonPath = path.resolve(projectRoot, 'src/utils/react-singleton.js');
      
      // Ensure resolve.alias exists
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      
      // Add React singleton aliases with absolute path
      Object.assign(config.resolve.alias, {
        'react': singletonPath,
        'react-dom': singletonPath,
        'react-dom/client': singletonPath
      });
      
      // Make sure these modules are pre-bundled
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      
      if (!config.optimizeDeps.include.includes('react')) {
        config.optimizeDeps.include.push('react');
      }
      
      if (!config.optimizeDeps.include.includes('react-dom')) {
        config.optimizeDeps.include.push('react-dom');
      }
      
      return config;
    }
  };
}
