import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { formatCanonicalURL } from '@/lib/utils';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImageAlt?: string;
  noindex?: boolean;
  structuredData?: object | object[];
  hreflang?: Array<{rel: string, hreflang: string, href: string}>;
  keywords?: string;
  author?: string;
}

export const helmetContext = {};

export const SEOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <HelmetProvider context={helmetContext}>{children}</HelmetProvider>;
};

const SEO: React.FC<SEOProps> = ({
  title = 'ZeroVacancy - AI-Driven Property Marketing & Content Creator Marketplace',
  description = 'Connect with elite content creators who transform your spaces into compelling visual stories',
  canonicalPath = '',
  ogImage = 'https://www.zerovacancy.ai/og-image-new.webp',
  ogType = 'website',
  ogImageAlt = 'ZeroVacancy - The premium marketplace for real estate content creators',
  noindex = false,
  structuredData,
  hreflang,
  keywords = 'property marketing, content creators, real estate photography, property staging, virtual staging',
  author = 'ZeroVacancy Team',
}) => {
  const canonical = formatCanonicalURL(canonicalPath);
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Mobile Optimization */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"
      />
      <meta name="theme-color" content="#ffffff" />
      
      {/* International Support (hreflang) */}
      {hreflang && hreflang.map((item, index) => (
        <link 
          key={`hreflang-${index}`}
          rel={item.rel}
          hrefLang={item.hreflang}
          href={item.href}
        />
      ))}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/webp" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content="ZeroVacancy" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Structured Data JSON-LD */}
      {structuredData && Array.isArray(structuredData) ? (
        structuredData.map((data, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(data)}
          </script>
        ))
      ) : structuredData ? (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      ) : null}
    </Helmet>
  );
};

export default SEO;
