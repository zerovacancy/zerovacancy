/**
 * SEO utility functions for optimization
 */

interface ImageConfig {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string;
}

// Generate image objects for structured data
export function generateImageObject(config: ImageConfig) {
  return {
    "@type": "ImageObject",
    "url": config.url,
    ...(config.width && { "width": config.width }),
    ...(config.height && { "height": config.height }),
    ...(config.alt && { "name": config.alt }),
    ...(config.type && { "encodingFormat": config.type })
  };
}

// Generate optimized image URLs with dimensions
export function getResponsiveImageUrl(baseUrl: string, dimensions: {width: number, height: number}): string {
  // If the URL already has parameters, append to them
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}w=${dimensions.width}&h=${dimensions.height}&fit=crop&auto=format`;
}

// Create breadcrumb structured data
export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Add hreflang links for international SEO if needed
export const generateHreflangData = (path: string, languages: string[] = ['en-us']) => {
  return languages.map(lang => {
    const langCode = lang.split('-')[0];
    return {
      rel: "alternate",
      hreflang: lang,
      href: `https://www.zerovacancy.ai${langCode !== 'en' ? `/${langCode}` : ''}${path}`
    };
  });
};

// Optimize image alt text
export function optimizeImageAlt(alt: string, context?: string): string {
  if (!alt || alt === '') {
    return context ? 
      `ZeroVacancy - ${context}` : 
      'ZeroVacancy - Property content creation marketplace';
  }
  
  // Ensure alt text isn't too long
  if (alt.length > 125) {
    return alt.substring(0, 125).trim() + '...';
  }
  
  return alt;
}