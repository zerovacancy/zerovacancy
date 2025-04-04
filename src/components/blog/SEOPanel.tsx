import React, { useState, useEffect } from 'react';
import { Search, Globe, Share2, AlertCircle, Check, XCircle, Info, Star, Lightbulb } from 'lucide-react';

interface SEOPanelProps {
  title: string;
  description: string;
  slug: string;
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  baseUrl?: string;
  suggestedKeywords?: string[];
}

const SEOPanel: React.FC<SEOPanelProps> = ({
  title,
  description,
  slug,
  onTitleChange,
  onDescriptionChange,
  baseUrl = 'https://zerovacancy.ai/blog',
  suggestedKeywords = ['property marketing', 'real estate content', 'property photography', 'content creation']
}) => {
  // Character limits
  const TITLE_MAX_LENGTH = 60;
  const DESCRIPTION_MAX_LENGTH = 160;
  
  // Local state for editing
  const [seoTitle, setSeoTitle] = useState(title);
  const [seoDescription, setSeoDescription] = useState(description);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  
  // Track character counts
  const titleCharCount = seoTitle.length;
  const descriptionCharCount = seoDescription.length;
  
  // Update title function
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSeoTitle(newValue);
    if (onTitleChange) {
      onTitleChange(newValue);
    }
  };
  
  // Update description function
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setSeoDescription(newValue);
    if (onDescriptionChange) {
      onDescriptionChange(newValue);
    }
  };
  
  // Validate SEO fields
  useEffect(() => {
    const issues: string[] = [];
    
    // Title validation
    if (!seoTitle) {
      issues.push('Title is missing - search engines require a title');
    } else if (seoTitle.length < 10) {
      issues.push('Title is too short (should be at least 10 characters)');
    } else if (seoTitle.length > TITLE_MAX_LENGTH) {
      issues.push(`Title is too long (${seoTitle.length}/${TITLE_MAX_LENGTH} characters)`);
    }
    
    // Description validation
    if (!seoDescription) {
      issues.push('Meta description is missing - this affects click-through rates');
    } else if (seoDescription.length < 50) {
      issues.push('Meta description is too short (should be at least 50 characters)');
    } else if (seoDescription.length > DESCRIPTION_MAX_LENGTH) {
      issues.push(`Meta description is too long (${seoDescription.length}/${DESCRIPTION_MAX_LENGTH} characters)`);
    }
    
    // Keyword validation (basic)
    if (seoTitle && seoDescription) {
      // Check if title keywords are in description for consistency
      const titleWords = seoTitle.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const descriptionText = seoDescription.toLowerCase();
      const missingKeywords = titleWords.filter(word => !descriptionText.includes(word));
      
      if (missingKeywords.length > 0 && missingKeywords.length <= 3) {
        issues.push(`Key terms from title missing in description: ${missingKeywords.join(', ')}`);
      }
    }
    
    // Slug validation
    if (!slug) {
      issues.push('URL slug is missing');
    } else if (slug.includes(' ')) {
      issues.push('URL slug should not contain spaces');
    } else if (slug.length > 50) {
      issues.push('URL slug is too long (keep under 50 characters)');
    }
    
    setValidationIssues(issues);
  }, [seoTitle, seoDescription, slug, TITLE_MAX_LENGTH, DESCRIPTION_MAX_LENGTH]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Search size={18} className="text-brand-purple" />
        <h3 className="text-sm font-semibold text-gray-900">SEO & Search Preview</h3>
      </div>
      
      {/* Search preview */}
      <div className="mb-6 border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center text-xs text-gray-500">
          <Globe size={14} className="mr-1" />
          Search Engine Result Preview
        </div>
        <div className="p-3">
          <div className="text-blue-600 text-base font-medium truncate">
            {seoTitle || title || 'No title provided'}
          </div>
          <div className="text-green-700 text-xs mt-1 truncate">
            {baseUrl}/{slug || 'no-slug-provided'}
          </div>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {seoDescription || description || 'No description provided. Search engines will try to generate a description from your content, but it may not represent your post well.'}
          </p>
        </div>
      </div>
      
      {/* SEO fields */}
      <div className="space-y-4">
        {/* Title field */}
        <div>
          <div className="flex justify-between">
            <label htmlFor="seo-title" className="block text-sm font-medium text-gray-700">
              SEO Title
            </label>
            <span 
              className={`text-xs ${
                titleCharCount > TITLE_MAX_LENGTH ? 'text-red-500 font-medium' : 'text-gray-500'
              }`}
            >
              {titleCharCount}/{TITLE_MAX_LENGTH}
            </span>
          </div>
          <input
            type="text"
            id="seo-title"
            value={seoTitle}
            onChange={handleTitleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm ${
              titleCharCount > TITLE_MAX_LENGTH 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-brand-purple focus:border-brand-purple'
            }`}
            placeholder="Title for search engines (defaults to post title)"
          />
          <p className="mt-1 text-xs text-gray-500">
            This appears as the clickable headline in search results
          </p>
        </div>
        
        {/* Description field */}
        <div>
          <div className="flex justify-between">
            <label htmlFor="seo-description" className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <span 
              className={`text-xs ${
                descriptionCharCount > DESCRIPTION_MAX_LENGTH ? 'text-red-500 font-medium' : 'text-gray-500'
              }`}
            >
              {descriptionCharCount}/{DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="seo-description"
            value={seoDescription}
            onChange={handleDescriptionChange}
            rows={3}
            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm ${
              descriptionCharCount > DESCRIPTION_MAX_LENGTH 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-brand-purple focus:border-brand-purple'
            }`}
            placeholder="Description that appears in search results (defaults to post excerpt)"
          />
          <p className="mt-1 text-xs text-gray-500">
            The description influences click-through rates from search results
          </p>
        </div>
        
        {/* Social sharing preview - simplified version */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex gap-2 items-center mb-2">
            <Share2 size={14} className="text-gray-500" />
            <h4 className="text-xs font-medium text-gray-700">Social Sharing</h4>
          </div>
          <p className="text-xs text-gray-600">
            Social platforms will use the same title and description for sharing, along with the featured image.
          </p>
        </div>
        
        {/* Validation issues */}
        {validationIssues.length > 0 && (
          <div className="pt-3 border-t border-gray-200 mt-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <div className="flex gap-2 items-center mb-2">
                <AlertCircle size={14} className="text-amber-500" />
                <h4 className="text-xs font-medium text-amber-800">SEO Improvement Suggestions</h4>
              </div>
              <ul className="text-xs text-amber-700 list-disc ml-5 space-y-1">
                {validationIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Best practices */}
        {validationIssues.length === 0 && (
          <div className="pt-3 border-t border-gray-200 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex gap-2 items-center">
                <Check size={14} className="text-green-500" />
                <h4 className="text-xs font-medium text-green-800">Your SEO looks good!</h4>
              </div>
            </div>
          </div>
        )}
        
        {/* Keyword suggestions */}
        <div className="pt-3 border-t border-gray-200 mt-4">
          <div className="flex gap-2 items-center mb-2">
            <Lightbulb size={14} className="text-amber-500" />
            <h4 className="text-xs font-medium text-gray-700">Suggested Keywords</h4>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestedKeywords.map((keyword, index) => (
              <div 
                key={index}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 cursor-pointer transition-colors duration-200"
                onClick={() => {
                  // Check if keyword is in title or description
                  const titleContains = seoTitle.toLowerCase().includes(keyword.toLowerCase());
                  const descriptionContains = seoDescription.toLowerCase().includes(keyword.toLowerCase());
                  
                  // If not in title and there's room, suggest adding to title
                  if (!titleContains && (seoTitle.length + keyword.length + 3) <= TITLE_MAX_LENGTH) {
                    if (confirm(`Add "${keyword}" to your SEO title?`)) {
                      const newTitle = `${seoTitle}${seoTitle ? ' - ' : ''}${keyword}`;
                      setSeoTitle(newTitle);
                      if (onTitleChange) onTitleChange(newTitle);
                    }
                  }
                  // If not in description and there's room, suggest adding to description
                  else if (!descriptionContains && (seoDescription.length + keyword.length + 3) <= DESCRIPTION_MAX_LENGTH) {
                    if (confirm(`Add "${keyword}" to your meta description?`)) {
                      const newDesc = `${seoDescription}${seoDescription ? '. ' : ''}Learn more about ${keyword}.`;
                      setSeoDescription(newDesc);
                      if (onDescriptionChange) onDescriptionChange(newDesc);
                    }
                  }
                  // If already in both, show that it's being used
                  else if (titleContains && descriptionContains) {
                    alert(`"${keyword}" is already used in both your title and description. Great job!`);
                  }
                  // If in one but not the other with no room, alert user
                  else {
                    alert(`There's not enough space to add "${keyword}". Try shortening your title or description first.`);
                  }
                }}
              >
                {keyword}
                {seoTitle.toLowerCase().includes(keyword.toLowerCase()) && 
                 seoDescription.toLowerCase().includes(keyword.toLowerCase()) && 
                  <span className="ml-1 text-green-500">✓</span>
                }
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Click on a keyword to add it to your title or description. Keywords used in both get better rankings.
          </p>
        </div>
        
        {/* Structured data preview */}
        <div className="pt-3 border-t border-gray-200 mt-4">
          <div className="flex gap-2 items-center mb-2">
            <Info size={14} className="text-blue-500" />
            <h4 className="text-xs font-medium text-gray-700">Structured Data</h4>
          </div>
          <p className="text-xs text-gray-600">
            Your post will include BlogPosting structured data for better search engine visibility and rich results.
          </p>
          <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 text-xs font-mono overflow-auto max-h-24">
            {`{
  "@type": "BlogPosting",
  "headline": "${seoTitle || title}",
  "description": "${seoDescription || description}",
  "url": "${baseUrl}/${slug}"
}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOPanel;