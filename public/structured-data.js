/**
 * Structured data injection script for SEO
 * This script adds JSON-LD structured data to pages where needed
 */

(function() {
  // Helper function to add schema markup to the page head
  function addStructuredData(data) {
    // Create a script element for JSON-LD data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
  
  // Get current page path
  const path = window.location.pathname;
  
  // Organization data (used on all pages)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ZeroVacancy",
    "url": "https://www.zerovacancy.ai",
    "logo": "https://www.zerovacancy.ai/logo.png",
    "sameAs": [
      // Add social media profiles when available
    ],
    "description": "Connect with elite content creators who transform your spaces into compelling visual stories"
  };
  
  // Add Organization schema to all pages
  addStructuredData(organizationSchema);
  
  // Homepage specific schema
  if (path === '/' || path === '') {
    const homepageSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://www.zerovacancy.ai",
      "name": "ZeroVacancy - Property Content Creators",
      "description": "Connect with elite content creators who transform your spaces into compelling visual stories",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.zerovacancy.ai/?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    };
    
    addStructuredData(homepageSchema);
  }
  
  // Blog page schema
  if (path === '/blog' || path.startsWith('/blog/')) {
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "url": "https://www.zerovacancy.ai/blog",
      "name": "ZeroVacancy Blog - Property Marketing Insights",
      "description": "Expert guides, tips and insights on property content creation"
    };
    
    addStructuredData(blogSchema);
    
    // Check if it's a specific blog post
    if (path.startsWith('/blog/') && path !== '/blog/') {
      // Try to extract data from page for blog post schema
      const title = document.querySelector('h1')?.textContent || document.title;
      const imageEl = document.querySelector('article img');
      const descriptionEl = document.querySelector('meta[name="description"]');
      
      const blogPostSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "url": window.location.href,
        "datePublished": document.querySelector('[data-post-date]')?.getAttribute('data-post-date') || "",
        "dateModified": document.querySelector('[data-post-modified]')?.getAttribute('data-post-modified') || "",
        "author": {
          "@type": "Person",
          "name": document.querySelector('[data-author-name]')?.textContent || "ZeroVacancy Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "ZeroVacancy",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.zerovacancy.ai/logo.png"
          }
        },
        "description": descriptionEl ? descriptionEl.getAttribute('content') : "",
        "image": imageEl ? imageEl.getAttribute('src') : ""
      };
      
      addStructuredData(blogPostSchema);
    }
  }
  
  // Breadcrumbs generation for all pages
  function generateBreadcrumbs() {
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length === 0) return null;
    
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.zerovacancy.ai"
      }
    ];
    
    // Build breadcrumb trail
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Format name from slug
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": index + 2, // +2 because we already have Home at position 1
        "name": name,
        "item": `https://www.zerovacancy.ai${currentPath}`
      });
    });
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    };
  }
  
  // Add breadcrumbs if we're not on the homepage
  if (path !== '/' && path !== '') {
    const breadcrumbs = generateBreadcrumbs();
    if (breadcrumbs) {
      addStructuredData(breadcrumbs);
    }
  }
})();