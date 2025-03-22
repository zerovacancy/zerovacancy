import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BlogPostPreview } from '@/types/blog';
import BlogCard from './BlogCard';
import { BlogService } from '@/services/BlogService';

const FeaturedBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const featuredPosts = await BlogService.getFeaturedPosts(3);
        setPosts(featuredPosts);
      } catch (error) {
        console.error('Error fetching featured blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-4 sm:py-6 lg:py-8 bg-gray-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-purple-dark mb-4">
              Loading Latest Insights...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

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