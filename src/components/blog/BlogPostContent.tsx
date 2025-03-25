import React from 'react';
import { BlogPost, BlogPostPreview } from '@/types/blog';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts?: BlogPostPreview[];
}

const BlogPostContent = ({ post, relatedPosts = [] }: BlogPostContentProps) => {
  const formattedDate = post.publishedAt 
    ? formatDate(post.publishedAt, { format: 'long' }) 
    : 'Draft';

  return (
    <article className="max-w-4xl mx-auto">
      {/* Tags at the top */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link 
              key={tag} 
              to={`/blog?tag=${encodeURIComponent(tag)}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-4">
          By {post.author?.name || 'Team Zero'} • {formattedDate}
        </div>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Display the excerpt if available */}
      {post.excerpt && (
        <div className="text-xl text-gray-600 italic mb-8 font-serif">
          {post.excerpt}
        </div>
      )}
      
      {/* Rich content display */}
      <div 
        className="prose prose-lg max-w-none mb-8 blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {/* Add style tag for consistent formatting between editor and published post */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Match editor and published content styles */
        .blog-content {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #374151;
          line-height: 1.6;
        }
        
        .blog-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        
        .blog-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          color: #111827;
        }
        
        .blog-content p {
          margin-top: 0;
          margin-bottom: 1.5rem;
        }
        
        /* Add extra space between paragraphs */
        .blog-content p + p {
          margin-top: 1.5rem;
        }
        
        .blog-content ul, .blog-content ol {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding-left: 2rem;
        }
        
        .blog-content ul {
          list-style-type: disc;
        }
        
        .blog-content ol {
          list-style-type: decimal;
        }
        
        .blog-content a {
          color: #7633DC;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #E5E7EB;
          margin-left: 0;
          margin-right: 0;
          padding-left: 1rem;
          font-style: italic;
          color: #6B7280;
        }
        
        .blog-content img {
          border-radius: 0.375rem;
          max-width: 100%;
          height: auto;
          margin: 1.5rem auto;
          display: block;
        }
        
        .blog-content hr {
          border: 0;
          height: 1px;
          background-color: #E5E7EB;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }
        
        /* Fix text alignments */
        .blog-content [style*="text-align: center"] {
          text-align: center !important;
          display: block;
        }
        
        .blog-content [style*="text-align: right"] {
          text-align: right !important;
          display: block;
        }
        
        .blog-content [style*="text-align: left"] {
          text-align: left !important;
          display: block;
        }
        
        /* Apply consistent paragraph spacing for editor-added classes */
        .blog-content .paragraph-spacing {
          margin-bottom: 1.5rem;
        }
        
        /* Support for newlines within paragraphs */
        .blog-content p br {
          display: block;
          content: "";
          margin-top: 0.75rem;
        }
        
        /* Extra spacing for empty paragraphs (created by double Enter) */
        .blog-content p:empty {
          min-height: 1.5rem;
          margin-bottom: 1.5rem;
        }
      `}} />
      
      {relatedPosts.length > 0 && (
        <div className="border-t pt-8">
          <h3 className="text-xl font-bold mb-4">Related Posts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <Link to={`/blog/${post.slug}`} className="hover:underline">
                  <h4 className="font-bold mb-2">{post.title}</h4>
                </Link>
                <p className="text-sm text-gray-600">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogPostContent;