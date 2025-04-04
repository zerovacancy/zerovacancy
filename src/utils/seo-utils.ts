/**
 * SEO utility functions for dynamic sitemap and metadata
 */

import fs from 'fs';
import path from 'path';
import { BlogService } from '../services/BlogService';

// Types for sitemap entries
type SitemapEntry = {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  images?: Array<{
    loc: string;
    title?: string;
    caption?: string;
  }>;
};

/**
 * Generates a sitemap XML string from an array of site entries
 * @param entries Array of sitemap entries
 * @param baseUrl Base URL of the site
 * @returns XML string for the sitemap
 */
export const generateSitemapXml = (entries: SitemapEntry[], baseUrl: string): string => {
  // XML header and opening tags
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" \n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  
  // Add each entry
  for (const entry of entries) {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${entry.loc}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    
    // Add images if present
    if (entry.images && entry.images.length > 0) {
      for (const image of entry.images) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${image.loc}</image:loc>\n`;
        if (image.title) {
          xml += `      <image:title>${image.title}</image:title>\n`;
        }
        if (image.caption) {
          xml += `      <image:caption>${image.caption}</image:caption>\n`;
        }
        xml += '    </image:image>\n';
      }
    }
    
    xml += '  </url>\n';
  }
  
  // Close the urlset tag
  xml += '</urlset>';
  
  return xml;
};

/**
 * Generates sitemap entries for blog posts
 * @returns Array of sitemap entries for blog posts
 */
export const generateBlogSitemapEntries = async (): Promise<SitemapEntry[]> => {
  try {
    // Get all published blog posts
    const posts = await BlogService.getAllPublishedPosts();
    if (!posts || !Array.isArray(posts)) {
      return [];
    }
    
    // Create sitemap entries for each post
    return posts.map(post => ({
      loc: `/blog/${post.slug}`,
      lastmod: post.updated_at || post.created_at,
      changefreq: 'weekly',
      priority: 0.8,
      images: post.featured_image ? [
        {
          loc: post.featured_image,
          title: post.title,
          caption: post.excerpt || `${post.title} - ZeroVacancy Blog Post`
        }
      ] : undefined
    }));
  } catch (error) {
    console.error('Error generating blog sitemap entries:', error);
    return [];
  }
};

/**
 * Writes the sitemap to a file
 * @param sitemapXml XML string for the sitemap
 * @param outputPath Path to write the sitemap file
 */
export const writeSitemapToFile = (sitemapXml: string, outputPath: string): void => {
  try {
    fs.writeFileSync(outputPath, sitemapXml, 'utf-8');
    console.log(`Sitemap written to ${outputPath}`);
  } catch (error) {
    console.error('Error writing sitemap to file:', error);
  }
};

/**
 * Generate dynamic sitemap based on current content
 * @param baseUrl Base URL of the site
 * @param outputPath Path to write the sitemap file
 */
export const generateDynamicSitemap = async (baseUrl: string, outputPath: string): Promise<void> => {
  // Static pages with fixed priorities
  const staticEntries: SitemapEntry[] = [
    {
      loc: '/',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 1.0,
      images: [
        {
          loc: `${baseUrl}/og-image-new.webp`,
          title: 'ZeroVacancy - Property Content Creators',
          caption: 'Connect with elite content creators who transform your spaces into compelling visual stories'
        }
      ]
    },
    {
      loc: '/blog',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.9,
      images: [
        {
          loc: `${baseUrl}/og-image-new.webp`,
          title: 'ZeroVacancy Blog - Property Marketing Insights',
          caption: 'Expert guides, tips and insights on property content creation'
        }
      ]
    },
    {
      loc: '/terms',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: '/account',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: '/payment-confirmation',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.3
    },
    {
      loc: '/connect/success',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.3
    },
    {
      loc: '/connect/onboarding',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.6
    }
  ];
  
  // Get dynamic entries from blog posts
  const blogEntries = await generateBlogSitemapEntries();
  
  // Combine all entries
  const allEntries = [...staticEntries, ...blogEntries];
  
  // Generate the sitemap XML
  const sitemapXml = generateSitemapXml(allEntries, baseUrl);
  
  // Write to file
  writeSitemapToFile(sitemapXml, outputPath);
};

/**
 * Optimize alt text for SEO
 * @param altText Original alt text
 * @param contextKeywords Optional array of keywords to include
 * @returns Optimized alt text
 */
export const optimizeImageAlt = (altText: string, contextKeywords?: string[]): string => {
  if (!altText) return '';
  
  // Truncate alt text if it's too long (125 chars is a good SEO practice)
  let optimized = altText.trim();
  if (optimized.length > 125) {
    optimized = optimized.substring(0, 122) + '...';
  }
  
  // Ensure it ends with a period if it's a complete sentence
  if (optimized.length > 30 && !optimized.endsWith('.') && !optimized.endsWith('?') && !optimized.endsWith('!')) {
    optimized += '.';
  }
  
  // Include keywords if provided and not already in alt text
  if (contextKeywords && contextKeywords.length > 0) {
    // Only add one main keyword if it's not already included
    const mainKeyword = contextKeywords[0];
    if (mainKeyword && optimized.toLowerCase().indexOf(mainKeyword.toLowerCase()) === -1) {
      // Only add if we're not making it too long
      if (optimized.length + mainKeyword.length + 3 <= 125) {
        optimized = `${mainKeyword} - ${optimized}`;
      }
    }
  }
  
  return optimized;
};

/**
 * Generate hreflang data for internationalization
 * @param url The current URL path (without domain)
 * @param langs Array of supported language codes (e.g., ['en', 'fr', 'es'])
 * @param baseUrl Base URL of the site
 * @returns Array of hreflang data to insert in head
 */
export const generateHreflangData = (url: string, langs: string[], baseUrl: string) => {
  return langs.map(lang => ({
    rel: 'alternate',
    hreflang: lang,
    href: `${baseUrl}/${lang}${url}`
  }));
};