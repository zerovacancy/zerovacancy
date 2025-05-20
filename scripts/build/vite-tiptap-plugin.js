// vite-tiptap-plugin.js
// This plugin helps resolve TipTap dependencies to prevent timeout issues

export default function viteTipTapPlugin() {
  return {
    name: 'vite-plugin-tiptap-resolver',
    
    // Pre-bundle TipTap dependencies to prevent optimization timeouts
    config(config) {
      // Ensure optimizeDeps includes TipTap packages
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      
      // Add TipTap dependencies for pre-bundling
      const tiptapDeps = [
        '@tiptap/react',
        '@tiptap/core',
        '@tiptap/starter-kit',
        '@tiptap/extension-image',
        '@tiptap/extension-link',
        '@tiptap/extension-placeholder',
        '@tiptap/extension-text-align',
        '@tiptap/extension-table',
        '@tiptap/extension-table-row',
        '@tiptap/extension-table-cell',
        '@tiptap/extension-table-header',
        '@tiptap/extension-code-block'
      ];
      
      // Add dependencies to optimization list
      config.optimizeDeps.include = [
        ...config.optimizeDeps.include,
        ...tiptapDeps
      ];
      
      // Increase timeout for dependency optimization
      config.optimizeDeps.timeout = 60000; // 60 seconds
      
      return config;
    },
    
    // Handle resolve for TipTap modules to ensure they're found
    resolveId(id) {
      if (id.startsWith('@tiptap/')) {
        // Let Vite know we're interested in handling TipTap modules
        return { id, external: false };
      }
      return null;
    }
  };
}