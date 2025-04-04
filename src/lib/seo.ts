/**
 * SEO utility functions and data
 */

// Base structured data for organization
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ZeroVacancy",
  "url": "https://www.zerovacancy.ai",
  "logo": "https://www.zerovacancy.ai/logo.png",
  "description": "Connect with elite content creators who transform your spaces into compelling visual stories",
  "sameAs": [
    // Add social media profiles when available
  ]
};

// Homepage structured data
export const homepageSchema = {
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

// Creator profile structured data generator
export const generateCreatorSchema = (creator: {
  name: string;
  description: string;
  image: string;
  rating?: number;
  profileUrl: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": creator.name,
    "description": creator.description,
    "image": creator.image,
    "url": creator.profileUrl,
    ...(creator.rating && { "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": creator.rating,
      "bestRating": "5",
      "worstRating": "1"
    }}),
    "jobTitle": "Content Creator",
    "worksFor": {
      "@type": "Organization",
      "name": "ZeroVacancy"
    }
  };
};

// Service structured data
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Property Content Creation",
  "provider": {
    "@type": "Organization",
    "name": "ZeroVacancy",
    "url": "https://www.zerovacancy.ai"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "description": "Elite property content creation services for real estate and property management.",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock"
  }
};

// FAQ Page structured data
export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Breadcrumb structured data
export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

// Property listing structured data generator
export const generatePropertyListingSchema = (property: {
  name: string;
  description: string;
  image: string;
  address: string;
  price?: string;
  amenities?: string[];
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.name,
    "description": property.description,
    "image": property.image,
    "url": property.url,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address
    },
    ...(property.price && { "price": property.price }),
    ...(property.amenities && { "amenityFeature": property.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    }))})    
  };
};
