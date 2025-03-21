import React from 'react';
import { Link } from 'react-router-dom';
import { BlogCategory } from '@/types/blog';

interface BlogCategoriesProps {
  categories: BlogCategory[];
  activeCategory?: string;
  variant?: 'buttons' | 'links' | 'pills';
}

const BlogCategories = ({ 
  categories, 
  activeCategory,
  variant = 'pills'
}: BlogCategoriesProps) => {
  
  if (variant === 'buttons') {
    return (
      <div className="flex flex-wrap gap-2">
        <Link 
          to="/blog" 
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors 
            ${!activeCategory ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/blog?category=${category.slug}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors 
              ${activeCategory === category.slug ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    );
  }
  
  if (variant === 'links') {
    return (
      <div className="space-y-2">
        <Link 
          to="/blog" 
          className={`block text-sm font-medium transition-colors 
            ${!activeCategory ? 'text-brand-purple' : 'text-gray-700 hover:text-brand-purple'}`}
        >
          All Posts
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/blog?category=${category.slug}`}
            className={`block text-sm font-medium transition-colors 
              ${activeCategory === category.slug ? 'text-brand-purple' : 'text-gray-700 hover:text-brand-purple'}`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    );
  }
  
  // Pills variant (default)
  return (
    <div className="flex flex-wrap gap-2">
      <Link 
        to="/blog" 
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors 
          ${!activeCategory 
            ? 'bg-brand-purple-medium text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/blog?category=${category.slug}`}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors 
            ${activeCategory === category.slug 
              ? 'bg-brand-purple-medium text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};

export default BlogCategories;