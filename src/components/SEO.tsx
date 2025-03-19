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
}

export const helmetContext = {};

export const SEOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <HelmetProvider context={helmetContext}>{children}</HelmetProvider>;
};

const SEO: React.FC<SEOProps> = ({
  title = 'Property Content Creators',
  description = 'Connect with elite content creators who transform your spaces into compelling visual stories',
  canonicalPath = '',
  ogImage = 'https://www.zerovacancy.ai/og-image-new.png',
  ogType = 'website',
  ogImageAlt = 'ZeroVacancy - The premium marketplace for real estate content creators',
  noindex = false,
  structuredData,
}) => {
  const canonical = formatCanonicalURL(canonicalPath);
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content="ZeroVacancy" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      
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
