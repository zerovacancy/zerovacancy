import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import { BlogService } from '@/services/BlogService';
import { BlogCategory, BlogPostPreview } from '@/types/blog';
import BlogCard from '@/components/blog/BlogCard';
import BlogCategories from '@/components/blog/BlogCategories';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogSidebar from '@/components/blog/BlogSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

// Helper to parse query params
const useQueryParams = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

const Blog = () => {
  // State
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation and query params
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const categorySlug = queryParams.get('category') || '';
  const searchQuery = queryParams.get('search') || '';
  const tagFilter = queryParams.get('tag') || '';
  const currentPage = parseInt(queryParams.get('page') || '1', 10);
  
  const postsPerPage = 9;
  
  // Fetch posts based on current filters
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      try {
        const { posts, totalCount } = await BlogService.getPosts({
          category: categorySlug,
          search: searchQuery,
          tag: tagFilter,
          page: currentPage,
          limit: postsPerPage
        });
        
        setPosts(posts);
        setTotalPosts(totalCount);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [categorySlug, searchQuery, tagFilter, currentPage]);
  
  // Fetch categories and popular tags
  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          BlogService.getCategories(),
          BlogService.getPopularTags()
        ]);
        
        setCategories(categoriesData.categories);
        setPopularTags(tagsData);
      } catch (error) {
        console.error('Error fetching categories or tags:', error);
      }
    };
    
    fetchCategoriesAndTags();
  }, []);
  
  // Get popular posts for sidebar
  const [popularPosts, setPopularPosts] = useState<BlogPostPreview[]>([]);
  
  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const featuredPosts = await BlogService.getFeaturedPosts(3);
        setPopularPosts(featuredPosts);
      } catch (error) {
        console.error('Error fetching popular posts:', error);
      }
    };
    
    fetchPopularPosts();
  }, []);
  
  // Handlers
  const handleSearch = (query: string) => {
    navigate(`/blog?search=${encodeURIComponent(query)}`);
  };
  
  const handlePageChange = (page: number) => {
    // Preserve existing filters when changing page
    queryParams.set('page', page.toString());
    navigate(`/blog?${queryParams.toString()}`);
  };
  
  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // Create SEO title and description based on active filters
  const getSeoTitle = () => {
    if (categorySlug) {
      const categoryName = categories.find(c => c.slug === categorySlug)?.name || '';
      return `${categoryName} Articles | ZeroVacancy Blog`;
    }
    if (searchQuery) {
      return `Search results for "${searchQuery}" | ZeroVacancy Blog`;
    }
    if (tagFilter) {
      return `Articles tagged "${tagFilter}" | ZeroVacancy Blog`;
    }
    return `ZeroVacancy Blog | Real Estate Marketing Insights`;
  };

  const getSeoDescription = () => {
    if (categorySlug) {
      const categoryName = categories.find(c => c.slug === categorySlug)?.name || '';
      return `Browse our curated ${categoryName.toLowerCase()} articles and guides for property owners and real estate content creators.`;
    }
    if (searchQuery || tagFilter) {
      return `Filtered articles on property marketing, content creation, and real estate photography from ZeroVacancy experts.`;
    }
    return `Expert insights, strategies, and news for property managers and visual content creators in the real estate industry.`;
  };

  // Generate structured data for blog listing
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "ZeroVacancy Blog",
    "description": "Expert insights, strategies, and news for property managers and visual content creators",
    "url": "https://www.zerovacancy.ai/blog",
    "publisher": {
      "@type": "Organization",
      "name": "ZeroVacancy",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.zerovacancy.ai/logo.png"
      }
    }
  };

  return (
    <>
      <SEO 
        title={getSeoTitle()}
        description={getSeoDescription()}
        canonicalPath={`/blog${window.location.search}`}
        ogType="website"
        structuredData={structuredData}
      />
      <Header />
      
      <main className="pt-8 pb-16">
        {/* Page header */}
        <div className="bg-gradient-to-br from-brand-purple-light/30 to-white py-12 mb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center text-sm text-brand-text-light mb-4">
                <Link to="/" className="hover:text-brand-purple-medium">Home</Link>
                <ChevronRight size={16} className="mx-2" />
                <span className="text-brand-text-primary">Blog</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-brand-purple-dark mb-4">
                ZeroVacancy Blog
              </h1>
              <p className="text-brand-text-secondary text-lg max-w-2xl">
                Expert insights, strategies, and news for property managers and visual content creators.
              </p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main content */}
            <div className="flex-1">
              {/* Category filters (visible on mobile and desktop) */}
              <div className="mb-8 overflow-auto pb-2">
                <BlogCategories 
                  categories={categories}
                  activeCategory={categorySlug}
                />
              </div>
              
              {/* Current filter indicators */}
              {(searchQuery || tagFilter) && (
                <div className="mb-6 flex items-center flex-wrap gap-2">
                  <span className="text-brand-text-light">Filtering by:</span>
                  
                  {searchQuery && (
                    <div className="flex items-center gap-2 rounded-full bg-brand-purple-light/30 px-3 py-1 text-sm text-brand-purple-dark">
                      <span>Search: "{searchQuery}"</span>
                      <button 
                        onClick={() => {
                          queryParams.delete('search');
                          navigate(`/blog?${queryParams.toString()}`);
                        }}
                        className="font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  {tagFilter && (
                    <div className="flex items-center gap-2 rounded-full bg-brand-purple-light/30 px-3 py-1 text-sm text-brand-purple-dark">
                      <span>Tag: {tagFilter}</span>
                      <button 
                        onClick={() => {
                          queryParams.delete('tag');
                          navigate(`/blog?${queryParams.toString()}`);
                        }}
                        className="font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => navigate('/blog')}
                    className="text-sm text-brand-purple hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
              
              {/* Blog posts grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-pulse text-brand-purple-medium">
                    <BookOpen size={32} />
                  </div>
                  <span className="ml-2 text-brand-text-secondary">Loading articles...</span>
                </div>
              ) : posts.length > 0 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  <div className="mt-12">
                    <BlogPagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                  <h2 className="text-xl font-bold text-brand-purple-dark mb-2">No articles found</h2>
                  <p className="text-brand-text-secondary mb-6">
                    We couldn't find any articles matching your search criteria.
                  </p>
                  <button 
                    onClick={() => navigate('/blog')}
                    className="inline-flex items-center rounded-md bg-brand-purple px-4 py-2 text-sm font-medium text-white hover:bg-brand-purple-dark"
                  >
                    View all articles
                  </button>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-80 shrink-0">
              <BlogSidebar 
                categories={categories}
                popularPosts={popularPosts}
                popularTags={popularTags}
                activeCategory={categorySlug}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Blog;