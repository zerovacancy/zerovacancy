import React from 'react';
import { Link } from 'react-router-dom';
import { Hash } from 'lucide-react';
import BlogSearch from './BlogSearch';
import BlogCategories from './BlogCategories';
import BlogCard from './BlogCard';
import { BlogCategory, BlogPostPreview } from '@/types/blog';

interface BlogSidebarProps {
  categories: BlogCategory[];
  popularPosts: BlogPostPreview[];
  popularTags: string[];
  activeCategory?: string;
  onSearch: (query: string) => void;
}

const BlogSidebar = ({ 
  categories, 
  popularPosts, 
  popularTags,
  activeCategory,
  onSearch 
}: BlogSidebarProps) => {
  return (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="mb-3 text-lg font-bold text-brand-purple-dark">Search</h3>
        <BlogSearch onSearch={onSearch} />
      </div>
      
      {/* Categories */}
      <div>
        <h3 className="mb-3 text-lg font-bold text-brand-purple-dark">Categories</h3>
        <BlogCategories 
          categories={categories} 
          activeCategory={activeCategory} 
          variant="links" 
        />
      </div>
      
      {/* Popular Posts */}
      <div>
        <h3 className="mb-3 text-lg font-bold text-brand-purple-dark">Popular Posts</h3>
        <div className="space-y-4">
          {popularPosts.map(post => (
            <BlogCard 
              key={post.id} 
              post={post}
              variant="compact"
            />
          ))}
        </div>
      </div>
      
      {/* Tags */}
      <div>
        <h3 className="mb-3 text-lg font-bold text-brand-purple-dark">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <Link
              key={tag}
              to={`/blog?tag=${tag}`}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
            >
              <Hash size={12} className="mr-1" />
              {tag}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Newsletter Signup */}
      <div className="rounded-xl bg-brand-purple-light/30 p-4">
        <h3 className="mb-2 text-lg font-bold text-brand-purple-dark">Subscribe to Our Newsletter</h3>
        <p className="mb-3 text-sm text-brand-text-secondary">Stay updated with the latest in property marketing.</p>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-brand-purple py-2 text-sm font-medium text-white transition-colors hover:bg-brand-purple-dark"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogSidebar;