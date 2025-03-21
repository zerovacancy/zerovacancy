import React from 'react';
import { BlogPost, BlogPostPreview } from '@/types/blog';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts?: BlogPostPreview[];
}

const BlogPostContent = ({ post, relatedPosts = [] }: BlogPostContentProps) => {
  const formattedDate = formatDate(post.publishedAt, { format: 'long' });

  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-4">
          By {post.author.name} • {formattedDate}
        </div>
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>
      
      <div className="prose prose-lg max-w-none mb-8">
        {/* Simple content display without ReactMarkdown */}
        {post.content.split('\n').map((paragraph, index) => {
          if (paragraph.trim().startsWith('#')) {
            // Handle headings
            const level = paragraph.match(/^#+/)[0].length;
            const text = paragraph.replace(/^#+\s+/, '');
            
            switch(level) {
              case 1:
                return <h1 key={index} className="text-3xl font-bold my-4">{text}</h1>;
              case 2:
                return <h2 key={index} className="text-2xl font-bold my-3">{text}</h2>;
              case 3:
                return <h3 key={index} className="text-xl font-bold my-2">{text}</h3>;
              default:
                return <h4 key={index} className="text-lg font-bold my-2">{text}</h4>;
            }
          } else if (paragraph.trim()) {
            // Regular paragraph
            return <p key={index} className="my-4">{paragraph}</p>;
          }
          return null;
        })}
      </div>
      
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