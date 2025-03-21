import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import { BlogService } from '@/services/BlogService';
import { BlogPost as BlogPostType } from '@/types/blog';
import BlogPostContent from '@/components/blog/BlogPostContent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      
      try {
        const response = await BlogService.getPostBySlug(slug);
        
        if (!response) {
          // Post not found, redirect to blog index
          navigate('/blog', { replace: true });
          return;
        }
        
        setPost(response.post);
        setRelatedPosts(response.related || []);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        navigate('/blog', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug, navigate]);
  
  if (loading) {
    return (
      <>
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-16">
              <div className="animate-pulse text-brand-purple-medium">
                <BookOpen size={48} />
              </div>
              <span className="ml-3 text-lg text-brand-text-secondary">Loading article...</span>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!post) {
    return (
      <>
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 rounded-xl p-12 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-brand-purple-dark mb-3">Article Not Found</h2>
              <p className="text-brand-text-secondary mb-6">
                We couldn't find the article you're looking for. It may have been moved or deleted.
              </p>
              <Link 
                to="/blog"
                className="inline-flex items-center rounded-md bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
              >
                Browse all articles
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // Generate structured data for blog post
  const createStructuredData = () => {
    if (!post) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt || "",
      "image": post.cover_image || "https://www.zerovacancy.ai/og-image-new.png",
      "datePublished": post.published_at,
      "dateModified": post.updated_at,
      "author": {
        "@type": "Person",
        "name": post.author.name
      },
      "publisher": {
        "@type": "Organization",
        "name": "ZeroVacancy",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.zerovacancy.ai/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.zerovacancy.ai/blog/${post.slug}`
      }
    };
  };

  return (
    <>
      {post && (
        <SEO
          title={`${post.title} | ZeroVacancy Blog`}
          description={post.excerpt || `Read our expert insights on ${post.title}`}
          canonicalPath={`/blog/${post.slug}`}
          ogImage={post.cover_image || "https://www.zerovacancy.ai/og-image-new.png"}
          ogType="article"
          structuredData={createStructuredData()}
        />
      )}
      <Header />
      
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-brand-text-light mb-8">
            <Link to="/" className="hover:text-brand-purple-medium">Home</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link to="/blog" className="hover:text-brand-purple-medium">Blog</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link 
              to={`/blog?category=${post.category.slug}`} 
              className="hover:text-brand-purple-medium"
            >
              {post.category.name}
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-brand-text-primary truncate max-w-[200px]">{post.title}</span>
          </div>
          
          {/* Blog post content */}
          <BlogPostContent post={post} relatedPosts={relatedPosts} />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogPost;