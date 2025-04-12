import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  Filter, 
  Calendar, 
  User,
  X,
  Tag, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';
import { BlogService } from '@/services/BlogService';
import { BlogPostPreview, BlogPostsFilters, BlogCategory } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import SEO from '@/components/SEO';
import { useAuth } from '@/components/auth/AuthContext';
import AdminErrorFallback from '@/components/admin/AdminErrorFallback';

const BlogAdmin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BlogPostsFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const postsPerPage = 10;
  
  // Check admin access
  useEffect(() => {
    // Wait until auth state is loaded
    if (!authLoading) {
      const adminToken = sessionStorage.getItem('adminAccessToken');
      
      // If not authenticated or no admin token, redirect to login
      if (!isAuthenticated || adminToken !== 'granted') {
        navigate('/admin/login');
      }
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  // Load posts and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts with current filters and pagination
        const { posts, totalCount } = await BlogService.getAdminPosts({
          ...filters,
          page: currentPage,
          limit: postsPerPage
        });
        
        setPosts(posts);
        setTotalPosts(totalCount);
        
        // Fetch categories for filtering
        const { categories } = await BlogService.getCategories();
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch data if authenticated
    if (isAuthenticated) {
      fetchData();
    }
  }, [currentPage, filters, isAuthenticated]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery }));
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle category filter
  const handleCategoryFilter = (slug: string) => {
    setFilters(prev => ({ ...prev, category: slug }));
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status: status === 'all' ? undefined : status }));
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle post deletion
  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await BlogService.deletePost(id);
        // Refresh the post list
        const { posts, totalCount } = await BlogService.getAdminPosts({
          ...filters,
          page: currentPage,
          limit: postsPerPage
        });
        
        setPosts(posts);
        setTotalPosts(totalCount);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };
  
  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // Get status badge color and text
  const getStatusInfo = (post: BlogPostPreview) => {
    // For drafts
    if (!post.publishedAt) {
      return {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Draft'
      };
    }
    
    // Check if this is a scheduled post (future publish date)
    const publishDate = new Date(post.publishedAt);
    const now = new Date();
    
    if (publishDate > now) {
      return {
        color: 'bg-blue-100 text-blue-800',
        text: 'Scheduled'
      };
    }
    
    // Regular published post
    return {
      color: 'bg-green-100 text-green-800',
      text: 'Published'
    };
  };
  
  // AdminContent component to render content directly
  const AdminContent = () => (
    <>
      <SEO
        title="Blog Management | ZeroVacancy Admin"
        description="Manage blog posts, categories, and content"
        noindex={true}
      />
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 w-full overflow-auto">
        {/* Remove duplicate heading as we already have one in the header */}
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-purple"
              >
                <Search size={16} />
              </button>
            </div>
          </form>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-gray-500 flex items-center whitespace-nowrap">
              <Filter size={16} className="mr-1" />
              <span className="hidden sm:inline">Filter:</span>
            </span>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple"
              value={filters.category || ''}
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple"
              value={filters.status || 'all'}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
            
            {(filters.search || filters.category || filters.status) && (
              <button
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700 flex items-center whitespace-nowrap text-sm"
              >
                <X size={14} className="mr-1" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Posts table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="w-full">
            <div className="w-full overflow-x-auto max-w-full">
              <table className="min-w-full w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12 hidden sm:table-cell">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12 hidden md:table-cell">
                      Author
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12 hidden sm:table-cell">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start w-full">
                          <FileText size={18} className="text-gray-400 mr-3 flex-shrink-0 mt-1" />
                          <div className="min-w-0 flex-1 w-full">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {post.excerpt}
                            </div>
                            {/* Show category on mobile */}
                            <div className="text-xs text-indigo-700 mt-1 sm:hidden">
                              {post.category.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {post.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center">
                          {post.author.avatar ? (
                            <img 
                              src={post.author.avatar} 
                              alt={post.author.name} 
                              className="w-6 h-6 rounded-full mr-2"
                            />
                          ) : (
                            <User size={18} className="text-gray-400 mr-2" />
                          )}
                          <span className="text-sm text-gray-900">{post.author.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const { color, text } = getStatusInfo(post);
                          return (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                              {text}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="mr-1 text-gray-400" />
                          {(() => {
                            if (!post.publishedAt) {
                              return 'Not published';
                            }
                            
                            const publishDate = new Date(post.publishedAt);
                            const now = new Date();
                            
                            if (publishDate > now) {
                              return `Scheduled for ${formatDate(post.publishedAt, { format: 'short' })}`;
                            }
                            
                            return formatDate(post.publishedAt, { format: 'short' });
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View"
                            target="_blank"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            to={`/admin/blog/edit/${post.id}`}
                            className="text-amber-600 hover:text-amber-900"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-gray-700 text-center sm:text-left">
                  Showing <span className="font-medium">{(currentPage - 1) * postsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * postsPerPage, totalPosts)}
                  </span>{' '}
                  of <span className="font-medium">{totalPosts}</span> posts
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-label="Previous page"
                  >
                    <span className="sm:hidden">Prev</span>
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  
                  <div className="flex items-center px-2">
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.category
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating a new blog post.'}
            </p>
            <div className="mt-6">
              <Link
                to="/admin/blog/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-purple hover:bg-brand-purple-dark"
              >
                <Plus size={18} className="-ml-1 mr-2" />
                New Post
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
  
  // Navigation items
  const location = useLocation();
  const navItems = [
    { label: 'Blog Posts', icon: <FileText size={18} />, path: '/admin/blog' },
    { label: 'Categories', icon: <Tag size={18} />, path: '/admin/categories' },
    { label: 'Authors', icon: <Users size={18} />, path: '/admin/authors' },
    { label: 'Settings', icon: <Settings size={18} />, path: '/admin/settings' },
  ];

  return (
    <ErrorBoundary
      FallbackComponent={AdminErrorFallback}
      onReset={() => window.location.reload()}
    >
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header with navigation */}
        <header className="bg-white shadow-sm flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-brand-purple-dark mr-8">ZeroVacancy Admin</h1>
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-brand-purple-light/20 text-brand-purple-dark'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark transition-colors"
          >
            <Plus size={16} className="mr-2" />
            <span className="hidden sm:inline">New Post</span>
            <span className="sm:hidden">New</span>
          </Link>
          
          <button
            onClick={() => {
              // Clear auth tokens
              sessionStorage.removeItem('adminAccessToken');
              // Redirect to login
              navigate('/admin/login');
            }}
            className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span className="ml-2 hidden md:inline">Logout</span>
          </button>
        </div>
      </header>
      
      {/* Mobile navigation */}
      <div className="bg-white border-t border-b md:hidden p-2">
        <nav className="flex justify-between overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded ${
                location.pathname.startsWith(item.path)
                  ? 'text-brand-purple-dark'
                  : 'text-gray-700'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => {
              // Clear auth tokens
              sessionStorage.removeItem('adminAccessToken');
              // Redirect to login
              navigate('/admin/login');
            }}
            className="flex flex-col items-center p-2 text-gray-700"
          >
            <LogOut size={18} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </nav>
      </div>
      
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <AdminContent />
      </main>
      </div>
    </ErrorBoundary>
  );
};

export default BlogAdmin;