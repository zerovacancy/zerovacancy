import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BlogPostPreview } from '@/types/blog';
import BlogCard from './BlogCard';
import { BlogService } from '@/services/BlogService';

const FeaturedBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchPosts = async () => {
      try {
        // Add a timeout to prevent infinite loading state
        const timeoutPromise = new Promise<BlogPostPreview[]>((_, reject) => {
          setTimeout(() => reject(new Error('Request timed out')), 8000);
        });
        
        // Race between the actual fetch and the timeout
        const featuredPosts = await Promise.race([
          BlogService.getFeaturedPosts(3),
          timeoutPromise
        ]);
        
        if (isMounted) {
          setPosts(featuredPosts);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching featured blog posts:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error fetching blog posts'));
          setLoading(false);
        }
      }
    };

    fetchPosts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-4 sm:py-6 lg:py-8 bg-gray-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-purple-dark mb-4">
              Loading Latest Insights...
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-brand-purple rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !posts) {
    return (
      <section className="py-4 sm:py-6 lg:py-8 bg-gray-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-purple-dark mb-4">
              Our Blog
            </h2>
            <p className="text-brand-text-secondary text-lg mb-6">
              Discover tips, strategies, and industry news
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center text-brand-purple font-medium hover:text-brand-purple-dark"
            >
              Visit our blog
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // No posts state
  if (posts.length === 0) {
    return (
      <section className="py-4 sm:py-6 lg:py-8 bg-gray-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-purple-dark mb-4">
              Our Blog
            </h2>
            <p className="text-brand-text-secondary text-lg mb-6">
              Stay tuned for new content
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center text-brand-purple font-medium hover:text-brand-purple-dark"
            >
              Visit our blog
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Success state with posts
  return (
    <section className="py-4 sm:py-6 lg:py-8 bg-gray-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-brand-purple-dark mb-4">
            Latest Insights for Property Managers
          </h2>
          <p className="text-brand-text-secondary text-lg">
            Discover tips, strategies, and industry news to elevate your property marketing.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center text-brand-purple font-medium hover:text-brand-purple-dark"
          >
            View all articles
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogPosts;