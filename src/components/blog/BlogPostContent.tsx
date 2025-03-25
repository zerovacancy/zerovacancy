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
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>
      
      {/* Display the excerpt if available */}
      {post.excerpt && (
        <div className="text-xl text-gray-600 italic mb-8 font-serif">
          {post.excerpt}
        </div>
      )}
      
      {/* Rich content display */}
      <div 
        className="prose prose-lg max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
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