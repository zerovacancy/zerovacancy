// vite-env-injector.js - Injects environment variables into HTML at build time
export function environmentInjectorPlugin() {
  return {
    name: 'vite-env-injector',
    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        // Create a script that defines env variables in the window object
        const script = `
          <script>
            window.env = window.env || {};
            window.env.VITE_SUPABASE_URL = "${process.env.VITE_SUPABASE_URL || 'https://pozblfzhjqlsxkakhowp.supabase.co'}";
            window.env.VITE_SUPABASE_ANON_KEY = "${process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM'}";
          </script>
        `;
        return html.replace('</head>', `${script}</head>`);
      }
    }
  };
}